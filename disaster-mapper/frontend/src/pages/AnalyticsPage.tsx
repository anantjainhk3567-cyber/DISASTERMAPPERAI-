import React from 'react';
import { useDisasterStore } from '../store/useDisasterStore';
import {
  BarChart3,
  TrendingUp,
  Download,
  FileSpreadsheet,
  FileText,
  Clock,
  Users,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

const rainfallFlowData = [
  { time: '00:00', rainfallMm: 12, inundatedKm2: 4.2 },
  { time: '04:00', rainfallMm: 45, inundatedKm2: 9.8 },
  { time: '08:00', rainfallMm: 85, inundatedKm2: 18.4 },
  { time: '12:00', rainfallMm: 125, inundatedKm2: 32.4 },
  { time: '16:00', rainfallMm: 60, inundatedKm2: 34.1 },
  { time: '20:00', rainfallMm: 25, inundatedKm2: 29.8 },
  { time: '24:00', rainfallMm: 10, inundatedKm2: 24.2 },
];

const incidentDistribution = [
  { category: 'Flooding', count: 48 },
  { category: 'Stranded Persons', count: 34 },
  { category: 'Road Cutoff', count: 26 },
  { category: 'Power / Gas', count: 18 },
  { category: 'Structure Damage', count: 12 },
  { category: 'Medical Rescue', count: 9 },
];

const responseTimeBenchmark = [
  { stage: 'Time to Ingest', targetMins: 2, actualMins: 1.4 },
  { stage: 'AI Corroboration', targetMins: 5, actualMins: 3.2 },
  { stage: 'Commander Review', targetMins: 10, actualMins: 7.8 },
  { stage: 'Unit Dispatch', targetMins: 15, actualMins: 12.0 },
  { stage: 'On-Scene Rescue', targetMins: 45, actualMins: 38.5 },
];

export const AnalyticsPage: React.FC = () => {
  const { currentDisaster } = useDisasterStore();

  const handleExportSitRep = () => {
    const sitrep = `# SITUATION REPORT (SITREP) — ${currentDisaster?.name || 'NCR FLOOD'}
Date: 2026-10-12 | Incident ID: ${currentDisaster?.id || 'DIS-2026-001'}
Classification: OFFICIAL DISASTER COMMAND LOG

1. EXECUTIVE SUMMARY:
Yamuna River peaked at 208.66m (1.17m above historical 1978 peak).
Estimated flooded area: 32.4 sq km across 4 operational sectors.
Total evacuated to date: 23,400 citizens across 4 primary shelters.

2. ASSET STATUS:
- NDRF / SDRF Battalions Deployed: 14 units (380 personnel, 26 zodiac boats).
- Hospitals Operational: 4 / 5 (Sushruta Trauma Center protected by flood barriers).
- Major Arterials Submerged: Ring Road Underpass Sector 4.

3. RESOURCE REQUIREMENTS:
- Additional 400 life vests and chlorinated water purification packets requested for Kashmere Gate Sector.
`;
    const blob = new Blob([sitrep], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SITREP_${currentDisaster?.id || 'NCR_FLOOD'}_20261012.md`;
    a.click();
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-blue-500/20 text-blue-400 border border-blue-500/30">
              STRATEGIC OPERATIONAL INTELLIGENCE
            </span>
            <span className="text-xs text-slate-400">Target: {currentDisaster?.name || 'NCR Basin'}</span>
          </div>
          <h1 className="text-2xl font-black text-slate-100 tracking-tight mt-1 flex items-center space-x-2.5">
            <BarChart3 className="w-6 h-6 text-blue-400" />
            <span>Disaster Analytics & Situation Reporting</span>
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Holistic trends in hydrologic inflow, response duration benchmarks, and resource allocation efficiency.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => alert('Exporting raw sensor & incident CSV package...')}
            className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center space-x-1.5 border border-slate-700 transition-all"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export CSV Package</span>
          </button>

          <button
            onClick={handleExportSitRep}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-slate-100 text-xs font-bold flex items-center space-x-1.5 transition-all shadow-md"
          >
            <Download className="w-4 h-4" />
            <span>Generate Situation Report (SitRep)</span>
          </button>
        </div>
      </div>

      {/* Top 3 KPI Strips */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[#0F172A] border border-slate-800">
          <div className="text-[11px] font-mono text-slate-400 uppercase">Average Emergency Dispatch Time</div>
          <div className="text-2xl font-black font-mono text-emerald-400 mt-1">
            12.0 <span className="text-xs font-normal text-slate-400">mins (Target: &lt;15m)</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0F172A] border border-slate-800">
          <div className="text-[11px] font-mono text-slate-400 uppercase">Total Incidents Ingested & Handled</div>
          <div className="text-2xl font-black font-mono text-cyan-300 mt-1">
            147 <span className="text-xs font-normal text-slate-400">cases (92% verified)</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0F172A] border border-slate-800">
          <div className="text-[11px] font-mono text-slate-400 uppercase">Total Evacuation Rescues Logged</div>
          <div className="text-2xl font-black font-mono text-amber-300 mt-1">
            23,400 <span className="text-xs font-normal text-slate-400">safely sheltered</span>
          </div>
        </div>
      </div>

      {/* Charts 2-Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Hydrograph (7 Cols) */}
        <div className="lg:col-span-7 p-5 rounded-xl bg-[#0F172A] border border-slate-800 space-y-4 shadow-xl">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Precipitation Volume vs Flooded Footprint (Hydrograph)
            </h3>
            <span className="text-[10px] font-mono text-cyan-400">HOURLY DELTA</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={rainfallFlowData}>
                <defs>
                  <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#090D16',
                    borderColor: '#1e293b',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="inundatedKm2"
                  name="Inundated Area (km²)"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorArea)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Incidents by Category (5 Cols) */}
        <div className="lg:col-span-5 p-5 rounded-xl bg-[#0F172A] border border-slate-800 space-y-4 shadow-xl">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Incidents by Emergency Category
            </h3>
            <span className="text-[10px] font-mono text-slate-500">147 TOTAL</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={incidentDistribution} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis
                  dataKey="category"
                  type="category"
                  width={110}
                  stroke="#64748b"
                  tick={{ fontSize: 10 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#090D16',
                    borderColor: '#1e293b',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" name="Incidents" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Response Benchmarks Table */}
      <div className="p-5 rounded-xl bg-[#0F172A] border border-slate-800 space-y-4 shadow-xl">
        <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Emergency Dispatch Lifecycle Response Benchmarks
          </h3>
          <span className="text-[10px] font-mono text-emerald-400">ALL TARGETS MET</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                <th className="py-2.5">Response Stage</th>
                <th className="py-2.5">SOP Benchmark Target</th>
                <th className="py-2.5">Observed Average</th>
                <th className="py-2.5 text-right">Performance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
              {responseTimeBenchmark.map((b) => (
                <tr key={b.stage}>
                  <td className="py-3 font-sans font-semibold text-slate-100">{b.stage}</td>
                  <td className="py-3 text-slate-400">&lt; {b.targetMins} mins</td>
                  <td className="py-3 text-cyan-300 font-bold">{b.actualMins} mins</td>
                  <td className="py-3 text-right">
                    <span className="text-[9px] font-black px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      ON TARGET (-{(b.targetMins - b.actualMins).toFixed(1)}m)
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
