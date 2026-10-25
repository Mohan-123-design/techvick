from datetime import datetime, timezone
from bson import ObjectId


def serialize_doc(doc: dict) -> dict:
    """Convert MongoDB document to JSON-serializable format."""
    if doc is None:
        return None
    doc["id"] = str(doc.pop("_id", ""))
    # Convert datetime objects
    for key, value in doc.items():
        if isinstance(value, datetime):
            doc[key] = value.isoformat()
        elif isinstance(value, ObjectId):
            doc[key] = str(value)
    return doc


def serialize_docs(docs: list) -> list:
    """Convert list of MongoDB documents to JSON-serializable format."""
    return [serialize_doc(doc) for doc in docs]


def utc_now() -> datetime:
    """Get current UTC datetime."""
    return datetime.now(timezone.utc)


def build_pagination(page: int, limit: int, total: int) -> dict:
    """Build pagination metadata."""
    total_pages = (total + limit - 1) // limit
    return {
        "page": page,
        "limit": limit,
        "total": total,
        "total_pages": total_pages,
        "has_next": page < total_pages,
        "has_prev": page > 1,
    }


# Product categories for the store
PRODUCT_CATEGORIES = [
    {
        "id": "laptops",
        "name": "Laptops",
        "icon": "💻",
        "description": "Business, gaming & personal laptops from top brands",
    },
    {
        "id": "desktops",
        "name": "Desktops",
        "icon": "🖥️",
        "description": "Custom-built & branded desktop computers",
    },
    {
        "id": "servers",
        "name": "Servers",
        "icon": "🗄️",
        "description": "Enterprise servers & network storage solutions",
    },
    {
        "id": "printers",
        "name": "Printers",
        "icon": "🖨️",
        "description": "Inkjet, laser & multifunction printers",
    },
    {
        "id": "cctv",
        "name": "CCTV & Cameras",
        "icon": "📷",
        "description": "Security cameras, DVRs & surveillance systems",
    },
    {
        "id": "accessories",
        "name": "Accessories",
        "icon": "🖱️",
        "description": "Keyboards, mice, cables, adapters & peripherals",
    },
    {
        "id": "networking",
        "name": "Networking",
        "icon": "🌐",
        "description": "Routers, switches, access points & cabling",
    },
]

# Service types
SERVICE_TYPES = [
    {
        "id": "repair",
        "name": "Repair Service",
        "icon": "🔧",
        "description": "Hardware & software repair for all devices",
    },
    {
        "id": "maintenance",
        "name": "Annual Maintenance",
        "icon": "🛡️",
        "description": "AMC plans for worry-free device maintenance",
    },
    {
        "id": "site_visit",
        "name": "Site Visit",
        "icon": "🏠",
        "description": "Technician visits your home or office",
    },
    {
        "id": "installation",
        "name": "Installation",
        "icon": "⚙️",
        "description": "Professional setup & installation services",
    },
    {
        "id": "data_recovery",
        "name": "Data Recovery",
        "icon": "💾",
        "description": "Recover lost or corrupted data",
    },
    {
        "id": "networking_setup",
        "name": "Network Setup",
        "icon": "🌐",
        "description": "LAN, Wi-Fi & network infrastructure setup",
    },
]
