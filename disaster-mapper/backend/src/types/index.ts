export * from '@prisma/client';

export interface ApiResponse<T> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

export interface PaginatedResponse<T> {
  success: true;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface BoundingBox {
  minLat: number;
  minLng: number;
  maxLat: number;
  maxLng: number;
}

export type UserRole = 'ADMIN' | 'ANALYST' | 'RESPONDER' | 'VIEWER' | 'CITIZEN' | 'COMMANDER';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date | null;
  phone?: string | null;
  badgeNumber?: string | null;
  isActive?: boolean;
}

export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
  organizationId: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface PriorityWeights {
  populationRisk: number;
  buildingDamage: number;
  isolation: number;
  roadAccessibilityRisk: number;
  disasterSeverity: number;
}

export interface AnalysisResult {
  jobId: string;
  status: string;
  detections: DetectionResult[];
}

export interface DetectionResult {
  type: string;
  confidence: number;
  geometry: any;
  properties?: any;
}

export interface RouteRequest {
  origin: GeoPoint;
  destination: GeoPoint;
}

export interface RouteResponse {
  recommended: any;
  alternatives: any[];
  distanceMeters: number;
  estimatedTimeSeconds: number;
  safetyScore: number;
}

export interface DashboardOverview {
  activeDisasters: number;
  criticalZones: number;
  totalAffectedPopulation: number;
  blockedRoads: number;
}
