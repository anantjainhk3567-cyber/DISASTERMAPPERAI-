from sqlalchemy import Column, String, Float, Integer, JSON, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from geoalchemy2 import Geometry
from pgvector.sqlalchemy import Vector
from app.database import Base
from datetime import datetime
import uuid

def generate_uuid():
    return str(uuid.uuid4())

class KnowledgeDocument(Base):
    __tablename__ = 'knowledge_documents'
    
    id = Column(String, primary_key=True, default=generate_uuid)
    title = Column(String, nullable=False)
    content = Column(String, nullable=False)
    source = Column(String)
    url = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

class DocumentChunk(Base):
    __tablename__ = 'document_chunks'
    
    id = Column(String, primary_key=True, default=generate_uuid)
    document_id = Column(String, ForeignKey('knowledge_documents.id'), nullable=False)
    content = Column(String, nullable=False)
    embedding = Column(Vector(384)) # For all-MiniLM-L6-v2
    
    document = relationship("KnowledgeDocument")

class OSMRoad(Base):
    __tablename__ = 'osm_roads'
    
    id = Column(String, primary_key=True, default=generate_uuid)
    osm_id = Column(String, index=True)
    name = Column(String)
    highway_type = Column(String)
    oneway = Column(String)
    maxspeed = Column(String)
    geometry = Column(Geometry('LINESTRING', srid=4326))
    
class OSMRoutingNode(Base):
    __tablename__ = 'osm_routing_nodes'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    osm_id = Column(String, index=True)
    lat = Column(Float)
    lon = Column(Float)
    geometry = Column(Geometry('POINT', srid=4326))
