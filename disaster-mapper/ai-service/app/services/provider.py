from abc import ABC, abstractmethod
from app.schemas.detection import (
    AnalyzeImageRequest, AnalyzeImageResponse,
    ChangeDetectionRequest, ChangeDetectionResponse,
    FloodSegmentRequest, FloodZoneResult,
    BuildingDetectRequest, BuildingResult,
    RoadAnalyzeRequest, RoadResult
)

class AIProvider(ABC):
    @abstractmethod
    def analyze_image(self, request: AnalyzeImageRequest) -> AnalyzeImageResponse:
        pass
        
    @abstractmethod
    def change_detection(self, request: ChangeDetectionRequest) -> ChangeDetectionResponse:
        pass
        
    @abstractmethod
    def segment_flood(self, request: FloodSegmentRequest) -> list[FloodZoneResult]:
        pass
        
    @abstractmethod
    def detect_buildings(self, request: BuildingDetectRequest) -> list[BuildingResult]:
        pass
        
    @abstractmethod
    def analyze_roads(self, request: RoadAnalyzeRequest) -> list[RoadResult]:
        pass

def get_provider(provider_type: str) -> AIProvider:
    p_type = provider_type.upper() if provider_type else 'ML'
    if p_type == 'ML':
        from app.services.ml_provider import MLProvider
        return MLProvider()
    elif p_type == 'REAL':
        from app.services.real_provider import RealProvider
        return RealProvider()
    else:
        from app.services.demo_provider import DemoProvider
        return DemoProvider()
