# DisasterMapper AI — National Emergency Intelligence & Response Platform

<p align="center">
  <strong>Predict &rarr; Detect &rarr; Verify &rarr; Map &rarr; Prioritize &rarr; Respond</strong>
</p>

DisasterMapper AI is an end-to-end, national-scale disaster intelligence and emergency response platform built to handle urban flooding, landslides, earthquakes, and severe meteorological crises. It bridges satellite remote sensing, hydrodynamic simulation, citizen crowd-sourcing, explainable spatial prioritization, and graph-based emergency routing into a cohesive, production-grade tactical command center.

---

## 1. System Architecture

```text
+-----------------------------------------------------------------------------------------+
|                        TACTICAL COMMAND CENTER UI (React 19 + Vite)                     |
|    MapLibre GL JS (Vector/Raster) • Turf.js GIS • TanStack Query • Recharts • Zustand    |
+--------------------------------------------+--------------------------------------------+
                                             | HTTP / REST (JWT + HttpOnly Cookies)
                                             v
+-----------------------------------------------------------------------------------------+
|                         CORE BACKEND (Fastify + TypeScript)                             |
|  - Real Dijkstra Graph Routing Engine     - Spatial Priority Catchment Scorer          |
|  - Hydrodynamic Simulation Engine         - Cluster-Based Citizen Corroborator         |
|  - Shelter Allocation Greedy Planner      - CAP Emergency Broadcast Subsystem          |
+---------------------+----------------------+---------------------+----------------------+
                      |                      |                     |
                      v                      v                     v
            +-------------------+  +-------------------+  +-------------------+
            | PostgreSQL 16     |  | Redis BullMQ      |  | Python AI Engine  |
            | + PostGIS 3.4     |  | Async Job Broker  |  | (FastAPI + CV)    |
            | Spatial Indices   |  | Ingestion Workers |  | HSV/Otsu/Canny    |
            +-------------------+  +-------------------+  +-------------------+
```

---

## 2. Master Feature Matrix & Screen Guide (All 20 Screens)

| # | Screen | Path | Key Capabilities |
|---|---|---|---|
| **1** | **Authentication** | `/login` | 1-Click evaluator role personas (`COMMANDER`, `ADMIN`, `RESPONDER`, `CITIZEN`), Argon2id + JWT security. |
| **2** | **Command Overview** | `/` | National situation overview, active crises, real-time threat gauges, incident feed, and quick dispatch. |
| **3** | **Live GIS Tactical Map** | `/map` | Multi-layer MapLibre GL map, CartoDB Dark Matter / ESRI Satellite, flood footprint fills, rescue zones, and feature inspector. |
| **4** | **Incident Registry** | `/incidents` | Severity filtering (`CRITICAL`, `HIGH`, `MEDIUM`), search, spatial coordinates, and escalation status. |
| **5** | **Incident Detail** | `/incidents/:id` | Incident triage inspector, nearby shelters, route dispatch, verification audits, and action logging. |
| **6** | **Flood Intelligence** | `/flood` | Rainfall accumulation radar, drainage run-off analysis, peak crest estimation, and hydrodynamic forecasts. |
| **7** | **Disaster Simulator** | `/simulator` | Hydrological What-If simulator with precipitation slider (40–250mm), drainage capacity, and side-by-side delta table. |
| **8** | **Satellite Analysis** | `/imagery` | Multi-spectral catalog (Sentinel-2, Landsat-9, UAV), CV model selector, BullMQ worker telemetry, and polygon detections. |
| **9** | **Before/After Comparison** | `/comparison` | Interactive horizontal split-screen slider, MNDWI change mask overlay, and structural displacement statistics. |
| **10** | **Citizen Report Portal** | `/citizen-reports` | Public hazard reporting, device GPS capture, water depth gauge, trapped persons counter, and tracking receipt codes. |
| **11** | **Report Verification** | `/verification` | Dispatch moderation workspace, spatial cluster corroboration engine (>90% confidence), and 1-click incident escalation. |
| **12** | **Rescue Priorities** | `/priorities` | Ranked catchments, explainable factor breakdown bars (Hazard, Population, Vulnerability, Assets, Cutoff), and Commander override modals. |
| **13** | **Emergency Routing** | `/routing` | Real Dijkstra graph navigation, vehicle clearance profiles (`AMBULANCE`, `FIRE_RESCUE`, `BUS`), and hazard avoidance. |
| **14** | **Shelter Management** | `/shelters` | Bed capacity tracking, medical preparedness tags, live occupancy stepper, and automated greedy evacuation allocation. |
| **15** | **Infrastructure Impact** | `/impact` | Lifeline threat matrix (Hospitals, Substations, Treatment Plants, Bridges), generator autonomy, and isolated settlement alerts. |
| **16** | **Disaster Timeline** | `/timeline` | 4D Disaster Time Machine, Play/Pause/Step temporal scrubber (-24h to +48h), river level gauge, and milestone logs. |
| **17** | **Prediction vs Reality** | `/validation` | IoU (Jaccard) metric gauge, precision, recall, spatial confusion matrix (True Positives, False Alarms, Missed Hazards). |
| **18** | **Alerts & Warnings** | `/alerts` | CAP emergency broadcasting modal, severity tiers (`CRITICAL`, `WARNING`, `ADVISORY`), and operator acknowledgment workflows. |
| **19** | **Analytics & Reporting** | `/analytics` | Recharts hydrographs, category distributions, response duration benchmarks, and 1-click Markdown SitRep export. |
| **20** | **Settings & Diagnostics** | `/settings` | 1-Click evaluator role switcher, microservice health telemetry, scenario context switcher, and immutable audit trails. |

---

## 3. Engineering Highlights & Algorithms

### Genuine Dijkstra Graph Routing (`routeService.ts` & `EmergencyRoutingPage.tsx`)
- **No Euclidean Approximations:** Builds an in-memory topological graph from real road segments with node intersections.
- **Dynamic Hazard Penalties:** Flooded links receive penalty weight multipliers proportional to water depth, or are completely pruned if depth exceeds vehicle clearance thresholds (e.g. `Ambulance: 0.15m`, `Fire Rescue: 0.40m`).
- **Turn-by-Turn Output:** Emits verified street instructions with hazard caution notices.

### Spatial Catchment Prioritization (`priorityService.ts` & `RescuePrioritiesPage.tsx`)
- Localized multi-criteria formula:
  $$\text{Priority Score} = w_h \cdot H + w_p \cdot P + w_v \cdot V + w_i \cdot I + w_c \cdot C$$
- **Commander Override Auditing:** Allows Incident Commanders to promote/demote zone ranks with mandatory justification strings logged directly to PostgreSQL.

### Real Computer Vision & Change Detection (`ai-service/app/services/real_provider.py`)
- **HSV Spectral Flood Segmentation:** Analyzes NDWI / modified water index in HSV color space to delineate standing flood waters.
- **Canny Structural Disorder:** Quantifies high-frequency edge entropy to detect building collapses and debris.
- **Road Discontinuity:** Traces linear features to identify washouts and blockages.
- **Bi-Temporal Difference:** Otsu threshold differencing between pre-event baseline and post-event imagery.

---

## 4. Quick Start & Execution

### Prerequisites
- Node.js v20+ / v24+
- Python 3.11+ / 3.13+
- Redis (native or container on port 6379)
- PostgreSQL 16 + PostGIS (native or container on port 5432)

### Running via Docker Compose
```bash
# Build and run all services (Backend, Frontend, AI-Service, Postgres, Redis, MinIO)
docker compose up --build
```
Access the Tactical Command Center at `http://localhost:5173`.

### Running Locally (Native Development)

#### 1. Backend (`disaster-mapper/backend`)
```bash
cd backend
npm install
npx prisma generate
npm run dev
# Running on http://localhost:3000
```

#### 2. Python AI Service (`disaster-mapper/ai-service`)
```bash
cd ai-service
pip install -r requirements.txt
python -m app.main
# Running on http://localhost:8000
```

#### 3. Frontend Command Center (`disaster-mapper/frontend`)
```bash
cd frontend
npm install
npm run dev
# Running on http://localhost:5173 (proxied to backend at /api)
```

### Running Test Suite
```bash
cd backend
npm test
# Runs vitest test suite covering spatial logic, Dijkstra routing, priorities, and GeoJSON builders
```

---

## 5. Evaluator Credentials (1-Click Demo Profiles)

| Persona | Email | Password | Primary Mission |
|---|---|---|---|
| **Incident Commander** | `commander@demo.local` | `Demo@123` | Tactical zone prioritization, priority overrides, evacuation dispatch |
| **National Admin** | `admin@demo.local` | `Demo@123` | System configuration, CAP emergency broadcast issuance, user management |
| **Field Responder** | `responder@demo.local` | `Demo@123` | Road routing execution, shelter occupancy updates, report verification |
| **Public Citizen** | `citizen@demo.local` | `Demo@123` | Incident reporting portal, emergency guidance |

> Evaluators can also switch personas instantly via the **1-Click Role Switcher** on the `/settings` or `/login` screens.

---

## 6. Offline Resilience & Demo Mode
DisasterMapper AI includes offline fallbacks across both connected and standalone demo modes:
- Seeded scenario profiles for **Delhi NCR Urban Flood (Yamuna Basin)** and **Shimla Highway Landslide (NH-5)**.
- If the PostgreSQL container or backend is not active, client-side Zustand stores immediately supply high-fidelity synthetic ground truth models and cached cartography, allowing complete inspection of all 20 workflows without setup blockers.
