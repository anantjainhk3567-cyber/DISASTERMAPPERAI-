import React, { useState } from 'react';
import { useDisasterStore } from '../store/useDisasterStore';
import { MapLibreMap } from '../components/map/MapLibreMap';
import { EARTHQUAKE_BHUJ_GEOJSON } from '../data/multiDisasterGeoJson';
import {
  Activity,
  AlertTriangle,
  Building2,
  HeartPulse,
  Truck,
  ShieldAlert,
  Flame,
  ArrowRight,
  TrendingDown,
  Clock,
  Compass,
  Layers,
  CheckCircle2,
  Boxes,
  Zap,
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

export const EarthquakeIntelligencePage: React.FC = () => {
  const { selectedDisaster } = useDisasterStore();

  const [activeTab, setActiveTab] = useState<'SEISMIC_OVERVIEW' | 'STRUCTURAL_IMPACT' | 'RESCUE_PRIORITY'>('SEISMIC_OVERVIEW');
  const [hypotheticalMw, setHypotheticalMw] = useState<number>(7.2);
  const [focalDepthKm, setFocalDepthKm] = useState<number>(16);

  // MMI Shake Intensity Zones
  const shakeZones = [
    { mmi: 'IX', name: 'Ruinous (Bhachau-Bhuj Core)', radiusKm: 18, areaKm2: 680, pop: 245000, color: '#7C3AED', pga: '0.44g' },
    { mmi: 'VIII', name: 'Destructive Shaking Ring', radiusKm: 38, areaKm2: 2150, pop: 580000, color: '#DC2626', pga: '0.28g' },
    { mmi: 'VII', name: 'Very Strong Shaking Belt', radiusKm: 75, areaKm2: 6400, pop: 890000, color: '#EA580C', pga: '0.16g' },
    { mmi: 'VI', name: 'Strong Perceptible Margin', radiusKm: 140, areaKm2: 14800, pop: 1850000, color: '#F59E0B', pga: '0.08g' },
  ];

  // Structural Damage Matrix by Building Typology
  const buildingDamageMatrix = [
    { typology: 'Unreinforced Masonry (URM)', totalUnits: 14200, collapsed: 340, severe: 1220, moderate: 2800 },
    { typology: 'Non-Ductile Concrete Frame', totalUnits: 8600, collapsed: 95, severe: 440, moderate: 1100 },
    { typology: 'Engineered Reinforced Concrete', totalUnits: 4200, collapsed: 8, severe: 65, moderate: 310 },
    { typology: 'Lightweight Steel & Timber', totalUnits: 3100, collapsed: 2, severe: 24, moderate: 180 },
  ];

  // Urgent Rescue & Infrastructure Priorities
  const prioritySectors = [
    {
      id: 'sec-eq-01',
      name: 'Sector 1 — Bhuj Old Walled City Dense Quarter',
      priority: 'RED',
      priorityScore: 96,
      trappedCasualties: 320,
      exposedPop: 18400,
      accessStatus: 'PARTIALLY_BLOCKED',
      criticalFacility: 'GK Memorial Hospital ER Yard',
      urgencyReason: 'Narrow medieval alleyways choked with masonry rubble; multi-story pancaked residences with confirmed acoustic void signatures.',
      resourcesNeeded: '4 USAR Heavy Extraction Teams, 6 Canine Units, 2 Mobile Triage Surgical Trailers'
    },
    {
      id: 'sec-eq-02',
      name: 'Sector 2 — Bhachau Junction Market Complex',
      priority: 'RED',
      priorityScore: 92,
      trappedCasualties: 190,
      exposedPop: 14200,
      accessStatus: 'BLOCKED',
      criticalFacility: 'Bhachau Sub-Station (Blackout)',
      urgencyReason: 'Commercial multi-tier buildings suffered soft-story shear collapse across state highway crossing.',
      resourcesNeeded: '2 Heavy Hydraulic Shears, 4 Canine Teams, 1 Emergency Mobile Generator Unit'
    },
    {
      id: 'sec-eq-03',
      name: 'Sector 3 — Anjar GIDC Industrial Colony',
      priority: 'ORANGE',
      priorityScore: 78,
      trappedCasualties: 65,
      exposedPop: 9800,
      accessStatus: 'RESTRICTED',
      criticalFacility: 'Anjar Water Filtration Tank',
      urgencyReason: 'Cracked reservoir walls threatening localized flooding; worker dormitory partially collapsed.',
      resourcesNeeded: '2 Shoring Crews, 1 Structural Engineering Survey Team'
    }
  ];

  // Aftershock Decay Curve (Omori's Law Projection)
  const aftershockData = [
    { day: 'Day 1', probabilityM5Plus: 92, expectedEvents: 24, recordedCount: 22 },
    { day: 'Day 2', probabilityM5Plus: 78, expectedEvents: 14, recordedCount: 12 },
    { day: 'Day 3', probabilityM5Plus: 62, expectedEvents: 9, recordedCount: 8 },
    { day: 'Day 4', probabilityM5Plus: 48, expectedEvents: 6, recordedCount: 5 },
    { day: 'Day 5', probabilityM5Plus: 38, expectedEvents: 4, recordedCount: 3 },
    { day: 'Day 6', probabilityM5Plus: 28, expectedEvents: 3, recordedCount: 2 },
    { day: 'Day 7', probabilityM5Plus: 22, expectedEvents: 2, recordedCount: 1 },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#14142B] via-[#0D1424] to-[#0B1120] p-6 rounded-2xl border border-purple-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-full bg-purple-500/5 blur-3xl pointer-events-none"></div>
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center shrink-0 shadow-lg shadow-purple-500/20">
            <Activity className="w-6 h-6 text-purple-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-xl md:text-2xl font-black text-white tracking-wide">
                Earthquake Seismic Intelligence
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-purple-500/20 text-purple-300 border border-purple-500/40">
                Mw 7.2 MAINSHOCK
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                DEMONSTRATION DATA
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Real-time USGS ShakeMap interpolation, HAZUS-based structural damage matrix, and urban search-and-rescue (USAR) priority engine.
            </p>
          </div>
        </div>

        {/* Quick Epicenter Metrics */}
        <div className="flex items-center space-x-6 shrink-0 bg-[#070B14]/70 p-3 rounded-xl border border-slate-800">
          <div>
            <div className="text-[10px] text-slate-400 font-mono">Focal Depth</div>
            <div className="text-sm font-black text-white">16.4 km</div>
          </div>
          <div className="border-l border-slate-800 pl-4">
            <div className="text-[10px] text-slate-400 font-mono">Peak Accel (PGA)</div>
            <div className="text-sm font-black text-amber-400">0.44g</div>
          </div>
          <div className="border-l border-slate-800 pl-4">
            <div className="text-[10px] text-slate-400 font-mono">Mechanism</div>
            <div className="text-sm font-black text-cyan-400">Thrust Rupture</div>
          </div>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="tactical-card p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold">MMI IX Ruinous Footprint</span>
            <Activity className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white">680 <span className="text-xs text-slate-400 font-normal">km²</span></div>
          <div className="text-[11px] text-purple-400 mt-1 font-mono">245,000 residents in violent zone</div>
        </div>

        <div className="tactical-card p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold">Collapsed Buildings</span>
            <Building2 className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-black text-red-400">445 <span className="text-xs text-slate-400 font-normal">structures</span></div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono">1,749 with severe structural failure</div>
        </div>

        <div className="tactical-card p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold">Estimated Trapped Casualties</span>
            <ShieldAlert className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">575 <span className="text-xs text-slate-400 font-normal">people</span></div>
          <div className="text-[11px] text-amber-300 mt-1 font-mono">Critical 72-hour golden window</div>
        </div>

        <div className="tactical-card p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold">Severed Transport Corridors</span>
            <Truck className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-400">8 <span className="text-xs text-slate-400 font-normal">bridges / passes</span></div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono">Surajbari Viaduct impassable</div>
        </div>
      </div>

      {/* Main Grid: 3D Map + Intelligence Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive 3D Seismic Map */}
        <div className="lg:col-span-7 bg-[#0B1120] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[620px]">
          <div className="p-4 border-b border-slate-800/80 bg-[#0F172A]/80 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-ping"></span>
              <span className="font-bold text-white text-xs">Seismic ShakeMap & Infrastructure Risk</span>
            </div>
            <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
              <span>Center: 23.332°N, 70.125°E</span>
            </div>
          </div>
          <div className="flex-1 relative">
            <MapLibreMap
              center={[70.1250, 23.3320]}
              zoom={10.2}
              pitch={52}
              bearing={-16}
              geoJsonData={EARTHQUAKE_BHUJ_GEOJSON}
              showLayerControls={true}
            />
          </div>
        </div>

        {/* Right Column: Tabbed Intelligence Deck */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          {/* Tab Navigation */}
          <div className="grid grid-cols-3 gap-1 bg-[#0F172A] p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('SEISMIC_OVERVIEW')}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'SEISMIC_OVERVIEW'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Shaking Zones
            </button>
            <button
              onClick={() => setActiveTab('STRUCTURAL_IMPACT')}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'STRUCTURAL_IMPACT'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Damage Matrix
            </button>
            <button
              onClick={() => setActiveTab('RESCUE_PRIORITY')}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'RESCUE_PRIORITY'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              USAR Priorities
            </button>
          </div>

          {/* Tab 1: Shaking Zones Breakdown */}
          {activeTab === 'SEISMIC_OVERVIEW' && (
            <div className="tactical-card p-5 rounded-2xl border border-slate-800 space-y-4 flex-1">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-white text-xs">Modified Mercalli Intensity (MMI) Contours</span>
                <span className="text-[10px] text-purple-400 font-mono font-bold">HAZUS-MH V4</span>
              </div>

              <div className="space-y-3">
                {shakeZones.map((z) => (
                  <div key={z.mmi} className="p-3 rounded-xl bg-[#070B14]/80 border border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs text-white"
                        style={{ backgroundColor: z.color }}
                      >
                        {z.mmi}
                      </div>
                      <div>
                        <div className="font-bold text-xs text-white">{z.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">PGA: {z.pga} • Radius: {z.radiusKm} km</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-xs text-cyan-300">{(z.pop).toLocaleString()}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{z.areaKm2} km²</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Aftershock Forecast Chart */}
              <div className="pt-2">
                <div className="text-xs font-bold text-white mb-2 flex items-center justify-between">
                  <span>Aftershock Probability (Omori Decay Model)</span>
                  <span className="text-[10px] text-slate-400 font-mono">M5.0+ Forecast</span>
                </div>
                <div className="h-36 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={aftershockData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                      <XAxis dataKey="day" stroke="#64748B" fontSize={10} />
                      <YAxis stroke="#64748B" fontSize={10} />
                      <Tooltip contentStyle={{ background: '#0F172A', borderColor: '#334155', borderRadius: 8, fontSize: 11 }} />
                      <Area type="monotone" dataKey="probabilityM5Plus" stroke="#A855F7" fill="#7C3AED" fillOpacity={0.25} name="M5.0+ Prob (%)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Structural Damage Matrix */}
          {activeTab === 'STRUCTURAL_IMPACT' && (
            <div className="tactical-card p-5 rounded-2xl border border-slate-800 space-y-4 flex-1">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-white text-xs">Building Fragility & Structural Failure Matrix</span>
                <span className="text-[10px] text-red-400 font-mono font-bold">COLLAPSE RISK</span>
              </div>

              <div className="space-y-3">
                {buildingDamageMatrix.map((b) => (
                  <div key={b.typology} className="p-3 rounded-xl bg-[#070B14]/80 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-white">
                      <span>{b.typology}</span>
                      <span className="text-[11px] font-mono text-slate-400">{(b.totalUnits).toLocaleString()} Total Units</span>
                    </div>

                    {/* Progress Bar of Damage Breakdown */}
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden flex">
                      <div className="bg-red-500 h-full" style={{ width: `${(b.collapsed / b.totalUnits) * 100}%` }} title={`Collapsed: ${b.collapsed}`}></div>
                      <div className="bg-amber-500 h-full" style={{ width: `${(b.severe / b.totalUnits) * 100}%` }} title={`Severe: ${b.severe}`}></div>
                      <div className="bg-yellow-500 h-full" style={{ width: `${(b.moderate / b.totalUnits) * 100}%` }} title={`Moderate: ${b.moderate}`}></div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span className="text-red-400 font-bold">{b.collapsed} Collapsed</span>
                      <span className="text-amber-400 font-bold">{b.severe} Severe</span>
                      <span className="text-yellow-400 font-bold">{b.moderate} Moderate</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Critical Hospital & Infrastructure Callout */}
              <div className="p-3 rounded-xl bg-red-950/30 border border-red-800/40 text-xs text-red-200 space-y-1">
                <div className="font-bold flex items-center space-x-1.5 text-red-300">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <span>GK Memorial Hospital Facility Alert</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Main hospital wing compromised by structural shear cracking. Surgical wards relocated to outdoor field triage tents. 4 mobile ICU field trauma trailers urgently required.
                </p>
              </div>
            </div>
          )}

          {/* Tab 3: USAR Priorities & Sector Response */}
          {activeTab === 'RESCUE_PRIORITY' && (
            <div className="tactical-card p-5 rounded-2xl border border-slate-800 space-y-4 flex-1">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-white text-xs">Urban Search-and-Rescue (USAR) Sectors</span>
                <span className="text-[10px] text-red-400 font-mono font-bold">TOP URGENCY</span>
              </div>

              <div className="space-y-3">
                {prioritySectors.map((s) => (
                  <div key={s.id} className="p-3.5 rounded-xl bg-[#070B14]/80 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-white">{s.name}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                        s.priority === 'RED' ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      }`}>
                        {s.priority} • {s.priorityScore}/100
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-400">
                      <div>Trapped Est: <strong className="text-red-400">{s.trappedCasualties}</strong></div>
                      <div>Access: <strong className="text-amber-300">{s.accessStatus}</strong></div>
                    </div>

                    <p className="text-[11px] text-slate-300">{s.urgencyReason}</p>

                    <div className="text-[11px] text-cyan-300 bg-cyan-950/40 p-2 rounded border border-cyan-800/40">
                      <strong>Deploy:</strong> {s.resourcesNeeded}
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
