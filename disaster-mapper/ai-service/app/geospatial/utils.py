import math
import random
from app.schemas.detection import GeoJSONGeometry

def create_point(lat: float, lng: float) -> GeoJSONGeometry:
    return GeoJSONGeometry(type="Point", coordinates=[lng, lat])

def create_polygon(coords: list[list[float]]) -> GeoJSONGeometry:
    return GeoJSONGeometry(type="Polygon", coordinates=[coords])

def create_linestring(coords: list[list[float]]) -> GeoJSONGeometry:
    return GeoJSONGeometry(type="LineString", coordinates=coords)

def offset_point(lat: float, lng: float, offset_lat: float, offset_lng: float) -> tuple[float, float]:
    return lat + offset_lat, lng + offset_lng

def generate_building_polygon(center_lat: float, center_lng: float, size: float = 0.001) -> GeoJSONGeometry:
    half = size / 2.0
    coords = [
        [center_lng - half, center_lat - half],
        [center_lng + half, center_lat - half],
        [center_lng + half, center_lat + half],
        [center_lng - half, center_lat + half],
        [center_lng - half, center_lat - half]  # Close polygon
    ]
    return create_polygon(coords)

def generate_flood_polygon(center_lat: float, center_lng: float, radius: float = 0.01, num_points: int = 8) -> GeoJSONGeometry:
    coords = []
    angle_step = 2 * math.pi / num_points
    for i in range(num_points):
        angle = i * angle_step
        r = radius * random.uniform(0.7, 1.3)  # Irregularity
        offset_lat = r * math.sin(angle)
        offset_lng = r * math.cos(angle)
        coords.append([center_lng + offset_lng, center_lat + offset_lat])
    
    if coords:
        coords.append(coords[0])  # Close polygon
        
    return create_polygon(coords)

def generate_road_linestring(start_lat: float, start_lng: float, end_lat: float, end_lng: float) -> GeoJSONGeometry:
    coords = [
        [start_lng, start_lat],
        [start_lng + (end_lng - start_lng) / 2 + random.uniform(-0.002, 0.002), start_lat + (end_lat - start_lat) / 2 + random.uniform(-0.002, 0.002)],
        [end_lng, end_lat]
    ]
    return create_linestring(coords)
