import asyncio
from backend.database import connect_db, disconnect_db, prisma

async def main():
    await connect_db()
    
    # 1. Fix Subject Teacher Role
    print("Updating 'subject teacher' to 'teacher'...")
    user = await prisma.user.find_first(where={'roll_number': 'T101'})
    if user:
        from backend.auth import get_password_hash
        await prisma.user.update(
            where={'id': user.id},
            data={
                'role': 'teacher',
                'password_hash': get_password_hash('teacher123')
            }
        )
        print(f"Updated User {user.roll_number} role to 'teacher' and password to 'teacher123'")
    else:
        print("No user with roll T101 found.")
        
    # 2. Approve a leave for Student ID 2 (Ayush)
    print("Approving a leave for Student ID 2...")
    leave = await prisma.leave.find_first(where={'student_id': 2, 'status': 'pending'})
    if leave:
        await prisma.leave.update(
            where={'id': leave.id},
            data={'status': 'approved'}
        )
        print(f"Leaf {leave.id} (Reason: {leave.reason[:20]}...) marked as APPROVED")
    else:
        print("No pending leave found for Student ID 2.")

    await disconnect_db()

if __name__ == "__main__":
    asyncio.run(main())
