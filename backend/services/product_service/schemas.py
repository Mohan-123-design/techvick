from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List, Union


class ProductCreate(BaseModel):
    model_config = ConfigDict(extra="allow")

    name: str = Field(..., min_length=2, max_length=200)
    description: Optional[str] = Field(default="Genuine product available at Techvick Computers showroom.")
    category: str = Field(default="laptops")
    brand: str = Field(..., min_length=1, max_length=100)
    price: float = Field(..., gt=0)
    original_price: Optional[float] = None
    stock: int = Field(default=10, ge=0)
    images: List[str] = Field(default_factory=list)
    specifications: dict = Field(default_factory=dict)
    warranty_months: int = Field(default=24, ge=0)
    is_featured: bool = False
    badge: Optional[str] = None
    inStoreAvailability: Optional[str] = None
    tags: List[str] = Field(default_factory=list)


class ProductUpdate(BaseModel):
    model_config = ConfigDict(extra="allow")

    name: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    brand: Optional[str] = None
    price: Optional[float] = None
    original_price: Optional[float] = None
    stock: Optional[int] = None
    images: Optional[List[str]] = None
    specifications: Optional[dict] = None
    warranty_months: Optional[int] = None
    is_featured: Optional[bool] = None
    badge: Optional[str] = None
    inStoreAvailability: Optional[str] = None
    tags: Optional[List[str]] = None


class ProductResponse(BaseModel):
    id: str
    name: str
    description: str
    category: str
    brand: str
    price: float
    original_price: Optional[float] = None
    stock: int
    images: List[str]
    specifications: dict
    warranty_months: int
    is_featured: bool
    tags: List[str]
    rating: float = 0.0
    review_count: int = 0
    created_at: str
    updated_at: str


class ProductListResponse(BaseModel):
    products: List[ProductResponse]
    pagination: dict
