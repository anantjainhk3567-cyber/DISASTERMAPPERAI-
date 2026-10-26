import React, { useState } from 'react';
import { useDisasterStore } from '../store/useDisasterStore';
import { MapLibreMap } from '../components/map/MapLibreMap';
import { getGeoJsonForDisaster } from '../data/multiDisasterGeoJson';
import {
  Flame,
  ShieldAlert,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Users,
  Waves,
  Navigation,
  Truck,
  HeartPulse,
  Activity,
  Boxes,
  Send,
  Building,
  RotateCcw,
  Sparkles,
  Info
} from 'lucide-react';
import type { DisasterType, PriorityLevel, HelpNeededResponseSector } from '../types';

export const RescuePrioritiesPage: React.FC = () => {
  const { selectedDisaster } = useDisasterStore();

  const [selectedDisasterFilter, setSelectedDisasterFilter] = useState<DisasterType | 'ALL'>('ALL');
  // Sync default sector with currently selected disaster
  const getDefaultSectorId = () => {
    const id = selectedDisaster?.id?.toLowerCase() || '';
    if (id.includes('assam')) return 'sec-assam-01';
    if (id.includes('jk') || id.includes('ramban')) return 'sec-jk-01';
    if (id.includes('shimla') || id.includes('himachal')) return 'sec-shimla-01';
    if (id.includes('delhi')) return 'sec-01';
    if (id.includes('bhuj') || id.includes('earthquake')) return 'sec-02';
    if (id.includes('wayanad')) return 'sec-03';
    if (id.includes('cyclone') || id.includes('amrit')) return 'sec-04';
    if (id.includes('wildfire') || id.includes('similipal')) return 'sec-05';
    return 'sec-assam-01';
  };

  const [selectedSectorId, setSelectedSectorId] = useState<string>(getDefaultSectorId());
  const [dispatchSuccess, setDispatchSuccess] = useState<string | null>(null);

  // Cross-Disaster Prioritization Engine Sectors
  const [sectors, setSectors] = useState<HelpNeededResponseSector[]>([
    {
      sectorId: 'sec-shimla-01',
      sectorName: 'Sector SH-1 — Summer Hill & Shiv Bawdi Debris Sector',
      disasterType: 'LANDSLIDE',
      priorityLevel: 'RED',
      priorityScore: 97,
      urgencyDriver: 'Catastrophic slope failure along Summer Hill scarp; 24,000 m³ limestone-shale slurry crushed Shiv Bawdi temple structure; Kalka-Shimla UNESCO railway tracks suspended in mid-air over 30m chasm; NH-5 arterial road severed at Tara Devi.',
      affectedPopulation: 4800,
      trappedCasualtiesEstimate: 21,
      roadAccessStatus: 'CUT_OFF',
      criticalFacilitiesCompromised: ['Kalka-Shimla UNESCO Heritage Railway Track', 'NH-5 Kalka-Shimla Highway (Tara Devi Choke Point)'],
      requiredResources: [
        { resource: 'Heavy Tracked Excavators & Rock Breakers', quantity: 4, unit: 'Machines', icon: 'Truck', status: 'ON_SITE' },
        { resource: 'NDRF Acoustic Canine USAR Squads', quantity: 6, unit: 'Teams', icon: 'ShieldAlert', status: 'DISPATCHED' },
        { resource: 'IGMC Hospital Mobile Trauma Surgery Unit', quantity: 1, unit: 'Unit', icon: 'HeartPulse', status: 'ON_SITE' },
        { resource: 'HPSDMA Satellite SATCOM Links & Slope Sensors', quantity: 8, unit: 'Sensors', icon: 'Activity', status: 'DISPATCHED' }
      ],
      primaryAction: 'Round-the-clock acoustic void search in collapsed temple debris and controlled rock scaling above NH-5 corridor.'
    },
    {
      sectorId: 'sec-assam-01',
      sectorName: 'Sector AS-1 — Morigaon Lahorighat Char Islands',
      disasterType: 'FLOOD',
      priorityLevel: 'RED',
      priorityScore: 98,
      urgencyDriver: 'Brahmaputra cresting 1.15m above danger mark at Nematighat; 48,000 citizens marooned on riverine sandbars with zero road escape routes; 620 trapped in precarious dwellings.',
      affectedPopulation: 48000,
      trappedCasualtiesEstimate: 620,
      roadAccessStatus: 'CUT_OFF',
      criticalFacilitiesCompromised: ['Jakhalabandha E&D Embankment (140m Breach)', 'NH-27 Submerged Corridor (1.45m depth)'],
      requiredResources: [
        { resource: 'Motorized Inflatable Zodiac Rescue Boats', quantity: 18, unit: 'Crafts', icon: 'Waves', status: 'DISPATCHED' },
        { resource: 'Commercial Water Purification Barges', quantity: 2, unit: 'Barges', icon: 'ShieldAlert', status: 'ON_SITE' },
        { resource: 'IAF Mi-17 Airdrop Helicopter Sorties', quantity: 4, unit: 'Helicopters', icon: 'Navigation', status: 'REQUESTED' },
        { resource: 'Lifejackets & High-Energy Food Rations', quantity: 8000, unit: 'Kits', icon: 'ShieldAlert', status: 'DISPATCHED' }
      ],
      primaryAction: 'Immediate deployment of 18 NDRF/SDRF motorized Zodiacs with night-vision drone spotting to evacuate island residents.'
    },
    {
      sectorId: 'sec-jk-01',
      sectorName: 'Sector JK-1 — NH-44 Panthyal-Mehar Slide Corridor',
      disasterType: 'LANDSLIDE',
      priorityLevel: 'RED',
      priorityScore: 99,
      urgencyDriver: '18,000 m³ limestone rockfall avalanche crushed steel rock shelter on NH-44; 14 mountain hamlets (39,100 citizens in Gool/Pogal/Paristan) completely cut off; 450 freight trucks trapped.',
      affectedPopulation: 39100,
      trappedCasualtiesEstimate: 340,
      roadAccessStatus: 'CUT_OFF',
      criticalFacilitiesCompromised: ['NH-44 Panthyal Tunnel Shelter', 'Ramban-Gool Mountain Arterial'],
      requiredResources: [
        { resource: 'BRO CAT D8 Heavy Tracked Earthmovers', quantity: 6, unit: 'Machines', icon: 'Truck', status: 'ON_SITE' },
        { resource: 'IAF Mi-17 High-Altitude Medevac Sorties', quantity: 4, unit: 'Helicopters', icon: 'Navigation', status: 'DISPATCHED' },
        { resource: 'Mobile Surgical Trauma ICU at Ramban Base', quantity: 2, unit: 'Units', icon: 'HeartPulse', status: 'ON_SITE' },
        { resource: 'Emergency Satellite SATCOM Links & Food Drops', quantity: 1200, unit: 'Kits', icon: 'ShieldAlert', status: 'DISPATCHED' }
      ],
      primaryAction: 'BRO Project Beacon round-the-clock rock blasting and IAF helicopter medevac for injured passengers and isolated alpine hamlets.'
    },
    {
      sectorId: 'sec-01',
      sectorName: 'Sector A — Kashmere Gate Lowlands & Yamuna Khadar',
      disasterType: 'FLOOD',
      priorityLevel: 'RED',
      priorityScore: 95,
      urgencyDriver: 'River cresting at 208.66m (3.33m above danger mark); 4,200 people stranded in multi-story tenements; ground floor submerged in 2.8m fast-moving current.',
      affectedPopulation: 4200,
      trappedCasualtiesEstimate: 140,
      roadAccessStatus: 'CUT_OFF',
      criticalFacilitiesCompromised: ['Monastery Market Bund', 'ISBT Underpass Sump'],
      requiredResources: [
        { resource: 'Amphibious Inflatable Rescue Boats', quantity: 12, unit: 'Crafts', icon: 'Waves', status: 'DISPATCHED' },
        { resource: 'High-Clearance Heavy Evacuation Trucks', quantity: 8, unit: 'Vehicles', icon: 'Truck', status: 'ON_SITE' },
        { resource: 'Trauma Paramedic Teams', quantity: 4, unit: 'Squads', icon: 'HeartPulse', status: 'REQUESTED' },
        { resource: 'Clean Water & Packaged Rations', quantity: 4500, unit: 'Packets', icon: 'ShieldAlert', status: 'DISPATCHED' }
      ],
      primaryAction: 'Immediate amphibious boat deployment to evacuate ground-floor residents to Yamuna Sports Complex shelter.'
    },
    {
      sectorId: 'sec-02',
      sectorName: 'Sector B — Bhuj Old Walled Medieval Quarter',
      disasterType: 'EARTHQUAKE',
      priorityLevel: 'RED',
      priorityScore: 97,
      urgencyDriver: 'High-density unreinforced masonry pancaked structures; 320 trapped victims inside 72h golden survival window; narrow streets blocked with debris rubble.',
      affectedPopulation: 18400,
      trappedCasualtiesEstimate: 320,
      roadAccessStatus: 'RESTRICTED',
      criticalFacilitiesCompromised: ['GK Memorial Hospital (Structural Shear)', 'City Center Water Tank'],
      requiredResources: [
        { resource: 'Urban Search & Rescue (USAR) Specialists', quantity: 6, unit: 'Teams', icon: 'ShieldAlert', status: 'DISPATCHED' },
        { resource: 'Canine Acoustic Life Detection Units', quantity: 8, unit: 'Canines', icon: 'Activity', status: 'ON_SITE' },
        { resource: 'Mobile Surgical Trauma ICUs', quantity: 2, unit: 'Trailers', icon: 'HeartPulse', status: 'REQUESTED' },
        { resource: 'Hydraulic Shoring & Concrete Cutters', quantity: 16, unit: 'Pneumatic Sets', icon: 'Truck', status: 'DISPATCHED' }
      ],
      primaryAction: 'Acoustic void search and hydraulic shoring extraction of collapsed residential tenements before secondary aftershocks.'
    },
    {
      sectorId: 'sec-03',
      sectorName: 'Sector C — Mundakkai Isolated Plantation Basin',
      disasterType: 'LANDSLIDE',
      priorityLevel: 'RED',
      priorityScore: 98,
      urgencyDriver: 'Chooralmala River Bridge swept away by 3.2M m³ boulder slurry; 1,450 plantation residents completely cut off with zero road access and 2 days of rations remaining.',
      affectedPopulation: 1450,
      trappedCasualtiesEstimate: 180,
      roadAccessStatus: 'CUT_OFF',
      criticalFacilitiesCompromised: ['Chooralmala Bridge (Destroyed)', 'Estate Medical Clinic'],
      requiredResources: [
        { resource: 'IAF Mi-17 Medevac Heavy Lift Sorties', quantity: 4, unit: 'Helicopters', icon: 'Navigation', status: 'ON_SITE' },
        { resource: 'Madras Engineering Group Bailey Bridge Kits', quantity: 2, unit: 'Bridge Spans', icon: 'Truck', status: 'DISPATCHED' },
        { resource: 'Heavy Tracked Hydraulic Excavators', quantity: 6, unit: 'Machines', icon: 'Truck', status: 'REQUESTED' },
        { resource: 'Emergency Satellite Comms & Medical Drops', quantity: 500, unit: 'Kits', icon: 'ShieldAlert', status: 'ON_SITE' }
      ],
      primaryAction: 'Aerial winch extraction of injured elders and construction of military Bailey bridge to restore surface logistics.'
    },
    {
      sectorId: 'sec-04',
      sectorName: 'Sector D — Sagar Island South & Dhablat Embankment',
      disasterType: 'CYCLONE',
      priorityLevel: 'RED',
      priorityScore: 94,
      urgencyDriver: '4.2m storm surge breached saline embankment; 38,500 coastal residents facing imminent high-tide submergence; 7,300 shelter deficit.',
      affectedPopulation: 38500,
      trappedCasualtiesEstimate: 65,
      roadAccessStatus: 'CUT_OFF',
      criticalFacilitiesCompromised: ['Dhablat Coastal Bund (45m Breach)', 'Sagar 33kV Substation'],
      requiredResources: [
        { resource: 'Coastal Hovercraft & NDRF Rigid Inflatables', quantity: 8, unit: 'Vessels', icon: 'Waves', status: 'DISPATCHED' },
        { resource: 'Reinforced Cyclone Shelter Busses', quantity: 24, unit: 'Buses', icon: 'Truck', status: 'REQUESTED' },
        { resource: 'Emergency High-Output Water Pumping Units', quantity: 12, unit: 'Diesel Pumps', icon: 'ShieldAlert', status: 'ON_SITE' },
        { resource: 'Mobile Water Desalination & Purification Kits', quantity: 6, unit: 'Plants', icon: 'HeartPulse', status: 'DISPATCHED' }
      ],
      primaryAction: 'High-clearance evacuation to inland reinforced concrete multi-purpose cyclone shelters.'
    },
    {
      sectorId: 'sec-05',
      sectorName: 'Sector E — Gurguria Fringe Forest Tribal Hamlet',
      disasterType: 'WILDFIRE',
      priorityLevel: 'ORANGE',
      priorityScore: 84,
      urgencyDriver: 'High-intensity crown fire advancing at 1.4 km/h under 28 km/h wind gusts; 800m from settlement perimeter; smoke PM2.5 > 580 ug/m³.',
      affectedPopulation: 2600,
      trappedCasualtiesEstimate: 20,
      roadAccessStatus: 'RESTRICTED',
      criticalFacilitiesCompromised: ['Forest Ranger VHF Relay Tower'],
      requiredResources: [
        { resource: 'Bulldozer Mineral Firebreak Cutters', quantity: 4, unit: 'Bulldozers', icon: 'Truck', status: 'ON_SITE' },
        { resource: 'Aerial Water Scoopers & IAF Bambi Drops', quantity: 3, unit: 'Sorties', icon: 'Navigation', status: 'DISPATCHED' },
        { resource: 'High-Efficiency Particulate Respirator Masks', quantity: 3000, unit: 'N95 Units', icon: 'ShieldAlert', status: 'ON_SITE' },
        { resource: 'Evacuation Convoy Buses', quantity: 8, unit: 'Buses', icon: 'Truck', status: 'REQUESTED' }
      ],
      primaryAction: 'Preemptive civilian convoy evacuation along western road and bulldozing 40m containment firebreak.'
    }
  ]);

  const filteredSectors = selectedDisasterFilter === 'ALL'
    ? sectors
    : sectors.filter((s) => s.disasterType === selectedDisasterFilter);

  const activeSector = sectors.find((s) => s.sectorId === selectedSectorId) || sectors[0];

  const handleDispatchResource = (resourceName: string) => {
    setSectors((prev) =>
      prev.map((sec) => {
        if (sec.sectorId === activeSector.sectorId) {
          return {
            ...sec,
            requiredResources: sec.requiredResources.map((res) => {
              if (res.resource === resourceName) {
                const nextStatus: 'REQUESTED' | 'DISPATCHED' | 'ON_SITE' =
                  res.status === 'REQUESTED' ? 'DISPATCHED' : res.status === 'DISPATCHED' ? 'ON_SITE' : 'ON_SITE';
                return { ...res, status: nextStatus };
              }
              return res;
            })
          };
        }
        return sec;
      })
    );
    setDispatchSuccess(`Tactical dispatch order transmitted for ${resourceName}`);
    setTimeout(() => setDispatchSuccess(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#2B0E14] via-[#1A0E18] to-[#0B1120] p-6 rounded-2xl border border-red-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-full bg-red-500/5 blur-3xl pointer-events-none"></div>
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center shrink-0 shadow-lg shadow-red-500/20">
            <Flame className="w-6 h-6 text-red-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-xl md:text-2xl font-black text-white tracking-wide">
                Where Help is Needed Most — Priority Engine
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-red-500/20 text-red-300 border border-red-500/40">
                DYNAMIC DECISION ENGINE
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                DEMONSTRATION DATA
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Cross-hazard multi-criteria ranking algorithm prioritizing rescue sectors by casualty severity, population isolation, and tactical resource deficits.
            </p>
          </div>
        </div>

        {/* Disaster Type Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#070B14]/80 p-1.5 rounded-xl border border-slate-800">
          {(['ALL', 'FLOOD', 'EARTHQUAKE', 'LANDSLIDE', 'CYCLONE', 'WILDFIRE'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setSelectedDisasterFilter(type)}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all ${
                selectedDisasterFilter === type
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {dispatchSuccess && (
        <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-xs font-bold text-emerald-300 flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{dispatchSuccess}</span>
        </div>
      )}

      {/* Main Grid: Priority Ranking Cards + Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Sector Ranking Cards */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 px-1">
            <span>Ranked Priority Sectors ({filteredSectors.length})</span>
            <span className="text-[11px] font-mono text-cyan-400">HIGHEST URGENCY FIRST</span>
          </div>

          <div className="space-y-3 max-h-[680px] overflow-y-auto pr-1">
            {filteredSectors.map((sector, idx) => (
              <div
                key={sector.sectorId}
                onClick={() => setSelectedSectorId(sector.sectorId)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  activeSector.sectorId === sector.sectorId
                    ? 'bg-gradient-to-r from-[#1E1120] to-[#12142B] border-cyan-400/80 shadow-xl shadow-cyan-500/10'
                    : 'tactical-card border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-md bg-slate-800 text-slate-300 flex items-center justify-center font-mono font-bold text-xs">
                      #{idx + 1}
                    </span>
                    <span className="font-black text-xs text-white">{sector.sectorName}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono font-bold text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                      {sector.disasterType}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                      sector.priorityLevel === 'RED'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    }`}>
                      {sector.priorityScore}/100
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-300 line-clamp-2 mb-2.5">
                  {sector.urgencyDriver}
                </p>

                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800/80">
                  <span>Pop: <strong className="text-white">{sector.affectedPopulation.toLocaleString()}</strong></span>
                  <span>Trapped Est: <strong className="text-red-400">{sector.trappedCasualtiesEstimate}</strong></span>
                  <span>Access: <strong className={sector.roadAccessStatus === 'CUT_OFF' ? 'text-red-400' : 'text-amber-400'}>{sector.roadAccessStatus}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Active Sector Deep Inspection & Resource Dispatch Deck */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className="tactical-card p-6 rounded-2xl border border-slate-800 space-y-5">
            {/* Top Sector Overview */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-0.5 rounded text-[11px] font-black ${
                    activeSector.priorityLevel === 'RED'
                      ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  }`}>
                    {activeSector.priorityLevel} PRIORITY • SCORE {activeSector.priorityScore}/100
                  </span>
                  <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                    {activeSector.disasterType} EMERGENCY
                  </span>
                </div>
                <h2 className="text-lg font-black text-white mt-2">{activeSector.sectorName}</h2>
              </div>

              {/* Status Tags */}
              <div className="flex items-center space-x-4 bg-[#070B14] p-3 rounded-xl border border-slate-800">
                <div>
                  <div className="text-[10px] text-slate-400 font-mono">Population at Risk</div>
                  <div className="text-sm font-black text-white">{activeSector.affectedPopulation.toLocaleString()}</div>
                </div>
                <div className="border-l border-slate-800 pl-4">
                  <div className="text-[10px] text-slate-400 font-mono">Trapped / Casualties</div>
                  <div className="text-sm font-black text-red-400">{activeSector.trappedCasualtiesEstimate}</div>
                </div>
                <div className="border-l border-slate-800 pl-4">
                  <div className="text-[10px] text-slate-400 font-mono">Road Access</div>
                  <div className={`text-sm font-black ${activeSector.roadAccessStatus === 'CUT_OFF' ? 'text-red-400' : 'text-amber-400'}`}>
                    {activeSector.roadAccessStatus}
                  </div>
                </div>
              </div>
            </div>

            {/* Why This is Priority 1 Callout */}
            <div className="p-4 rounded-xl bg-red-950/30 border border-red-800/40 text-xs space-y-1.5">
              <div className="font-bold flex items-center space-x-2 text-red-300">
                <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
                <span>Primary Operational Urgency Justification</span>
              </div>
              <p className="text-slate-200 leading-relaxed text-[11px]">
                {activeSector.urgencyDriver}
              </p>
              <div className="pt-1 text-[11px] text-slate-300 font-mono">
                Compromised Critical Facilities: <strong>{activeSector.criticalFacilitiesCompromised.join(', ')}</strong>
              </div>
            </div>

            {/* Required Response Resources Grid */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-white">Specific Required Response Resources</span>
                <span className="text-[10px] font-mono text-slate-400">CLICK TO DISPATCH / UPDATE</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {activeSector.requiredResources.map((res) => (
                  <div
                    key={res.resource}
                    className="p-3.5 rounded-xl bg-[#070B14]/80 border border-slate-800 flex items-center justify-between hover:border-slate-700 transition-all"
                  >
                    <div className="space-y-1">
                      <div className="font-bold text-xs text-white">{res.resource}</div>
                      <div className="text-[11px] font-mono text-cyan-300">
                        {res.quantity.toLocaleString()} {res.unit}
                      </div>
                    </div>

                    <button
                      onClick={() => handleDispatchResource(res.resource)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                        res.status === 'ON_SITE'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                          : res.status === 'DISPATCHED'
                          ? 'bg-blue-500/20 text-blue-300 border-blue-500/40 hover:bg-blue-500/30'
                          : 'bg-red-500/20 text-red-300 border-red-500/40 hover:bg-red-500/30'
                      }`}
                    >
                      {res.status}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Action & Dispatch Command Button */}
            <div className="p-4 rounded-xl bg-[#070B14] border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="text-[10px] text-slate-400 font-mono uppercase">Immediate Strategic Order</div>
                <div className="text-xs font-bold text-white">{activeSector.primaryAction}</div>
              </div>

              <button
                onClick={() => {
                  setDispatchSuccess(`Full tactical response convoy deployed to ${activeSector.sectorName}`);
                  setTimeout(() => setDispatchSuccess(null), 3500);
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white text-xs font-bold shadow-lg shadow-red-600/30 transition-all flex items-center space-x-2 shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Transmit Response Order</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
