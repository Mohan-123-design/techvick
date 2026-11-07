# 🌐 Free Cloud Hosting & Deployment Guide

This guide provides simple, step-by-step instructions to host the entire **Techvick Computers** application on the internet for **100% free** without any credit card requirement or complicated server configuration.

---

## 📋 Overview of the Free Hosting Architecture

```
┌─────────────────────────────────┐      ┌─────────────────────────────────┐      ┌─────────────────────────────────┐
│     Frontend (React SPA)        │      │    Backend (FastAPI Gateway)    │      │       Database (MongoDB)        │
│          Hosted on              │ ───► │            Hosted on            │ ───► │            Hosted on            │
│         VERCEL / NETLIFY        │      │           RENDER.COM            │      │          MONGODB ATLAS          │
│       (Free Forever Tier)       │      │       (Free Web Service)        │      │       (M0 Free Tier 512MB)      │
└─────────────────────────────────┘      └─────────────────────────────────┘      └─────────────────────────────────┘
```

---

## STEP 1: Push Project to GitHub

1. Create a free account on [GitHub.com](https://github.com) if you do not have one.
2. Click **"+" (top right) -> "New repository"**.
3. Name your repository (e.g., `techvick-store`), keep it **Public**, and click **"Create repository"** without adding a README or .gitignore (they already exist in this project).
4. In your terminal / command prompt, run the following commands inside this project directory:

```bash
# Initialize git
git init

# Add all project files
git add .

# Create initial commit
git commit -m "Initial commit: Techvick Computers full-stack sales & service store"

# Set main branch
git branch -M main

# Link your GitHub repository (replace with your actual GitHub URL)
git remote add origin https://github.com/YOUR_USERNAME/techvick-store.git

# Push to GitHub
git push -u origin main
```

---

## STEP 2: Setup Free Cloud Database (MongoDB Atlas)

MongoDB Atlas gives you 512MB of cloud database storage for free forever.

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) and sign up for a free account.
2. When prompted to select a plan, choose the **M0 Free Cluster** (Shared).
3. Select any cloud provider and region closest to you (e.g., AWS / Mumbai or Frankfurt).
4. Click **Create Deployment**.
5. **Security & Network Access Setup (CRITICAL)**:
   - **Network Access (IP Whitelist)**:
     - On the left sidebar of MongoDB Atlas, click **"Network Access"** under **Security**.
     - Click the green button **"Add IP Address"**.
     - Click **"Allow Access from Anywhere"** (this sets `0.0.0.0/0`).
     - Click **"Confirm"**. Wait ~30 seconds until the status turns active green.
     - *(Note: Without `0.0.0.0/0`, Atlas will reject requests from your computer and cloud servers with network timeout/connection closed errors!)*
   - **Database User**:
     - On the left sidebar, click **"Database Access"**.
     - Verify your user exists (e.g., `mmohan50594_db_user`) with **Read and write to any database** privileges.
6. **Get Connection String**:
   - Go to **Database** -> Click **"Connect"** on your cluster.
   - Choose **"Drivers"** (Python).
   - Copy the connection URI. It will look like:
     ```
     mongodb+srv://techvick_admin:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
     ```
   - Replace `<password>` with your real password.
   - Append your database name before the `?`:
     ```
     mongodb+srv://techvick_admin:MySecret123@cluster0.abcde.mongodb.net/techvick?retryWrites=true&w=majority
     ```

---

## STEP 3: Deploy Backend Microservices to Render.com (Free)

[Render.com](https://render.com) provides free cloud web services for Python applications.

1. Sign up for free at [render.com](https://render.com) using your GitHub account.
2. In your Render Dashboard, click **"New +" -> "Web Service"**.
3. Connect your GitHub repository (`techvick-store`).
4. Configure the Web Service settings:
   - **Name**: `techvick-backend`
   - **Region**: Choose the closest region (e.g., Singapore, Frankfurt, or Oregon).
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**:
     ```bash
     python run.py
     ```
     *(Or: `uvicorn gateway.main:app --host 0.0.0.0 --port $PORT` — ensure there is NO trailing backtick ` at the end!)*
   - **Instance Type**: Select **"Free"** ($0/month).
5. Scroll down to **"Environment Variables"** and add:
   | Key | Value | Description |
   |---|---|---|
   | `PYTHON_VERSION` | `3.11.9` | **Essential**: Forces Render to use stable Python 3.11 with pre-built binary wheels |
   | `MONGODB_URI` | `mongodb+srv://mmohan50594_db_user:BMRW2EVbNFQyRmhT@cluster0.0jgmjnk.mongodb.net/techvick?retryWrites=true&w=majority` | Your MongoDB Atlas connection URI (ensure NO spaces!) |
   | `DATABASE_NAME` | `techvick` | MongoDB Database Name |
   | `SECRET_KEY` | `techvick_sec_9d8a3f1b4c7e62a05d8f2b1c4e7a0983bfd1e2a3c4b5e6f7a8b9c0d1e2f3a4b5` | Cryptographically secure 256-bit JWT secret |
   | `DEBUG` | `false` | Production mode |
6. Click **"Deploy Web Service"**.
7. In a few minutes, Render will build your application and give you a free public URL:
   ```
   https://techvick-backend.onrender.com
   ```
   *(Test it in your browser: `https://techvick-backend.onrender.com/docs` will open the live Swagger API docs!)*

---

## STEP 4: Deploy Frontend to Vercel (Free)

[Vercel](https://vercel.com) provides instant global edge CDN hosting with automatic SSL certificates for React applications.

1. Sign up for free at [vercel.com](https://vercel.com) using your GitHub account.
2. Click **"Add New..." -> "Project"**.
3. Import your GitHub repository (`techvick-store`).
4. Configure the project:
   - **Framework Preset**: `Vite` (automatically detected).
   - **Root Directory**: Click "Edit" and choose `frontend`.
5. Expand **"Environment Variables"** and add:
   | Key | Value |
   |---|---|
   | `VITE_API_URL` | `https://techvick-backend.onrender.com` (Your backend Render URL from Step 3) |
6. Click **"Deploy"**.
7. In under 60 seconds, your site will be live on a fast global URL:
   ```
   https://techvick-store.vercel.app
   ```

---

## STEP 5: Verify Your Live Store & Services

Once deployed, test all functionality:
1. **Browse Hardware**: Visit `/products` to filter laptops, desktops, printers, and CCTV kits.
2. **Add to Cart & Checkout**: Choose between free In-Store Pickup or Doorstep Delivery.
3. **Book a Service**: Visit `/book-service` to test the live estimate calculator and schedule a technician site visit or store drop-off.
4. **Warranty Portal**: Visit `/warranty` and test serial lookup with sample serials like `TVC-LAP-2024-001`.
5. **Contact**: Submit an inquiry on `/contact`.

---

## 💡 Troubleshooting & Tips

- **Render Cold Start**: On the free tier, Render spins down web services after 15 minutes of inactivity. The first request after sleep may take ~30 seconds to wake up. Techvick's frontend includes automatic fallback mock data so the user never sees a broken page!
- **CORS Notice**: If you host the frontend on a custom domain, ensure your backend's `ALLOWED_ORIGINS` environment variable in Render includes your frontend domain.
- **Custom Domains**: Both Vercel and Render allow you to link your own free or paid custom domain (e.g., `techvick.in` or `techvick.com`) with automated free SSL certificates.
