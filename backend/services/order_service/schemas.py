from pydantic import BaseModel, Field
from typing import Optional, List, Any
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
    name: Optional[str] = None
    product_name: Optional[str] = None
    quantity: int = Field(default=1, ge=1)
    price: float = Field(..., ge=0)
    warranty_months: Optional[int] = 0


class OrderCreate(BaseModel):
    items: List[OrderItem] = Field(..., min_length=1)
    customer_name: Optional[str] = "Customer"
    customer_phone: Optional[str] = ""
    customer_email: Optional[str] = ""
    shipping_address: Optional[str] = ""
    delivery_address: Optional[str] = ""
    city: Optional[str] = "Local"
    pincode: Optional[str] = ""
    phone: Optional[str] = ""
    fulfillment_type: Optional[str] = "pickup"  # pickup, delivery
    payment_method: Optional[str] = "cod"       # counter_cod, cod, upi
    notes: Optional[str] = None
    total_amount: Optional[float] = None


class OrderStatusUpdate(BaseModel):
    status: str
    admin_notes: Optional[str] = None
