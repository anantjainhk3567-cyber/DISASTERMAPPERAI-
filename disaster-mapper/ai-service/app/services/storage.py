import os
import io
from minio import Minio
from minio.error import S3Error
from app.config import settings

class StorageService:
    def __init__(self):
        self.endpoint = getattr(settings, 'STORAGE_ENDPOINT', 'minio:9000')
        self.access_key = getattr(settings, 'STORAGE_ACCESS_KEY', 'minioadmin')
        self.secret_key = getattr(settings, 'STORAGE_SECRET_KEY', 'minioadmin')
        self.bucket = getattr(settings, 'STORAGE_BUCKET', 'disastermapper')
        
        # In production, secure should be True if using HTTPS
        self.client = Minio(
            self.endpoint,
            access_key=self.access_key,
            secret_key=self.secret_key,
            secure=False
        )
        
        self._ensure_bucket()

    def _ensure_bucket(self):
        try:
            if not self.client.bucket_exists(self.bucket):
                self.client.make_bucket(self.bucket)
        except Exception as e:
            print(f"Error ensuring bucket exists: {e}")

    def upload_file(self, file_path: str, object_name: str):
        try:
            self.client.fput_object(self.bucket, object_name, file_path)
            return True
        except S3Error as e:
            print(f"Upload failed: {e}")
            return False

    def upload_bytes(self, data: bytes, object_name: str, content_type: str = "application/octet-stream"):
        try:
            self.client.put_object(
                self.bucket, 
                object_name, 
                io.BytesIO(data), 
                len(data),
                content_type=content_type
            )
            return True
        except S3Error as e:
            print(f"Upload bytes failed: {e}")
            return False

    def get_presigned_url(self, object_name: str, expires_delta=3600):
        try:
            return self.client.presigned_get_object(self.bucket, object_name, expires=expires_delta)
        except S3Error as e:
            print(f"Failed to generate presigned URL: {e}")
            return None

storage_service = StorageService()
