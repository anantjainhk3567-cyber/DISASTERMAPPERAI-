"""
Schemas for Multi-Agent AI System and Execution Tracing.
"""
from enum import Enum
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field
from datetime import datetime
import uuid


class AgentRole(str, Enum):
    ORCHESTRATOR = "ORCHESTRATOR"
    FLOOD_PREDICTION = "FLOOD_PREDICTION"
    SATELLITE_ANALYSIS = "SATELLITE_ANALYSIS"
    BUILDING_DAMAGE = "BUILDING_DAMAGE"
    CITIZEN_VERIFICATION = "CITIZEN_VERIFICATION"
    ROAD_INTELLIGENCE = "ROAD_INTELLIGENCE"
    IMPACT_ASSESSMENT = "IMPACT_ASSESSMENT"
    RESCUE_PLANNING = "RESCUE_PLANNING"
    SHELTER_ALLOCATION = "SHELTER_ALLOCATION"
    ALERT_INTELLIGENCE = "ALERT_INTELLIGENCE"
    DISASTER_EXPLANATION = "DISASTER_EXPLANATION"
    MODEL_VALIDATION = "MODEL_VALIDATION"


class TaskStatus(str, Enum):
    PENDING = "PENDING"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"
    WAITING_FOR_HUMAN_APPROVAL = "WAITING_FOR_HUMAN_APPROVAL"
    REJECTED_BY_OPERATOR = "REJECTED_BY_OPERATOR"


class ToolInvocationRecord(BaseModel):
    tool_name: str
    arguments: Dict[str, Any]
    output: Any
    latency_ms: float
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    is_success: bool = True
    error: Optional[str] = None


class AgentTraceStep(BaseModel):
    step_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    agent_role: AgentRole
    action: str
    status: TaskStatus
    tool_calls: List[ToolInvocationRecord] = Field(default_factory=list)
    findings: Dict[str, Any] = Field(default_factory=dict)
    reasoning: Optional[str] = None
    uncertainty_level: str = "LOW"
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class HumanApprovalRequest(BaseModel):
    request_id: str = Field(default_factory=lambda: f"req-{uuid.uuid4().hex[:8]}")
    action_type: str = Field(..., description="e.g. ISSUE_PUBLIC_ALERT, DISPATCH_RESCUE_BOAT, REVISE_SHELTER_QUOTA")
    target_region: str
    recommended_payload: Dict[str, Any]
    supporting_evidence: List[str]
    urgency: str = "HIGH"
    status: str = "PENDING_APPROVAL"  # PENDING_APPROVAL, APPROVED, REJECTED
    created_at: datetime = Field(default_factory=datetime.utcnow)
    decided_by: Optional[str] = None
    decision_timestamp: Optional[datetime] = None


    def __getitem__(self, item):
        return getattr(self, item)


class OrchestrationState(BaseModel):
    session_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    incident_id: str
    disaster_type: str
    latitude: float
    longitude: float
    region_name: str
    current_phase: str = "PREDICT" # PREDICT -> DETECT -> VERIFY -> ANALYZE -> PRIORITIZE -> RECOMMEND -> APPROVE -> RESPOND
    agents_executed: List[AgentRole] = Field(default_factory=list)
    execution_traces: List[AgentTraceStep] = Field(default_factory=list)
    consolidated_findings: Dict[str, Any] = Field(default_factory=dict)
    pending_approvals: List[HumanApprovalRequest] = Field(default_factory=list)
    status: TaskStatus = TaskStatus.IN_PROGRESS
    start_time: datetime = Field(default_factory=datetime.utcnow)
    end_time: Optional[datetime] = None
    summary_report: Optional[str] = None

    def __getitem__(self, item):
        return getattr(self, item)

