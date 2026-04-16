from prisma import Prisma
import asyncio
import sys
import os

sys.path.append(os.getcwd())

# DATABASE_URL for Prisma
db_url = "postgresql://neondb_owner:npg_iSw0hrW7cGDQ@ep-lively-river-ai2gtguu-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require"
os.environ["DATABASE_URL"] = db_url

async def main():
    p = Prisma()
    await p.connect()
    users = await p.user.find_many()
    print("Users in DB:")
    for u in users:
        print(f"Roll: {u.roll_number}, Role: {u.role}, Name: {u.full_name}")
    await p.disconnect()

if __name__ == "__main__":
    asyncio.run(main())
