import os
from sqlalchemy.orm import Session
from sentence_transformers import SentenceTransformer
from app.models import KnowledgeDocument, DocumentChunk

class RAGService:
    def __init__(self):
        # We use a lightweight local model if offline, or OpenAI if configured
        self.model_name = "all-MiniLM-L6-v2"
        self.encoder = None
        self._init_model()

    def _init_model(self):
        try:
            self.encoder = SentenceTransformer(self.model_name)
        except Exception as e:
            print(f"Failed to load sentence transformer: {e}")

    def ingest_document(self, db: Session, title: str, content: str, source: str = None, url: str = None):
        doc = KnowledgeDocument(title=title, content=content, source=source, url=url)
        db.add(doc)
        db.commit()
        db.refresh(doc)
        
        # Simple chunking
        chunk_size = 500
        chunks = [content[i:i+chunk_size] for i in range(0, len(content), chunk_size)]
        
        for text_chunk in chunks:
            if self.encoder:
                embedding = self.encoder.encode(text_chunk).tolist()
                chunk_record = DocumentChunk(
                    document_id=doc.id,
                    content=text_chunk,
                    embedding=embedding
                )
                db.add(chunk_record)
        
        db.commit()
        return doc.id

    def search(self, db: Session, query: str, limit: int = 5):
        if not self.encoder:
            return []
            
        query_embedding = self.encoder.encode(query).tolist()
        
        # Use pgvector's L2 distance operator (<->)
        results = db.query(DocumentChunk).order_by(
            DocumentChunk.embedding.l2_distance(query_embedding)
        ).limit(limit).all()
        
        return [
            {
                "content": r.content,
                "document": r.document.title,
                "source": r.document.source
            }
            for r in results
        ]

rag_service = RAGService()
