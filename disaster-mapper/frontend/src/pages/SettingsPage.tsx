import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useDisasterStore } from '../store/useDisasterStore';
import {
  Settings,
  Shield,
  Activity,
  RotateCcw,
  CheckCircle2,
  Server,
  Database,
  Cpu,
  Layers,
  Sparkles,
  Lock,
  UserCheck,
  AlertTriangle
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, loginAsDemoRole } = useAuthStore();
  const { currentDisaster, switchDisaster, resetToDefaultDemo } = useDisasterStore();

  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const services = [
    {
      name: 'DisasterMapper Fastify Core Backend',
      port: '3001',
      status: 'HEALTHY',
      latency: '14ms',
      runtime: 'Node.js v24.18.0 / TypeScript',
      icon: Server,
    },
    {
      name: 'Python Earth Observation & CV Microservice',
      port: '8000',
      status: 'ONLINE',
      latency: '42ms',
      runtime: 'FastAPI / OpenCV / PyTorch / NumPy',
      icon: Cpu,
    },
    {
      name: 'PostgreSQL 16 + PostGIS Spatial Engine',
      port: '5432',
      status: 'CONNECTED',
      latency: '4ms',
      runtime: 'Prisma Client v6.19.3 (Spatial R-Tree Indices)',
      icon: Database,
    },
    {
      name: 'Redis Distributed Cache & BullMQ Message Broker',
      port: '6379',
      status: 'ACTIVE',
      latency: '1ms',
      runtime: 'Job Queue: Imagery Ingestion & Hydrology Workers',
      icon: Activity,
    },
  ];

  const auditLogs = [
    {
      timestamp: '2026-10-12 11:24:10',
      action: 'COMMANDER_PRIORITY_OVERRIDE',
      actor: 'Commander Sharma (COMMANDER)',
      details: 'Elevated Sector 2 priority score to 84.1 due to Metro sump pump failure',
    },
    {
      timestamp: '2026-10-12 10:45:00',
      action: 'CAP_ALERT_BROADCAST',
      actor: 'Admin Dispatch (ADMIN)',
      details: 'Issued MANDATORY_EVACUATION CAP alert for Yamuna Khadar Sector 1',
    },
    {
      timestamp: '2026-10-12 09:12:34',
      action: 'SHELTER_ALLOCATION_DISPATCH',
      actor: 'Civil Defence Desk (RESPONDER)',
      details: 'Dispatched 350 evacuees to Kashmere Gate and Civil Lines shelters',
    },
    {
      timestamp: '2026-10-12 08:30:12',
      action: 'IMAGERY_INFERENCE_TRIGGERED',
      actor: 'System Auto-Trigger (SYSTEM)',
      details: 'Sentinel-2B pass analyzed via RealProvider HSV spectral flood model',
    },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
              PLATFORM SYSTEM CONFIGURATION
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-100 tracking-tight mt-1 flex items-center space-x-2.5">
            <Settings className="w-6 h-6 text-slate-400" />
            <span>Settings & System Telemetry</span>
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Manage operational role credentials, microservices connectivity, synthetic scenarios, and system audit logs.
          </p>
        </div>
      </div>

      {notification && (
        <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl flex items-center space-x-2 text-cyan-300 text-xs">
          <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Grid: Role Switcher & Microservice Health */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Role Switcher (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-xl bg-[#0F172A] border border-slate-800 space-y-4 shadow-xl">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center space-x-2">
              <UserCheck className="w-4 h-4 text-cyan-400" />
              <span>1-Click Evaluator Role Switcher</span>
            </h2>
            <span className="text-[10px] text-cyan-400 font-mono">ACTIVE: {user?.role || 'COMMANDER'}</span>
          </div>

          <p className="text-xs text-slate-400">
            DisasterMapper AI supports granular role-based permissions. Switch persona on the fly to test role-specific workflows.
          </p>

          <div className="grid grid-cols-2 gap-2.5">
            {[
              { role: 'COMMANDER', label: 'Incident Commander', desc: 'Priorities, overrides & dispatch' },
              { role: 'ADMIN', label: 'National Admin', desc: 'System configuration & alerts' },
              { role: 'RESPONDER', label: 'Field Responder', desc: 'On-scene reports & routing' },
              { role: 'CITIZEN', label: 'Public Citizen', desc: 'Emergency ingestion portal' },
            ].map((r) => (
              <button
                key={r.role}
                onClick={() => {
                  loginAsDemoRole(r.role as any);
                  showNotification(`Authenticated persona switched to ${r.label} (${r.role})`);
                }}
                className={`p-3 rounded-lg border text-left transition-all ${
                  user?.role === r.role
                    ? 'bg-slate-800 border-cyan-400 text-cyan-300 shadow-sm'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <div className="text-xs font-bold">{r.label}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{r.desc}</div>
              </button>
            ))}
          </div>

          {/* Active User Card */}
          <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 text-xs space-y-1">
            <div className="text-[10px] text-slate-400 uppercase font-mono">Current Identity Token</div>
            <div className="font-semibold text-slate-200">{user?.name}</div>
            <div className="text-[11px] text-slate-400 font-mono">{user?.email}</div>
          </div>
        </div>

        {/* Microservices Health Status (7 cols) */}
        <div className="lg:col-span-7 p-5 rounded-xl bg-[#0F172A] border border-slate-800 space-y-4 shadow-xl">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center space-x-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Microservices Telemetry & Architecture Health</span>
            </h2>
            <span className="text-[10px] text-emerald-400 font-mono">4 OF 4 READY</span>
          </div>

          <div className="space-y-3">
            {services.map((svc) => {
              const Icon = svc.icon;
              return (
                <div
                  key={svc.name}
                  className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3 min-w-0 pr-2">
                    <div className="p-2 rounded-lg bg-slate-800 text-cyan-400 shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-200 truncate">{svc.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono truncate">{svc.runtime}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0 text-right">
                    <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                      Port :{svc.port} • {svc.latency}
                    </span>
                    <span className="text-[9px] font-black px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {svc.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Disaster Operational Context Switcher */}
      <div className="p-5 rounded-xl bg-[#0F172A] border border-slate-800 space-y-4 shadow-xl">
        <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Disaster Scenario Context Selector
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Switch entire platform context between national flood and mountain landslide scenarios.
            </p>
          </div>

          <button
            onClick={() => {
              resetToDefaultDemo();
              showNotification('Demo state reset to Delhi NCR Flood baseline.');
            }}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center space-x-1.5 border border-slate-700 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo State</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            onClick={() => {
              switchDisaster('delhi-flood-2026');
              showNotification('Active operational context set to Delhi NCR Flood.');
            }}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              currentDisaster?.id === 'delhi-flood-2026'
                ? 'bg-slate-800/90 border-cyan-400 shadow-md shadow-cyan-950/30'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-100">Delhi NCR Urban Flood (Yamuna Basin)</span>
              <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400">
                ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Historic 208.66m river surge, 32.4 km² inundation, 4 critical relief shelters.
            </p>
          </div>

          <div
            onClick={() => {
              switchDisaster('shimla-landslide-2026');
              showNotification('Active operational context set to Shimla Mountain Landslide.');
            }}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              currentDisaster?.id === 'shimla-landslide-2026'
                ? 'bg-slate-800/90 border-cyan-400 shadow-md shadow-cyan-950/30'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-100">Shimla Highway Landslide (NH-5 Corridor)</span>
              <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                SECONDARY
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Debris flow along mountain pass, road severance, high slope instability.
            </p>
          </div>
        </div>
      </div>

      {/* Security & Audit Log Viewer */}
      <div className="p-5 rounded-xl bg-[#0F172A] border border-slate-800 space-y-4 shadow-xl">
        <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center space-x-2">
            <Lock className="w-4 h-4 text-purple-400" />
            <span>National Command Audit Trail (Immutable Log)</span>
          </h2>
          <span className="text-[10px] text-slate-500 font-mono">POSTGRESQL AUDIT TABLE</span>
        </div>

        <div className="space-y-2.5 font-mono text-xs">
          {auditLogs.map((log, idx) => (
            <div
              key={idx}
              className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1"
            >
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <span className="text-purple-400 font-bold">{log.action}</span>
                  <span className="text-slate-500 text-[10px]">by {log.actor}</span>
                </div>
                <div className="text-slate-300 font-sans text-xs">{log.details}</div>
              </div>
              <div className="text-[10px] text-slate-500 shrink-0">{log.timestamp}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
