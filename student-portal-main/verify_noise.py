import sys
from unittest.mock import AsyncMock, patch
from fastapi.testclient import TestClient

# Patch DB connection
with patch('backend.database.connect_db', new_callable=AsyncMock), \
     patch('backend.database.disconnect_db', new_callable=AsyncMock):
        
        from backend.main import app
        from backend.auth import get_current_user
        from prisma.models import User

        async def mock_get_current_user():
            return User(id=1, roll_number="test", full_name="Test", role="student", department="CS", password_hash="hash", attendance=0, created_at=None, updated_at=None)

        app.dependency_overrides[get_current_user] = mock_get_current_user
        client = TestClient(app)

        test_cases = [
            ("asdfghjkl", "non-genuine"),     # Gibberish
            ("unknownword123", "non-genuine"), # Unknown word
            ("pranav ko bhukhar hai", "genuine"), # Hinglish (should arguably be genuine if supported, or non-genuine if English-only)
            ("sysytem haaang", "non-genuine"), # Noisy
        ]

        # Use line buffering
        with open("verify_noise_results.log", "w", encoding="utf-8", buffering=1) as f:
            f.write("Testing Classification with Noise...\n")
            for reason, expected in test_cases:
                resp = client.post("/classify", json={"reason": reason})
                classification = resp.json()['classification']
                f.write(f"Input: '{reason}' -> Prediction: {classification} (Expected: {expected})\n")
