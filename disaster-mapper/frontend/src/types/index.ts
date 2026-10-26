export type UserRole = 'ADMIN' | 'ANALYST' | 'RESPONDER' | 'VIEWER' | 'CITIZEN';

export type DisasterType = 'FLOOD' | 'EARTHQUAKE' | 'VOLCANO' | 'CYCLONE' | 'LANDSLIDE' | 'WILDFIRE' | 'OTHER';
export type DisasterStatus = 'ACTIVE' | 'MONITORING' | 'RESOLVED';
export type Severity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type PriorityLevel = 'RED' | 'ORANGE' | 'GREEN';
export type RoadStatus = 'USABLE' | 'PARTIALLY_BLOCKED' | 'BLOCKED' | 'DAMAGED' | 'UNKNOWN';
export type DamageLevel = 'NONE' | 'MINOR' | 'MODERATE' | 'SEVERE' | 'DESTROYED';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organizationId: string;
}

export interface DisasterEvent {
  id: string;
  organizationId: string;
  name: string;
  type: DisasterType;
  status: DisasterStatus;
  severity: Severity;
  description?: string;
  centerLatitude: number;
  centerLongitude: number;
  startedAt: string;
  endedAt?: string;
  createdAt: string;
  updatedAt: string;
  affectedAreaKm2?: number;
  exposedPopulation?: number;
  blockedRoadCount?: number;
  damagedBuildingCount?: number;
  criticalFacilitiesAtRisk?: number;
  _count?: {
    buildingImpacts?: number;
    roadSegments?: number;
    floodZones?: number;
    settlementImpacts?: number;
    rescueZones?: number;
    analysisJobs?: number;
    citizenReports?: number;
    shelters?: number;
    criticalFacilities?: number;
  };
}

export interface RescueZone {
  id: string;
  disasterEventId: string;
  priorityScore: number;
  priorityLevel: PriorityLevel;
  affectedPopulation: number;
  damagedBuildings: number;
  blockedRoads: number;
  accessibilityScore: number;
  isolationScore: number;
  riskScore: number;
  recommendedAction?: string;
  geometry: any;
  createdAt: string;
  updatedAt: string;
  breakdown?: {
    score: number;
    level: PriorityLevel;
    factors: Record<string, {
      score: number;
      weight: number;
      weightedContribution: number;
      description: string;
      isEstimated: boolean;
    }>;
    missingData: string[];
    evidenceUsed: string[];
    recommendedAction: string;
  };
}

export interface RoadSegment {
  id: string;
  name?: string;
  roadType: string;
  status: RoadStatus;
  confidence: number;
  accessibilityScore: number;
  geometry: any;
}

export interface Shelter {
  id: string;
  disasterEventId?: string;
  name: string;
  address?: string;
  latitude: number;
  longitude: number;
  totalCapacity: number;
  currentOccupancy: number;
  availableCapacity: number;
  occupancyRate: number;
  status: 'OPEN' | 'FULL' | 'CLOSED' | 'DAMAGED';
  isAccessible: boolean;
  hasMedicalFacilities: boolean;
  hasFoodSupplies: boolean;
  contactPhone?: string;
  managerName?: string;
}

export interface CriticalFacility {
  id: string;
  name: string;
  type: 'HOSPITAL' | 'SCHOOL' | 'FIRE_STATION' | 'POLICE_STATION' | 'BRIDGE' | 'POWER_STATION' | 'WATER_TREATMENT';
  latitude: number;
  longitude: number;
  status: 'OPERATIONAL' | 'COMPROMISED' | 'DESTROYED' | 'ISOLATED';
  capacity?: number;
  backupPower: boolean;
  structuralDamageLevel: DamageLevel;
  operationalStatus?: string;
}

export interface CitizenReport {
  id: string;
  disasterEventId?: string;
  reporterName?: string;
  category: string;
  severity: Severity;
  description: string;
  latitude: number;
  longitude: number;
  locationName?: string;
  mediaUrl?: string;
  status: 'SUBMITTED' | 'PENDING_REVIEW' | 'CORROBORATED' | 'VERIFIED' | 'REJECTED' | 'RESOLVED';
  corroborationCount: number;
  verifiedBy?: string;
  verifiedAt?: string;
  rejectionReason?: string;
  createdAt: string;
}

export interface AlertNotification {
  id: string;
  disasterEventId?: string;
  title: string;
  message: string;
  severity: Severity;
  type: string;
  isAcknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  createdAt: string;
}

export interface TimelineEvent {
  id: string;
  disasterEventId: string;
  timestamp: string;
  title: string;
  description: string;
  eventType: string;
  snapshotData?: {
    rainfallMm?: number;
    alertLevel?: string;
    blockedRoads?: number;
    floodedAreaKm2?: number;
  };
}

export interface FloodForecast {
  id: string;
  disasterEventId: string;
  modelName: string;
  forecastHorizonHours: number;
  predictedRainfallMm: number;
  estimatedFloodAreaKm2: number;
  exposedPopulation: number;
  affectedRoadCount: number;
  confidence: number;
  methodology: string;
  isExperimental: boolean;
  generatedAt: string;
  riskPolygons?: any;
  drainageBottlenecks?: Array<{
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    status: string;
    capacityDeficitM3s: number;
    notes: string;
  }>;
}

export interface SimulationScenario {
  id: string;
  disasterEventId: string;
  scenarioName: string;
  rainfallAmountMm: number;
  durationHours: number;
  intensityMultiplier: number;
  drainageCapacityPercent: number;
  estimatedFloodAreaKm2: number;
  potentiallyAffectedRoads: number;
  exposedPopulation: number;
  estimatedShelterDemand: number;
  criticalFacilitiesAtRisk: number;
  resultGeoJson: any;
  createdAt: string;
}

export interface PredictionEvaluation {
  id: string;
  disasterEventId: string;
  modelName: string;
  targetDate: string;
  iouScore: number;
  precision: number;
  recall: number;
  f1Score: number;
  truePositiveAreaKm2: number;
  falsePositiveAreaKm2: number;
  falseNegativeAreaKm2: number;
  evaluationGeoJson?: any;
  notes?: string;
  evaluatedAt: string;
}

export interface RouteResult {
  route: any;
  recommended: {
    id: string;
    geometry: any;
    distanceMeters: number;
    estimatedTimeSeconds: number;
    safetyScore: number;
    accessibilityScore: number;
    status: string;
  };
  alternatives: Array<{
    id: string;
    geometry: any;
    distanceMeters: number;
    estimatedTimeSeconds: number;
    safetyScore: number;
    accessibilityScore: number;
    status: string;
    notes?: string;
  }>;
  distanceMeters: number;
  estimatedTimeSeconds: number;
  safetyScore: number;
  accessibilityScore: number;
  blockedSegments: Array<{
    id: string;
    name: string;
    status: string;
    roadType: string;
  }>;
  hasValidRoute: boolean;
  safetyNotice: string;
  vehicleType: string;
}

// ==========================================
// Multi-Hazard Intelligence Types
// ==========================================

export interface EarthquakeAssessment {
  id: string;
  magnitudeMw: number;
  focalDepthKm: number;
  epicenter: { lat: number; lng: number; regionName: string };
  maxPgaG: number;
  faultMechanism: string;
  shakeZones: Array<{
    mmi: 'IX' | 'VIII' | 'VII' | 'VI';
    description: string;
    radiusKm: number;
    color: string;
    affectedAreaKm2: number;
    estimatedPopulation: number;
  }>;
  structuralDamage: {
    collapsed: number;
    severe: number;
    moderate: number;
    minor: number;
  };
  criticalFacilities: Array<{
    id: string;
    name: string;
    type: 'HOSPITAL' | 'BRIDGE' | 'SCHOOL' | 'POWER_SUBSTATION' | 'FIRE_STATION';
    status: 'OPERATIONAL' | 'COMPROMISED' | 'COLLAPSED' | 'ISOLATED';
    damageLevel: DamageLevel;
    capacityLossPercent: number;
  }>;
  blockedCorridors: Array<{
    id: string;
    name: string;
    debrisVolumeM3: number;
    clearanceEtaHours: number;
    detourAvailable: boolean;
  }>;
  shelterDemand: {
    displacedPersons: number;
    shelterBedsAvailable: number;
    shortfall: number;
    fieldHospitalNeedCount: number;
  };
}

export interface VolcanoAssessment {
  id: string;
  volcanoName: string;
  alertLevel: 'NORMAL' | 'ADVISORY' | 'WATCH' | 'WARNING';
  veiIndex: number;
  summitElevationMsl: number;
  plumeAltitudeMsl: number;
  plumeTrajectoryDegrees: number;
  aviationCode: 'GREEN' | 'YELLOW' | 'ORANGE' | 'RED';
  exclusionZones: Array<{
    zone: '5KM_PYROCLASTIC_CORE' | '10KM_HAZARD_BUFFER' | '25KM_ASHFALL_ZONE';
    radiusKm: number;
    threatType: string;
    evacuationStatus: 'MANDATORY' | 'RECOMMENDED' | 'ADVISORY';
    settlementsAtRisk: number;
  }>;
  lavaFlows: Array<{
    id: string;
    ventName: string;
    advanceRateMetersPerHour: number;
    channelLengthKm: number;
    threatenedInfrastructure: string;
  }>;
  airQuality: {
    so2EmissionsTonsPerDay: number;
    pm25SpikePpm: number;
    acidRainRisk: 'LOW' | 'MODERATE' | 'HIGH';
  };
}

export interface CycloneAssessment {
  id: string;
  stormName: string;
  category: 'DEPRESSION' | 'CYCLONIC_STORM' | 'SEVERE_CS' | 'VERY_SEVERE_CS' | 'EXTREMELY_SEVERE_CS' | 'SUPER_CYCLONE';
  centralPressureHpa: number;
  maxSustainedWindKmh: number;
  gustSpeedKmh: number;
  forwardSpeedKmh: number;
  movementBearingDegrees: number;
  trackForecast: Array<{
    forecastHours: number;
    lat: number;
    lng: number;
    intensity: string;
    estimatedSurgeMeters: number;
  }>;
  windRadii: {
    radius64KtKm: number;
    radius50KtKm: number;
    radius34KtKm: number;
  };
  stormSurgeInundation: {
    peakSurgeMeters: number;
    inundatedCoastlineKm: number;
    coastalAreaFloodedKm2: number;
    breachedEmbankments: number;
  };
  coastalEvacuation: {
    totalPopInStormPath: number;
    targetEvacuees: number;
    alreadySheltered: number;
    remainingVulnerable: number;
  };
}

export interface WildfireAssessment {
  id: string;
  complexName: string;
  containmentPercent: number;
  activeBurningAreaKm2: number;
  rateOfSpreadKmh: number;
  fireRadiativePowerMw: number;
  fuelType: string;
  weatherConditions: {
    windSpeedKmh: number;
    windDirection: string;
    ambientTempC: number;
    relativeHumidityPercent: number;
  };
  thermalHotspotsCount: number;
  smokePlumeDispersionKm: number;
  threatenedSettlements: Array<{
    name: string;
    distanceToFireKm: number;
    population: number;
    evacuationOrder: 'VOLUNTARY' | 'MANDATORY' | 'COMPLETED';
  }>;
  firefightingAssetsDeployed: {
    groundCrews: number;
    fireEngines: number;
    aerialTankers: number;
    bulldozerLinesKm: number;
  };
}

export interface LandslideAssessment {
  id: string;
  locationName: string;
  slopeAngleDegrees: number;
  antecedentRainfallMm48h: number;
  soilSaturationPercent: number;
  estimatedDebrisVolumeM3: number;
  runoutDistanceKm: number;
  scarpElevationMsl: number;
  cutOffSettlements: Array<{
    id: string;
    name: string;
    population: number;
    accessCutOffBridge: string;
    waterSuppliesDays: number;
    airliftRequired: boolean;
  }>;
  blockedMountainRoads: Array<{
    highwayNumber: string;
    passName: string;
    debrisThicknessMeters: number;
    heavyExcavatorsNeeded: number;
  }>;
}

export interface HelpNeededResponseSector {
  sectorId: string;
  sectorName: string;
  disasterType: DisasterType;
  priorityLevel: PriorityLevel;
  priorityScore: number; // 0 - 100
  urgencyDriver: string;
  affectedPopulation: number;
  trappedCasualtiesEstimate: number;
  roadAccessStatus: 'CUT_OFF' | 'RESTRICTED' | 'USABLE';
  criticalFacilitiesCompromised: string[];
  requiredResources: Array<{
    resource: string;
    quantity: number;
    unit: string;
    icon: string;
    status: 'REQUESTED' | 'DISPATCHED' | 'ON_SITE';
  }>;
  primaryAction: string;
}
