import sys
from unittest.mock import AsyncMock, patch
from fastapi.testclient import TestClient

# Patch connect_db to prevent real DB connection attempt during startup
with patch('backend.database.connect_db', new_callable=AsyncMock) as mock_connect:
    with patch('backend.database.disconnect_db', new_callable=AsyncMock) as mock_disconnect:
        
        # Import app after patching
        from backend.main import app
        from backend.auth import get_current_user
        from prisma.models import User

        # Mock current user dependency
        async def mock_get_current_user():
            # Create a dummy user object. Using a simple class or mock if Prisma model is strict
            # But Prisma models are Pydantic models usually
            return User(
                id=1, 
                roll_number="test_user", 
                full_name="Test User", 
                role="student", 
                department="CS",
                password_hash="hash",
                attendance=0,
                created_at=None,
                updated_at=None
            )

        app.dependency_overrides[get_current_user] = mock_get_current_user

        client = TestClient(app)

        def test_classify():
            payload = {"reason": "I am sick and need rest."}
            print(f"Testing /classify with payload: {payload}")
            
            response = client.post("/classify", json=payload)
            
            print(f"Status Code: {response.status_code}")
            print(f"Response: {response.json()}")

            if response.status_code == 200 and "classification" in response.json():
                print("SUCCESS: Classification endpoint works with new payload structure.")
            else:
                print("FAILURE: Classification endpoint failed.")
                sys.exit(1)

        if __name__ == "__main__":
            test_classify()
