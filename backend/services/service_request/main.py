import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from common.config import settings
from common.database import Database
from .routes import router

app = FastAPI(
    title="Techvick Computers - Service Request Service",
    version=settings.APP_VERSION,
    description="Handles service requests, repairs, site visits, and warranty",
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
    collection = Database.get_collection("service_requests")
    await collection.create_index("ticket_number", unique=True)
    await collection.create_index("status")
    await collection.create_index("service_type")
    await collection.create_index("customer_email")


@app.on_event("shutdown")
async def shutdown():
    await Database.disconnect()


app.include_router(router)


@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "service-request-service"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=settings.SERVICE_REQUEST_PORT)
