import asyncio
from backend.database import connect_db, disconnect_db, prisma

async def main():
    await connect_db()
    
    with open("debug_data.log", "w", encoding="utf-8") as f:
        f.write("\n--- USERS ---\n")
        users = await prisma.user.find_many()
        for u in users:
            f.write(f"ID: {u.id}, Roll: {u.roll_number}, Role: {u.role}, Name: {u.full_name}\n")
            
        f.write("\n--- LEAVES ---\n")
        leaves = await prisma.leave.find_many()
        for l in leaves:
            f.write(f"ID: {l.id}, StudentID: {l.student_id}, Status: '{l.status}', Reason: {l.reason[:50]}...\n")

    await disconnect_db()

if __name__ == "__main__":
    asyncio.run(main())
