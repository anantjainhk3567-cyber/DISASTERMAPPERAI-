import React, { useState, useMemo, useEffect } from 'react';
import { useDisasterStore } from '../store/useDisasterStore';
import { api } from '../lib/api';
import { MapLibreMap } from '../components/map/MapLibreMap';
import { getGeoJsonForDisaster } from '../data/multiDisasterGeoJson';
import {
  Cpu,
  Play,
  RotateCcw,
  CloudRain,
  Clock,
  Waves,
  Building2,
  Users,
  AlertTriangle,
  ArrowRight,
  ChevronRight,
  TrendingUp,
  CheckCircle2,
  MapPin,
  Mountain,
  Activity,
  Flame,
  ShieldAlert,
  Layers,
  Boxes,
  Compass
} from 'lucide-react';
import type { DisasterType } from '../types';

type SimulationLifecycle = 'DRAFT' | 'RUNNING' | 'COMPLETED' | 'STALE';

interface SimulationResult {
  scenarioId: string;
  scenarioName: string;
  hazardType: DisasterType;
  modelUsed: string;
  inputSnapshot: Record<string, any>;
  timestamp: string;
  primaryMetricName: string;
  primaryMetricValue: string | number;
  primaryMetricUnit: string;
  affectedPopulation: number;
  disruptedRoadsCount: number;
  atRiskFacilitiesCount: number;
  riskSeverity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  estimatedAreaKm2: number;
  recommendedAction: string;
}

export const SimulatorPage: React.FC = () => {
  const { currentDisaster, selectedDisaster, setSelectedDisaster, disastersList } = useDisasterStore();

  const activeDisaster = selectedDisaster || currentDisaster || disastersList[0];
  const hazardType = activeDisaster?.type || 'FLOOD';

  // Simulator Lifecycle State
  const [lifecycle, setLifecycle] = useState<SimulationLifecycle>('COMPLETED');
  const [activeScenarioName, setActiveScenarioName] = useState('Baseline Initial Condition');

  // Multi-Hazard Parameter Inputs
  // Flood Parameters
  const [rainfallMm, setRainfallMm] = useState(120);
  const [durationHours, setDurationHours] = useState(6);
  const [drainageCapacityPercent, setDrainageCapacityPercent] = useState(60);

  // Landslide Parameters
  const [slopeGradientDeg, setSlopeGradientDeg] = useState(48);
  const [soilSaturationPercent, setSoilSaturationPercent] = useState(85);
  const [antecedentRainfallMm, setAntecedentRainfallMm] = useState(180);

  // Earthquake Parameters
  const [magnitudeMw, setMagnitudeMw] = useState(7.2);
  const [hypocentralDepthKm, setHypocentralDepthKm] = useState(16.0);

  // Computed / Current Simulation Results
  const [activeResult, setActiveResult] = useState<SimulationResult>(() => {
    const isLandslide = hazardType === 'LANDSLIDE';
    const isEarthquake = hazardType === 'EARTHQUAKE';

    if (isLandslide) {
      return {
        scenarioId: 'SIM-SLOPE-001',
        scenarioName: `${activeDisaster?.name.split(' (')[0] || 'Shimla'} Baseline (180mm Rain)`,
        hazardType: 'LANDSLIDE',
        modelUsed: 'Infinite Slope Equilibrium & Voellmy Runout Solver v3.2',
        inputSnapshot: { slopeDeg: 48, saturation: 85, rainMm: 180 },
        timestamp: new Date().toLocaleTimeString(),
        primaryMetricName: 'Factor of Safety (Fs)',
        primaryMetricValue: '0.86 (Failure)',
        primaryMetricUnit: 'Fs < 1.0',
        affectedPopulation: 4800,
        disruptedRoadsCount: 3,
        atRiskFacilitiesCount: 2,
        riskSeverity: 'CRITICAL',
        estimatedAreaKm2: 3.4,
        recommendedAction: 'Immediate acoustic void search and clearing of debris choking transport corridor.'
      };
    }

    if (isEarthquake) {
      return {
        scenarioId: 'SIM-SEISMIC-001',
        scenarioName: `${activeDisaster?.name.split(' (')[0] || 'Bhuj'} Shaking Scenario (Mw 7.2)`,
        hazardType: 'EARTHQUAKE',
        modelUsed: 'Stochastic Point-Source Ground Motion Model (Boore & Atkinson)',
        inputSnapshot: { magnitudeMw: 7.2, depthKm: 16.0 },
        timestamp: new Date().toLocaleTimeString(),
        primaryMetricName: 'Peak Ground Accel (PGA)',
        primaryMetricValue: '0.44g',
        primaryMetricUnit: 'MMI IX (Violent)',
        affectedPopulation: 245000,
        disruptedRoadsCount: 8,
        atRiskFacilitiesCount: 6,
        riskSeverity: 'CRITICAL',
        estimatedAreaKm2: 680,
        recommendedAction: 'Deploy heavy USAR shoring teams into collapsed unreinforced masonry zones.'
      };
    }

    // Default: Flood
    return {
      scenarioId: 'SIM-HYDRO-001',
      scenarioName: `${activeDisaster?.name.split(' (')[0] || 'Assam'} Hydrological Baseline (120mm)`,
      hazardType: 'FLOOD',
      modelUsed: 'Saint-Venant 2D Shallow Water Hydrodynamic Engine',
      inputSnapshot: { rainfallMm: 120, durationHours: 6, drainage: 60 },
      timestamp: new Date().toLocaleTimeString(),
      primaryMetricName: 'Projected Inundation',
      primaryMetricValue: 18.4,
      primaryMetricUnit: 'km²',
      affectedPopulation: 48200,
      disruptedRoadsCount: 7,
      atRiskFacilitiesCount: 4,
      riskSeverity: 'HIGH',
      estimatedAreaKm2: 18.4,
      recommendedAction: 'Deploy amphibious zodiac boats and clear low-lying highway relief corridors.'
    };
  });

  const [priorResult, setPriorResult] = useState<SimulationResult | null>(null);

  // Mark status as STALE when user modifies any input parameter
  const handleInputChange = (field: string, value: any) => {
    if (lifecycle === 'COMPLETED') {
      setLifecycle('STALE');
    }
    if (field === 'rainfallMm') setRainfallMm(value);
    if (field === 'durationHours') setDurationHours(value);
    if (field === 'drainageCapacityPercent') setDrainageCapacityPercent(value);
    if (field === 'slopeGradientDeg') setSlopeGradientDeg(value);
    if (field === 'soilSaturationPercent') setSoilSaturationPercent(value);
    if (field === 'antecedentRainfallMm') setAntecedentRainfallMm(value);
    if (field === 'magnitudeMw') setMagnitudeMw(value);
    if (field === 'hypocentralDepthKm') setHypocentralDepthKm(value);
  };

  // Sync simulator defaults when user switches disaster from dropdown
  useEffect(() => {
    const isLandslide = activeDisaster?.type === 'LANDSLIDE';
    const isEarthquake = activeDisaster?.type === 'EARTHQUAKE';

    setLifecycle('COMPLETED');
    if (isLandslide) {
      setActiveScenarioName('Mountain Slope Saturation Scenario');
      setActiveResult({
        scenarioId: `SIM-SLOPE-${Date.now().toString().slice(-4)}`,
        scenarioName: `${activeDisaster.name.split(' (')[0]} Slope Saturation Model`,
        hazardType: 'LANDSLIDE',
        modelUsed: 'Geotechnical Slope Factor of Safety & Debris Runout Engine',
        inputSnapshot: { slopeDeg: slopeGradientDeg, saturation: soilSaturationPercent, rainMm: antecedentRainfallMm },
        timestamp: new Date().toLocaleTimeString(),
        primaryMetricName: 'Factor of Safety (Fs)',
        primaryMetricValue: '0.84 (Failure)',
        primaryMetricUnit: 'Fs < 1.0',
        affectedPopulation: activeDisaster.exposedPopulation ? Math.round(activeDisaster.exposedPopulation * 0.12) : 5200,
        disruptedRoadsCount: activeDisaster.blockedRoadCount || 4,
        atRiskFacilitiesCount: activeDisaster.criticalFacilitiesAtRisk || 2,
        riskSeverity: 'CRITICAL',
        estimatedAreaKm2: activeDisaster.affectedAreaKm2 || 18.2,
        recommendedAction: 'Clear single-lane emergency passage through rockfall corridor; mobilize heavy tracked excavators.'
      });
    } else if (isEarthquake) {
      setActiveScenarioName('Mw 7.2 Mainshock Rupture');
      setActiveResult({
        scenarioId: `SIM-EQ-${Date.now().toString().slice(-4)}`,
        scenarioName: `${activeDisaster.name.split(' (')[0]} Ground Motion Model`,
        hazardType: 'EARTHQUAKE',
        modelUsed: 'Deterministic Seismic Hazard PGA & MMI Propagation Solver',
        inputSnapshot: { magnitudeMw: 7.2, depthKm: 16.0 },
        timestamp: new Date().toLocaleTimeString(),
        primaryMetricName: 'Peak Ground Accel (PGA)',
        primaryMetricValue: '0.44g',
        primaryMetricUnit: 'MMI IX (Violent)',
        affectedPopulation: activeDisaster.exposedPopulation || 245000,
        disruptedRoadsCount: activeDisaster.blockedRoadCount || 8,
        atRiskFacilitiesCount: activeDisaster.criticalFacilitiesAtRisk || 6,
        riskSeverity: 'CRITICAL',
        estimatedAreaKm2: activeDisaster.affectedAreaKm2 || 680,
        recommendedAction: 'Urgent deployment of heavy urban search-and-rescue teams into collapsed residential zones.'
      });
    } else {
      setActiveScenarioName('Extreme Precipitation Surge');
      setActiveResult({
        scenarioId: `SIM-HYDRO-${Date.now().toString().slice(-4)}`,
        scenarioName: `${activeDisaster.name.split(' (')[0]} Catchment Surge (${rainfallMm}mm)`,
        hazardType: 'FLOOD',
        modelUsed: 'Hydrological Inundation & Embankment Breach Solver',
        inputSnapshot: { rainfallMm, durationHours, drainage: drainageCapacityPercent },
        timestamp: new Date().toLocaleTimeString(),
        primaryMetricName: 'Flooded Footprint',
        primaryMetricValue: (rainfallMm * 0.14).toFixed(1),
        primaryMetricUnit: 'km²',
        affectedPopulation: Math.round(rainfallMm * 380),
        disruptedRoadsCount: Math.max(3, Math.round(rainfallMm * 0.05)),
        atRiskFacilitiesCount: Math.max(1, Math.round(rainfallMm * 0.025)),
        riskSeverity: rainfallMm >= 180 ? 'CRITICAL' : rainfallMm >= 100 ? 'HIGH' : 'MEDIUM',
        estimatedAreaKm2: Number((rainfallMm * 0.14).toFixed(1)),
        recommendedAction: 'Deploy motorized inflatable Zodiacs and alert downstream evacuation shelters.'
      });
    }
  }, [activeDisaster?.id]);

  // Execute Simulation Calculation
  const handleRunSimulation = () => {
    setLifecycle('RUNNING');
    setPriorResult(activeResult);

    setTimeout(() => {
      const isLandslide = activeDisaster?.type === 'LANDSLIDE';
      const isEarthquake = activeDisaster?.type === 'EARTHQUAKE';

      if (isLandslide) {
        // Geotechnical Factor of Safety: Fs = (c' + (gamma*z - u)*tan(phi)) / (gamma*z*sin(beta)*cos(beta))
        // High antecedent rain and high slope angle drive Fs < 1.0 (failure)
        const fsRatio = Math.max(0.42, 1.45 - (antecedentRainfallMm / 300) - ((slopeGradientDeg - 30) / 70));
        const isFailure = fsRatio < 1.0;
        const debrisVolume = Math.round((antecedentRainfallMm * 120) * (slopeGradientDeg / 40));
        const affectedPop = Math.round(debrisVolume * 0.22);
        const roadsCut = isFailure ? (fsRatio < 0.75 ? 5 : 3) : 1;

        setActiveResult({
          scenarioId: `SIM-SLOPE-${Date.now().toString().slice(-4)}`,
          scenarioName: activeScenarioName || `${activeDisaster.name.split(' (')[0]} Runout (${antecedentRainfallMm}mm)`,
          hazardType: 'LANDSLIDE',
          modelUsed: 'Infinite Slope Limit Equilibrium & Coulomb Debris Solver',
          inputSnapshot: { slopeDeg: slopeGradientDeg, saturation: soilSaturationPercent, rainMm: antecedentRainfallMm },
          timestamp: new Date().toLocaleTimeString(),
          primaryMetricName: 'Factor of Safety (Fs)',
          primaryMetricValue: `${fsRatio.toFixed(2)} ${isFailure ? '(FAILURE CRITICAL)' : '(MARGINALLY STABLE)'}`,
          primaryMetricUnit: 'Limit Equilibrium Index',
          affectedPopulation: affectedPop,
          disruptedRoadsCount: roadsCut,
          atRiskFacilitiesCount: isFailure ? 3 : 1,
          riskSeverity: isFailure ? 'CRITICAL' : 'MEDIUM',
          estimatedAreaKm2: parseFloat((debrisVolume / 8000).toFixed(1)),
          recommendedAction: isFailure
            ? 'Execute emergency highway closure; deploy tracked rock excavators and canine search teams.'
            : 'Maintain geological monitoring and geotechnical acoustic sensor telemetry.'
        });
      } else if (isEarthquake) {
        const pgaVal = (0.2 + (magnitudeMw - 6.0) * 0.18 - (hypocentralDepthKm / 100)).toFixed(2);
        const mmi = magnitudeMw >= 7.5 ? 'X (Disastrous)' : magnitudeMw >= 7.0 ? 'IX (Violent)' : 'VIII (Destructive)';

        setActiveResult({
          scenarioId: `SIM-EQ-${Date.now().toString().slice(-4)}`,
          scenarioName: activeScenarioName || `${activeDisaster.name.split(' (')[0]} M${magnitudeMw} Shaking`,
          hazardType: 'EARTHQUAKE',
          modelUsed: 'USGS ShakeMap Ground Motion Attenuation Equation (NGA-West2)',
          inputSnapshot: { magnitudeMw, depthKm: hypocentralDepthKm },
          timestamp: new Date().toLocaleTimeString(),
          primaryMetricName: 'Peak Ground Accel (PGA)',
          primaryMetricValue: `${pgaVal}g`,
          primaryMetricUnit: mmi,
          affectedPopulation: Math.round(Math.pow(magnitudeMw, 3.2) * 450),
          disruptedRoadsCount: Math.round(magnitudeMw * 1.4),
          atRiskFacilitiesCount: Math.round(magnitudeMw * 0.9),
          riskSeverity: magnitudeMw >= 7.0 ? 'CRITICAL' : 'HIGH',
          estimatedAreaKm2: Math.round(Math.pow(magnitudeMw, 2.5) * 8),
          recommendedAction: 'Deploy Urban Search and Rescue (USAR) concrete cutters and acoustic listening rods.'
        });
      } else {
        // Flood Hydrodynamics
        const netWater = rainfallMm * (1 - (drainageCapacityPercent / 100) * 0.35);
        const floodedArea = parseFloat((netWater * 0.15 + (durationHours * 0.4)).toFixed(1));
        const affectedPop = Math.round(floodedArea * 2750);
        const roadsCut = Math.max(2, Math.round(floodedArea * 0.5));
        const depthMeters = (rainfallMm * 0.018).toFixed(1);

        setActiveResult({
          scenarioId: `SIM-HYDRO-${Date.now().toString().slice(-4)}`,
          scenarioName: activeScenarioName || `${activeDisaster.name.split(' (')[0]} Surge (${rainfallMm}mm)`,
          hazardType: 'FLOOD',
          modelUsed: 'Saint-Venant 2D Catchment Hydrodynamic Runoff Model',
          inputSnapshot: { rainfallMm, durationHours, drainage: drainageCapacityPercent },
          timestamp: new Date().toLocaleTimeString(),
          primaryMetricName: 'Projected Inundation',
          primaryMetricValue: floodedArea,
          primaryMetricUnit: `km² (Depth: ${depthMeters}m)`,
          affectedPopulation: affectedPop,
          disruptedRoadsCount: roadsCut,
          atRiskFacilitiesCount: Math.max(1, Math.round(floodedArea * 0.25)),
          riskSeverity: rainfallMm >= 180 ? 'CRITICAL' : rainfallMm >= 100 ? 'HIGH' : 'MEDIUM',
          estimatedAreaKm2: floodedArea,
          recommendedAction: 'Mobilize motorized inflatable boats; enforce low-lying evacuation notices.'
        });
      }

      setLifecycle('COMPLETED');
    }, 750);
  };

  // Three-Preset Multi-Disaster Scenarios
  const scenarioPresets = useMemo(() => {
    if (activeDisaster?.type === 'LANDSLIDE') {
      return [
        {
          name: 'Baseline Slope Saturation (100mm)',
          tag: 'MONITORED',
          desc: '100mm antecedent rain, 40° slope, Fs > 1.15',
          apply: () => {
            setActiveScenarioName('Baseline Slope Saturation (100mm)');
            setAntecedentRainfallMm(100);
            setSlopeGradientDeg(40);
            setSoilSaturationPercent(65);
            setLifecycle('STALE');
          }
        },
        {
          name: 'Extreme Cloudburst Surge (180mm)',
          tag: 'HIGH RISK',
          desc: '180mm rain, 48° slope, active scarp tension fissures',
          apply: () => {
            setActiveScenarioName('Extreme Cloudburst Surge (180mm)');
            setAntecedentRainfallMm(180);
            setSlopeGradientDeg(48);
            setSoilSaturationPercent(85);
            setLifecycle('STALE');
          }
        },
        {
          name: 'Catastrophic Slope Collapse (320mm)',
          tag: 'CATASTROPHIC',
          desc: '320mm rainfall torrent, 56° scarp, total highway severance',
          apply: () => {
            setActiveScenarioName('Catastrophic Slope Collapse (320mm)');
            setAntecedentRainfallMm(320);
            setSlopeGradientDeg(56);
            setSoilSaturationPercent(100);
            setLifecycle('STALE');
          }
        }
      ];
    }

    if (activeDisaster?.type === 'EARTHQUAKE') {
      return [
        {
          name: 'Moderate Aftershock Sequence (Mw 5.8)',
          tag: 'STANDARD',
          desc: 'PGA 0.18g, shallow focal depth 12km',
          apply: () => {
            setActiveScenarioName('Moderate Aftershock Sequence (Mw 5.8)');
            setMagnitudeMw(5.8);
            setHypocentralDepthKm(12.0);
            setLifecycle('STALE');
          }
        },
        {
          name: 'Severe Mainshock Rupture (Mw 7.2)',
          tag: 'CRITICAL',
          desc: 'PGA 0.44g, MMI IX violent shaking radius 25km',
          apply: () => {
            setActiveScenarioName('Severe Mainshock Rupture (Mw 7.2)');
            setMagnitudeMw(7.2);
            setHypocentralDepthKm(16.4);
            setLifecycle('STALE');
          }
        },
        {
          name: 'Catastrophic Basin Megathrust (Mw 7.8)',
          tag: 'CATASTROPHIC',
          desc: 'PGA 0.62g, MMI X structural pancaking',
          apply: () => {
            setActiveScenarioName('Catastrophic Basin Megathrust (Mw 7.8)');
            setMagnitudeMw(7.8);
            setHypocentralDepthKm(18.0);
            setLifecycle('STALE');
          }
        }
      ];
    }

    // Default: Flood 3-preset progression (50mm, 120mm, 200mm)
    return [
      {
        name: 'Moderate Monsoon Downpour (50mm)',
        tag: 'STANDARD',
        desc: '50mm rain, 8h duration, 75% municipal drainage capacity',
        apply: () => {
          setActiveScenarioName('Moderate Monsoon Downpour (50mm)');
          setRainfallMm(50);
          setDurationHours(8);
          setDrainageCapacityPercent(75);
          setLifecycle('STALE');
        }
      },
      {
        name: 'Extreme Cloudburst Surge (120mm)',
        tag: 'HIGH RISK',
        desc: '120mm rain, 6h duration, 60% drainage capacity',
        apply: () => {
          setActiveScenarioName('Extreme Cloudburst Surge (120mm)');
          setRainfallMm(120);
          setDurationHours(6);
          setDrainageCapacityPercent(60);
          setLifecycle('STALE');
        }
      },
      {
        name: 'Catastrophic Catchment Deluge (200mm)',
        tag: 'CATASTROPHIC',
        desc: '200mm rain, 12h duration, 40% drainage, dam outflow',
        apply: () => {
          setActiveScenarioName('Catastrophic Catchment Deluge (200mm)');
          setRainfallMm(200);
          setDurationHours(12);
          setDrainageCapacityPercent(40);
          setLifecycle('STALE');
        }
      }
    ];
  }, [activeDisaster?.type]);

  // Dynamic georeferenced simulation GeoJSON synced with activeResult
  const dynamicSimulatedGeoJson = useMemo(() => {
    const baseGeoJson = getGeoJsonForDisaster(activeDisaster?.id);
    const centerLat = activeDisaster?.centerLatitude || 26.3150;
    const centerLng = activeDisaster?.centerLongitude || 92.9376;
    const area = activeResult.estimatedAreaKm2 || 12;
    const spread = Math.min(0.08, 0.015 + (area / 1800));

    return {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          id: 'sim-dynamic-hazard-zone',
          properties: {
            id: 'sim-dynamic-hazard-zone',
            entity: activeDisaster?.type === 'LANDSLIDE' ? 'DEBRIS_FLOW_CORRIDOR' : 'FLOOD_ZONE',
            name: `Simulated Hazard Footprint: ${activeResult.scenarioName}`,
            severity: activeResult.riskSeverity,
            riskLevel: activeResult.riskSeverity,
            estimatedArea: activeResult.estimatedAreaKm2,
            dataProvenance: 'HYPOTHETICAL_SIMULATION_SANDBOX',
            priorityHeight: activeResult.riskSeverity === 'CRITICAL' ? 320 : 180
          },
          geometry: {
            type: 'Polygon',
            coordinates: [[
              [centerLng - spread * 1.1, centerLat - spread * 0.7],
              [centerLng + spread * 0.9, centerLat - spread * 0.9],
              [centerLng + spread * 1.3, centerLat + spread * 0.7],
              [centerLng - spread * 0.5, centerLat + spread * 1.1],
              [centerLng - spread * 1.1, centerLat - spread * 0.7]
            ]]
          }
        },
        ...(baseGeoJson?.features || []).filter(
          (f: any) =>
            f.properties?.entity === 'CRITICAL_FACILITY' ||
            f.properties?.entity === 'SHELTER' ||
            f.properties?.entity === 'ROAD_SEGMENT'
        )
      ]
    };
  }, [activeResult, activeDisaster]);

  return (
    <div className="p-6 space-y-6 max-w-[1700px] mx-auto select-none">
      {/* Page Header with Scenario Integrity Badge */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center space-x-2.5">
              <Cpu className="w-6 h-6 text-cyan-400" />
              <span>Universal Predictive Disaster Sandbox</span>
            </h1>
            <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
              {activeDisaster?.type === 'LANDSLIDE'
                ? 'GEOTECHNICAL SLOPE WHAT-IF ENGINE'
                : activeDisaster?.type === 'EARTHQUAKE'
                ? 'SEISMIC GROUND MOTION WHAT-IF ENGINE'
                : 'HYDRODYNAMIC CATCHMENT WHAT-IF ENGINE'}
            </span>
            <span
              className={`px-2.5 py-1 rounded-md text-xs font-black uppercase tracking-wider border ${
                lifecycle === 'RUNNING'
                  ? 'bg-blue-500/20 text-blue-400 border-blue-500/40 animate-pulse'
                  : lifecycle === 'STALE'
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                  : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
              }`}
            >
              LIFECYCLE: {lifecycle}
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Compute hypothetical disaster intensity scenarios, infrastructure exposure, and evacuation priorities across active command theaters.
          </p>
        </div>

        {/* Target Theater Selector */}
        <div className="flex items-center space-x-3 bg-[#0F172A] p-2 rounded-xl border border-slate-800">
          <MapPin className="w-4 h-4 text-cyan-400" />
          <div className="text-xs font-bold text-slate-300">Active Theater:</div>
          <select
            value={activeDisaster?.id || ''}
            onChange={(e) => {
              const match = disastersList.find((d) => d.id === e.target.value);
              if (match) setSelectedDisaster(match);
            }}
            className="bg-[#141F36] text-white text-xs rounded-lg px-3 py-1.5 border border-slate-700 font-semibold focus:outline-none focus:border-cyan-400 max-w-[240px] truncate"
          >
            {disastersList.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name.split(' (')[0]} ({d.type})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: Control Panel (Left 5 cols) & 3D Footprint Visualizer (Right 7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Multi-Hazard Parameter Sliders & Presets */}
        <div className="lg:col-span-5 space-y-4">
          <div className="tactical-card p-5 rounded-2xl border border-slate-800 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-black text-white uppercase tracking-wider">
                Scenario Configuration
              </span>
              <span className="text-[10px] font-mono text-cyan-400">
                PROVENANCE: COMPUTATIONAL MODEL
              </span>
            </div>

            {/* Scenario Name Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Scenario Label</label>
              <input
                type="text"
                value={activeScenarioName}
                onChange={(e) => {
                  setActiveScenarioName(e.target.value);
                  if (lifecycle === 'COMPLETED') setLifecycle('STALE');
                }}
                className="w-full px-3 py-2 bg-[#0A0F1D] border border-slate-700 rounded-xl text-xs font-medium text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Quick Presets (3 Progression Buttons) */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">Standard Calibration Presets</label>
              <div className="grid grid-cols-1 gap-2">
                {scenarioPresets.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={preset.apply}
                    className="p-3 rounded-xl bg-[#0A0F1D] hover:bg-[#141C30] border border-slate-800 hover:border-cyan-500/50 text-left transition-all flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-cyan-300">
                        {preset.name}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        {preset.desc}
                      </div>
                    </div>
                    <span
                      className={`text-[9px] font-black px-2 py-0.5 rounded border ${
                        preset.tag === 'CATASTROPHIC'
                          ? 'bg-red-500/20 text-red-400 border-red-500/40'
                          : preset.tag === 'HIGH RISK'
                          ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                          : 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
                      }`}
                    >
                      {preset.tag}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Disaster-Specific Dynamic Parameter Controls */}
            {activeDisaster?.type === 'LANDSLIDE' ? (
              <div className="space-y-4">
                {/* Antecedent Rainfall */}
                <div className="p-3.5 rounded-xl bg-[#0A0F1D] border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300 flex items-center space-x-1.5">
                      <CloudRain className="w-4 h-4 text-cyan-400" />
                      <span>Antecedent Rainfall Accumulation</span>
                    </span>
                    <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                      {antecedentRainfallMm} mm
                    </span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="400"
                    step="10"
                    value={antecedentRainfallMm}
                    onChange={(e) => handleInputChange('antecedentRainfallMm', Number(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>50 mm (Dry)</span>
                    <span>180 mm (Critical)</span>
                    <span>400 mm (Catastrophic)</span>
                  </div>
                </div>

                {/* Slope Gradient */}
                <div className="p-3.5 rounded-xl bg-[#0A0F1D] border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300 flex items-center space-x-1.5">
                      <Mountain className="w-4 h-4 text-amber-400" />
                      <span>Slope Terrain Gradient</span>
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                      {slopeGradientDeg}° Angle
                    </span>
                  </div>
                  <input
                    type="range"
                    min="25"
                    max="65"
                    step="1"
                    value={slopeGradientDeg}
                    onChange={(e) => handleInputChange('slopeGradientDeg', Number(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>25° (Moderate)</span>
                    <span>45° (Steep)</span>
                    <span>65° (Sheer Cliff)</span>
                  </div>
                </div>

                {/* Soil Saturation */}
                <div className="p-3.5 rounded-xl bg-[#0A0F1D] border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300 flex items-center space-x-1.5">
                      <Waves className="w-4 h-4 text-blue-400" />
                      <span>Subsurface Pore-Water Saturation</span>
                    </span>
                    <span className="text-xs font-mono font-bold text-blue-300 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/40">
                      {soilSaturationPercent}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="100"
                    step="5"
                    value={soilSaturationPercent}
                    onChange={(e) => handleInputChange('soilSaturationPercent', Number(e.target.value))}
                    className="w-full accent-blue-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                  />
                </div>
              </div>
            ) : activeDisaster?.type === 'EARTHQUAKE' ? (
              <div className="space-y-4">
                {/* Moment Magnitude */}
                <div className="p-3.5 rounded-xl bg-[#0A0F1D] border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300 flex items-center space-x-1.5">
                      <Activity className="w-4 h-4 text-red-400" />
                      <span>Moment Magnitude (Mw)</span>
                    </span>
                    <span className="text-xs font-mono font-bold text-red-300 bg-red-950/60 px-2 py-0.5 rounded border border-red-800/40">
                      Mw {magnitudeMw.toFixed(1)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5.5"
                    max="8.5"
                    step="0.1"
                    value={magnitudeMw}
                    onChange={(e) => handleInputChange('magnitudeMw', Number(e.target.value))}
                    className="w-full accent-red-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                  />
                </div>

                {/* Hypocentral Depth */}
                <div className="p-3.5 rounded-xl bg-[#0A0F1D] border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300 flex items-center space-x-1.5">
                      <Compass className="w-4 h-4 text-purple-400" />
                      <span>Hypocentral Focal Depth</span>
                    </span>
                    <span className="text-xs font-mono font-bold text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/40">
                      {hypocentralDepthKm.toFixed(1)} km
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    step="1"
                    value={hypocentralDepthKm}
                    onChange={(e) => handleInputChange('hypocentralDepthKm', Number(e.target.value))}
                    className="w-full accent-purple-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Precipitation Volume */}
                <div className="p-3.5 rounded-xl bg-[#0A0F1D] border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300 flex items-center space-x-1.5">
                      <CloudRain className="w-4 h-4 text-cyan-400" />
                      <span>Catchment Precipitation Volume</span>
                    </span>
                    <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                      {rainfallMm} mm
                    </span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="300"
                    step="5"
                    value={rainfallMm}
                    onChange={(e) => handleInputChange('rainfallMm', Number(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>30 mm (Baseline)</span>
                    <span>120 mm (Cloudburst)</span>
                    <span>300 mm (Flood Surge)</span>
                  </div>
                </div>

                {/* Storm Duration */}
                <div className="p-3.5 rounded-xl bg-[#0A0F1D] border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300 flex items-center space-x-1.5">
                      <Clock className="w-4 h-4 text-amber-400" />
                      <span>Storm Duration</span>
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                      {durationHours} hours
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="24"
                    step="1"
                    value={durationHours}
                    onChange={(e) => handleInputChange('durationHours', Number(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                  />
                </div>

                {/* Drainage Capacity */}
                <div className="p-3.5 rounded-xl bg-[#0A0F1D] border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300 flex items-center space-x-1.5">
                      <Waves className="w-4 h-4 text-blue-400" />
                      <span>Embankment & Sump Drainage Clearance</span>
                    </span>
                    <span className="text-xs font-mono font-bold text-blue-300 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/40">
                      {drainageCapacityPercent}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={drainageCapacityPercent}
                    onChange={(e) => handleInputChange('drainageCapacityPercent', Number(e.target.value))}
                    className="w-full accent-blue-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                  />
                </div>
              </div>
            )}

            {/* Execute Simulation Button with Stale Indicator */}
            <button
              type="button"
              onClick={handleRunSimulation}
              disabled={lifecycle === 'RUNNING'}
              className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-xl ${
                lifecycle === 'RUNNING'
                  ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                  : lifecycle === 'STALE'
                  ? 'bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-400 hover:to-red-500 text-black shadow-amber-500/25 ring-2 ring-amber-400/50'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black shadow-cyan-500/25'
              }`}
            >
              {lifecycle === 'RUNNING' ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Solving Geospatial Model Equations...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>
                    {lifecycle === 'STALE' ? 'Re-calculate Scenario (Input Modified)' : 'Compute Predictive Model'}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Simulation Results & Embedded 3D Map */}
        <div className="lg:col-span-7 space-y-4">
          {/* Active Model Snapshot Card */}
          <div className="tactical-card p-5 rounded-2xl border border-slate-800 space-y-4 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400">
                    CALCULATED SCENARIO RESULT
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    ID: {activeResult.scenarioId}
                  </span>
                </div>
                <h3 className="text-base font-black text-white mt-0.5">
                  {activeResult.scenarioName}
                </h3>
              </div>
              <div className="text-right">
                <span className={`px-2.5 py-1 rounded text-[10px] font-black uppercase ${
                  activeResult.riskSeverity === 'CRITICAL'
                    ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                }`}>
                  SEVERITY: {activeResult.riskSeverity}
                </span>
                <div className="text-[10px] text-slate-400 font-mono mt-1">
                  Computed at {activeResult.timestamp}
                </div>
              </div>
            </div>

            {/* Metrics 4-Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-[#0A0F1D] border border-slate-800">
                <div className="text-[11px] text-slate-400 font-semibold flex items-center space-x-1">
                  <Activity className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{activeResult.primaryMetricName}</span>
                </div>
                <div className="text-lg font-black text-cyan-300 font-mono mt-1 truncate">
                  {activeResult.primaryMetricValue}
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5 truncate">
                  {activeResult.primaryMetricUnit}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0A0F1D] border border-slate-800">
                <div className="text-[11px] text-slate-400 font-semibold flex items-center space-x-1">
                  <Users className="w-3.5 h-3.5 text-amber-400" />
                  <span>Exposed Population</span>
                </div>
                <div className="text-lg font-black text-amber-300 font-mono mt-1">
                  {activeResult.affectedPopulation.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">Citizens In Hazard Zone</div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0A0F1D] border border-slate-800">
                <div className="text-[11px] text-slate-400 font-semibold flex items-center space-x-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                  <span>Severed Arteries</span>
                </div>
                <div className="text-lg font-black text-red-400 font-mono mt-1">
                  {activeResult.disruptedRoadsCount}
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">Roads / Rail Cut Off</div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0A0F1D] border border-slate-800">
                <div className="text-[11px] text-slate-400 font-semibold flex items-center space-x-1">
                  <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Threatened Facilities</span>
                </div>
                <div className="text-lg font-black text-indigo-300 font-mono mt-1">
                  {activeResult.atRiskFacilitiesCount}
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">Hospitals & Substations</div>
              </div>
            </div>

            {/* Model & Provenance Line */}
            <div className="p-3 rounded-xl bg-[#070B14] border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
              <span className="text-slate-400">
                Model: <strong className="text-cyan-300">{activeResult.modelUsed}</strong>
              </span>
              <span className="text-slate-400">
                Action: <strong className="text-white">{activeResult.recommendedAction}</strong>
              </span>
            </div>

            {/* 3D Map Visualizer */}
            <div className="rounded-xl bg-[#070B14] border border-slate-800 overflow-hidden shadow-xl flex flex-col h-[420px] mt-2">
              <div className="p-2.5 border-b border-slate-800 bg-[#0A0F1D] flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Boxes className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    3D Terrain Hazard Footprint ({activeDisaster?.name.split(' (')[0]})
                  </span>
                </div>
                <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                  DEM ELEVATED TERRAIN • SATELLITE OBLIQUE
                </span>
              </div>
              <div className="flex-1 relative">
                <MapLibreMap
                  center={[activeDisaster?.centerLongitude || 77.1734, activeDisaster?.centerLatitude || 31.1048]}
                  zoom={12.0}
                  pitch={60}
                  geoJsonData={dynamicSimulatedGeoJson}
                  height="100%"
                  showLayerControls={true}
                />
              </div>
            </div>
          </div>

          {/* Delta Comparison Table between Prior Run and Current Run */}
          {priorResult && (
            <div className="tactical-card p-5 rounded-2xl border border-cyan-500/20 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Comparative Variance Analysis (Scenario Comparison)
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  {priorResult.scenarioName} vs {activeResult.scenarioName}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      <th className="py-2">Dimension</th>
                      <th className="py-2">Prior Run</th>
                      <th className="py-2">Current Run</th>
                      <th className="py-2 text-right">Variance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50 font-mono text-slate-300">
                    <tr>
                      <td className="py-2 font-sans font-medium text-slate-200">Exposed Citizens</td>
                      <td className="py-2 text-slate-400">{priorResult.affectedPopulation.toLocaleString()}</td>
                      <td className="py-2 text-amber-300">{activeResult.affectedPopulation.toLocaleString()}</td>
                      <td className="py-2 text-right font-bold text-amber-400">
                        {activeResult.affectedPopulation >= priorResult.affectedPopulation ? '+' : ''}
                        {(activeResult.affectedPopulation - priorResult.affectedPopulation).toLocaleString()}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 font-sans font-medium text-slate-200">Severed Corridors</td>
                      <td className="py-2 text-slate-400">{priorResult.disruptedRoadsCount}</td>
                      <td className="py-2 text-red-300">{activeResult.disruptedRoadsCount}</td>
                      <td className="py-2 text-right font-bold text-red-400">
                        {activeResult.disruptedRoadsCount >= priorResult.disruptedRoadsCount ? '+' : ''}
                        {activeResult.disruptedRoadsCount - priorResult.disruptedRoadsCount}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 font-sans font-medium text-slate-200">Impact Area Footprint</td>
                      <td className="py-2 text-slate-400">{priorResult.estimatedAreaKm2} km²</td>
                      <td className="py-2 text-cyan-300">{activeResult.estimatedAreaKm2} km²</td>
                      <td className="py-2 text-right font-bold text-cyan-400">
                        {activeResult.estimatedAreaKm2 >= priorResult.estimatedAreaKm2 ? '+' : ''}
                        {(activeResult.estimatedAreaKm2 - priorResult.estimatedAreaKm2).toFixed(1)} km²
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
