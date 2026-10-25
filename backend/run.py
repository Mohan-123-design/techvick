"""
TechMart Backend Launcher
=========================
Run this script to start the TechMart API Gateway & Microservices:
    python run.py
"""

import uvicorn
import os
import sys

# Ensure backend root is in python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    print(f"🚀 Starting TechMart Backend on port {port}...")
    print(f"📖 Swagger Docs will be available at http://localhost:{port}/docs")
    uvicorn.run("gateway.main:app", host="0.0.0.0", port=port, reload=True)
