import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from common.config import settings
from common.database import Database
from .routes import router

app = FastAPI(
    title="TechMart - Order Service",
    version=settings.APP_VERSION,
    description="Handles order placement, tracking, and management",
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
    collection = Database.get_collection("orders")
    await collection.create_index("user_id")
    await collection.create_index("order_number", unique=True)
    await collection.create_index("status")


@app.on_event("shutdown")
async def shutdown():
    await Database.disconnect()


app.include_router(router)


@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "order-service"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=settings.ORDER_SERVICE_PORT)
