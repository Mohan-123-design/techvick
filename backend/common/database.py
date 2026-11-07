import certifi
import json
import os
from datetime import datetime, timezone
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorClient
from .config import settings

# Local storage path for offline fallback
LOCAL_DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")
os.makedirs(LOCAL_DATA_DIR, exist_ok=True)


class LocalFallbackCursor:
    """Async cursor simulation for local collection queries."""

    def __init__(self, docs):
        self._docs = docs

    def sort(self, field, direction=1):
        reverse = direction == -1
        try:
            self._docs = sorted(
                self._docs,
                key=lambda x: (x.get(field) is None, x.get(field, "")),
                reverse=reverse,
            )
        except Exception:
            pass
        return self

    def skip(self, n):
        self._docs = self._docs[n:]
        return self

    def limit(self, n):
        self._docs = self._docs[:n]
        return self

    async def to_list(self, length=100):
        return self._docs[:length]


class LocalFallbackCollection:
    """Resilient local collection fallback using JSON files when MongoDB is offline."""

    def __init__(self, name: str):
        self.name = name
        self.file_path = os.path.join(LOCAL_DATA_DIR, f"{name}.json")
        self._ensure_file()

    def _ensure_file(self):
        if not os.path.exists(self.file_path):
            with open(self.file_path, "w", encoding="utf-8") as f:
                json.dump([], f)

    def _read_all(self):
        try:
            with open(self.file_path, "r", encoding="utf-8") as f:
                data = json.load(f)
                # Convert string IDs back to ObjectId if possible
                for item in data:
                    if "_id" in item and isinstance(item["_id"], str):
                        try:
                            item["_id"] = ObjectId(item["_id"])
                        except Exception:
                            pass
                return data
        except Exception:
            return []

    def _save_all(self, docs):
        serializable = []
        for doc in docs:
            item = dict(doc)
            if "_id" in item:
                item["_id"] = str(item["_id"])
            for k, v in item.items():
                if isinstance(v, datetime):
                    item[k] = v.isoformat()
            serializable.append(item)
        with open(self.file_path, "w", encoding="utf-8") as f:
            json.dump(serializable, f, indent=2, default=str)

    def _matches(self, doc, query):
        if not query:
            return True
        for k, v in query.items():
            if k == "$or":
                if not any(self._matches(doc, cond) for cond in v):
                    return False
            elif isinstance(v, dict):
                val = doc.get(k)
                if "$regex" in v:
                    pattern = v["$regex"].lower()
                    if pattern not in str(val or "").lower():
                        return False
                if "$gte" in v and (val is None or val < v["$gte"]):
                    return False
                if "$lte" in v and (val is None or val > v["$lte"]):
                    return False
                if "$in" in v and val not in v["$in"]:
                    return False
            elif doc.get(k) != v:
                return False
        return True

    async def count_documents(self, query):
        docs = self._read_all()
        return sum(1 for d in docs if self._matches(d, query))

    def find(self, query=None):
        docs = self._read_all()
        filtered = [d for d in docs if self._matches(d, query or {})]
        return LocalFallbackCursor(filtered)

    async def find_one(self, query):
        docs = self._read_all()
        for d in docs:
            if self._matches(d, query):
                return d
        return None

    async def insert_one(self, document):
        docs = self._read_all()
        doc_copy = dict(document)
        if "_id" not in doc_copy:
            doc_copy["_id"] = ObjectId()
        docs.append(doc_copy)
        self._save_all(docs)

        class Result:
            inserted_id = doc_copy["_id"]

        return Result()

    async def insert_many(self, documents):
        docs = self._read_all()
        ids = []
        for d in documents:
            doc_copy = dict(d)
            if "_id" not in doc_copy:
                doc_copy["_id"] = ObjectId()
            docs.append(doc_copy)
            ids.append(doc_copy["_id"])
        self._save_all(docs)

        class Result:
            inserted_ids = ids

        return Result()

    async def update_one(self, query, update):
        docs = self._read_all()
        matched = False
        for i, d in enumerate(docs):
            if self._matches(d, query):
                matched = True
                set_vals = update.get("$set", {})
                d.update(set_vals)
                docs[i] = d
                break
        if matched:
            self._save_all(docs)

        class Result:
            matched_count = 1 if matched else 0
            modified_count = 1 if matched else 0

        return Result()

    async def delete_one(self, query):
        docs = self._read_all()
        init_len = len(docs)
        docs = [d for d in docs if not self._matches(d, query)]
        self._save_all(docs)

        class Result:
            deleted_count = init_len - len(docs)

        return Result()

    async def create_index(self, *args, **kwargs):
        pass


class LocalFallbackDatabase:
    """Wrapper that resolves collection subscripts when running in local offline fallback."""

    def __getitem__(self, collection_name: str):
        return Database.get_collection(collection_name)


class Database:
    """MongoDB async connection manager with resilient offline local fallback."""

    client: AsyncIOMotorClient = None
    db = None
    is_connected: bool = False
    _fallback_collections = {}

    @classmethod
    async def connect(cls):
        """Connect to MongoDB with fast timeout and transparent local fallback."""
        try:
            ca = certifi.where()
            cls.client = AsyncIOMotorClient(
                settings.MONGODB_URI,
                tlsCAFile=ca,
                serverSelectionTimeoutMS=7000,
                connectTimeoutMS=7000,
            )
            cls.db = cls.client[settings.DATABASE_NAME]
            await cls.client.admin.command("ping")
            cls.is_connected = True
            print(f"✅ Connected to MongoDB: {settings.DATABASE_NAME}")
        except Exception as e:
            cls.is_connected = False
            cls.db = None
            print(f"⚠️ MongoDB remote connection offline/timeout: {e}")
            print(f"🛡️ Transparent Local Storage Fallback activated at {LOCAL_DATA_DIR}")

    @classmethod
    async def disconnect(cls):
        if cls.client:
            cls.client.close()
            cls.is_connected = False
            print("❌ Disconnected from MongoDB")

    @classmethod
    def get_db(cls):
        if cls.is_connected and cls.db is not None:
            return cls.db
        return LocalFallbackDatabase()

    @classmethod
    def get_collection(cls, collection_name: str):
        if cls.is_connected and cls.db is not None:
            return cls.db[collection_name]

        # Use resilient local fallback collection
        if collection_name not in cls._fallback_collections:
            cls._fallback_collections[collection_name] = LocalFallbackCollection(collection_name)
        return cls._fallback_collections[collection_name]


async def get_database():
    return Database.get_db()
