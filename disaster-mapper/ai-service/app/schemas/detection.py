from pydantic import BaseModel
from typing import Optional, Any
from enum import Enum

class DetectionType(str, Enum):
    DAMAGED_BUILDING = 'DAMAGED_BUILDING'
    PARTIAL_BUILDING_DAMAGE = 'PARTIAL_BUILDING_DAMAGE'
    DESTROYED_BUILDING = 'DESTROYED_BUILDING'
    BLOCKED_ROAD = 'BLOCKED_ROAD'
    DAMAGED_ROAD = 'DAMAGED_ROAD'
    USABLE_ROAD = 'USABLE_ROAD'
    FLOODED_AREA = 'FLOODED_AREA'
    ISOLATED_SETTLEMENT = 'ISOLATED_SETTLEMENT'
    DEBRIS = 'DEBRIS'
    CRITICAL_INFRASTRUCTURE = 'CRITICAL_INFRASTRUCTURE'

class Severity(str, Enum):
    LOW = 'LOW'
    MEDIUM = 'MEDIUM'
    HIGH = 'HIGH'
    CRITICAL = 'CRITICAL'

class GeoJSONGeometry(BaseModel):
    type: str  # Point, Polygon, LineString, MultiPolygon
    coordinates: Any

class DetectionResult(BaseModel):
    type: DetectionType
    confidence: float
    severity: Severity
    geometry: GeoJSONGeometry
    centroidLatitude: float
    centroidLongitude: float
    properties: Optional[dict] = None

class BuildingResult(BaseModel):
    damageLevel: str  # NONE, MINOR, MODERATE, SEVERE, DESTROYED
    confidence: float
    geometry: GeoJSONGeometry
    estimatedOccupants: Optional[int] = None
    criticality: str = 'NORMAL'

class RoadResult(BaseModel):
    name: Optional[str] = None
    roadType: str = 'LOCAL'
    geometry: GeoJSONGeometry
    status: str  # USABLE, PARTIALLY_BLOCKED, BLOCKED, DAMAGED
    confidence: float
    width: Optional[float] = None

class FloodZoneResult(BaseModel):
    geometry: GeoJSONGeometry
    confidence: float
    severity: Severity
    estimatedArea: Optional[float] = None
    estimatedDepth: Optional[float] = None

class SettlementResult(BaseModel):
    geometry: GeoJSONGeometry
    estimatedPopulation: Optional[int] = None
    isolationScore: float = 0.0
    severity: Severity = Severity.MEDIUM

# Request models
class AnalyzeImageRequest(BaseModel):
    imageUrl: str
    disasterType: str
    latitude: float
    longitude: float
    metadata: Optional[dict] = None

class ChangeDetectionRequest(BaseModel):
    beforeImageUrl: str
    afterImageUrl: str
    disasterType: str
    latitude: float
    longitude: float

class FloodSegmentRequest(BaseModel):
    imageUrl: str
    latitude: float
    longitude: float

class BuildingDetectRequest(BaseModel):
    imageUrl: str
    latitude: float
    longitude: float
    disasterType: str

class RoadAnalyzeRequest(BaseModel):
    imageUrl: str
    latitude: float
    longitude: float
    disasterType: str

# Response models
class AnalyzeImageResponse(BaseModel):
    detections: list[DetectionResult]
    floodZones: list[FloodZoneResult]
    roads: list[RoadResult]
    buildings: list[BuildingResult]
    settlements: list[SettlementResult]
    modelVersion: str = 'disastermapper-v1'

class ChangeDetectionResponse(BaseModel):
    changes: list[DetectionResult]
    newDamage: list[DetectionResult]
    newFlooding: list[FloodZoneResult]
    modelVersion: str = 'disastermapper-v1'
