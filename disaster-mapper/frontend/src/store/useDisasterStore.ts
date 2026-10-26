import { create } from 'zustand';
import type { DisasterEvent, DisasterType } from '../types';

interface LayerVisibility {
  floodZones: boolean;
  forecastFloods: boolean;
  damagedBuildings: boolean;
  blockedRoads: boolean;
  rescueZones: boolean;
  shelters: boolean;
  criticalFacilities: boolean;
  citizenReports: boolean;
  routes: boolean;
  buildings3D: boolean;
}

export const defaultDemoDisasters: DisasterEvent[] = [
  {
    id: 'assam-flood-recent',
    organizationId: 'demo-org',
    name: 'Recent Assam Flood Emergency (Brahmaputra Basin)',
    type: 'FLOOD',
    status: 'ACTIVE',
    severity: 'CRITICAL',
    description: 'Severe monsoon inundation across 28 Assam districts. Brahmaputra cresting 1.8m above danger mark at Nematighat. NH-27 cut off at Jakhalabandha; 486 relief camps operational. Verified public context based on ASDMA / CWC telemetry.',
    centerLatitude: 26.3150,
    centerLongitude: 92.9376,
    startedAt: '2026-10-10T02:00:00Z',
    createdAt: '2026-10-10T02:00:00Z',
    updatedAt: '2026-10-12T16:00:00Z',
    affectedAreaKm2: 2420.0,
    exposedPopulation: 1840000,
    blockedRoadCount: 12,
    damagedBuildingCount: 4120,
    criticalFacilitiesAtRisk: 14
  },
  {
    id: 'jk-landslide-flood-recent',
    organizationId: 'demo-org',
    name: 'Recent Jammu & Kashmir Mountain Landslide (NH-44 Corridor)',
    type: 'LANDSLIDE',
    status: 'ACTIVE',
    severity: 'CRITICAL',
    description: 'Torrential rainfall triggered massive slope failures along NH-44 at Panthyal, Mehar, and Cafeteria Morh. 14 high-altitude hamlets cut off in Ramban, Doda, and Kishtwar. Urgent aerial air-drop & BRO heavy earthmoving required.',
    centerLatitude: 33.2420,
    centerLongitude: 75.2450,
    startedAt: '2026-10-11T03:30:00Z',
    createdAt: '2026-10-11T03:30:00Z',
    updatedAt: '2026-10-12T15:30:00Z',
    affectedAreaKm2: 86.5,
    exposedPopulation: 86000,
    blockedRoadCount: 9,
    damagedBuildingCount: 240,
    criticalFacilitiesAtRisk: 5
  },
  {
    id: 'shimla-landslide-recent',
    organizationId: 'demo-org',
    name: 'Shimla Valley Landslide Catastrophe (Summer Hill / NH-5)',
    type: 'LANDSLIDE',
    status: 'ACTIVE',
    severity: 'HIGH',
    description: 'Catastrophic slope failure along Summer Hill scarp and Shiv Bawdi temple ravine. NH-5 Kalka-Shimla corridor severed at Tara Devi; UNESCO railway track suspended in mid-air. HPSDMA & SDRF debris clearance active.',
    centerLatitude: 31.1048,
    centerLongitude: 77.1734,
    startedAt: '2026-10-10T06:00:00Z',
    createdAt: '2026-10-10T06:00:00Z',
    updatedAt: '2026-10-12T14:30:00Z',
    affectedAreaKm2: 18.2,
    exposedPopulation: 34500,
    blockedRoadCount: 6,
    damagedBuildingCount: 42,
    criticalFacilitiesAtRisk: 3
  },
  {
    id: 'delhi-flood-2026',
    organizationId: 'demo-org',
    name: 'Delhi NCR Urban Flood Emergency (Yamuna Basin)',
    type: 'FLOOD',
    status: 'ACTIVE',
    severity: 'CRITICAL',
    description: 'Severe urban inundation following continuous heavy rainfall. Yamuna cresting at 208.66m, surpassing historic high water marks.',
    centerLatitude: 28.6640,
    centerLongitude: 77.2310,
    startedAt: '2026-10-11T04:00:00Z',
    createdAt: '2026-10-11T04:00:00Z',
    updatedAt: '2026-10-12T11:00:00Z',
    affectedAreaKm2: 14.8,
    exposedPopulation: 82000,
    blockedRoadCount: 4,
    damagedBuildingCount: 28,
    criticalFacilitiesAtRisk: 3
  },
  {
    id: 'bhuj-earthquake-2026',
    organizationId: 'demo-org',
    name: 'Kutch-Saurashtra Mw 7.2 Seismic Disaster (Bhuj)',
    type: 'EARTHQUAKE',
    status: 'ACTIVE',
    severity: 'CRITICAL',
    description: 'Catastrophic Mw 7.2 thrust-fault mainshock at 16.4km focal depth. Widespread structural collapse and transport corridor severance.',
    centerLatitude: 23.3320,
    centerLongitude: 70.1250,
    startedAt: '2026-10-12T01:14:00Z',
    createdAt: '2026-10-12T01:14:00Z',
    updatedAt: '2026-10-12T12:00:00Z',
    affectedAreaKm2: 2150.0,
    exposedPopulation: 580000,
    blockedRoadCount: 8,
    damagedBuildingCount: 5520,
    criticalFacilitiesAtRisk: 6
  },
  {
    id: 'barren-island-volcano-2026',
    organizationId: 'demo-org',
    name: 'Barren Island Volcanic Crisis (Andaman Arc)',
    type: 'VOLCANO',
    status: 'ACTIVE',
    severity: 'CRITICAL',
    description: 'Subduction arc basaltic volcano in violent VEI-4 eruptive phase. 8,500m ash plume disrupting maritime and regional aviation routes.',
    centerLatitude: 12.2780,
    centerLongitude: 93.8580,
    startedAt: '2026-10-09T18:30:00Z',
    createdAt: '2026-10-09T18:30:00Z',
    updatedAt: '2026-10-12T08:00:00Z',
    affectedAreaKm2: 78.5,
    exposedPopulation: 1400,
    blockedRoadCount: 0,
    damagedBuildingCount: 4,
    criticalFacilitiesAtRisk: 1
  },
  {
    id: 'cyclone-amphan-bengal-2026',
    organizationId: 'demo-org',
    name: 'Super Cyclonic Storm AMRIT (Sundarbans Delta)',
    type: 'CYCLONE',
    status: 'ACTIVE',
    severity: 'CRITICAL',
    description: 'Extremely Severe Tropical Cyclone packing 195 km/h winds and 4.2m astronomical storm surge inundating coastal riverine settlements.',
    centerLatitude: 21.6500,
    centerLongitude: 88.3500,
    startedAt: '2026-10-11T09:00:00Z',
    createdAt: '2026-10-11T09:00:00Z',
    updatedAt: '2026-10-12T13:30:00Z',
    affectedAreaKm2: 3820.0,
    exposedPopulation: 1420000,
    blockedRoadCount: 14,
    damagedBuildingCount: 8900,
    criticalFacilitiesAtRisk: 9
  },
  {
    id: 'similipal-wildfire-2026',
    organizationId: 'demo-org',
    name: 'Similipal Biosphere Complex Wildfire (Mayurbhanj)',
    type: 'WILDFIRE',
    status: 'ACTIVE',
    severity: 'HIGH',
    description: 'High-intensity crown and ground wildfire across 48.5 km² of dry deciduous forest driven by 28 km/h north-westerly wind gusts.',
    centerLatitude: 21.8400,
    centerLongitude: 86.3400,
    startedAt: '2026-10-08T11:00:00Z',
    createdAt: '2026-10-08T11:00:00Z',
    updatedAt: '2026-10-12T10:00:00Z',
    affectedAreaKm2: 48.5,
    exposedPopulation: 12400,
    blockedRoadCount: 3,
    damagedBuildingCount: 18,
    criticalFacilitiesAtRisk: 2
  },
  {
    id: 'wayanad-landslide-2026',
    organizationId: 'demo-org',
    name: 'Meppadi-Chooralmala Catastrophic Debris Flow (Wayanad)',
    type: 'LANDSLIDE',
    status: 'ACTIVE',
    severity: 'CRITICAL',
    description: 'Catastrophic slope failure at Punchirimattam scarp unleashing 3.2M m³ of boulder-mud slurry, sweeping away the Chooralmala bridge.',
    centerLatitude: 11.5360,
    centerLongitude: 76.1320,
    startedAt: '2026-10-10T20:45:00Z',
    createdAt: '2026-10-10T20:45:00Z',
    updatedAt: '2026-10-12T14:00:00Z',
    affectedAreaKm2: 4.8,
    exposedPopulation: 3400,
    blockedRoadCount: 5,
    damagedBuildingCount: 184,
    criticalFacilitiesAtRisk: 4
  },
];

interface DisasterState {
  selectedDisaster: DisasterEvent | null;
  currentDisaster: DisasterEvent | null; // Convenient alias
  disastersList: DisasterEvent[];
  selectedTypeFilter: DisasterType | 'ALL';
  searchQuery: string;
  isDemoMode: boolean;
  is3DTilt: boolean;
  layerVisibility: LayerVisibility;
  mapStyle: 'dark' | 'satellite' | 'streets' | 'liberty';
  hazardOpacity: number;
  is3DPriorityColumns: boolean;
  selectedLocalityId: string | null;

  setSelectedDisaster: (disaster: DisasterEvent | null) => void;
  switchDisaster: (disasterId: string) => void;
  resetToDefaultDemo: () => void;
  setDisastersList: (disasters: DisasterEvent[]) => void;
  setSelectedTypeFilter: (type: DisasterType | 'ALL') => void;
  setSearchQuery: (query: string) => void;
  setDemoMode: (isDemo: boolean) => void;
  toggle3DTilt: () => void;
  toggleLayer: (layer: keyof LayerVisibility) => void;
  setMapStyle: (style: 'dark' | 'satellite' | 'streets' | 'liberty') => void;
  setHazardOpacity: (opacity: number) => void;
  toggle3DPriorityColumns: () => void;
  setSelectedLocalityId: (id: string | null) => void;
}

const getInitialDisaster = (): DisasterEvent => {
  try {
    const savedId = localStorage.getItem('disastermapper_selected_id');
    if (savedId) {
      const found = defaultDemoDisasters.find((d) => d.id === savedId);
      if (found) return found;
    }
  } catch {
    // fallback
  }
  return defaultDemoDisasters[0];
};

const initialDisaster = getInitialDisaster();

export const useDisasterStore = create<DisasterState>((set, get) => ({
  selectedDisaster: initialDisaster,
  currentDisaster: initialDisaster,
  disastersList: defaultDemoDisasters,
  selectedTypeFilter: 'ALL',
  searchQuery: '',
  isDemoMode: false,
  is3DTilt: true, // Default to true for impressive 3D command center feel
  mapStyle: 'satellite', // Default to Google Earth 3D Satellite view
  hazardOpacity: 0.85,
  is3DPriorityColumns: false,
  selectedLocalityId: null,
  layerVisibility: {
    floodZones: true,
    forecastFloods: true,
    damagedBuildings: true,
    blockedRoads: true,
    rescueZones: true,
    shelters: true,
    criticalFacilities: true,
    citizenReports: true,
    routes: true,
    buildings3D: true,
  },

  setSelectedDisaster: (disaster) => {
    try {
      if (disaster?.id) {
        localStorage.setItem('disastermapper_selected_id', disaster.id);
      }
    } catch {
      // ignore
    }
    set({ selectedDisaster: disaster, currentDisaster: disaster });
  },

  switchDisaster: (disasterId: string) => {
    const list = get().disastersList;
    const match = list.find((d) => d.id === disasterId) || defaultDemoDisasters.find((d) => d.id === disasterId);
    if (match) {
      try {
        localStorage.setItem('disastermapper_selected_id', match.id);
      } catch {
        // ignore
      }
      set({ selectedDisaster: match, currentDisaster: match });
    }
  },

  resetToDefaultDemo: () => {
    set({
      selectedDisaster: defaultDemoDisasters[0],
      currentDisaster: defaultDemoDisasters[0],
      disastersList: defaultDemoDisasters,
    });
  },

  setDisastersList: (disasters) => {
    const active = disasters.length > 0 ? disasters[0] : null;
    set({
      disastersList: disasters,
      selectedDisaster: get().selectedDisaster || active,
      currentDisaster: get().currentDisaster || active,
    });
  },

  setSelectedTypeFilter: (type) => set({ selectedTypeFilter: type }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setDemoMode: (isDemo) => set({ isDemoMode: isDemo }),
  toggle3DTilt: () => set((state) => ({ is3DTilt: !state.is3DTilt })),
  toggleLayer: (layer) =>
    set((state) => ({
      layerVisibility: {
        ...state.layerVisibility,
        [layer]: !state.layerVisibility[layer],
      },
    })),
  setMapStyle: (style) => set({ mapStyle: style }),
  setHazardOpacity: (hazardOpacity) => set({ hazardOpacity }),
  toggle3DPriorityColumns: () => set((state) => ({ is3DPriorityColumns: !state.is3DPriorityColumns })),
  setSelectedLocalityId: (selectedLocalityId) => set({ selectedLocalityId }),
}));

if (typeof window !== 'undefined') {
  (window as any).__disasterStore = useDisasterStore;
}
