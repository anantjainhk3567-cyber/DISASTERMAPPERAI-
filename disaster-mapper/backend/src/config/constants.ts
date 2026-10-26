export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

export const PRIORITY_WEIGHTS = {
  populationRisk: 0.30,
  buildingDamage: 0.25,
  isolation: 0.20,
  roadAccessibilityRisk: 0.15,
  disasterSeverity: 0.10
};

export const RATE_LIMITS = {
  auth: { max: 5, timeWindow: 60000 },
  api: { max: 100, timeWindow: 60000 },
  aiSubmission: { max: 10, timeWindow: 60000 }
};

export const CACHE_TTL = {
  summary: 300,
  map: 300,
  dashboard: 60
};

export const SEVERITY_SCORES = {
  LOW: 25,
  MEDIUM: 50,
  HIGH: 75,
  CRITICAL: 100
};

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/tiff',
  'image/webp'
];
