from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List


class UserRegister(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6)
    phone: str = Field(..., min_length=10, max_length=15)
    address: Optional[str] = None
    city: Optional[str] = None
    pincode: Optional[str] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    pincode: Optional[str] = None


class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    phone: str
    address: Optional[str] = None
    city: Optional[str] = None
    pincode: Optional[str] = None
    role: str = "customer"
    created_at: str


class ContactFormRequest(BaseModel):
    name: str = Field(..., min_length=2)
    email: EmailStr
    phone: Optional[str] = None
    subject: str = Field(..., min_length=5)
    message: str = Field(..., min_length=10)


class NewsletterSubscribe(BaseModel):
    email: EmailStr
    name: Optional[str] = None
