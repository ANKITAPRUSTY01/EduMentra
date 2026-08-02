import streamlit as st
import pandas as pd
import joblib
import numpy as np

# --- 1. Load ML Brain & Dataset ---
@st.cache_resource
def load_assets():
    # Loading the files we saw in your directory
    model = joblib.load('risk_model.joblib')
    scaler = joblib.load('scaler.joblib')
    le = joblib.load('label_encoder.joblib')
    return model, scaler, le

def load_data():
    return pd.read_csv('mentor_mentee_ml_dataset.csv')

# --- 2. Page Configuration ---
st.set_page_config(page_title="Tutor-Mentee System", layout="wide")
st.title("🎓 Mentorship Risk Management System")

# Load assets
try:
    model, scaler, le = load_assets()
    df = load_data()
    
    # --- 3. Main Dashboard ---
    st.subheader("📊 Existing Mentee Records")
    st.write("This table shows all current mentees and their risk levels as recorded in your dataset.")
    
    # Adding a search box to find specific roll numbers
    search = st.text_input("Search Roll No:", "")
    if search:
        display_df = df[df['roll_no'].astype(str).contains(search)]
    else:
        display_df = df
        
    st.dataframe(display_df, use_container_width=True)

    # --- 4. Prediction Section ---
    st.divider()
    st.subheader("🔍 New Assessment (Real-Time Prediction)")
    st.info("Fill in the details below to predict the risk level for a new student entry.")

    with st.form("prediction_form"):
        col1, col2, col3 = st.columns(3)
        
        with col1:
            attn = st.slider("Attendance %", 0, 100, 75)
            cgpa = st.number_input("CGPA", 0.0, 10.0, 7.0)
            backlogs = st.number_input("Backlogs", 0, 10, 0)
            
        with col2:
            dc = st.number_input("Disciplinary Cases", 0, 5, 0)
            leaves = st.number_input("Leaves Taken", 0, 20, 2)
            late = st.number_input("Late Night Entries", 0, 20, 1)
            
        with col3:
            missed = st.number_input("Missed Consultations", 0, 10, 0)
            stress = st.slider("Stress Level (1-10)", 1, 10, 5)
            sentiment = st.slider("Sentiment Score", 0.0, 1.0, 0.5)
            
        submit = st.form_submit_button("Predict & Save Result")

    if submit:
        # Prepare data for model
        input_data = np.array([[attn, cgpa, backlogs, dc, leaves, late, missed, stress, sentiment]])
        input_scaled = scaler.transform(input_data)
        
        # Get Prediction
        pred_num = model.predict(input_scaled)
        risk_label = le.inverse_transform(pred_num)[0]
        
        # Display Result with Color Coding
        if risk_label == 'High':
            st.error(f"### RESULT: {risk_label} RISK 🚨")
            st.write("**Tutor Action:** Schedule an emergency 1-on-1 session immediately.")
        elif risk_label == 'Medium':
            st.warning(f"### RESULT: {risk_label} RISK ⚠️")
            st.write("**Tutor Action:** Send a check-in email and monitor attendance next week.")
        else:
            st.success(f"### RESULT: {risk_label} RISK ✅")
            st.write("**Tutor Action:** No intervention needed. Send encouragement.")

except FileNotFoundError:
    st.error("Error: Could not find required files. Please ensure app.py, the .joblib files, and the .csv are in the same folder.")