import {
  PrismaClient,
  OrganizationType,
  UserRole,
  DisasterType,
  DisasterStatus,
  Severity,
  DamageLevel,
  BuildingCriticality,
  RoadStatus,
  PriorityLevel
} from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed for DisasterMapper AI...');

  // Create Organization
  const org = await prisma.organization.create({
    data: {
      name: 'DisasterMapper National Response Command',
      type: OrganizationType.GOVERNMENT,
    },
  });

  console.log(`Created Organization: ${org.name}`);

  // Create Users with standard roles
  const passwordHash = await argon2.hash('Demo@123');
  
  const admin = await prisma.user.create({
    data: {
      name: 'Commander Admin',
      email: 'admin@demo.local',
      passwordHash,
      role: UserRole.ADMIN,
      organizationId: org.id,
    },
  });

  const analyst = await prisma.user.create({
    data: {
      name: 'Lead GIS Analyst',
      email: 'analyst@demo.local',
      passwordHash,
      role: UserRole.ANALYST,
      organizationId: org.id,
    },
  });

  const responder = await prisma.user.create({
    data: {
      name: 'Rescue Operations Responder',
      email: 'responder@demo.local',
      passwordHash,
      role: UserRole.RESPONDER,
      organizationId: org.id,
    },
  });

  const citizen = await prisma.user.create({
    data: {
      name: 'Public Citizen Reporter',
      email: 'citizen@demo.local',
      passwordHash,
      role: UserRole.CITIZEN,
      organizationId: org.id,
    },
  });

  console.log('Created Users: admin, analyst, responder, citizen');

  // Create Disaster Events
  const delhiFlood = await prisma.disasterEvent.create({
    data: {
      organizationId: org.id,
      name: 'Delhi NCR Urban Flood Emergency',
      type: DisasterType.FLOOD,
      status: DisasterStatus.ACTIVE,
      severity: Severity.CRITICAL,
      description: 'Severe urban inundation following 180mm continuous rainfall and Yamuna river cresting at 208.66m.',
      centerLatitude: 28.6139,
      centerLongitude: 77.2090,
      startedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
  });

  const himachalLandslide = await prisma.disasterEvent.create({
    data: {
      organizationId: org.id,
      name: 'Shimla Valley Landslide Catastrophe',
      type: DisasterType.LANDSLIDE,
      status: DisasterStatus.ACTIVE,
      severity: Severity.CRITICAL,
      description: 'Massive slope failure along Summer Hill scarp (24,000 m³) and Shiv Bawdi temple ravine, severing Kalka-Shimla rail and NH-5.',
      centerLatitude: 31.1048,
      centerLongitude: 77.1734,
      startedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
  });

  const assamFlood = await prisma.disasterEvent.create({
    data: {
      organizationId: org.id,
      name: 'Recent Assam Flood Emergency (Brahmaputra Basin)',
      type: DisasterType.FLOOD,
      status: DisasterStatus.ACTIVE,
      severity: Severity.CRITICAL,
      description: 'Severe monsoon inundation across 28 Assam districts. Brahmaputra cresting 1.8m above danger mark at Nematighat. NH-27 cut off at Jakhalabandha; 486 relief camps operational. Verified public context based on ASDMA / CWC telemetry.',
      centerLatitude: 26.3150,
      centerLongitude: 92.9376,
      startedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
  });

  const jkLandslide = await prisma.disasterEvent.create({
    data: {
      organizationId: org.id,
      name: 'Recent Jammu & Kashmir Mountain Landslide (NH-44 Corridor)',
      type: DisasterType.LANDSLIDE,
      status: DisasterStatus.ACTIVE,
      severity: Severity.CRITICAL,
      description: 'Torrential rainfall triggered massive slope failures along NH-44 at Panthyal, Mehar, and Cafeteria Morh. 14 high-altitude hamlets cut off in Ramban, Doda, and Kishtwar. Urgent aerial air-drop & BRO heavy earthmoving required.',
      centerLatitude: 33.2420,
      centerLongitude: 75.2450,
      startedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
  });

  console.log('Created Disaster Events: Delhi Flood, Shimla Landslide, Assam Flood, J&K Landslide');

  // Seed Data for Delhi Flood
  // Building Impacts
  const buildingDamages = [DamageLevel.DESTROYED, DamageLevel.SEVERE, DamageLevel.MODERATE, DamageLevel.MINOR, DamageLevel.NONE];
  const buildingCriticalities = [BuildingCriticality.HOSPITAL, BuildingCriticality.SCHOOL, BuildingCriticality.GOVERNMENT, BuildingCriticality.SHELTER, BuildingCriticality.NORMAL];
  
  for (let i = 0; i < 6; i++) {
    await prisma.buildingImpact.create({
      data: {
        disasterEventId: delhiFlood.id,
        damageLevel: buildingDamages[i % buildingDamages.length],
        criticality: buildingCriticalities[i % buildingCriticalities.length],
        confidence: 0.88 + (i * 0.02),
        geometry: { type: 'Point', coordinates: [77.2080 + (i * 0.002), 28.6120 + (i * 0.002)] },
        estimatedOccupants: 35 + i * 15,
      },
    });
  }

  // Road Segments
  const roadStatuses = [RoadStatus.USABLE, RoadStatus.BLOCKED, RoadStatus.PARTIALLY_BLOCKED, RoadStatus.DAMAGED];
  for (let i = 0; i < 6; i++) {
    await prisma.roadSegment.create({
      data: {
        disasterEventId: delhiFlood.id,
        name: `Urban Corridor Sector ${i + 1}`,
        status: roadStatuses[i % roadStatuses.length],
        geometry: { 
          type: 'LineString', 
          coordinates: [
            [77.2050 + (i * 0.003), 28.6100 + (i * 0.003)],
            [77.2090 + (i * 0.003), 28.6140 + (i * 0.003)],
            [77.2130 + (i * 0.003), 28.6180 + (i * 0.003)]
          ] 
        },
        confidence: 0.92,
        accessibilityScore: roadStatuses[i % roadStatuses.length] === RoadStatus.USABLE ? 95 : 20,
      },
    });
  }

  // Flood Zones
  await prisma.floodZone.create({
    data: {
      disasterEventId: delhiFlood.id,
      confidence: 0.94,
      severity: Severity.CRITICAL,
      estimatedArea: 8.5,
      estimatedDepth: 2.1,
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [77.200, 28.605],
          [77.225, 28.605],
          [77.225, 28.625],
          [77.200, 28.625],
          [77.200, 28.605]
        ]]
      }
    }
  });

  await prisma.floodZone.create({
    data: {
      disasterEventId: delhiFlood.id,
      confidence: 0.88,
      severity: Severity.HIGH,
      estimatedArea: 4.8,
      estimatedDepth: 1.2,
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [77.195, 28.620],
          [77.215, 28.620],
          [77.215, 28.635],
          [77.195, 28.635],
          [77.195, 28.620]
        ]]
      }
    }
  });

  // Settlement Impacts
  await prisma.settlementImpact.create({
    data: {
      disasterEventId: delhiFlood.id,
      estimatedPopulation: 6500,
      affectedPopulation: 3200,
      isolationScore: 78.5,
      geometry: { type: 'Point', coordinates: [77.211, 28.616] },
    }
  });

  await prisma.settlementImpact.create({
    data: {
      disasterEventId: delhiFlood.id,
      estimatedPopulation: 4200,
      affectedPopulation: 1400,
      isolationScore: 42.0,
      geometry: { type: 'Point', coordinates: [77.222, 28.624] },
    }
  });

  // Rescue Zones
  await prisma.rescueZone.create({
    data: {
      disasterEventId: delhiFlood.id,
      priorityScore: 88.0,
      priorityLevel: PriorityLevel.RED,
      affectedPopulation: 3200,
      damagedBuildings: 4,
      blockedRoads: 3,
      accessibilityScore: 15.0,
      isolationScore: 78.5,
      riskScore: 88.0,
      recommendedAction: 'Immediate amphibious vehicle and aerial rescue deployment. Critical water depth exceeds 2m.',
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [77.205, 28.610],
          [77.217, 28.610],
          [77.217, 28.622],
          [77.205, 28.622],
          [77.205, 28.610]
        ]]
      },
    }
  });

  await prisma.rescueZone.create({
    data: {
      disasterEventId: delhiFlood.id,
      priorityScore: 54.0,
      priorityLevel: PriorityLevel.ORANGE,
      affectedPopulation: 1400,
      damagedBuildings: 2,
      blockedRoads: 1,
      accessibilityScore: 60.0,
      isolationScore: 42.0,
      riskScore: 54.0,
      recommendedAction: 'Deploy high-clearance supply trucks along western ridge corridor.',
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [77.218, 28.620],
          [77.228, 28.620],
          [77.228, 28.630],
          [77.218, 28.630],
          [77.218, 28.620]
        ]]
      },
    }
  });

  // Shelters
  await prisma.shelter.create({
    data: {
      disasterEventId: delhiFlood.id,
      name: 'Central Municipal Sports Complex Shelter',
      address: 'Ring Road Sector 14, Delhi',
      latitude: 28.6220,
      longitude: 77.2050,
      totalCapacity: 800,
      currentOccupancy: 420,
      status: 'OPEN',
      isAccessible: true,
      hasMedicalFacilities: true,
      hasFoodSupplies: true,
      contactPhone: '+91-11-2334-9871',
      managerName: 'Major R. Sharma',
    }
  });

  await prisma.shelter.create({
    data: {
      disasterEventId: delhiFlood.id,
      name: 'North Ridge Community High School',
      address: 'University Enclave, Delhi',
      latitude: 28.6350,
      longitude: 77.2120,
      totalCapacity: 450,
      currentOccupancy: 395,
      status: 'OPEN',
      isAccessible: true,
      hasMedicalFacilities: false,
      hasFoodSupplies: true,
      contactPhone: '+91-11-2334-1122',
      managerName: 'Sunita Verma',
    }
  });

  await prisma.shelter.create({
    data: {
      disasterEventId: delhiFlood.id,
      name: 'East Riverbank Disaster Relief Camp',
      address: 'Mayur Vihar Extension',
      latitude: 28.6080,
      longitude: 77.2320,
      totalCapacity: 600,
      currentOccupancy: 600,
      status: 'FULL',
      isAccessible: false,
      hasMedicalFacilities: true,
      hasFoodSupplies: true,
      contactPhone: '+91-11-2334-5544',
      managerName: 'Capt. A. Khan',
    }
  });

  // Critical Facilities
  await prisma.criticalFacility.create({
    data: {
      disasterEventId: delhiFlood.id,
      name: 'Lok Nayak Trauma & Emergency Hospital',
      type: 'HOSPITAL',
      latitude: 28.6180,
      longitude: 77.2140,
      status: 'OPERATIONAL',
      capacity: 550,
      backupPower: true,
      structuralDamageLevel: DamageLevel.MINOR
    }
  });

  await prisma.criticalFacility.create({
    data: {
      disasterEventId: delhiFlood.id,
      name: 'Delhi Fire Service HQ & Water Rescue Station',
      type: 'FIRE_STATION',
      latitude: 28.6110,
      longitude: 77.2030,
      status: 'OPERATIONAL',
      backupPower: true
    }
  });

  await prisma.criticalFacility.create({
    data: {
      disasterEventId: delhiFlood.id,
      name: 'Wazirabad Water Treatment Plant',
      type: 'WATER_TREATMENT',
      latitude: 28.6290,
      longitude: 77.2280,
      status: 'COMPROMISED',
      structuralDamageLevel: DamageLevel.MODERATE,
      backupPower: false
    }
  });

  // Citizen Reports
  await prisma.citizenReport.create({
    data: {
      disasterEventId: delhiFlood.id,
      reporterName: 'Vikram Joshi',
      category: 'FLOODING',
      severity: Severity.CRITICAL,
      description: 'Water level reached 1.6m inside ground floor residential colony. Senior citizens trapped.',
      latitude: 28.6145,
      longitude: 77.2105,
      locationName: 'Yamuna Bazaar Colony',
      status: 'VERIFIED',
      corroborationCount: 4,
      verifiedBy: responder.id,
      verifiedAt: new Date()
    }
  });

  await prisma.citizenReport.create({
    data: {
      disasterEventId: delhiFlood.id,
      reporterName: 'Ananya Sengupta',
      category: 'ROAD_BLOCK',
      severity: Severity.HIGH,
      description: 'Submerged underpass with stranded commercial vehicles blocking access corridor.',
      latitude: 28.6190,
      longitude: 77.2080,
      locationName: 'ITO Underpass Corridor',
      status: 'CORROBORATED',
      corroborationCount: 2
    }
  });

  await prisma.citizenReport.create({
    data: {
      disasterEventId: delhiFlood.id,
      reporterName: 'Rajesh Mehra',
      category: 'STRUCTURAL_COLLAPSE',
      severity: Severity.HIGH,
      description: 'Boundary wall and transformer collapse next to school ground.',
      latitude: 28.6115,
      longitude: 77.2185,
      locationName: 'Civil Lines Outer Gate',
      status: 'SUBMITTED',
      corroborationCount: 0
    }
  });

  // Alert Notifications
  await prisma.alertNotification.create({
    data: {
      disasterEventId: delhiFlood.id,
      title: 'CRITICAL: Primary Evacuation Corridor Blocked',
      message: 'East bypass underpass submerged beyond 1.8m. Emergency ambulances must divert to Western Ridge.',
      severity: Severity.CRITICAL,
      type: 'ROAD_CLOSURE',
      isAcknowledged: false
    }
  });

  await prisma.alertNotification.create({
    data: {
      disasterEventId: delhiFlood.id,
      title: 'Shelter Capacity Alert: Mayur Vihar Camp FULL',
      message: 'East Riverbank Camp has reached maximum 600 person limit. Routing new evacuees to Sports Complex.',
      severity: Severity.HIGH,
      type: 'SHELTER_CAPACITY',
      isAcknowledged: true,
      acknowledgedBy: admin.id,
      acknowledgedAt: new Date()
    }
  });

  // Timeline Events
  await prisma.timelineEvent.create({
    data: {
      disasterEventId: delhiFlood.id,
      timestamp: new Date(Date.now() - 48 * 3600 * 1000),
      title: 'Warning Stage: Rainfall Accumulation Threshold Exceeded',
      description: 'Central Water Commission issued yellow advisory as upstream reservoirs released 2.5 lakh cusecs.',
      eventType: 'INITIAL_WARNING',
      snapshotData: { rainfallMm: 85, alertLevel: 'WARNING', blockedRoads: 0, floodedAreaKm2: 1.2 }
    }
  });

  await prisma.timelineEvent.create({
    data: {
      disasterEventId: delhiFlood.id,
      timestamp: new Date(Date.now() - 24 * 3600 * 1000),
      title: 'Peak Surge: River Yamuna Breaches Danger Mark',
      description: 'Water level crested at 208.66 meters. Multiple arterial roads and underpasses submerged.',
      eventType: 'WATER_PEAK',
      snapshotData: { rainfallMm: 180, alertLevel: 'CRITICAL', blockedRoads: 4, floodedAreaKm2: 13.3 }
    }
  });

  await prisma.timelineEvent.create({
    data: {
      disasterEventId: delhiFlood.id,
      timestamp: new Date(Date.now() - 6 * 3600 * 1000),
      title: 'Rescue Operations & High Priority Zone Stabilization',
      description: '14 boats deployed in RED priority zones. 815 citizens evacuated to operational shelters.',
      eventType: 'RESCUE_OPERATION',
      snapshotData: { rainfallMm: 180, alertLevel: 'ACTIVE_RESPONSE', blockedRoads: 3, floodedAreaKm2: 11.2 }
    }
  });

  // ==========================================
  // SEED CHILD RECORDS FOR SHIMLA LANDSLIDE
  // ==========================================
  // Rescue Zones
  await prisma.rescueZone.create({
    data: {
      disasterEventId: himachalLandslide.id,
      priorityScore: 95.0,
      priorityLevel: PriorityLevel.RED,
      affectedPopulation: 480,
      damagedBuildings: 8,
      blockedRoads: 2,
      accessibilityScore: 10.0,
      isolationScore: 92.0,
      riskScore: 95.0,
      recommendedAction: 'Deploy tracked heavy excavators and canine search squads; clear 24,000 m³ debris from Shiv Bawdi temple footprint.',
      geometry: {
        type: 'Polygon',
        coordinates: [[[77.130, 31.110], [77.142, 31.110], [77.142, 31.120], [77.130, 31.120], [77.130, 31.110]]]
      }
    }
  });

  await prisma.rescueZone.create({
    data: {
      disasterEventId: himachalLandslide.id,
      priorityScore: 74.0,
      priorityLevel: PriorityLevel.ORANGE,
      affectedPopulation: 4200,
      damagedBuildings: 4,
      blockedRoads: 1,
      accessibilityScore: 45.0,
      isolationScore: 50.0,
      riskScore: 74.0,
      recommendedAction: 'Establish single-lane emergency convoys on NH-5 around Tara Devi rockfall chute.',
      geometry: {
        type: 'Polygon',
        coordinates: [[[77.140, 31.090], [77.155, 31.090], [77.155, 31.105], [77.140, 31.105], [77.140, 31.090]]]
      }
    }
  });

  await prisma.rescueZone.create({
    data: {
      disasterEventId: himachalLandslide.id,
      priorityScore: 22.0,
      priorityLevel: PriorityLevel.GREEN,
      affectedPopulation: 12000,
      damagedBuildings: 0,
      blockedRoads: 0,
      accessibilityScore: 95.0,
      isolationScore: 10.0,
      riskScore: 22.0,
      recommendedAction: 'Maintain staging node and medical logistics coordination at The Ridge municipal grounds.',
      geometry: {
        type: 'Polygon',
        coordinates: [[[77.165, 31.100], [77.180, 31.100], [77.180, 31.115], [77.165, 31.115], [77.165, 31.100]]]
      }
    }
  });

  // Shelters
  await prisma.shelter.create({
    data: {
      disasterEventId: himachalLandslide.id,
      name: 'Shimla Municipal Indoor Stadium Shelter',
      address: 'Near The Ridge, Mall Road, Shimla',
      latitude: 31.1060,
      longitude: 77.1750,
      totalCapacity: 850,
      currentOccupancy: 340,
      status: 'OPEN',
      isAccessible: true,
      hasMedicalFacilities: true,
      hasFoodSupplies: true,
      contactPhone: '+91-177-280-4512',
      managerName: 'SDM Urban Shimla'
    }
  });

  await prisma.shelter.create({
    data: {
      disasterEventId: himachalLandslide.id,
      name: 'Boileauganj Senior Secondary School Shelter',
      address: 'Boileauganj Chowk, Shimla',
      latitude: 31.1080,
      longitude: 77.1420,
      totalCapacity: 400,
      currentOccupancy: 210,
      status: 'OPEN',
      isAccessible: true,
      hasMedicalFacilities: false,
      hasFoodSupplies: true,
      contactPhone: '+91-177-283-1190',
      managerName: 'Sunil Thakur'
    }
  });

  // Critical Facilities
  await prisma.criticalFacility.create({
    data: {
      disasterEventId: himachalLandslide.id,
      name: 'Indira Gandhi Medical College & Hospital (IGMC)',
      type: 'HOSPITAL',
      latitude: 31.1090,
      longitude: 77.1850,
      status: 'OPERATIONAL',
      capacity: 800,
      backupPower: true,
      structuralDamageLevel: DamageLevel.NONE
    }
  });

  await prisma.criticalFacility.create({
    data: {
      disasterEventId: himachalLandslide.id,
      name: 'Deen Dayal Upadhyay Hospital (Ripon)',
      type: 'HOSPITAL',
      latitude: 31.1040,
      longitude: 77.1700,
      status: 'OPERATIONAL',
      capacity: 300,
      backupPower: true,
      structuralDamageLevel: DamageLevel.NONE
    }
  });

  // Road Segments
  await prisma.roadSegment.create({
    data: {
      disasterEventId: himachalLandslide.id,
      name: 'Kalka-Shimla UNESCO Heritage Rail Track (Summer Hill Scarp)',
      status: RoadStatus.BLOCKED,
      geometry: {
        type: 'LineString',
        coordinates: [[77.1320, 31.1140], [77.1350, 31.1145], [77.1380, 31.1150]]
      },
      confidence: 0.98,
      accessibilityScore: 0
    }
  });

  await prisma.roadSegment.create({
    data: {
      disasterEventId: himachalLandslide.id,
      name: 'NH-5 Kalka-Shimla Highway (Tara Devi Bypass)',
      status: RoadStatus.BLOCKED,
      geometry: {
        type: 'LineString',
        coordinates: [[77.1450, 31.0950], [77.1490, 31.0980], [77.1530, 31.1020]]
      },
      confidence: 0.95,
      accessibilityScore: 10
    }
  });

  // Alerts
  await prisma.alertNotification.create({
    data: {
      disasterEventId: himachalLandslide.id,
      title: 'CRITICAL: Summer Hill Scarp Active Debris Movement',
      message: 'Excavation suspended temporarily due to active rockfall from crown scarp. Personnel evacuated to secondary safety zone.',
      severity: Severity.CRITICAL,
      type: 'ROAD_CLOSURE',
      isAcknowledged: false
    }
  });

  // ==========================================
  // SEED CHILD RECORDS FOR ASSAM FLOOD
  // ==========================================
  await prisma.floodZone.create({
    data: {
      disasterEventId: assamFlood.id,
      confidence: 0.96,
      severity: Severity.CRITICAL,
      estimatedArea: 2420.0,
      estimatedDepth: 2.8,
      geometry: {
        type: 'Polygon',
        coordinates: [[[92.800, 26.200], [93.100, 26.200], [93.100, 26.450], [92.800, 26.450], [92.800, 26.200]]]
      }
    }
  });

  await prisma.rescueZone.create({
    data: {
      disasterEventId: assamFlood.id,
      priorityScore: 96.0,
      priorityLevel: PriorityLevel.RED,
      affectedPopulation: 48000,
      damagedBuildings: 620,
      blockedRoads: 4,
      accessibilityScore: 8.0,
      isolationScore: 96.0,
      riskScore: 96.0,
      recommendedAction: 'Deploy 18 motorized inflatable zodiacs and medical barges to marooned sandbars; airdrop food packets.',
      geometry: {
        type: 'Polygon',
        coordinates: [[[92.850, 26.280], [92.980, 26.280], [92.980, 26.360], [92.850, 26.360], [92.850, 26.280]]]
      }
    }
  });

  await prisma.shelter.create({
    data: {
      disasterEventId: assamFlood.id,
      name: 'Nagaon Central Multi-Purpose Flood Shelter',
      address: 'Nagaon Town Bypass, Assam',
      latitude: 26.3450,
      longitude: 92.6840,
      totalCapacity: 1200,
      currentOccupancy: 840,
      status: 'OPEN',
      isAccessible: true,
      hasMedicalFacilities: true,
      hasFoodSupplies: true,
      contactPhone: '+91-3672-234-890',
      managerName: 'ASDMA Incident Commander'
    }
  });

  await prisma.criticalFacility.create({
    data: {
      disasterEventId: assamFlood.id,
      name: 'Kaliabor Sub-Divisional Civil Hospital',
      type: 'HOSPITAL',
      latitude: 26.5400,
      longitude: 93.0100,
      status: 'OPERATIONAL',
      capacity: 250,
      backupPower: true,
      structuralDamageLevel: DamageLevel.NONE
    }
  });

  await prisma.roadSegment.create({
    data: {
      disasterEventId: assamFlood.id,
      name: 'NH-27 Jakhalabandha Embankment Breach Corridor',
      status: RoadStatus.BLOCKED,
      geometry: {
        type: 'LineString',
        coordinates: [[92.980, 26.560], [93.020, 26.570], [93.060, 26.580]]
      },
      confidence: 0.99,
      accessibilityScore: 0
    }
  });

  // ==========================================
  // SEED CHILD RECORDS FOR J&K LANDSLIDE
  // ==========================================
  await prisma.rescueZone.create({
    data: {
      disasterEventId: jkLandslide.id,
      priorityScore: 94.0,
      priorityLevel: PriorityLevel.RED,
      affectedPopulation: 1400,
      damagedBuildings: 12,
      blockedRoads: 3,
      accessibilityScore: 5.0,
      isolationScore: 94.0,
      riskScore: 94.0,
      recommendedAction: 'BRO heavy rock-breakers & CAT D8 crawlers clearing 152,000 m³ rubble; prioritize air extraction for trapped buses.',
      geometry: {
        type: 'Polygon',
        coordinates: [[[75.210, 33.220], [75.270, 33.220], [75.270, 33.270], [75.210, 33.270], [75.210, 33.220]]]
      }
    }
  });

  await prisma.shelter.create({
    data: {
      disasterEventId: jkLandslide.id,
      name: 'Ramban Community Center Emergency Shelter',
      address: 'Main Chowk, Ramban, J&K',
      latitude: 33.2450,
      longitude: 75.2410,
      totalCapacity: 500,
      currentOccupancy: 380,
      status: 'OPEN',
      isAccessible: true,
      hasMedicalFacilities: true,
      hasFoodSupplies: true,
      contactPhone: '+91-1998-266-710',
      managerName: 'Tehsildar Ramban'
    }
  });

  await prisma.criticalFacility.create({
    data: {
      disasterEventId: jkLandslide.id,
      name: 'District Hospital Ramban',
      type: 'HOSPITAL',
      latitude: 33.2430,
      longitude: 75.2470,
      status: 'OPERATIONAL',
      capacity: 180,
      backupPower: true,
      structuralDamageLevel: DamageLevel.NONE
    }
  });

  await prisma.roadSegment.create({
    data: {
      disasterEventId: jkLandslide.id,
      name: 'NH-44 Jammu-Srinagar National Highway (Panthyal Sector)',
      status: RoadStatus.BLOCKED,
      geometry: {
        type: 'LineString',
        coordinates: [[75.230, 33.235], [75.245, 33.242], [75.260, 33.250]]
      },
      confidence: 0.98,
      accessibilityScore: 0
    }
  });

  console.log('Seeded complete DisasterMapper AI dataset successfully for all disaster theaters!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
