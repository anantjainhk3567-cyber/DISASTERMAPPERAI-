from abc import ABC, abstractmethod
from typing import Any

class BaseDetector(ABC):
    @abstractmethod
    def detect(self, image_data: Any, latitude: float, longitude: float, **kwargs) -> list:
        pass
    
    @abstractmethod
    def get_model_version(self) -> str:
        pass
