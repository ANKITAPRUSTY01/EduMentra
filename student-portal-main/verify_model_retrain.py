import sys
from unittest.mock import AsyncMock, patch
from fastapi.testclient import TestClient

# Patch connect_db to prevent real DB connection in test
with patch('backend.database.connect_db', new_callable=AsyncMock):
    with patch('backend.database.disconnect_db', new_callable=AsyncMock):
        
        from backend.main import app
        from backend.auth import get_current_user
        from prisma.models import User

        async def mock_get_current_user():
            return User(
                id=1, roll_number="test", full_name="Test", role="student", 
                department="CS", password_hash="hash", attendance=0, created_at=None, updated_at=None
            )

        app.dependency_overrides[get_current_user] = mock_get_current_user
        client = TestClient(app)

        test_cases = [
            ("I have a high fever and headache.", "genuine"),
            ("Going to watch a movie.", "non-genuine"),
            ("Family emergency.", "genuine"),
            ("Feeling lazy.", "non-genuine"),
            ("Traffic jam.", "non-genuine"),
            ("Sister's wedding.", "genuine"),
            ("Just want to sleep.", "non-genuine"),
            ("hi", "non-genuine"),
            ("test", "non-genuine"),
            ("...", "non-genuine")
        ]

        # Use line buffering to ensure file is written immediately
        with open("verification_results.log", "w", encoding="utf-8", buffering=1) as f:
            f.write("Testing Classification Model...\n")
            failed = False
            for reason, expected in test_cases:
                resp = client.post("/classify", json={"reason": reason})
                if resp.status_code != 200:
                    f.write(f"FAILED: API Error for '{reason}'\n")
                    failed = True
                    continue
                    
                prediction = resp.json()['classification']
                f.write(f"Reason: '{reason}' -> Prediction: {prediction} (Expected: {expected})\n")
                
                if prediction != expected:
                    f.write(f"  MISMATCH! Expected {expected} but got {prediction}\n")
                    failed = True
                else:
                    f.write(f"  MATCH: {prediction}\n")

            if failed:
                f.write("\nVerification FAILED: Model is not classifying correctly.\n")
                sys.exit(1)
            else:
                f.write("\nVerification PASSED: Model is classifying correctly.\n")
