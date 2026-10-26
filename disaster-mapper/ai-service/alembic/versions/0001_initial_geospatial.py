"""Initial migration for extensions and geospatial tables.

Revision ID: 0001
Revises: 
Create Date: 2026-09-28 16:25:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '0001'
down_revision = None
branch_labels = None
depends_on = None

def upgrade() -> None:
    # Ensure extensions exist
    op.execute('CREATE EXTENSION IF NOT EXISTS postgis;')
    op.execute('CREATE EXTENSION IF NOT EXISTS vector;')
    op.execute('CREATE EXTENSION IF NOT EXISTS pgrouting;')
    
    # Create knowledge base tables
    op.create_table(
        'knowledge_documents',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('title', sa.String(), nullable=False),
        sa.Column('content', sa.String(), nullable=False),
        sa.Column('source', sa.String(), nullable=True),
        sa.Column('url', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    
    op.create_table(
        'document_chunks',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('document_id', sa.String(), nullable=False),
        sa.Column('content', sa.String(), nullable=False),
        sa.Column('embedding', sa.String(), nullable=True), # placeholder for vector since we might not have pgvector locally
        sa.ForeignKeyConstraint(['document_id'], ['knowledge_documents.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Actually if pgvector is available, we should use it
    op.execute('ALTER TABLE document_chunks ALTER COLUMN embedding TYPE vector(384) USING embedding::vector(384)')

    # Create OSM tables
    op.execute("""
    CREATE TABLE IF NOT EXISTS osm_roads (
        id VARCHAR PRIMARY KEY,
        osm_id VARCHAR,
        name VARCHAR,
        highway_type VARCHAR,
        oneway VARCHAR,
        maxspeed VARCHAR,
        geometry geometry(LineString, 4326)
    );
    """)

    op.execute("""
    CREATE TABLE IF NOT EXISTS osm_routing_nodes (
        id SERIAL PRIMARY KEY,
        osm_id VARCHAR,
        lat FLOAT,
        lon FLOAT,
        geometry geometry(Point, 4326)
    );
    """)
    
    # Add geometry columns to existing Prisma tables to fulfill "Convert canonical fields to native PostGIS"
    try:
        tables = [
            "Detection", "BuildingImpact", "RoadSegment", 
            "FloodZone", "SettlementImpact", "RescueZone"
        ]
        
        for table in tables:
            op.execute(f'ALTER TABLE "{table}" ADD COLUMN IF NOT EXISTS geom geometry(Geometry, 4326);')
            
            # Create trigger to automatically sync the Json column to the PostGIS geom column
            op.execute(f"""
            CREATE OR REPLACE FUNCTION sync_{table.lower()}_geom() RETURNS trigger AS $$
            BEGIN
                IF NEW.geometry IS NOT NULL THEN
                    NEW.geom := ST_SetSRID(ST_GeomFromGeoJSON(NEW.geometry::text), 4326);
                END IF;
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
            """)
            
            op.execute(f"""
            DROP TRIGGER IF EXISTS trg_sync_{table.lower()}_geom ON "{table}";
            CREATE TRIGGER trg_sync_{table.lower()}_geom
            BEFORE INSERT OR UPDATE OF geometry ON "{table}"
            FOR EACH ROW
            EXECUTE FUNCTION sync_{table.lower()}_geom();
            """)
            
            # Create GIST index
            op.execute(f'CREATE INDEX IF NOT EXISTS "idx_{table.lower()}_geom" ON "{table}" USING GIST (geom);')

    except Exception as e:
        print(f"Failed to alter Prisma tables (they might not exist yet): {e}")

def downgrade() -> None:
    pass
