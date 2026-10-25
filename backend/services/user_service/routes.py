import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))

from fastapi import APIRouter, HTTPException, status
from common.database import Database
from common.auth import hash_password, verify_password, create_access_token, get_current_user
from common.utils import serialize_doc, utc_now
from .schemas import UserRegister, UserLogin, UserUpdate, ContactFormRequest, NewsletterSubscribe
from fastapi import Depends

router = APIRouter(prefix="/api/users", tags=["Users"])

COLLECTION = "users"


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(user: UserRegister):
    """Register a new user account."""
    collection = Database.get_collection(COLLECTION)

    # Check if email already exists
    existing = await collection.find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    now = utc_now()
    doc = {
        "name": user.name,
        "email": user.email,
        "password": hash_password(user.password),
        "phone": user.phone,
        "address": user.address,
        "city": user.city,
        "pincode": user.pincode,
        "role": "customer",
        "is_active": True,
        "created_at": now,
        "updated_at": now,
    }
    result = await collection.insert_one(doc)
    token = create_access_token(
        {"sub": str(result.inserted_id), "email": user.email, "role": "customer"}
    )
    return {
        "message": "Registration successful",
        "token": token,
        "user": {
            "id": str(result.inserted_id),
            "name": user.name,
            "email": user.email,
            "role": "customer",
        },
    }


@router.post("/login")
async def login(credentials: UserLogin):
    """Login with email and password."""
    collection = Database.get_collection(COLLECTION)
    user = await collection.find_one({"email": credentials.email})

    if not user or not verify_password(credentials.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if not user.get("is_active", True):
        raise HTTPException(status_code=403, detail="Account deactivated")

    token = create_access_token(
        {"sub": str(user["_id"]), "email": user["email"], "role": user.get("role", "customer")}
    )
    return {
        "message": "Login successful",
        "token": token,
        "user": {
            "id": str(user["_id"]),
            "name": user["name"],
            "email": user["email"],
            "role": user.get("role", "customer"),
        },
    }


@router.get("/profile")
async def get_profile(current_user: dict = Depends(get_current_user)):
    """Get current user profile."""
    collection = Database.get_collection(COLLECTION)
    from bson import ObjectId
    user = await collection.find_one({"_id": ObjectId(current_user["sub"])})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user_data = serialize_doc(user)
    user_data.pop("password", None)
    return {"user": user_data}


@router.put("/profile")
async def update_profile(
    updates: UserUpdate,
    current_user: dict = Depends(get_current_user),
):
    """Update user profile."""
    collection = Database.get_collection(COLLECTION)
    from bson import ObjectId
    update_data = {k: v for k, v in updates.model_dump().items() if v is not None}
    update_data["updated_at"] = utc_now()
    result = await collection.find_one_and_update(
        {"_id": ObjectId(current_user["sub"])},
        {"$set": update_data},
        return_document=True,
    )
    if not result:
        raise HTTPException(status_code=404, detail="User not found")
    result_data = serialize_doc(result)
    result_data.pop("password", None)
    return {"user": result_data, "message": "Profile updated"}


@router.post("/contact")
async def submit_contact(form: ContactFormRequest):
    """Submit a contact form inquiry."""
    collection = Database.get_collection("contact_inquiries")
    doc = {
        **form.model_dump(),
        "status": "new",
        "created_at": utc_now(),
    }
    await collection.insert_one(doc)
    return {"message": "Thank you for contacting us! We'll get back to you within 24 hours."}


@router.post("/newsletter")
async def subscribe_newsletter(data: NewsletterSubscribe):
    """Subscribe to newsletter."""
    collection = Database.get_collection("newsletter_subscribers")
    existing = await collection.find_one({"email": data.email})
    if existing:
        return {"message": "You're already subscribed!"}
    doc = {**data.model_dump(), "subscribed_at": utc_now(), "is_active": True}
    await collection.insert_one(doc)
    return {"message": "Successfully subscribed to our newsletter!"}
