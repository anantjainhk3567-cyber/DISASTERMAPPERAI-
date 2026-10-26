import React, { useState } from 'react';
import { useDisasterStore } from '../store/useDisasterStore';
import { api } from '../lib/api';
import {
  Building2,
  AlertTriangle,
  Activity,
  Zap,
  Droplets,
  Radio,
  Flame,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  Filter,
  Users,
  Compass
} from 'lucide-react';

interface CriticalFacility {
  id: string;
  name: string;
  type: 'HOSPITAL' | 'POWER_SUBSTATION' | 'WATER_TREATMENT' | 'BRIDGE' | 'TELECOM_TOWER' | 'SCHOOL';
  status: 'OPERATIONAL' | 'COMPROMISED' | 'INUNDATED' | 'AT_RISK';
  waterLevelMeters: number;
  backupGeneratorHours: number;
  cutoffRiskPercent: number;
  servicePopulation: number;
  coordinates: string;
  disasterType?: string;
}

const multiDisasterFacilities: Record<string, CriticalFacility[]> = {
  FLOOD: [
    {
      id: 'fac-fl-01',
      name: 'Sushruta Trauma Centre (Civil Lines)',
      type: 'HOSPITAL',
      status: 'AT_RISK',
      waterLevelMeters: 0.35,
      backupGeneratorHours: 36,
      cutoffRiskPercent: 65,
      servicePopulation: 85000,
      coordinates: '28.6720° N, 77.2215° E',
    },
    {
      id: 'fac-fl-02',
      name: 'Yamuna Wazirabad Water Treatment Plant',
      type: 'WATER_TREATMENT',
      status: 'COMPROMISED',
      waterLevelMeters: 1.40,
      backupGeneratorHours: 12,
      cutoffRiskPercent: 95,
      servicePopulation: 2200000,
      coordinates: '28.7125° N, 77.2280° E',
    },
    {
      id: 'fac-fl-03',
      name: 'Kashmere Gate 220kV Grid Substation',
      type: 'POWER_SUBSTATION',
      status: 'INUNDATED',
      waterLevelMeters: 1.85,
      backupGeneratorHours: 0,
      cutoffRiskPercent: 100,
      servicePopulation: 450000,
      coordinates: '28.6670° N, 77.2340° E',
    },
    {
      id: 'fac-fl-04',
      name: 'Old Railway Bridge Embankment Pier 4',
      type: 'BRIDGE',
      status: 'COMPROMISED',
      waterLevelMeters: 2.10,
      backupGeneratorHours: 0,
      cutoffRiskPercent: 90,
      servicePopulation: 120000,
      coordinates: '28.6602° N, 77.2530° E',
    },
    {
      id: 'fac-fl-05',
      name: 'Civil Lines Central Telecom Tower Node',
      type: 'TELECOM_TOWER',
      status: 'OPERATIONAL',
      waterLevelMeters: 0.10,
      backupGeneratorHours: 48,
      cutoffRiskPercent: 20,
      servicePopulation: 180000,
      coordinates: '28.6810° N, 77.2190° E',
    },
  ],
  EARTHQUAKE: [
    {
      id: 'fac-eq-01',
      name: 'GK Memorial General Hospital (Bhuj)',
      type: 'HOSPITAL',
      status: 'COMPROMISED',
      waterLevelMeters: 0,
      backupGeneratorHours: 18,
      cutoffRiskPercent: 90,
      servicePopulation: 340000,
      coordinates: '23.2510° N, 69.6680° E',
    },
    {
      id: 'fac-eq-02',
      name: 'NH-41 Surajbari Creek Viaduct Bridge',
      type: 'BRIDGE',
      status: 'INUNDATED',
      waterLevelMeters: 0,
      backupGeneratorHours: 0,
      cutoffRiskPercent: 100,
      servicePopulation: 850000,
      coordinates: '23.2050° N, 70.7350° E',
    },
    {
      id: 'fac-eq-03',
      name: 'Bhuj Central 220kV Step-Down Substation',
      type: 'POWER_SUBSTATION',
      status: 'COMPROMISED',
      waterLevelMeters: 0,
      backupGeneratorHours: 6,
      cutoffRiskPercent: 85,
      servicePopulation: 280000,
      coordinates: '23.2420° N, 69.6850° E',
    },
    {
      id: 'fac-eq-04',
      name: 'Anjar GIDC Potable Water Reservoir',
      type: 'WATER_TREATMENT',
      status: 'AT_RISK',
      waterLevelMeters: 0,
      backupGeneratorHours: 24,
      cutoffRiskPercent: 60,
      servicePopulation: 95000,
      coordinates: '23.1150° N, 70.0280° E',
    },
  ],
  LANDSLIDE: [
    {
      id: 'fac-ls-01',
      name: 'Chooralmala River Crossing Bridge',
      type: 'BRIDGE',
      status: 'COMPROMISED',
      waterLevelMeters: 4.5,
      backupGeneratorHours: 0,
      cutoffRiskPercent: 100,
      servicePopulation: 3400,
      coordinates: '11.5335° N, 76.1290° E',
    },
    {
      id: 'fac-ls-02',
      name: 'Mundakkai Tea Estate Medical Dispensary',
      type: 'HOSPITAL',
      status: 'AT_RISK',
      waterLevelMeters: 0,
      backupGeneratorHours: 12,
      cutoffRiskPercent: 100,
      servicePopulation: 1450,
      coordinates: '11.5420° N, 76.1410° E',
    },
    {
      id: 'fac-ls-03',
      name: 'Meppadi Primary Power Transmission Feeder',
      type: 'POWER_SUBSTATION',
      status: 'OPERATIONAL',
      waterLevelMeters: 0,
      backupGeneratorHours: 48,
      cutoffRiskPercent: 30,
      servicePopulation: 12000,
      coordinates: '11.5520° N, 76.1180° E',
    },
  ],
  CYCLONE: [
    {
      id: 'fac-cy-01',
      name: 'Sagar Island 33kV Coastal Grid Substation',
      type: 'POWER_SUBSTATION',
      status: 'INUNDATED',
      waterLevelMeters: 2.1,
      backupGeneratorHours: 8,
      cutoffRiskPercent: 95,
      servicePopulation: 120000,
      coordinates: '21.7250° N, 88.1150° E',
    },
    {
      id: 'fac-cy-02',
      name: 'Kakdwip Super Specialty Hospital',
      type: 'HOSPITAL',
      status: 'AT_RISK',
      waterLevelMeters: 0.8,
      backupGeneratorHours: 32,
      cutoffRiskPercent: 70,
      servicePopulation: 240000,
      coordinates: '21.8750° N, 88.1850° E',
    },
    {
      id: 'fac-cy-03',
      name: 'Dhablat Sluice Gate & Saline Bund Embankment',
      type: 'WATER_TREATMENT',
      status: 'COMPROMISED',
      waterLevelMeters: 3.8,
      backupGeneratorHours: 0,
      cutoffRiskPercent: 100,
      servicePopulation: 38500,
      coordinates: '21.6520° N, 88.1250° E',
    },
  ],
};

export const ImpactAnalysisPage: React.FC = () => {
  const { selectedDisaster } = useDisasterStore();
  const [filterType, setFilterType] = useState<string>('ALL');

  const currentType = selectedDisaster?.type || 'FLOOD';
  const facilities = multiDisasterFacilities[currentType] || multiDisasterFacilities.FLOOD;

  const filtered = facilities.filter((f) => {
    if (filterType === 'ALL') return true;
    return f.type === filterType;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              VULNERABILITY & CRITICAL ASSET INTELLIGENCE
            </span>
            <span className="text-xs text-slate-400">Jurisdiction: {selectedDisaster?.name || 'NCR Sector'}</span>
          </div>
          <h1 className="text-2xl font-black text-slate-100 tracking-tight mt-1 flex items-center space-x-2.5">
            <Building2 className="w-6 h-6 text-indigo-400" />
            <span>Critical Infrastructure Exposure & Impact</span>
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Monitor real-time threat levels, flood encroachment thresholds, and backup autonomy across lifeline infrastructure.
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 p-1 rounded-lg">
          {['ALL', 'HOSPITAL', 'WATER_TREATMENT', 'POWER_SUBSTATION', 'BRIDGE'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                filterType === t
                  ? 'bg-slate-800 text-cyan-300 font-bold border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Aggregate Impact Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#0F172A] border border-slate-800">
          <div className="text-[11px] font-mono text-slate-400 uppercase">Compromised Facilities</div>
          <div className="text-2xl font-black font-mono text-red-400 mt-1">
            2 <span className="text-xs font-normal text-slate-400">/ 5 monitored</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0F172A] border border-slate-800">
          <div className="text-[11px] font-mono text-slate-400 uppercase">Potable Water Interruption</div>
          <div className="text-2xl font-black font-mono text-amber-300 mt-1">
            2.2M <span className="text-xs font-normal text-slate-400">citizens affected</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0F172A] border border-slate-800">
          <div className="text-[11px] font-mono text-slate-400 uppercase">Grid Substations Inundated</div>
          <div className="text-2xl font-black font-mono text-red-400 mt-1">
            1 <span className="text-xs font-normal text-slate-400">substation offline</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0F172A] border border-slate-800">
          <div className="text-[11px] font-mono text-slate-400 uppercase">Trauma Centers At Risk</div>
          <div className="text-2xl font-black font-mono text-cyan-300 mt-1">
            1 <span className="text-xs font-normal text-slate-400">barrier deployed</span>
          </div>
        </div>
      </div>

      {/* Facilities Threat Table */}
      <div className="p-5 rounded-xl bg-[#0F172A] border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Lifeline Infrastructure Threat Matrix
          </h2>
          <span className="text-xs text-slate-500 font-mono">Real-time Telemetry Active</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                <th className="py-2.5">Asset Name</th>
                <th className="py-2.5">Type</th>
                <th className="py-2.5">Status</th>
                <th className="py-2.5">Flood Encroachment</th>
                <th className="py-2.5">Aux Power Backup</th>
                <th className="py-2.5">Cutoff Probability</th>
                <th className="py-2.5 text-right">Dependent Population</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
              {filtered.map((fac) => {
                const isCritical = fac.status === 'INUNDATED' || fac.status === 'COMPROMISED';
                const isAtRisk = fac.status === 'AT_RISK';

                return (
                  <tr key={fac.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-3 font-sans font-semibold text-slate-100">
                      <div>{fac.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{fac.coordinates}</div>
                    </td>
                    <td className="py-3 text-slate-400 font-sans">{fac.type.replace('_', ' ')}</td>
                    <td className="py-3">
                      <span
                        className={`text-[9px] font-black px-2 py-0.5 rounded ${
                          isCritical
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : isAtRisk
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {fac.status}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className={fac.waterLevelMeters > 1 ? 'text-red-400 font-bold' : 'text-slate-300'}>
                        {fac.waterLevelMeters.toFixed(2)}m
                      </span>
                    </td>
                    <td className="py-3">
                      <span className={fac.backupGeneratorHours < 24 ? 'text-amber-400 font-bold' : 'text-slate-300'}>
                        {fac.backupGeneratorHours} hrs remaining
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-slate-900 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              fac.cutoffRiskPercent > 80 ? 'bg-red-400' : 'bg-amber-400'
                            }`}
                            style={{ width: `${fac.cutoffRiskPercent}%` }}
                          />
                        </div>
                        <span>{fac.cutoffRiskPercent}%</span>
                      </div>
                    </td>
                    <td className="py-3 text-right font-bold text-slate-200">
                      {fac.servicePopulation.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Isolated Settlements Vulnerability Card */}
      <div className="p-5 rounded-xl bg-gradient-to-r from-red-950/30 via-slate-900 to-slate-900 border border-red-800/40 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <ShieldAlert className="w-5 h-5 text-red-400" />
            <h3 className="text-sm font-bold text-slate-100">
              Isolated Settlements Alert: Yamuna Khadar Sector 1
            </h3>
          </div>
          <span className="text-[10px] font-black px-2 py-0.5 rounded bg-red-500/20 text-red-400 font-mono">
            CRITICAL ACCESS CUTOFF
          </span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          All 3 vehicular access corridors into Sector 1 are submerged above 1.5m. Approximately 8,400 residents
          are isolated on elevated temple platforms and school rooftops. Amphibious boat rescue battalions required.
        </p>
        <div className="pt-2 flex justify-end">
          <button
            onClick={() => alert('Amphibious rescue boats requisitioned for Yamuna Khadar Sector 1.')}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-slate-100 font-bold text-xs rounded-lg transition-all shadow-md"
          >
            Dispatch Amphibious Rescue Battalion
          </button>
        </div>
      </div>
    </div>
  );
};
