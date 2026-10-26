"""
Schemas for Model Registry, Metadata, and Execution Status.
"""
from enum import Enum
from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field
from datetime import datetime


class ModelStatus(str, Enum):
    PRETRAINED_READY = "PRETRAINED_READY"
    FINE_TUNED_READY = "FINE_TUNED_READY"
    TRAINING_REQUIRED = "TRAINING_REQUIRED"
    CHECKPOINT_MISSING = "CHECKPOINT_MISSING"
    EXPERIMENTAL = "EXPERIMENTAL"
    FAILED = "FAILED"
    UNLOADED = "UNLOADED"
    LOADING = "LOADING"


class ModelInferenceMode(str, Enum):
    REAL_MODEL = "REAL_MODEL"
    EXPERIMENTAL = "EXPERIMENTAL"
    HEURISTIC = "HEURISTIC"
    HEURISTIC_RULE_BASED = "HEURISTIC_RULE_BASED"
    STATISTICAL_BASELINE = "STATISTICAL_BASELINE"
    SIMULATED_SCENARIO = "SIMULATED_SCENARIO"
    DEMO_FALLBACK = "DEMO_FALLBACK"


class ModalityType(str, Enum):
    SENTINEL1_SAR = "SENTINEL1_SAR"
    SENTINEL2_OPTICAL = "SENTINEL2_OPTICAL"
    DRONE_HIGH_RES_RGB = "DRONE_HIGH_RES_RGB"
    SATELLITE_RGB = "SATELLITE_RGB"
    MULTISPECTRAL = "MULTISPECTRAL"
    TABULAR_GIS = "TABULAR_GIS"
    MULTIMODAL_TEXT_IMAGE = "MULTIMODAL_TEXT_IMAGE"
    TIME_SERIES = "TIME_SERIES"


class DeviceType(str, Enum):
    CPU = "CPU"
    CUDA = "CUDA"
    MPS = "MPS"


class EvaluationMetrics(BaseModel):
    iou: Optional[float] = Field(None, description="Intersection over Union")
    dice: Optional[float] = Field(None, description="Dice coefficient / F1")
    precision: Optional[float] = Field(None, description="Precision score")
    recall: Optional[float] = Field(None, description="Recall score")
    f1_score: Optional[float] = Field(None, description="Harmonic mean of precision and recall")
    auroc: Optional[float] = Field(None, description="Area under ROC curve")
    auprc: Optional[float] = Field(None, description="Area under PR curve")
    mae: Optional[float] = Field(None, description="Mean Absolute Error")
    rmse: Optional[float] = Field(None, description="Root Mean Squared Error")
    per_class_f1: Optional[Dict[str, float]] = Field(None, description="Class-specific F1 scores")
    benchmark_dataset: Optional[str] = Field(None, description="Evaluation benchmark dataset reference")
    evaluation_date: Optional[str] = Field(None, description="Date evaluated")


class ModelMetadata(BaseModel):
    id: str = Field(..., description="Unique model identifier")
    name: str = Field(..., description="Human-readable model name")
    version: str = Field(..., description="Semantic version string")
    task: str = Field(..., description="Task type, e.g., flood_segmentation, building_damage")
    architecture: str = Field(..., description="Neural network or model architecture")
    weight_source: str = Field(..., description="URL or HuggingFace repo of weights")
    checksum_sha256: Optional[str] = Field(None, description="SHA256 checksum of weights file")
    training_dataset: str = Field(..., description="Primary training dataset (e.g. Sen1Floods11, xBD)")
    supported_modalities: List[ModalityType] = Field(default_factory=list, description="Supported imagery/data modalities")
    licensing: str = Field(..., description="License (e.g. MIT, CC-BY-4.0, Apache-2.0)")
    input_requirements: Dict[str, Any] = Field(default_factory=dict, description="Resolution, channels, coordinate system, patch size")
    evaluation: Optional[EvaluationMetrics] = Field(None, description="Verified scientific evaluation metrics")
    device: DeviceType = Field(default=DeviceType.CPU, description="Current compute device")
    status: ModelStatus = Field(default=ModelStatus.UNLOADED, description="Operational status")
    inference_mode: ModelInferenceMode = Field(default=ModelInferenceMode.REAL_MODEL)
    is_loaded: bool = False
    checkpoint_file: Optional[str] = None
    checkpoint_size_bytes: Optional[int] = None
    weights_verified: bool = False
    actual_sha256: Optional[str] = None
    blocker_reason: Optional[str] = None
    last_inference_time: Optional[datetime] = None
    last_latency_ms: Optional[float] = None
    total_inferences: int = 0
    error_message: Optional[str] = None
    warning_message: Optional[str] = None
    limitations: Optional[str] = None


class ModelRegistryResponse(BaseModel):
    models: List[ModelMetadata]
    total_models: int
    loaded_models: int
    system_device: str
    cuda_available: bool
