"""
Disaster Intelligence Orchestrator.
Coordinates the complete end-to-end multi-agent workflow:
Predict -> Detect -> Verify -> Analyze -> Prioritize -> Recommend -> Human Approval -> Respond.
Maintains state persistence, execution tracing, tool audit logs, and the Human Approval Gateway.
"""
import time
import logging
from typing import Dict, Any, List, Optional
from datetime import datetime

from app.agents.schemas import (
    AgentRole,
    TaskStatus,
    HumanApprovalRequest,
    OrchestrationState
)
from app.agents.specialists import (
    FloodPredictionAgent,
    SatelliteAnalysisAgent,
    BuildingDamageAgent,
    CitizenVerificationAgent,
    RoadIntelligenceAgent,
    ImpactAssessmentAgent,
    RescuePlanningAgent,
    ShelterAllocationAgent,
    AlertIntelligenceAgent,
    DisasterExplanationAgent,
    ModelValidationAgent
)

logger = logging.getLogger(__name__)


class DisasterOrchestrator:
    """Central state machine coordinating all 12 specialist disaster agents."""
    def __init__(self):
        self.flood_agent = FloodPredictionAgent()
        self.satellite_agent = SatelliteAnalysisAgent()
        self.damage_agent = BuildingDamageAgent()
        self.verification_agent = CitizenVerificationAgent()
        self.road_agent = RoadIntelligenceAgent()
        self.impact_agent = ImpactAssessmentAgent()
        self.rescue_agent = RescuePlanningAgent()
        self.shelter_agent = ShelterAllocationAgent()
        self.alert_agent = AlertIntelligenceAgent()
        self.explanation_agent = DisasterExplanationAgent()
        self.validation_agent = ModelValidationAgent()

        # In-memory session store (can be connected to Redis or Postgres)
        self._sessions: Dict[str, OrchestrationState] = {}

    def get_session(self, session_id: str) -> Optional[OrchestrationState]:
        return self._sessions.get(session_id)

    def list_sessions(self) -> List[OrchestrationState]:
        return list(self._sessions.values())

    def approve_action(self, session_id: str, request_id: str, operator_name: str) -> Dict[str, Any]:
        """Human Approval Gateway: Authorizes a pending response or alert action."""
        session = self.get_session(session_id)
        if not session:
            return {"status": "ERROR", "message": f"Session {session_id} not found"}

        for req in session.pending_approvals:
            if req.request_id == request_id:
                req.status = "APPROVED"
                req.decided_by = operator_name
                req.decision_timestamp = datetime.utcnow()
                session.status = TaskStatus.COMPLETED
                session.end_time = datetime.utcnow()
                return {
                    "status": "SUCCESS",
                    "message": f"Action {req.action_type} authorized by {operator_name}.",
                    "approval": req
                }

        return {"status": "ERROR", "message": f"Approval request {request_id} not found"}

    def run_full_pipeline(
        self,
        incident_id: str = "inc-delhi-001",
        disaster_type: str = "FLOOD",
        latitude: float = 28.6692,
        longitude: float = 77.2295,
        region_name: str = "Kashmere Gate, Yamuna River Corridor"
    ) -> OrchestrationState:
        """
        Executes the verified multi-agent operational workflow:
        Predict -> Detect -> Verify -> Analyze -> Prioritize -> Recommend -> Human Approval -> Respond
        """
        state = OrchestrationState(
            incident_id=incident_id,
            disaster_type=disaster_type,
            latitude=latitude,
            longitude=longitude,
            region_name=region_name,
            current_phase="PREDICT",
            status=TaskStatus.IN_PROGRESS
        )

        try:
            # -------------------------------------------------------------
            # PHASE 1: PREDICT (Flood Prediction Agent)
            # -------------------------------------------------------------
            state.current_phase = "PREDICT"
            step_predict = self.flood_agent.execute(state)
            state.execution_traces.append(step_predict)
            state.agents_executed.append(AgentRole.FLOOD_PREDICTION)
            state.consolidated_findings.update(step_predict.findings)

            # -------------------------------------------------------------
            # PHASE 2: DETECT (Satellite Agent & Building Damage Agent)
            # -------------------------------------------------------------
            state.current_phase = "DETECT"
            # Satellite flood segmentation
            step_sat = self.satellite_agent.execute(state)
            state.execution_traces.append(step_sat)
            state.agents_executed.append(AgentRole.SATELLITE_ANALYSIS)
            state.consolidated_findings.update(step_sat.findings)

            # Building damage assessment
            step_dmg = self.damage_agent.execute(state)
            state.execution_traces.append(step_dmg)
            state.agents_executed.append(AgentRole.BUILDING_DAMAGE)
            state.consolidated_findings["building_damage"] = step_dmg.findings

            # -------------------------------------------------------------
            # PHASE 3: VERIFY (Citizen Verification & Model Validation)
            # -------------------------------------------------------------
            state.current_phase = "VERIFY"
            step_verify = self.verification_agent.execute(state)
            state.execution_traces.append(step_verify)
            state.agents_executed.append(AgentRole.CITIZEN_VERIFICATION)
            state.consolidated_findings["citizen_verification"] = step_verify.findings

            step_val = self.validation_agent.execute(state)
            state.execution_traces.append(step_val)
            state.agents_executed.append(AgentRole.MODEL_VALIDATION)
            state.consolidated_findings["model_validation"] = step_val.findings

            # -------------------------------------------------------------
            # PHASE 4: ANALYZE (Road Intelligence & Impact Assessment)
            # -------------------------------------------------------------
            state.current_phase = "ANALYZE"
            flood_features = step_sat.findings.get("geojson", {}).get("features", [])
            step_road = self.road_agent.execute(state, flood_features)
            state.execution_traces.append(step_road)
            state.agents_executed.append(AgentRole.ROAD_INTELLIGENCE)
            state.consolidated_findings["road_network"] = step_road.findings

            step_impact = self.impact_agent.execute(state, step_sat.findings.get("geojson", {}))
            state.execution_traces.append(step_impact)
            state.agents_executed.append(AgentRole.IMPACT_ASSESSMENT)
            state.consolidated_findings.update(step_impact.findings)

            # -------------------------------------------------------------
            # PHASE 5: PRIORITIZE (Rescue Planning Agent)
            # -------------------------------------------------------------
            state.current_phase = "PRIORITIZE"
            blocked_roads = [r for r in step_road.findings.get("roads", []) if r.get("status") == "BLOCKED"]
            step_rescue = self.rescue_agent.execute(state, blocked_roads)
            state.execution_traces.append(step_rescue)
            state.agents_executed.append(AgentRole.RESCUE_PLANNING)
            state.consolidated_findings["rescue_plan"] = step_rescue.findings

            # -------------------------------------------------------------
            # PHASE 6: RECOMMEND (Shelter Allocation Agent)
            # -------------------------------------------------------------
            state.current_phase = "RECOMMEND"
            exposed_pop = step_impact.findings.get("deterministic_exposed_population", 3400)
            step_shelter = self.shelter_agent.execute(state, exposed_pop)
            state.execution_traces.append(step_shelter)
            state.agents_executed.append(AgentRole.SHELTER_ALLOCATION)
            state.consolidated_findings["shelter_allocation"] = step_shelter.findings

            # -------------------------------------------------------------
            # PHASE 7: HUMAN APPROVAL (Alert Intelligence Agent)
            # -------------------------------------------------------------
            state.current_phase = "APPROVE"
            step_alert, approval_req = self.alert_agent.execute(state, state.consolidated_findings)
            state.execution_traces.append(step_alert)
            state.agents_executed.append(AgentRole.ALERT_INTELLIGENCE)
            state.pending_approvals.append(approval_req)

            # -------------------------------------------------------------
            # PHASE 8: EXPLAIN (Disaster Explanation Agent)
            # -------------------------------------------------------------
            step_explain = self.explanation_agent.execute(state)
            state.execution_traces.append(step_explain)
            state.agents_executed.append(AgentRole.DISASTER_EXPLANATION)
            state.summary_report = step_explain.findings.get("explanation_markdown")

            state.status = TaskStatus.WAITING_FOR_HUMAN_APPROVAL

        except Exception as e:
            logger.error(f"Error during orchestrator pipeline: {e}")
            state.status = TaskStatus.FAILED

        # Persist session
        self._sessions[state.session_id] = state
        return state

    def run_full_disaster_pipeline(
        self,
        incident_id: str = "inc-delhi-001",
        disaster_type: str = "FLOOD",
        latitude: float = 28.6692,
        longitude: float = 77.2295,
        region_name: str = "Kashmere Gate, Yamuna River Corridor"
    ) -> OrchestrationState:
        """Alias for run_full_pipeline."""
        return self.run_full_pipeline(
            incident_id=incident_id,
            disaster_type=disaster_type,
            latitude=latitude,
            longitude=longitude,
            region_name=region_name
        )


# Global singleton instance and class aliases
disaster_orchestrator = DisasterOrchestrator()
MultiAgentOrchestrator = DisasterOrchestrator
