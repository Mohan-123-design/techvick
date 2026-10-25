import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))

import random
import string
from fastapi import APIRouter, HTTPException, Query, status
from typing import Optional
from bson import ObjectId
from common.database import Database
from common.utils import serialize_doc, serialize_docs, utc_now, build_pagination, SERVICE_TYPES
from .schemas import ServiceRequestCreate, WarrantyCheckRequest

router = APIRouter(prefix="/api/services", tags=["Service Requests"])

COLLECTION = "service_requests"


def generate_ticket_number():
    """Generate ticket number like SRV-XXXXXX."""
    suffix = ''.join(random.choices(string.digits, k=6))
    return f"SRV-{suffix}"


@router.get("/types")
async def get_service_types():
    """Get all available service types."""
    return {"service_types": SERVICE_TYPES}


@router.post("/request", status_code=status.HTTP_201_CREATED)
async def create_service_request(request: ServiceRequestCreate):
    """Submit a new service request (no login required)."""
    collection = Database.get_collection(COLLECTION)

    # Validate: site visits require address
    if request.service_type == "site_visit" and not request.address:
        raise HTTPException(
            status_code=400,
            detail="Address is required for site visit services",
        )

    now = utc_now()
    doc = {
        "ticket_number": generate_ticket_number(),
        **request.model_dump(),
        "status": "submitted",
        "estimated_cost": None,
        "assigned_technician": None,
        "notes": [],
        "created_at": now,
        "updated_at": now,
    }

    result = await collection.insert_one(doc)
    doc["_id"] = result.inserted_id

    return {
        "service_request": serialize_doc(doc),
        "message": f"Service request submitted! Your ticket number is {doc['ticket_number']}. We'll contact you within 2 hours.",
    }


@router.get("/track/{ticket_number}")
async def track_service_request(ticket_number: str):
    """Track a service request by ticket number."""
    collection = Database.get_collection(COLLECTION)
    request = await collection.find_one({"ticket_number": ticket_number.upper()})
    if not request:
        raise HTTPException(status_code=404, detail="Service request not found")
    result = serialize_doc(request)
    # Hide sensitive info
    result.pop("customer_email", None)
    return {"service_request": result}


@router.get("/requests")
async def get_service_requests(
    status_filter: Optional[str] = None,
    service_type: Optional[str] = None,
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=10, ge=1, le=50),
):
    """Get service requests (admin endpoint)."""
    collection = Database.get_collection(COLLECTION)
    query = {}
    if status_filter:
        query["status"] = status_filter
    if service_type:
        query["service_type"] = service_type

    total = await collection.count_documents(query)
    skip = (page - 1) * limit
    cursor = (
        collection.find(query)
        .sort("created_at", -1)
        .skip(skip)
        .limit(limit)
    )
    requests = await cursor.to_list(length=limit)

    return {
        "service_requests": serialize_docs(requests),
        "pagination": build_pagination(page, limit, total),
    }


@router.patch("/requests/{request_id}/status")
async def update_request_status(request_id: str, new_status: str):
    """Update service request status (admin)."""
    collection = Database.get_collection(COLLECTION)
    valid_statuses = ["submitted", "reviewed", "assigned", "in_progress", "completed", "cancelled"]
    if new_status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {valid_statuses}")

    try:
        result = await collection.find_one_and_update(
            {"_id": ObjectId(request_id)},
            {"$set": {"status": new_status, "updated_at": utc_now()}},
            return_document=True,
        )
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid request ID")

    if not result:
        raise HTTPException(status_code=404, detail="Service request not found")
    return {"service_request": serialize_doc(result), "message": f"Status updated to {new_status}"}


@router.post("/warranty/check")
async def check_warranty(data: WarrantyCheckRequest):
    """Check warranty status for a product."""
    collection = Database.get_collection("warranty_records")
    record = await collection.find_one({"product_serial": data.product_serial})

    if not record:
        return {
            "status": "not_found",
            "message": "No warranty record found. Please visit our store with your purchase invoice.",
        }

    return {
        "status": "found",
        "warranty": serialize_doc(record),
    }
