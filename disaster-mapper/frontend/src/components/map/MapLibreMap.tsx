import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as maplibregl from 'maplibre-gl';
type MapInstance = maplibregl.Map;

// Configure MapLibre Web Worker for Vite
if (typeof window !== 'undefined' && maplibregl.setWorkerUrl) {
  maplibregl.setWorkerUrl('/maplibre-gl-worker.mjs');
}

import {
  Layers,
  ZoomIn,
  ZoomOut,
  Compass,
  Boxes,
  Maximize2,
  Minimize2,
  Eye,
  EyeOff,
  Flame,
  Activity,
  Droplets,
  Wind,
  ShieldCheck,
  AlertTriangle,
  Globe,
  RotateCw,
  Mountain,
  MapPin,
  Building2,
  Sliders,
  ChevronDown,
  Navigation,
  ExternalLink,
  X,
  Radio,
  Check
} from 'lucide-react';
import { useDisasterStore } from '../../store/useDisasterStore';
import { DEFAULT_DELHI_GEOJSON } from '../../data/delhiGeoJson';
import { getGeoJsonForDisaster } from '../../data/multiDisasterGeoJson';
import { getLocalitiesForDisaster, LocalityFocus, LOCALITIES_DATABASE } from '../../data/localityData';

interface MapProps {
  center?: [number, number]; // [lng, lat]
  zoom?: number;
  pitch?: number;
  bearing?: number;
  geoJsonData?: any;
  routeData?: any;
  onFeatureClick?: (feature: any) => void;
  height?: string;
  showLayerControls?: boolean;
}

export const MapLibreMap: React.FC<MapProps> = ({
  center,
  zoom = 12.5,
  pitch,
  bearing,
  geoJsonData,
  routeData,
  onFeatureClick,
  height = '100%',
  showLayerControls = true
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapInstance | null>(null);
  const [layersOpen, setLayersOpen] = useState(false);
  const [isOrbiting, setIsOrbiting] = useState(false);
  const [terrain3D, setTerrain3D] = useState(true);
  const [isDemActive, setIsDemActive] = useState<boolean>(true);
  const [localityDropdownOpen, setLocalityDropdownOpen] = useState(false);
  const [activeLocality, setActiveLocality] = useState<LocalityFocus | null>(null);
  const [selectedZone, setSelectedZone] = useState<any | null>(null);
  const selectedZoneIdRef = useRef<string | null>(null);

  const {
    selectedDisaster,
    layerVisibility,
    toggleLayer,
    mapStyle,
    setMapStyle,
    is3DTilt,
    toggle3DTilt,
    hazardOpacity,
    setHazardOpacity,
    is3DPriorityColumns,
    toggle3DPriorityColumns,
    selectedLocalityId,
    setSelectedLocalityId
  } = useDisasterStore();

  // Regional terrain vertical exaggeration: flat plains vs steep mountain relief
  const defaultExaggeration = useMemo(() => {
    if (!selectedDisaster) return 1.5;
    if (selectedDisaster.id.includes('assam')) return 1.25; // Real flat Brahmaputra alluvial basin
    if (selectedDisaster.id.includes('jk') || selectedDisaster.id.includes('shimla')) return 1.9; // Steep Himalayan gorges
    return 1.5;
  }, [selectedDisaster?.id]);

  const [terrainExaggeration, setTerrainExaggeration] = useState<number>(defaultExaggeration);

  useEffect(() => {
    setTerrainExaggeration(defaultExaggeration);
    if (mapRef.current && terrain3D && mapRef.current.getSource('terrain-dem')) {
      try {
        mapRef.current.setTerrain({ source: 'terrain-dem', exaggeration: defaultExaggeration });
      } catch {}
    }
  }, [defaultExaggeration]);

  // Default camera angle: 45° Geographic (replaces wasteful 75° horizon)
  const [currentPitch, setCurrentPitch] = useState<number>(pitch !== undefined ? pitch : (is3DTilt ? 45 : 0));
  const [currentBearing, setCurrentBearing] = useState<number>(bearing !== undefined ? bearing : (is3DTilt ? -15 : 0));

  const resolvedCenter: [number, number] = center || (selectedDisaster
    ? [selectedDisaster.centerLongitude, selectedDisaster.centerLatitude]
    : [92.9376, 26.3150]);

  const availableLocalities = useMemo(() => {
    return getLocalitiesForDisaster(selectedDisaster?.id);
  }, [selectedDisaster?.id]);

  const geoJsonDataRef = useRef(geoJsonData);
  const routeDataRef = useRef(routeData);

  useEffect(() => {
    geoJsonDataRef.current = geoJsonData;
  }, [geoJsonData]);

  useEffect(() => {
    routeDataRef.current = routeData;
  }, [routeData]);

  // Cinematic 360° Smooth Orbit Animation Loop (at 45° Geographic tilt)
  useEffect(() => {
    if (!isOrbiting || !mapRef.current) return;
    let animId: number;
    const rotateStep = () => {
      if (mapRef.current) {
        const nextBearing = (mapRef.current.getBearing() + 0.25) % 360;
        mapRef.current.setBearing(nextBearing);
        setCurrentBearing(Math.round(nextBearing));
        animId = requestAnimationFrame(rotateStep);
      }
    };
    animId = requestAnimationFrame(rotateStep);
    return () => cancelAnimationFrame(animId);
  }, [isOrbiting]);

  /**
   * Generates MapLibre basemap style URL.
   * Both 'satellite' and 'streets'/'liberty' use OpenFreeMap Liberty vector cartography
   * as the underlying schema. In 'satellite' mode, the satellite raster is inserted
   * UNDERNEATH all road networks and place labels.
   */
  const getMapStyleUrl = (style: string): string => {
    if (style === 'dark') {
      return 'https://tiles.openfreemap.org/styles/dark';
    }
    // Default: OpenFreeMap Liberty with complete OpenMapTiles vector road/label schema
    return 'https://tiles.openfreemap.org/styles/liberty';
  };

  // Initialize Map Instance
  useEffect(() => {
    if (!mapContainer.current) return;

    const styleUrl = getMapStyleUrl(mapStyle);

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: styleUrl,
      center: resolvedCenter,
      zoom: zoom,
      pitch: currentPitch,
      bearing: currentBearing,
      maxPitch: 68, // Bounded: focuses 90% of screen on ground geography, never empty horizon
      attributionControl: false
    });

    map.addControl(
      new maplibregl.AttributionControl({
        compact: true,
        customAttribution: '&copy; <a href="https://openfreemap.org" target="_blank" rel="noreferrer">OpenFreeMap</a> &copy; Sentinel-2 Cloudless &copy; Esri World Imagery &copy; Mapterhorn DEM'
      }),
      'bottom-right'
    );

    mapRef.current = map;
    (window as any).__maplibreInstance = map;
    (window as any).__geoJsonData = geoJsonData;

    map.on('load', () => {
      // 1. Digital Elevation Model (DEM) for 3D Topography (Mapterhorn Free Open Terrain)
      try {
        if (!map.getSource('terrain-dem')) {
          map.addSource('terrain-dem', {
            type: 'raster-dem',
            tiles: [
              'https://tiles.mapterhorn.com/{z}/{x}/{y}.webp',
              'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'
            ],
            encoding: 'terrarium',
            tileSize: 512,
            maxzoom: 14
          });
        }
        if (terrain3D) {
          map.setTerrain({ source: 'terrain-dem', exaggeration: terrainExaggeration });
          setIsDemActive(true);
        }
      } catch (demErr) {
        console.warn('Terrain DEM initialization fallback:', demErr);
      }

      // 2. High-Resolution Public Satellite Imagery Raster Base
      try {
        if (!map.getSource('satellite-tiles')) {
          map.addSource('satellite-tiles', {
            type: 'raster',
            tiles: [
              'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
              'https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2020_3857/default/g/{z}/{y}/{x}.jpg'
            ],
            tileSize: 256,
            maxzoom: 19,
            attribution: '&copy; Sentinel-2 Cloudless / Copernicus, &copy; Esri World Imagery'
          });
        }

        // Insert satellite-base underneath transportation and labels
        const layers = map.getStyle().layers || [];
        const firstTransLayer = layers.find(
          (l) => l.id === 'tunnel_motorway_link_casing' || (l as any)['source-layer'] === 'transportation'
        )?.id;

        if (!map.getLayer('satellite-base')) {
          map.addLayer(
            {
              id: 'satellite-base',
              type: 'raster',
              source: 'satellite-tiles',
              minzoom: 0,
              maxzoom: 19,
              layout: {
                visibility: mapStyle === 'satellite' ? 'visible' : 'none'
              },
              paint: {
                'raster-opacity': 1.0,
                'raster-fade-duration': 120
              }
            },
            firstTransLayer
          );
        }
      } catch (satErr) {
        console.warn('Satellite hybrid layer init:', satErr);
      }

      // 3. Optimize Label Halos for High Contrast over Satellite Imagery & Streets
      try {
        const roadAndPlaceLayers = [
          'label_village',
          'label_town',
          'label_city',
          'label_city_capital',
          'label_other',
          'label_state',
          'road_label',
          'road_label_major',
          'highway-name-path',
          'highway-name-minor',
          'highway-name-major',
          'highway-name-motorway',
          'waterway_line_label'
        ];
        roadAndPlaceLayers.forEach((id) => {
          if (map.getLayer(id)) {
            map.setPaintProperty(id, 'text-halo-width', mapStyle === 'satellite' ? 2.5 : 1.6);
            map.setPaintProperty(id, 'text-halo-blur', 0.4);
            map.setPaintProperty(id, 'text-halo-color', mapStyle === 'satellite' ? '#000000' : '#FFFFFF');
          }
        });
      } catch {}

      // 4. Configure 3D Buildings with True Height Metadata
      try {
        if (map.getLayer('building-3d')) {
          map.setPaintProperty('building-3d', 'fill-extrusion-opacity', layerVisibility.buildings3D ? 0.8 : 0);
          map.setPaintProperty('building-3d', 'fill-extrusion-color', mapStyle === 'satellite' ? '#94A3B8' : '#CBD5E1');
          map.setPaintProperty('building-3d', 'fill-extrusion-height', [
            'coalesce',
            ['get', 'render_height'],
            ['get', 'height'],
            ['*', ['to-number', ['get', 'levels'], 1], 3.2],
            7.5
          ]);
          map.setPaintProperty('building-3d', 'fill-extrusion-base', [
            'coalesce',
            ['get', 'render_min_height'],
            ['get', 'min_height'],
            0
          ]);
        }
      } catch {}

      // 5. Subtle Natural Sky Horizon
      try {
        if (typeof (map as any).setSky === 'function') {
          (map as any).setSky({
            'sky-color': '#0F172A',
            'sky-horizon-blend': 0.8,
            'horizon-color': '#38BDF8',
            'horizon-fog-blend': 0.5,
            'fog-color': '#0B1120',
            'fog-ground-blend': 0.2
          });
        }
      } catch {}

      const activeData = geoJsonDataRef.current || (selectedDisaster ? getGeoJsonForDisaster(selectedDisaster.id) : DEFAULT_DELHI_GEOJSON);
      setupMapLayers(map, activeData, routeDataRef.current);
    });

    map.on('pitch', () => {
      if (mapRef.current) setCurrentPitch(Math.round(mapRef.current.getPitch()));
    });

    map.on('rotate', () => {
      if (mapRef.current) setCurrentBearing(Math.round(mapRef.current.getBearing()));
    });

    map.on('error', (e) => {
      if (e.error && (e.error as any).status === 404) {
        // Normal tile boundary edge
      }
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [mapStyle === 'dark' ? 'dark' : 'vector_base']);

  // Handle Instant Switching between Satellite 3D and Streets 3D (No WebGL reload!)
  useEffect(() => {
    if (!mapRef.current || !mapRef.current.isStyleLoaded()) return;

    if (mapRef.current.getLayer('satellite-base')) {
      const isSatellite = mapStyle === 'satellite';
      mapRef.current.setLayoutProperty('satellite-base', 'visibility', isSatellite ? 'visible' : 'none');

      // Adjust label halo and building colors dynamically
      const placeLabelLayers = [
        'label_village',
        'label_town',
        'label_city',
        'label_city_capital',
        'label_other',
        'label_state',
        'road_label',
        'road_label_major'
      ];
      placeLabelLayers.forEach((id) => {
        if (mapRef.current?.getLayer(id)) {
          mapRef.current.setPaintProperty(id, 'text-halo-width', isSatellite ? 2.2 : 1.2);
          mapRef.current.setPaintProperty(id, 'text-halo-blur', isSatellite ? 0.5 : 0.2);
        }
      });

      if (mapRef.current.getLayer('building-3d')) {
        mapRef.current.setPaintProperty('building-3d', 'fill-extrusion-color', isSatellite ? '#94A3B8' : '#CBD5E1');
      }
    }
  }, [mapStyle]);

  // Update center and camera when active disaster changes
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: resolvedCenter,
        zoom: zoom,
        pitch: is3DTilt ? 45 : 0,
        bearing: is3DTilt ? -15 : 0,
        speed: 1.1,
        curve: 1.4,
        essential: true
      });
      setActiveLocality(null);
    }
  }, [resolvedCenter[0], resolvedCenter[1], zoom, is3DTilt]);

  // Handle 3D Tilt toggle
  useEffect(() => {
    if (mapRef.current) {
      const targetPitch = is3DTilt ? 45 : 0;
      const targetBearing = is3DTilt ? -15 : 0;
      mapRef.current.easeTo({
        pitch: targetPitch,
        bearing: targetBearing,
        duration: 800
      });
      setCurrentPitch(targetPitch);
      setCurrentBearing(targetBearing);
    }
  }, [is3DTilt]);

  // Update layers when geoJsonData, routeData, layerVisibility, or hazardOpacity change
  useEffect(() => {
    if (mapRef.current && mapRef.current.isStyleLoaded()) {
      const activeData = geoJsonData || (selectedDisaster ? getGeoJsonForDisaster(selectedDisaster.id) : DEFAULT_DELHI_GEOJSON);
      setupMapLayers(mapRef.current, activeData, routeData);
    }
  }, [geoJsonData, routeData, layerVisibility, hazardOpacity, is3DPriorityColumns, selectedDisaster?.id]);

  const setupMapLayers = (map: MapInstance, data: any, route: any) => {
    const finalData = data && data.features && data.features.length > 0
      ? data
      : (selectedDisaster ? getGeoJsonForDisaster(selectedDisaster.id) : DEFAULT_DELHI_GEOJSON);

    // 1. Disaster Intelligence Features Source
    if (map.getSource('disaster-features')) {
      (map.getSource('disaster-features') as any).setData(finalData);
    } else {
      map.addSource('disaster-features', {
        type: 'geojson',
        data: finalData
      });
    }

    // 2. Emergency Route Source
    const routeGeo = route?.geometry || { type: 'LineString', coordinates: [] };
    if (map.getSource('emergency-route')) {
      (map.getSource('emergency-route') as any).setData(routeGeo);
    } else {
      map.addSource('emergency-route', {
        type: 'geojson',
        data: routeGeo
      });
    }

    // 3. Locality Focus Markers Source (for Street-Level Inspection)
    const localityFeatures = {
      type: 'FeatureCollection',
      features: availableLocalities.map((loc) => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: loc.coordinates
        },
        properties: {
          ...loc,
          entity: 'LOCALITY_FOCUS_POINT'
        }
      }))
    };

    if (map.getSource('locality-targets')) {
      (map.getSource('locality-targets') as any).setData(localityFeatures);
    } else {
      map.addSource('locality-targets', {
        type: 'geojson',
        data: localityFeatures
      });
    }

    // --- 3D Building Extrusions (Controlled by layerVisibility.buildings3D) ---
    if (map.getLayer('building-3d')) {
      map.setPaintProperty('building-3d', 'fill-extrusion-opacity', layerVisibility.buildings3D ? 0.82 : 0);
    } else if (map.getSource('openmaptiles') && !map.getLayer('3d-buildings')) {
      try {
        map.addLayer({
          id: '3d-buildings',
          source: 'openmaptiles',
          'source-layer': 'building',
          type: 'fill-extrusion',
          minzoom: 13,
          paint: {
            'fill-extrusion-color': mapStyle === 'satellite' ? '#94A3B8' : '#CBD5E1',
            'fill-extrusion-height': ['coalesce', ['get', 'render_height'], ['get', 'height'], 7.5],
            'fill-extrusion-base': ['coalesce', ['get', 'render_min_height'], 0],
            'fill-extrusion-opacity': layerVisibility.buildings3D ? 0.8 : 0
          }
        });
      } catch {}
    }

    // Identify layer before which hazard and priority fills must be inserted
    // to guarantee all roads, bridges, 3D buildings, and labels render cleanly ON TOP.
    const styleLayers = map.getStyle().layers || [];
    const firstTransLayer = styleLayers.find(
      (l) => l.id === 'tunnel_motorway_link_casing' || (l as any)['source-layer'] === 'transportation' || l.id.includes('road') || l.id.includes('highway')
    )?.id;
    const firstSymbolLayer = styleLayers.find((l) => l.type === 'symbol')?.id;
    const fillInsertionBeforeId = firstTransLayer || firstSymbolLayer;

    // --- Translucent Flood Inundation & Hazard Footprint ---
    const floodFillOpacity = layerVisibility.floodZones ? Math.max(0.12, 0.28 * hazardOpacity) : 0;
    const floodStrokeOpacity = layerVisibility.floodZones ? 0.95 : 0;

    if (!map.getLayer('flood-fill')) {
      map.addLayer(
        {
          id: 'flood-fill',
          type: 'fill',
          source: 'disaster-features',
          filter: [
            'any',
            ['==', ['get', 'entity'], 'FLOOD_ZONE'],
            ['==', ['get', 'type'], 'FLOODED_AREA'],
            ['==', ['get', 'type'], 'STORM_SURGE_INUNDATION'],
            ['==', ['get', 'entity'], 'FORECAST_FLOOD_ZONE']
          ],
          paint: {
            'fill-color': [
              'case',
              ['==', ['get', 'riskLevel'], 'CRITICAL'], '#0891B2',
              ['==', ['get', 'riskLevel'], 'HIGH'], '#0284C7',
              ['==', ['get', 'severity'], 'CRITICAL'], '#06B6D4',
              '#22D3EE'
            ],
            'fill-opacity': floodFillOpacity
          }
        },
        fillInsertionBeforeId
      );

      map.addLayer(
        {
          id: 'flood-stroke',
          type: 'line',
          source: 'disaster-features',
          filter: [
            'any',
            ['==', ['get', 'entity'], 'FLOOD_ZONE'],
            ['==', ['get', 'type'], 'FLOODED_AREA'],
            ['==', ['get', 'type'], 'STORM_SURGE_INUNDATION'],
            ['==', ['get', 'entity'], 'FORECAST_FLOOD_ZONE']
          ],
          paint: {
            'line-color': '#38BDF8',
            'line-width': 2.0,
            'line-opacity': floodStrokeOpacity
          }
        },
        firstSymbolLayer
      );
    } else {
      map.setPaintProperty('flood-fill', 'fill-opacity', floodFillOpacity);
      map.setPaintProperty('flood-stroke', 'line-opacity', floodStrokeOpacity);
    }

    // --- Rescue Priority Sectors (RED, ORANGE, GREEN) with Translucent Fill & Outlines ---
    const rescueFillOpacity = layerVisibility.rescueZones ? Math.max(0.14, 0.32 * hazardOpacity) : 0;
    const rescueLineOpacity = layerVisibility.rescueZones ? 0.95 : 0;

    if (!map.getLayer('rescue-zones-fill')) {
      map.addLayer(
        {
          id: 'rescue-zones-fill',
          type: 'fill',
          source: 'disaster-features',
          filter: ['==', ['get', 'entity'], 'RESCUE_ZONE'],
          paint: {
            'fill-color': [
              'match',
              ['get', 'priority'],
              'RED', '#DC2626',
              'ORANGE', '#D97706',
              'GREEN', '#059669',
              '#DC2626'
            ],
            'fill-opacity': rescueFillOpacity
          }
        },
        fillInsertionBeforeId
      );

      map.addLayer(
        {
          id: 'rescue-zones-line',
          type: 'line',
          source: 'disaster-features',
          filter: ['==', ['get', 'entity'], 'RESCUE_ZONE'],
          paint: {
            'line-color': [
              'match',
              ['get', 'priority'],
              'RED', '#EF4444',
              'ORANGE', '#F59E0B',
              'GREEN', '#10B981',
              '#EF4444'
            ],
            'line-width': 2.8,
            'line-opacity': rescueLineOpacity
          }
        },
        firstSymbolLayer
      );

      // Selected Zone Glow Highlight Layer (Cyan #00F2FE)
      map.addLayer(
        {
          id: 'rescue-zones-selected',
          type: 'line',
          source: 'disaster-features',
          filter: [
            'all',
            ['==', ['get', 'entity'], 'RESCUE_ZONE'],
            ['==', ['get', 'id'], selectedZoneIdRef.current || 'none']
          ],
          paint: {
            'line-color': '#00F2FE',
            'line-width': 4.5,
            'line-blur': 1.0,
            'line-opacity': 1.0
          }
        },
        firstSymbolLayer
      );
    } else {
      map.setPaintProperty('rescue-zones-fill', 'fill-opacity', rescueFillOpacity);
      map.setPaintProperty('rescue-zones-line', 'line-opacity', rescueLineOpacity);
    }

    // --- Optional 3D Priority Extrusion Columns (Gentle 120m/70m heights, toggleable) ---
    const extrusionOpacity = (layerVisibility.rescueZones && is3DPriorityColumns)
      ? Math.max(0.05, 0.20 * hazardOpacity)
      : 0;

    if (!map.getLayer('rescue-zones-3d-extrusion')) {
      try {
        map.addLayer({
          id: 'rescue-zones-3d-extrusion',
          type: 'fill-extrusion',
          source: 'disaster-features',
          filter: ['==', ['get', 'entity'], 'RESCUE_ZONE'],
          paint: {
            'fill-extrusion-color': [
              'match',
              ['get', 'priority'],
              'RED', '#DC2626',
              'ORANGE', '#D97706',
              'GREEN', '#059669',
              '#DC2626'
            ],
            'fill-extrusion-height': [
              'match',
              ['get', 'priority'],
              'RED', 120,
              'ORANGE', 70,
              'GREEN', 35,
              50
            ],
            'fill-extrusion-base': 0,
            'fill-extrusion-opacity': extrusionOpacity
          }
        });
      } catch (err) {}
    } else {
      map.setPaintProperty('rescue-zones-3d-extrusion', 'fill-extrusion-opacity', extrusionOpacity);
    }

    // --- Transport Corridors & Road Telemetry ---
    if (!map.getLayer('roads-line')) {
      map.addLayer({
        id: 'roads-line',
        type: 'line',
        source: 'disaster-features',
        filter: ['==', ['get', 'entity'], 'ROAD_SEGMENT'],
        paint: {
          'line-color': [
            'match',
            ['get', 'status'],
            'BLOCKED', '#EF4444',
            'PARTIALLY_BLOCKED', '#F97316',
            'DAMAGED', '#F59E0B',
            'USABLE', '#10B981',
            '#94A3B8'
          ],
          'line-width': [
            'match',
            ['get', 'status'],
            'BLOCKED', 5,
            'PARTIALLY_BLOCKED', 4,
            3
          ],
          'line-opacity': layerVisibility.blockedRoads ? 0.95 : 0
        }
      });
    } else {
      map.setPaintProperty('roads-line', 'line-opacity', layerVisibility.blockedRoads ? 0.95 : 0);
    }

    // --- Emergency Route Corridor ---
    if (!map.getLayer('emergency-route-casing')) {
      map.addLayer({
        id: 'emergency-route-casing',
        type: 'line',
        source: 'emergency-route',
        paint: {
          'line-color': '#0284C7',
          'line-width': 7,
          'line-opacity': layerVisibility.routes ? 0.85 : 0
        }
      });

      map.addLayer({
        id: 'emergency-route-line',
        type: 'line',
        source: 'emergency-route',
        paint: {
          'line-color': '#00F2FE',
          'line-width': 4,
          'line-opacity': layerVisibility.routes ? 1.0 : 0
        }
      });
    } else {
      map.setPaintProperty('emergency-route-casing', 'line-opacity', layerVisibility.routes ? 0.85 : 0);
      map.setPaintProperty('emergency-route-line', 'line-opacity', layerVisibility.routes ? 1.0 : 0);
    }

    // --- Critical Facilities (Hospitals, Water, Power) ---
    if (!map.getLayer('facility-markers')) {
      map.addLayer({
        id: 'facility-markers',
        type: 'circle',
        source: 'disaster-features',
        filter: ['==', ['get', 'entity'], 'CRITICAL_FACILITY'],
        paint: {
          'circle-radius': 8.5,
          'circle-color': [
            'match',
            ['get', 'type'],
            'HOSPITAL', '#EC4899',
            'WATER_PLANT', '#06B6D4',
            'POWER_SUBSTATION', '#A855F7',
            '#EC4899'
          ],
          'circle-stroke-width': 2.5,
          'circle-stroke-color': '#FFFFFF',
          'circle-opacity': layerVisibility.criticalFacilities ? 0.95 : 0,
          'circle-stroke-opacity': layerVisibility.criticalFacilities ? 1 : 0
        }
      });
    } else {
      map.setPaintProperty('facility-markers', 'circle-opacity', layerVisibility.criticalFacilities ? 0.95 : 0);
      map.setPaintProperty('facility-markers', 'circle-stroke-opacity', layerVisibility.criticalFacilities ? 1 : 0);
    }

    // --- Safe Emergency Shelters ---
    if (!map.getLayer('shelter-markers')) {
      map.addLayer({
        id: 'shelter-markers',
        type: 'circle',
        source: 'disaster-features',
        filter: ['==', ['get', 'entity'], 'SHELTER'],
        paint: {
          'circle-radius': 8,
          'circle-color': '#3B82F6',
          'circle-stroke-width': 2.5,
          'circle-stroke-color': '#FFFFFF',
          'circle-opacity': layerVisibility.shelters ? 0.95 : 0,
          'circle-stroke-opacity': layerVisibility.shelters ? 1 : 0
        }
      });
    } else {
      map.setPaintProperty('shelter-markers', 'circle-opacity', layerVisibility.shelters ? 0.95 : 0);
      map.setPaintProperty('shelter-markers', 'circle-stroke-opacity', layerVisibility.shelters ? 1 : 0);
    }

    // Click inspection listeners
    const interactiveLayers = [
      'rescue-zones-fill',
      'roads-line',
      'shelter-markers',
      'facility-markers',
      'flood-fill'
    ];

    interactiveLayers.forEach((layerId) => {
      map.off('click', layerId, handleFeatureClick);
      map.on('click', layerId, handleFeatureClick);

      map.on('mouseenter', layerId, () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', layerId, () => {
        map.getCanvas().style.cursor = '';
      });
    });
  };

  const selectZoneHelper = (props: any) => {
    setSelectedZone(props);
    selectedZoneIdRef.current = props?.id;
    if (mapRef.current && mapRef.current.getLayer('rescue-zones-selected')) {
      mapRef.current.setFilter('rescue-zones-selected', [
        'all',
        ['==', ['get', 'entity'], 'RESCUE_ZONE'],
        ['==', ['get', 'id'], props?.id]
      ]);
    }
  };

  useEffect(() => {
    (window as any).__selectRescueZone = selectZoneHelper;
  }, []);

  const handleFeatureClick = (e: any) => {
    if (!e.features || e.features.length === 0) return;
    const feat = e.features[0];
    const props = feat.properties;

    // Check if clicked feature is a rescue priority zone
    if (props.entity === 'RESCUE_ZONE' || props.type === 'rescue_zone') {
      selectZoneHelper(props);
    }

    let popupHtml = '';

    if (props.entity === 'RESCUE_ZONE') {
      popupHtml = `
        <div class="text-xs p-1">
          <div class="flex items-center justify-between font-bold border-b border-slate-700 pb-1.5 mb-2">
            <span class="text-white">${props.name || 'Rescue Zone'}</span>
            <span class="px-1.5 py-0.5 rounded text-[10px] font-black ${
              props.priority === 'RED' ? 'bg-red-500/20 text-red-400' : props.priority === 'ORANGE' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
            }">${props.priority} PRIORITY (${props.priorityScore || 85}/100)</span>
          </div>
          <div class="space-y-1 text-slate-300">
            <div><strong>Affected Population:</strong> ${(props.affectedPopulation || 2500).toLocaleString()}</div>
            ${props.trappedCasualtiesEstimate ? `<div><strong>Trapped / Critical Casualties:</strong> <span class="text-red-400 font-bold">${props.trappedCasualtiesEstimate}</span></div>` : ''}
            <div><strong>Damaged Structures:</strong> ${props.damagedBuildings || 12}</div>
            <div><strong>Blocked Corridors:</strong> ${props.blockedRoads || 3}</div>
          </div>
          ${props.resourceNeeds ? `
            <div class="mt-2 text-[11px] bg-red-950/40 p-1.5 rounded border border-red-800/40 text-red-200">
              <strong>Required Deployment:</strong> ${props.resourceNeeds}
            </div>
          ` : ''}
          <div class="mt-2 text-[11px] text-cyan-300 bg-cyan-950/40 p-2 rounded border border-cyan-800/40">
            ${props.recommendedAction || 'Immediate tactical deployment recommended.'}
          </div>
        </div>
      `;
    } else if (props.entity === 'ROAD_SEGMENT') {
      popupHtml = `
        <div class="text-xs p-1">
          <div class="font-bold text-white mb-1.5">${props.name || 'Road Corridor'}</div>
          <div class="space-y-1 text-slate-300">
            <div>Status: <span class="font-bold ${props.status === 'BLOCKED' ? 'text-red-400' : 'text-emerald-400'}">${props.status}</span></div>
            <div>Road Class: <span class="font-mono text-cyan-400">${props.type || 'ARTERIAL'}</span></div>
            <div>Accessibility: <span class="font-bold text-amber-400">${props.accessibilityScore || 0}/100</span></div>
            ${props.description ? `<div class="mt-1 text-[11px] text-slate-400">${props.description}</div>` : ''}
          </div>
        </div>
      `;
    } else if (props.entity === 'CRITICAL_FACILITY') {
      popupHtml = `
        <div class="text-xs p-1">
          <div class="font-bold text-white mb-1">${props.name || 'Critical Facility'}</div>
          <div class="text-slate-300 space-y-1">
            <div>Type: <span class="font-mono text-pink-400 font-bold">${props.type || 'HOSPITAL'}</span></div>
            <div>Status: <span class="font-semibold text-emerald-400">${props.status || 'OPERATIONAL'}</span></div>
            <div>Structural Integrity: <strong class="text-amber-400">${props.damageLevel || 'MODERATE'}</strong></div>
            ${props.description ? `<div class="mt-1.5 text-[11px] text-slate-400">${props.description}</div>` : ''}
          </div>
        </div>
      `;
    } else if (props.entity === 'SHELTER') {
      popupHtml = `
        <div class="text-xs p-1">
          <div class="font-bold text-white mb-1">${props.name || 'Safe Evacuation Facility'}</div>
          <div class="text-slate-300 space-y-1">
            <div>Status: <span class="font-semibold text-emerald-400">${props.status || 'ACTIVE'}</span></div>
            <div>Occupancy: <strong class="text-white">${props.currentOccupancy || 0}</strong> / ${props.totalCapacity || 1000}</div>
            <div>Medical Support: <span class="font-semibold ${props.hasMedicalFacilities ? 'text-emerald-400' : 'text-slate-400'}">${props.hasMedicalFacilities ? 'EQUIPPED' : 'BASIC'}</span></div>
          </div>
        </div>
      `;
    } else {
      popupHtml = `
        <div class="text-xs p-1">
          <div class="font-bold text-white mb-1">${props.name || 'Hazard Footprint'}</div>
          <div class="text-slate-300 space-y-1">
            <div>Severity: <span class="font-bold text-cyan-400">${props.severity || props.riskLevel || 'HIGH'}</span></div>
            ${props.estimatedArea ? `<div>Area: <span class="font-bold text-white">${props.estimatedArea} km²</span></div>` : ''}
            ${props.waterLevel ? `<div>Water Mark: <span class="font-mono text-cyan-300">${props.waterLevel}</span></div>` : ''}
          </div>
        </div>
      `;
    }

    new maplibregl.Popup({ closeButton: true, maxWidth: '340px' })
      .setLngLat(e.lngLat)
      .setHTML(popupHtml)
      .addTo(mapRef.current!);

    if (onFeatureClick) onFeatureClick(feat);
  };

  const handleCloseZoneInspector = () => {
    setSelectedZone(null);
    selectedZoneIdRef.current = null;
    if (mapRef.current && mapRef.current.getLayer('rescue-zones-selected')) {
      mapRef.current.setFilter('rescue-zones-selected', [
        'all',
        ['==', ['get', 'entity'], 'RESCUE_ZONE'],
        ['==', ['get', 'id'], 'none']
      ]);
    }
  };

  // Locality Focus Handler (Street-Level Inspection Workflow)
  const handleFocusLocality = (locality: LocalityFocus) => {
    setActiveLocality(locality);
    setSelectedLocalityId(locality.id);
    setLocalityDropdownOpen(false);

    if (mapRef.current) {
      mapRef.current.flyTo({
        center: locality.coordinates,
        zoom: locality.zoom,
        pitch: locality.pitch,
        bearing: locality.bearing,
        speed: 1.15,
        curve: 1.4,
        essential: true
      });
      setCurrentPitch(locality.pitch);
      setCurrentBearing(locality.bearing);
    }
  };

  const handleSetPerspective = (targetPitch: number, targetBearing?: number) => {
    if (mapRef.current) {
      mapRef.current.easeTo({
        pitch: targetPitch,
        bearing: targetBearing !== undefined ? targetBearing : (targetPitch > 0 ? -15 : 0),
        duration: 750
      });
      setCurrentPitch(targetPitch);
      if (targetBearing !== undefined) setCurrentBearing(targetBearing);
    }
  };

  const handleToggleTerrain = () => {
    if (!mapRef.current) return;
    if (terrain3D) {
      try {
        (mapRef.current as any).setTerrain(null);
      } catch {}
      setTerrain3D(false);
      setIsDemActive(false);
    } else {
      try {
        if (!mapRef.current.getSource('terrain-dem')) {
          mapRef.current.addSource('terrain-dem', {
            type: 'raster-dem',
            tiles: [
              'https://tiles.mapterhorn.com/{z}/{x}/{y}.webp',
              'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'
            ],
            encoding: 'terrarium',
            tileSize: 512,
            maxzoom: 14
          });
        }
        mapRef.current.setTerrain({ source: 'terrain-dem', exaggeration: terrainExaggeration });
        setIsDemActive(true);
      } catch (e) {}
      setTerrain3D(true);
    }
  };

  const handleSetExaggeration = (val: number) => {
    setTerrainExaggeration(val);
    if (mapRef.current && terrain3D) {
      try {
        mapRef.current.setTerrain({ source: 'terrain-dem', exaggeration: val });
        setIsDemActive(true);
      } catch (e) {
        console.warn('Set exaggeration failed:', e);
      }
    }
  };

  const handleResetCamera = () => {
    setActiveLocality(null);
    setSelectedLocalityId(null);
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: resolvedCenter,
        zoom: zoom,
        pitch: is3DTilt ? 45 : 0,
        bearing: is3DTilt ? -15 : 0,
        speed: 1.2,
        duration: 850
      });
    }
  };

  return (
    <div className="relative w-full overflow-hidden map-3d-frame" style={{ height }}>
      {/* Map Container */}
      <div ref={mapContainer} className="w-full h-full" />

      {/* Top Left: 3D Tactical Controls & Street-Level Locality Exploration */}
      <div className="absolute top-4 left-4 z-30 select-none flex flex-wrap items-center gap-1.5 bg-[#0B1120]/95 backdrop-blur-md border border-slate-800 p-1.5 rounded-xl shadow-2xl">
        {/* Mode A: Satellite 3D vs Mode B: Streets 3D */}
        <div className="flex items-center space-x-1 border-r border-slate-800 pr-2 mr-1">
          <button
            onClick={() => setMapStyle('satellite')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center space-x-1 ${
              mapStyle === 'satellite'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/25'
                : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
            title="Mode A: Photorealistic Satellite 3D with Crisp Vector Roads & Village Labels"
          >
            <Globe className="w-3 h-3" />
            <span>Satellite 3D</span>
          </button>

          <button
            onClick={() => setMapStyle('streets')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center space-x-1 ${
              mapStyle === 'streets' || mapStyle === 'liberty'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/25'
                : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
            title="Mode B: OpenFreeMap Liberty Vector Cartography with Detailed Streets & Bridges"
          >
            <Navigation className="w-3 h-3" />
            <span>Streets 3D</span>
          </button>
        </div>

        {/* Priority 4: Camera Presets (Replaces wasteful 75° horizon with 45°/56°) */}
        <div className="flex items-center space-x-1 border-r border-slate-800 pr-1.5 mr-1">
          {[
            { label: '2D Ortho', pitch: 0, title: 'Top-down Nadir (0°)' },
            { label: '3D Geo (45°)', pitch: 45, title: 'Geographic Terrain & Road Visibility (45°)' },
            { label: '3D Tactical (56°)', pitch: 56, title: 'Infrastructure & Hazard Inspection (56°)' }
          ].map((preset) => (
            <button
              key={preset.label}
              onClick={() => handleSetPerspective(preset.pitch)}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                currentPitch === preset.pitch
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
              title={preset.title}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Priority 7: Street-Level Locality Quick Focus Dropdown */}
        {availableLocalities.length > 0 && (
          <div className="relative border-r border-slate-800 pr-2 mr-1">
            <button
              onClick={() => setLocalityDropdownOpen(!localityDropdownOpen)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center space-x-1.5 transition-all ${
                activeLocality
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25'
                  : 'bg-slate-900/80 text-slate-300 hover:text-cyan-300 hover:bg-slate-800'
              }`}
              title="Explore Specific Street-Level Breach Points, Hospitals & Villages"
            >
              <MapPin className="w-3 h-3 text-red-400" />
              <span className="max-w-[130px] truncate">
                {activeLocality ? activeLocality.name.split(' ')[0] : 'Focus Locality'}
              </span>
              <ChevronDown className="w-3 h-3 opacity-70" />
            </button>

            {localityDropdownOpen && (
              <div className="absolute left-0 mt-2 w-72 bg-[#0B1120]/98 border border-slate-700 rounded-xl shadow-2xl p-2 z-50 text-xs">
                <div className="px-2 py-1 text-[10px] font-mono text-cyan-400 uppercase tracking-wider border-b border-slate-800 mb-1 flex items-center justify-between">
                  <span>Street-Level GIS Focal Points</span>
                  <span className="text-slate-400">{availableLocalities.length} Verified</span>
                </div>
                <div className="max-h-60 overflow-y-auto space-y-1">
                  {availableLocalities.map((loc) => (
                    <button
                      key={loc.id}
                      onClick={() => handleFocusLocality(loc)}
                      className={`w-full text-left p-1.5 rounded-lg text-[11px] transition-all flex flex-col ${
                        activeLocality?.id === loc.id
                          ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/40'
                          : 'hover:bg-slate-800/80 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white truncate max-w-[180px]">{loc.name}</span>
                        <span
                          className={`text-[9px] px-1 py-0.2 rounded font-black ${
                            loc.severity === 'CRITICAL'
                              ? 'bg-red-500/20 text-red-400'
                              : loc.severity === 'HIGH'
                              ? 'bg-amber-500/20 text-amber-400'
                              : 'bg-cyan-500/20 text-cyan-400'
                          }`}
                        >
                          {loc.severity}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 truncate">{loc.facilities || loc.description}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 360° Cinematic Orbit */}
        <button
          onClick={() => setIsOrbiting(!isOrbiting)}
          className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center space-x-1.5 transition-all ${
            isOrbiting
              ? 'bg-red-500 text-white animate-pulse shadow-md shadow-red-500/25'
              : 'bg-slate-900/80 text-slate-300 hover:text-cyan-300 hover:bg-slate-800'
          }`}
          title="360° Cinematic Camera Orbit around Active Incident"
        >
          <RotateCw className={`w-3 h-3 ${isOrbiting ? 'animate-spin' : ''}`} />
          <span>{isOrbiting ? 'ORBITING' : '3D ORBIT'}</span>
        </button>

        {/* 3D Terrain DEM Toggle */}
        <button
          onClick={handleToggleTerrain}
          className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center space-x-1 transition-all ${
            terrain3D
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'bg-slate-900/80 text-slate-400 hover:text-slate-200'
          }`}
          title="Toggle Mapterhorn Digital Elevation Model Topography"
        >
          <Mountain className="w-3 h-3 text-amber-400" />
          <span>DEM {terrain3D ? 'ON' : 'OFF'}</span>
        </button>

        {/* Exaggeration Pills */}
        {terrain3D && (
          <div className="flex items-center space-x-1 border-l border-slate-800 pl-1.5 ml-0.5">
            {[1.0, 1.4, 1.9].map((val) => (
              <button
                key={val}
                onClick={() => handleSetExaggeration(val)}
                className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold transition-all ${
                  terrainExaggeration === val
                    ? 'bg-amber-400 text-slate-950 font-black'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white'
                }`}
                title={`Vertical Exaggeration ${val}x`}
              >
                {val}x
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Floating Tactical Layer & Compass Controls (Top Right) */}
      {showLayerControls && (
        <div className="absolute top-4 right-4 flex flex-col space-y-2 z-30 select-none">
          {/* 3D Perspective Toggle Button */}
          <button
            onClick={toggle3DTilt}
            className={`p-2.5 rounded-lg border shadow-xl backdrop-blur-md transition-all flex items-center justify-center ${
              is3DTilt
                ? 'bg-cyan-500/25 border-cyan-400 text-cyan-300 cyan-glow'
                : 'bg-[#0B1120]/90 border-slate-700/80 text-slate-300 hover:text-white'
            }`}
            title={is3DTilt ? 'Switch to Top-Down 2D View' : 'Switch to 3D Oblique View'}
          >
            <Boxes className="w-4 h-4" />
          </button>

          {/* Re-center / Reset Compass */}
          <button
            onClick={handleResetCamera}
            className="bg-[#0B1120]/90 hover:bg-[#1E293B] text-slate-200 border border-slate-700/80 p-2.5 rounded-lg shadow-xl backdrop-blur-md transition-colors"
            title="Re-orient Compass & Center to Incident"
          >
            <Compass
              className="w-4 h-4 text-cyan-400 transition-transform duration-300"
              style={{ transform: `rotate(${-currentBearing}deg)` }}
            />
          </button>

          {/* Layer Controls Drawer Button */}
          <div className="relative">
            <button
              onClick={() => setLayersOpen(!layersOpen)}
              className="bg-[#0B1120]/90 hover:bg-[#1E293B] text-slate-200 border border-slate-700/80 p-2.5 rounded-lg shadow-xl backdrop-blur-md transition-colors"
              title="Toggle GIS Layers & Hazard Transparency"
            >
              <Layers className="w-4 h-4 text-cyan-400" />
            </button>

            {layersOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-[#0B1120]/98 border border-slate-700 rounded-xl shadow-2xl p-4 backdrop-blur-xl text-xs space-y-3.5 z-50">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-bold text-white flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                    <span>3D Tactical GIS Engine</span>
                  </span>
                  <span className="text-[10px] text-cyan-400 font-mono font-bold">MAPTERHORN DEM</span>
                </div>

                {/* Priority 6: Hazard Fill Opacity Slider */}
                <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300 mb-1.5">
                    <span className="flex items-center space-x-1.5">
                      <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Hazard Polygon Transparency</span>
                    </span>
                    <span className="font-mono text-cyan-400">{Math.round(hazardOpacity * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.10"
                    max="1.0"
                    step="0.05"
                    value={hazardOpacity}
                    onChange={(e) => setHazardOpacity(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                  <div className="flex justify-between text-[9px] text-slate-400 mt-1">
                    <span>Street Visibility Focus</span>
                    <span>Default Balanced</span>
                    <span>Vibrant</span>
                  </div>
                </div>

                {/* 3D Priority Pillars Toggle */}
                <label className="flex items-center justify-between bg-slate-900/60 p-2 rounded-lg border border-slate-800 cursor-pointer">
                  <span className="text-[11px] text-slate-300 font-medium">3D Urgency Height Pillars (120m)</span>
                  <input
                    type="checkbox"
                    checked={is3DPriorityColumns}
                    onChange={toggle3DPriorityColumns}
                    className="rounded border-slate-700 bg-slate-800 text-cyan-500 focus:ring-0 cursor-pointer"
                  />
                </label>

                {/* Layer Checkboxes */}
                <div className="space-y-1.5">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold mb-1">Active Intelligence Layers</div>
                  {[
                    { key: 'buildings3D', label: '3D Building Geometry (OSM)', color: '#06B6D4' },
                    { key: 'floodZones', label: 'Translucent Hazard Footprint', color: '#0284C7' },
                    { key: 'rescueZones', label: 'Rescue Priority Sectors (RED/ORG)', color: '#EF4444' },
                    { key: 'blockedRoads', label: 'Transport Corridors & Blockages', color: '#F97316' },
                    { key: 'shelters', label: 'Safe Shelters & Evac Camps', color: '#3B82F6' },
                    { key: 'criticalFacilities', label: 'Hospitals & Utility Plants', color: '#EC4899' },
                    { key: 'routes', label: 'Calculated Evacuation Corridor', color: '#00F2FE' }
                  ].map((layer) => (
                    <label
                      key={layer.key}
                      className="flex items-center justify-between text-slate-300 hover:text-white cursor-pointer py-1"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: layer.color }}></span>
                        <span className="text-[11px]">{layer.label}</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={layerVisibility[layer.key as keyof typeof layerVisibility] ?? true}
                        onChange={() => toggleLayer(layer.key as any)}
                        className="rounded border-slate-700 bg-slate-800 text-cyan-500 focus:ring-0 cursor-pointer"
                      />
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Zoom Buttons */}
          <div className="flex flex-col bg-[#0B1120]/90 border border-slate-700/80 rounded-lg shadow-xl backdrop-blur-md overflow-hidden">
            <button
              onClick={() => mapRef.current?.zoomIn()}
              className="p-2 hover:bg-slate-800 text-slate-300 hover:text-white border-b border-slate-800 transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => mapRef.current?.zoomOut()}
              className="p-2 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Priority 7: Street-Level Locality Telemetry Card (Bottom Right) */}
      {activeLocality && (
        <div className="absolute bottom-6 right-6 max-w-sm w-full bg-[#0B1120]/98 border border-cyan-500/40 rounded-xl p-4 shadow-2xl backdrop-blur-xl z-40 text-xs animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-start justify-between border-b border-slate-800 pb-2 mb-2.5">
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-red-400 animate-ping"></span>
                <span className="font-bold text-white text-sm">{activeLocality.name}</span>
              </div>
              <span className="text-[10px] text-cyan-400 font-mono">
                {activeLocality.category} • [{activeLocality.coordinates[1].toFixed(4)}°N, {activeLocality.coordinates[0].toFixed(4)}°E]
              </span>
            </div>
            <button
              onClick={() => setActiveLocality(null)}
              className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800"
              title="Close inspection"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2 text-slate-300 mb-3">
            <div className="text-[11px] leading-relaxed text-slate-300">
              {activeLocality.description}
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px] bg-slate-900/60 p-2 rounded-lg border border-slate-800">
              <div>
                <span className="text-slate-400 block">Hazard Status:</span>
                <strong className="text-red-400">{activeLocality.hazardStatus}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Exposed Pop:</span>
                <strong className="text-white">{activeLocality.exposedPopulation.toLocaleString()}</strong>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400 block">Road Access:</span>
                <span className="text-amber-300">{activeLocality.roadAccessStatus}</span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400 block">Key Facilities:</span>
                <span className="text-cyan-300">{activeLocality.facilities}</span>
              </div>
            </div>

            <div className="text-[10px] bg-cyan-950/40 border border-cyan-800/40 p-2 rounded text-cyan-200">
              <strong>Action:</strong> {activeLocality.recommendedAction}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                if (mapRef.current) {
                  mapRef.current.flyTo({
                    center: activeLocality.coordinates,
                    zoom: 16.5,
                    pitch: 52,
                    bearing: -20,
                    speed: 1.1
                  });
                }
              }}
              className="flex-1 py-1.5 px-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg text-[10px] transition-colors flex items-center justify-center space-x-1"
            >
              <Building2 className="w-3 h-3" />
              <span>Street Inspection (Zoom 16.5)</span>
            </button>
          </div>
        </div>
      )}

      {/* Interactive GIS Priority Zone Inspector Panel (Requirement 7) */}
      {selectedZone && (() => {
        const zonePriority = (selectedZone.priority || selectedZone.priorityLevel || 'RED').toUpperCase();
        return (
        <div className="absolute top-16 right-4 w-96 max-h-[85vh] bg-[#0B1120]/95 border border-slate-700/80 rounded-2xl shadow-2xl p-4 z-40 backdrop-blur-2xl flex flex-col justify-between overflow-y-auto text-xs text-slate-300">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3">
              <div className="flex items-center space-x-2">
                <span
                  className={`w-3 h-3 rounded-full animate-pulse ${
                    zonePriority === 'RED'
                      ? 'bg-red-500'
                      : zonePriority === 'ORANGE'
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                ></span>
                <span className="font-mono text-[10px] font-black uppercase tracking-wider text-slate-300">
                  GIS PRIORITY ZONE INSPECTOR
                </span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-black font-mono border ${
                    zonePriority === 'RED'
                      ? 'bg-red-500/20 text-red-400 border-red-500/40'
                      : zonePriority === 'ORANGE'
                      ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  }`}
                >
                  {zonePriority} PRIORITY ({selectedZone.priorityScore || 90}/100)
                </span>
                <button
                  onClick={handleCloseZoneInspector}
                  className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors"
                  title="Close Inspector"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Zone Name & Disaster Classification */}
            <div className="mb-3">
              <h3 className="text-base font-bold text-white leading-tight mb-1">
                {selectedZone.name || 'Rescue Priority Sector'}
              </h3>
              <div className="text-[11px] text-cyan-400 font-medium">
                {selectedZone.disasterType || 'Operational Hazard Sector'}
              </div>
              <div className="mt-1 flex items-center space-x-2 text-[10px] text-slate-400">
                <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-300 font-mono">
                  {selectedZone.observedVsSimulated || 'OBSERVED (Sentinel-1 SAR / Field Recon)'}
                </span>
              </div>
            </div>

            {/* Spatial Metrics Grid */}
            <div className="grid grid-cols-2 gap-2 text-[11px] mb-3">
              <div className="bg-slate-900/80 border border-slate-800/80 p-2 rounded-xl">
                <span className="text-slate-400 block text-[10px]">Zone Area:</span>
                <strong className="text-white text-xs">{selectedZone.estimatedAreaKm2 || 14.5} km²</strong>
              </div>
              <div className="bg-slate-900/80 border border-slate-800/80 p-2 rounded-xl">
                <span className="text-slate-400 block text-[10px]">Exposed Population:</span>
                <strong className="text-white text-xs">{(selectedZone.affectedPopulation || 12000).toLocaleString()}</strong>
              </div>
              <div className="bg-slate-900/80 border border-slate-800/80 p-2 rounded-xl">
                <span className="text-slate-400 block text-[10px]">Trapped Casualties:</span>
                <strong className="text-red-400 text-xs">{selectedZone.trappedCasualtiesEstimate || 0}</strong>
              </div>
              <div className="bg-slate-900/80 border border-slate-800/80 p-2 rounded-xl">
                <span className="text-slate-400 block text-[10px]">Damaged Buildings:</span>
                <strong className="text-amber-300 text-xs">{selectedZone.damagedBuildings || 0}</strong>
              </div>
            </div>

            {/* Road Network & Corridors */}
            <div className="bg-slate-900/80 border border-slate-800/80 p-2.5 rounded-xl mb-3 space-y-1.5 text-[11px]">
              <div>
                <span className="text-slate-400 font-bold block text-[10px] uppercase tracking-wider">
                  Affected Road Network:
                </span>
                <span className="text-white font-medium">
                  {selectedZone.affectedRoads || 'Local sector road network severed'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block text-[10px] uppercase tracking-wider">
                  Accessibility Status:
                </span>
                <span className="text-amber-300 font-mono font-bold">
                  {selectedZone.accessibilityStatus || 'RESTRICTED — Tactical Convoy Only'}
                </span>
              </div>
            </div>

            {/* Nearby Support Infrastructure */}
            <div className="bg-slate-900/80 border border-slate-800/80 p-2.5 rounded-xl mb-3 space-y-1.5 text-[11px]">
              <div>
                <span className="text-slate-400 font-bold block text-[10px] uppercase tracking-wider">
                  Nearby Shelters:
                </span>
                <span className="text-emerald-300">
                  {selectedZone.nearbyShelters || 'Designated Regional Evacuation Shelter'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block text-[10px] uppercase tracking-wider">
                  Nearby Hospitals / Facilities:
                </span>
                <span className="text-cyan-300">
                  {selectedZone.nearbyFacilities || 'District Hospital Trauma Hub'}
                </span>
              </div>
            </div>

            {/* "Why This Zone Got This Score" - GIS Spatial Rationale */}
            <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-xl mb-3 space-y-2">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-1">
                <span className="font-bold text-white text-[11px] flex items-center space-x-1">
                  <Activity className="w-3 h-3 text-cyan-400" />
                  <span>Why this zone got this score:</span>
                </span>
                <span className="font-mono text-[10px] text-slate-400">GIS Spatial Rationale</span>
              </div>

              {/* Multi-Factor GIS Sliders */}
              <div className="space-y-1.5 text-[10px]">
                <div>
                  <div className="flex justify-between text-slate-400 mb-0.5">
                    <span>Hazard Core Proximity:</span>
                    <strong className="text-cyan-300">
                      {zonePriority === 'RED' ? '98%' : zonePriority === 'ORANGE' ? '76%' : '24%'}
                    </strong>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        zonePriority === 'RED'
                          ? 'bg-red-500 w-[98%]'
                          : zonePriority === 'ORANGE'
                          ? 'bg-amber-500 w-[76%]'
                          : 'bg-emerald-500 w-[24%]'
                      }`}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-400 mb-0.5">
                    <span>Exposed Population Density:</span>
                    <strong className="text-cyan-300">
                      {zonePriority === 'RED' ? '94%' : zonePriority === 'ORANGE' ? '70%' : '18%'}
                    </strong>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        zonePriority === 'RED'
                          ? 'bg-red-500 w-[94%]'
                          : zonePriority === 'ORANGE'
                          ? 'bg-amber-500 w-[70%]'
                          : 'bg-emerald-500 w-[18%]'
                      }`}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-400 mb-0.5">
                    <span>Road Severance / Isolation:</span>
                    <strong className="text-cyan-300">
                      {zonePriority === 'RED' ? '100%' : zonePriority === 'ORANGE' ? '65%' : '0%'}
                    </strong>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        zonePriority === 'RED'
                          ? 'bg-red-500 w-[100%]'
                          : zonePriority === 'ORANGE'
                          ? 'bg-amber-500 w-[65%]'
                          : 'bg-emerald-500 w-[5%]'
                      }`}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="text-[11px] leading-relaxed text-slate-300 bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                {selectedZone.scoreRationale ||
                  'Zone priority derived from spatial superposition of active hazard core, high exposed population density, and complete arterial severance.'}
              </div>

              {/* Provenance & Timestamp */}
              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/80">
                <span>Source: {selectedZone.dataProvenance || 'State Disaster Management Authority'}</span>
                <span className="font-mono">
                  {selectedZone.timestamp
                    ? new Date(selectedZone.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' IST'
                    : '18:30 IST'}
                </span>
              </div>
            </div>

            {selectedZone.recommendedAction && (
              <div className="p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-800/40 text-cyan-200 text-[11px] mb-3">
                <strong>Recommended Operational Action:</strong> {selectedZone.recommendedAction}
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center space-x-2">
            <button
              onClick={() => {
                window.location.hash = '#/routing';
              }}
              className="flex-1 py-2 px-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg text-xs transition-colors flex items-center justify-center space-x-1.5 shadow-md shadow-cyan-500/20"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Route Convoys to Zone</span>
            </button>
            <button
              onClick={handleCloseZoneInspector}
              className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-lg text-xs transition-colors"
            >
              Close
            </button>
          </div>
        </div>
        );
      })()}

      {/* 3D Telemetry HUD (Bottom Left) */}
      <div className="absolute bottom-6 left-6 bg-[#0B1120]/95 border border-slate-800 rounded-xl p-3 shadow-2xl backdrop-blur-md text-[11px] text-slate-300 hidden sm:block z-30 select-none min-w-[240px]">
        <div className="font-bold text-white mb-2 flex items-center justify-between border-b border-slate-800 pb-1.5">
          <div className="flex items-center space-x-1.5">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>Tactical Map HUD</span>
          </div>
          <span className="font-mono text-[10px] text-cyan-300 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/40">
            {is3DTilt ? '3D OBLIQUE' : '2D ORTHO'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] mb-2 font-mono text-slate-400">
          <div>Pitch: <strong className="text-white">{currentPitch}°</strong></div>
          <div>Bearing: <strong className="text-white">{currentBearing}°</strong></div>
          <div className="col-span-2 text-[10px] text-cyan-300 flex items-center space-x-1 pt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
            <span>Mode: <strong className="text-white uppercase">{mapStyle === 'streets' || mapStyle === 'liberty' ? 'STREETS 3D (LIBERTY)' : 'SATELLITE HYBRID 3D'}</strong></span>
          </div>
          <div className="col-span-2 text-[10px] text-amber-300 flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            <span>Terrain DEM: <strong className="text-white">{isDemActive ? `MAPTERHORN (${terrainExaggeration}x)` : 'OFF'}</strong></span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-3 gap-y-1 pt-1.5 border-t border-slate-800/80">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded bg-red-500"></span>
            <span>RED Priority</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded bg-amber-500"></span>
            <span>ORANGE Priority</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded bg-cyan-500"></span>
            <span>Hazard Footprint</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-1 bg-red-500"></span>
            <span>Severed Road</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            <span>Safe Shelter</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-pink-500"></span>
            <span>Hospital / Plant</span>
          </div>
        </div>
      </div>
    </div>
  );
};
