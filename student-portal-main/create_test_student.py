import sys
import os
sys.path.append(os.getcwd())
from prisma import Prisma
import asyncio
from backend.auth import get_password_hash

async def main():
    p = Prisma()
    await p.connect()
    roll = "student1"
    existing = await p.user.find_unique(where={'roll_number': roll})
    if not existing:
        await p.user.create(data={
            'roll_number': roll,
            'full_name': 'Test Student',
            'password_hash': get_password_hash('student123'),
            'role': 'student',
            'department': 'CS',
            'attendance': 90
        })
        print(f"Created student: {roll}")
    else:
        print(f"Student {roll} already exists")
    await p.disconnect()

if __name__ == "__main__":
    asyncio.run(main())
