from typing import Any
from app.inference.base import BaseDetector

class BuildingDamageDetector(BaseDetector):
    def detect(self, image_data: Any, latitude: float, longitude: float, **kwargs) -> list:
        raise NotImplementedError("Real model not loaded. Please use the DEMO provider.")
    
    def get_model_version(self) -> str:
        return "building-v1"
