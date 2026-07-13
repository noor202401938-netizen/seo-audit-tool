import asyncio
from db_client import prisma

async def check():
    await prisma.connect()
    try:
        users = await prisma.user.find_many()
        print(f"Total users in DB: {len(users)}")
        for u in users:
            print(f"  - {u.email} (id: {u.id})")
    except Exception as e:
        print("Error:", e)
    finally:
        await prisma.disconnect()

if __name__ == "__main__":
    asyncio.run(check())
