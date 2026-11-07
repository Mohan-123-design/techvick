import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    """Application configuration loaded from environment variables."""

    # Application
    APP_NAME: str = os.getenv("APP_NAME", "Techvick Computers")
    APP_VERSION: str = os.getenv("APP_VERSION", "1.0.0")
    DEBUG: bool = os.getenv("DEBUG", "true").lower() == "true"

    # MongoDB
    MONGODB_URI: str = os.getenv(
        "MONGODB_URI",
        "mongodb+srv://mmohan50594_db_user:BMRW2EVbNFQyRmhT@cluster0.0jgmjnk.mongodb.net/techvick?retryWrites=true&w=majority"
    )
    DATABASE_NAME: str = os.getenv("DATABASE_NAME", "techvick")

    # JWT Auth
    SECRET_KEY: str = os.getenv(
        "SECRET_KEY",
        "techvick_sec_9d8a3f1b4c7e62a05d8f2b1c4e7a0983bfd1e2a3c4b5e6f7a8b9c0d1e2f3a4b5"
    )
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(
        os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60")
    )

    # CORS
    ALLOWED_ORIGINS: list = os.getenv(
        "ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000"
    ).split(",")

    # Services Ports
    GATEWAY_PORT: int = int(os.getenv("GATEWAY_PORT", "8000"))
    PRODUCT_SERVICE_PORT: int = int(os.getenv("PRODUCT_SERVICE_PORT", "8001"))
    USER_SERVICE_PORT: int = int(os.getenv("USER_SERVICE_PORT", "8002"))
    ORDER_SERVICE_PORT: int = int(os.getenv("ORDER_SERVICE_PORT", "8003"))
    SERVICE_REQUEST_PORT: int = int(os.getenv("SERVICE_REQUEST_PORT", "8004"))
    NOTIFICATION_SERVICE_PORT: int = int(
        os.getenv("NOTIFICATION_SERVICE_PORT", "8005")
    )

    # Service URLs
    PRODUCT_SERVICE_URL: str = os.getenv(
        "PRODUCT_SERVICE_URL", "http://localhost:8001"
    )
    USER_SERVICE_URL: str = os.getenv(
        "USER_SERVICE_URL", "http://localhost:8002"
    )
    ORDER_SERVICE_URL: str = os.getenv(
        "ORDER_SERVICE_URL", "http://localhost:8003"
    )
    SERVICE_REQUEST_URL: str = os.getenv(
        "SERVICE_REQUEST_URL", "http://localhost:8004"
    )
    NOTIFICATION_SERVICE_URL: str = os.getenv(
        "NOTIFICATION_SERVICE_URL", "http://localhost:8005"
    )

    # File Upload
    UPLOAD_DIR: str = os.getenv("UPLOAD_DIR", "./uploads")
    MAX_FILE_SIZE: int = int(os.getenv("MAX_FILE_SIZE", "5242880"))  # 5MB


settings = Settings()
