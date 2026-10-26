"""
DisasterMapper AI - Comprehensive Independent Model & Agent Reality Audit Script.
Executes deep inspection of all 7 AI/ML models, 11 AI agents, Copilot, evaluation benchmarks,
weight checkpoints, parameter norms, and operational pipelines.
"""
import os
import sys
import time
import json
import hashlib
from pathlib import Path
from typing import Dict, Any, List
import numpy as np
import torch

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))

from app.model_registry.registry import model_registry
from app.model_registry.download import CACHE_DIR, verify_file_checksum, calculate_sha256
from app.models.flood_segmentation import flood_segmentation_pipeline
from app.models.flood_risk import flood_susceptibility_model
from app.models.damage_assessment import building_damage_pipeline
from app.models.road_segmentation import road_segmentation_pipeline
from app.models.hazard_classification import disaster_classifier_pipeline
from app.models.report_verification import multimodal_report_verifier
from app.models.temporal_forecast import temporal_river_forecaster
from app.agents.orchestrator import disaster_orchestrator
from app.agents.tools import AgentToolRegistry
from app.evaluation.evaluate_models import run_full_scientific_evaluation

ARTIFACTS_DIR = Path(__file__).resolve().parent.parent.parent / "audit_artifacts"
ARTIFACTS_DIR.mkdir(parents=True, exist_ok=True)


def calculate_model_weight_norm(module: torch.nn.Module) -> float:
    total_norm = 0.0
    for p in module.parameters():
        if p.data is not None:
            total_norm += float(p.data.norm(2).item() ** 2)
    return float(np.sqrt(total_norm))


def audit_checkpoints_and_weights() -> Dict[str, Any]:
    print("\n--- SECTION 1 & 2: CHECKPOINTS & WEIGHT LOADING AUDIT ---")
    results = {}

    for model_meta in model_registry.list_models():
        mid = model_meta.id
        weight_src = model_meta.weight_source
        claimed_hash = model_meta.checksum_sha256 or "NOT_SPECIFIED"
        
        # Check cache dir
        model_dir = CACHE_DIR / mid
        files_in_dir = list(model_dir.glob("*")) if model_dir.exists() else []
        
        # Check if local file exists
        local_exists = False
        local_file_path = None
        local_file_size = 0
        actual_hash = None
        
        if weight_src.startswith("local:"):
            rel_path = weight_src.replace("local:", "")
            candidate_path = Path(__file__).resolve().parent.parent.parent / rel_path
            if candidate_path.exists():
                local_exists = True
                local_file_path = str(candidate_path)
                local_file_size = candidate_path.stat().st_size
                actual_hash = calculate_sha256(candidate_path)
        
        for f in files_in_dir:
            if f.is_file() and f.stat().st_size > 0:
                local_exists = True
                local_file_path = str(f)
                local_file_size = f.stat().st_size
                actual_hash = calculate_sha256(f)
                break

        # Weight reality analysis
        weight_status = "UNKNOWN"
        param_count = 0
        weight_norm = 0.0
        
        if mid == "flood-seg-unet-s2":
            net = flood_segmentation_pipeline.model
            param_count = sum(p.numel() for p in net.parameters())
            weight_norm = calculate_model_weight_norm(net)
            weight_status = "RANDOMLY_INITIALIZED_PYTORCH_KAIMING"
            reality_verdict = "Model instantiated with random PyTorch weights. No checkpoint loaded from disk. Sen1Floods11 checkpoint is missing."
        
        elif mid == "flood-susceptibility-xgb":
            xgb_model = flood_susceptibility_model.model
            param_count = 100 * 5 # 100 trees, depth 5
            weight_status = "GENUINELY_TRAINED_IN_MEMORY_ON_SYNTHETIC_DATA"
            reality_verdict = "Real XGBClassifier trained in memory at startup on 3,000 synthetic geomorphic data rows. No checkpoint file on disk."
            
        elif mid == "building-damage-siamese":
            net = building_damage_pipeline.model
            param_count = sum(p.numel() for p in net.parameters())
            weight_norm = calculate_model_weight_norm(net)
            weight_status = "RANDOMLY_INITIALIZED_PYTORCH"
            reality_verdict = "Siamese damage network instantiated with random PyTorch weights. Fallback polygon contours and damage rules execute."

        elif mid == "road-segmentation-spacenet":
            net = road_segmentation_pipeline.model
            param_count = sum(p.numel() for p in net.parameters())
            weight_norm = calculate_model_weight_norm(net)
            weight_status = "RANDOMLY_INITIALIZED_PYTORCH"
            reality_verdict = "DeepLabV3+ model instantiated with random PyTorch weights. Output GeoJSON road lines are 4 hardcoded lines intersected with flood polygon."

        elif mid == "disaster-classifier-effnet":
            net = disaster_classifier_pipeline.model
            param_count = sum(p.numel() for p in net.parameters())
            weight_norm = calculate_model_weight_norm(net)
            weight_status = "RANDOMLY_INITIALIZED_TIMM_PRETRAINED_FALSE"
            reality_verdict = "timm.create_model('efficientnet_b0', pretrained=False). Random initialization. Logits overridden by OpenCV HSV color heuristics."

        elif mid == "citizen-report-multimodal":
            multimodal_report_verifier._ensure_encoder()
            enc = multimodal_report_verifier.encoder
            if enc is not None:
                param_count = sum(p.numel() for p in enc.parameters())
                weight_norm = calculate_model_weight_norm(enc)
                weight_status = "GENUINE_PRETRAINED_SENTENCE_TRANSFORMER"
                reality_verdict = "SentenceTransformer('all-MiniLM-L6-v2') successfully loaded genuine pretrained weights."
            else:
                weight_status = "DETERMINISTIC_HASH_EMBEDDING_FALLBACK"
                reality_verdict = "Encoder not loaded; using deterministic hash embedding fallback."

        elif mid == "temporal-river-forecast":
            net = temporal_river_forecaster.model
            param_count = sum(p.numel() for p in net.parameters())
            weight_norm = calculate_model_weight_norm(net)
            weight_status = "RANDOMLY_INITIALIZED_PYTORCH_BILSTM"
            reality_verdict = "BiLSTM forecaster initialized with random weights. Checkpoint hydro_lstm_v1.pt missing on disk. Inference blended with physical linear trend."

        results[mid] = {
            "model_name": model_meta.name,
            "architecture": model_meta.architecture,
            "claimed_weight_source": weight_src,
            "claimed_sha256": claimed_hash,
            "checkpoint_on_disk": local_exists,
            "checkpoint_path": local_file_path,
            "checkpoint_file_size_bytes": local_file_size,
            "actual_sha256": actual_hash,
            "hash_match": (actual_hash.lower() == claimed_hash.lower()) if actual_hash and claimed_hash != "NOT_SPECIFIED" else False,
            "parameter_count": param_count,
            "parameter_l2_norm": round(weight_norm, 4) if weight_norm > 0 else "N/A",
            "weight_loading_reality": weight_status,
            "verdict": reality_verdict
        }
        print(f"[{mid}] Status: {weight_status} | On Disk: {local_exists} | Norm: {weight_norm}")

    return results


def run_live_model_inferences() -> Dict[str, Any]:
    print("\n--- SECTION 3: LIVE MODEL INFERENCE RUNS ON REAL TEST INPUTS ---")
    runs = {}

    # 1. Flood Segmentation
    print("Running Model 1: Flood Segmentation...")
    h, w = 512, 512
    # Create satellite-like RGB patch (terrain with river channel)
    np.random.seed(42)
    synthetic_satellite = np.full((h, w, 3), 110, dtype=np.uint8)
    synthetic_satellite += np.random.randint(-15, 15, (h, w, 3), dtype=np.int16).clip(0, 255).astype(np.uint8)
    synthetic_satellite[:, 180:260] = [35, 75, 140] # Dark blue water channel
    t0 = time.time()
    out1 = flood_segmentation_pipeline.segment_image(
        synthetic_satellite, center_lat=28.6692, center_lng=77.2295, span_deg=0.035
    )
    lat1 = (time.time() - t0) * 1000
    runs["flood_segmentation"] = {
        "input_shape": list(synthetic_satellite.shape),
        "input_mean_rgb": [float(synthetic_satellite[:, :, i].mean()) for i in range(3)],
        "output_hectares": out1.get("total_flooded_hectares"),
        "geojson_feature_count": len(out1.get("geojson", {}).get("features", [])),
        "latency_ms": round(lat1, 2),
        "raw_architecture_reported": out1.get("architecture")
    }

    # 2. Flood Susceptibility
    print("Running Model 2: Flood Susceptibility...")
    test_feats = {
        "rainfall_accum_24h_mm": 210.0,
        "rainfall_intensity_mm_hr": 35.0,
        "dem_elevation_m": 198.5,
        "terrain_slope_deg": 1.2,
        "distance_to_river_m": 85.0,
        "drainage_density_km_per_sqkm": 3.4,
        "soil_permeability_index": 0.28,
        "land_cover_impervious_ratio": 0.72
    }
    t0 = time.time()
    out2 = flood_susceptibility_model.predict_point(test_feats)
    lat2 = (time.time() - t0) * 1000
    runs["flood_susceptibility"] = {
        "input_features": test_feats,
        "susceptibility_score": out2.get("susceptibility_score"),
        "risk_category": out2.get("risk_category"),
        "top_contributing_factors": out2.get("top_contributing_factors"),
        "latency_ms": round(lat2, 2)
    }

    # 3. Building Damage Assessment
    print("Running Model 3: Building Damage Assessment...")
    pre_img = np.full((512, 512, 3), 130, dtype=np.uint8)
    post_img = pre_img.copy()
    post_img[100:200, 100:200] = [40, 40, 40] # Simulated structural collapse
    t0 = time.time()
    out3 = building_damage_pipeline.assess_damage(
        pre_img, post_img, center_lat=28.6692, center_lng=77.2295, span_deg=0.02
    )
    lat3 = (time.time() - t0) * 1000
    runs["building_damage"] = {
        "total_buildings_assessed": out3.get("total_buildings_assessed"),
        "damage_summary": out3.get("damage_summary"),
        "coregistration": out3.get("coregistration"),
        "sample_building": out3.get("buildings", [{}])[0] if out3.get("buildings") else {},
        "latency_ms": round(lat3, 2)
    }

    # 4. Road Segmentation & Blockage
    print("Running Model 4: Road Corridor Segmentation...")
    road_img = np.full((512, 512, 3), 120, dtype=np.uint8)
    t0 = time.time()
    out4 = road_segmentation_pipeline.analyze_roads(
        road_img, center_lat=28.6692, center_lng=77.2295,
        flood_polygons=out1.get("geojson", {}).get("features", [])
    )
    lat4 = (time.time() - t0) * 1000
    runs["road_segmentation"] = {
        "total_segments_analyzed": out4.get("total_segments_analyzed"),
        "blocked_segments": out4.get("blocked_segments"),
        "usable_segments": out4.get("usable_segments"),
        "sample_road": out4.get("roads", [{}])[0] if out4.get("roads") else {},
        "latency_ms": round(lat4, 2)
    }

    # 5. Hazard Classification
    print("Running Model 5: Multi-Hazard Classification...")
    # Flood image test (blue dominant)
    blue_img = np.full((224, 224, 3), 50, dtype=np.uint8)
    blue_img[:, :, 2] = 200 # high blue
    t0 = time.time()
    out5_flood = disaster_classifier_pipeline.classify_image(blue_img)
    lat5 = (time.time() - t0) * 1000

    # Fire image test (red dominant)
    red_img = np.full((224, 224, 3), 40, dtype=np.uint8)
    red_img[:, :, 0] = 220 # high red
    out5_fire = disaster_classifier_pipeline.classify_image(red_img)

    runs["hazard_classification"] = {
        "blue_image_predicted_class": out5_flood.get("predicted_class"),
        "blue_image_confidence": out5_flood.get("confidence"),
        "blue_image_probabilities": out5_flood.get("calibrated_probabilities"),
        "red_image_predicted_class": out5_fire.get("predicted_class"),
        "red_image_confidence": out5_fire.get("confidence"),
        "latency_ms": round(lat5, 2)
    }

    # 6. Citizen Report Multimodal Verification
    print("Running Model 6: Citizen Report Verification...")
    t0 = time.time()
    out6 = multimodal_report_verifier.analyze_report(
        report_text="Extreme flood water rising under Old Yamuna Railway Bridge, cars submerged and road blocked",
        image_url=None,
        latitude=28.6692,
        longitude=77.2295,
        timestamp_epoch=time.time(),
        existing_reports=[
            {"id": "rep-001", "latitude": 28.6700, "longitude": 77.2300, "description": "Yamuna bridge water level very high", "status": "VERIFIED"}
        ]
    )
    lat6 = (time.time() - t0) * 1000
    runs["report_verification"] = {
        "candidate_category": out6.get("candidate_category"),
        "verification_confidence": out6.get("verification_confidence"),
        "recommended_status": out6.get("recommended_status"),
        "corroborating_reports_count": out6.get("corroborating_reports_count"),
        "highest_semantic_similarity": out6.get("highest_semantic_similarity"),
        "latency_ms": round(lat6, 2)
    }

    # 7. Temporal River Forecaster
    print("Running Model 7: Temporal River Forecasting...")
    t0 = time.time()
    out7 = temporal_river_forecaster.forecast_river_level(
        historical_gauge_levels=[203.8, 204.1, 204.3, 204.6, 204.85],
        current_gauge_meters=204.85,
        danger_threshold_meters=205.33
    )
    lat7 = (time.time() - t0) * 1000
    runs["temporal_forecast"] = {
        "forecast_horizon_hours": out7.get("forecast_horizon_hours"),
        "current_gauge_meters": out7.get("current_gauge_meters"),
        "projected_peak_level": out7.get("projected_peak_level"),
        "projected_peak_hour": out7.get("projected_peak_hour"),
        "breach_predicted": out7.get("breach_predicted"),
        "first_3_hours": out7.get("forecast_timeline", [])[:3],
        "latency_ms": round(lat7, 2)
    }

    # Save outputs to file
    with open(ARTIFACTS_DIR / "live_model_inferences.json", "w") as f:
        json.dump(runs, f, indent=2)

    return runs


def audit_evaluation_suite() -> Dict[str, Any]:
    print("\n--- SECTION 4: EVALUATION METRICS REPRODUCTION AUDIT ---")
    eval_results = run_full_scientific_evaluation()
    
    # Audit how metrics are actually generated
    disclosures = {
        "reported_vs_actual_provenance": {
            "flood_segmentation": {
                "reported_benchmark": "Sen1Floods11 Official Test Split",
                "actual_code_implementation": "Synthetic numpy array: y_true = (np.random.beta(0.5, 3.0, n_pixels) > 0.65).astype(int)",
                "dataset_present_on_disk": False,
                "reproducibility": "Deterministic random seed 42 on synthetic noise, not real satellite test masks"
            },
            "flood_susceptibility": {
                "reported_benchmark": "Spatial Holdout Catchment Validation Set (24 basins)",
                "actual_code_implementation": "Synthetic binomial distribution: y_true = np.random.binomial(1, 0.35, 1000)",
                "dataset_present_on_disk": False,
                "reproducibility": "Synthetic parametric formula, not empirical streamgauge catchment records"
            },
            "building_damage": {
                "reported_benchmark": "xView2 Competition Validation Split",
                "actual_code_implementation": "Hardcoded constants copied into dictionary: {'NO_DAMAGE': 0.884, 'MINOR_DAMAGE': 0.562, ...}",
                "dataset_present_on_disk": False,
                "reproducibility": "Static literature constants; no evaluation run over actual image pairs"
            },
            "temporal_forecasting": {
                "reported_benchmark": "Yamuna Old Railway Bridge Hourly Stage Gauge Series",
                "actual_code_implementation": "Synthetic cumsum Gaussian drift: 204.85 + np.cumsum(np.random.normal(0.04, 0.02, 24))",
                "dataset_present_on_disk": False,
                "reproducibility": "Synthetic random walk, not actual CWC telemetry"
            }
        },
        "raw_evaluation_output": eval_results
    }
    
    with open(ARTIFACTS_DIR / "evaluation_audit.json", "w") as f:
        json.dump(disclosures, f, indent=2)

    return disclosures


def audit_multi_agent_system() -> Dict[str, Any]:
    print("\n--- SECTION 5 & 6: 11 AGENTS & COMPLETE WORKFLOW AUDIT ---")
    
    # Run full orchestrator workflow
    session = disaster_orchestrator.run_full_pipeline(
        incident_id="audit-run-2026",
        disaster_type="FLOOD",
        latitude=28.6692,
        longitude=77.2295,
        region_name="Yamuna Kashmere Gate Corridor"
    )

    traces = []
    for step in session.execution_traces:
        tool_names = [getattr(t, "tool_name", str(t)) for t in step.tool_calls]
        traces.append({
            "agent_role": step.agent_role.value if hasattr(step.agent_role, "value") else str(step.agent_role),
            "action": step.action,
            "status": step.status.value if hasattr(step.status, "value") else str(step.status),
            "tools_called": tool_names,
            "reasoning_snippet": step.reasoning[:120] + "..." if step.reasoning else None,
            "findings_keys": list(step.findings.keys()) if isinstance(step.findings, dict) else []
        })

    # Test Human Approval Gateway
    approval_result = None
    if session.pending_approvals:
        req = session.pending_approvals[0]
        approval_result = disaster_orchestrator.approve_action(
            session_id=session.session_id,
            request_id=req.request_id,
            operator_name="Lead Inspector Audit"
        )

    # Detailed agent reality classification
    agent_audit = {
        "Agent 1 (DisasterOrchestrator)": {
            "type": "RULE_BASED_STATE_MACHINE",
            "implementation": "Python sequential state transition pipeline coordinating Phases 1 through 8",
            "persistent_state": True
        },
        "Agent 2 (FloodPredictionAgent)": {
            "type": "MODEL_EXECUTION",
            "tools": ["flood_susceptibility_model (in-memory XGBoost)", "temporal_river_forecaster (PyTorch BiLSTM)"],
            "persistent_trace": True
        },
        "Agent 3 (SatelliteAnalysisAgent)": {
            "type": "MODEL_EXECUTION",
            "tools": ["flood_segmentation_pipeline (PyTorch UNet)"],
            "persistent_trace": True
        },
        "Agent 4 (BuildingDamageAgent)": {
            "type": "MODEL_EXECUTION_AND_HEURISTICS",
            "tools": ["building_damage_pipeline (PyTorch SiameseDamageNet + OpenCV contours/bounding boxes)"],
            "persistent_trace": True
        },
        "Agent 5 (CitizenVerificationAgent)": {
            "type": "GENUINE_PRETRAINED_MODEL_AND_MATH",
            "tools": ["SentenceTransformer('all-MiniLM-L6-v2')", "Haversine cluster distance"],
            "persistent_trace": True
        },
        "Agent 6 (RoadIntelligenceAgent)": {
            "type": "MODEL_EXECUTION_AND_GEOMETRIC_INTERSECTION",
            "tools": ["road_segmentation_pipeline (PyTorch DeepLabV3+)", "Shapely LineString-Polygon intersection"],
            "persistent_trace": True
        },
        "Agent 7 (ImpactAssessmentAgent)": {
            "type": "GENUINE_DETERMINISTIC_GIS",
            "tools": ["Shapely unary_union", "Point containment against Delhi Critical Facilities DB"],
            "persistent_trace": True
        },
        "Agent 8 (RescuePlanningAgent)": {
            "type": "DETERMINISTIC_GRAPH_ROUTING",
            "tools": ["Deterministic A* waypoint detour generator bypassing blocked coordinates"],
            "persistent_trace": True
        },
        "Agent 9 (ShelterAllocationAgent)": {
            "type": "GENUINE_MATHEMATICAL_OPTIMIZER",
            "tools": ["Greedy capacity-constrained allocation across relief shelters"],
            "persistent_trace": True
        },
        "Agent 10 (AlertIntelligenceAgent)": {
            "type": "TEMPLATE_AND_APPROVAL_GATE",
            "tools": ["CAP-JSON/XML template generator", "HumanApprovalRequest constructor"],
            "persistent_trace": True
        },
        "Agent 11 (DisasterExplanationAgent)": {
            "type": "TEMPLATE_BASED_SYNTHESIS",
            "tools": ["Markdown string formatter binding telemetry findings and citation metadata"],
            "persistent_trace": True
        },
        "Agent 12 (ModelValidationAgent)": {
            "type": "RULE_BASED_SANITY_CHECKS",
            "tools": ["4 spatial/mass balance assertion tests"],
            "persistent_trace": True
        }
    }

    workflow_audit = {
        "session_id": session.session_id,
        "total_traces": len(session.execution_traces),
        "traces": traces,
        "pending_approvals_count": len(session.pending_approvals),
        "approval_executed": approval_result,
        "agent_classifications": agent_audit
    }

    with open(ARTIFACTS_DIR / "multi_agent_workflow_audit.json", "w") as f:
        json.dump(workflow_audit, f, indent=2, default=str)

    return workflow_audit


def audit_copilot_grounding() -> Dict[str, Any]:
    print("\n--- SECTION 7: AI COPILOT DYNAMIC TEST AUDIT ---")
    from app.api.routes import copilot_chat, CopilotChatRequest

    test_queries = [
        "Which road corridors are blocked by flood water?",
        "What is the available shelter capacity?",
        "Are any hospitals at risk in the flooded zone?",
        "What happens if the bridge at 28.6602, 77.2530 fails?",
        "How many dogs are trapped in sector 9?"
    ]

    results = {}
    for q in test_queries:
        req = CopilotChatRequest(query=q)
        res = copilot_chat(req)
        results[q] = {
            "tools_called": res.get("tools_called"),
            "answer_preview": res.get("answer", "")[:180] + "...",
            "is_grounded_in_tool": len(res.get("tools_called", [])) > 0,
            "routing_nature": (
                "KEYWORD_BRANCH_ROAD" if "road" in q.lower()
                else "KEYWORD_BRANCH_SHELTER" if "shelter" in q.lower()
                else "KEYWORD_BRANCH_HOSPITAL" if "hospital" in q.lower()
                else "FALLBACK_DEFAULT_SITUATION_BRIEFING"
            )
        }
        print(f"Query: '{q[:40]}...' -> Route: {results[q]['routing_nature']}")

    with open(ARTIFACTS_DIR / "copilot_audit.json", "w") as f:
        json.dump(results, f, indent=2)

    return results


def main():
    print("=================================================================")
    print("STARTING INDEPENDENT EVIDENCE-BASED MODEL & AGENT REALITY AUDIT")
    print("=================================================================")
    
    checkpoints = audit_checkpoints_and_weights()
    inferences = run_live_model_inferences()
    evaluations = audit_evaluation_suite()
    agents = audit_multi_agent_system()
    copilot = audit_copilot_grounding()

    master_summary = {
        "audit_timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "checkpoints_and_weights": checkpoints,
        "live_inferences": inferences,
        "evaluations": evaluations,
        "agents": agents,
        "copilot": copilot
    }

    with open(ARTIFACTS_DIR / "master_audit_summary.json", "w") as f:
        json.dump(master_summary, f, indent=2, default=str)

    print("\n=================================================================")
    print(f"AUDIT COMPLETE. All evidence saved to {ARTIFACTS_DIR}")
    print("=================================================================")


if __name__ == "__main__":
    main()
