import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    AI_PROVIDER: str = os.getenv('AI_PROVIDER', 'ML')  # ML, REAL (Heuristic), or DEMO
    MODEL_PATH: str = os.getenv('MODEL_PATH', './models')
    HOST: str = os.getenv('HOST', '0.0.0.0')
    PORT: int = int(os.getenv('PORT', '8000'))
    MAX_IMAGE_SIZE: int = 50 * 1024 * 1024  # 50MB
    LOG_LEVEL: str = os.getenv('LOG_LEVEL', 'info')

settings = Settings()
