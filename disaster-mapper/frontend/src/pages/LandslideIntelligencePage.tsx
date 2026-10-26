import React, { useState, useMemo, useEffect } from 'react';
import { useDisasterStore } from '../store/useDisasterStore';
import { MapLibreMap } from '../components/map/MapLibreMap';
import { LANDSLIDE_SHIMLA_GEOJSON, LANDSLIDE_JK_GEOJSON, LANDSLIDE_WAYANAD_GEOJSON } from '../data/multiDisasterGeoJson';
import {
  Mountain,
  AlertTriangle,
  CloudRain,
  ShieldAlert,
  Truck,
  TrendingDown,
  Navigation,
  Compass,
  Layers,
  HeartHandshake,
  CheckCircle2,
  Clock,
  Info,
  Radio,
  ExternalLink
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
  CartesianGrid
} from 'recharts';

export const LandslideIntelligencePage: React.FC = () => {
  const { selectedDisaster } = useDisasterStore();

  const defaultScenario = useMemo(() => {
    const id = selectedDisaster?.id?.toLowerCase() || '';
    if (id.includes('shimla') || id.includes('himachal')) return 'SHIMLA';
    if (id.includes('wayanad')) return 'WAYANAD';
    return 'JK_NH44';
  }, [selectedDisaster]);

  const [scenario, setScenario] = useState<'SHIMLA' | 'JK_NH44' | 'WAYANAD'>(defaultScenario);
  const [activeTab, setActiveTab] = useState<'SLOPE_STABILITY' | 'ISOLATED_ZONES' | 'RESCUE_ACCESS'>('SLOPE_STABILITY');

  useEffect(() => {
    setScenario(defaultScenario);
  }, [defaultScenario]);

  // Antecedent Rainfall vs Factor of Safety (FoS) Progression
  const slopeStabilityData = scenario === 'SHIMLA' ? [
    { time: 'T-48h', rainfallMm: 62, soilSaturation: 60, factorOfSafety: 1.78 },
    { time: 'T-36h', rainfallMm: 110, soilSaturation: 74, factorOfSafety: 1.45 },
    { time: 'T-24h', rainfallMm: 175, soilSaturation: 88, factorOfSafety: 1.18 },
    { time: 'T-12h', rainfallMm: 220, soilSaturation: 94, factorOfSafety: 0.98 },
    { time: 'T-00h (Slide Trigger)', rainfallMm: 265, soilSaturation: 99, factorOfSafety: 0.52 },
  ] : scenario === 'JK_NH44' ? [
    { time: 'T-48h', rainfallMm: 45, soilSaturation: 58, factorOfSafety: 1.92 },
    { time: 'T-36h', rainfallMm: 95, soilSaturation: 72, factorOfSafety: 1.64 },
    { time: 'T-24h', rainfallMm: 155, soilSaturation: 84, factorOfSafety: 1.35 },
    { time: 'T-12h', rainfallMm: 195, soilSaturation: 92, factorOfSafety: 1.08 },
    { time: 'T-00h (Slide Trigger)', rainfallMm: 228, soilSaturation: 98, factorOfSafety: 0.58 },
  ] : [
    { time: 'T-48h', rainfallMm: 85, soilSaturation: 62, factorOfSafety: 1.85 },
    { time: 'T-36h', rainfallMm: 160, soilSaturation: 74, factorOfSafety: 1.52 },
    { time: 'T-24h', rainfallMm: 245, soilSaturation: 86, factorOfSafety: 1.28 },
    { time: 'T-12h', rainfallMm: 310, soilSaturation: 94, factorOfSafety: 1.05 },
    { time: 'T-00h (Failure)', rainfallMm: 372, soilSaturation: 98, factorOfSafety: 0.76 },
  ];

  // Isolated Settlements in Impact Corridor
  const isolatedSettlements = scenario === 'SHIMLA' ? [
    { id: 'set-sh-01', name: 'Summer Hill Shiv Bawdi Ground Zero', pop: 480, status: 'BURIED_UNDER_SLURRY', bridgeAccess: 'Ravine footpath & access road buried in 8m mud and timber', rationsRemainingDays: 0.5, airExtractionRequired: true },
    { id: 'set-sh-02', name: 'Kalka-Shimla UNESCO Heritage Rail Sector', pop: 120, status: 'BRIDGE_SPAN_CHASM', bridgeAccess: 'Track bed washed out into 30m vertical gorge', rationsRemainingDays: 2.0, airExtractionRequired: false },
    { id: 'set-sh-03', name: 'Tutikandi & Tara Devi Hillside Settlements', pop: 4200, status: 'NH-5_ROCKFALL_SEVERANCE', bridgeAccess: 'Debris blocking NH-5 near Tara Devi temple; single bypass via narrow rural lane', rationsRemainingDays: 3.0, airExtractionRequired: false },
    { id: 'set-sh-04', name: 'Cart Road Subsidence Housing Cluster', pop: 1850, status: 'TENSION_CRACKS_EVACUATION', bridgeAccess: 'Severe rotational slope deformation threatening multi-story foundations', rationsRemainingDays: 2.5, airExtractionRequired: false },
  ] : scenario === 'JK_NH44' ? [
    { id: 'set-jk-01', name: 'Gool-Gulabgarh Highland Valley', pop: 18500, status: 'HIGHWAY_BURIED', bridgeAccess: 'Ramban arterial cut off by 3 massive debris fans', rationsRemainingDays: 2.5, airExtractionRequired: true },
    { id: 'set-jk-02', name: 'Pogal-Paristan Mountain Pocket', pop: 12200, status: 'BRIDGES_WASHED_AWAY', bridgeAccess: 'Two suspension footbridges destroyed in flash torrent', rationsRemainingDays: 1.5, airExtractionRequired: true },
    { id: 'set-jk-03', name: 'Marwah-Warwan Remote Cluster', pop: 8400, status: 'ISOLATED_FOOTPATH_ONLY', bridgeAccess: 'High-altitude mountain footpaths impassable', rationsRemainingDays: 4.0, airExtractionRequired: false },
    { id: 'set-jk-04', name: 'Panthyal Stranded Truck Fleet Corridor', pop: 1400, status: 'HIGH_ROCKFALL_RISK', bridgeAccess: '450 commercial trucks & civilian buses trapped on highway', rationsRemainingDays: 1.0, airExtractionRequired: true },
  ] : [
    { id: 'set-01', name: 'Mundakkai Plantation Village', pop: 1450, status: 'TOTALLY_CUT_OFF', bridgeAccess: 'Chooralmala Bridge Washed Away', rationsRemainingDays: 2, airExtractionRequired: true },
    { id: 'set-02', name: 'Punchirimattam Scarp Fringe', pop: 420, status: 'ACTIVE_SLIP_ZONE', bridgeAccess: 'Estate jeep road buried in 6m mud', rationsRemainingDays: 1, airExtractionRequired: true },
    { id: 'set-03', name: 'Attamala Valley Hamlet', pop: 680, status: 'PARTIALLY_ISOLATED', bridgeAccess: 'Foot suspension bridge intact', rationsRemainingDays: 4, airExtractionRequired: false },
  ];

  return (
    <div className="space-y-6">
      {/* Scenario Switcher: Shimla vs J&K Mountain Corridor vs Wayanad */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#0B1120] border border-slate-800 p-2.5 rounded-2xl">
        <div className="flex items-center space-x-2 pl-2">
          <Mountain className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Landslide Operational Scenario:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setScenario('SHIMLA')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all ${
              scenario === 'SHIMLA'
                ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/25'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <span>Recent Event: Shimla Summer Hill Scarp & NH-5</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-black/30 text-slate-900 font-mono font-bold">HIMACHAL</span>
          </button>
          <button
            onClick={() => setScenario('JK_NH44')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all ${
              scenario === 'JK_NH44'
                ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/25'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <span>Recent Event: J&K NH-44 Landslide Corridor</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-black/30 text-slate-900 font-mono font-bold">RAMBAN</span>
          </button>
          <button
            onClick={() => setScenario('WAYANAD')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all ${
              scenario === 'WAYANAD'
                ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/25'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <span>Wayanad Debris Flow (Western Ghats Case)</span>
          </button>
        </div>
      </div>

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#2B1B0E] via-[#1C120A] to-[#0B1120] p-6 rounded-2xl border border-amber-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-full bg-amber-500/5 blur-3xl pointer-events-none"></div>
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/20">
            <Mountain className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-xl md:text-2xl font-black text-white tracking-wide">
                {scenario === 'SHIMLA'
                  ? 'Shimla Summer Hill Scarp, Shiv Bawdi & NH-5 Landslide'
                  : scenario === 'JK_NH44'
                  ? 'Jammu & Kashmir Mountain Landslide & NH-44 Severance'
                  : 'Meppadi-Chooralmala Debris Flow Intelligence'}
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/40">
                {scenario === 'SHIMLA' ? 'HIMALAYAN SLIP SCARP' : scenario === 'JK_NH44' ? 'PIR PANJAL ROCKFALL' : 'MASS SLOPE FAILURE'}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                {scenario === 'WAYANAD' ? 'HISTORICAL CASE' : 'RECENT EVENT PROTOTYPE'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {scenario === 'SHIMLA'
                ? 'HPSDMA emergency response, Summer Hill crown scarp failure (24,000 m³), suspended Kalka-Shimla rail track, and IGMC trauma triage.'
                : scenario === 'JK_NH44'
                ? 'Border Roads Organisation (BRO) debris clearing, NH-44 Panthyal-Mehar active rockfall chutes, and high-altitude air-drop operations.'
                : 'Geological Survey of India (GSI) slope susceptibility, TRIGRS transient hydrological infiltration, and isolated population extraction.'}
            </p>
          </div>
        </div>

        {/* Quick Debris Telemetry */}
        <div className="flex items-center space-x-6 shrink-0 bg-[#070B14]/70 p-3 rounded-xl border border-slate-800">
          <div>
            <div className="text-[10px] text-slate-400 font-mono">Debris Volume</div>
            <div className="text-sm font-black text-amber-400">{scenario === 'SHIMLA' ? '24,000 m³' : scenario === 'JK_NH44' ? '152,000 m³' : '3.2M m³'}</div>
          </div>
          <div className="border-l border-slate-800 pl-4">
            <div className="text-[10px] text-slate-400 font-mono">Choke Length</div>
            <div className="text-sm font-black text-cyan-400">{scenario === 'SHIMLA' ? '850m Ravine' : scenario === 'JK_NH44' ? '7.4 km NH-44' : '6.5 km'}</div>
          </div>
          <div className="border-l border-slate-800 pl-4">
            <div className="text-[10px] text-slate-400 font-mono">Failure Slope</div>
            <div className="text-sm font-black text-red-400">{scenario === 'SHIMLA' ? '44° Incline' : scenario === 'JK_NH44' ? '54° Shear Face' : '38° Angle'}</div>
          </div>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="tactical-card p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold">48h Cumulative Rainfall</span>
            <CloudRain className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-400">{scenario === 'SHIMLA' ? '265' : scenario === 'JK_NH44' ? '228' : '372'} <span className="text-xs text-slate-400 font-normal">mm</span></div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono">{scenario === 'SHIMLA' ? '290% over threshold' : scenario === 'JK_NH44' ? '280% over threshold' : '310% over threshold'}</div>
        </div>

        <div className="tactical-card p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold">{scenario === 'SHIMLA' ? 'Transport Disruptions' : scenario === 'JK_NH44' ? 'Blocked Highway Arterials' : 'Severed Bridge Crossings'}</span>
            <Truck className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-black text-red-400">{scenario === 'SHIMLA' ? 'Rail + NH-5' : scenario === 'JK_NH44' ? '3 Choke Points' : '2 Bridges Lost'}</div>
          <div className="text-[11px] text-red-300 mt-1 font-mono">{scenario === 'SHIMLA' ? 'Kalka-Shimla rail & NH-5 cut' : scenario === 'JK_NH44' ? 'Panthyal & Mehar severed' : 'Chooralmala span destroyed'}</div>
        </div>

        <div className="tactical-card p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold">Exposed Population</span>
            <ShieldAlert className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">{scenario === 'SHIMLA' ? '34,500' : scenario === 'JK_NH44' ? '39,100' : '1,870'} <span className="text-xs text-slate-400 font-normal">citizens in threat zone</span></div>
          <div className="text-[11px] text-amber-300 mt-1 font-mono">{scenario === 'SHIMLA' ? 'Summer Hill & Tutikandi' : scenario === 'JK_NH44' ? 'Gool & Pogal pockets' : 'Mundakkai valley isolated'}</div>
        </div>

        <div className="tactical-card p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold">Factor of Safety (FoS)</span>
            <TrendingDown className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-purple-400">{scenario === 'SHIMLA' ? '0.52' : scenario === 'JK_NH44' ? '0.58' : '0.76'} <span className="text-xs text-slate-400 font-normal">&lt; 1.0 (FAILED)</span></div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono">Critical shear slip equilibrium loss</div>
        </div>
      </div>

      {/* Main Grid: 3D Map + Intelligence Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive 3D Landslide Map with Mountain Perspective */}
        <div className="lg:col-span-7 bg-[#0B1120] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[640px]">
          <div className="p-4 border-b border-slate-800/80 bg-[#0F172A]/80 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping"></span>
              <span className="font-bold text-white text-xs">
                {scenario === 'SHIMLA'
                  ? 'Summer Hill Scarp, Shiv Bawdi Ravine, Suspended Rail & RED Zones'
                  : scenario === 'JK_NH44'
                  ? 'NH-44 Rockfall Chutes, Chenab Gorge Debris Runout & RED Priority Zones'
                  : 'Crown Scarp, Debris Avalanche Runout & Cut-Off Bridges'}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
              <span>{scenario === 'SHIMLA' ? 'Center: 31.114°N, 77.135°E (Summer Hill)' : scenario === 'JK_NH44' ? 'Center: 33.242°N, 75.245°E (Ramban)' : 'Center: 11.536°N, 76.132°E'}</span>
            </div>
          </div>
          <div className="flex-1 relative">
            <MapLibreMap
              center={scenario === 'SHIMLA' ? [77.1350, 31.1140] : scenario === 'JK_NH44' ? [75.2450, 33.2420] : [76.1320, 11.5360]}
              zoom={scenario === 'SHIMLA' ? 12.8 : scenario === 'JK_NH44' ? 12.0 : 12.4}
              pitch={scenario === 'SHIMLA' ? 62 : scenario === 'JK_NH44' ? 58 : 54}
              bearing={scenario === 'SHIMLA' ? -15 : scenario === 'JK_NH44' ? -22 : -20}
              geoJsonData={scenario === 'SHIMLA' ? LANDSLIDE_SHIMLA_GEOJSON : scenario === 'JK_NH44' ? LANDSLIDE_JK_GEOJSON : LANDSLIDE_WAYANAD_GEOJSON}
            />
          </div>
        </div>

        {/* Right Column: Tabbed Intelligence Deck */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          <div className="grid grid-cols-3 gap-1 bg-[#0F172A] p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('SLOPE_STABILITY')}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'SLOPE_STABILITY'
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              FoS Dynamics
            </button>
            <button
              onClick={() => setActiveTab('ISOLATED_ZONES')}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'ISOLATED_ZONES'
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Cut-off Hamlets
            </button>
            <button
              onClick={() => setActiveTab('RESCUE_ACCESS')}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'RESCUE_ACCESS'
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {scenario === 'SHIMLA' ? 'HPSDMA & SDRF' : scenario === 'JK_NH44' ? 'BRO & Air Ops' : 'Indian Army Corps'}
            </button>
          </div>

          {/* Tab 1: Factor of Safety Chart */}
          {activeTab === 'SLOPE_STABILITY' && (
            <div className="tactical-card p-5 rounded-2xl border border-slate-800 space-y-4 flex-1">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-white text-xs">Pore Water Pressure vs Slope Shear Stability</span>
                <span className="text-[10px] text-amber-400 font-mono font-bold">TRIGRS INFILTRATION</span>
              </div>

              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={slopeStabilityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                    <XAxis dataKey="time" stroke="#64748B" fontSize={10} />
                    <YAxis stroke="#64748B" fontSize={10} />
                    <Tooltip contentStyle={{ background: '#0F172A', borderColor: '#334155', borderRadius: 8, fontSize: 11 }} />
                    <Area type="monotone" dataKey="factorOfSafety" stroke="#F59E0B" fill="#D97706" fillOpacity={0.25} name="Factor of Safety (FoS)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-2 pt-2 text-xs text-slate-300">
                <div className="p-3 rounded-xl bg-[#070B14]/80 border border-slate-800 flex items-center justify-between">
                  <span>Soil Saturation Index at Trigger:</span>
                  <span className="font-mono font-bold text-red-400">99% (Liquefaction State)</span>
                </div>
                <div className="p-3 rounded-xl bg-[#070B14]/80 border border-slate-800 flex items-center justify-between">
                  <span>Debris Chute Gradient:</span>
                  <span className="font-mono font-bold text-amber-400">{scenario === 'SHIMLA' ? '44° Downhill Ravine' : scenario === 'JK_NH44' ? '54° Shear Face into Chenab' : '38° Downhill to Chaliyar'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Cut-off Hamlets */}
          {activeTab === 'ISOLATED_ZONES' && (
            <div className="tactical-card p-5 rounded-2xl border border-slate-800 space-y-4 flex-1">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-white text-xs">Isolated Mountain Communities</span>
                <span className="text-[10px] text-red-400 font-mono font-bold">URGENT EXTRACTION</span>
              </div>

              <div className="space-y-3">
                {isolatedSettlements.map((s) => (
                  <div key={s.id} className="p-3.5 rounded-xl bg-[#070B14]/80 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-white">{s.name}</span>
                      <span className="text-[10px] font-mono font-bold text-red-400">{s.status}</span>
                    </div>
                    <p className="text-[11px] text-slate-400">Access: {s.bridgeAccess}</p>
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-300 pt-1">
                      <span>Pop: <strong className="text-white">{s.pop.toLocaleString()}</strong></span>
                      <span>Rations: <strong className="text-amber-400">{s.rationsRemainingDays} days left</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Access Corridors & Engineering Operations */}
          {activeTab === 'RESCUE_ACCESS' && (
            <div className="tactical-card p-5 rounded-2xl border border-slate-800 space-y-4 flex-1">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-white text-xs">Access Corridors & Engineering Operations</span>
                <span className="text-[10px] text-cyan-400 font-mono font-bold">
                  {scenario === 'SHIMLA' ? 'HPSDMA / SDRF' : scenario === 'JK_NH44' ? 'BRO PROJECT BEACON' : 'INDIAN ARMY CORPS'}
                </span>
              </div>

              <div className="space-y-3 text-xs">
                {scenario === 'SHIMLA' ? (
                  <>
                    <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-800/40 text-cyan-200 space-y-1">
                      <div className="font-bold flex items-center space-x-2 text-cyan-300">
                        <Truck className="w-4 h-4 text-cyan-400" />
                        <span>SDRF Heavy Rubble Clearing — Summer Hill & Shiv Bawdi</span>
                      </div>
                      <p className="text-[11px] text-slate-300">
                        4 heavy tracked excavators and hydraulic rock splitters clearing 24,000 m³ of boulder-mud slurry. Acoustic void sensors and NDRF canine search teams operating continuously.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-800/40 text-amber-200 space-y-1">
                      <div className="font-bold flex items-center space-x-2 text-amber-300">
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                        <span>IGMC Hospital Mobile Trauma Unit Deployment</span>
                      </div>
                      <p className="text-[11px] text-slate-300">
                        Advanced life support triage station operating at Boileauganj Chowk for immediate stabilization of recovered victims before transit to IGMC Shimla.
                      </p>
                    </div>
                  </>
                ) : scenario === 'JK_NH44' ? (
                  <>
                    <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-800/40 text-cyan-200 space-y-1">
                      <div className="font-bold flex items-center space-x-2 text-cyan-300">
                        <Truck className="w-4 h-4 text-cyan-400" />
                        <span>BRO Heavy Machinery Mobilization — Panthyal & Mehar</span>
                      </div>
                      <p className="text-[11px] text-slate-300">
                        6 heavy CAT D8 crawler bulldozers and 4 hydraulic rock-breaker excavators clearing 152,000 m³ of limestone-shale rubble. Blasting operations authorized during daylight hours.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-800/40 text-amber-200 space-y-1">
                      <div className="font-bold flex items-center space-x-2 text-amber-300">
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                        <span>IAF Mi-17 Air-Bridge from Chanderkote Army Transit LZ</span>
                      </div>
                      <p className="text-[11px] text-slate-300">
                        Air-dropping 8 sorties daily of dry rations, baby food, and emergency satellite transceivers to Pogal-Paristan and Gool-Gulabgarh valleys.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-800/40 text-cyan-200 space-y-1">
                      <div className="font-bold flex items-center space-x-2 text-cyan-300">
                        <Truck className="w-4 h-4 text-cyan-400" />
                        <span>Bailey Bridge Construction — Chooralmala Chokepoint</span>
                      </div>
                      <p className="text-[11px] text-slate-300">
                        Madras Engineering Group (MEG) staging 110-foot Bailey bridge parts. 24-hour construction timeline will restore vehicular relief convoy access to Mundakkai.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-800/40 text-amber-200 space-y-1">
                      <div className="font-bold flex items-center space-x-2 text-amber-300">
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                        <span>Chooralmala Football Ground LZ Operation</span>
                      </div>
                      <p className="text-[11px] text-slate-300">
                        Temporary helicopter landing zone (LZ) established for Indian Air Force ALH Dhruv & Mi-17 medevac sorties. 42 critically injured residents airlifted to Kozhikode Medical College.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
