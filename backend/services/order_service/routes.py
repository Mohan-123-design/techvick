import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))

import random
import string
from fastapi import APIRouter, HTTPException, Depends, Query, status
from typing import Optional
from bson import ObjectId
from common.database import Database
from common.auth import get_current_user, get_optional_user, require_admin
from common.utils import serialize_doc, serialize_docs, utc_now, build_pagination
from .schemas import OrderCreate, OrderStatusUpdate

router = APIRouter(prefix="/api/orders", tags=["Orders"])

COLLECTION = "orders"


def generate_order_number():
    """Generate unique order number like TM-2026-XXXX."""
    from datetime import datetime
    year = datetime.now().year
    suffix = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
    return f"TM-{year}-{suffix}"


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_order(
    order: OrderCreate,
    current_user: Optional[dict] = Depends(get_optional_user),
):
    """Place a new order (accessible by logged-in customers or guests)."""
    collection = Database.get_collection(COLLECTION)

    # Calculate totals
    subtotal = sum(item.price * item.quantity for item in order.items)
    tax = round(subtotal * 0.18, 2)  # 18% GST (already inclusive or breakdown)
    total = order.total_amount if order.total_amount is not None else subtotal

    now = utc_now()
    doc = {
        "order_number": generate_order_number(),
        "user_id": current_user["sub"] if current_user else None,
        "customer_name": order.customer_name or (current_user.get("email") if current_user else "Customer"),
        "customer_phone": order.customer_phone or order.phone,
        "customer_email": order.customer_email or (current_user.get("email") if current_user else ""),
        "items": [
            {
                "product_id": item.product_id,
                "name": item.name or item.product_name or "Hardware Product",
                "price": item.price,
                "quantity": item.quantity,
                "warranty_months": item.warranty_months or 24,
            }
            for item in order.items
        ],
        "subtotal": subtotal,
        "tax": tax,
        "total": total,
        "status": "pending",
        "fulfillment_type": order.fulfillment_type or "pickup",
        "shipping_address": order.delivery_address or order.shipping_address or "In-Store Pickup",
        "city": order.city or "Local",
        "pincode": order.pincode,
        "payment_method": order.payment_method or "cod",
        "notes": order.notes,
        "created_at": now,
        "updated_at": now,
    }

    result = await collection.insert_one(doc)
    doc["_id"] = result.inserted_id
    return {
        "order": serialize_doc(doc),
        "order_id": doc["order_number"],
        "message": "Order placed successfully!",
    }


@router.get("/all")
async def get_all_orders_admin(
    status: Optional[str] = None,
    search: Optional[str] = None,
    fulfillment: Optional[str] = None,
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=20, ge=1, le=100),
    current_admin: dict = Depends(require_admin),
):
    """Admin endpoint: Get all customer orders with filtering, search & pagination."""
    collection = Database.get_collection(COLLECTION)
    query = {}
    if status and status != "all":
        query["status"] = status
    if fulfillment and fulfillment != "all":
        query["fulfillment_type"] = fulfillment
    if search:
        query["$or"] = [
            {"order_number": {"$regex": search, "$options": "i"}},
            {"customer_name": {"$regex": search, "$options": "i"}},
            {"customer_phone": {"$regex": search, "$options": "i"}},
            {"customer_email": {"$regex": search, "$options": "i"}},
        ]

    total = await collection.count_documents(query)
    skip = (page - 1) * limit

    cursor = (
        collection.find(query)
        .sort("created_at", -1)
        .skip(skip)
        .limit(limit)
    )
    orders = await cursor.to_list(length=limit)

    return {
        "orders": serialize_docs(orders),
        "pagination": build_pagination(page, limit, total),
    }


@router.get("")
async def get_my_orders(
    current_user: dict = Depends(get_current_user),
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=10, ge=1, le=50),
):
    """Get current logged-in user's orders."""
    collection = Database.get_collection(COLLECTION)
    query = {"$or": [{"user_id": current_user["sub"]}, {"customer_email": current_user.get("email")}]}
    total = await collection.count_documents(query)
    skip = (page - 1) * limit

    cursor = (
        collection.find(query)
        .sort("created_at", -1)
        .skip(skip)
        .limit(limit)
    )
    orders = await cursor.to_list(length=limit)

    return {
        "orders": serialize_docs(orders),
        "pagination": build_pagination(page, limit, total),
    }


@router.get("/{order_id}")
async def get_order(order_id: str, current_user: dict = Depends(get_current_user)):
    """Get a specific order (owner or admin)."""
    collection = Database.get_collection(COLLECTION)
    try:
        if ObjectId.is_valid(order_id):
            query = {"_id": ObjectId(order_id)}
        else:
            query = {"order_number": order_id}

        # If not admin, restrict to owner
        if current_user.get("role") != "admin":
            query["$or"] = [{"user_id": current_user["sub"]}, {"customer_email": current_user.get("email")}]

        order = await collection.find_one(query)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid order ID")

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return {"order": serialize_doc(order)}


@router.patch("/{order_id}/status")
async def update_order_status_admin(
    order_id: str,
    update: OrderStatusUpdate,
    current_admin: dict = Depends(require_admin),
):
    """Admin endpoint: Update customer order fulfillment/processing status."""
    collection = Database.get_collection(COLLECTION)
    valid_statuses = ["pending", "confirmed", "processing", "shipped", "delivered", "completed", "cancelled"]
    if update.status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Choose from: {valid_statuses}")

    try:
        if ObjectId.is_valid(order_id):
            query = {"_id": ObjectId(order_id)}
        else:
            query = {"order_number": order_id}

        set_fields = {"status": update.status, "updated_at": utc_now()}
        if update.admin_notes:
            set_fields["admin_notes"] = update.admin_notes

        result = await collection.find_one_and_update(
            query,
            {"$set": set_fields},
            return_document=True,
        )
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid order ID")

    if not result:
        raise HTTPException(status_code=404, detail="Order not found")

    return {
        "order": serialize_doc(result),
        "message": f"Order status updated to {update.status}",
    }


@router.patch("/{order_id}/cancel")
async def cancel_order(order_id: str, current_user: dict = Depends(get_current_user)):
    """Cancel a pending order (by customer or admin)."""
    collection = Database.get_collection(COLLECTION)
    try:
        if ObjectId.is_valid(order_id):
            query = {"_id": ObjectId(order_id)}
        else:
            query = {"order_number": order_id}

        if current_user.get("role") != "admin":
            query["user_id"] = current_user["sub"]

        order = await collection.find_one(query)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid order ID")

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if order["status"] not in ("pending", "confirmed"):
        raise HTTPException(status_code=400, detail="Only pending or confirmed orders can be cancelled")

    await collection.update_one(
        {"_id": order["_id"]},
        {"$set": {"status": "cancelled", "updated_at": utc_now()}},
    )
    return {"message": "Order cancelled successfully"}
