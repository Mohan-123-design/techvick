from pydantic import BaseModel, Field
from typing import Optional, List
from enum import Enum


class OrderStatus(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    PROCESSING = "processing"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"


class OrderItem(BaseModel):
    product_id: str
    product_name: str
    quantity: int = Field(..., ge=1)
    price: float = Field(..., gt=0)
    warranty_months: int = 0


class OrderCreate(BaseModel):
    items: List[OrderItem] = Field(..., min_length=1)
    shipping_address: str
    city: str
    pincode: str
    phone: str
    notes: Optional[str] = None
    payment_method: str = "cod"  # cod, online, store_pickup


class OrderResponse(BaseModel):
    id: str
    order_number: str
    user_id: str
    items: List[dict]
    subtotal: float
    tax: float
    total: float
    status: str
    shipping_address: str
    city: str
    pincode: str
    phone: str
    notes: Optional[str] = None
    payment_method: str
    created_at: str
    updated_at: str
