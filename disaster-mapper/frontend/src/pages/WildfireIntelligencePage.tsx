import React, { useState } from 'react';
import { useDisasterStore } from '../store/useDisasterStore';
import { MapLibreMap } from '../components/map/MapLibreMap';
import { WILDFIRE_SIMILIPAL_GEOJSON } from '../data/multiDisasterGeoJson';
import {
  Flame,
  AlertTriangle,
  Wind,
  ShieldAlert,
  Truck,
  Trees,
  CheckCircle2,
  Compass,
  Layers,
  Thermometer,
  CloudFog,
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

export const WildfireIntelligencePage: React.FC = () => {
  const { selectedDisaster } = useDisasterStore();

  const [activeTab, setActiveTab] = useState<'FIRE_SPREAD' | 'CONTAINMENT_LINES' | 'ASSET_DEPLOYMENT'>('FIRE_SPREAD');

  // Hourly Rate of Spread & FRP Telemetry
  const fireTimeline = [
    { hour: '00:00', frpMw: 280, rosKmh: 0.8, burnedKm2: 34.2, humidityPercent: 32 },
    { hour: '04:00', frpMw: 240, rosKmh: 0.6, burnedKm2: 37.1, humidityPercent: 38 },
    { hour: '08:00', frpMw: 360, rosKmh: 1.1, burnedKm2: 41.5, humidityPercent: 24 },
    { hour: '12:00', frpMw: 440, rosKmh: 1.4, burnedKm2: 46.2, humidityPercent: 18 },
    { hour: '16:00', frpMw: 420, rosKmh: 1.3, burnedKm2: 48.5, humidityPercent: 19 },
    { hour: '20:00', frpMw: 350, rosKmh: 0.9, burnedKm2: 50.1, humidityPercent: 26 },
  ];

  // Firefighting Assets Deployed
  const firefightingAssets = [
    { asset: 'IAF Bambi Bucket Helicopters', count: 3, role: 'Aerial water drops on inaccessible ridge flanks', status: 'ACTIVE_SORTIES' },
    { asset: 'Bulldozer Trench Cutters', count: 6, role: 'Clearing 40m wide mineral soil firebreaks', status: 'OPERATIONAL' },
    { asset: 'Forest Department Ground Strike Crews', count: 18, role: 'Backburn control & high-pressure mist spraying', status: 'DEPLOYED' },
    { asset: 'Water Tanker Convoys (10,000L)', count: 14, role: 'Replenishing ground crew pumps at forest roads', status: 'COMMITTED' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#2B140B] via-[#1C0E07] to-[#0B1120] p-6 rounded-2xl border border-orange-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-full bg-orange-500/5 blur-3xl pointer-events-none"></div>
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center shrink-0 shadow-lg shadow-orange-500/20">
            <Flame className="w-6 h-6 text-orange-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-xl md:text-2xl font-black text-white tracking-wide">
                Wildfire Perimeter & Spread Intelligence
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-orange-500/20 text-orange-300 border border-orange-500/40">
                ACTIVE FLAMING FRONT
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                DEMONSTRATION DATA
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              MODIS/VIIRS thermal hotspot telemetry, BehavePlus rate of spread (ROS) fire behavior, and firebreak containment optimization.
            </p>
          </div>
        </div>

        {/* Quick Wildfire Telemetry */}
        <div className="flex items-center space-x-6 shrink-0 bg-[#070B14]/70 p-3 rounded-xl border border-slate-800">
          <div>
            <div className="text-[10px] text-slate-400 font-mono">Perimeter Containment</div>
            <div className="text-sm font-black text-amber-400">28%</div>
          </div>
          <div className="border-l border-slate-800 pl-4">
            <div className="text-[10px] text-slate-400 font-mono">Fire Radiative Power</div>
            <div className="text-sm font-black text-red-400">440 MW</div>
          </div>
          <div className="border-l border-slate-800 pl-4">
            <div className="text-[10px] text-slate-400 font-mono">Rate of Spread (ROS)</div>
            <div className="text-sm font-black text-orange-400">1.4 km/h</div>
          </div>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="tactical-card p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold">Active Burn Area</span>
            <Flame className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-2xl font-black text-orange-400">48.5 <span className="text-xs text-slate-400 font-normal">km²</span></div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono">Dry deciduous canopy & ground fuel</div>
        </div>

        <div className="tactical-card p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold">Wind Vector & Humidity</span>
            <Wind className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-400">28 <span className="text-xs text-slate-400 font-normal">km/h NW</span></div>
          <div className="text-[11px] text-amber-300 mt-1 font-mono">18% relative humidity (extreme)</div>
        </div>

        <div className="tactical-card p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold">Cleared Firebreak Line</span>
            <Trees className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">14.2 <span className="text-xs text-slate-400 font-normal">km</span></div>
          <div className="text-[11px] text-emerald-300 mt-1 font-mono">Southern ridge holding perimeter</div>
        </div>

        <div className="tactical-card p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold">Threatened Settlements</span>
            <ShieldAlert className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-black text-red-400">3 <span className="text-xs text-slate-400 font-normal">hamlets</span></div>
          <div className="text-[11px] text-red-300 mt-1 font-mono">Gurguria sector mandatory evac</div>
        </div>
      </div>

      {/* Main Grid: 3D Map + Intelligence Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive 3D Wildfire Map */}
        <div className="lg:col-span-7 bg-[#0B1120] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[620px]">
          <div className="p-4 border-b border-slate-800/80 bg-[#0F172A]/80 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-ping"></span>
              <span className="font-bold text-white text-xs">Active Flaming Perimeter, Smoke Plume & Firebreaks</span>
            </div>
            <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
              <span>Center: 21.840°N, 86.340°E</span>
            </div>
          </div>
          <div className="flex-1 relative">
            <MapLibreMap
              center={[86.3400, 21.8400]}
              zoom={11.0}
              pitch={52}
              bearing={-16}
              geoJsonData={WILDFIRE_SIMILIPAL_GEOJSON}
              showLayerControls={true}
            />
          </div>
        </div>

        {/* Right Column: Tabbed Intelligence Deck */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          <div className="grid grid-cols-3 gap-1 bg-[#0F172A] p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('FIRE_SPREAD')}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'FIRE_SPREAD'
                  ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Spread Dynamics
            </button>
            <button
              onClick={() => setActiveTab('CONTAINMENT_LINES')}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'CONTAINMENT_LINES'
                  ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Firebreaks
            </button>
            <button
              onClick={() => setActiveTab('ASSET_DEPLOYMENT')}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'ASSET_DEPLOYMENT'
                  ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Assets Deployed
            </button>
          </div>

          {/* Tab 1: Rate of Spread Chart */}
          {activeTab === 'FIRE_SPREAD' && (
            <div className="tactical-card p-5 rounded-2xl border border-slate-800 space-y-4 flex-1">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-white text-xs">Fire Radiative Power (FRP) & Burn Progression</span>
                <span className="text-[10px] text-orange-400 font-mono font-bold">BEHAVEPLUS MODEL</span>
              </div>

              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={fireTimeline}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                    <XAxis dataKey="hour" stroke="#64748B" fontSize={10} />
                    <YAxis stroke="#64748B" fontSize={10} />
                    <Tooltip contentStyle={{ background: '#0F172A', borderColor: '#334155', borderRadius: 8, fontSize: 11 }} />
                    <Area type="monotone" dataKey="frpMw" stroke="#F97316" fill="#EA580C" fillOpacity={0.25} name="FRP (MW)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-2 pt-2 text-xs text-slate-300">
                <div className="p-3 rounded-xl bg-[#070B14]/80 border border-slate-800 flex items-center justify-between">
                  <span>Downwind Smoke Plume PM2.5 Spike:</span>
                  <span className="font-mono font-bold text-red-400">580 ug/m³</span>
                </div>
                <div className="p-3 rounded-xl bg-[#070B14]/80 border border-slate-800 flex items-center justify-between">
                  <span>Uncontained Active Flaming Flank:</span>
                  <span className="font-mono font-bold text-amber-400">Northern Ridge (11.8 km)</span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Containment Firebreaks */}
          {activeTab === 'CONTAINMENT_LINES' && (
            <div className="tactical-card p-5 rounded-2xl border border-slate-800 space-y-4 flex-1">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-white text-xs">Containment Firebreak Line Telemetry</span>
                <span className="text-[10px] text-emerald-400 font-mono font-bold">14.2 KM CLEARED</span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-emerald-200 space-y-1">
                  <div className="font-bold flex items-center space-x-2 text-emerald-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Southern Ridge Mineral Firebreak (Holding)</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    40-meter wide fuel-free corridor bulldozed down to mineral earth. Successful controlled backfire prevented leap across Baripada highway.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-red-950/30 border border-red-800/40 text-red-200 space-y-1">
                  <div className="font-bold flex items-center space-x-2 text-red-300">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <span>Northern Flank Uncontained Ridge</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Steep 45° slopes prevent heavy machinery access. Hand-crews deploying portable foam generators; aerial water drop priority sector.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Asset Deployment */}
          {activeTab === 'ASSET_DEPLOYMENT' && (
            <div className="tactical-card p-5 rounded-2xl border border-slate-800 space-y-4 flex-1">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-white text-xs">Committed Tactical Firefighting Assets</span>
                <span className="text-[10px] text-orange-400 font-mono font-bold">INCIDENT COMMAND</span>
              </div>

              <div className="space-y-3">
                {firefightingAssets.map((a) => (
                  <div key={a.asset} className="p-3 rounded-xl bg-[#070B14]/80 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white">{a.asset}</span>
                      <span className="font-mono font-black text-orange-400">{a.count} units</span>
                    </div>
                    <p className="text-[11px] text-slate-400">{a.role}</p>
                    <div className="text-[10px] font-bold text-cyan-300 font-mono">STATUS: {a.status}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
