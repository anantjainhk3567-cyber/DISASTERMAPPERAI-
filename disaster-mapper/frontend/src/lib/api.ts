import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('disastermapper_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      // Token expired or invalid
      if (!error.config.url.includes('/auth/login')) {
        console.warn('Session expired or unauthorized. Please re-authenticate.');
      }
    }
    return Promise.reject(error);
  }
);

// Typed API modules
export const api = {
  auth: {
    login: (data: { email: string; password: string }) => apiClient.post('/auth/login', data),
    register: (data: any) => apiClient.post('/auth/register', data),
    me: () => apiClient.get('/auth/me'),
    logout: () => apiClient.post('/auth/logout'),
  },
  disasters: {
    list: (params?: any) => apiClient.get('/disasters', { params }),
    getById: (id: string) => apiClient.get(`/disasters/${id}`),
    getSummary: (id: string) => apiClient.get(`/disasters/${id}/summary`),
    getStatistics: (id: string) => apiClient.get(`/disasters/${id}/statistics`),
    create: (data: any) => apiClient.post('/disasters', data),
    update: (id: string, data: any) => apiClient.patch(`/disasters/${id}`, data),
    delete: (id: string) => apiClient.delete(`/disasters/${id}`),
    getMapGeoJson: (id: string) => apiClient.get(`/disasters/${id}/map`),
  },
  priorities: {
    generate: (disasterId: string, weights?: any) => apiClient.post(`/disasters/${disasterId}/priorities/generate`, { weights }),
    list: (disasterId: string) => apiClient.get(`/disasters/${disasterId}/priorities`),
    getById: (disasterId: string, zoneId: string) => apiClient.get(`/disasters/${disasterId}/priorities/${zoneId}`),
    update: (disasterId: string, zoneId: string, data: any) => apiClient.patch(`/disasters/${disasterId}/priorities/${zoneId}`, data),
  },
  routing: {
    calculate: (disasterId: string, data: { origin: { lat: number; lng: number }; destination: { lat: number; lng: number }; vehicleType?: string }) =>
      apiClient.post(`/disasters/${disasterId}/routes/calculate`, data),
  },
  flood: {
    generateForecast: (disasterId: string, data: { predictedRainfallMm: number; forecastHorizonHours?: number; drainageEfficiencyPercent?: number }) =>
      apiClient.post(`/flood/${disasterId}/forecast`, data),
    getLatest: (disasterId: string) => apiClient.get(`/flood/${disasterId}/forecast/latest`),
    list: (disasterId: string) => apiClient.get(`/flood/${disasterId}/forecasts`),
  },
  simulations: {
    run: (disasterId: string, data: { scenarioName: string; rainfallAmountMm: number; durationHours: number; intensityMultiplier?: number; drainageCapacityPercent?: number }) =>
      apiClient.post(`/simulations/${disasterId}/run`, data),
    list: (disasterId: string) => apiClient.get(`/simulations/${disasterId}/scenarios`),
    getById: (scenarioId: string) => apiClient.get(`/simulations/scenario/${scenarioId}`),
    compare: (scenarioIdA: string, scenarioIdB: string) => apiClient.post('/simulations/compare', { scenarioIdA, scenarioIdB }),
  },
  citizenReports: {
    submit: (data: any) => apiClient.post('/citizen-reports', data),
    list: (params?: { disasterId?: string; status?: string }) => apiClient.get('/citizen-reports', { params }),
    getById: (id: string) => apiClient.get(`/citizen-reports/${id}`),
    review: (id: string, action: 'VERIFIED' | 'REJECTED' | 'RESOLVED', notes?: string) => apiClient.post(`/citizen-reports/${id}/review`, { action, notes }),
    getGeoJson: (disasterId?: string) => apiClient.get('/citizen-reports/geojson', { params: { disasterId } }),
  },
  shelters: {
    list: (disasterId?: string) => apiClient.get('/shelters', { params: { disasterId } }),
    getById: (id: string) => apiClient.get(`/shelters/${id}`),
    create: (data: any) => apiClient.post('/shelters', data),
    updateOccupancy: (id: string, currentOccupancy: number) => apiClient.patch(`/shelters/${id}/occupancy`, { currentOccupancy }),
    planEvacuation: (disasterId: string, data: { originLat: number; originLng: number; evacueeCount: number; requireAccessible?: boolean }) =>
      apiClient.post(`/shelters/${disasterId}/allocate`, data),
    getGeoJson: (disasterId?: string) => apiClient.get('/shelters/geojson', { params: { disasterId } }),
  },
  infrastructure: {
    list: (params?: { disasterId?: string; type?: string }) => apiClient.get('/infrastructure', { params }),
    assessImpact: (disasterId: string) => apiClient.get(`/infrastructure/${disasterId}/impact`),
    getGeoJson: (disasterId?: string) => apiClient.get('/infrastructure/geojson', { params: { disasterId } }),
  },
  timeline: {
    getEvents: (disasterId: string) => apiClient.get(`/timeline/${disasterId}/events`),
  },
  predictionValidation: {
    evaluate: (disasterId: string) => apiClient.get(`/prediction-validation/${disasterId}/evaluate`),
    list: (disasterId: string) => apiClient.get(`/prediction-validation/${disasterId}/history`),
  },
  alerts: {
    list: (params?: { disasterId?: string; severity?: string; isAcknowledged?: boolean }) => apiClient.get('/alerts', { params }),
    create: (data: any) => apiClient.post('/alerts', data),
    acknowledge: (id: string) => apiClient.patch(`/alerts/${id}/acknowledge`),
    acknowledgeAll: (disasterId?: string) => apiClient.post('/alerts/acknowledge-all', null, { params: { disasterId } }),
  },
  imagery: {
    list: (disasterId: string) => apiClient.get(`/disasters/${disasterId}/images`),
    uploadMetadata: (disasterId: string, data: any) => apiClient.post(`/disasters/${disasterId}/images`, data),
    triggerAnalysis: (imageId: string, models: string[]) => apiClient.post(`/images/${imageId}/analyze`, { models }),
    getJobStatus: (jobId: string) => apiClient.get(`/analysis/${jobId}`),
    getJobResults: (jobId: string) => apiClient.get(`/analysis/${jobId}/results`),
    changeDetection: (disasterId: string, beforeImageId: string, afterImageId: string) =>
      apiClient.post(`/disasters/${disasterId}/change-detection`, { beforeImageId, afterImageId }),
  },
  ai: {
    getModelRegistry: () => apiClient.get('/ai/models/registry'),
    getModel: (id: string) => apiClient.get(`/ai/models/${id}`),
    unloadModel: (id: string) => apiClient.post(`/ai/models/${id}/unload`),
    predictFloodSegmentation: (imageId: number, mode?: string) => apiClient.post('/ai/predict-flood-segmentation', { image_id: imageId, mode: mode || 'RGB' }),
    predictSusceptibility: (data: any) => apiClient.post('/ai/predict-susceptibility', data),
    predictFloodRisk: (data: any) => apiClient.post('/ai/predict-susceptibility', data),
    forecastRiver: (data: any) => apiClient.post('/ai/forecast-river', data),
    forecastRiverStage: (data: any) => apiClient.post('/ai/forecast-river', data),
    predictDamage: (data: any) => apiClient.post('/ai/predict-damage', data),
    verifyReport: (data: any) => apiClient.post('/ai/verify-report', data),
    orchestrateAgents: (data: any) => apiClient.post('/ai/agents/orchestrate', data),
    listAgentSessions: () => apiClient.get('/ai/agents/sessions'),
    getAgentSession: (id: string) => apiClient.get(`/ai/agents/sessions/${id}`),
    approveAgentAction: (data: { sessionId: string; requestId: string; operatorName?: string }) =>
      apiClient.post('/ai/agents/approve', { session_id: data.sessionId, request_id: data.requestId, operator_name: data.operatorName || 'Commander Ops' }),
    copilotChat: (data: { query: string; incidentId?: string; latitude?: number; longitude?: number; regionName?: string }) =>
      apiClient.post('/ai/copilot/chat', {
        query: data.query,
        incident_id: data.incidentId,
        latitude: data.latitude,
        longitude: data.longitude,
        region_name: data.regionName
      }),
  },
};
