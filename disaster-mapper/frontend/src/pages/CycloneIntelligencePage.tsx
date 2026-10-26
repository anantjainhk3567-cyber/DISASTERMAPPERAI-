import React, { useState } from 'react';
import { useDisasterStore } from '../store/useDisasterStore';
import { MapLibreMap } from '../components/map/MapLibreMap';
import { CYCLONE_AMPHAN_GEOJSON } from '../data/multiDisasterGeoJson';
import {
  Wind,
  Waves,
  AlertTriangle,
  Home,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  Compass,
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

export const CycloneIntelligencePage: React.FC = () => {
  const { selectedDisaster } = useDisasterStore();

  const [activeTab, setActiveTab] = useState<'STORM_TRACK' | 'SURGE_INUNDATION' | 'SHELTER_ALLOCATION'>('STORM_TRACK');

  // Track Forecast Points
  const trackForecast = [
    { hour: '00h (Now)', lat: 21.65, lng: 88.35, windKmh: 195, surgeM: 4.2, status: 'CAT-4' },
    { hour: '+06h', lat: 21.95, lng: 88.48, windKmh: 185, surgeM: 3.8, status: 'CAT-4' },
    { hour: '+12h (Landfall)', lat: 22.30, lng: 88.62, windKmh: 170, surgeM: 4.5, status: 'CAT-3' },
    { hour: '+18h', lat: 22.75, lng: 88.80, windKmh: 135, surgeM: 2.1, status: 'CAT-2' },
    { hour: '+24h', lat: 23.20, lng: 89.05, windKmh: 95, surgeM: 0.8, status: 'CYCLONIC_STORM' },
  ];

  // Shelter Occupancy & Evacuation Sectors
  const evacuationSectors = [
    { id: 'sec-cyc-01', name: 'Sagar Island South Delta', targetEvacuees: 38500, shelteredCount: 31200, sheltersAvailable: 12, status: 'CRITICAL_SHORTFALL', breachedEmbankment: 'Dhablat Bund (45m breach)' },
    { id: 'sec-cyc-02', name: 'Kakdwip Riverine Belt', targetEvacuees: 24000, shelteredCount: 22800, sheltersAvailable: 9, status: 'NEAR_CAPACITY', breachedEmbankment: 'Kalindi Embankment' },
    { id: 'sec-cyc-03', name: 'Gosaba / Sundarbans Core', targetEvacuees: 18500, shelteredCount: 15400, sheltersAvailable: 8, status: 'EVACUATION_IN_PROGRESS', breachedEmbankment: 'Rajnagar Saline Bund' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#0C1E36] via-[#0A182B] to-[#070B14] p-6 rounded-2xl border border-cyan-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-full bg-cyan-500/5 blur-3xl pointer-events-none"></div>
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center shrink-0 shadow-lg shadow-cyan-500/20">
            <Wind className="w-6 h-6 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
          </div>
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-xl md:text-2xl font-black text-white tracking-wide">
                Super Cyclone Storm Command
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                CATEGORY 4 • 195 KM/H
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                DEMONSTRATION DATA
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Doppler radar vortex tracking, SLOSH/ADCIRC compound storm surge inundation, and coastal evacuation shelter matching.
            </p>
          </div>
        </div>

        {/* Quick Storm Telemetry */}
        <div className="flex items-center space-x-6 shrink-0 bg-[#070B14]/70 p-3 rounded-xl border border-slate-800">
          <div>
            <div className="text-[10px] text-slate-400 font-mono">Central Pressure</div>
            <div className="text-sm font-black text-amber-400">938 hPa</div>
          </div>
          <div className="border-l border-slate-800 pl-4">
            <div className="text-[10px] text-slate-400 font-mono">Peak Gusts</div>
            <div className="text-sm font-black text-red-400">225 km/h</div>
          </div>
          <div className="border-l border-slate-800 pl-4">
            <div className="text-[10px] text-slate-400 font-mono">Peak Storm Surge</div>
            <div className="text-sm font-black text-cyan-400">4.5 m</div>
          </div>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="tactical-card p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold">Hurricane Core Footprint</span>
            <Wind className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-400">3,820 <span className="text-xs text-slate-400 font-normal">km²</span></div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono">1.42M population exposed</div>
        </div>

        <div className="tactical-card p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold">Surge Inundation Area</span>
            <Waves className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-blue-400">48.6 <span className="text-xs text-slate-400 font-normal">km²</span></div>
          <div className="text-[11px] text-blue-300 mt-1 font-mono">14 coastal bund breaches</div>
        </div>

        <div className="tactical-card p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold">People Sheltered</span>
            <Home className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">69,400 <span className="text-xs text-slate-400 font-normal">evacuated</span></div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono">85% of high-risk coastal belt</div>
        </div>

        <div className="tactical-card p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold">Remaining Evacuation Deficit</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">11,700 <span className="text-xs text-slate-400 font-normal">in danger</span></div>
          <div className="text-[11px] text-amber-300 mt-1 font-mono">Sagar South lowlands critical</div>
        </div>
      </div>

      {/* Main Grid: 3D Map + Intelligence Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive 3D Cyclone Map */}
        <div className="lg:col-span-7 bg-[#0B1120] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[620px]">
          <div className="p-4 border-b border-slate-800/80 bg-[#0F172A]/80 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
              <span className="font-bold text-white text-xs">Vortex Track, Wind Radii & Storm Surge Inundation</span>
            </div>
            <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
              <span>Center: 21.650°N, 88.350°E</span>
            </div>
          </div>
          <div className="flex-1 relative">
            <MapLibreMap
              center={[88.3500, 21.6500]}
              zoom={10.2}
              pitch={52}
              bearing={-14}
              geoJsonData={CYCLONE_AMPHAN_GEOJSON}
              showLayerControls={true}
            />
          </div>
        </div>

        {/* Right Column: Tabbed Intelligence Deck */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          <div className="grid grid-cols-3 gap-1 bg-[#0F172A] p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('STORM_TRACK')}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'STORM_TRACK'
                  ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Track Cone
            </button>
            <button
              onClick={() => setActiveTab('SURGE_INUNDATION')}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'SURGE_INUNDATION'
                  ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Surge & Bunds
            </button>
            <button
              onClick={() => setActiveTab('SHELTER_ALLOCATION')}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'SHELTER_ALLOCATION'
                  ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Shelter Needs
            </button>
          </div>

          {/* Tab 1: Track Forecast Cone */}
          {activeTab === 'STORM_TRACK' && (
            <div className="tactical-card p-5 rounded-2xl border border-slate-800 space-y-4 flex-1">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-white text-xs">Vortex Track Forecast Cone & Landfall ETA</span>
                <span className="text-[10px] text-cyan-400 font-mono font-bold">JTWC / IMD ENSEMBLE</span>
              </div>

              <div className="space-y-3">
                {trackForecast.map((t) => (
                  <div key={t.hour} className="p-3 rounded-xl bg-[#070B14]/80 border border-slate-800/80 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-xs text-white">{t.hour}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{t.lat}°N, {t.lng}°E • {t.status}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-xs text-cyan-300">{t.windKmh} km/h</div>
                      <div className="text-[10px] text-blue-400 font-mono">Surge: {t.surgeM}m</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 2: Surge Inundation */}
          {activeTab === 'SURGE_INUNDATION' && (
            <div className="tactical-card p-5 rounded-2xl border border-slate-800 space-y-4 flex-1">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-white text-xs">Coastal Embankment Breaches & Saline Inundation</span>
                <span className="text-[10px] text-red-400 font-mono font-bold">ADCIRC SURGE</span>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-red-950/30 border border-red-800/40 text-red-200 space-y-1">
                  <div className="font-bold flex items-center space-x-2 text-red-300 text-xs">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <span>Dhablat Bund Embankment Breach (45m)</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Seawater breaching through mud embankments during peak high tide. 1,200 thatched residences under 1.5m to 2.8m saline water.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#070B14]/80 border border-slate-800 space-y-1 text-xs">
                  <div className="font-bold text-white">Power Transmission Grid Status</div>
                  <p className="text-[11px] text-slate-300">
                    Sagar 33kV Substation preemptively powered down to prevent transformer explosions. Backup diesel generator powering cyclone shelters.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Shelter Allocation */}
          {activeTab === 'SHELTER_ALLOCATION' && (
            <div className="tactical-card p-5 rounded-2xl border border-slate-800 space-y-4 flex-1">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-white text-xs">Coastal Evacuation Sectors & Capacity</span>
                <span className="text-[10px] text-emerald-400 font-mono font-bold">SHELTER NETWORK</span>
              </div>

              <div className="space-y-3">
                {evacuationSectors.map((s) => (
                  <div key={s.id} className="p-3.5 rounded-xl bg-[#070B14]/80 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-white">{s.name}</span>
                      <span className="text-[10px] font-bold text-amber-400 font-mono">{s.status}</span>
                    </div>

                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden flex">
                      <div className="bg-emerald-500 h-full" style={{ width: `${(s.shelteredCount / s.targetEvacuees) * 100}%` }}></div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span>Sheltered: <strong className="text-emerald-400">{s.shelteredCount.toLocaleString()}</strong></span>
                      <span>Target: <strong className="text-white">{s.targetEvacuees.toLocaleString()}</strong></span>
                    </div>
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
