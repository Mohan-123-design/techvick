import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))

import random
import string
from fastapi import APIRouter, HTTPException, Depends, Query, status
from bson import ObjectId
from common.database import Database
from common.auth import get_current_user
from common.utils import serialize_doc, serialize_docs, utc_now, build_pagination
from .schemas import OrderCreate

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
    current_user: dict = Depends(get_current_user),
):
    """Place a new order."""
    collection = Database.get_collection(COLLECTION)

    # Calculate totals
    subtotal = sum(item.price * item.quantity for item in order.items)
    tax = round(subtotal * 0.18, 2)  # 18% GST
    total = round(subtotal + tax, 2)

    now = utc_now()
    doc = {
        "order_number": generate_order_number(),
        "user_id": current_user["sub"],
        "items": [item.model_dump() for item in order.items],
        "subtotal": subtotal,
        "tax": tax,
        "total": total,
        "status": "pending",
        "shipping_address": order.shipping_address,
        "city": order.city,
        "pincode": order.pincode,
        "phone": order.phone,
        "notes": order.notes,
        "payment_method": order.payment_method,
        "created_at": now,
        "updated_at": now,
    }

    result = await collection.insert_one(doc)
    doc["_id"] = result.inserted_id
    return {
        "order": serialize_doc(doc),
        "message": "Order placed successfully!",
    }


@router.get("")
async def get_my_orders(
    current_user: dict = Depends(get_current_user),
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=10, ge=1, le=50),
):
    """Get current user's orders."""
    collection = Database.get_collection(COLLECTION)
    query = {"user_id": current_user["sub"]}
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
    """Get a specific order."""
    collection = Database.get_collection(COLLECTION)
    try:
        order = await collection.find_one({
            "_id": ObjectId(order_id),
            "user_id": current_user["sub"],
        })
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid order ID")
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return {"order": serialize_doc(order)}


@router.patch("/{order_id}/cancel")
async def cancel_order(order_id: str, current_user: dict = Depends(get_current_user)):
    """Cancel a pending order."""
    collection = Database.get_collection(COLLECTION)
    try:
        order = await collection.find_one({
            "_id": ObjectId(order_id),
            "user_id": current_user["sub"],
        })
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid order ID")

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if order["status"] not in ("pending", "confirmed"):
        raise HTTPException(status_code=400, detail="Only pending/confirmed orders can be cancelled")

    await collection.update_one(
        {"_id": ObjectId(order_id)},
        {"$set": {"status": "cancelled", "updated_at": utc_now()}},
    )
    return {"message": "Order cancelled successfully"}
