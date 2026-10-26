# DISASTERMAPPER AI — INDEPENDENT MODEL & AGENT REALITY AUDIT REPORT

**Date of Audit:** October 16, 2026  
**Auditor:** Principal AI/ML Systems & Verification Auditor  
**Audit Scope:** 7 AI/ML Models, 11 Specialist AI Agents, AI Copilot, Model Registry, and Evaluation Engine  
**Audit Standard:** Strict Empirical Verification — No fabricated metrics, no simulated checkpoints, zero defensiveness.

---

## EXECUTIVE SUMMARY & VERDICT

| Category | Claimed in Documentation / Registry | Verified Technical Reality | Verdict |
| :--- | :--- | :--- | :--- |
| **Total Models** | 7 Deep Learning & Machine Learning Models | 7 Models instantiated in Python code | **INSTANTIATED** |
| **Pretrained Weights Loaded** | 7 Pretrained Models (`Sen1Floods11`, `xView2`, `SpaceNet`, `CrisisMMD`, etc.) | **1 of 7** loads genuine pretrained weights (`all-MiniLM-L6-v2`); **1 of 7** is trained in-memory on synthetic formulas (XGBoost); **5 of 7** run on **randomly initialized PyTorch weights** | **CRITICAL DEFICIENCY** |
| **Checkpoints on Disk** | Claimed checkpoints in `models/checkpoints/` | **0 checkpoint files exist on disk** (`.pt`, `.safetensors`, `.onnx`, `.bin`) | **MISSING ON DISK** |
| **Evaluation Metrics** | IoU 0.824, AUROC 0.912, Macro-F1 0.748, RMSE 0.29m | Computed on **synthetic random arrays** (`np.random.beta`, `np.random.binomial`) or hardcoded constants in `evaluate_models.py` | **SYNTHETIC BENCHMARK** |
| **11 AI Agents** | Autonomous tool-using multi-agent swarm | **Deterministic State Machine + Tool Executors**. Genuine GIS (Shapely) and Greedy Optimization work; some agents use prompt/template formatters | **MIXED REALITY** |
| **AI Copilot** | Autonomous dynamic reasoning disaster assistant | **Keyword-based if/elif/else intent router** that inserts tool outputs into structured markdown templates | **RULE-BASED ROUTER** |
| **Frontend Status Badges** | Green "READY / 100% OPERATIONAL" | Indicates Python class instantiated; **does not verify weights provenance** | **MISLEADING TELEMETRY** |

---

## 1. INVENTORY OF THE 7 AI/ML MODELS

Below is the verified inventory of all seven models in DisasterMapper AI, cross-referencing registry claims against on-disk reality:

| Model ID | Model Name & Task | Architecture | Claimed Weight Source | Claimed SHA-256 | Checkpoint on Disk | File Size | Actual SHA-256 | Weight Reality Verdict |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `flood-seg-unet-s2` | Sen1Floods11 U-Net Flood Segmenter | U-Net Encoder-Decoder (Custom PyTorch) | `isp-uv-es/sen1floods11-S2` | `7c9f8e4b2d1a3...` | **False** | 0 B | N/A | **Random PyTorch Init (Kaiming)** |
| `flood-susceptibility-xgb` | Hydrological Susceptibility Classifier | Gradient Boosted Trees (XGBoost) | `local:models/checkpoints/flood_susceptibility_xgb.json` | Not specified | **False** | 0 B | N/A | **Trained in-memory on synthetic log-odds formula** |
| `building-damage-siamese` | xBD Siamese Structural Damage Assessor | Siamese ResNet-style Backbone + Diff Head | `xBD/xView2-damage-resnet50` | Not specified | **False** | 0 B | N/A | **Random PyTorch Init + OpenCV contour heuristics** |
| `road-segmentation-spacenet` | SpaceNet Road Corridor Segmenter | DeepLabV3+ with ASPP & Low-Level Skip | `SpaceNet-Roads/deeplabv3plus-resnet34` | Not specified | **False** | 0 B | N/A | **Random PyTorch Init + 4 Hardcoded Road Geometries** |
| `disaster-classifier-effnet` | DisasterLens Multi-Hazard Classifier | `timm.create_model("efficientnet_b0", pretrained=False)` | `timm/efficientnet_b0` | Not specified | **False** | 0 B | N/A | **Random PyTorch Init + OpenCV HSV Color Heuristics** |
| `citizen-report-multimodal` | CrisisReport Multimodal Semantic Verifier | SentenceTransformer `all-MiniLM-L6-v2` | `sentence-transformers/all-MiniLM-L6-v2` | Not specified | **Cached in HF** | ~80 MB | `e4ce987...` | **GENUINE PRETRAINED WEIGHTS** |
| `temporal-river-forecast` | HydroForecaster River Level Predictor | Bidirectional LSTM (PyTorch) + Variance Head | `local:models/checkpoints/hydro_lstm_v1.pt` | Not specified | **False** | 0 B | N/A | **Random PyTorch Init + Linear Trend Extrapolation** |

---

## 2. WEIGHT LOADING & INITIALIZATION REALITY AUDIT

### Model 1: `flood_segmentation` (`app/models/flood_segmentation/model.py`)
- **Code Reality:**
  ```python
  self.model = UNet(in_channels=3, num_classes=1)
  self.model.to(self.device)
  self.model.eval()
  ```
- **Checkpoint Check:** No `torch.load()` or `safetensors.load()` call exists.
- **Parameters:** 13,322,241 parameters. L2 Weight Norm = `74.9068`.
- **Verdict:** **RANDOMLY INITIALIZED PYTORCH WEIGHTS**.
- **Critical Dimension Bug Uncovered During Audit:** The original U-Net code had an unhandled channel mismatch in `self.conv1(torch.cat([x4, x], dim=1))`: `x` had 256 channels, `x4` had 512 channels (total 768), but `self.conv1` was initialized with `DoubleConv(512, 256)`, causing `RuntimeError: Given groups=1, weight of size [256, 512, 3, 3], expected input[1, 768, 64, 64] to have 512 channels`. This proves the model was **never trained** and could never have executed a single backward or forward pass previously.

### Model 2: `flood_risk` (`app/models/flood_risk/susceptibility_model.py`)
- **Code Reality:**
  ```python
  np.random.seed(42)
  n_samples = 3000
  rainfall_accum = np.random.uniform(10.0, 350.0, n_samples)
  ...
  log_odds = (0.015 * rainfall_accum + 0.04 * rainfall_intensity - 0.02 * dem ...)
  prob = 1.0 / (1.0 + np.exp(-log_odds))
  y = (prob > 0.50).astype(int)
  self.model = xgb.XGBClassifier(n_estimators=100, max_depth=5, ...)
  self.model.fit(X, y)
  ```
- **Verdict:** **GENUINELY FITTED IN-MEMORY MODEL, BUT ON SYNTHETIC DATA**. The XGBoost algorithm genuinely runs decision tree splits (`predict_proba` returns valid probabilities in 5.86ms), but training occurs at startup on 3,000 synthetic random data points rather than an empirical GIS database.

### Model 3: `damage_assessment` (`app/models/damage_assessment/siamese_damage.py`)
- **Code Reality:** `self.model = SiameseDamageNet(num_damage_classes=4)` (3,347,141 params, L2 Norm = `41.3352`).
- **Inference Reality:**
  - Passes pre/post tensors through random network.
  - If OpenCV contours are `< 3`, it generates **6 hardcoded polygon coordinates** (`bldg-eval-1` through `6`) with confidence `damage_probs[c_idx] * 0.4 + 0.55`.
  - If contours exist, damage level is assigned via manual pixel difference thresholds: `diff_intensity > 0.40 -> DESTROYED`, `> 0.25 -> MAJOR_DAMAGE`, `> 0.12 -> MINOR_DAMAGE`.
- **Verdict:** **RANDOMLY INITIALIZED NETWORK + HEURISTIC MOCK FALLBACK**.

### Model 4: `road_segmentation` (`app/models/road_segmentation/road_detector.py`)
- **Code Reality:** `self.model = DeepLabV3PlusRoad(in_channels=3, num_classes=1)` (3,904,929 params, L2 Norm = `58.2518`).
- **Inference Reality:**
  - Forward pass executes on input tensor.
  - However, the output road corridors are **4 hardcoded LineString vectors** hardcoded in Python:
    1. Grand Trunk Highway / NH-44
    2. Ring Road Bypass
    3. Yamuna Embankment Link
    4. Hospital Access Corridor
  - Geometric intersection between these roads and flood polygons is **genuine Shapely geometric computation** (`line.intersects(fg)`), but the road network is not extracted by the neural network.
- **Verdict:** **RANDOMLY INITIALIZED NETWORK + HARDCODED GEOMETRIES + GENUINE SHAPELY INTERSECTION**.

### Model 5: `hazard_classification` (`app/models/hazard_classification/classifier.py`)
- **Code Reality:**
  ```python
  self.backbone = timm.create_model("efficientnet_b0", pretrained=False, num_classes=num_classes)
  ```
- **Inference Reality:**
  - Network weights are completely random (4,015,234 params, L2 Norm = `282.3103`).
  - Predictions are overridden by hardcoded OpenCV HSV color heuristics:
    - If blue pixel ratio > 15%, add `+0.35` to FLOOD probability.
    - If red pixel ratio > 8%, add `+0.40` to WILDFIRE probability.
- **Verdict:** **RANDOMLY INITIALIZED NETWORK OVERRIDDEN BY HSV COLOR HEURISTICS**.

### Model 6: `report_verification` (`app/models/report_verification/multimodal_verifier.py`)
- **Code Reality:**
  ```python
  self.encoder = SentenceTransformer("all-MiniLM-L6-v2")
  ```
- **Inference Reality:**
  - Successfully downloads/loads 22.7M genuine transformer weights from HuggingFace cache.
  - Real cosine semantic embeddings computed for texts.
  - Genuine Haversine distance clustering (`haversine_distance_meters`) for duplicate detection.
- **Verdict:** **GENUINE PRETRAINED DEEP LEARNING MODEL & REAL EMBEDDINGS**.

### Model 7: `temporal_forecast` (`app/models/temporal_forecast/river_forecast.py`)
- **Code Reality:**
  `self.model = HydroLSTMForecaster(input_dim=3, hidden_dim=64, forecast_steps=24)` (154,288 params, L2 Norm = `27.5601`).
- **Inference Reality:**
  - Passes historical tensor through random BiLSTM.
  - Combines random output with an autoregressive linear momentum formula:
    `predicted_val = current_gauge_meters + (pred_mean_np[h] * 0.15 + (trend * (h + 1) * 0.4))`
  - Confidence interval bounds grow deterministically with time: `std_err = float(np.sqrt(pred_var_np[h]) * 0.05 + (h * 0.015))`.
- **Verdict:** **RANDOMLY INITIALIZED BILSTM BLENDED WITH LINEAR HEURISTIC EXTRAPOLATION**.

---

## 3. LIVE MODEL INFERENCE RUNS & SAVED ARTIFACTS

All 7 models were executed on concrete test inputs. The runtime traces, input tensors, output JSONs, and visual plots were saved to:
`disaster-mapper/ai-service/audit_artifacts/`

| Model | Test Input Summary | Latency (ms) | Actual Output Values | Saved Visual Plot |
| :--- | :--- | :--- | :--- | :--- |
| **Flood Segmentation** | 512x512 synthetic satellite RGB with river channel | 1,540.0 ms | 2,611.21 hectares, 1 GeoJSON Polygon | `vis_1_flood_segmentation.png` |
| **Flood Susceptibility** | 8 hydrological indicators (Rain=210mm, DEM=198.5m, Slope=1.2°) | 5.86 ms | Score: `0.9691` (CRITICAL_SUSCEPTIBILITY) | `vis_2_flood_susceptibility.png` |
| **Building Damage** | 512x512 pre/post image pair with structural damage block | 672.15 ms | 1 building assessed, damage: DESTROYED (conf: 0.724) | `vis_3_building_damage.png` |
| **Road Corridor** | 512x512 input + flood polygons | 365.49 ms | 4 segments evaluated, 4 BLOCKED (NH-44, Ring Rd) | `vis_4_road_blockage.png` |
| **Hazard Classifier** | 224x224 RGB image (Blue-dominant) | 102.7 ms | Classified: FLOOD (Confidence: 0.383 / calibrated) | `vis_5_hazard_classification.png` |
| **Report Verification** | *"Extreme flood water rising under Old Yamuna Railway Bridge"* | 70.17 ms | Classified: FLOOD, Conf: 0.72, Status: NEEDS_HUMAN_CONFIRMATION | `vis_6_citizen_verification.png` |
| **Temporal Forecaster** | 5 historical gauge readings [203.8 to 204.85m], Danger: 205.33m | 8.92 ms | Peak stage: 205.14m at hour +12; Breach: False | `vis_7_temporal_river_forecast.png` |

---

## 4. EVALUATION METRICS REPRODUCTION AUDIT

DisasterMapper AI reported official scientific benchmarks in documentation and the UI:
- Flood Segmentation: IoU 0.824, Dice 0.893
- Flood Susceptibility: AUROC 0.912, AUPRC 0.864
- Building Damage: Macro F1 0.748, Destroyed F1 0.829
- Temporal Forecast: MAE 0.18m, RMSE 0.29m

### Audit Findings from `app/evaluation/evaluate_models.py`:
1. **Flood Segmentation (Claimed Sen1Floods11 Official Test Split):**
   - **Line 26:** `y_true = (np.random.beta(0.5, 3.0, n_pixels) > 0.65).astype(int)`
   - **Line 28:** `y_prob = np.clip(y_true * 0.85 + np.random.normal(0.1, 0.15, n_pixels), 0.0, 1.0)`
   - **Verdict:** The benchmark evaluates a synthetic random beta distribution against simulated Gaussian noise with a fixed seed (`np.random.seed(42)`). No Sen1Floods11 test patches exist on disk.
2. **Flood Susceptibility (Claimed GFD-Hydro 24 Basins):**
   - **Line 61:** `y_true = np.random.binomial(1, 0.35, n)`
   - **Line 63:** `y_prob = np.clip(y_true * 0.70 + np.random.beta(2, 5, n) * 0.40, 0.01, 0.99)`
   - **Verdict:** Evaluates synthetic binomial arrays. AUROC `0.912` and AUPRC `0.864` are hardcoded constants on lines 82-83.
3. **Building Damage (Claimed xBD / xView2 Validation Split):**
   - **Lines 96-101:** Hardcoded constants copied from the xView2 competition paper into a Python dictionary:
     `{"NO_DAMAGE": 0.884, "MINOR_DAMAGE": 0.562, "MAJOR_DAMAGE": 0.718, "DESTROYED": 0.829}`
   - **Verdict:** Zero inference or evaluation is run. Metrics are literal static floats.
4. **Temporal River Forecaster (Claimed CWC Yamuna Gauge Series):**
   - **Line 119:** `true_stages = 204.85 + np.cumsum(np.random.normal(0.04, 0.02, n_hours))`
   - **Line 120:** `pred_stages = true_stages + np.random.normal(0.0, 0.12, n_hours)`
   - **Verdict:** Synthetic random walk simulation.

---

## 5. AUDIT OF THE 11 SPECIALIST AI AGENTS

DisasterMapper AI defines 11 specialist agents coordinated by `DisasterOrchestrator` (`AgentRole` 1 through 12 in `app/agents/`). The audit examined the implementation of every agent:

| Agent # & Class | Declared Role | Execution Mechanism | Tools / Models Executed | Trace Persistence | Reality Classification |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Agent 1: Orchestrator** | Central Coordinator | Deterministic Python State Machine | Sequences Phases 1 to 8; manages `_sessions` dict | Yes (`OrchestrationState`) | `RULE_BASED` |
| **Agent 2: FloodPredictionAgent** | Runoff & Susceptibility | Model Invocation | `flood_susceptibility_model` (XGBoost) + `temporal_river_forecaster` (BiLSTM) | Yes (`AgentTraceStep`) | `MODEL_EXECUTION` (In-memory XGB / Random BiLSTM) |
| **Agent 3: SatelliteAnalysisAgent** | Satellite Segmentation | Model Invocation | `flood_segmentation_pipeline` (PyTorch UNet) | Yes (`AgentTraceStep`) | `MODEL_EXECUTION` (Random PyTorch weights) |
| **Agent 4: BuildingDamageAgent** | Structural Damage | Model & Heuristic | `building_damage_pipeline` (Siamese net + OpenCV contours) | Yes (`AgentTraceStep`) | `HEURISTIC_HYBRID` |
| **Agent 5: CitizenVerificationAgent** | Report Corroboration | NLP & Mathematics | `SentenceTransformer` + Haversine clustering | Yes (`AgentTraceStep`) | `GENUINE_PRETRAINED_MODEL` |
| **Agent 6: RoadIntelligenceAgent** | Corridor Routing Graph | Spatial Intersection | `road_segmentation_pipeline` + Shapely LineString intersection | Yes (`AgentTraceStep`) | `DETERMINISTIC_GIS` |
| **Agent 7: ImpactAssessmentAgent** | Exposure Analysis | Spatial Join | Shapely `unary_union` against Delhi Infrastructure DB | Yes (`AgentTraceStep`) | `GENUINE_DETERMINISTIC_GIS` |
| **Agent 8: RescuePlanningAgent** | Route Detour Engine | Deterministic A* | Avoids blocked coordinates with northern detour dogleg | Yes (`AgentTraceStep`) | `DETERMINISTIC_ALGORITHM` |
| **Agent 9: ShelterAllocationAgent** | Relief Capacity Solver | Constrained Optimization | Greedy capacity-constrained bed assignment | Yes (`AgentTraceStep`) | `GENUINE_MATHEMATICAL_OPTIMIZER` |
| **Agent 10: AlertIntelligenceAgent** | CAP Emergency Warning | Template Construction | Builds OASIS CAP JSON/XML + constructs `HumanApprovalRequest` | Yes (`AgentTraceStep`) | `RULE_BASED_TEMPLATE` |
| **Agent 11: DisasterExplanationAgent** | Operational Explainer | Markdown Synthesis | Formats telemetry findings with citations | Yes (`AgentTraceStep`) | `TEMPLATE_BASED` |
| **Agent 12: ModelValidationAgent** | Output Quality Gate | Hardcoded Assertions | Evaluates 4 sanity checks (Bounds, Shadow ratio, Mass balance, Logits) | Yes (`AgentTraceStep`) | `RULE_BASED_GATE` |

---

## 6. END-TO-END MULTI-AGENT WORKFLOW DEMONSTRATION

The complete multi-agent pipeline was executed:  
`POST /ai/agents/orchestrate` with payload `{"latitude": 28.6692, "longitude": 77.2295, "region_name": "Yamuna Kashmere Gate Corridor"}`.

### Verified Execution Trace (Saved in `multi_agent_workflow_audit.json`):
1. **Phase 1: PREDICT (Agent 2)**: Evaluated catchment features via XGBoost (`78%` susceptibility). BiLSTM forecasted river stage reaching `205.14m`.
2. **Phase 2: DETECT (Agents 3 & 4)**: U-Net segmented water surface (14.5 ha). Siamese damage model detected 1 destroyed structure.
3. **Phase 3: VERIFY (Agents 5 & 12)**: Citizen report verified (Category: `FLOOD`, Confidence: `0.72`). Quality Gate passed 4/4 sanity checks (`OPERATIONAL_CERTIFIED`).
4. **Phase 4: ANALYZE (Agents 6 & 7)**: Road corridors intersected with flood polygons (NH-44 flagged `BLOCKED`). PostGIS/Shapely spatial join identified 1 hospital (LNJP Civil Lines) and 1 water plant (Wazirabad) at risk. Deterministic exposed population: `3,400`.
5. **Phase 5: PRIORITIZE (Agent 8)**: Generated safe evacuation route bypassing flooded underpass. Transit time: 18.2 minutes (10.6 km).
6. **Phase 6: RECOMMEND (Agent 9)**: Greedy optimizer allocated 1,140 evacuees across 4 relief shelters (Civil Lines Camp: 450; Mayur Vihar Centre: 690; Deficit: 0).
7. **Phase 7: HUMAN APPROVAL (Agent 10)**: Generated CAP alert draft `CAP-DL-FLD-177...` and locked state in `WAITING_FOR_HUMAN_APPROVAL`.
8. **Phase 8: EXPLAIN (Agent 11)**: Synthesized grounded markdown briefing citing U-Net v2.1 and HydroForecaster v1.2.
9. **HUMAN GATEWAY EXECUTION**: `disaster_orchestrator.approve_action(session_id, request_id, operator_name="Lead Inspector Audit")` transitioned state from `WAITING_FOR_HUMAN_APPROVAL` to `COMPLETED`.

---

## 7. AI COPILOT DYNAMIC TESTING & PROVENANCE

The AI Copilot (`POST /ai/copilot/chat`) was tested with 5 queries: 3 standard operational queries, 1 dynamic unseen spatial question, and 1 out-of-domain query.

| Query | Routing Path | Tools Invoked | Answer Grounding Reality |
| :--- | :--- | :--- | :--- |
| *"Which road corridors are blocked by flood water?"* | Keyword `road` | `RoadIntelligenceAgent`, `DeepLabV3PlusRoad` | **Template Interpolation**: Inserts segment counts into hardcoded road assessment string. |
| *"What is the available shelter capacity?"* | Keyword `shelter` | `ShelterAllocationAgent` | **Tool Grounded**: Real greedy allocation output interpolated into markdown template. |
| *"Are any hospitals at risk in the flooded zone?"* | Keyword `hospital` | `ImpactAssessmentAgent` | **Tool Grounded**: Real Shapely spatial join output interpolated into markdown template. |
| *"What happens if the bridge at 28.6602, 77.2530 fails?"* | **FALLBACK** | Full Multi-Agent Pipeline | **NOT GROUNDED**: No LLM reasoning for coordinate (28.6602, 77.2530). Falls back to full default Delhi Yamuna summary. |
| *"How many dogs are trapped in sector 9?"* | **FALLBACK** | Full Multi-Agent Pipeline | **NOT GROUNDED**: Incapable of animal detection or sector 9 context. Falls back to full default Delhi Yamuna summary. |

### Critical Bugs Discovered & Fixed During Copilot Audit:
1. `NameError: name 'road_segmentation_pipeline' is not defined`: `app/api/routes.py` line 232 called `road_segmentation_pipeline` without importing it.
2. `NameError: name 'np' is not defined`: `app/api/routes.py` line 234 called `np.zeros` without importing `numpy as np`.
Both runtime crashes proved the Copilot road routing branch had never been invoked in production before this audit.

---

## 8. FRONTEND STATUS BADGES VS. BACKEND REALITY

- **Frontend Component:** `frontend/src/pages/AISystemsPage.tsx`
- **API Call:** `api.ai.getModelRegistry()` -> `/ai/models/registry`
- **Audit Findings:**
  1. The frontend displays green badges: `"READY"` and `"100% OPERATIONAL"`.
  2. If the backend fails, lines 52-140 fall back to a hardcoded array where `status: 'READY'` and `is_loaded: true` are hardcoded constants.
  3. When the backend succeeds, `/ai/models/registry` returns `ModelStatus.READY` because `model_registry.set_instance(...)` was called when the Python class was constructed in memory.
  4. **The backend registry never checks whether `.pt` checkpoint weights were loaded or if weights are random.** A model with 100% random Gaussian weights is reported as `"READY"`.

---

## 9. COMPLETE SYSTEM TAXONOMY

Every component in DisasterMapper AI is classified below into its true scientific category:

| System / Component | File Location | True Classification | Technical Rationale |
| :--- | :--- | :--- | :--- |
| **SentenceTransformer Semantic NLP** | `multimodal_verifier.py` | `PRETRAINED` | Genuine weights (`all-MiniLM-L6-v2`) downloaded from HuggingFace Hub; real 384-dim embeddings. |
| **Spatial Impact Join** | `tools.py` | `GENUINELY_TRAINED` / `DETERMINISTIC_GIS` | Genuine Shapely geometric computation checking point containment and buffer distances against Delhi facility coordinates. |
| **Shelter Allocation Optimizer** | `tools.py` | `DETERMINISTIC_ALGORITHM` | Genuine Greedy capacity-constrained allocation algorithm with mathematical constraint satisfaction. |
| **Deterministic Route Detour** | `tools.py` | `DETERMINISTIC_ALGORITHM` | Genuine deterministic waypoint generation applying flood boundary clearance buffers. |
| **Haversine Distance Clustering** | `multimodal_verifier.py` | `DETERMINISTIC_ALGORITHM` | Exact spherical trigonometry formula for spatio-temporal report clustering. |
| **XGBoost Susceptibility Classifier** | `susceptibility_model.py` | `SIMULATED` | Genuine XGBoost decision tree training, but fitted in-memory on parametric synthetic log-odds data. |
| **U-Net Flood Segmenter** | `model.py` | `RANDOM_WEIGHTS` | Random PyTorch initialization. Checkpoint `isp-uv-es/sen1floods11-S2` is missing. |
| **Siamese Damage Network** | `siamese_damage.py` | `RANDOM_WEIGHTS` + `HEURISTIC` | Random weights. Damage classifications derived from OpenCV pixel difference thresholds or 6 hardcoded fallback coordinates. |
| **DeepLabV3+ Road Segmenter** | `road_detector.py` | `RANDOM_WEIGHTS` + `RULE_BASED` | Random weights. GeoJSON road geometries are 4 hardcoded LineString vectors intersected with flood polygons via Shapely. |
| **EfficientNet Hazard Classifier** | `classifier.py` | `RANDOM_WEIGHTS` + `HEURISTIC` | `pretrained=False`. Logits overridden by OpenCV HSV blue/red color percentage thresholds. |
| **HydroForecaster BiLSTM** | `river_forecast.py` | `RANDOM_WEIGHTS` + `HEURISTIC` | Random weights. Output blended with autoregressive linear slope extrapolation. |
| **Scientific Benchmark Suite** | `evaluate_models.py` | `SIMULATED` | Metrics generated from `np.random.beta`, `np.random.binomial`, and hardcoded constants. |
| **AI Copilot** | `routes.py` | `RULE_BASED` | Keyword substring matching routing to fixed markdown templates. |
| **Disaster Orchestrator** | `orchestrator.py` | `RULE_BASED` | Sequential 8-phase state transition pipeline. |
| **CAP Alert Generator** | `specialists.py` | `RULE_BASED` | OASIS CAP-JSON string template construction. |

---

## 10. REPRODUCTION COMMANDS & LIMITATIONS

### Reproduction Commands

To reproduce the exact audit findings and verify every metric, checkpoint, and trace:

```bash
# 1. Navigate to AI service
cd disaster-mapper/ai-service

# 2. Execute the Comprehensive Reality Audit Script
python app/evaluation/run_model_audit.py

# 3. Generate Visual Audit Comparison Artifacts
python app/evaluation/generate_visualizations.py

# 4. Run the Evaluation Suite (Inspect synthetic array generation)
python -m app.evaluation.evaluate_models

# 5. Inspect generated audit artifacts
dir audit_artifacts
```

### Discovered Failures & Fixes Applied During Audit:
1. **UNet Skip Connection Dimension Bug (`app/models/flood_segmentation/model.py`)**:
   - `self.conv1`, `self.conv2`, `self.conv3` expected 512, 256, 128 channels, but concatenated skip tensors produced 768, 384, 192 channels. Fixed to allow genuine forward pass.
2. **Copilot Missing Imports (`app/api/routes.py`)**:
   - `road_segmentation_pipeline` and `numpy as np` were not imported, causing 500 Internal Server Errors when querying road routes. Fixed to enable Copilot functionality.
3. **Pydantic Serialization Error (`app/evaluation/run_model_audit.py`)**:
   - `HumanApprovalRequest` was not natively JSON serializable. Resolved using `default=str`.

### Current Limitations:
1. **Zero Pretrained Vision Checkpoints on Disk**: No actual trained `.pt` or `.safetensors` files exist for Sentinel-2 water segmentation, SpaceNet road detection, xBD building damage, or CrisisMMD hazard classification.
2. **Synthetic Evaluation Ground Truth**: Accuracy metrics (IoU, F1, AUROC) cannot be verified against empirical disaster holdout datasets because no test splits are stored in the repository.
3. **Template-Based Natural Language**: The AI Copilot is a keyword pattern matcher, not an LLM. It cannot dynamically evaluate arbitrary unseen operational questions outside its configured intent branches.

### Remediation Roadmap:
1. Download official Sen1Floods11 TorchScript weights (`sen1floods11_v1.pt`) to `models/checkpoints/` and implement `torch.load()`.
2. Connect `susceptibility_model.py` to an on-disk CSV/Parquet catchment dataset (e.g., USGS/CWC catchment historical records).
3. Replace hardcoded road lines with OSM Overpass API queries or vectorization of actual neural segmentation masks.
4. Replace keyword Copilot routing with an agentic LLM (e.g., LangChain/LangGraph or local Ollama) grounded in live tool APIs.
