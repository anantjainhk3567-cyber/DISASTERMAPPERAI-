import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from './components/layout/Layout';

// Page screen imports
import { AuthPage } from './pages/AuthPage';
import { OverviewPage } from './pages/OverviewPage';
import { LiveMapPage } from './pages/LiveMapPage';
import { IncidentsPage } from './pages/IncidentsPage';
import { IncidentDetailPage } from './pages/IncidentDetailPage';
import { FloodIntelligencePage } from './pages/FloodIntelligencePage';
import { EarthquakeIntelligencePage } from './pages/EarthquakeIntelligencePage';
import { VolcanoIntelligencePage } from './pages/VolcanoIntelligencePage';
import { CycloneIntelligencePage } from './pages/CycloneIntelligencePage';
import { WildfireIntelligencePage } from './pages/WildfireIntelligencePage';
import { LandslideIntelligencePage } from './pages/LandslideIntelligencePage';
import { SimulatorPage } from './pages/SimulatorPage';
import { SatelliteAnalysisPage } from './pages/SatelliteAnalysisPage';
import { ComparisonPage } from './pages/ComparisonPage';
import { PredictionValidationPage } from './pages/PredictionValidationPage';
import { RescuePrioritiesPage } from './pages/RescuePrioritiesPage';
import { EmergencyRoutingPage } from './pages/EmergencyRoutingPage';
import { SheltersPage } from './pages/SheltersPage';
import { ImpactAnalysisPage } from './pages/ImpactAnalysisPage';
import { CitizenReportPage } from './pages/CitizenReportPage';
import { ReportVerificationPage } from './pages/ReportVerificationPage';
import { TimelinePage } from './pages/TimelinePage';
import { AlertsPage } from './pages/AlertsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';
import { AISystemsPage } from './pages/AISystemsPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Authentication */}
          <Route path="/login" element={<AuthPage />} />

          {/* Operational Command Center with Global Layout */}
          <Route path="/" element={<Layout />}>
            {/* Core Operational */}
            <Route index element={<OverviewPage />} />
            <Route path="map" element={<LiveMapPage />} />
            <Route path="incidents" element={<IncidentsPage />} />
            <Route path="incidents/:id" element={<IncidentDetailPage />} />

            {/* Disaster Intelligence Boards */}
            <Route path="flood" element={<FloodIntelligencePage />} />
            <Route path="earthquake" element={<EarthquakeIntelligencePage />} />
            <Route path="volcano" element={<VolcanoIntelligencePage />} />
            <Route path="cyclone" element={<CycloneIntelligencePage />} />
            <Route path="wildfire" element={<WildfireIntelligencePage />} />
            <Route path="landslide" element={<LandslideIntelligencePage />} />

            {/* AI Systems & Simulation */}
            <Route path="ai-systems" element={<AISystemsPage />} />
            <Route path="simulator" element={<SimulatorPage />} />
            <Route path="imagery" element={<SatelliteAnalysisPage />} />
            <Route path="comparison" element={<ComparisonPage />} />
            <Route path="validation" element={<PredictionValidationPage />} />

            {/* Tactical Emergency Response Operations */}
            <Route path="priorities" element={<RescuePrioritiesPage />} />
            <Route path="routing" element={<EmergencyRoutingPage />} />
            <Route path="shelters" element={<SheltersPage />} />
            <Route path="impact" element={<ImpactAnalysisPage />} />
            <Route path="citizen-reports" element={<CitizenReportPage />} />
            <Route path="verification" element={<ReportVerificationPage />} />

            {/* Strategic Review, Diagnostics & Settings */}
            <Route path="timeline" element={<TimelinePage />} />
            <Route path="alerts" element={<AlertsPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Catch-all Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
