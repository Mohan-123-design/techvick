import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))

import random
import string
from fastapi import APIRouter, HTTPException, Query, status, Depends
from typing import Optional
from bson import ObjectId
from pydantic import BaseModel
from common.database import Database
from common.auth import require_admin
from common.utils import serialize_doc, serialize_docs, utc_now, build_pagination, SERVICE_TYPES
from .schemas import ServiceRequestCreate, WarrantyCheckRequest, ServiceCatalogCreate, ServiceCatalogUpdate

router = APIRouter(prefix="/api/services", tags=["Service Requests"])

COLLECTION = "service_requests"
CATALOG_COLLECTION = "services_catalog"


def generate_ticket_number():
    """Generate ticket number like SRV-XXXXXX."""
    suffix = ''.join(random.choices(string.digits, k=6))
    return f"SRV-{suffix}"


class TechnicianAssign(BaseModel):
    technician_name: str
    technician_phone: Optional[str] = None
    estimated_cost: Optional[float] = None
    scheduled_slot: Optional[str] = None
    notes: Optional[str] = None


class ServiceTicketAdminCreate(BaseModel):
    customer_name: str
    customer_phone: str
    customer_email: Optional[str] = ""
    service_mode: str = "in_store"  # in_store, site_visit
    device_type: str = "laptop"  # laptop, desktop, imac, printer, cctv, networking
    brand: str = ""
    model: str = ""
    issue_category: str = "general_repair"
    issue_description: str = ""
    urgency: str = "standard"  # standard, urgent
    address: Optional[str] = ""
    preferred_date: Optional[str] = None
    preferred_time_slot: Optional[str] = "10:00 AM - 01:00 PM"
    estimated_cost: Optional[float] = 0.0
    status: str = "submitted"  # submitted, assigned, in_progress, completed, cancelled
    assigned_technician: Optional[str] = None
    technician_phone: Optional[str] = None
    notes: Optional[str] = None


class ServiceTicketAdminUpdate(BaseModel):
    customer_name: Optional[str] = None
    customer_phone: Optional[str] = None
    customer_email: Optional[str] = None
    service_mode: Optional[str] = None
    device_type: Optional[str] = None
    brand: Optional[str] = None
    model: Optional[str] = None
    issue_description: Optional[str] = None
    status: Optional[str] = None
    estimated_cost: Optional[float] = None
    assigned_technician: Optional[str] = None
    technician_phone: Optional[str] = None
    address: Optional[str] = None
    notes: Optional[str] = None


class WarrantyClaimCreate(BaseModel):
    serial_number: str
    customer_name: Optional[str] = "Customer"
    customer_phone: str
    customer_email: Optional[str] = ""
    fault_description: str
    claim_type: str = "doorstep_pickup"  # doorstep_pickup, store_dropoff
    pickup_address: Optional[str] = ""


class WarrantyRecordCreate(BaseModel):
    serial_number: str
    product_name: str
    category: str
    customer_name: str
    customer_phone: str
    purchase_date: str
    expiry_date: str
    coverage: Optional[str] = "Standard Manufacturer & Store Warranty"
    store_location: Optional[str] = "Techvick Computers - Tatabad Main Store"
    invoice_number: Optional[str] = ""


@router.get("/types")
async def get_service_types():
    """Get all available service types."""
    return {"service_types": SERVICE_TYPES}


# ========================================================
# SERVICES CATALOG (FULL CRUD BY ADMIN - 200% FOCUS)
# ========================================================
@router.get("/catalog")
async def get_services_catalog(
    category: Optional[str] = None,
    include_inactive: bool = False,
):
    """Get all service catalog offerings."""
    collection = Database.get_collection(CATALOG_COLLECTION)
    query = {}
    if not include_inactive:
        query["is_active"] = True
    if category and category != "all":
        query["category"] = category

    cursor = collection.find(query).sort("sort_order", 1)
    services = await cursor.to_list(length=100)
    return {"services": serialize_docs(services), "total": len(services)}


@router.post("/catalog", status_code=status.HTTP_201_CREATED)
async def create_service_catalog_item(
    item: ServiceCatalogCreate,
    current_admin: dict = Depends(require_admin),
):
    """Admin endpoint: Add a new service offering to the catalog."""
    collection = Database.get_collection(CATALOG_COLLECTION)
    now = utc_now()
    doc = {
        **item.model_dump(),
        "created_at": now,
        "updated_at": now,
    }
    result = await collection.insert_one(doc)
    doc["_id"] = result.inserted_id
    doc["id"] = str(result.inserted_id)
    return {"service": serialize_doc(doc), "message": f'Service "{item.title}" added to catalog!'}


@router.put("/catalog/{service_id}")
async def update_service_catalog_item(
    service_id: str,
    item: ServiceCatalogUpdate,
    current_admin: dict = Depends(require_admin),
):
    """Admin endpoint: Update an existing service offering."""
    collection = Database.get_collection(CATALOG_COLLECTION)
    update_data = {k: v for k, v in item.model_dump().items() if v is not None}
    update_data["updated_at"] = utc_now()

    try:
        id_conds = [{"_id": service_id}, {"id": service_id}]
        if ObjectId.is_valid(service_id):
            id_conds.append({"_id": ObjectId(service_id)})
        result = await collection.find_one_and_update(
            {"$or": id_conds},
            {"$set": update_data},
            return_document=True,
        )
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid service ID")

    if not result:
        raise HTTPException(status_code=404, detail="Service offering not found")

    return {"service": serialize_doc(result), "message": f'Service updated successfully!'}


@router.delete("/catalog/{service_id}")
async def delete_service_catalog_item(
    service_id: str,
    current_admin: dict = Depends(require_admin),
):
    """Admin endpoint: Delete a service offering from catalog."""
    collection = Database.get_collection(CATALOG_COLLECTION)
    try:
        id_conds = [{"_id": service_id}, {"id": service_id}]
        if ObjectId.is_valid(service_id):
            id_conds.append({"_id": ObjectId(service_id)})
        result = await collection.find_one_and_delete({"$or": id_conds})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid service ID")

    if not result:
        raise HTTPException(status_code=404, detail="Service offering not found")

    return {"message": "Service offering removed successfully"}


@router.post("/request", status_code=status.HTTP_201_CREATED)
async def create_service_request(request: ServiceRequestCreate):
    """Submit a new service request / site visit (accessible by all customers)."""
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
        "estimated_cost": getattr(request, "estimated_cost", None) or 499.0,
        "assigned_technician": None,
        "technician_phone": None,
        "notes": [],
        "created_at": now,
        "updated_at": now,
    }

    result = await collection.insert_one(doc)
    doc["_id"] = result.inserted_id

    return {
        "service_request": serialize_doc(doc),
        "ticket_number": doc["ticket_number"],
        "message": f"Service request submitted! Your ticket number is {doc['ticket_number']}. We'll contact you within 2 hours.",
    }


@router.get("/track/{ticket_number}")
async def track_service_request(ticket_number: str):
    """Track a service request by ticket number (public for customers)."""
    collection = Database.get_collection(COLLECTION)
    request = await collection.find_one({"ticket_number": ticket_number.upper()})
    if not request:
        raise HTTPException(status_code=404, detail="Service request not found")
    result = serialize_doc(request)
    result.pop("customer_email", None)
    return {"service_request": result}


@router.get("/requests")
async def get_service_requests(
    status_filter: Optional[str] = None,
    service_type: Optional[str] = None,
    search: Optional[str] = None,
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=20, ge=1, le=100),
    current_admin: dict = Depends(require_admin),
):
    """Admin endpoint: View all service & site visit bookings."""
    collection = Database.get_collection(COLLECTION)
    query = {}
    if status_filter and status_filter != "all":
        query["status"] = status_filter
    if service_type and service_type != "all":
        query["service_type"] = service_type
    if search:
        query["$or"] = [
            {"ticket_number": {"$regex": search, "$options": "i"}},
            {"customer_name": {"$regex": search, "$options": "i"}},
            {"customer_phone": {"$regex": search, "$options": "i"}},
            {"device_type": {"$regex": search, "$options": "i"}},
        ]

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
async def update_request_status(
    request_id: str,
    new_status: str,
    current_admin: dict = Depends(require_admin),
):
    """Admin endpoint: Update service request status."""
    collection = Database.get_collection(COLLECTION)
    valid_statuses = ["submitted", "reviewed", "assigned", "in_progress", "completed", "cancelled"]
    if new_status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {valid_statuses}")

    try:
        if ObjectId.is_valid(request_id):
            query = {"_id": ObjectId(request_id)}
        else:
            query = {"ticket_number": request_id}

        result = await collection.find_one_and_update(
            query,
            {"$set": {"status": new_status, "updated_at": utc_now()}},
            return_document=True,
        )
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid request ID")

    if not result:
        raise HTTPException(status_code=404, detail="Service request not found")
    return {"service_request": serialize_doc(result), "message": f"Status updated to {new_status}"}


@router.patch("/requests/{request_id}/assign")
async def assign_technician(
    request_id: str,
    assignment: TechnicianAssign,
    current_admin: dict = Depends(require_admin),
):
    """Admin endpoint: Assign technician, schedule, and notes to a service request."""
    collection = Database.get_collection(COLLECTION)
    try:
        if ObjectId.is_valid(request_id):
            query = {"_id": ObjectId(request_id)}
        else:
            query = {"ticket_number": request_id}

        update_dict = {
            "assigned_technician": assignment.technician_name,
            "status": "assigned",
            "updated_at": utc_now(),
        }
        if assignment.technician_phone:
            update_dict["technician_phone"] = assignment.technician_phone
        if assignment.estimated_cost is not None:
            update_dict["estimated_cost"] = assignment.estimated_cost
        if assignment.scheduled_slot:
            update_dict["scheduled_slot"] = assignment.scheduled_slot

        push_dict = {}
        if assignment.notes:
            push_dict["notes"] = f"[{utc_now().strftime('%Y-%m-%d %H:%M')}] {assignment.notes}"

        ops = {"$set": update_dict}
        if push_dict:
            ops["$push"] = push_dict

        result = await collection.find_one_and_update(
            query,
            ops,
            return_document=True,
        )
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid request ID")

    if not result:
        raise HTTPException(status_code=404, detail="Service request not found")
    return {"service_request": serialize_doc(result), "message": "Technician assigned successfully"}


@router.post("/requests", status_code=status.HTTP_201_CREATED)
async def admin_create_service_ticket(
    ticket: ServiceTicketAdminCreate,
    current_admin: dict = Depends(require_admin),
):
    """Admin endpoint: Manually create a walk-in or phone service ticket."""
    collection = Database.get_collection(COLLECTION)
    now = utc_now()
    ticket_num = generate_ticket_number()
    doc = {
        "ticket_number": ticket_num,
        **ticket.model_dump(),
        "service_type": ticket.service_mode,
        "notes": [f"[{now.strftime('%Y-%m-%d %H:%M')}] {ticket.notes}"] if ticket.notes else [],
        "created_at": now,
        "updated_at": now,
    }
    result = await collection.insert_one(doc)
    doc["_id"] = result.inserted_id
    return {"service_request": serialize_doc(doc), "message": f"Service ticket {ticket_num} created successfully!"}


@router.put("/requests/{request_id}")
async def admin_update_service_ticket(
    request_id: str,
    update_data: ServiceTicketAdminUpdate,
    current_admin: dict = Depends(require_admin),
):
    """Admin endpoint: Update service ticket details."""
    collection = Database.get_collection(COLLECTION)
    try:
        if ObjectId.is_valid(request_id):
            query = {"_id": ObjectId(request_id)}
        else:
            query = {"ticket_number": request_id}

        fields = {k: v for k, v in update_data.model_dump().items() if v is not None}
        fields["updated_at"] = utc_now()
        if "service_mode" in fields:
            fields["service_type"] = fields["service_mode"]

        result = await collection.find_one_and_update(
            query,
            {"$set": fields},
            return_document=True,
        )
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid request ID")

    if not result:
        raise HTTPException(status_code=404, detail="Service request not found")
    return {"service_request": serialize_doc(result), "message": "Service ticket updated successfully"}


@router.delete("/requests/{request_id}")
async def admin_delete_service_ticket(
    request_id: str,
    current_admin: dict = Depends(require_admin),
):
    """Admin endpoint: Delete a service request ticket."""
    collection = Database.get_collection(COLLECTION)
    try:
        id_conds = [{"ticket_number": request_id}, {"id": request_id}]
        if ObjectId.is_valid(request_id):
            id_conds.append({"_id": ObjectId(request_id)})
        result = await collection.find_one_and_delete({"$or": id_conds})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid request ID")

    if not result:
        raise HTTPException(status_code=404, detail="Service request not found")
    return {"message": f"Service ticket {request_id} removed successfully"}


# -------------------------------------------------------------
# Warranty Endpoints (End user check/claim & Admin records)
# -------------------------------------------------------------
@router.post("/warranty/check")
async def check_warranty(data: WarrantyCheckRequest):
    """Customer endpoint: Check warranty status for a product."""
    collection = Database.get_collection("warranty_records")
    query_str = (data.product_serial or "").strip().upper()

    record = await collection.find_one({
        "$or": [
            {"serial_number": query_str},
            {"invoice_number": query_str},
            {"product_serial": query_str},
            {"customer_phone": query_str},
        ]
    })

    if not record:
        return {
            "found": False,
            "status": "not_found",
            "message": "No warranty record found. Please verify your invoice number or visit our store.",
        }

    return {
        "found": True,
        "status": "found",
        **serialize_doc(record),
    }


@router.post("/warranty/claim", status_code=status.HTTP_201_CREATED)
async def submit_warranty_claim(claim: WarrantyClaimCreate):
    """Customer endpoint: Submit a warranty repair/replacement claim."""
    collection = Database.get_collection("warranty_claims")
    claim_id = f"WCL-{random.randint(100000, 999999)}"
    doc = {
        "claim_id": claim_id,
        **claim.model_dump(),
        "status": "pending",
        "created_at": utc_now(),
        "updated_at": utc_now(),
    }
    await collection.insert_one(doc)
    return {
        "success": True,
        "claim_id": claim_id,
        "message": f"Warranty claim {claim_id} registered successfully!",
    }


@router.get("/warranty/claims")
async def get_warranty_claims_admin(
    status: Optional[str] = None,
    current_admin: dict = Depends(require_admin),
):
    """Admin endpoint: View all submitted warranty claims."""
    collection = Database.get_collection("warranty_claims")
    query = {}
    if status and status != "all":
        query["status"] = status
    claims = await collection.find(query).sort("created_at", -1).to_list(length=100)
    return {"claims": serialize_docs(claims), "total": len(claims)}


@router.patch("/warranty/claims/{claim_id}/status")
async def update_warranty_claim_status_admin(
    claim_id: str,
    new_status: str,
    notes: Optional[str] = None,
    current_admin: dict = Depends(require_admin),
):
    """Admin endpoint: Update warranty claim resolution status."""
    collection = Database.get_collection("warranty_claims")
    valid = ["pending", "approved", "in_inspection", "replacement_issued", "rejected", "resolved"]
    if new_status not in valid:
        raise HTTPException(status_code=400, detail=f"Invalid status. Choose from: {valid}")

    set_dict = {"status": new_status, "updated_at": utc_now()}
    if notes:
        set_dict["resolution_notes"] = notes

    result = await collection.find_one_and_update(
        {"$or": [{"claim_id": claim_id}, {"_id": ObjectId(claim_id) if ObjectId.is_valid(claim_id) else None}]},
        {"$set": set_dict},
        return_document=True,
    )
    if not result:
        raise HTTPException(status_code=404, detail="Claim not found")
    return {"claim": serialize_doc(result), "message": f"Claim status updated to {new_status}"}


@router.get("/warranty/records")
async def get_warranty_records_admin(
    search: Optional[str] = None,
    current_admin: dict = Depends(require_admin),
):
    """Admin endpoint: View all registered product warranty records."""
    collection = Database.get_collection("warranty_records")
    query = {}
    if search:
        query["$or"] = [
            {"serial_number": {"$regex": search, "$options": "i"}},
            {"customer_name": {"$regex": search, "$options": "i"}},
            {"product_name": {"$regex": search, "$options": "i"}},
            {"invoice_number": {"$regex": search, "$options": "i"}},
        ]
    records = await collection.find(query).sort("created_at", -1).to_list(length=100)
    return {"records": serialize_docs(records), "total": len(records)}


@router.post("/warranty/record", status_code=status.HTTP_201_CREATED)
async def create_warranty_record_admin(
    record: WarrantyRecordCreate,
    current_admin: dict = Depends(require_admin),
):
    """Admin endpoint: Register a new warranty record."""
    collection = Database.get_collection("warranty_records")
    now = utc_now()
    doc = {
        **record.model_dump(),
        "status": "Active",
        "created_at": now,
        "updated_at": now,
    }
    result = await collection.insert_one(doc)
    doc["_id"] = result.inserted_id
    return {"record": serialize_doc(doc), "message": "Warranty record registered successfully"}
