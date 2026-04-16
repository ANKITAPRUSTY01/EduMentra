import asyncio
from backend.database import connect_db, disconnect_db, prisma

async def main():
    await connect_db()
    
    print("Reverting leaves to PENDING status...")
    
    # Revert ID 2 ("hi")
    await prisma.leave.update(
        where={'id': 2},
        data={'status': 'pending'}
    )
    print("Leave ID 2 reverted to PENDING")

    # Revert ID 3 ("pranav ko bhukhar hai")
    await prisma.leave.update(
        where={'id': 3},
        data={'status': 'pending'}
    )
    print("Leave ID 3 reverted to PENDING")

    await disconnect_db()

if __name__ == "__main__":
    asyncio.run(main())
