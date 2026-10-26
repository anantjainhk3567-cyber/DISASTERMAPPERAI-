import random
import hashlib
from app.services.provider import AIProvider
from app.schemas.detection import (
    AnalyzeImageRequest, AnalyzeImageResponse,
    ChangeDetectionRequest, ChangeDetectionResponse,
    FloodSegmentRequest, FloodZoneResult,
    BuildingDetectRequest, BuildingResult,
    RoadAnalyzeRequest, RoadResult,
    DetectionResult, DetectionType, Severity, SettlementResult
)
from app.geospatial.utils import (
    create_point, create_polygon, create_linestring,
    generate_building_polygon, generate_flood_polygon,
    generate_road_linestring, offset_point
)

class DemoProvider(AIProvider):
    
    def _seed_random(self, *args):
        hash_str = "".join(str(a) for a in args).encode('utf-8')
        seed = int(hashlib.sha256(hash_str).hexdigest(), 16)
        random.seed(seed)

    def analyze_image(self, request: AnalyzeImageRequest) -> AnalyzeImageResponse:
        self._seed_random(request.latitude, request.longitude, request.disasterType)
        
        detections = []
        flood_zones = []
        roads = []
        buildings = []
        settlements = []
        
        num_buildings = random.randint(3, 5)
        num_roads = random.randint(2, 4)
        num_flood_zones = random.randint(1, 2)
        num_settlements = random.randint(1, 2)
        
        for _ in range(num_buildings):
            blat, blng = offset_point(request.latitude, request.longitude, random.uniform(-0.02, 0.02), random.uniform(-0.02, 0.02))
            dmg_level = random.choice(['NONE', 'MINOR', 'MODERATE', 'SEVERE', 'DESTROYED'])
            conf = random.uniform(0.7, 0.98)
            geom = generate_building_polygon(blat, blng)
            buildings.append(BuildingResult(damageLevel=dmg_level, confidence=conf, geometry=geom))
            
            # Also add a detection for this
            if dmg_level in ['MODERATE', 'SEVERE', 'DESTROYED']:
                d_type = DetectionType.DESTROYED_BUILDING if dmg_level == 'DESTROYED' else DetectionType.DAMAGED_BUILDING
                severity = Severity.HIGH if dmg_level == 'DESTROYED' else Severity.MEDIUM
                detections.append(DetectionResult(
                    type=d_type, confidence=conf, severity=severity, geometry=geom,
                    centroidLatitude=blat, centroidLongitude=blng
                ))

        for _ in range(num_roads):
            rlat, rlng = offset_point(request.latitude, request.longitude, random.uniform(-0.02, 0.02), random.uniform(-0.02, 0.02))
            end_lat, end_lng = offset_point(rlat, rlng, random.uniform(-0.01, 0.01), random.uniform(-0.01, 0.01))
            status = random.choice(['USABLE', 'PARTIALLY_BLOCKED', 'BLOCKED', 'DAMAGED'])
            conf = random.uniform(0.7, 0.95)
            geom = generate_road_linestring(rlat, rlng, end_lat, end_lng)
            roads.append(RoadResult(status=status, confidence=conf, geometry=geom))
            
            if status in ['PARTIALLY_BLOCKED', 'BLOCKED', 'DAMAGED']:
                d_type = DetectionType.BLOCKED_ROAD if status == 'BLOCKED' else DetectionType.DAMAGED_ROAD
                severity = Severity.HIGH if status == 'BLOCKED' else Severity.MEDIUM
                detections.append(DetectionResult(
                    type=d_type, confidence=conf, severity=severity, geometry=geom,
                    centroidLatitude=(rlat+end_lat)/2, centroidLongitude=(rlng+end_lng)/2
                ))

        if request.disasterType.upper() in ['FLOOD', 'CYCLONE']:
            for _ in range(num_flood_zones):
                flat, flng = offset_point(request.latitude, request.longitude, random.uniform(-0.03, 0.03), random.uniform(-0.03, 0.03))
                geom = generate_flood_polygon(flat, flng)
                conf = random.uniform(0.75, 0.98)
                severity = random.choice([Severity.MEDIUM, Severity.HIGH, Severity.CRITICAL])
                flood_zones.append(FloodZoneResult(geometry=geom, confidence=conf, severity=severity))
                detections.append(DetectionResult(
                    type=DetectionType.FLOODED_AREA, confidence=conf, severity=severity, geometry=geom,
                    centroidLatitude=flat, centroidLongitude=flng
                ))

        for _ in range(num_settlements):
            slat, slng = offset_point(request.latitude, request.longitude, random.uniform(-0.04, 0.04), random.uniform(-0.04, 0.04))
            geom = create_point(slat, slng)
            settlements.append(SettlementResult(geometry=geom, estimatedPopulation=random.randint(50, 500)))

        # Fill in generic detections to reach 8-15
        while len(detections) < random.randint(8, 15):
            dlat, dlng = offset_point(request.latitude, request.longitude, random.uniform(-0.05, 0.05), random.uniform(-0.05, 0.05))
            geom = create_point(dlat, dlng)
            d_type = random.choice(list(DetectionType))
            severity = random.choice([Severity.LOW, Severity.MEDIUM, Severity.HIGH])
            detections.append(DetectionResult(
                type=d_type, confidence=random.uniform(0.7, 0.95), severity=severity, geometry=geom,
                centroidLatitude=dlat, centroidLongitude=dlng
            ))

        return AnalyzeImageResponse(
            detections=detections, floodZones=flood_zones, roads=roads, 
            buildings=buildings, settlements=settlements
        )
        
    def change_detection(self, request: ChangeDetectionRequest) -> ChangeDetectionResponse:
        self._seed_random(request.latitude, request.longitude, request.disasterType, "change")
        
        changes = []
        new_damage = []
        new_flooding = []
        
        for _ in range(random.randint(2, 5)):
            lat, lng = offset_point(request.latitude, request.longitude, random.uniform(-0.02, 0.02), random.uniform(-0.02, 0.02))
            geom = generate_building_polygon(lat, lng)
            res = DetectionResult(
                type=DetectionType.DESTROYED_BUILDING, confidence=random.uniform(0.8, 0.99),
                severity=Severity.HIGH, geometry=geom, centroidLatitude=lat, centroidLongitude=lng
            )
            changes.append(res)
            new_damage.append(res)
            
        for _ in range(random.randint(1, 2)):
            lat, lng = offset_point(request.latitude, request.longitude, random.uniform(-0.03, 0.03), random.uniform(-0.03, 0.03))
            geom = generate_flood_polygon(lat, lng)
            res = FloodZoneResult(geometry=geom, confidence=random.uniform(0.7, 0.9), severity=Severity.MEDIUM)
            new_flooding.append(res)
            
        return ChangeDetectionResponse(changes=changes, newDamage=new_damage, newFlooding=new_flooding)
        
    def segment_flood(self, request: FloodSegmentRequest) -> list[FloodZoneResult]:
        self._seed_random(request.latitude, request.longitude, "flood")
        res = []
        for _ in range(random.randint(1, 3)):
            lat, lng = offset_point(request.latitude, request.longitude, random.uniform(-0.03, 0.03), random.uniform(-0.03, 0.03))
            geom = generate_flood_polygon(lat, lng)
            res.append(FloodZoneResult(geometry=geom, confidence=random.uniform(0.7, 0.98), severity=Severity.MEDIUM))
        return res
        
    def detect_buildings(self, request: BuildingDetectRequest) -> list[BuildingResult]:
        self._seed_random(request.latitude, request.longitude, "buildings")
        res = []
        for _ in range(random.randint(3, 8)):
            lat, lng = offset_point(request.latitude, request.longitude, random.uniform(-0.02, 0.02), random.uniform(-0.02, 0.02))
            geom = generate_building_polygon(lat, lng)
            res.append(BuildingResult(
                damageLevel=random.choice(['NONE', 'MINOR', 'MODERATE', 'SEVERE', 'DESTROYED']),
                confidence=random.uniform(0.7, 0.98), geometry=geom
            ))
        return res
        
    def analyze_roads(self, request: RoadAnalyzeRequest) -> list[RoadResult]:
        self._seed_random(request.latitude, request.longitude, "roads")
        res = []
        for _ in range(random.randint(2, 5)):
            lat, lng = offset_point(request.latitude, request.longitude, random.uniform(-0.02, 0.02), random.uniform(-0.02, 0.02))
            end_lat, end_lng = offset_point(lat, lng, random.uniform(-0.01, 0.01), random.uniform(-0.01, 0.01))
            geom = generate_road_linestring(lat, lng, end_lat, end_lng)
            res.append(RoadResult(
                status=random.choice(['USABLE', 'PARTIALLY_BLOCKED', 'BLOCKED', 'DAMAGED']),
                confidence=random.uniform(0.7, 0.95), geometry=geom
            ))
        return res
