import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))

from fastapi import APIRouter, HTTPException, Query, status, Depends
from typing import Optional
from bson import ObjectId
from common.database import Database
from common.auth import require_admin
from common.utils import serialize_doc, serialize_docs, utc_now, build_pagination, PRODUCT_CATEGORIES
from .schemas import ProductCreate, ProductUpdate

router = APIRouter(prefix="/api/products", tags=["Products"])

COLLECTION = "products"


@router.get("/categories")
async def get_categories():
    """Get all product categories."""
    return {"categories": PRODUCT_CATEGORIES}


@router.get("")
async def get_products(
    category: Optional[str] = None,
    brand: Optional[str] = None,
    search: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    is_featured: Optional[bool] = None,
    sort_by: str = Query(default="created_at", regex="^(price|name|created_at|rating)$"),
    sort_order: str = Query(default="desc", regex="^(asc|desc)$"),
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=12, ge=1, le=100),
):
    """Get products with filtering, sorting, and pagination."""
    collection = Database.get_collection(COLLECTION)

    # Build query filter
    query = {"is_active": True}
    if category:
        query["category"] = category
    if brand:
        query["brand"] = {"$regex": brand, "$options": "i"}
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}},
            {"tags": {"$in": [search.lower()]}},
        ]
    if min_price is not None:
        query["price"] = query.get("price", {})
        query["price"]["$gte"] = min_price
    if max_price is not None:
        query["price"] = query.get("price", {})
        query["price"]["$lte"] = max_price
    if is_featured is not None:
        query["is_featured"] = is_featured

    # Count total
    total = await collection.count_documents(query)

    # Sort and paginate
    sort_direction = 1 if sort_order == "asc" else -1
    skip = (page - 1) * limit

    cursor = (
        collection.find(query)
        .sort(sort_by, sort_direction)
        .skip(skip)
        .limit(limit)
    )
    products = await cursor.to_list(length=limit)

    return {
        "products": serialize_docs(products),
        "pagination": build_pagination(page, limit, total),
    }


@router.get("/featured")
async def get_featured_products(limit: int = Query(default=8, ge=1, le=20)):
    """Get featured products for homepage."""
    collection = Database.get_collection(COLLECTION)
    cursor = (
        collection.find({"is_featured": True, "is_active": True})
        .sort("created_at", -1)
        .limit(limit)
    )
    products = await cursor.to_list(length=limit)
    return {"products": serialize_docs(products)}


@router.get("/{product_id}")
async def get_product(product_id: str):
    """Get a single product by ID."""
    collection = Database.get_collection(COLLECTION)
    try:
        product = await collection.find_one({"_id": ObjectId(product_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid product ID")
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"product": serialize_doc(product)}


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_product(
    product: ProductCreate,
    current_admin: dict = Depends(require_admin),
):
    """Create a new product (admin only)."""
    collection = Database.get_collection(COLLECTION)
    now = utc_now()
    doc = {
        **product.model_dump(),
        "rating": 0.0,
        "review_count": 0,
        "is_active": True,
        "created_at": now,
        "updated_at": now,
    }
    result = await collection.insert_one(doc)
    doc["_id"] = result.inserted_id
    return {"product": serialize_doc(doc), "message": "Product created successfully"}


@router.put("/{product_id}")
async def update_product(
    product_id: str,
    product: ProductUpdate,
    current_admin: dict = Depends(require_admin),
):
    """Update a product (admin only)."""
    collection = Database.get_collection(COLLECTION)
    update_data = {k: v for k, v in product.model_dump().items() if v is not None}
    update_data["updated_at"] = utc_now()

    try:
        result = await collection.find_one_and_update(
            {"_id": ObjectId(product_id)},
            {"$set": update_data},
            return_document=True,
        )
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid product ID")

    if not result:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"product": serialize_doc(result), "message": "Product updated successfully"}


@router.delete("/{product_id}")
async def delete_product(
    product_id: str,
    current_admin: dict = Depends(require_admin),
):
    """Delete a product (admin only)."""
    collection = Database.get_collection(COLLECTION)
    try:
        result = await collection.find_one_and_delete(
            {"_id": ObjectId(product_id)},
        )
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid product ID")
    if not result:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product deleted successfully"}



@router.get("/brands/list")
async def get_brands(category: Optional[str] = None):
    """Get distinct brands, optionally filtered by category."""
    collection = Database.get_collection(COLLECTION)
    query = {"is_active": True}
    if category:
        query["category"] = category
    brands = await collection.distinct("brand", query)
    return {"brands": sorted(brands)}
