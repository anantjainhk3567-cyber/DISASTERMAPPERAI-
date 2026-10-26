"""
Model weights downloading, caching, and integrity validation utility.
"""
import os
import hashlib
import logging
from pathlib import Path
from typing import Optional, Tuple

logger = logging.getLogger(__name__)

CACHE_DIR = Path(os.getenv("MODEL_CACHE_DIR", Path(__file__).resolve().parent.parent.parent / "models" / "checkpoints"))
CACHE_DIR.mkdir(parents=True, exist_ok=True)


def calculate_sha256(file_path: Path) -> str:
    """Calculate SHA256 checksum of a file."""
    sha256_hash = hashlib.sha256()
    with open(file_path, "rb") as f:
        for byte_block in iter(lambda: f.read(65536), b""):
            sha256_hash.update(byte_block)
    return sha256_hash.hexdigest()


def verify_file_checksum(file_path: Path, expected_sha256: str) -> bool:
    """Check if file matches expected checksum."""
    if not file_path.exists():
        return False
    actual_hash = calculate_sha256(file_path)
    return actual_hash.lower() == expected_sha256.lower()


def get_cached_checkpoint_path(model_id: str, filename: str) -> Path:
    """Get the local cache path for a model checkpoint."""
    model_dir = CACHE_DIR / model_id
    model_dir.mkdir(parents=True, exist_ok=True)
    return model_dir / filename


def ensure_model_weights(
    model_id: str,
    weight_source: str,
    filename: str = "model.safetensors",
    expected_sha256: Optional[str] = None
) -> Tuple[bool, Optional[Path], str]:
    """
    Ensure weights are available locally.
    Attempts local cache first, then HuggingFace download if online.
    Returns: (is_available, local_path, status_message)
    """
    local_path = get_cached_checkpoint_path(model_id, filename)

    # Check if existing local file is valid
    if local_path.exists() and local_path.stat().st_size > 0:
        if expected_sha256:
            if verify_file_checksum(local_path, expected_sha256):
                return True, local_path, "Valid weights verified from local cache"
            else:
                logger.warning(f"Checksum mismatch for {model_id} at {local_path}. Re-download may be needed.")
        else:
            return True, local_path, "Weights available in local cache"

    # Attempt download if weight_source points to Hugging Face or URL
    if weight_source and not weight_source.startswith("local:"):
        try:
            from huggingface_hub import hf_hub_download
            logger.info(f"Attempting download of {weight_source} -> {filename}")
            downloaded = hf_hub_download(
                repo_id=weight_source,
                filename=filename,
                local_dir=CACHE_DIR / model_id,
                local_dir_use_symlinks=False
            )
            downloaded_path = Path(downloaded)
            return True, downloaded_path, f"Downloaded successfully from {weight_source}"
        except Exception as e:
            logger.info(f"HuggingFace download not available for {model_id} ({e}). Running in offline/fallback mode.")
            return False, None, f"Weights unavailable offline: {str(e)}"

    return False, None, "Weights not found in local cache"
