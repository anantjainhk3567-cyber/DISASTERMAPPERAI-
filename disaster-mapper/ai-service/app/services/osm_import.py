import os
import requests
from geoalchemy2.shape import from_shape
from shapely.geometry import LineString, Point
from app.database import SessionLocal
from app.models import OSMRoad, OSMRoutingNode

class OSMImporter:
    def __init__(self):
        self.overpass_url = "http://overpass-api.de/api/interpreter"

    def import_bbox(self, min_lat: float, min_lon: float, max_lat: float, max_lon: float):
        query = f"""
        [out:json];
        (
          way["highway"]({min_lat},{min_lon},{max_lat},{max_lon});
        );
        (._;>;);
        out body;
        """
        response = requests.post(self.overpass_url, data={'data': query})
        if response.status_code != 200:
            raise Exception("Failed to fetch from Overpass API")
            
        data = response.json()
        
        nodes = {}
        ways = []
        
        for element in data['elements']:
            if element['type'] == 'node':
                nodes[element['id']] = (element['lon'], element['lat'])
            elif element['type'] == 'way':
                ways.append(element)
                
        db = SessionLocal()
        try:
            for way in ways:
                coords = [nodes[node_id] for node_id in way['nodes'] if node_id in nodes]
                if len(coords) < 2:
                    continue
                    
                geom = LineString(coords)
                tags = way.get('tags', {})
                
                road = OSMRoad(
                    osm_id=str(way['id']),
                    name=tags.get('name'),
                    highway_type=tags.get('highway'),
                    oneway=tags.get('oneway'),
                    maxspeed=tags.get('maxspeed'),
                    geometry=from_shape(geom, srid=4326)
                )
                db.add(road)
                
                # Add nodes for routing
                for node_id in way['nodes']:
                    if node_id in nodes:
                        lon, lat = nodes[node_id]
                        routing_node = OSMRoutingNode(
                            osm_id=str(node_id),
                            lat=lat,
                            lon=lon,
                            geometry=from_shape(Point(lon, lat), srid=4326)
                        )
                        db.add(routing_node)
            
            db.commit()
            return len(ways)
        except Exception as e:
            db.rollback()
            raise e
        finally:
            db.close()

osm_importer = OSMImporter()
