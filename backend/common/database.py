from motor.motor_asyncio import AsyncIOMotorClient
from .config import settings


class Database:
    """MongoDB async database connection manager."""

    client: AsyncIOMotorClient = None
    db = None

    @classmethod
    async def connect(cls):
        """Connect to MongoDB."""
        cls.client = AsyncIOMotorClient(settings.MONGODB_URI)
        cls.db = cls.client[settings.DATABASE_NAME]
        print(f"✅ Connected to MongoDB: {settings.DATABASE_NAME}")

    @classmethod
    async def disconnect(cls):
        """Disconnect from MongoDB."""
        if cls.client:
            cls.client.close()
            print("❌ Disconnected from MongoDB")

    @classmethod
    def get_db(cls):
        """Get database instance."""
        return cls.db

    @classmethod
    def get_collection(cls, collection_name: str):
        """Get a specific collection."""
        return cls.db[collection_name]


async def get_database():
    """Dependency for FastAPI to get database instance."""
    return Database.get_db()
