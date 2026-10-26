export const DEFAULT_DELHI_GEOJSON = {
  type: 'FeatureCollection',
  features: [
    // 1. Primary Yamuna Flood Inundation Polygon
    {
      type: 'Feature',
      id: 'flood-yamuna-main',
      properties: {
        id: 'flood-yamuna-main',
        entity: 'FLOOD_ZONE',
        type: 'FLOODED_AREA',
        name: 'Yamuna River Main Inundation Belt',
        severity: 'CRITICAL',
        riskLevel: 'CRITICAL',
        confidence: 0.96,
        status: 'ACTIVE',
        estimatedArea: 14.8,
        estimatedDepth: '2.5m - 4.1m',
        waterLevel: '208.66m (Danger Mark: 205.33m)'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [77.228, 28.715],
          [77.234, 28.695],
          [77.230, 28.672],
          [77.235, 28.658],
          [77.248, 28.642],
          [77.255, 28.625],
          [77.265, 28.590],
          [77.290, 28.560],
          [77.278, 28.558],
          [77.252, 28.588],
          [77.242, 28.622],
          [77.236, 28.645],
          [77.222, 28.665],
          [77.218, 28.690],
          [77.228, 28.715]
        ]]
      }
    },

    // 2. Secondary Embankment Breach Inundation (Monastery Market & Bela Road)
    {
      type: 'Feature',
      id: 'flood-monastery-breach',
      properties: {
        id: 'flood-monastery-breach',
        entity: 'FLOOD_ZONE',
        type: 'FLOODED_AREA',
        name: 'Monastery Market Embankment Breach Zone',
        severity: 'CRITICAL',
        riskLevel: 'CRITICAL',
        confidence: 0.93,
        status: 'ACTIVE',
        estimatedArea: 2.6,
        estimatedDepth: '1.8m - 2.8m'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [77.225, 28.675],
          [77.233, 28.674],
          [77.235, 28.663],
          [77.228, 28.660],
          [77.223, 28.668],
          [77.225, 28.675]
        ]]
      }
    },

    // 3. Rescue Zone RED: Kashmere Gate & Monastery Market
    {
      type: 'Feature',
      id: 'rescue-zone-red',
      properties: {
        id: 'rescue-zone-red',
        entity: 'RESCUE_ZONE',
        type: 'RESCUE_ZONE',
        name: 'Kashmere Gate / Monastery Sector',
        disasterType: 'Yamuna River Urban Inundation & Embankment Regulating Gate Backflow',
        priority: 'RED',
        priorityLevel: 'RED',
        severity: 'CRITICAL',
        priorityScore: 94,
        estimatedAreaKm2: 5.6,
        affectedPopulation: 4200,
        trappedCasualtiesEstimate: 68,
        damagedBuildings: 28,
        blockedRoads: 4,
        affectedRoads: 'Outer Ring Road (ISBT to Monastery Submerged 2.1m), Nigambodh Ghat Link Road',
        nearbyShelters: 'ISBT Multi-Level Transit Camp (0.5 km, 800 cap), Yamuna Sports Complex (4.2 km)',
        nearbyFacilities: 'Aruna Asaf Ali Civil Hospital (2.8 km, Operational), Chandgiram Akhara Substation',
        accessibilityStatus: '100% CUT_OFF — Motorized Inflatable Boat & High-Clearance Convoys Only',
        scoreRationale: 'Yamuna river stage reached 208.66m (all-time peak), breaching WHO regulator drain gate 12 and submerging Ring Road underpass and Tibetan Monastery lowlands.',
        observedVsSimulated: 'OBSERVED (Central Water Commission Old Railway Bridge Gauge Telemetry & Delhi Police Boat Recon)',
        dataProvenance: 'Delhi Disaster Management Authority (DDMA) / Irrigation & Flood Control Dept',
        timestamp: '2026-10-26T18:30:00+05:30',
        recommendedAction: 'Immediate amphibious boat deployment; high-clearance convoy evacuation to Yamuna Sports Complex.'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [77.223, 28.675],
          [77.229, 28.677],
          [77.235, 28.674],
          [77.239, 28.667],
          [77.240, 28.659],
          [77.234, 28.655],
          [77.227, 28.656],
          [77.222, 28.662],
          [77.221, 28.669],
          [77.223, 28.675]
        ]]
      }
    },

    // 4. Rescue Zone ORANGE: Yamuna Pushta Lowland Sector
    {
      type: 'Feature',
      id: 'rescue-zone-orange',
      properties: {
        id: 'rescue-zone-orange',
        entity: 'RESCUE_ZONE',
        type: 'RESCUE_ZONE',
        name: 'Yamuna Pushta Floodplain Sector',
        disasterType: 'Active Agricultural Floodplain Inundation',
        priority: 'ORANGE',
        priorityLevel: 'ORANGE',
        severity: 'HIGH',
        priorityScore: 81,
        estimatedAreaKm2: 9.2,
        affectedPopulation: 3100,
        trappedCasualtiesEstimate: 14,
        damagedBuildings: 15,
        blockedRoads: 2,
        affectedRoads: 'Pushta Bund Service Road (Crest Overtopped 0.3m), Geeta Colony Embankment Ramp',
        nearbyShelters: 'Shakarpur Community Center (1.8 km, 600 cap), Geeta Colony Stadium (2.2 km)',
        nearbyFacilities: 'Guru Gobind Singh Hospital (3.1 km, Operational)',
        accessibilityStatus: 'PARTIALLY_RESTRICTED — Tractor Convoys & High-Axle Vehicles Only',
        scoreRationale: 'Floodwaters overflowed eastern natural levees, flooding pastoral hamlets and nurseries between Old Iron Bridge and Geeta Colony.',
        observedVsSimulated: 'OBSERVED (East Delhi District Administration Evacuation Log)',
        dataProvenance: 'East Delhi DEOC / National Disaster Response Force 8th Bn',
        timestamp: '2026-10-26T18:30:00+05:30',
        recommendedAction: 'Staged evacuation to Shakarpur Community Center; deploy medical convoys.'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [77.239, 28.647],
          [77.247, 28.649],
          [77.255, 28.646],
          [77.259, 28.638],
          [77.258, 28.631],
          [77.250, 28.628],
          [77.242, 28.632],
          [77.238, 28.640],
          [77.239, 28.647]
        ]]
      }
    },

    // 5. Rescue Zone GREEN: Mayur Vihar Phase-1 Staging
    {
      type: 'Feature',
      id: 'rescue-zone-green',
      properties: {
        id: 'rescue-zone-green',
        entity: 'RESCUE_ZONE',
        type: 'RESCUE_ZONE',
        name: 'Mayur Vihar Phase-1 Staging Base',
        disasterType: 'High-Ground Elevated Sector Staging & Shelter Facility',
        priority: 'GREEN',
        priorityLevel: 'GREEN',
        severity: 'MEDIUM',
        priorityScore: 52,
        estimatedAreaKm2: 4.5,
        affectedPopulation: 1200,
        trappedCasualtiesEstimate: 0,
        damagedBuildings: 2,
        blockedRoads: 0,
        affectedRoads: 'Noida Link Road (Fully Open, Elevated Flyover Passing Above Floodplain)',
        nearbyShelters: 'Mayur Vihar Phase-1 Metro Station Concourse (0.2 km), Pocket-1 Community Hall (0.4 km)',
        nearbyFacilities: 'Lal Bahadur Shastri Hospital (3.4 km, Fully Operational)',
        accessibilityStatus: 'OPEN — Full Vehicular & Transit Access',
        scoreRationale: 'High-ground urban embankment protected by concrete floodwalls, serving as primary receiving center for trans-Yamuna evacuees.',
        observedVsSimulated: 'OBSERVED (District Disaster Control Room East Delhi)',
        dataProvenance: 'DDMA / Delhi Police Traffic Control',
        timestamp: '2026-10-26T18:30:00+05:30',
        recommendedAction: 'Active monitoring; maintain emergency bus shuttle routes.'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [77.281, 28.614],
          [77.289, 28.616],
          [77.297, 28.613],
          [77.301, 28.605],
          [77.298, 28.598],
          [77.289, 28.596],
          [77.282, 28.601],
          [77.279, 28.608],
          [77.281, 28.614]
        ]]
      }
    },

    // 6. Blocked Road: Ring Road (Monastery to ISBT)
    {
      type: 'Feature',
      id: 'road-ring-road',
      properties: {
        id: 'road-ring-road',
        entity: 'ROAD_SEGMENT',
        name: 'Mahatma Gandhi Marg (Ring Road at Monastery)',
        status: 'BLOCKED',
        type: 'PRIMARY_HIGHWAY',
        accessibilityScore: 0,
        severity: 'CRITICAL',
        confidence: 0.98,
        description: 'Submerged under 1.8m water. Traffic strictly prohibited.'
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [77.223, 28.680],
          [77.227, 28.670],
          [77.230, 28.665],
          [77.234, 28.658]
        ]
      }
    },

    // 7. Blocked Road: Vikas Marg ITO Underpass
    {
      type: 'Feature',
      id: 'road-ito-underpass',
      properties: {
        id: 'road-ito-underpass',
        entity: 'ROAD_SEGMENT',
        name: 'Vikas Marg (ITO Barrage Underpass)',
        status: 'BLOCKED',
        type: 'ARTERIAL',
        accessibilityScore: 5,
        severity: 'CRITICAL',
        confidence: 0.96,
        description: 'Underpass inundated up to 2.1m. Heavy waterlogging.'
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [77.248, 28.631],
          [77.255, 28.630],
          [77.262, 28.629]
        ]
      }
    },

    // 8. Partially Blocked Road: Salim Garh Bypass
    {
      type: 'Feature',
      id: 'road-salimgarh-bypass',
      properties: {
        id: 'road-salimgarh-bypass',
        entity: 'ROAD_SEGMENT',
        name: 'Salim Garh Fort Elevated Bypass',
        status: 'PARTIALLY_BLOCKED',
        type: 'SECONDARY',
        accessibilityScore: 45,
        severity: 'HIGH',
        confidence: 0.88,
        description: 'Single lane passable for emergency vehicles only.'
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [77.237, 28.658],
          [77.242, 28.650],
          [77.245, 28.643]
        ]
      }
    },

    // 9. Shelter: Yamuna Sports Complex
    {
      type: 'Feature',
      id: 'shelter-yamuna-sports',
      properties: {
        id: 'shelter-yamuna-sports',
        entity: 'SHELTER',
        type: 'EMERGENCY_SHELTER',
        name: 'Yamuna Sports Complex Relief Hub',
        status: 'ACTIVE',
        totalCapacity: 1500,
        currentOccupancy: 1180,
        availableCapacity: 320,
        isAccessible: true,
        contactPhone: '+91 11 2216 4455',
        description: 'Fully equipped medical post, dry rations, high generator backup.'
      },
      geometry: {
        type: 'Point',
        coordinates: [77.305, 28.658]
      }
    },

    // 10. Shelter: Sarai Kale Khan Camp
    {
      type: 'Feature',
      id: 'shelter-sarai-kale-khan',
      properties: {
        id: 'shelter-sarai-kale-khan',
        entity: 'SHELTER',
        type: 'EMERGENCY_SHELTER',
        name: 'Sarai Kale Khan Rain Basera Camp',
        status: 'ACTIVE',
        totalCapacity: 600,
        currentOccupancy: 480,
        availableCapacity: 120,
        isAccessible: true,
        contactPhone: '+91 11 2435 8890',
        description: 'Transit relief shelter with emergency water purification tankers.'
      },
      geometry: {
        type: 'Point',
        coordinates: [77.258, 28.592]
      }
    },

    // 11. Shelter: Shakarpur Community Center
    {
      type: 'Feature',
      id: 'shelter-shakarpur',
      properties: {
        id: 'shelter-shakarpur',
        entity: 'SHELTER',
        type: 'EMERGENCY_SHELTER',
        name: 'Shakarpur Municipal Community Shelter',
        status: 'ACTIVE',
        totalCapacity: 450,
        currentOccupancy: 290,
        availableCapacity: 160,
        isAccessible: true,
        contactPhone: '+91 11 2244 1122',
        description: 'Community relief staging center with kitchen.'
      },
      geometry: {
        type: 'Point',
        coordinates: [77.279, 28.626]
      }
    },

    // 12. Critical Facility: LNJP Hospital
    {
      type: 'Feature',
      id: 'facility-lnjp',
      properties: {
        id: 'facility-lnjp',
        entity: 'CRITICAL_FACILITY',
        type: 'HOSPITAL',
        name: 'Lok Nayak Jai Prakash (LNJP) Hospital',
        status: 'OPERATIONAL',
        capacity: 2000,
        backupPower: true,
        damageLevel: 'NONE',
        description: 'Designated primary regional disaster receiving hospital. Trauma bay active.'
      },
      geometry: {
        type: 'Point',
        coordinates: [77.241, 28.636]
      }
    },

    // 13. Critical Facility: Wazirabad Water Treatment Plant
    {
      type: 'Feature',
      id: 'facility-wazirabad-wtp',
      properties: {
        id: 'facility-wazirabad-wtp',
        entity: 'CRITICAL_FACILITY',
        type: 'WATER_PLANT',
        name: 'Wazirabad Water Treatment Plant (131 MGD)',
        status: 'CRITICAL_RISK',
        capacity: 131,
        backupPower: true,
        damageLevel: 'MODERATE',
        description: 'Pump house surrounded by flood waters; secondary bunds reinforced.'
      },
      geometry: {
        type: 'Point',
        coordinates: [77.232, 28.712]
      }
    },

    // 14. Critical Facility: Rajghat Power Substation
    {
      type: 'Feature',
      id: 'facility-rajghat-substation',
      properties: {
        id: 'facility-rajghat-substation',
        entity: 'CRITICAL_FACILITY',
        type: 'POWER_SUBSTATION',
        name: 'Rajghat 220kV Electrical Substation',
        status: 'MONITORING',
        capacity: 450,
        backupPower: true,
        damageLevel: 'MINOR',
        description: 'Perimeter pumps functioning; continuous moisture monitoring active.'
      },
      geometry: {
        type: 'Point',
        coordinates: [77.248, 28.641]
      }
    },

    // 15. Citizen Report: Ring Road Embankment Breach
    {
      type: 'Feature',
      id: 'report-monastery-breach',
      properties: {
        id: 'report-monastery-breach',
        entity: 'CITIZEN_REPORT',
        type: 'FLOODING',
        severity: 'CRITICAL',
        status: 'VERIFIED',
        description: 'Water breached ring road embankment at Monastery Market. 3 vehicles submerged.',
        corroborationCount: 14,
        isVerified: true
      },
      geometry: {
        type: 'Point',
        coordinates: [77.231, 28.669]
      }
    },

    // 16. Citizen Report: Stranded Families near Bela Road
    {
      type: 'Feature',
      id: 'report-bela-road-stranded',
      properties: {
        id: 'report-bela-road-stranded',
        entity: 'CITIZEN_REPORT',
        type: 'STRANDED_PERSONS',
        severity: 'CRITICAL',
        status: 'PENDING',
        description: '8 families and livestock cut off near Bela Road islet. Water rising rapidly.',
        corroborationCount: 9,
        isVerified: true
      },
      geometry: {
        type: 'Point',
        coordinates: [77.242, 28.652]
      }
    },

    // 17. Citizen Report: Sewage Backflow at Vikas Marg
    {
      type: 'Feature',
      id: 'report-vikas-marg-sewage',
      properties: {
        id: 'report-vikas-marg-sewage',
        entity: 'CITIZEN_REPORT',
        type: 'INFRASTRUCTURE',
        severity: 'HIGH',
        status: 'VERIFIED',
        description: 'Severe sewage backflow on Vikas Marg heading towards Laxmi Nagar.',
        corroborationCount: 7,
        isVerified: true
      },
      geometry: {
        type: 'Point',
        coordinates: [77.265, 28.630]
      }
    }
  ]
};
