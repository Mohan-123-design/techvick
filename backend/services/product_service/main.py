import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from common.config import settings
from common.database import Database
from .routes import router

app = FastAPI(
    title="Techvick Computers - Product Service",
    version=settings.APP_VERSION,
    description="Manages product catalog, categories, and inventory",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup():
    await Database.connect()
    # Create indexes
    collection = Database.get_collection("products")
    await collection.create_index("category")
    await collection.create_index("brand")
    await collection.create_index("is_featured")
    await collection.create_index([("name", "text"), ("description", "text")])


@app.on_event("shutdown")
async def shutdown():
    await Database.disconnect()


app.include_router(router)


@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "product-service"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=settings.PRODUCT_SERVICE_PORT)
