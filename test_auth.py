import asyncio
import httpx
from db_client import prisma

async def test_auth():
    # Start app in background or just test via httpx directly if running
    # Since app is not running, we can test via fastapi TestClient
    from fastapi.testclient import TestClient
    from api import app
    
    # We must ensure db is connected for TestClient
    await prisma.connect()
    try:
        client = TestClient(app)
        
        # Register
        res = client.post("/api/auth/register", json={
            "email": "test100@example.com",
            "password": "password123",
            "name": "Test User"
        })
        print("Register status:", res.status_code)
        print("Register response:", res.json())
        
        if res.status_code == 200:
            token = res.json()["access_token"]
            
            # Login
            res2 = client.post("/api/auth/login", data={
                "username": "test100@example.com",
                "password": "password123"
            })
            print("Login status:", res2.status_code)
            print("Login response:", res2.json())
            
            # Me
            res3 = client.get("/api/users/me", headers={"Authorization": f"Bearer {token}"})
            print("Me status:", res3.status_code)
            print("Me response:", res3.json())
            
    finally:
        await prisma.user.delete_many(where={"email": "test100@example.com"})
        await prisma.disconnect()

if __name__ == "__main__":
    asyncio.run(test_auth())
