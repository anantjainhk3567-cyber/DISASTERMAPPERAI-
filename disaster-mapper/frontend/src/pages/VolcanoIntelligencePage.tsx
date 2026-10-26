import React, { useState } from 'react';
import { useDisasterStore } from '../store/useDisasterStore';
import { MapLibreMap } from '../components/map/MapLibreMap';
import { VOLCANO_BARREN_GEOJSON } from '../data/multiDisasterGeoJson';
import {
  Flame,
  AlertTriangle,
  Wind,
  Compass,
  Ship,
  Plane,
  ShieldAlert,
  Activity,
  Layers,
  CheckCircle2,
  AlertOctagon,
  Eye,
  Info
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

export const VolcanoIntelligencePage: React.FC = () => {
  const { selectedDisaster } = useDisasterStore();

  const [activeTab, setActiveTab] = useState<'PLUME_DYNAMICS' | 'EXCLUSION_ZONES' | 'MARITIME_AIR'>('PLUME_DYNAMICS');

  // Exclusion Zones
  const exclusionZones = [
    { zone: '5km Pyroclastic Core', threat: 'Pyroclastic density currents (PDC), ballistics, lava flow', status: 'MANDATORY_EXCLUSION', radius: 5, areaKm2: 78.5, color: '#DC2626' },
    { zone: '10km Heavy Tephra Ring', threat: 'Heavy scoria fall, volcanic gases (SO₂ > 8000 t/d)', status: 'RESTRICTED_ACCESS', radius: 10, areaKm2: 314, color: '#EA580C' },
    { zone: '25km Ashfall Dispersion', threat: 'Fine airborne ash, PM2.5/PM10 spikes, reduced visibility', status: 'ADVISORY_EVACUATION', radius: 25, areaKm2: 1960, color: '#475569' },
  ];

  // Gas Emissions and Plume Data
  const plumeData = [
    { time: '00:00', plumeHeightM: 6200, so2TonsPerDay: 5800, ashDensityGpm3: 1.8 },
    { time: '04:00', plumeHeightM: 7400, so2TonsPerDay: 7200, ashDensityGpm3: 2.4 },
    { time: '08:00', plumeHeightM: 8500, so2TonsPerDay: 9400, ashDensityGpm3: 3.6 },
    { time: '12:00', plumeHeightM: 8200, so2TonsPerDay: 8900, ashDensityGpm3: 3.1 },
    { time: '16:00', plumeHeightM: 7800, so2TonsPerDay: 8100, ashDensityGpm3: 2.7 },
    { time: '20:00', plumeHeightM: 8500, so2TonsPerDay: 9600, ashDensityGpm3: 3.8 },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#200F14] via-[#140F1E] to-[#0B1120] p-6 rounded-2xl border border-red-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-full bg-red-500/5 blur-3xl pointer-events-none"></div>
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center shrink-0 shadow-lg shadow-red-500/20">
            <Flame className="w-6 h-6 text-red-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-xl md:text-2xl font-black text-white tracking-wide">
                Volcano Intelligence Command
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-red-500/20 text-red-300 border border-red-500/40">
                VAL LEVEL 4: ERUPTION
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                DEMONSTRATION DATA
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Barren Island Volcanic Observatory telemetry, HYSPLIT atmospheric ash dispersion modeling, and maritime/aviation exclusion monitoring.
            </p>
          </div>
        </div>

        {/* Quick Eruption Telemetry */}
        <div className="flex items-center space-x-6 shrink-0 bg-[#070B14]/70 p-3 rounded-xl border border-slate-800">
          <div>
            <div className="text-[10px] text-slate-400 font-mono">Volcanic Index</div>
            <div className="text-sm font-black text-amber-400">VEI 4</div>
          </div>
          <div className="border-l border-slate-800 pl-4">
            <div className="text-[10px] text-slate-400 font-mono">Plume Top MSL</div>
            <div className="text-sm font-black text-cyan-300">8,500 m</div>
          </div>
          <div className="border-l border-slate-800 pl-4">
            <div className="text-[10px] text-slate-400 font-mono">Aviation Code</div>
            <div className="text-sm font-black text-red-400">VONA RED</div>
          </div>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="tactical-card p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold">5km PDC Kill Zone</span>
            <AlertOctagon className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-black text-red-400">78.5 <span className="text-xs text-slate-400 font-normal">km²</span></div>
          <div className="text-[11px] text-red-300 mt-1 font-mono">Zero civilian entry permitted</div>
        </div>

        <div className="tactical-card p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold">SO₂ Gas Output</span>
            <Wind className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">9,600 <span className="text-xs text-slate-400 font-normal">t/day</span></div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono">Acid rain risk high downwind</div>
        </div>

        <div className="tactical-card p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold">Maritime Exclusion</span>
            <Ship className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-400">15 <span className="text-xs text-slate-400 font-normal">NM radius</span></div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono">Coast Guard picket active</div>
        </div>

        <div className="tactical-card p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold">Lava Advance Rate</span>
            <Flame className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-2xl font-black text-orange-400">18.5 <span className="text-xs text-slate-400 font-normal">m/hour</span></div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono">Active flow into western ocean</div>
        </div>
      </div>

      {/* Main Grid: 3D Map + Intelligence Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive 3D Volcano Map */}
        <div className="lg:col-span-7 bg-[#0B1120] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[620px]">
          <div className="p-4 border-b border-slate-800/80 bg-[#0F172A]/80 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
              <span className="font-bold text-white text-xs">Caldera Vent, Lava Channels & Plume Vector</span>
            </div>
            <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
              <span>Center: 12.278°N, 93.858°E</span>
            </div>
          </div>
          <div className="flex-1 relative">
            <MapLibreMap
              center={[93.8580, 12.2780]}
              zoom={11.0}
              pitch={54}
              bearing={-22}
              geoJsonData={VOLCANO_BARREN_GEOJSON}
              showLayerControls={true}
            />
          </div>
        </div>

        {/* Right Column: Tabbed Intelligence Deck */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          <div className="grid grid-cols-3 gap-1 bg-[#0F172A] p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('PLUME_DYNAMICS')}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'PLUME_DYNAMICS'
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Plume Dynamics
            </button>
            <button
              onClick={() => setActiveTab('EXCLUSION_ZONES')}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'EXCLUSION_ZONES'
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Exclusion Zones
            </button>
            <button
              onClick={() => setActiveTab('MARITIME_AIR')}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'MARITIME_AIR'
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Air & Maritime
            </button>
          </div>

          {/* Tab 1: Plume Dynamics */}
          {activeTab === 'PLUME_DYNAMICS' && (
            <div className="tactical-card p-5 rounded-2xl border border-slate-800 space-y-4 flex-1">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-white text-xs">Eruptive Plume Height & Gas Flux Telemetry</span>
                <span className="text-[10px] text-cyan-400 font-mono font-bold">HYSPLIT DISPERSAL</span>
              </div>

              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={plumeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                    <XAxis dataKey="time" stroke="#64748B" fontSize={10} />
                    <YAxis stroke="#64748B" fontSize={10} />
                    <Tooltip contentStyle={{ background: '#0F172A', borderColor: '#334155', borderRadius: 8, fontSize: 11 }} />
                    <Area type="monotone" dataKey="plumeHeightM" stroke="#F43F5E" fill="#E11D48" fillOpacity={0.25} name="Plume Height (m)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-2 pt-2">
                <div className="p-3 rounded-xl bg-[#070B14]/80 border border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Plume Vector Trajectory:</span>
                  <span className="font-mono font-bold text-cyan-300">230° SW (Toward Malacca Corridor)</span>
                </div>
                <div className="p-3 rounded-xl bg-[#070B14]/80 border border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Peak Ground PM2.5 Spike:</span>
                  <span className="font-mono font-bold text-red-400">680 ug/m³ (Severe Hazard)</span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Exclusion Zones */}
          {activeTab === 'EXCLUSION_ZONES' && (
            <div className="tactical-card p-5 rounded-2xl border border-slate-800 space-y-4 flex-1">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-white text-xs">Volcanic Hazard Buffer Rings</span>
                <span className="text-[10px] text-red-400 font-mono font-bold">EXCLUSION RADIUS</span>
              </div>

              <div className="space-y-3">
                {exclusionZones.map((z) => (
                  <div key={z.zone} className="p-3.5 rounded-xl bg-[#070B14]/80 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-white flex items-center space-x-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: z.color }}></span>
                        <span>{z.zone}</span>
                      </span>
                      <span className="text-[10px] font-mono font-bold text-slate-400">{z.areaKm2} km²</span>
                    </div>
                    <p className="text-[11px] text-slate-300">{z.threat}</p>
                    <div className="text-[10px] font-bold text-amber-400 font-mono">STATUS: {z.status}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Air & Maritime */}
          {activeTab === 'MARITIME_AIR' && (
            <div className="tactical-card p-5 rounded-2xl border border-slate-800 space-y-4 flex-1">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-white text-xs">Aviation & Maritime Response Advisories</span>
                <span className="text-[10px] text-cyan-400 font-mono font-bold">VONA / NAVAREA</span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-xl bg-red-950/30 border border-red-800/40 text-red-200 space-y-1">
                  <div className="font-bold flex items-center space-x-2 text-red-300">
                    <Plane className="w-4 h-4 text-red-400" />
                    <span>Aviation Color Code RED — Ash Hazard FL280</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    International airways P646 and M770 rerouted 60 NM north to prevent turbine silica vitrification. Port Blair tower coordinating regional airspace rerouting.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-800/40 text-cyan-200 space-y-1">
                  <div className="font-bold flex items-center space-x-2 text-cyan-300">
                    <Ship className="w-4 h-4 text-cyan-400" />
                    <span>Coast Guard Maritime Exclusion Zone</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Indian Coast Guard OPV Varaha on patrol station 18 NM west. 4 fishing trawlers successfully evacuated outside the 15 NM exclusion perimeter.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
