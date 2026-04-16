import os
import subprocess
import sys

# DATABASE_URL provided by the user
db_url = "postgresql://neondb_owner:npg_iSw0hrW7cGDQ@ep-lively-river-ai2gtguu-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require"
os.environ["DATABASE_URL"] = db_url

try:
    print("Starting uvicorn server on 127.0.0.1:8001...")
    subprocess.run(
        [sys.executable, "-m", "uvicorn", "backend.main:app", "--host", "127.0.0.1", "--port", "8001", "--reload"],
        env=os.environ
    )
except KeyboardInterrupt:
    print("Server stopped.")
except Exception as e:
    print(f"An error occurred: {e}")
