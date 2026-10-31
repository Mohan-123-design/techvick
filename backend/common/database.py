import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from .config import settings


class Database:
    """MongoDB async database connection manager."""

    client: AsyncIOMotorClient = None
    db = None
    is_connected: bool = False

    @classmethod
    async def connect(cls):
        """Connect to MongoDB."""
        try:
            ca = certifi.where()
            cls.client = AsyncIOMotorClient(
                settings.MONGODB_URI,
                tlsCAFile=ca,
                serverSelectionTimeoutMS=5000,
                connectTimeoutMS=5000,
            )
            cls.db = cls.client[settings.DATABASE_NAME]
            # Quick ping to verify connectivity
            await cls.client.admin.command("ping")
            cls.is_connected = True
            print(f"✅ Connected to MongoDB: {settings.DATABASE_NAME}")
        except Exception as e:
            cls.is_connected = False
            print(f"⚠️ MongoDB connection warning: {e}")
            print("ℹ️ The server will continue running. Check your MongoDB Atlas Network Access and credentials.")

    @classmethod
    async def disconnect(cls):
        """Disconnect from MongoDB."""
        if cls.client:
            cls.client.close()
            cls.is_connected = False
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
