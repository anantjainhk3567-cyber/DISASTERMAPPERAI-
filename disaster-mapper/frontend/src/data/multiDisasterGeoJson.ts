import { DEFAULT_DELHI_GEOJSON } from './delhiGeoJson';

// =========================================================================
// 1. EARTHQUAKE: Kutch-Saurashtra Mw 7.2 Seismic Disaster (Bhuj Epicenter)
// Center: [70.1250, 23.3320]
// =========================================================================
export const EARTHQUAKE_BHUJ_GEOJSON = {
  type: 'FeatureCollection',
  features: [
    // Epicenter Point
    {
      type: 'Feature',
      id: 'eq-epicenter',
      properties: {
        id: 'eq-epicenter',
        entity: 'EARTHQUAKE_EPICENTER',
        name: 'Mw 7.2 Mainshock Epicenter',
        magnitude: 7.2,
        depthKm: 16.4,
        pga: '0.44g',
        faultMechanism: 'Reverse / Thrust Fault Rupture',
        severity: 'CRITICAL',
        status: 'ACTIVE_AFTERSHOCKS'
      },
      geometry: {
        type: 'Point',
        coordinates: [70.1250, 23.3320]
      }
    },
    // Shake Zone: MMI IX (Violent / Ruinous - 15km radius)
    {
      type: 'Feature',
      id: 'eq-shake-mmi9',
      properties: {
        id: 'eq-shake-mmi9',
        entity: 'SHAKE_ZONE',
        mmi: 'IX',
        intensity: 'VIOLENT',
        name: 'MMI IX Ruinous Shaking Zone (Bhachau-Bhuj Core)',
        pgaG: 0.44,
        severity: 'CRITICAL',
        riskLevel: 'CRITICAL',
        estimatedArea: 680,
        exposedPopulation: 245000,
        estimatedCollapsedBuildings: 480
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [70.010, 23.380],
          [70.190, 23.390],
          [70.260, 23.330],
          [70.220, 23.240],
          [70.080, 23.230],
          [69.990, 23.290],
          [70.010, 23.380]
        ]]
      }
    },
    // Shake Zone: MMI VIII (Destructive - 35km radius)
    {
      type: 'Feature',
      id: 'eq-shake-mmi8',
      properties: {
        id: 'eq-shake-mmi8',
        entity: 'SHAKE_ZONE',
        mmi: 'VIII',
        intensity: 'SEVERE',
        name: 'MMI VIII Destructive Shaking Zone',
        pgaG: 0.28,
        severity: 'HIGH',
        riskLevel: 'HIGH',
        estimatedArea: 2150,
        exposedPopulation: 580000
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [69.850, 23.480],
          [70.380, 23.490],
          [70.480, 23.320],
          [70.350, 23.120],
          [69.880, 23.100],
          [69.750, 23.280],
          [69.850, 23.480]
        ]]
      }
    },
    // Ruptured Fault Trace Line
    {
      type: 'Feature',
      id: 'eq-fault-trace',
      properties: {
        id: 'eq-fault-trace',
        entity: 'FAULT_LINE',
        name: 'Kutch Mainland Fault (KMF) Surface Rupture',
        slipMeters: 2.8,
        status: 'RUPTURED'
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [69.950, 23.370],
          [70.080, 23.345],
          [70.210, 23.320],
          [70.340, 23.295]
        ]
      }
    },
    // Rescue Priority RED: Bhuj Old Walled City Sector
    {
      type: 'Feature',
      id: 'eq-rescue-red-1',
      properties: {
        id: 'eq-rescue-red-1',
        entity: 'RESCUE_ZONE',
        priority: 'RED',
        priorityLevel: 'RED',
        name: 'Sector 1 — Bhuj Walled City Dense Quarter',
        disasterType: 'Earthquake Epicentral Structural Collapse',
        priorityScore: 96,
        severity: 'CRITICAL',
        estimatedAreaKm2: 6.8,
        affectedPopulation: 18400,
        trappedCasualtiesEstimate: 320,
        damagedBuildings: 210,
        blockedRoads: 6,
        affectedRoads: 'Station Road, Darbar Gadh Corridor, Old City Gate Bypasses',
        nearbyShelters: 'Lalan College Camp (1.1 km), Jubilee Ground Tents (1.8 km)',
        nearbyFacilities: 'GK General Civil Hospital (3.2 km, Partial Damage)',
        accessibilityStatus: 'SEVERELY_RESTRICTED — Narrow Streets Blocked by Masonry',
        scoreRationale: 'Critical collapse density (>78% unreinforced masonry destruction), dense historic population trapped in narrow alleys, and 6 blocked artery junctions.',
        observedVsSimulated: 'OBSERVED (Field USAR Assessment & High-Resolution Aerial Recon)',
        dataProvenance: 'Gujarat State Disaster Management Authority (GSDMA) / NDRF 6th Bn',
        timestamp: '2026-10-26T18:30:00+05:30',
        recommendedAction: 'Urgent deployment of heavy urban search-and-rescue (USAR), acoustic life-detectors, and field surgical triage.',
        resourceNeeds: '4 USAR Teams, 6 Canine Units, 2 Mobile ICUs'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [69.648, 23.262],
          [69.658, 23.268],
          [69.672, 23.269],
          [69.681, 23.261],
          [69.684, 23.249],
          [69.678, 23.241],
          [69.664, 23.239],
          [69.652, 23.243],
          [69.645, 23.251],
          [69.648, 23.262]
        ]]
      }
    },
    // Blocked Transport Corridor: Surajbari Bridge Link
    {
      type: 'Feature',
      id: 'eq-road-blocked-1',
      properties: {
        id: 'eq-road-blocked-1',
        entity: 'ROAD_SEGMENT',
        name: 'NH-41 Surajbari Creek Viaduct',
        status: 'BLOCKED',
        type: 'NATIONAL_HIGHWAY',
        accessibilityScore: 0,
        description: 'Structural pier displacement & expansion joint shear failure. Road impassable for heavy relief convoys.'
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [70.710, 23.210],
          [70.735, 23.205],
          [70.760, 23.198]
        ]
      }
    },
    // Critical Facility: Bhuj General Hospital
    {
      type: 'Feature',
      id: 'eq-fac-hospital',
      properties: {
        id: 'eq-fac-hospital',
        entity: 'CRITICAL_FACILITY',
        name: 'GK Memorial General Hospital',
        type: 'HOSPITAL',
        status: 'COMPROMISED',
        damageLevel: 'SEVERE',
        description: 'Main wing damaged; ER shifted to outdoor triage tents on adjacent stadium ground.'
      },
      geometry: {
        type: 'Point',
        coordinates: [69.6680, 23.2510]
      }
    }
  ]
};

// =========================================================================
// 2. VOLCANO: Barren Island Eruptive Crisis (Andaman Subduction Arc)
// Center: [93.8580, 12.2780]
// =========================================================================
export const VOLCANO_BARREN_GEOJSON = {
  type: 'FeatureCollection',
  features: [
    // Caldera Summit Vent
    {
      type: 'Feature',
      id: 'volc-vent',
      properties: {
        id: 'volc-vent',
        entity: 'VOLCANIC_VENT',
        name: 'Barren Island Active Summit Caldera',
        vei: 4,
        alertLevel: 'WARNING_LEVEL_4',
        plumeHeightM: 8500,
        severity: 'CRITICAL',
        status: 'ACTIVE_ERUPTION'
      },
      geometry: {
        type: 'Point',
        coordinates: [93.8580, 12.2780]
      }
    },
    // 5km Pyroclastic Density Current (PDC) Core Exclusion Zone
    {
      type: 'Feature',
      id: 'volc-5km-core',
      properties: {
        id: 'volc-5km-core',
        entity: 'VOLCANO_ZONE',
        zoneType: 'PYROCLASTIC_CORE',
        name: '5km Pyroclastic Surge & Lava Flow Kill Zone',
        severity: 'CRITICAL',
        riskLevel: 'CRITICAL',
        estimatedArea: 78.5,
        evacuationStatus: 'MANDATORY_EXCLUSION'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [93.815, 12.278],
          [93.827, 12.312],
          [93.858, 12.325],
          [93.890, 12.311],
          [93.902, 12.278],
          [93.889, 12.245],
          [93.858, 12.231],
          [93.826, 12.244],
          [93.815, 12.278]
        ]]
      }
    },
    // 25km Ashfall & Marine Hazard Plume (oriented SW towards shipping channels)
    {
      type: 'Feature',
      id: 'volc-ash-plume',
      properties: {
        id: 'volc-ash-plume',
        entity: 'ASH_PLUME',
        name: 'Atmospheric Ashfall Plume Vector (230° SW Trajectory)',
        severity: 'HIGH',
        riskLevel: 'HIGH',
        pm25Spike: '680 ug/m³',
        aviationCode: 'RED'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [93.858, 12.278],
          [93.750, 12.180],
          [93.620, 12.020],
          [93.520, 11.950],
          [93.680, 12.080],
          [93.820, 12.210],
          [93.858, 12.278]
        ]]
      }
    },
    // Maritime Exclusion Zone (15 Nautical Miles)
    {
      type: 'Feature',
      id: 'volc-marine-exclusion',
      properties: {
        id: 'volc-marine-exclusion',
        entity: 'RESCUE_ZONE',
        priority: 'RED',
        name: 'Naval & Commercial Maritime Exclusion Ring',
        priorityScore: 91,
        severity: 'CRITICAL',
        affectedPopulation: 1400,
        recommendedAction: 'Coast Guard interception of fishing vessels and merchant ships; divert Andaman Sea shipping corridor.'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [93.720, 12.278],
          [93.760, 12.380],
          [93.858, 12.420],
          [93.960, 12.380],
          [94.000, 12.278],
          [93.955, 12.170],
          [93.858, 12.130],
          [93.755, 12.170],
          [93.720, 12.278]
        ]]
      }
    }
  ]
};

// =========================================================================
// 3. CYCLONE: Super Cyclonic Storm "AMRIT" (Sundarbans / Bay of Bengal)
// Center: [88.3500, 21.6500]
// =========================================================================
export const CYCLONE_AMPHAN_GEOJSON = {
  type: 'FeatureCollection',
  features: [
    // Cyclone Eye Center
    {
      type: 'Feature',
      id: 'cyc-eye',
      properties: {
        id: 'cyc-eye',
        entity: 'CYCLONE_EYE',
        name: 'Super Cyclone AMRIT Eye (Category 4)',
        centralPressureHpa: 938,
        sustainedWindKmh: 195,
        gustSpeedKmh: 225,
        forwardSpeedKmh: 18,
        severity: 'CRITICAL',
        status: 'IMMINENT_LANDFALL'
      },
      geometry: {
        type: 'Point',
        coordinates: [88.3500, 21.6500]
      }
    },
    // 64-Knot Hurricane Wind Band Radius (60km)
    {
      type: 'Feature',
      id: 'cyc-64kt-band',
      properties: {
        id: 'cyc-64kt-band',
        entity: 'CYCLONE_WIND_ZONE',
        name: 'Hurricane Force Wind Core (>120 km/h Destructive Winds)',
        severity: 'CRITICAL',
        riskLevel: 'CRITICAL',
        estimatedArea: 3820,
        exposedPopulation: 1420000
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [88.020, 21.650],
          [88.115, 21.920],
          [88.350, 22.020],
          [88.585, 21.920],
          [88.680, 21.650],
          [88.585, 21.380],
          [88.350, 21.280],
          [88.115, 21.380],
          [88.020, 21.650]
        ]]
      }
    },
    // Coastal Storm Surge Inundation Polygon (4.2m Surge - Kakdwip / Sagar Island)
    {
      type: 'Feature',
      id: 'cyc-surge-inundation',
      properties: {
        id: 'cyc-surge-inundation',
        entity: 'FLOOD_ZONE',
        type: 'STORM_SURGE_INUNDATION',
        name: '4.2m Astronomical Storm Surge Inundation Belt',
        severity: 'CRITICAL',
        riskLevel: 'CRITICAL',
        estimatedArea: 48.6,
        waterLevel: '4.2m Peak Surge Over Astronomical High Tide'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [88.080, 21.750],
          [88.220, 21.840],
          [88.390, 21.880],
          [88.520, 21.820],
          [88.480, 21.680],
          [88.320, 21.620],
          [88.150, 21.650],
          [88.080, 21.750]
        ]]
      }
    },
    // Rescue Zone RED: Sagar Island South Embankment Breach
    {
      type: 'Feature',
      id: 'cyc-rescue-red',
      properties: {
        id: 'cyc-rescue-red',
        entity: 'RESCUE_ZONE',
        priority: 'RED',
        priorityLevel: 'RED',
        name: 'Sector 1 — Sagar Island South & Gosaba Delta',
        disasterType: 'Tropical Cyclone Storm Surge & Coastal Embankment Breach',
        priorityScore: 97,
        severity: 'CRITICAL',
        estimatedAreaKm2: 42.5,
        affectedPopulation: 38500,
        trappedCasualtiesEstimate: 620,
        damagedBuildings: 480,
        blockedRoads: 5,
        affectedRoads: 'Gangasagar Beach Road, Chemaguri Jetty Access Embankment, Kachuberia Feeder',
        nearbyShelters: 'Sagar Multipurpose Cyclone Shelter (1.4 km, 1200 cap), Rudranagar High School (2.6 km)',
        nearbyFacilities: 'Sagar Rural Hospital (4.5 km, Operational with Generators)',
        accessibilityStatus: 'SURGE_ISOLATED — Hovercraft & Amphibious Barges Only',
        scoreRationale: 'Severe 4.2m astronomical storm surge breached 14km of earthen saline embankments, submerging southern coastal habitations under tidal seawater.',
        observedVsSimulated: 'OBSERVED (IMD Doppler Radar Surge Telemetry & SDRF Patrol Logs)',
        dataProvenance: 'West Bengal Disaster Management Dept / Indian Coast Guard',
        timestamp: '2026-10-26T18:30:00+05:30',
        recommendedAction: 'Rapid hovercraft & NDRF high-clearance truck evacuation to inland reinforced concrete cyclone shelters.'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [88.048, 21.718],
          [88.072, 21.745],
          [88.114, 21.772],
          [88.156, 21.781],
          [88.182, 21.774],
          [88.194, 21.742],
          [88.196, 21.688],
          [88.188, 21.642],
          [88.168, 21.615],
          [88.125, 21.598],
          [88.084, 21.602],
          [88.058, 21.631],
          [88.045, 21.674],
          [88.048, 21.718]
        ]]
      }
    },
    // Emergency Cyclone Shelter
    {
      type: 'Feature',
      id: 'cyc-shelter-1',
      properties: {
        id: 'cyc-shelter-1',
        entity: 'SHELTER',
        name: 'Kakdwip Super Cyclone Multi-Purpose Shelter',
        status: 'OPEN',
        totalCapacity: 2800,
        currentOccupancy: 2450,
        hasMedicalFacilities: true,
        hasFoodSupplies: true
      },
      geometry: {
        type: 'Point',
        coordinates: [88.1850, 21.8750]
      }
    }
  ]
};

// =========================================================================
// 4. WILDFIRE: Similipal Biosphere Complex Wildfire (Mayurbhanj Core)
// Center: [86.3400, 21.8400]
// =========================================================================
export const WILDFIRE_SIMILIPAL_GEOJSON = {
  type: 'FeatureCollection',
  features: [
    // Active Flaming Perimeter (48.5 km²)
    {
      type: 'Feature',
      id: 'wildfire-flaming-perimeter',
      properties: {
        id: 'wildfire-flaming-perimeter',
        entity: 'WILDFIRE_PERIMETER',
        name: 'Similipal Core Active Flaming Front',
        frpMw: 440,
        rateOfSpreadKmh: 1.4,
        containmentPercent: 28,
        severity: 'CRITICAL',
        riskLevel: 'CRITICAL',
        estimatedArea: 48.5
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [86.280, 21.890],
          [86.360, 21.910],
          [86.410, 21.860],
          [86.380, 21.790],
          [86.300, 21.780],
          [86.260, 21.830],
          [86.280, 21.890]
        ]]
      }
    },
    // Dense Smoke Plume Dispersion (Wind Driving SE)
    {
      type: 'Feature',
      id: 'wildfire-smoke-plume',
      properties: {
        id: 'wildfire-smoke-plume',
        entity: 'SMOKE_PLUME',
        name: 'Dense Smoke Plume Vector (PM2.5: 580 ug/m³)',
        severity: 'HIGH',
        riskLevel: 'HIGH'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [86.350, 21.850],
          [86.450, 21.880],
          [86.580, 21.830],
          [86.620, 21.750],
          [86.480, 21.740],
          [86.350, 21.850]
        ]]
      }
    },
    // Bulldozer Firebreak Containment Line
    {
      type: 'Feature',
      id: 'wildfire-firebreak-line',
      properties: {
        id: 'wildfire-firebreak-line',
        entity: 'FIREBREAK_LINE',
        name: 'Southern Ridge Bulldozer Cleared Firebreak (Width: 40m)',
        status: 'HOLDING',
        lengthKm: 14.2
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [86.240, 21.765],
          [86.310, 21.760],
          [86.420, 21.775]
        ]
      }
    },
    // Rescue Priority RED: Gurguria Forest Hamlet
    {
      type: 'Feature',
      id: 'wildfire-rescue-red',
      properties: {
        id: 'wildfire-rescue-red',
        entity: 'RESCUE_ZONE',
        priority: 'RED',
        priorityLevel: 'RED',
        name: 'Sector 1 — Gurguria Fringe Tribal Settlement',
        disasterType: 'Biosphere Reserve Forest Fire & Crown Fire Encroachment',
        priorityScore: 93,
        severity: 'CRITICAL',
        estimatedAreaKm2: 8.4,
        affectedPopulation: 2600,
        trappedCasualtiesEstimate: 45,
        damagedBuildings: 32,
        blockedRoads: 2,
        affectedRoads: 'Gurguria Forest Range Patrol Track (Dense Smoke), Jashipur Access Road',
        nearbyShelters: 'Jashipur Forest Rest House Evacuation Camp (6.2 km, 500 cap)',
        nearbyFacilities: 'Jashipur Community Health Centre (8.1 km, Operational)',
        accessibilityStatus: 'SMOKE_IMPEDED — 4x4 Off-Road Tankers & Air Drop Clearance Only',
        scoreRationale: 'Direct downwind flame front advancing at 1.4 m/s through dry sal foliage towards 4 tribal hamlets with only one unpaved escape track.',
        observedVsSimulated: 'OBSERVED (SNPP-VIIRS 375m Active Fire Thermal Anomalies & Forest Ranger Patrols)',
        dataProvenance: 'Odisha Forest & Environment Dept / FSI Forest Fire Alert System',
        timestamp: '2026-10-26T18:30:00+05:30',
        recommendedAction: 'Immediate convoy evacuation along western escape corridor; aerial water drops along northern flank.'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [86.248, 21.819],
          [86.262, 21.831],
          [86.284, 21.836],
          [86.297, 21.824],
          [86.298, 21.808],
          [86.287, 21.798],
          [86.265, 21.793],
          [86.249, 21.802],
          [86.248, 21.819]
        ]]
      }
    }
  ]
};

// =========================================================================
// 5. LANDSLIDE: Wayanad / Meppadi Catastrophic Debris Flow (Western Ghats)
// Center: [76.1320, 11.5360]
// =========================================================================
export const LANDSLIDE_WAYANAD_GEOJSON = {
  type: 'FeatureCollection',
  features: [
    // Crown Scarp Failure Origin
    {
      type: 'Feature',
      id: 'ls-crown-scarp',
      properties: {
        id: 'ls-crown-scarp',
        entity: 'LANDSLIDE_SCARP',
        name: 'Punchirimattam Hill Crown Failure Scarp',
        elevationMsl: 1560,
        slopeAngle: '38°',
        antecedentRain48h: '372 mm',
        debrisVolumeM3: '3,200,000 m³',
        severity: 'CRITICAL',
        status: 'ACTIVE_EROSION'
      },
      geometry: {
        type: 'Point',
        coordinates: [76.1550, 11.5480]
      }
    },
    // Debris Flow Avalanche Runout Path (6.5 km)
    {
      type: 'Feature',
      id: 'ls-runout-corridor',
      properties: {
        id: 'ls-runout-corridor',
        entity: 'DEBRIS_FLOW_CORRIDOR',
        name: 'Chooralmala River Debris Avalanche Runout Path',
        severity: 'CRITICAL',
        riskLevel: 'CRITICAL',
        debrisThickness: '4.5m - 8.2m mud deposit',
        estimatedArea: 4.8,
        affectedSettlementsCount: 3
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [76.155, 11.548],
          [76.142, 11.542],
          [76.130, 11.535],
          [76.115, 11.528],
          [76.108, 11.520],
          [76.114, 11.516],
          [76.126, 11.526],
          [76.138, 11.532],
          [76.158, 11.545],
          [76.155, 11.548]
        ]]
      }
    },
    // Blocked Bridge Chokepoint: Chooralmala Bridge Destroyed
    {
      type: 'Feature',
      id: 'ls-bridge-destroyed',
      properties: {
        id: 'ls-bridge-destroyed',
        entity: 'ROAD_SEGMENT',
        name: 'Chooralmala River Crossing Bridge',
        status: 'BLOCKED',
        type: 'KEY_BRIDGE',
        accessibilityScore: 0,
        description: 'Concrete span completely washed away by boulder debris. Mundakkai isolated on northern bank.'
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [76.127, 11.532],
          [76.131, 11.535]
        ]
      }
    },
    // Rescue Priority RED: Mundakkai Isolated Tea Estate
    {
      type: 'Feature',
      id: 'ls-rescue-red',
      properties: {
        id: 'ls-rescue-red',
        entity: 'RESCUE_ZONE',
        priority: 'RED',
        priorityLevel: 'RED',
        name: 'Sector 1 — Mundakkai Isolated Plantation Valley',
        disasterType: 'Western Ghats Catastrophic Granitic Debris Flow',
        priorityScore: 98,
        severity: 'CRITICAL',
        estimatedAreaKm2: 5.4,
        affectedPopulation: 1450,
        trappedCasualtiesEstimate: 180,
        damagedBuildings: 86,
        blockedRoads: 3,
        affectedRoads: 'Chooralmala-Mundakkai Bridge Route (Bridge Demolished), Estate Access Footways',
        nearbyShelters: 'Chooralmala School Camp (1.3 km), Meppadi Relief Centre (4.8 km)',
        nearbyFacilities: 'Meppadi Primary Health Centre (5.2 km), WIMS Medical College (11.0 km)',
        accessibilityStatus: 'TOTAL_PHYSICAL_CUT_OFF — Bailey Bridge / Winch Wire Only',
        scoreRationale: 'Double debris wave obliterated Chooralmala bridge, creating 12m deep sludge channel trapping 1,450 plantation residents on isolated terrace.',
        observedVsSimulated: 'OBSERVED (Indian Army Madras Sappers Recon & NDRF Drone Mapping)',
        dataProvenance: 'Kerala State Disaster Management Authority (KSDMA) / Indian Army Southern Command',
        timestamp: '2026-10-26T18:30:00+05:30',
        roadAccessStatus: 'CUT_OFF',
        recommendedAction: 'Indian Army Bailey Bridge construction; IAF Mi-17 heavy-lift helicopter aerial winch rescue.',
        resourceNeeds: '2 Bailey Bridge Units, 3 Heavy IAF Helicopters, 8 Mountain Search Dogs'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [76.134, 11.544],
          [76.141, 11.548],
          [76.149, 11.547],
          [76.154, 11.541],
          [76.153, 11.535],
          [76.146, 11.531],
          [76.138, 11.532],
          [76.131, 11.537],
          [76.134, 11.544]
        ]]
      }
    },
    // Emergency Helicopter Extraction Zone
    {
      type: 'Feature',
      id: 'ls-lz-poly',
      properties: {
        id: 'ls-lz-poly',
        entity: 'SHELTER',
        name: 'Chooralmala Football Ground Emergency Air-Extraction LZ',
        status: 'OPEN',
        totalCapacity: 600,
        currentOccupancy: 120,
        hasMedicalFacilities: true,
        hasFoodSupplies: true
      },
      geometry: {
        type: 'Point',
        coordinates: [76.1180, 11.5240]
      }
    }
  ]
};

// =========================================================================
// 6. FLOOD: Recent Assam Flood Emergency (Brahmaputra Basin)
// Center: [92.9376, 26.3150]
// =========================================================================
export const FLOOD_ASSAM_GEOJSON = {
  type: 'FeatureCollection',
  features: [
    // Primary Inundation: Brahmaputra Main Overflow Channel
    {
      type: 'Feature',
      id: 'as-flood-main',
      properties: {
        id: 'as-flood-main',
        entity: 'FLOOD_ZONE',
        type: 'FLOODED_AREA',
        name: 'Brahmaputra River Major Inundation Plain',
        severity: 'CRITICAL',
        riskLevel: 'CRITICAL',
        depthRange: '> 2.2m',
        waterLevelM: 106.85,
        dangerMarkM: 105.70,
        estimatedArea: 1420.0,
        exposedPopulation: 890000,
        dataProvenance: 'RECENT_EVENT_PROTOTYPE: ASDMA / CWC Ground Gauging'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [92.720, 26.380],
          [93.120, 26.420],
          [93.280, 26.310],
          [93.050, 26.220],
          [92.810, 26.240],
          [92.680, 26.310],
          [92.720, 26.380]
        ]]
      }
    },
    // Secondary Inundation: Morigaon-Lahorighat Lowland
    {
      type: 'Feature',
      id: 'as-flood-morigaon',
      properties: {
        id: 'as-flood-morigaon',
        entity: 'FLOOD_ZONE',
        type: 'FLOODED_AREA',
        name: 'Morigaon Lahorighat Riverine Flood Basin',
        severity: 'HIGH',
        riskLevel: 'HIGH',
        depthRange: '1.2m - 1.8m',
        estimatedArea: 640.0,
        exposedPopulation: 420000
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [92.450, 26.280],
          [92.680, 26.320],
          [92.710, 26.190],
          [92.480, 26.160],
          [92.450, 26.280]
        ]]
      }
    },
    // Kaziranga South Fringe Overwash Zone
    {
      type: 'Feature',
      id: 'as-flood-kaziranga',
      properties: {
        id: 'as-flood-kaziranga',
        entity: 'FLOOD_ZONE',
        type: 'FLOODED_AREA',
        name: 'Kaziranga National Park Southern Overwash Plain',
        severity: 'HIGH',
        riskLevel: 'HIGH',
        depthRange: '0.8m - 1.5m',
        estimatedArea: 360.0,
        exposedPopulation: 78000
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [93.150, 26.620],
          [93.450, 26.650],
          [93.520, 26.540],
          [93.210, 26.520],
          [93.150, 26.620]
        ]]
      }
    },
    // Embankment Breach Line
    {
      type: 'Feature',
      id: 'as-embankment-breach',
      properties: {
        id: 'as-embankment-breach',
        entity: 'HAZARD_LINE',
        name: 'Jakhalabandha E&D Embankment Critical Breach (140m width)',
        status: 'ACTIVE_OVERFLOW',
        waterDischargeCusecs: 42000
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [92.980, 26.310],
          [93.040, 26.330]
        ]
      }
    },
    // Blocked Road 1: NH-27 Jakhalabandha-Kaliabor Submerged Section
    {
      type: 'Feature',
      id: 'as-road-nh27',
      properties: {
        id: 'as-road-nh27',
        entity: 'ROAD_SEGMENT',
        name: 'National Highway 27 (Jakhalabandha Corridor)',
        status: 'BLOCKED',
        severity: 'CRITICAL',
        waterDepthM: 1.45,
        blockedLengthKm: 16.5,
        accessibilityScore: 0,
        description: 'NH-27 completely submerged under 1.45m of rapid water flow. Inter-district transport severed between Nagaon and Jorhat.'
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [92.920, 26.305],
          [92.975, 26.320],
          [93.040, 26.345],
          [93.090, 26.360]
        ]
      }
    },
    // Blocked Road 2: NH-127B Mankachar Polder Link
    {
      type: 'Feature',
      id: 'as-road-nh127b',
      properties: {
        id: 'as-road-nh127b',
        entity: 'ROAD_SEGMENT',
        name: 'NH-127B River Approach Road',
        status: 'BLOCKED',
        severity: 'HIGH',
        waterDepthM: 0.95,
        blockedLengthKm: 8.2,
        accessibilityScore: 0.15
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [92.810, 26.240],
          [92.860, 26.270]
        ]
      }
    },
    // RED Priority Rescue Zone: Morigaon Lahorighat Riverine Char Islands
    {
      type: 'Feature',
      id: 'as-rescue-red',
      properties: {
        id: 'as-rescue-red',
        entity: 'RESCUE_ZONE',
        priority: 'RED',
        priorityLevel: 'RED',
        name: 'Sector 1 — Morigaon Lahorighat Riverine Islands',
        disasterType: 'Brahmaputra Alluvial Basin Flood & Embankment Breach',
        priorityScore: 97,
        severity: 'CRITICAL',
        estimatedAreaKm2: 34.6,
        affectedPopulation: 48000,
        trappedCasualtiesEstimate: 620,
        damagedBuildings: 340,
        blockedRoads: 4,
        affectedRoads: 'Bhuragaon-Lahorighat PWD Embankment Road (Submerged 1.8m), Dhing River Ferry Corridor (Severed)',
        nearbyShelters: 'Lahorighat Higher Secondary School Relief Camp (1.2 km, 450 cap), Bhuragaon Cyclone Shelter (2.8 km, 800 cap)',
        nearbyFacilities: 'Kaliabor Sub-Divisional Hospital (11.5 km, Operational), Lahorighat PHC (Submerged)',
        accessibilityStatus: '100% CUT_OFF — Motorized Inflatable Boat & Aerial Winch Only',
        scoreRationale: 'Catastrophic embankment breach on southern Brahmaputra dyke, flooding 34.6 km² of riverine chaporis at +1.8m above danger mark, isolating 48,000 residents across cut-off riverine settlements.',
        observedVsSimulated: 'OBSERVED (Sentinel-1 SAR Flood Inundation & SDRF Zodiac Recon)',
        dataProvenance: 'Assam State Disaster Management Authority (ASDMA) / Central Water Commission',
        timestamp: '2026-10-26T18:30:00+05:30',
        roadAccessStatus: '100% CUT_OFF',
        recommendedAction: 'Immediate deployment of 18 NDRF/SDRF motorized Zodiac rescue boats with drone night-vision spotting.',
        resourceNeeds: '18 Zodiac Inflatable Boats, 450 Lifejackets, 2 Water Purification Barges, 3 Medical First-Aid Teams'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [92.512, 26.258],
          [92.528, 26.269],
          [92.549, 26.281],
          [92.574, 26.288],
          [92.603, 26.292],
          [92.631, 26.286],
          [92.652, 26.278],
          [92.668, 26.261],
          [92.673, 26.238],
          [92.665, 26.221],
          [92.648, 26.211],
          [92.624, 26.202],
          [92.598, 26.195],
          [92.572, 26.198],
          [92.547, 26.206],
          [92.531, 26.218],
          [92.521, 26.234],
          [92.512, 26.258]
        ]]
      }
    },
    // ORANGE Priority Rescue Zone: Jakhalabandha Agricultural Lowlands
    {
      type: 'Feature',
      id: 'as-rescue-orange',
      properties: {
        id: 'as-rescue-orange',
        entity: 'RESCUE_ZONE',
        priority: 'ORANGE',
        priorityLevel: 'ORANGE',
        name: 'Sector 2 — Jakhalabandha Lowland Embankment Fringe',
        disasterType: 'Agricultural Floodplain Backwater Inundation',
        priorityScore: 78,
        severity: 'HIGH',
        estimatedAreaKm2: 22.8,
        affectedPopulation: 32000,
        trappedCasualtiesEstimate: 85,
        damagedBuildings: 95,
        blockedRoads: 2,
        affectedRoads: 'NH-715 Kaliabor Bypass Shoulder (Waterlogged 0.4m), Silghat Tea Estate Feeder Road',
        nearbyShelters: 'Jakhalabandha Higher Secondary School (1.8 km, 500 cap), Silghat Town Hall (3.4 km)',
        nearbyFacilities: 'Kaliabor Sub-Divisional Hospital (4.2 km, Operational), Kuwaritol Health Centre (2.1 km)',
        accessibilityStatus: 'PARTIALLY_RESTRICTED — High-Clearance Trucks & Tractor Convoys Only',
        scoreRationale: 'Backwater overflow from Kolong tributary inundating lowland paddy corridors and village approach roads with water levels rising at 6 cm/hr.',
        observedVsSimulated: 'OBSERVED (CWC Hydrograph Gauges & District Police Patrol Logs)',
        dataProvenance: 'Nagaon District Emergency Operation Centre (DEOC) / ASDMA',
        timestamp: '2026-10-26T18:30:00+05:30',
        roadAccessStatus: 'PARTIALLY_CUT_OFF',
        recommendedAction: 'High-clearance truck convoy evacuation and mobile medical supply distribution.',
        resourceNeeds: '12 High-Clearance Army 4x4 Trucks, 2 Mobile Drinking Water Tankers, Baby Formula & ORS Packets'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [92.952, 26.348],
          [92.973, 26.362],
          [93.002, 26.374],
          [93.036, 26.381],
          [93.072, 26.385],
          [93.099, 26.378],
          [93.118, 26.364],
          [93.129, 26.342],
          [93.131, 26.318],
          [93.120, 26.298],
          [93.102, 26.288],
          [93.078, 26.282],
          [93.049, 26.285],
          [93.018, 26.294],
          [92.986, 26.309],
          [92.964, 26.327],
          [92.952, 26.348]
        ]]
      }
    },
    // GREEN Monitored Zone: Kaziranga Kohora Highlands Evacuation Base
    {
      type: 'Feature',
      id: 'as-rescue-green',
      properties: {
        id: 'as-rescue-green',
        entity: 'RESCUE_ZONE',
        priority: 'GREEN',
        priorityLevel: 'GREEN',
        name: 'Sector 3 — Kaziranga Kohora Highlands Safe Staging Post',
        disasterType: 'Elevated Foothill Safe Staging & Humanitarian Hub',
        priorityScore: 24,
        severity: 'LOW',
        estimatedAreaKm2: 15.2,
        affectedPopulation: 12000,
        trappedCasualtiesEstimate: 0,
        damagedBuildings: 0,
        blockedRoads: 0,
        affectedRoads: 'National Highway 715 (Fully Elevated & Passable)',
        nearbyShelters: 'Kohora Tourist Complex Staging Hub (0.4 km, 1500 cap), Bokakhat Stadium Camp (8.5 km)',
        nearbyFacilities: 'Bokakhat Civil Hospital (9.2 km, Operational), Kohora Forest Dispensary (0.6 km)',
        accessibilityStatus: 'OPEN — Full Arterial Access via NH-715 & Helipad Active',
        scoreRationale: 'Stable elevated granitic ridge base 14m above maximum historical flood levels, optimal for regional incident command, wildlife triage, and air staging.',
        observedVsSimulated: 'OBSERVED (Kaziranga National Park Authority & Civil Defense Command)',
        dataProvenance: 'Assam Forest Department / ASDMA Emergency Staging Registry',
        timestamp: '2026-10-26T18:30:00+05:30',
        roadAccessStatus: 'OPEN',
        recommendedAction: 'Operate as regional coordination hub, helicopter refuel pad, and medical triage station.',
        resourceNeeds: 'Helicopter Fuel Staging, 500 Civilian Tents, Central Communications Unit'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [93.382, 26.586],
          [93.401, 26.594],
          [93.424, 26.601],
          [93.451, 26.602],
          [93.473, 26.596],
          [93.488, 26.582],
          [93.492, 26.561],
          [93.485, 26.545],
          [93.468, 26.536],
          [93.442, 26.531],
          [93.419, 26.535],
          [93.398, 26.546],
          [93.386, 26.565],
          [93.382, 26.586]
        ]]
      }
    },
    // Critical Facility: Kaliabor Sub-Divisional Hospital (Operational)
    {
      type: 'Feature',
      id: 'as-facility-hosp',
      properties: {
        id: 'as-facility-hosp',
        entity: 'CRITICAL_FACILITY',
        type: 'HOSPITAL',
        name: 'Kaliabor Sub-Divisional Civil Hospital',
        status: 'OPERATIONAL',
        priority: 'CRITICAL',
        riskLevel: 'MEDIUM',
        backupPowerHours: 72,
        patientCapacity: 250,
        currentOccupancy: 220
      },
      geometry: {
        type: 'Point',
        coordinates: [92.9520, 26.3310]
      }
    },
    // Critical Facility: Jakhalabandha 33kV Substation (Inundated)
    {
      type: 'Feature',
      id: 'as-facility-power',
      properties: {
        id: 'as-facility-power',
        entity: 'CRITICAL_FACILITY',
        type: 'POWER_SUBSTATION',
        name: 'Jakhalabandha 33kV APDCL Substation',
        status: 'COMPROMISED',
        priority: 'HIGH',
        riskLevel: 'CRITICAL',
        backupPowerHours: 6
      },
      geometry: {
        type: 'Point',
        coordinates: [93.0150, 26.3280]
      }
    },
    // Relief Shelter: Morigaon Sports Stadium Relief Complex
    {
      type: 'Feature',
      id: 'as-shelter-stadium',
      properties: {
        id: 'as-shelter-stadium',
        entity: 'SHELTER',
        name: 'Morigaon District Sports Stadium Relief Complex',
        status: 'OPEN',
        totalCapacity: 3000,
        currentOccupancy: 2850,
        hasMedicalFacilities: true,
        hasFoodSupplies: true,
        suppliesDaysRemaining: 5.5
      },
      geometry: {
        type: 'Point',
        coordinates: [92.5180, 26.2480]
      }
    },
    // Relief Shelter: Silghat Higher Secondary School Camp
    {
      type: 'Feature',
      id: 'as-shelter-silghat',
      properties: {
        id: 'as-shelter-silghat',
        entity: 'SHELTER',
        name: 'Silghat Higher Secondary School Emergency Camp',
        status: 'OPEN',
        totalCapacity: 1200,
        currentOccupancy: 980,
        hasMedicalFacilities: true,
        hasFoodSupplies: true,
        suppliesDaysRemaining: 4.0
      },
      geometry: {
        type: 'Point',
        coordinates: [92.9320, 26.3420]
      }
    }
  ]
};

// =========================================================================
// 7. LANDSLIDE: Recent Jammu & Kashmir Mountain Landslide (NH-44 Corridor)
// Center: [75.2450, 33.2420]
// =========================================================================
export const LANDSLIDE_JK_GEOJSON = {
  type: 'FeatureCollection',
  features: [
    // Scarp 1: Panthyal Rockfall Chute & Slide Headscarp
    {
      type: 'Feature',
      id: 'jk-slide-panthyal',
      properties: {
        id: 'jk-slide-panthyal',
        entity: 'LANDSLIDE_SCARP',
        name: 'Panthyal Steel-Net Rockfall Headscarp',
        slopeAngleDeg: 54,
        debrisVolumeM3: 42000,
        soilSaturationPct: 96,
        factorOfSafety: 0.62,
        severity: 'CRITICAL',
        status: 'ACTIVE_SLIP',
        dataProvenance: 'RECENT_EVENT_PROTOTYPE: Border Roads Organisation (BRO) / IMD Ground Radar'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [75.228, 33.256],
          [75.244, 33.262],
          [75.252, 33.251],
          [75.234, 33.246],
          [75.228, 33.256]
        ]]
      }
    },
    // Scarp 2: Mehar Sinking Zone Slope Failure
    {
      type: 'Feature',
      id: 'jk-slide-mehar',
      properties: {
        id: 'jk-slide-mehar',
        entity: 'LANDSLIDE_SCARP',
        name: 'Mehar Mountain Sinking Zone (Chenab Gorge Slope)',
        slopeAngleDeg: 46,
        debrisVolumeM3: 110000,
        soilSaturationPct: 98,
        factorOfSafety: 0.58,
        severity: 'CRITICAL',
        status: 'ACTIVE_SLIP'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [75.210, 33.232],
          [75.232, 33.241],
          [75.238, 33.228],
          [75.216, 33.221],
          [75.210, 33.232]
        ]]
      }
    },
    // Debris Runout Fan across Chenab Valley Flank
    {
      type: 'Feature',
      id: 'jk-debris-runout',
      properties: {
        id: 'jk-debris-runout',
        entity: 'DEBRIS_FLOW_CORRIDOR',
        name: 'Panthyal-Mehar Debris Avalanche Chute',
        debrisThicknessM: 6.8,
        runoutDistanceKm: 4.2,
        severity: 'CRITICAL'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [75.220, 33.258],
          [75.260, 33.264],
          [75.275, 33.236],
          [75.242, 33.226],
          [75.220, 33.258]
        ]]
      }
    },
    // Blocked Road: NH-44 Panthyal Choke Point
    {
      type: 'Feature',
      id: 'jk-road-nh44-panthyal',
      properties: {
        id: 'jk-road-nh44-panthyal',
        entity: 'ROAD_SEGMENT',
        name: 'National Highway 44 (Panthyal Rockfall Sector)',
        status: 'BLOCKED',
        severity: 'CRITICAL',
        blockedLengthKm: 7.4,
        debrisVolumeM3: 18000,
        accessibilityScore: 0,
        description: 'NH-44 arterial corridor completely buried by boulder debris. 450 heavy transport trucks & civilian vehicles trapped on both flanks.'
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [75.215, 33.228],
          [75.235, 33.244],
          [75.258, 33.260]
        ]
      }
    },
    // Blocked Road: NH-44 Mehar Slide Road Bed Collapse
    {
      type: 'Feature',
      id: 'jk-road-nh44-mehar',
      properties: {
        id: 'jk-road-nh44-mehar',
        entity: 'ROAD_SEGMENT',
        name: 'NH-44 Mehar Segment (Road Slump into Gorge)',
        status: 'BLOCKED',
        severity: 'CRITICAL',
        blockedLengthKm: 4.1,
        accessibilityScore: 0,
        description: 'Road foundation sheared 4.5m downward toward Chenab riverbed. Impassable for all vehicular traffic.'
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [75.205, 33.218],
          [75.218, 33.232]
        ]
      }
    },
    // Blocked Mountain Link: Ramban-Gool Mountain Arterial
    {
      type: 'Feature',
      id: 'jk-road-gool-arterial',
      properties: {
        id: 'jk-road-gool-arterial',
        entity: 'ROAD_SEGMENT',
        name: 'Ramban-Gool Mountain Arterial Highway',
        status: 'BLOCKED',
        severity: 'HIGH',
        blockedLengthKm: 18.2,
        accessibilityScore: 0.1
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [75.180, 33.220],
          [75.120, 33.240],
          [75.050, 33.265]
        ]
      }
    },
    // RED Priority Rescue Zone: Panthyal-Mehar Active Slide Corridor
    {
      type: 'Feature',
      id: 'jk-rescue-red-panthyal',
      properties: {
        id: 'jk-rescue-red-panthyal',
        entity: 'RESCUE_ZONE',
        priority: 'RED',
        priorityLevel: 'RED',
        name: 'Sector 1 — Panthyal-Mehar High-Risk Slide Corridor',
        disasterType: 'Himalayan Mountain Landslide & NH-44 Highway Severance',
        priorityScore: 98,
        severity: 'CRITICAL',
        estimatedAreaKm2: 14.8,
        affectedPopulation: 6500,
        trappedCasualtiesEstimate: 340,
        damagedBuildings: 48,
        blockedRoads: 4,
        affectedRoads: 'National Highway 44 (Panthyal Shooting Stone Zone & Mehar Bridge Approach)',
        nearbyShelters: 'Ramban Higher Secondary School Transit Camp (3.2 km, 350 cap), Seri Gurdwara Camp (1.9 km)',
        nearbyFacilities: 'Ramban District Hospital (4.5 km, Operational), Maitra Power Sub-station',
        accessibilityStatus: 'TOTAL_HIGHWAY_SEVERANCE — Heavy Rockfall Across Both Carriageways',
        scoreRationale: 'Catastrophic slope failure along 48° dip-slope shale formation, burying 420m of NH-44 arterial lifeline with 340+ stranded convoy occupants and active shooting stones.',
        observedVsSimulated: 'OBSERVED (BRO Project Beacon Ground Telemetry & Drone Photogrammetry)',
        dataProvenance: 'Border Roads Organisation (BRO) / National Highways Authority of India (NHAI)',
        timestamp: '2026-10-26T18:30:00+05:30',
        roadAccessStatus: 'TOTAL_HIGHWAY_SEVERANCE',
        recommendedAction: 'Rapid deployment of BRO heavy earthmovers (CAT D8 dozers & excavators); IAF helicopter airlift for stranded vehicle passengers.',
        resourceNeeds: '6 Heavy BRO Excavators, 4 IAF Mi-17 Winch Helicopters, High-Altitude Medical Trauma Station'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [75.208, 33.226],
          [75.216, 33.238],
          [75.228, 33.249],
          [75.239, 33.258],
          [75.251, 33.266],
          [75.263, 33.264],
          [75.271, 33.254],
          [75.269, 33.242],
          [75.258, 33.232],
          [75.247, 33.224],
          [75.234, 33.218],
          [75.221, 33.216],
          [75.212, 33.219],
          [75.208, 33.226]
        ]]
      }
    },
    // RED Priority Rescue Zone: Pogal-Paristan Isolated Mountain Pocket
    {
      type: 'Feature',
      id: 'jk-rescue-red-pogal',
      properties: {
        id: 'jk-rescue-red-pogal',
        entity: 'RESCUE_ZONE',
        priority: 'RED',
        priorityLevel: 'RED',
        name: 'Sector 2 — Pogal-Paristan Cut-Off Mountain Communities',
        disasterType: 'High-Altitude Mountain Valley Isolation & Bridge Washout',
        priorityScore: 94,
        severity: 'CRITICAL',
        estimatedAreaKm2: 26.4,
        affectedPopulation: 12200,
        trappedCasualtiesEstimate: 75,
        damagedBuildings: 62,
        blockedRoads: 3,
        affectedRoads: 'Ukhral-Pogal Mountain Feeder Road (3 Bridges Washed Out), Paristan Mule Track',
        nearbyShelters: 'Ukhral Government High School (2.4 km, 400 cap), Senabati Community Centre (4.1 km)',
        nearbyFacilities: 'Banihal Sub-District Hospital (14.2 km, Heli-Transfer Required)',
        accessibilityStatus: 'ROAD_BRIDGES_WASHED_AWAY — Indian Army Aerial Heli-Drops Only',
        scoreRationale: 'Complete destruction of 3 river culvert bridges by raging torrents, isolating 12,200 villagers in steep terrain without vehicular access or grid power.',
        observedVsSimulated: 'OBSERVED (Indian Army 16 Corps Aerial Recon & SDRF Satellite Comms)',
        dataProvenance: 'Ramban District Administration / HQ Northern Command',
        timestamp: '2026-10-26T18:30:00+05:30',
        roadAccessStatus: 'ROAD_BRIDGES_WASHED_AWAY',
        recommendedAction: 'Indian Army helicopter air-drop of medical kits, insulin, dry rations, and satellite radio transceivers.',
        resourceNeeds: '8 Aerial Rations Drops Daily, 4 Portable Satellite Transceivers, Army Medical Team'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [75.291, 33.279],
          [75.308, 33.294],
          [75.328, 33.306],
          [75.349, 33.312],
          [75.367, 33.308],
          [75.378, 33.295],
          [75.382, 33.276],
          [75.374, 33.261],
          [75.356, 33.248],
          [75.337, 33.239],
          [75.319, 33.236],
          [75.302, 33.247],
          [75.292, 33.263],
          [75.291, 33.279]
        ]]
      }
    },
    // ORANGE Priority Rescue Zone: Gool-Gulabgarh Highland Valley
    {
      type: 'Feature',
      id: 'jk-rescue-orange-gool',
      properties: {
        id: 'jk-rescue-orange-gool',
        entity: 'RESCUE_ZONE',
        priority: 'ORANGE',
        priorityLevel: 'ORANGE',
        name: 'Sector 3 — Gool-Gulabgarh Highland Valley Fringe',
        disasterType: 'Mountain Flank Debris Inundation & Secondary Rockfall',
        priorityScore: 76,
        severity: 'HIGH',
        estimatedAreaKm2: 38.5,
        affectedPopulation: 18500,
        trappedCasualtiesEstimate: 20,
        damagedBuildings: 28,
        blockedRoads: 2,
        affectedRoads: 'Ramban-Gool Mountain Road (Fissured & Slumped km 12-18)',
        nearbyShelters: 'Gool Higher Secondary School Relief Camp (3.1 km, 600 cap)',
        nearbyFacilities: 'Gool Community Health Centre (3.5 km, Operational)',
        accessibilityStatus: 'PARTIAL_FOOTPATH_ONLY — Controlled Rock Blasting & BRO Clearing',
        scoreRationale: 'Deep tension cracks across 6.2 km of hillside roads threaten further mass movement; evacuation required before next precipitation band.',
        observedVsSimulated: 'OBSERVED (Geological Survey of India Satellite InSAR & Field Inspections)',
        dataProvenance: 'GSI Jammu Regional Office / PWD J&K',
        timestamp: '2026-10-26T18:30:00+05:30',
        roadAccessStatus: 'PARTIAL_FOOTPATH_ONLY',
        recommendedAction: 'Establish temporary foot ropeway and deploy BRO rock-clearing blast crews.',
        resourceNeeds: '2 Controlled Rock Blasting Teams, 1 Aerial Supply Ropeway, 300 Emergency Tents'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [75.022, 33.238],
          [75.043, 33.254],
          [75.074, 33.266],
          [75.109, 33.272],
          [75.138, 33.267],
          [75.156, 33.251],
          [75.161, 33.232],
          [75.152, 33.215],
          [75.131, 33.203],
          [75.101, 33.194],
          [75.068, 33.192],
          [75.041, 33.205],
          [75.026, 33.221],
          [75.022, 33.238]
        ]]
      }
    },
    // GREEN Monitored Safe Hub: Chanderkote Army Transit & Relief Staging Center
    {
      type: 'Feature',
      id: 'jk-rescue-green-chanderkote',
      properties: {
        id: 'jk-rescue-green-chanderkote',
        entity: 'RESCUE_ZONE',
        priority: 'GREEN',
        priorityLevel: 'GREEN',
        name: 'Sector 4 — Chanderkote Army Transit Base & Safe Staging Hub',
        disasterType: 'Stable River Terrace Bedrock Staging & Medical Triage Facility',
        priorityScore: 18,
        severity: 'LOW',
        estimatedAreaKm2: 12.1,
        affectedPopulation: 2500,
        trappedCasualtiesEstimate: 0,
        damagedBuildings: 0,
        blockedRoads: 0,
        affectedRoads: 'NH-44 Southbound Corridor (Clear to Udhampur & Jammu)',
        nearbyShelters: 'Chanderkote Army Transit Camp (0.2 km, 2000 cap), NHPC Baglihar Guest Complex (1.1 km)',
        nearbyFacilities: 'Military Base Hospital Chanderkote (0.3 km, Fully Staffed), Baglihar Hydro Substation',
        accessibilityStatus: 'OPEN_SOUTHBOUND_TO_JAMMU — Main Logistics Lifeline Unobstructed',
        scoreRationale: 'Massive competent limestone terrace bedrock, unimpacted by slope destabilization; serves as primary forward operations base for BRO dozers and heavy rotary airlift.',
        observedVsSimulated: 'OBSERVED (Indian Army Northern Command Logistics Directorate)',
        dataProvenance: 'Indian Army Corps of Engineers / Ramban District Magistrate',
        timestamp: '2026-10-26T18:30:00+05:30',
        roadAccessStatus: 'OPEN_SOUTHBOUND_TO_JAMMU',
        recommendedAction: 'Primary medical reception center, mass kitchen feeding, and helicopter staging pad.',
        resourceNeeds: 'Sustained Logistics Replenishment, Fuel Tankers, Mobile Field Hospital'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [75.171, 33.208],
          [75.183, 33.216],
          [75.197, 33.223],
          [75.211, 33.221],
          [75.219, 33.214],
          [75.218, 33.204],
          [75.206, 33.198],
          [75.192, 33.196],
          [75.179, 33.200],
          [75.171, 33.208]
        ]]
      }
    },
    // Critical Facility: Ramban District Hospital
    {
      type: 'Feature',
      id: 'jk-facility-hosp',
      properties: {
        id: 'jk-facility-hosp',
        entity: 'CRITICAL_FACILITY',
        type: 'HOSPITAL',
        name: 'Ramban District Hospital & Helipad',
        status: 'OPERATIONAL',
        priority: 'CRITICAL',
        riskLevel: 'HIGH',
        backupPowerHours: 48,
        patientCapacity: 180,
        currentOccupancy: 165
      },
      geometry: {
        type: 'Point',
        coordinates: [75.2410, 33.2430]
      }
    },
    // Shelter / Staging Post: Chanderkote Transit Camp
    {
      type: 'Feature',
      id: 'jk-shelter-chanderkote',
      properties: {
        id: 'jk-shelter-chanderkote',
        entity: 'SHELTER',
        name: 'Chanderkote National Highway Transit Camp',
        status: 'OPEN',
        totalCapacity: 2500,
        currentOccupancy: 1840,
        hasMedicalFacilities: true,
        hasFoodSupplies: true,
        suppliesDaysRemaining: 6.0
      },
      geometry: {
        type: 'Point',
        coordinates: [75.1850, 33.1950]
      }
    }
  ]
};

// =========================================================================
// 8. LANDSLIDE: Shimla Valley Catastrophic Slope Failure (Summer Hill / NH-5)
// Center: [77.1734, 31.1048]
// =========================================================================
export const LANDSLIDE_SHIMLA_GEOJSON = {
  type: 'FeatureCollection',
  features: [
    // Landslide Crown Scarp: Summer Hill & Shiv Bawdi Ground Zero
    {
      type: 'Feature',
      id: 'shimla-scarp-summerhill',
      properties: {
        id: 'shimla-scarp-summerhill',
        entity: 'LANDSLIDE_SCARP',
        name: 'Summer Hill Scarp & Shiv Bawdi Ground Zero',
        severity: 'CRITICAL',
        scarpElevationM: 2050,
        slopeAngleDeg: 52,
        scarpWidthM: 140,
        debrisVolumeM3: 24000,
        status: 'ACTIVE_SLIPPAGE',
        description: 'Steep hill scarp failure triggered by 180mm antecedent rainfall. 24,000 m³ limestone-shale debris slurry swept through Shiv Bawdi temple ravine.'
      },
      geometry: {
        type: 'Point',
        coordinates: [77.1350, 31.1140]
      }
    },
    // Debris Flow Runout Corridor: Summer Hill Ravine Chute
    {
      type: 'Feature',
      id: 'shimla-debris-summerhill',
      properties: {
        id: 'shimla-debris-summerhill',
        entity: 'DEBRIS_FLOW_CORRIDOR',
        name: 'Summer Hill Debris Avalanche Chute & Ravine Fan',
        debrisThicknessM: 5.4,
        runoutDistanceKm: 1.8,
        severity: 'CRITICAL',
        riskLevel: 'CRITICAL',
        estimatedArea: 2.8,
        exposedPopulation: 4800
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [77.130, 31.118],
          [77.142, 31.116],
          [77.146, 31.108],
          [77.134, 31.106],
          [77.130, 31.118]
        ]]
      }
    },
    // Secondary Scarp: Tutikandi Slope
    {
      type: 'Feature',
      id: 'shimla-scarp-tutikandi',
      properties: {
        id: 'shimla-scarp-tutikandi',
        entity: 'LANDSLIDE_SCARP',
        name: 'Tutikandi Slope Tension Crack & Slip Scarp',
        severity: 'HIGH',
        scarpElevationM: 1880,
        slopeAngleDeg: 46
      },
      geometry: {
        type: 'Point',
        coordinates: [77.1550, 31.0960]
      }
    },
    // Blocked UNESCO Heritage Railway: Kalka-Shimla Line
    {
      type: 'Feature',
      id: 'shimla-rail-kalka-shimla',
      properties: {
        id: 'shimla-rail-kalka-shimla',
        entity: 'INFRASTRUCTURE_SEVERANCE',
        name: 'Kalka-Shimla UNESCO Heritage Railway (Summer Hill Viaduct)',
        status: 'BLOCKED',
        condition: 'SUSPENDED_IN_AIR',
        severity: 'CRITICAL',
        description: '50-meter railway embankment sheared away beneath tracks; steel rails and ties suspended unsupported over 30m chasm.'
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [77.126, 31.119],
          [77.135, 31.114],
          [77.145, 31.110]
        ]
      }
    },
    // Blocked Road: NH-5 Kalka-Shimla National Highway (Tara Devi Sector)
    {
      type: 'Feature',
      id: 'shimla-road-nh5-taradevi',
      properties: {
        id: 'shimla-road-nh5-taradevi',
        entity: 'ROAD_SEGMENT',
        name: 'National Highway 5 (Kalka-Shimla Arterial - Tara Devi Choke Point)',
        status: 'BLOCKED',
        severity: 'CRITICAL',
        blockedLengthKm: 5.8,
        debrisVolumeM3: 8200,
        accessibilityScore: 0,
        description: 'NH-5 arterial link to Chandigarh buried under massive boulder fall. Essential relief logistics halted on highway.'
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [77.138, 31.082],
          [77.150, 31.090],
          [77.165, 31.098]
        ]
      }
    },
    // Partially Compromised Corridor: Cart Road (Shimla Circular Road)
    {
      type: 'Feature',
      id: 'shimla-road-cart-road',
      properties: {
        id: 'shimla-road-cart-road',
        entity: 'ROAD_SEGMENT',
        name: 'Shimla Circular Cart Road (Lift & High Court Sector)',
        status: 'PARTIALLY_BLOCKED',
        severity: 'HIGH',
        accessibilityScore: 45,
        description: 'Deep subsidence tension fissures along outer retaining breast wall. Restricted to emergency light vehicles.'
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [77.168, 31.101],
          [77.175, 31.104],
          [77.182, 31.106]
        ]
      }
    },
    // RED Priority Rescue Zone: Summer Hill & Shiv Bawdi Debris Sector
    {
      type: 'Feature',
      id: 'shimla-rescue-red-summerhill',
      properties: {
        id: 'shimla-rescue-red-summerhill',
        entity: 'RESCUE_ZONE',
        priority: 'RED',
        priorityLevel: 'RED',
        priorityHeight: 320,
        name: 'Sector 1 — Summer Hill & Shiv Bawdi Debris Sector',
        disasterType: 'Himalayan Urban Slope Failure & Debris Chute',
        priorityScore: 95,
        severity: 'CRITICAL',
        estimatedAreaKm2: 4.2,
        affectedPopulation: 4800,
        trappedCasualtiesEstimate: 21,
        damagedBuildings: 24,
        blockedRoads: 3,
        affectedRoads: 'Summer Hill HP University Link (Slumped 2.4m), Kalka-Shimla Railway Viaduct Corridor',
        nearbyShelters: 'HPU Gymnasium Relief Camp (0.8 km, 400 cap), Municipal Stadium (2.4 km, 1200 cap)',
        nearbyFacilities: 'Indira Gandhi Medical College (IGMC) Hospital (4.1 km, Operational)',
        accessibilityStatus: 'SEVERE_OBSTRUCTION — Tracked Excavators & Winch Lines Only',
        scoreRationale: 'Critical debris flow triggered by 168mm cloudburst, washing away ancient temple structures and suspending the UNESCO Kalka-Shimla rail line with 21 casualties.',
        observedVsSimulated: 'OBSERVED (HPSDMA Rapid Damage Survey & SDRF USAR Acoustic Detectors)',
        dataProvenance: 'Himachal Pradesh State Disaster Management Authority / GSI Shimla',
        timestamp: '2026-10-26T18:30:00+05:30',
        recommendedAction: 'Urgent SDRF & NDRF acoustic life-detector search in temple debris; heavy tracked rock breaker deployment; immediate wire mesh netting on active scarp.',
        resourceNeeds: '4 Heavy Tracked Excavators & Rock Breakers, 6 Canine USAR Squads, IGMC Mobile Trauma ICU'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [77.129, 31.119],
          [77.135, 31.121],
          [77.142, 31.119],
          [77.147, 31.114],
          [77.149, 31.108],
          [77.146, 31.103],
          [77.139, 31.101],
          [77.132, 31.103],
          [77.127, 31.109],
          [77.126, 31.114],
          [77.129, 31.119]
        ]]
      }
    },
    // ORANGE Priority Rescue Zone: Tara Devi & Tutikandi Corridor
    {
      type: 'Feature',
      id: 'shimla-rescue-orange-taradevi',
      properties: {
        id: 'shimla-rescue-orange-taradevi',
        entity: 'RESCUE_ZONE',
        priority: 'ORANGE',
        priorityLevel: 'ORANGE',
        priorityHeight: 180,
        name: 'Sector 2 — Tara Devi & Tutikandi Slope Corridor',
        disasterType: 'Highway Escarpment Rockfall & Hillside Creep',
        priorityScore: 74,
        severity: 'HIGH',
        estimatedAreaKm2: 8.6,
        affectedPopulation: 6200,
        trappedCasualtiesEstimate: 6,
        damagedBuildings: 12,
        blockedRoads: 2,
        affectedRoads: 'NH-5 Kalka-Shimla Arterial (Tara Devi Choke Point Boulders)',
        nearbyShelters: 'Tutikandi Parking Complex Emergency Base (1.2 km, 800 cap)',
        nearbyFacilities: 'Deen Dayal Upadhyay Zonal Hospital (3.8 km, Operational)',
        accessibilityStatus: 'PARTIALLY_RESTRICTED — Single-Lane Emergency Escort Only',
        scoreRationale: 'Recurrent boulder roll onto NH-5 severed direct logistical access to Chandigarh; slope reinforcement active.',
        observedVsSimulated: 'OBSERVED (PWD Himachal Pradesh & Traffic Police Patrols)',
        dataProvenance: 'NHAI / Shimla District Emergency Operations Centre',
        timestamp: '2026-10-26T18:30:00+05:30',
        recommendedAction: 'Clear single-lane emergency channel through rockfall zone on NH-5; establish high-clearance staging post.',
        resourceNeeds: '2 Tracked Dozers, 1 Rock Drill Rig, Police Escort Squads'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [77.144, 31.097],
          [77.152, 31.099],
          [77.161, 31.098],
          [77.167, 31.094],
          [77.169, 31.087],
          [77.165, 31.081],
          [77.156, 31.079],
          [77.147, 31.082],
          [77.141, 31.088],
          [77.144, 31.097]
        ]]
      }
    },
    // GREEN Monitored Zone: The Ridge & Mall Road Elevated Safe Plateau
    {
      type: 'Feature',
      id: 'shimla-rescue-green-ridge',
      properties: {
        id: 'shimla-rescue-green-ridge',
        entity: 'RESCUE_ZONE',
        priority: 'GREEN',
        priorityLevel: 'GREEN',
        priorityHeight: 90,
        name: 'Sector 3 — The Ridge & Mall Road Elevated Safe Plateau',
        disasterType: 'Stable Quartzite Ridge Crest & Central Command Staging',
        priorityScore: 22,
        severity: 'LOW',
        estimatedAreaKm2: 3.8,
        affectedPopulation: 12000,
        trappedCasualtiesEstimate: 0,
        damagedBuildings: 0,
        blockedRoads: 0,
        affectedRoads: 'Mall Road Pedestrian Ridge (Open, No Vehicular Damage)',
        nearbyShelters: 'Town Hall Central Coordination Complex (0.1 km), Ridge Water Tank Deck (0.2 km)',
        nearbyFacilities: 'IGMC Hospital (1.6 km via Sanjauli Link, Fully Operational)',
        accessibilityStatus: 'OPEN — Unrestricted Foot & Light Emergency Mobility',
        scoreRationale: 'Stable competent quartzite bedrock ridge crest designated as primary disaster coordination headquarters, public communication relay, and civilian assembly zone.',
        observedVsSimulated: 'OBSERVED (Shimla Municipal Corporation & District Administration)',
        dataProvenance: 'HPSDMA State Emergency Operations Centre',
        timestamp: '2026-10-26T18:30:00+05:30',
        description: 'Stable bedrock ridge crest designated as primary disaster coordination headquarters and civilian assembly zone.'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [77.167, 31.109],
          [77.174, 31.111],
          [77.182, 31.110],
          [77.187, 31.106],
          [77.186, 31.099],
          [77.179, 31.097],
          [77.171, 31.098],
          [77.165, 31.103],
          [77.167, 31.109]
        ]]
      }
    },
    // Critical Facility: Indira Gandhi Medical College (IGMC) Hospital
    {
      type: 'Feature',
      id: 'shimla-facility-igmc',
      properties: {
        id: 'shimla-facility-igmc',
        entity: 'CRITICAL_FACILITY',
        type: 'HOSPITAL',
        name: 'Indira Gandhi Medical College (IGMC) Hospital & Trauma Hub',
        status: 'OPERATIONAL',
        priority: 'CRITICAL',
        riskLevel: 'MEDIUM',
        backupPowerHours: 72,
        patientCapacity: 800,
        currentOccupancy: 690
      },
      geometry: {
        type: 'Point',
        coordinates: [77.1820, 31.1090]
      }
    },
    // Critical Facility: Deen Dayal Upadhyay Hospital
    {
      type: 'Feature',
      id: 'shimla-facility-ddu',
      properties: {
        id: 'shimla-facility-ddu',
        entity: 'CRITICAL_FACILITY',
        type: 'HOSPITAL',
        name: 'Deen Dayal Upadhyay (DDU) Zonal Hospital',
        status: 'OPERATIONAL',
        patientCapacity: 320,
        currentOccupancy: 260
      },
      geometry: {
        type: 'Point',
        coordinates: [77.1705, 31.1040]
      }
    },
    // Emergency Shelter: Municipal Indoor Stadium
    {
      type: 'Feature',
      id: 'shimla-shelter-stadium',
      properties: {
        id: 'shimla-shelter-stadium',
        entity: 'SHELTER',
        name: 'Shimla Municipal Indoor Stadium Emergency Camp',
        status: 'OPEN',
        totalCapacity: 850,
        currentOccupancy: 380,
        hasMedicalFacilities: true,
        hasFoodSupplies: true,
        suppliesDaysRemaining: 8.0
      },
      geometry: {
        type: 'Point',
        coordinates: [77.1650, 31.1010]
      }
    },
    // Emergency Shelter: Boileauganj School
    {
      type: 'Feature',
      id: 'shimla-shelter-boileauganj',
      properties: {
        id: 'shimla-shelter-boileauganj',
        entity: 'SHELTER',
        name: 'Govt Senior Secondary School Boileauganj Shelter',
        status: 'OPEN',
        totalCapacity: 400,
        currentOccupancy: 210,
        hasMedicalFacilities: false,
        hasFoodSupplies: true,
        suppliesDaysRemaining: 5.5
      },
      geometry: {
        type: 'Point',
        coordinates: [77.1420, 31.1070]
      }
    }
  ]
};

// =========================================================================
// Multi-Disaster GeoJSON Lookup
// =========================================================================
export function getGeoJsonForDisaster(disasterId?: string): any {
  if (!disasterId) return FLOOD_ASSAM_GEOJSON;

  const id = disasterId.toLowerCase();

  if (id.includes('shimla') || id.includes('himachal')) {
    return LANDSLIDE_SHIMLA_GEOJSON;
  }
  if (id.includes('assam')) {
    return FLOOD_ASSAM_GEOJSON;
  }
  if (id.includes('jk') || id.includes('kashmir') || id.includes('ramban')) {
    return LANDSLIDE_JK_GEOJSON;
  }
  if (id.includes('delhi')) {
    return DEFAULT_DELHI_GEOJSON;
  }
  if (id.includes('earthquake') || id.includes('bhuj')) {
    return EARTHQUAKE_BHUJ_GEOJSON;
  }
  if (id.includes('volcano') || id.includes('barren')) {
    return VOLCANO_BARREN_GEOJSON;
  }
  if (id.includes('cyclone') || id.includes('amphan') || id.includes('amrit')) {
    return CYCLONE_AMPHAN_GEOJSON;
  }
  if (id.includes('wildfire') || id.includes('similipal')) {
    return WILDFIRE_SIMILIPAL_GEOJSON;
  }

  // Default to Assam Flood GeoJSON
  return FLOOD_ASSAM_GEOJSON;
}


