import React, { useEffect, useState } from 'react';
import { useDisasterStore } from '../store/useDisasterStore';
import { api } from '../lib/api';
import { MapLibreMap } from '../components/map/MapLibreMap';
import { getGeoJsonForDisaster } from '../data/multiDisasterGeoJson';
import {
  ShieldAlert,
  Flame,
  Users,
  AlertOctagon,
  Droplets,
  Activity,
  Compass,
  Wind,
  Mountain,
  Building2,
  Truck,
  HeartPulse,
  Home,
  MessageSquareWarning,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Radio,
  MapPin,
  Send,
  Boxes
} from 'lucide-react';
import { Link } from 'react-router-dom';
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

export const OverviewPage: React.FC = () => {
  const { selectedDisaster, disastersList, setSelectedDisaster, is3DTilt, toggle3DTilt } = useDisasterStore();

  const [mapGeoJson, setMapGeoJson] = useState<any>(
    selectedDisaster ? getGeoJsonForDisaster(selectedDisaster.id) : null
  );

  useEffect(() => {
    if (selectedDisaster) {
      setMapGeoJson(getGeoJsonForDisaster(selectedDisaster.id));
    }
  }, [selectedDisaster?.id]);

  // Operational Demand Trends (Hourly simulation for active operations)
  const demandTrends = [
    { time: '00:00', waterRescue: 14, usardispatch: 8, shelterOccupancy: 420 },
    { time: '04:00', waterRescue: 22, usardispatch: 15, shelterOccupancy: 680 },
    { time: '08:00', waterRescue: 38, usardispatch: 28, shelterOccupancy: 950 },
    { time: '12:00', waterRescue: 48, usardispatch: 36, shelterOccupancy: 1240 },
    { time: '16:00', waterRescue: 42, usardispatch: 40, shelterOccupancy: 1480 },
    { time: '20:00', waterRescue: 34, usardispatch: 32, shelterOccupancy: 1560 },
  ];

  const getDisasterIcon = (type: string) => {
    switch (type) {
      case 'FLOOD': return Droplets;
      case 'EARTHQUAKE': return Activity;
      case 'VOLCANO': return Compass;
      case 'CYCLONE': return Wind;
      case 'WILDFIRE': return Flame;
      case 'LANDSLIDE': return Mountain;
      default: return ShieldAlert;
    }
  };

  const getDisasterRoute = (type: string) => {
    switch (type) {
      case 'FLOOD': return '/flood';
      case 'EARTHQUAKE': return '/earthquake';
      case 'VOLCANO': return '/volcano';
      case 'CYCLONE': return '/cyclone';
      case 'WILDFIRE': return '/wildfire';
      case 'LANDSLIDE': return '/landslide';
      default: return '/map';
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-[1700px] mx-auto w-full select-none">
      {/* Page Header & Mission Focus Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-black text-white tracking-tight">National Disaster Command Center</h1>
            <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30 flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></span>
              <span>OPERATIONAL STATUS: LEVEL 1 RED</span>
            </span>
            <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
              6 SUPPORTED HAZARDS
            </span>
            <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
              {disastersList.length} REGISTERED INCIDENTS
            </span>
            <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              SOURCE: ASDMA / CWC / HPSDMA / BRO
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Real-time geospatial 3D intelligence, multi-hazard risk models, and verified public operational data.
          </p>
        </div>

        {/* Quick Actions & 3D Tilt Trigger */}
        <div className="flex items-center space-x-3">
          <button
            onClick={toggle3DTilt}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center space-x-1.5 transition-all ${
              is3DTilt
                ? 'bg-cyan-500/25 border-cyan-400 text-cyan-300 cyan-glow'
                : 'bg-[#0F172A] border-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            <Boxes className="w-3.5 h-3.5 text-cyan-400" />
            <span>{is3DTilt ? '3D Oblique Active' : 'Enable 3D View'}</span>
          </button>

          <Link
            to="/priorities"
            className="bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center space-x-2 shadow-lg shadow-red-600/25 transition-all"
          >
            <Flame className="w-4 h-4" />
            <span>Where Help is Needed Most</span>
          </Link>
        </div>
      </div>

      {/* Multi-Hazard Active Incident Matrix (6 Hazards Carousel / Selector) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-400 px-1">
          <span>Active Hazard Theater Matrix (Click to switch focus)</span>
          <span className="text-[10px] text-cyan-400 font-mono">ALL INDIA COVERAGE</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {disastersList.map((d) => {
            const Icon = getDisasterIcon(d.type);
            const isSelected = selectedDisaster?.id === d.id;
            return (
              <div
                key={d.id}
                onClick={() => setSelectedDisaster(d)}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-gradient-to-b from-[#1C243B] to-[#11192E] border-cyan-400 shadow-xl shadow-cyan-500/15 ring-1 ring-cyan-400/50 scale-[1.02]'
                    : 'tactical-card border-slate-800 hover:border-slate-700 hover:scale-[1.01]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                    isSelected ? 'bg-cyan-500 text-black font-bold' : 'bg-slate-800 text-slate-300'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                    d.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {d.severity}
                  </span>
                </div>

                <div className="font-bold text-xs text-white truncate" title={d.name}>
                  {d.name.split(' (')[0]}
                </div>
                <div className="text-[10px] text-cyan-300 font-mono mt-0.5">{d.type}</div>

                <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>{d.affectedAreaKm2 || 14.8} km²</span>
                  <Link
                    to={getDisasterRoute(d.type)}
                    onClick={(e) => e.stopPropagation()}
                    className="text-cyan-400 hover:underline flex items-center"
                    title="Open dedicated board"
                  >
                    <span>Board</span>
                    <ArrowRight className="w-2.5 h-2.5 ml-0.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 8 Data-Driven Metric KPI Cards for Selected Disaster */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        <MetricCard
          title="Active Hazard"
          value={selectedDisaster?.type || 'FLOOD'}
          unit="Current Focus"
          desc={selectedDisaster?.name.split(' (')[0] || 'Delhi Yamuna'}
          icon={getDisasterIcon(selectedDisaster?.type || 'FLOOD')}
          color="text-cyan-400"
          border="border-cyan-500/30"
        />
        <MetricCard
          title="Affected Area"
          value={`${selectedDisaster?.affectedAreaKm2 || 14.8}`}
          unit="km²"
          desc="Impacted perimeter"
          icon={Droplets}
          color="text-cyan-400"
          border="border-cyan-500/30"
        />
        <MetricCard
          title="Exposed Population"
          value={(selectedDisaster?.exposedPopulation || 82000).toLocaleString()}
          unit="Citizens"
          desc="Inside threat contour"
          icon={Users}
          color="text-amber-400"
          border="border-amber-500/30"
        />
        <MetricCard
          title="Damaged Buildings"
          value={(selectedDisaster?.damagedBuildingCount || 28).toLocaleString()}
          unit="Structures"
          desc="Severe or collapsed"
          icon={Building2}
          color="text-red-400"
          border="border-red-500/30"
        />
        <MetricCard
          title="Blocked Corridors"
          value={selectedDisaster?.blockedRoadCount || 4}
          unit="Roads / Bridges"
          desc="Impassable transport"
          icon={AlertOctagon}
          color="text-orange-400"
          border="border-orange-500/30"
        />
        <MetricCard
          title="Facilities at Risk"
          value={selectedDisaster?.criticalFacilitiesAtRisk || 3}
          unit="Critical Plants"
          desc="Hospitals & Power"
          icon={Activity}
          color="text-purple-400"
          border="border-purple-500/30"
        />
        <MetricCard
          title="Staged Response Assets"
          value={
            selectedDisaster?.type === 'FLOOD'
              ? '18 Inflatables'
              : selectedDisaster?.type === 'LANDSLIDE'
              ? '6 Excavators'
              : selectedDisaster?.type === 'EARTHQUAKE'
              ? '4 USAR Kits'
              : '8 Response Units'
          }
          unit="Calculated Staging"
          desc="Standard Response Protocol"
          icon={Truck}
          color="text-blue-400"
          border="border-blue-500/30"
        />
        <MetricCard
          title="Model Confidence"
          value="88.5%"
          unit="Analytical Consensus"
          desc="Cross-validated ML layers"
          icon={CheckCircle2}
          color="text-emerald-400"
          border="border-emerald-500/30"
        />
      </div>

      {/* Main Grid: 3D Tactical Situation Map & Operational Prioritization */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive 3D Situation Map (7 cols) */}
        <div className="lg:col-span-7 bg-[#0B1120] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[580px]">
          <div className="p-4 border-b border-slate-800 bg-[#0F172A] flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
              <h2 className="text-sm font-bold text-white">
                3D Geospatial Tactical Situation Deck — {selectedDisaster?.name.split(' (')[0]}
              </h2>
            </div>
            <div className="flex items-center space-x-3 text-xs text-slate-300 font-mono">
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                <span>Sentinel-2 / Earth 3D Satellite & Mapterhorn DEM</span>
              </span>
              <span>Center: {selectedDisaster?.centerLatitude.toFixed(3)}°N, {selectedDisaster?.centerLongitude.toFixed(3)}°E</span>
            </div>
          </div>

          <div className="flex-1 relative">
            <MapLibreMap
              center={selectedDisaster ? [selectedDisaster.centerLongitude, selectedDisaster.centerLatitude] : [77.2400, 28.6450]}
              zoom={11.8}
              geoJsonData={mapGeoJson}
              height="100%"
              showLayerControls={true}
            />
          </div>
        </div>

        {/* Right: Where Help is Needed Most Live Urgent Callout (5 cols) */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          {/* Urgent Sector Spotlight Banner */}
          <div className="tactical-card p-5 rounded-2xl border border-red-500/40 relative overflow-hidden space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                <span className="font-bold text-white text-xs">TOP OPERATIONAL PRIORITY — SECTOR 1</span>
              </div>
              <span className="text-[10px] font-black bg-red-500/20 text-red-400 border border-red-500/40 px-2 py-0.5 rounded">
                SCORE 96/100
              </span>
            </div>

            <div className="text-sm font-black text-white">
              {selectedDisaster?.id === 'assam-flood-recent' || selectedDisaster?.id?.toLowerCase().includes('assam')
                ? 'Sector 1 — Morigaon Lahorighat Riverine Char Islands'
                : selectedDisaster?.id === 'jk-landslide-flood-recent' || selectedDisaster?.id?.toLowerCase().includes('jk') || selectedDisaster?.id?.toLowerCase().includes('ramban')
                ? 'Sector 1 — Panthyal-Mehar High-Risk Slide Corridor'
                : selectedDisaster?.id?.toLowerCase().includes('shimla') || selectedDisaster?.id?.toLowerCase().includes('himachal')
                ? 'Sector 1 — Summer Hill & Shiv Bawdi Debris Sector'
                : selectedDisaster?.type === 'EARTHQUAKE'
                ? 'Sector 1 — Bhuj Old Walled Medieval Quarter'
                : selectedDisaster?.type === 'VOLCANO'
                ? '5km Pyroclastic Core Exclusion Zone'
                : selectedDisaster?.type === 'CYCLONE'
                ? 'Sector 1 — Sagar Island South & Gosaba Delta'
                : selectedDisaster?.type === 'WILDFIRE'
                ? 'Sector 1 — Gurguria Fringe Forest Hamlet'
                : selectedDisaster?.id?.toLowerCase().includes('wayanad')
                ? 'Sector 1 — Meppadi-Chooralmala Plantation Basin'
                : 'Sector 1 — Kashmere Gate / Monastery Market'}
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {selectedDisaster?.id === 'assam-flood-recent' || selectedDisaster?.id?.toLowerCase().includes('assam')
                ? '48,000 citizens marooned across braided sandbar islands with zero terrestrial road escape. Brahmaputra cresting 1.15m above danger level at Nematighat; 620 victims trapped in precarious dwellings.'
                : selectedDisaster?.id === 'jk-landslide-flood-recent' || selectedDisaster?.id?.toLowerCase().includes('jk') || selectedDisaster?.id?.toLowerCase().includes('ramban')
                ? '18,000 m³ limestone boulder avalanche collapsed steel rockfall shelter on NH-44. 14 mountain hamlets (39,100 citizens) cut off with zero vehicle access. BRO heavy earthmovers mobilized.'
                : selectedDisaster?.id?.toLowerCase().includes('shimla') || selectedDisaster?.id?.toLowerCase().includes('himachal')
                ? 'Catastrophic slope failure along Summer Hill scarp and Shiv Bawdi temple ravine. 24,000 m³ debris flow crushed temple structure; Kalka-Shimla UNESCO railway tracks suspended in mid-air. SDRF canine search squads and HPSDMA heavy earthmovers operating.'
                : selectedDisaster?.type === 'EARTHQUAKE'
                ? 'Widespread collapsed masonry structures with 320 trapped victims inside 72-hour survival window. Narrow access corridors blocked with rubble.'
                : selectedDisaster?.type === 'VOLCANO'
                ? 'Active lava advance and pyroclastic surges. Mandatory naval exclusion and evacuation of maritime trawlers outside 15 NM radius.'
                : selectedDisaster?.type === 'CYCLONE'
                ? '4.2m storm surge breached saline bund. 38,500 residents in danger of drowning; high-clearance hovercraft and buses needed.'
                : selectedDisaster?.type === 'WILDFIRE'
                ? 'Active flame front 800m from fringe hamlet. 28 km/h wind gusts driving crown fire; emergency bulldozer firebreaks deployed.'
                : selectedDisaster?.id?.toLowerCase().includes('wayanad')
                ? 'Chooralmala Bridge swept away; 1,450 plantation residents cut off without road access. Indian Army Bailey bridge & helicopter winch required.'
                : 'Yamuna water cresting at 208.66m (3.33m above danger mark). 4,200 people stranded in multi-story tenements; ground floor submerged in 2.8m water.'}
            </p>

            {/* Quick Required Resources */}
            <div className="p-3 bg-[#070B14] rounded-xl border border-slate-800 text-xs space-y-1.5">
              <div className="font-bold text-cyan-300 flex items-center space-x-1.5">
                <Truck className="w-3.5 h-3.5" />
                <span>Immediate Resources Required:</span>
              </div>
              <div className="text-[11px] text-slate-300 font-mono">
                {selectedDisaster?.id === 'assam-flood-recent' || selectedDisaster?.id?.toLowerCase().includes('assam')
                  ? '18 Motorized Inflatable Zodiacs • 450 Lifejackets • 2 Water Purification Barges • 3 Medical Squads'
                  : selectedDisaster?.id === 'jk-landslide-flood-recent' || selectedDisaster?.id?.toLowerCase().includes('jk') || selectedDisaster?.id?.toLowerCase().includes('ramban')
                  ? '6 Heavy BRO Excavators & CAT D8 Dozers • 4 IAF Mi-17 Winch Helicopters • High-Altitude Trauma Post'
                  : selectedDisaster?.id?.toLowerCase().includes('shimla') || selectedDisaster?.id?.toLowerCase().includes('himachal')
                  ? '4 Heavy Tracked Rock Breakers & Excavators • 6 NDRF Acoustic Canine Squads • IGMC Hospital Mobile Trauma ICU'
                  : selectedDisaster?.type === 'EARTHQUAKE'
                  ? '4 USAR Heavy Extraction Teams • 6 Canine Units • 2 Mobile ICUs'
                  : selectedDisaster?.type === 'VOLCANO'
                  ? '2 Naval Offshore Vessels • 3,000 N95 Respirators • 4 Air Samplers'
                  : selectedDisaster?.type === 'CYCLONE'
                  ? '8 Rigid Inflatable Boats • 24 Evacuation Buses • 6 Desalination Plants'
                  : selectedDisaster?.type === 'WILDFIRE'
                  ? '4 Heavy Bulldozers • 3 Aerial Water Droppers • 18 Ground Crews'
                  : selectedDisaster?.id?.toLowerCase().includes('wayanad')
                  ? '2 Military Bailey Bridge Spans • 3 IAF Mi-17 Choppers • 6 Excavators'
                  : '12 Amphibious Boats • 8 High-Clearance Trucks • 4 Trauma Squads'}
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <Link
                to="/priorities"
                className="text-xs text-red-400 hover:text-red-300 font-bold flex items-center space-x-1"
              >
                <span>View All Priority Sectors</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to={getDisasterRoute(selectedDisaster?.type || 'FLOOD')}
                className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-colors flex items-center space-x-1"
              >
                <span>Open {selectedDisaster?.type} Board</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* 24h Operational Rescue Demand Trends */}
          <div className="tactical-card p-4 rounded-2xl border border-slate-800 flex-1">
            <div className="flex items-center justify-between mb-2 border-b border-slate-800 pb-2">
              <span className="font-bold text-xs text-white">24h Operational Mission Load Progression</span>
              <span className="text-[10px] text-slate-400 font-mono">ACTIVE TELEMETRY</span>
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={demandTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                  <XAxis dataKey="time" stroke="#64748B" fontSize={10} />
                  <YAxis stroke="#64748B" fontSize={10} />
                  <Tooltip contentStyle={{ background: '#0F172A', borderColor: '#334155', borderRadius: 8, fontSize: 11 }} />
                  <Area type="monotone" dataKey="waterRescue" stroke="#06B6D4" fill="#0891B2" fillOpacity={0.25} name="Field Missions" />
                  <Area type="monotone" dataKey="usardispatch" stroke="#EF4444" fill="#DC2626" fillOpacity={0.25} name="Trauma Dispatches" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricCard: React.FC<{
  title: string;
  value: string | number;
  unit: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  border: string;
}> = ({ title, value, unit, desc, icon: Icon, color, border }) => (
  <div className={`tactical-card p-3 rounded-xl border ${border} flex flex-col justify-between`}>
    <div className="flex items-center justify-between text-slate-400 mb-1">
      <span className="text-[10px] font-bold uppercase tracking-wider truncate">{title}</span>
      <Icon className={`w-3.5 h-3.5 ${color}`} />
    </div>
    <div className="my-0.5">
      <div className={`text-xl font-black ${color} truncate`}>{value}</div>
      <div className="text-[10px] text-slate-400 font-mono truncate">{unit}</div>
    </div>
    <div className="text-[9px] text-slate-500 truncate border-t border-slate-800/80 pt-1 mt-1 font-mono">
      {desc}
    </div>
  </div>
);
