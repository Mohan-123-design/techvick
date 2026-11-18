from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import Optional, List
from enum import Enum


class ServiceTypeEnum(str, Enum):
    REPAIR = "repair"
    MAINTENANCE = "maintenance"
    SITE_VISIT = "site_visit"
    INSTALLATION = "installation"
    DATA_RECOVERY = "data_recovery"
    NETWORKING_SETUP = "networking_setup"


class DeviceTypeEnum(str, Enum):
    LAPTOP = "laptop"
    DESKTOP = "desktop"
    SERVER = "server"
    PRINTER = "printer"
    CCTV = "cctv"
    NETWORKING = "networking"
    OTHER = "other"


class ServiceRequestStatus(str, Enum):
    SUBMITTED = "submitted"
    REVIEWED = "reviewed"
    ASSIGNED = "assigned"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class ServiceRequestCreate(BaseModel):
    service_type: ServiceTypeEnum
    device_type: DeviceTypeEnum
    device_brand: Optional[str] = None
    device_model: Optional[str] = None
    issue_description: str = Field(..., min_length=10)
    preferred_date: Optional[str] = None
    preferred_time: Optional[str] = None
    # Contact info (for guest users)
    customer_name: str = Field(..., min_length=2)
    customer_email: EmailStr
    customer_phone: str = Field(..., min_length=10)
    address: Optional[str] = None  # Required for site visits
    city: Optional[str] = None
    pincode: Optional[str] = None
    is_urgent: bool = False


class ServiceRequestResponse(BaseModel):
    id: str
    ticket_number: str
    service_type: str
    device_type: str
    device_brand: Optional[str] = None
    device_model: Optional[str] = None
    issue_description: str
    status: str
    customer_name: str
    customer_email: str
    customer_phone: str
    address: Optional[str] = None
    city: Optional[str] = None
    estimated_cost: Optional[float] = None
    assigned_technician: Optional[str] = None
    created_at: str
    updated_at: str


class WarrantyCheckRequest(BaseModel):
    product_serial: str = Field(..., min_length=4)
    purchase_date: Optional[str] = None
    customer_email: Optional[EmailStr] = None


class ServiceCatalogCreate(BaseModel):
    model_config = ConfigDict(extra="allow")

    title: str = Field(..., min_length=2, max_length=200)
    category: str = Field(default="hardware")  # hardware, networking, cctv_printers, upgrades, pc_builds, data_recovery, site_visit
    badge: Optional[str] = "Service & Support"
    description: str = Field(..., min_length=5)
    turnaround: Optional[str] = "Same Day / 24 Hours"
    repair_warranty: Optional[str] = "Written Store Guarantee"
    features: List[str] = Field(default_factory=list)
    price: Optional[str] = ""  # Amount blank / optional as requested
    icon_name: Optional[str] = "Wrench"
    is_active: bool = True
    sort_order: int = 0


class ServiceCatalogUpdate(BaseModel):
    model_config = ConfigDict(extra="allow")

    title: Optional[str] = None
    category: Optional[str] = None
    badge: Optional[str] = None
    description: Optional[str] = None
    turnaround: Optional[str] = None
    repair_warranty: Optional[str] = None
    features: Optional[List[str]] = None
    price: Optional[str] = None
    icon_name: Optional[str] = None
    is_active: Optional[bool] = None
    sort_order: Optional[int] = None
