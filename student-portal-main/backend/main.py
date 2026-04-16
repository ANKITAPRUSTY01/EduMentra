from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Depends, status, File, UploadFile
from pydantic import BaseModel
from fastapi.security import OAuth2PasswordRequestForm
import joblib
import os
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware
from .database import prisma, connect_db, disconnect_db
from .auth import get_password_hash, verify_password, create_access_token, get_current_user
from datetime import timedelta
from prisma.models import User

# Lifespan context for DB connection
@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_db()
    yield
    await disconnect_db()

app = FastAPI(lifespan=lifespan)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load ML Model
model_path = "backend/leave_classification_model.pkl"
vectorizer_path = "backend/tfidf_vectorizer.pkl"
model = None
vectorizer = None

if os.path.exists(model_path) and os.path.exists(vectorizer_path):
    model = joblib.load(model_path)
    vectorizer = joblib.load(vectorizer_path)

class LeaveRequest(BaseModel):
    reason: str
    duration: str
    start_date: str = None

class LeaveUpdate(BaseModel):
    status: str
    classification: str = None

class Token(BaseModel):
    access_token: str
    token_type: str

@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await prisma.user.find_unique(where={'roll_number': form_data.username})
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": user.roll_number, "role": user.role}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me")
async def read_users_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "roll_number": current_user.roll_number,
        "full_name": current_user.full_name,
        "role": current_user.role,
        "department": current_user.department
    }

class ClassifyRequest(BaseModel):
    reason: str

@app.post("/classify")
async def classify_leave_endpoint(request: ClassifyRequest, current_user: User = Depends(get_current_user)):
    if not model or not vectorizer:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    text_features = vectorizer.transform([request.reason])
    
    # Check if the vector is empty (no known words found)
    if text_features.nnz == 0:
        return {"classification": "non-genuine"}
        
    prediction = model.predict(text_features)[0]
    return {"classification": prediction}

@app.get("/leaves")
async def get_leaves(current_user: User = Depends(get_current_user)):
    if current_user.role == "student":
        return await prisma.leave.find_many(where={"student_id": current_user.id}, include={"student": True})
    return await prisma.leave.find_many(include={"student": True})

@app.post("/leaves")
async def create_leave(request: LeaveRequest, current_user: User = Depends(get_current_user)):
    if current_user.role != "student":
        raise HTTPException(status_code=403, detail="Only students can apply for leaves")
    
    # Auto-classify
    classification = None
    if model and vectorizer:
        text_features = vectorizer.transform([request.reason])
        classification = model.predict(text_features)[0]

    leave = await prisma.leave.create(data={
        "student_id": current_user.id,
        "reason": request.reason,
        "duration": request.duration,
        "start_date": request.start_date,
        "classification": classification
    })
    return leave

@app.patch("/leaves/{leave_id}")
async def update_leave(leave_id: int, request: LeaveUpdate, current_user: User = Depends(get_current_user)):
    if current_user.role not in ["mentor", "admin"]:
        raise HTTPException(status_code=403, detail="Not authorized to update leave status")
    
    leave = await prisma.leave.update(
        where={"id": leave_id},
        data={
            "status": request.status,
            "classification": request.classification or None
        }
    )
    return leave

@app.post("/admin/upload-users")
async def upload_users(file: UploadFile = File(...), current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
         raise HTTPException(status_code=403, detail="Not authorized")
    
    try:
        df = pd.read_excel(file.file)
        # Expected columns: Role, FullName, RollNo, Password, Department, Attendance(opt)
        
        count = 0
        for _, row in df.iterrows():
            # Check if user exists
            existing = await prisma.user.find_unique(where={'roll_number': str(row['RollNo'])})
            if not existing:
                hashed_pw = get_password_hash(str(row['Password']))
                await prisma.user.create(data={
                    'role': row['Role'].lower(),
                    'full_name': row['FullName'],
                    'roll_number': str(row['RollNo']),
                    'password_hash': hashed_pw,
                    'department': row.get('Department', ''),
                    'attendance': int(row.get('Attendance', 0))
                })
                count += 1
        
        return {"message": f"Successfully processed. Added {count} new users."}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/admin/create-first-admin")
async def create_first_admin():
    # Helper to create an initial admin if none exists
    existing_admin = await prisma.user.find_unique(where={'roll_number': "admin"})
    if not existing_admin:
        await prisma.user.create(data={
            'roll_number': "admin",
            'full_name': "System Admin",
            'password_hash': get_password_hash("admin123"),
            'role': "admin"
        })
        return {"message": "Admin created (user/pass: admin/admin123)"}
    return {"message": "Admin already exists"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
