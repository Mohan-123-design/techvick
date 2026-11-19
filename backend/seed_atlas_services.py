import os
import random
from datetime import datetime, timezone
from pymongo import MongoClient

MONGODB_URI = "mongodb+srv://mmohan50594_db_user:BMRW2EVbNFQyRmhT@cluster0.0jgmjnk.mongodb.net/techvick?retryWrites=true&w=majority"
client = MongoClient(MONGODB_URI)
db = client["techvick"]

now = datetime.now(timezone.utc).isoformat()

# Seed service_requests if empty
srv_coll = db["service_requests"]
print(f"Current service_requests count in Atlas: {srv_coll.count_documents({})}")
if srv_coll.count_documents({}) == 0:
    srv_coll.insert_many([
        {
            "ticket_number": "SRV-882190",
            "service_mode": "site_visit",
            "service_type": "site_visit",
            "device_type": "desktop",
            "brand": "Dell",
            "model": "OptiPlex 7080 Tower",
            "issue_category": "slow_upgrade",
            "issue_description": "Need Crucial 1TB NVMe SSD installation, Windows 11 setup, and RAM expansion to 16GB. Slow booting.",
            "urgency": "urgent",
            "customer_name": "Vikram Seth",
            "customer_phone": "8807023322",
            "customer_email": "vikram.seth@live.com",
            "address": "Plot 42, 8th Cross, Ram Nagar, Gandhipuram, Coimbatore",
            "landmark": "Near 100 Feet Road",
            "preferred_date": "2026-11-20",
            "preferred_time_slot": "10:00 AM - 01:00 PM",
            "status": "assigned",
            "assigned_technician": "Ramesh Kumar (Senior Hardware Engineer)",
            "technician_phone": "8807023322",
            "estimated_cost": 0.0,
            "notes": ["Customer requested morning visit; engineer allocated with SSD cloning kit."],
            "created_at": now,
            "updated_at": now,
        },
        {
            "ticket_number": "SRV-882191",
            "service_mode": "in_store",
            "service_type": "in_store",
            "device_type": "laptop",
            "brand": "Lenovo",
            "model": "ThinkPad T480",
            "issue_category": "screen_display",
            "issue_description": "Dropped laptop, display lines appearing and flickering. Need genuine 14-inch IPS panel replacement.",
            "urgency": "standard",
            "customer_name": "Kavitha Ram",
            "customer_phone": "8807015780",
            "customer_email": "kavitha.r@yahoo.com",
            "address": "Tatabad Walk-In Counter",
            "preferred_date": "2026-11-20",
            "preferred_time_slot": "02:00 PM - 05:00 PM",
            "status": "in_progress",
            "assigned_technician": "Ramesh Kumar (Senior Hardware Engineer)",
            "technician_phone": "8807023322",
            "estimated_cost": 0.0,
            "notes": ["Screen inspected at counter; spare ordered from authorized vendor."],
            "created_at": now,
            "updated_at": now,
        },
        {
            "ticket_number": "SRV-882192",
            "service_mode": "in_store",
            "service_type": "in_store",
            "device_type": "printer",
            "brand": "Epson",
            "model": "EcoTank L3250 Wi-Fi",
            "issue_category": "printer_repair",
            "issue_description": "Red light blinking continuously, paper feed roller slipping and paper jam error.",
            "urgency": "standard",
            "customer_name": "Suresh Babu",
            "customer_phone": "8807023322",
            "customer_email": "suresh.b@gmail.com",
            "address": "Tatabad Store Counter",
            "preferred_date": "2026-11-21",
            "preferred_time_slot": "11:00 AM - 02:00 PM",
            "status": "submitted",
            "assigned_technician": None,
            "technician_phone": None,
            "estimated_cost": 0.0,
            "notes": ["Printer left at store intake counter; initial roller inspection pending."],
            "created_at": now,
            "updated_at": now,
        },
        {
            "ticket_number": "SRV-882193",
            "service_mode": "site_visit",
            "service_type": "site_visit",
            "device_type": "cctv",
            "brand": "CP PLUS",
            "model": "8-Channel HD DVR Setup",
            "issue_category": "cctv_network",
            "issue_description": "2 outdoor night-vision cameras showing video loss on monitor. Need cable and BNC connector inspection.",
            "urgency": "urgent",
            "customer_name": "Priya Rajesh",
            "customer_phone": "8807015780",
            "customer_email": "priya.rajesh@outlook.com",
            "address": "14/A, Cross-Cut Road, Gandhipuram, Coimbatore",
            "landmark": "Near Lakshmi Complex",
            "preferred_date": "2026-11-21",
            "preferred_time_slot": "03:00 PM - 06:00 PM",
            "status": "assigned",
            "assigned_technician": "Ramesh Kumar (Senior Hardware Engineer)",
            "technician_phone": "8807023322",
            "estimated_cost": 0.0,
            "notes": ["Site appointment confirmed via phone; technician to carry CCTV tester."],
            "created_at": now,
            "updated_at": now,
        }
    ])
    print("✅ Successfully seeded 4 service_requests into MongoDB Atlas!")

# Seed services_catalog if empty
cat_coll = db["services_catalog"]
print(f"Current services_catalog count in Atlas: {cat_coll.count_documents({})}")
if cat_coll.count_documents({}) == 0:
    cat_coll.insert_many([
        {
            "title": "New & Used Laptops, Desktops, iMac Service",
            "category": "hardware",
            "badge": "Chip-Level Specialist",
            "description": "Complete sales, repair, and motherboard servicing for all brands of laptops, desktops, and Apple iMac/Mac Mini computers.",
            "turnaround": "Same Day / 24 Hours",
            "repair_warranty": "Up to 1-Year Guarantee",
            "features": [
                "Free preliminary counter inspection at Tatabad",
                "Certified motherboard & chip-level diagnostics",
                "Genuine parts for Dell, HP, Lenovo, Apple, Asus",
                "Display replacement, hinge repair, and battery change",
                "Pre-loaded genuine OS & vital drivers"
            ],
            "price": "",
            "icon_name": "Laptop",
            "sort_order": 1,
            "is_active": True,
            "created_at": now,
            "updated_at": now,
        },
        {
            "title": "Printers, CCTV Surveillance & Monitors",
            "category": "cctv_printers",
            "badge": "Setup & Service",
            "description": "On-site installation and counter servicing for all multifunction printers, HD night-vision CCTV systems, and PC gaming/office monitors.",
            "turnaround": "2 - 4 Hours",
            "repair_warranty": "Written Store Warranty",
            "features": [
                "Micro-toner and ink refilling for Epson & HP",
                "Paper jam & pickup roller replacement",
                "CP PLUS & Hikvision 4/8/16-channel CCTV setup",
                "Remote mobile live viewing configuration",
                "Monitor backlight and power supply circuit repair"
            ],
            "price": "",
            "icon_name": "Printer",
            "sort_order": 2,
            "is_active": True,
            "created_at": now,
            "updated_at": now,
        },
        {
            "title": "High-Speed Hardware & NVMe SSD Upgrades",
            "category": "upgrades",
            "badge": "Express 45-Mins",
            "description": "Supercharge slow computers. Crucial/Samsung NVMe SSD installations, RAM memory expansion, and thermal system overhaul.",
            "turnaround": "30 - 45 Minutes",
            "repair_warranty": "3 to 5-Year Hardware Warranty",
            "features": [
                "Zero data loss SSD cloning with exact Windows & apps",
                "DDR4 / DDR5 high-speed dual channel RAM expansion",
                "Internal thermal paste repasting (Arctic MX-4)",
                "Fan cleaning & heat-sink de-dusting",
                "Boot time reduced from 2 mins to under 15 seconds"
            ],
            "price": "",
            "icon_name": "Zap",
            "sort_order": 3,
            "is_active": True,
            "created_at": now,
            "updated_at": now,
        },
        {
            "title": "Office Networking & Structured LAN Cabling",
            "category": "networking",
            "badge": "Infrastructure",
            "description": "Enterprise and small business networking, Cat6 cabling, rack setup, gigabit switches, and seamless mesh Wi-Fi.",
            "turnaround": "Custom Schedule",
            "repair_warranty": "Installation Store Guarantee",
            "features": [
                "Structured Cat6 LAN cabling with patch panel dressing",
                "D-Link / Cisco managed switch & router installation",
                "Mesh Wi-Fi dead-zone elimination for homes & offices",
                "Bandwidth management & firewall security setup",
                "Doorstep troubleshooting for network drops"
            ],
            "price": "",
            "icon_name": "Network",
            "sort_order": 4,
            "is_active": True,
            "created_at": now,
            "updated_at": now,
        },
        {
            "title": "Clean-Room Hard Drive & SSD Data Recovery",
            "category": "data_recovery",
            "badge": "Strictly Confidential",
            "description": "Safe recovery of mission-critical photos, tally accounts, and documents from dead, clicking, formatted, or water-damaged storage drives.",
            "turnaround": "24 - 48 Hours",
            "repair_warranty": "100% Confidentiality NDA",
            "features": [
                "No Data = No Recovery Fee policy",
                "Damaged partition and corrupted file system recovery",
                "Mechanical click-of-death drive diagnostics",
                "Secure handover on encrypted external storage",
                "Direct counter consultation with data recovery engineer"
            ],
            "price": "",
            "icon_name": "Database",
            "sort_order": 5,
            "is_active": True,
            "created_at": now,
            "updated_at": now,
        },
        {
            "title": "Custom Gaming & Video Editing PC Builds",
            "category": "pc_builds",
            "badge": "Assembled Rig",
            "description": "Custom desktop computers tailored for esports gaming, 4K Premiere Pro editing, CAD architectural rendering, and office workstations.",
            "turnaround": "Same Day Delivery",
            "repair_warranty": "Up to 3 Years Component Warranty",
            "features": [
                "Intel Core i5/i7 & AMD Ryzen 5/7 optimized configurations",
                "NVIDIA RTX GPU installation with zero bottlenecking",
                "Custom cable management & ARGB lighting sync",
                "24-hour stress testing for zero crashes under load",
                "Component-by-component genuine brand GST invoices"
            ],
            "price": "",
            "icon_name": "Cpu",
            "sort_order": 6,
            "is_active": True,
            "created_at": now,
            "updated_at": now,
        },
        {
            "title": "Doorstep Site Visits & Annual Maintenance (AMC)",
            "category": "site_visit",
            "badge": "Doorstep Coimbatore",
            "description": "Cannot visit the store? Certified hardware engineer visits your doorstep with diagnostic toolkits and replacement spares.",
            "turnaround": "2-Hour Arrival Window",
            "repair_warranty": "Store Service Guarantee",
            "features": [
                "Site visits across all areas of Coimbatore",
                "85% of issues resolved right at your location",
                "Safe transit receipt provided for lab chip-level jobs",
                "Corporate and clinic Annual Maintenance Contracts (AMC)",
                "Transparent estimate before initiating work"
            ],
            "price": "",
            "icon_name": "Home",
            "sort_order": 7,
            "is_active": True,
            "created_at": now,
            "updated_at": now,
        }
    ])
    print("✅ Successfully seeded 7 services_catalog into MongoDB Atlas!")

print("Collections currently in Atlas:", db.list_collection_names())
