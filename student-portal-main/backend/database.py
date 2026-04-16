from prisma import Prisma

prisma = Prisma()

async def connect_db():
    try:
        await prisma.connect()
        print("Connected to Prisma Database")
    except Exception as e:
        print(f"Error connecting to Prisma: {e}")

async def disconnect_db():
    if prisma.is_connected():
        await prisma.disconnect()
        print("Disconnected from Prisma Database")
