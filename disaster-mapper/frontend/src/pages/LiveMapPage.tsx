import React, { useEffect, useState } from 'react';
import { useDisasterStore } from '../store/useDisasterStore';
import { api } from '../lib/api';
import { MapLibreMap } from '../components/map/MapLibreMap';
import { DEFAULT_DELHI_GEOJSON } from '../data/delhiGeoJson';
import { getGeoJsonForDisaster } from '../data/multiDisasterGeoJson';
import {
  Layers,
  MapPin,
  Filter,
  Eye,
  EyeOff,
  Navigation,
  Flame,
  Droplets,
  Building,
  Home,
  MessageSquareWarning,
  Maximize2,
  X,
  ArrowRight,
  ShieldAlert,
  Boxes
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const LiveMapPage: React.FC = () => {
  const {
    selectedDisaster,
    disastersList,
    setSelectedDisaster,
    layerVisibility,
    toggleLayer,
    mapStyle,
    setMapStyle,
    is3DTilt,
    toggle3DTilt
  } = useDisasterStore();

  const [mapGeoJson, setMapGeoJson] = useState<any>(
    selectedDisaster ? getGeoJsonForDisaster(selectedDisaster.id) : DEFAULT_DELHI_GEOJSON
  );
  const [selectedFeature, setSelectedFeature] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedDisaster) return;
    // Instant responsive update from authentic local GIS dataset
    setMapGeoJson(getGeoJsonForDisaster(selectedDisaster.id));

    async function fetchMap() {
      if (!selectedDisaster) return;
      try {
        const res = await api.disasters.getMapGeoJson(selectedDisaster.id);
        if (res.data && res.data.features && res.data.features.length > 0) {
          setMapGeoJson(res.data);
        }
      } catch (err) {
        // Local dataset already active
      }
    }
    fetchMap();
  }, [selectedDisaster?.id]);

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] overflow-hidden flex">
      {/* Top Floating Disaster Quick Selector Bar */}
      <div className="absolute top-4 left-4 z-20 flex items-center space-x-2 bg-[#0F172A]/90 border border-slate-800 rounded-xl p-2 shadow-2xl backdrop-blur-xl">
        <span className="text-xs font-bold text-slate-400 pl-2">Mission Focus:</span>
        <select
          value={selectedDisaster?.id || ''}
          onChange={(e) => {
            const d = disastersList.find((item) => item.id === e.target.value);
            if (d) setSelectedDisaster(d);
          }}
          className="bg-[#141F36] text-white text-xs rounded-lg px-3 py-1.5 border border-slate-700 font-bold focus:outline-none focus:border-cyan-500"
        >
          {disastersList.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name} [{d.type}]
            </option>
          ))}
        </select>

        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-black bg-red-500/20 text-red-400 border border-red-500/30">
          {selectedDisaster?.severity || 'HIGH'}
        </span>
      </div>

      {/* Main Full-Screen Map Component */}
      <div className="w-full h-full">
        <MapLibreMap
          center={selectedDisaster ? [selectedDisaster.centerLongitude, selectedDisaster.centerLatitude] : [77.2090, 28.6139]}
          zoom={13}
          geoJsonData={mapGeoJson}
          onFeatureClick={(feat) => {
            if (feat.properties?.entity === 'RESCUE_ZONE' || feat.properties?.type === 'rescue_zone') {
              setSelectedFeature(null);
            } else {
              setSelectedFeature(feat);
            }
          }}
          height="100%"
          showLayerControls={true}
        />
      </div>

      {/* Slide-over Inspection Panel when a feature is clicked */}
      {selectedFeature && (
        <div className="absolute top-4 right-16 bottom-4 w-96 bg-[#0F172A]/95 border border-slate-700 rounded-2xl shadow-2xl p-5 z-30 backdrop-blur-2xl flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
                <span className="text-xs font-black uppercase tracking-wider text-slate-300">
                  {selectedFeature.properties?.entity || 'Geospatial Feature'}
                </span>
              </div>
              <button
                onClick={() => setSelectedFeature(null)}
                className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <h3 className="text-base font-bold text-white mb-2">
              {selectedFeature.properties?.name || selectedFeature.properties?.type || 'Sector Telemetry'}
            </h3>

            {/* Properties List */}
            <div className="space-y-2 text-xs">
              {selectedFeature.properties?.priority && (
                <div className="p-2.5 rounded-lg bg-red-950/40 border border-red-800/40 flex justify-between items-center">
                  <span className="text-red-300 font-semibold">Priority Rating</span>
                  <span className="font-mono font-bold text-red-400">
                    {selectedFeature.properties.priority} ({selectedFeature.properties.priorityScore || 85}/100)
                  </span>
                </div>
              )}

              {selectedFeature.properties?.affectedPopulation && (
                <div className="p-2 rounded bg-slate-900 border border-slate-800 flex justify-between">
                  <span className="text-slate-400">Affected Population</span>
                  <span className="font-mono font-bold text-white">{selectedFeature.properties.affectedPopulation}</span>
                </div>
              )}

              {selectedFeature.properties?.damagedBuildings && (
                <div className="p-2 rounded bg-slate-900 border border-slate-800 flex justify-between">
                  <span className="text-slate-400">Damaged Structures</span>
                  <span className="font-mono font-bold text-white">{selectedFeature.properties.damagedBuildings}</span>
                </div>
              )}

              {selectedFeature.properties?.status && (
                <div className="p-2 rounded bg-slate-900 border border-slate-800 flex justify-between">
                  <span className="text-slate-400">Operational Status</span>
                  <span className="font-mono font-bold text-cyan-400">{selectedFeature.properties.status}</span>
                </div>
              )}

              {selectedFeature.properties?.totalCapacity && (
                <div className="p-2 rounded bg-slate-900 border border-slate-800 flex justify-between">
                  <span className="text-slate-400">Shelter Capacity</span>
                  <span className="font-mono font-bold text-emerald-400">
                    {selectedFeature.properties.currentOccupancy || 0} / {selectedFeature.properties.totalCapacity}
                  </span>
                </div>
              )}

              {selectedFeature.properties?.description && (
                <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-slate-300 text-[11px] leading-relaxed">
                  {selectedFeature.properties.description}
                </div>
              )}

              {selectedFeature.properties?.recommendedAction && (
                <div className="p-2.5 rounded bg-cyan-950/40 border border-cyan-800/40 text-cyan-300 text-[11px]">
                  <strong>Recommended Action:</strong> {selectedFeature.properties.recommendedAction}
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex flex-col space-y-2">
            <Link
              to="/routing"
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs py-2.5 rounded-lg flex items-center justify-center space-x-2 shadow-lg shadow-cyan-600/20"
            >
              <Navigation className="w-4 h-4" />
              <span>Route Emergency Convoys Here</span>
            </Link>

            <Link
              to="/priorities"
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs py-2 rounded-lg text-center"
            >
              Inspect Zone Priority Breakdown
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
