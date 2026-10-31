"""
TechMart API Gateway
====================
Central entry point that aggregates all microservices.
For development: runs all services in a single process.
For production: each service runs independently and the gateway proxies requests.
"""

import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from common.config import settings
from common.database import Database
from common.utils import PRODUCT_CATEGORIES, SERVICE_TYPES

# Import service routers directly (monolith mode for simplicity)
from services.product_service.routes import router as product_router
from services.user_service.routes import router as user_router
from services.order_service.routes import router as order_router
from services.service_request.routes import router as service_router

app = FastAPI(
    title="TechMart API Gateway",
    version=settings.APP_VERSION,
    description=(
        "🖥️ TechMart - Your Trusted Electronics Sales & Service Partner. "
        "Laptops | Desktops | Servers | Printers | CCTV | Accessories | Networking"
    ),
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all in development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error", "error": str(exc)},
    )


# Startup / Shutdown
@app.on_event("startup")
async def startup():
    await Database.connect()
    print("🚀 TechMart API Gateway started")
    print(f"📖 API Docs: http://localhost:{settings.GATEWAY_PORT}/docs")

    # Seed sample data if database is empty
    await seed_sample_data()


@app.on_event("shutdown")
async def shutdown():
    await Database.disconnect()


# Include all service routers
app.include_router(product_router)
app.include_router(user_router)
app.include_router(order_router)
app.include_router(service_router)


# Root endpoint
@app.get("/")
async def root():
    return {
        "name": "TechMart API",
        "version": settings.APP_VERSION,
        "description": "Electronics Sales & Service Store",
        "categories": [c["name"] for c in PRODUCT_CATEGORIES],
        "services": [s["name"] for s in SERVICE_TYPES],
        "endpoints": {
            "docs": "/docs",
            "products": "/api/products",
            "categories": "/api/products/categories",
            "users": "/api/users",
            "orders": "/api/orders",
            "service_requests": "/api/services",
            "service_types": "/api/services/types",
        },
    }


@app.get("/health")
async def health():
    return {"status": "healthy", "service": "api-gateway"}


# ------------------------------------------------------------------
# Seed sample data
# ------------------------------------------------------------------
async def seed_sample_data():
    """Insert demo products if the database is empty."""
    collection = Database.get_collection("products")
    count = await collection.count_documents({})
    if count > 0:
        print(f"📦 Database already has {count} products, skipping seed.")
        return

    from common.utils import utc_now
    now = utc_now()

    sample_products = [
        # Laptops
        {
            "name": "HP ProBook 450 G10 Business Laptop",
            "description": "Powerful business laptop with Intel Core i5 13th Gen, 16GB RAM, 512GB SSD, 15.6-inch FHD display. Perfect for professionals and office use.",
            "category": "laptops",
            "brand": "HP",
            "price": 52990.0,
            "original_price": 62990.0,
            "stock": 15,
            "images": [],
            "specifications": {
                "Processor": "Intel Core i5-1335U (13th Gen)",
                "RAM": "16GB DDR4",
                "Storage": "512GB NVMe SSD",
                "Display": "15.6-inch FHD IPS",
                "OS": "Windows 11 Pro",
                "Battery": "Up to 8 hours",
            },
            "warranty_months": 24,
            "is_featured": True,
            "tags": ["business", "hp", "laptop", "intel"],
            "rating": 4.5,
            "review_count": 128,
            "is_active": True,
            "created_at": now,
            "updated_at": now,
        },
        {
            "name": "Dell Vostro 3520 Laptop",
            "description": "Reliable Dell laptop with Intel Core i3, 8GB RAM, 512GB SSD. Ideal for students and everyday computing.",
            "category": "laptops",
            "brand": "Dell",
            "price": 35490.0,
            "original_price": 42990.0,
            "stock": 22,
            "images": [],
            "specifications": {
                "Processor": "Intel Core i3-1215U (12th Gen)",
                "RAM": "8GB DDR4",
                "Storage": "512GB SSD",
                "Display": "15.6-inch FHD",
                "OS": "Windows 11 Home",
            },
            "warranty_months": 12,
            "is_featured": True,
            "tags": ["student", "dell", "affordable", "laptop"],
            "rating": 4.2,
            "review_count": 89,
            "is_active": True,
            "created_at": now,
            "updated_at": now,
        },
        {
            "name": "Lenovo IdeaPad Slim 3 Laptop",
            "description": "Slim and lightweight laptop with AMD Ryzen 5, 8GB RAM, 512GB SSD. Great for work and entertainment.",
            "category": "laptops",
            "brand": "Lenovo",
            "price": 38990.0,
            "original_price": 47990.0,
            "stock": 18,
            "images": [],
            "specifications": {
                "Processor": "AMD Ryzen 5 7520U",
                "RAM": "8GB DDR5",
                "Storage": "512GB SSD",
                "Display": "15.6-inch FHD IPS",
                "OS": "Windows 11 Home",
            },
            "warranty_months": 24,
            "is_featured": True,
            "tags": ["slim", "lenovo", "amd", "laptop"],
            "rating": 4.3,
            "review_count": 65,
            "is_active": True,
            "created_at": now,
            "updated_at": now,
        },
        # Desktops
        {
            "name": "Custom Assembled Desktop PC - i5 Gaming Build",
            "description": "Custom-built desktop with Intel i5, 16GB RAM, 512GB SSD, GT 1030 GPU. Perfect for gaming and creative work.",
            "category": "desktops",
            "brand": "TechMart Custom",
            "price": 42500.0,
            "original_price": 49990.0,
            "stock": 8,
            "images": [],
            "specifications": {
                "Processor": "Intel Core i5-12400F",
                "RAM": "16GB DDR4 3200MHz",
                "Storage": "512GB NVMe SSD + 1TB HDD",
                "GPU": "NVIDIA GT 1030 2GB",
                "Cabinet": "ATX Mid Tower with RGB",
                "PSU": "550W 80+ Bronze",
            },
            "warranty_months": 36,
            "is_featured": True,
            "tags": ["custom", "gaming", "desktop", "assembled"],
            "rating": 4.7,
            "review_count": 45,
            "is_active": True,
            "created_at": now,
            "updated_at": now,
        },
        {
            "name": "HP Pro Tower 290 G9 Desktop",
            "description": "Business desktop with Intel Core i3, 8GB RAM, 256GB SSD. Reliable everyday computing for offices.",
            "category": "desktops",
            "brand": "HP",
            "price": 28990.0,
            "original_price": 34990.0,
            "stock": 12,
            "images": [],
            "specifications": {
                "Processor": "Intel Core i3-12100",
                "RAM": "8GB DDR4",
                "Storage": "256GB SSD",
                "OS": "Windows 11 Pro",
                "Ports": "USB 3.2, HDMI, VGA",
            },
            "warranty_months": 36,
            "is_featured": False,
            "tags": ["business", "hp", "desktop", "office"],
            "rating": 4.1,
            "review_count": 33,
            "is_active": True,
            "created_at": now,
            "updated_at": now,
        },
        # Printers
        {
            "name": "HP LaserJet Pro M404dn Printer",
            "description": "High-speed monochrome laser printer with auto-duplex, network-ready. Perfect for high-volume office printing.",
            "category": "printers",
            "brand": "HP",
            "price": 24500.0,
            "original_price": 29990.0,
            "stock": 10,
            "images": [],
            "specifications": {
                "Type": "Monochrome Laser",
                "Speed": "40 PPM",
                "Duplex": "Automatic",
                "Connectivity": "USB, Ethernet",
                "Paper Capacity": "350 sheets",
            },
            "warranty_months": 12,
            "is_featured": True,
            "tags": ["laser", "hp", "printer", "office"],
            "rating": 4.4,
            "review_count": 72,
            "is_active": True,
            "created_at": now,
            "updated_at": now,
        },
        {
            "name": "Epson EcoTank L3250 Ink Tank Printer",
            "description": "All-in-one ink tank printer with Wi-Fi. Ultra-low cost per page, ideal for home and small offices.",
            "category": "printers",
            "brand": "Epson",
            "price": 13490.0,
            "original_price": 15990.0,
            "stock": 25,
            "images": [],
            "specifications": {
                "Type": "Ink Tank - Color",
                "Functions": "Print, Scan, Copy",
                "Connectivity": "USB, Wi-Fi",
                "Speed": "10.5 PPM (Black)",
                "Cost Per Page": "7 paise (Black)",
            },
            "warranty_months": 12,
            "is_featured": True,
            "tags": ["ink-tank", "epson", "color", "wifi", "printer"],
            "rating": 4.6,
            "review_count": 156,
            "is_active": True,
            "created_at": now,
            "updated_at": now,
        },
        # CCTV
        {
            "name": "Hikvision 4 Camera CCTV System Kit",
            "description": "Complete 4-channel CCTV surveillance kit with 2MP cameras, DVR, 1TB HDD, and all cables included. Professional installation available.",
            "category": "cctv",
            "brand": "Hikvision",
            "price": 15990.0,
            "original_price": 21990.0,
            "stock": 20,
            "images": [],
            "specifications": {
                "Cameras": "4x 2MP Dome/Bullet",
                "DVR": "4-Channel Turbo HD",
                "Storage": "1TB Surveillance HDD",
                "Night Vision": "Up to 20m",
                "Mobile View": "Hik-Connect App",
                "Includes": "All cables, adapters, connectors",
            },
            "warranty_months": 24,
            "is_featured": True,
            "tags": ["cctv", "hikvision", "surveillance", "security"],
            "rating": 4.5,
            "review_count": 98,
            "is_active": True,
            "created_at": now,
            "updated_at": now,
        },
        # Networking
        {
            "name": "TP-Link Archer AX23 Wi-Fi 6 Router",
            "description": "Dual-band Wi-Fi 6 router with speeds up to 1800Mbps. Perfect for homes and small offices with many devices.",
            "category": "networking",
            "brand": "TP-Link",
            "price": 3990.0,
            "original_price": 5490.0,
            "stock": 30,
            "images": [],
            "specifications": {
                "Standard": "Wi-Fi 6 (802.11ax)",
                "Speed": "1800Mbps (574 + 1201)",
                "Bands": "Dual Band (2.4 + 5 GHz)",
                "Antennas": "4x External",
                "Ports": "1 Gigabit WAN + 4 LAN",
            },
            "warranty_months": 36,
            "is_featured": False,
            "tags": ["router", "wifi6", "tp-link", "networking"],
            "rating": 4.3,
            "review_count": 112,
            "is_active": True,
            "created_at": now,
            "updated_at": now,
        },
        {
            "name": "D-Link 8-Port Gigabit Ethernet Switch",
            "description": "Unmanaged 8-port gigabit switch for expanding your network. Plug and play, energy efficient.",
            "category": "networking",
            "brand": "D-Link",
            "price": 1990.0,
            "original_price": 2490.0,
            "stock": 40,
            "images": [],
            "specifications": {
                "Ports": "8x 10/100/1000 Mbps",
                "Type": "Unmanaged",
                "Switching Capacity": "16 Gbps",
                "Design": "Desktop/Wall-mount",
            },
            "warranty_months": 36,
            "is_featured": False,
            "tags": ["switch", "gigabit", "d-link", "networking"],
            "rating": 4.1,
            "review_count": 55,
            "is_active": True,
            "created_at": now,
            "updated_at": now,
        },
        # Accessories
        {
            "name": "Logitech MK270 Wireless Keyboard & Mouse Combo",
            "description": "Reliable wireless keyboard and mouse combo with long battery life. Ideal for office and home use.",
            "category": "accessories",
            "brand": "Logitech",
            "price": 1595.0,
            "original_price": 1995.0,
            "stock": 50,
            "images": [],
            "specifications": {
                "Connectivity": "2.4GHz Wireless",
                "Keyboard": "Full-size with Numpad",
                "Mouse": "3-Button Optical",
                "Battery": "24 months (keyboard), 12 months (mouse)",
                "Range": "Up to 10 meters",
            },
            "warranty_months": 12,
            "is_featured": False,
            "tags": ["keyboard", "mouse", "wireless", "logitech", "combo"],
            "rating": 4.4,
            "review_count": 210,
            "is_active": True,
            "created_at": now,
            "updated_at": now,
        },
        {
            "name": "Samsung 24-inch FHD Monitor (LS24C310)",
            "description": "24-inch Full HD IPS monitor with slim bezels, HDMI, and eye-comfort technology.",
            "category": "accessories",
            "brand": "Samsung",
            "price": 9490.0,
            "original_price": 12490.0,
            "stock": 15,
            "images": [],
            "specifications": {
                "Size": "24-inch",
                "Resolution": "1920x1080 (FHD)",
                "Panel": "IPS",
                "Ports": "HDMI, VGA",
                "Features": "Flicker Free, Eye Saver Mode",
            },
            "warranty_months": 36,
            "is_featured": True,
            "tags": ["monitor", "samsung", "fhd", "24inch"],
            "rating": 4.5,
            "review_count": 87,
            "is_active": True,
            "created_at": now,
            "updated_at": now,
        },
        # Servers
        {
            "name": "Dell PowerEdge T150 Tower Server",
            "description": "Entry-level tower server with Intel Xeon E-2314, 16GB RAM, 2TB HDD. Ideal for small businesses.",
            "category": "servers",
            "brand": "Dell",
            "price": 89990.0,
            "original_price": 112990.0,
            "stock": 3,
            "images": [],
            "specifications": {
                "Processor": "Intel Xeon E-2314 (4 Core)",
                "RAM": "16GB DDR4 ECC",
                "Storage": "2TB 7.2K SATA HDD",
                "RAID": "Hardware RAID",
                "OS Support": "Windows Server, Linux",
                "Form Factor": "Tower",
            },
            "warranty_months": 36,
            "is_featured": False,
            "tags": ["server", "dell", "xeon", "business"],
            "rating": 4.6,
            "review_count": 12,
            "is_active": True,
            "created_at": now,
            "updated_at": now,
        },
    ]

    await collection.insert_many(sample_products)
    print(f"✅ Seeded {len(sample_products)} sample products")

    # Seed Admin and Customer Users
    users_coll = Database.get_collection("users")
    admin_user = await users_coll.find_one({"email": "admin@techmart.in"})
    from common.auth import hash_password
    if not admin_user:
        await users_coll.insert_one({
            "name": "Store Administrator",
            "email": "admin@techmart.in",
            "password": hash_password("Admin@12345"),
            "phone": "+91 98765 00000",
            "role": "admin",
            "is_active": True,
            "created_at": now,
            "updated_at": now,
        })
        print("👤 Seeded Admin user: admin@techmart.in / Admin@12345")

    customer_user = await users_coll.find_one({"email": "customer@techmart.in"})
    if not customer_user:
        await users_coll.insert_one({
            "name": "Rahul Sharma",
            "email": "customer@techmart.in",
            "password": hash_password("Customer@123"),
            "phone": "+91 98765 43210",
            "role": "customer",
            "is_active": True,
            "created_at": now,
            "updated_at": now,
        })
        print("👤 Seeded Demo Customer: customer@techmart.in / Customer@123")

    # Seed Warranty Records
    w_coll = Database.get_collection("warranty_records")
    w_count = await w_coll.count_documents({})
    if w_count == 0:
        await w_coll.insert_many([
            {
                "serial_number": "TM-LAP-2024-001",
                "customer_name": "Suresh Raina",
                "customer_phone": "+91 98765 11223",
                "product_name": "HP ProBook 450 G10 Business Laptop",
                "category": "Laptops",
                "purchase_date": "2024-02-15",
                "expiry_date": "2026-02-15",
                "status": "Active",
                "coverage": "Comprehensive Hardware & On-Site Support",
                "store_location": "TechMart Main Branch, Shop 102",
                "invoice_number": "INV-2024-4821",
                "created_at": now,
                "updated_at": now,
            },
            {
                "serial_number": "TM-PRN-2024-089",
                "customer_name": "Meena Sundaram",
                "customer_phone": "+91 98401 77654",
                "product_name": "Epson EcoTank L3250 Wi-Fi All-in-One Printer",
                "category": "Printers",
                "purchase_date": "2023-11-10",
                "expiry_date": "2025-11-10",
                "status": "Active",
                "coverage": "Print Head & Logic Board Warranty",
                "store_location": "TechMart Service Hub, North Zone",
                "invoice_number": "INV-2023-9014",
                "created_at": now,
                "updated_at": now,
            },
            {
                "serial_number": "TM-CAM-2024-112",
                "customer_name": "Aditya Birla Chemicals Lab",
                "customer_phone": "+91 94440 22334",
                "product_name": "Hikvision 8-Channel 4K ColorVu IP CCTV System",
                "category": "CCTV & Cameras",
                "purchase_date": "2024-01-20",
                "expiry_date": "2027-01-20",
                "status": "Active",
                "coverage": "3-Year Enterprise Replacement + Annual AMC Included",
                "store_location": "TechMart Corporate Services Desk",
                "invoice_number": "INV-2024-1102",
                "created_at": now,
                "updated_at": now,
            },
        ])
        print("🛡️ Seeded demo warranty records")

    # Seed Sample Inquiries
    inq_coll = Database.get_collection("contact_inquiries")
    if await inq_coll.count_documents({}) == 0:
        await inq_coll.insert_many([
            {
                "name": "Kiran Deshmukh",
                "phone": "+91 98111 22334",
                "email": "kiran.d@example.com",
                "subject": "bulk_order",
                "message": "Looking to purchase 12 custom assembled desktop PCs and a network switch for our engineering firm. Need GST invoice and installation quote.",
                "status": "new",
                "created_at": now,
            },
            {
                "name": "Ananya Joshi",
                "phone": "+91 98222 33445",
                "email": "ananya.j@example.com",
                "subject": "cctv_quote",
                "message": "Need 8-channel IP CCTV surveillance installed at our apartment society gate and parking basement. When can a technician visit for site survey?",
                "status": "contacted",
                "response_note": "Called customer, site survey scheduled for Tuesday 11 AM.",
                "created_at": now,
            },
        ])
        print("📨 Seeded sample contact inquiries")



if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "gateway.main:app",
        host="0.0.0.0",
        port=settings.GATEWAY_PORT,
        reload=True,
    )
