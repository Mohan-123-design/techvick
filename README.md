# 🖥️ TechMart — Computer, Peripherals & Security Sales & Service Platform

[![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20FastAPI%20%7C%20MongoDB-blue.svg)](#architecture)
[![Architecture](https://img.shields.io/badge/Architecture-Microservices%20with%20API%20Gateway-green.svg)](#microservices-architecture)
[![Focus](https://img.shields.io/badge/Focus-Laptops%20%7C%20Desktops%20%7C%20Printers%20%7C%20CCTV-orange.svg)](#core-focus)

A full-stack, enterprise-grade e-commerce and IT service management platform tailored specifically for computer hardware, peripherals, and security surveillance equipment. Built with **React 19**, **FastAPI (Python)**, and **MongoDB**, featuring offline store management, doorstep technician site visits, live cost calculators, product warranty tracking, and shopping cart checkout.

> [!IMPORTANT]
> **Strict Focus**: Dedicated to **Laptops, Desktops, Enterprise Servers, Printers, CCTV/Cameras, Networking Equipment, and Peripherals**. Mobile phones are explicitly excluded to maintain pure computer specialist excellence.

---

## 🌟 Key Features

### 🛒 1. Hardware Sales & Catalog
- **Categories**: Laptops, Desktops, Servers, Printers, CCTV & Security Cameras, Networking, Accessories.
- **Filtering & Search**: Dynamic instant search, category filters, brand filters, and price range sliders.
- **Detailed Specifications**: Technical specs modal displaying CPU, RAM, storage, warranty, and offline store shelf availability.
- **Cart & Order System**: Supports both **In-Store Pickup (Free ready in 2 hours)** and **Doorstep Delivery**.

### 🔧 2. Affordable Repair & Service Solutions
- **Chip-Level Repairs**: Motherboard BGA rework, hinge repairs, liquid damage ultrasonic cleaning, and RAM/SSD upgrades.
- **Printer & CCTV Care**: Toner refilling, printhead replacement, and multi-channel CCTV surveillance deployment.
- **Lowest Cost Philosophy**: Transparent component-level pricing starting at ₹199 with zero hidden fees.
- **90-Day Repair Guarantee**: Free warranty on all repaired components and labor.

### 🏠 3. Doorstep Site Visit vs. Offline Store Walk-In
- **Offline Store**: Experience hands-on hardware testing and instant counter diagnostic inspections at the showroom.
- **Doorstep Site Visit**: Certified mobile technicians dispatched to residences or offices for bulky PCs, CCTV networks, and Wi-Fi cabling.
- **Interactive Booking Form**: Real-time cost estimator calculating base labor, doorstep visit fees, and emergency 2-hour dispatch.

### 🛡️ 4. Product Warranty Lookup & Claim Portal
- **Instant Serial Number Search**: Query warranty records using serial number, invoice number, or registered phone number.
- **Live Countdown Timeline**: Visual progress bar indicating active days remaining vs. expired status.
- **Online Claim Submission**: File doorstep warranty claims or register store drop-offs directly from the portal.

---

## 🏗️ Architecture

```
                                  ┌───────────────────────────┐
                                  │   React 19 SPA Frontend   │
                                  │   (Vite + React Router)   │
                                  └─────────────┬─────────────┘
                                                │ REST API / JSON
                                                ▼
                                  ┌───────────────────────────┐
                                  │    FastAPI API Gateway    │
                                  │     (Port 8000 / CORS)    │
                                  └─────────────┬─────────────┘
                                                │
         ┌───────────────────────┬──────────────┴──────────────┬───────────────────────┐
         ▼                       ▼                             ▼                       ▼
┌──────────────────┐   ┌──────────────────┐          ┌──────────────────┐   ┌──────────────────┐
│ Product Service  │   │   User Service   │          │  Order Service   │   │ Service Request  │
│  (Catalog & DB)  │   │  (Auth & Profile)│          │ (Checkout/Status)│   │ (Book & Warranty)│
└────────┬─────────┘   └────────┬─────────┘          └────────┬─────────┘   └────────┬─────────┘
         │                      │                             │                      │
         └──────────────────────┴──────────────┬──────────────┴──────────────────────┘
                                               ▼
                                  ┌───────────────────────────┐
                                  │      MongoDB Database     │
                                  │ (Atlas Free / Local Mongo)│
                                  └───────────────────────────┘
```

---

## 📁 Project Directory Structure

```
├── frontend/                     # React 19 Single Page Application
│   ├── public/                   # Static assets & icons
│   ├── src/
│   │   ├── assets/               # Images and SVGs
│   │   ├── components/           # Reusable UI components
│   │   │   └── layout/           # Navbar, Footer
│   │   ├── constants/            # Store info, categories, mock fallback data
│   │   ├── context/              # CartContext state provider
│   │   ├── pages/                # Home, Products, Services, BookService, Warranty, About, Contact, Cart
│   │   ├── styles/               # CSS Design tokens & variables
│   │   ├── utils/                # Axios API client with automatic offline fallback
│   │   ├── App.jsx               # Application routes & provider wrapper
│   │   ├── main.jsx              # Application bootstrap
│   │   └── index.css             # Global dark-mode glassmorphic design system
│   ├── package.json
│   └── vite.config.js
│
├── backend/                      # Python FastAPI Microservices
│   ├── common/                   # Shared utilities, auth, config & DB drivers
│   │   ├── auth.py               # JWT password hashing & validation
│   │   ├── config.py             # Pydantic environment settings
│   │   ├── database.py           # Motor async MongoDB client
│   │   └── utils.py              # Constants, helpers, and schemas
│   ├── gateway/                  # Central API Gateway aggregating all services
│   │   └── main.py               # Root FastAPI app, CORS, routes & seed data
│   ├── services/                 # Microservice submodules
│   │   ├── product_service/      # Product catalog, categories & brands
│   │   ├── user_service/         # User auth, profile, newsletter & contact
│   │   ├── order_service/        # Order placement & fulfillment tracking
│   │   └── service_request/      # Repair bookings, site visits & warranty claims
│   ├── .env.example              # Sample environment configuration
│   ├── requirements.txt          # Python dependencies
│   └── run.py                    # One-command backend launcher
│
├── DEPLOYMENT_GUIDE.md           # Step-by-step 100% Free Cloud Hosting Guide
└── README.md                     # Project overview and run guide
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- **Node.js** (v18+)
- **Python** (v3.10+)
- **MongoDB** (Optional: local instance or free MongoDB Atlas cloud cluster; built-in mock fallback operates if MongoDB is offline)

### 1. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```
The React application will launch at `http://localhost:5173`.

### 2. Start the Backend API Gateway
```bash
cd backend
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
python run.py
```
The backend API Gateway will launch on `http://localhost:8000`.
- Interactive Swagger API Documentation: `http://localhost:8000/docs`
- ReDoc Documentation: `http://localhost:8000/redoc`

---

## 🌐 100% Free Web Hosting Instructions

You can host this entire stack for **$0 / month** using modern free-tier cloud platforms without complex DevOps:

| Component | Free Platform | Tier Specs |
|---|---|---|
| **Database** | [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) | 512 MB storage, shared RAM, free forever |
| **Backend** | [Render.com](https://render.com) | Free Web Service with automated GitHub deployment |
| **Frontend** | [Vercel](https://vercel.com) or [Netlify](https://netlify.com) | Unlimited static hosting, CDN, automated preview URLs |

👉 **Read the complete, step-by-step walkthrough in [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md).**

---

## 📄 License
This project is open-source under the MIT License.
