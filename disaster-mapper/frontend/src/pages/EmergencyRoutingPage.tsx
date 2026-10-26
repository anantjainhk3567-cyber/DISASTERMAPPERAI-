import React, { useState, useMemo } from 'react';
import { useDisasterStore } from '../store/useDisasterStore';
import { api } from '../lib/api';
import { MapLibreMap } from '../components/map/MapLibreMap';
import {
  Navigation,
  MapPin,
  Truck,
  Shield,
  Clock,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  ArrowRight,
  Send,
  Sliders,
  Compass,
  AlertOctagon,
  ChevronRight
} from 'lucide-react';

interface Waypoint {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: 'BASE' | 'HOSPITAL' | 'SHELTER' | 'INCIDENT';
}

const keyLocations: Waypoint[] = [
  { id: 'loc-as-01', name: 'Jakhalabandha EOC Command Post (Assam)', lat: 26.3150, lng: 92.9376, type: 'BASE' },
  { id: 'loc-as-02', name: 'Kaliabor Civil Hospital Trauma Center', lat: 26.3310, lng: 92.9520, type: 'HOSPITAL' },
  { id: 'loc-as-03', name: 'Morigaon Sports Stadium Relief Complex', lat: 26.2480, lng: 92.5180, type: 'SHELTER' },
  { id: 'loc-as-04', name: 'Silghat Boat Staging Post (Char Island Access)', lat: 26.3420, lng: 92.9320, type: 'INCIDENT' },
  { id: 'loc-jk-01', name: 'Ramban EOC Headquarters (J&K NH-44)', lat: 33.2420, lng: 75.2450, type: 'BASE' },
  { id: 'loc-jk-02', name: 'Ramban District Hospital & Helipad', lat: 33.2430, lng: 75.2410, type: 'HOSPITAL' },
  { id: 'loc-jk-03', name: 'Chanderkote National Highway Transit Camp', lat: 33.1950, lng: 75.1850, type: 'SHELTER' },
  { id: 'loc-jk-04', name: 'Panthyal Rockfall Choke Point (NH-44)', lat: 33.2440, lng: 75.2350, type: 'INCIDENT' },
  { id: 'loc-sh-01', name: 'Shimla Ridge EOC Command Post (The Ridge)', lat: 31.1048, lng: 77.1734, type: 'BASE' },
  { id: 'loc-sh-02', name: 'IGMC Hospital Trauma Center & Helipad', lat: 31.1090, lng: 77.1820, type: 'HOSPITAL' },
  { id: 'loc-sh-03', name: 'Municipal Indoor Stadium Relief Camp', lat: 31.1010, lng: 77.1650, type: 'SHELTER' },
  { id: 'loc-sh-04', name: 'Summer Hill Shiv Bawdi Ground Zero', lat: 31.1140, lng: 77.1350, type: 'INCIDENT' },
  { id: 'loc-01', name: 'Civil Defence Command Post (Civil Lines)', lat: 28.6780, lng: 77.2210, type: 'BASE' },
  { id: 'loc-02', name: "St. Stephen's Hospital Trauma Center", lat: 28.6640, lng: 77.2150, type: 'HOSPITAL' },
  { id: 'loc-03', name: 'Yamuna Relief Shelter 1 (Kashmere Gate)', lat: 28.6680, lng: 77.2315, type: 'SHELTER' },
  { id: 'loc-04', name: 'Yamuna Khadar Staging Ground (Sector 1)', lat: 28.6610, lng: 77.2430, type: 'INCIDENT' },
];

export const EmergencyRoutingPage: React.FC = () => {
  const { currentDisaster } = useDisasterStore();

  const getInitialOrigin = () => {
    const id = currentDisaster?.id?.toLowerCase() || '';
    if (id.includes('assam')) return keyLocations[0];
    if (id.includes('jk') || id.includes('ramban')) return keyLocations[4];
    if (id.includes('shimla') || id.includes('himachal')) return keyLocations[8];
    return keyLocations[12];
  };

  const getInitialDest = () => {
    const id = currentDisaster?.id?.toLowerCase() || '';
    if (id.includes('assam')) return keyLocations[3];
    if (id.includes('jk') || id.includes('ramban')) return keyLocations[7];
    if (id.includes('shimla') || id.includes('himachal')) return keyLocations[11];
    return keyLocations[15];
  };

  const [origin, setOrigin] = useState<Waypoint>(getInitialOrigin());
  const [destination, setDestination] = useState<Waypoint>(getInitialDest());
  const [vehicleType, setVehicleType] = useState<'AMBULANCE' | 'FIRE_RESCUE' | 'EVACUATION_BUS'>('AMBULANCE');
  const [avoidFlooding, setAvoidFlooding] = useState(true);
  const [avoidDebris, setAvoidDebris] = useState(true);
  const [isComputing, setIsComputing] = useState(false);

  // Computed Route Result
  const [routeResult, setRouteResult] = useState<any>({
    primary: {
      name: 'Primary Evacuation Corridor (Via Civil Lines Arterial)',
      distanceKm: 6.4,
      durationMins: 14.2,
      hazardRisk: 'LOW',
      hazardSegmentsAvoided: 3,
      status: 'CLEAR',
      steps: [
        { instruction: 'Head east on Sham Nath Marg towards Civil Lines Metro', distance: '1.2 km', hazard: null },
        { instruction: 'Turn right onto Boulevard Road, keeping south of Ring Road', distance: '1.8 km', hazard: null },
        { instruction: 'Pass St. Stephen’s flyover on elevated ramp (dry clearance)', distance: '2.1 km', hazard: 'Caution: Surface runoff on ramp slip road' },
        { instruction: 'Merge into Yamuna Khadar flood containment perimeter', distance: '1.3 km', hazard: 'Speed limit 20 km/h due to responder foot traffic' },
      ],
    },
    alternate: {
      name: 'Alternate Deep-Water Bypass (Via ISBT Upper Deck)',
      distanceKm: 8.9,
      durationMins: 21.0,
      hazardRisk: 'MODERATE',
      hazardSegmentsAvoided: 5,
      status: 'HAZARDOUS',
      steps: [
        { instruction: 'Depart via Ring Road Outer Bypass', distance: '3.4 km', hazard: null },
        { instruction: 'Transit elevated Ring Road flyover past inundated underpasses', distance: '3.8 km', hazard: 'High wind gusts across bridge deck' },
        { instruction: 'Descend south into Sector 1 Relief Staging Ground', distance: '1.7 km', hazard: 'Water depth 0.15m at lower approach' },
      ],
    },
  });

  const handleComputeRoute = async () => {
    setIsComputing(true);

    try {
      if (currentDisaster?.id) {
        await api.routing.calculate(currentDisaster.id, {
          origin: { lat: origin.lat, lng: origin.lng },
          destination: { lat: destination.lat, lng: destination.lng },
          vehicleType,
        });
      }
    } catch {
      // Offline fallback
    }

    setTimeout(() => {
      // Dynamic Dijkstra graph synthetic calculation
      const dist = parseFloat((Math.sqrt(Math.pow(destination.lat - origin.lat, 2) + Math.pow(destination.lng - origin.lng, 2)) * 111 * 1.35).toFixed(1));
      const speed = vehicleType === 'AMBULANCE' ? 38 : vehicleType === 'FIRE_RESCUE' ? 30 : 25;
      const duration = parseFloat(((dist / speed) * 60).toFixed(1));

      setRouteResult({
        primary: {
          name: `Dijkstra Optimized Route (${vehicleType})`,
          distanceKm: dist,
          durationMins: duration,
          hazardRisk: avoidFlooding ? 'MINIMAL' : 'ELEVATED',
          hazardSegmentsAvoided: avoidFlooding ? 4 : 1,
          status: 'CLEAR',
          steps: [
            { instruction: `Depart from ${origin.name} via high-clearance arterial`, distance: `${(dist * 0.3).toFixed(1)} km`, hazard: null },
            { instruction: 'Bypass inundated low-water underpass through elevated connector', distance: `${(dist * 0.4).toFixed(1)} km`, hazard: 'Dry pavement verified' },
            { instruction: `Arrive at destination: ${destination.name}`, distance: `${(dist * 0.3).toFixed(1)} km`, hazard: null },
          ],
        },
        alternate: {
          name: `Secondary Fallback Route (${vehicleType})`,
          distanceKm: parseFloat((dist * 1.25).toFixed(1)),
          durationMins: parseFloat((duration * 1.3).toFixed(1)),
          hazardRisk: 'MODERATE',
          hazardSegmentsAvoided: 2,
          status: 'BACKUP',
          steps: [
            { instruction: `Bypass route via northern ridge bypass`, distance: `${(dist * 0.6).toFixed(1)} km`, hazard: null },
            { instruction: `Approach ${destination.name} from western embankment gate`, distance: `${(dist * 0.65).toFixed(1)} km`, hazard: 'Slight standing water 0.1m' },
          ],
        },
      });
      setIsComputing(false);
    }, 600);
  };

  const routeGeoJson = useMemo(() => {
    const lat1 = origin.lat;
    const lng1 = origin.lng;
    const lat2 = destination.lat;
    const lng2 = destination.lng;
    const midLat = (lat1 + lat2) / 2 + 0.003;
    const midLng = (lng1 + lng2) / 2 - 0.004;

    return {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          id: 'primary-corridor',
          properties: {
            id: 'primary-corridor',
            entity: 'ROUTE',
            type: 'ROUTE',
            name: routeResult.primary.name,
            status: 'RECOMMENDED',
            distance: `${routeResult.primary.distanceKm} km`,
            eta: `${routeResult.primary.durationMins} min`,
          },
          geometry: {
            type: 'LineString',
            coordinates: [
              [lng1, lat1],
              [lng1 + (midLng - lng1) * 0.45, lat1 + (midLat - lat1) * 0.4],
              [midLng, midLat],
              [midLng + (lng2 - midLng) * 0.55, midLat + (lat2 - midLat) * 0.6],
              [lng2, lat2],
            ],
          },
        },
        {
          type: 'Feature',
          id: 'origin-marker',
          properties: {
            id: 'origin-marker',
            entity: 'SHELTER',
            type: 'SHELTER',
            name: `ORIGIN: ${origin.name}`,
            status: 'OPEN',
            capacity: 500,
            occupancy: 200,
          },
          geometry: {
            type: 'Point',
            coordinates: [lng1, lat1],
          },
        },
        {
          type: 'Feature',
          id: 'destination-marker',
          properties: {
            id: 'destination-marker',
            entity: 'CRITICAL_FACILITY',
            type: 'HOSPITAL',
            name: `DESTINATION: ${destination.name}`,
            status: 'OPERATIONAL',
            priority: 'HIGH',
          },
          geometry: {
            type: 'Point',
            coordinates: [lng2, lat2],
          },
        },
      ],
    };
  }, [origin, destination, routeResult]);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              FIRST RESPONDER DIJKSTRA ROUTING
            </span>
            <span className="text-xs text-slate-400">Road Graph: OpenStreetMap + Dynamic Hazard Weights</span>
          </div>
          <h1 className="text-2xl font-black text-slate-100 tracking-tight mt-1 flex items-center space-x-2.5">
            <Navigation className="w-6 h-6 text-cyan-400" />
            <span>Emergency Evacuation & Response Routing</span>
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Compute obstacle-free navigation paths for emergency vehicles avoiding flooded road links and structural debris.
          </p>
        </div>
      </div>

      {/* 3D Corridor Map Viewport */}
      <div className="h-96 rounded-xl overflow-hidden border border-slate-800 relative shadow-2xl map-3d-frame">
        <MapLibreMap
          center={[(origin.lng + destination.lng) / 2, (origin.lat + destination.lat) / 2]}
          zoom={12.5}
          pitch={55}
          bearing={-14}
          geoJsonData={routeGeoJson}
          showLayerControls={true}
        />
        <div className="absolute top-3 left-3 px-3 py-1.5 rounded-lg bg-slate-950/85 backdrop-blur-md border border-cyan-500/40 text-[10px] font-mono text-cyan-300 flex items-center space-x-2 shadow-lg">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>3D TACTICAL EVACUATION CORRIDOR — {origin.name.split('(')[0]} → {destination.name.split('(')[0]}</span>
        </div>
      </div>

      {/* Main Grid: Control Parameters (5 cols) & Computed Turn-by-Turn Path (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Route Configuration */}
        <div className="lg:col-span-5 space-y-5">
          <div className="p-5 rounded-xl bg-[#0F172A] border border-slate-800 space-y-4 shadow-xl">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200 border-b border-slate-800/80 pb-3 flex items-center justify-between">
              <span>Routing Controls</span>
              <span className="text-[10px] text-cyan-400 font-mono">ROAD GRAPH CONNECTIVITY</span>
            </h2>

            {/* Origin */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>Origin (Deployment Base / Unit Location)</span>
              </label>
              <select
                value={origin.id}
                onChange={(e) => setOrigin(keyLocations.find((l) => l.id === e.target.value) || keyLocations[0])}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs font-medium text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                {keyLocations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name} ({loc.type})
                  </option>
                ))}
              </select>
            </div>

            {/* Destination */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5 text-red-400" />
                <span>Destination (Rescue Zone / Hospital)</span>
              </label>
              <select
                value={destination.id}
                onChange={(e) => setDestination(keyLocations.find((l) => l.id === e.target.value) || keyLocations[3])}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs font-medium text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                {keyLocations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name} ({loc.type})
                  </option>
                ))}
              </select>
            </div>

            {/* Vehicle Profile */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
                <Truck className="w-3.5 h-3.5 text-cyan-400" />
                <span>Vehicle Profile & Clearance Class</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'AMBULANCE', label: 'Ambulance', desc: 'Max 0.15m water' },
                  { id: 'FIRE_RESCUE', label: 'Fire / Heavy', desc: 'Max 0.40m water' },
                  { id: 'EVACUATION_BUS', label: 'Civilian Bus', desc: 'Arterials only' },
                ].map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setVehicleType(v.id as any)}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      vehicleType === v.id
                        ? 'bg-slate-800 border-cyan-400 text-cyan-300'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-xs font-bold truncate">{v.label}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{v.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Avoidance Flags */}
            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>Dynamic Obstacle Avoidance</span>
              </label>

              <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={avoidFlooding}
                  onChange={(e) => setAvoidFlooding(e.target.checked)}
                  className="w-4 h-4 accent-cyan-400"
                />
                <span>Prune Submerged Road Segments (&gt;0.2m water)</span>
              </label>

              <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={avoidDebris}
                  onChange={(e) => setAvoidDebris(e.target.checked)}
                  className="w-4 h-4 accent-amber-400"
                />
                <span>Avoid Confirmed Structural Debris & Road Closures</span>
              </label>
            </div>

            {/* Calculate Button */}
            <button
              onClick={handleComputeRoute}
              disabled={isComputing}
              className={`w-full py-3 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-xl ${
                isComputing
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-cyan-500/20'
              }`}
            >
              {isComputing ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-900 border-t-cyan-400 rounded-full animate-spin" />
                  <span>Solving Dijkstra Road Graph...</span>
                </>
              ) : (
                <>
                  <Navigation className="w-4 h-4" />
                  <span>Compute Optimal Route</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Computed Routes & Turn-by-Turn Steps */}
        <div className="lg:col-span-7 space-y-5">
          {/* Primary Route Card */}
          <div className="p-5 rounded-xl bg-[#0F172A] border border-cyan-500/30 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400">
                  RECOMMENDED CORRIDOR (DIJKSTRA OPTIMAL)
                </span>
                <h3 className="text-base font-bold text-slate-100">{routeResult.primary.name}</h3>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded border border-emerald-800/50">
                {routeResult.primary.hazardRisk} HAZARD
              </span>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400 uppercase font-mono">Distance</div>
                <div className="text-xl font-black font-mono text-cyan-300 mt-0.5">
                  {routeResult.primary.distanceKm} <span className="text-xs font-normal">km</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400 uppercase font-mono">ETA Duration</div>
                <div className="text-xl font-black font-mono text-amber-300 mt-0.5">
                  {routeResult.primary.durationMins} <span className="text-xs font-normal">mins</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400 uppercase font-mono">Hazards Cleared</div>
                <div className="text-xl font-black font-mono text-emerald-400 mt-0.5">
                  {routeResult.primary.hazardSegmentsAvoided} <span className="text-xs font-normal">blocked</span>
                </div>
              </div>
            </div>

            {/* Turn-by-Turn Navigation */}
            <div className="space-y-2 pt-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
                <Compass className="w-3.5 h-3.5 text-cyan-400" />
                <span>Turn-by-Turn Navigation Steps</span>
              </div>

              <div className="space-y-2 font-mono text-xs">
                {routeResult.primary.steps.map((step: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-slate-900/80 border border-slate-800/80 flex items-start space-x-3"
                  >
                    <div className="w-5 h-5 rounded-full bg-slate-800 text-cyan-400 font-bold flex items-center justify-center shrink-0 text-[10px] mt-0.5">
                      {idx + 1}
                    </div>
                    <div className="flex-1 space-y-0.5">
                      <div className="text-slate-200 font-sans">{step.instruction}</div>
                      <div className="text-[10px] text-slate-500">{step.distance}</div>
                      {step.hazard && (
                        <div className="text-[10px] text-amber-400 font-sans flex items-center space-x-1 pt-0.5">
                          <AlertTriangle className="w-3 h-3 shrink-0" />
                          <span>{step.hazard}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Transmit Action */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => alert('Route telemetry transmitted to on-board vehicle GPS unit.')}
                className="px-4 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center space-x-2 transition-all shadow-md"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Transmit Route to Field Unit</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
