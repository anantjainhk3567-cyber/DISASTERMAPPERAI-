import React, { useState, useEffect } from 'react';
import { useDisasterStore } from '../store/useDisasterStore';
import { api } from '../lib/api';
import {
  History,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Clock,
  Waves,
  AlertTriangle,
  Users,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface TimelineStep {
  hourOffset: number;
  timeLabel: string;
  riverLevelMeters: number;
  activeIncidents: number;
  evacuatedCount: number;
  respondersDeployed: number;
  majorEvents: {
    time: string;
    title: string;
    category: 'METEOROLOGICAL' | 'HYDROLOGIC' | 'DISPATCH' | 'CIVIL';
    desc: string;
  }[];
}

const mockTimeline: TimelineStep[] = [
  {
    hourOffset: -24,
    timeLabel: 'T-24h (Oct 11, 00:00 UTC)',
    riverLevelMeters: 204.10,
    activeIncidents: 2,
    evacuatedCount: 450,
    respondersDeployed: 40,
    majorEvents: [
      {
        time: '00:30 UTC',
        title: 'IMD Red Alert Issued for Upper Yamuna Catchment',
        category: 'METEOROLOGICAL',
        desc: 'Continuous cloudburst over Himachal & Uttarakhand foothills.',
      },
    ],
  },
  {
    hourOffset: -12,
    timeLabel: 'T-12h (Oct 11, 12:00 UTC)',
    riverLevelMeters: 205.33,
    activeIncidents: 6,
    evacuatedCount: 2200,
    respondersDeployed: 120,
    majorEvents: [
      {
        time: '12:15 UTC',
        title: 'Hathnikund Barrage Discharges 359,000 Cusecs',
        category: 'HYDROLOGIC',
        desc: 'Flood wave traveling downstream towards Delhi NCR basin.',
      },
      {
        time: '14:00 UTC',
        title: 'Yamuna River Crosses Warning Level (204.50m)',
        category: 'HYDROLOGIC',
        desc: 'Evacuation of low-lying farming colonies commenced.',
      },
    ],
  },
  {
    hourOffset: 0,
    timeLabel: 'T-0h (Oct 12, 00:00 UTC) — PEAK SURGE',
    riverLevelMeters: 208.66,
    activeIncidents: 28,
    evacuatedCount: 14500,
    respondersDeployed: 480,
    majorEvents: [
      {
        time: '02:00 UTC',
        title: 'Historical High Water Mark: 208.66m Recorded',
        category: 'HYDROLOGIC',
        desc: 'Surpassed 1978 record by 1.17 meters. Ring road inundated.',
      },
      {
        time: '03:30 UTC',
        title: 'Kashmere Gate Metro Station Underpass Submerged',
        category: 'CIVIL',
        desc: 'Entry/Exit points sealed; traffic diverted to Civil Lines.',
      },
      {
        time: '05:00 UTC',
        title: '12 NDRF Teams Dispatched with Inflatable Zodiac Boats',
        category: 'DISPATCH',
        desc: 'Targeting isolated families in Yamuna Khadar sector.',
      },
    ],
  },
  {
    hourOffset: 12,
    timeLabel: 'T+12h (Oct 12, 12:00 UTC)',
    riverLevelMeters: 207.80,
    activeIncidents: 21,
    evacuatedCount: 19800,
    respondersDeployed: 620,
    majorEvents: [
      {
        time: '12:45 UTC',
        title: 'Water Level Recedes Below 208.0m',
        category: 'HYDROLOGIC',
        desc: 'Current flow stabilizing, dewatering pumps active at Ring Road.',
      },
    ],
  },
  {
    hourOffset: 24,
    timeLabel: 'T+24h (Oct 13, 00:00 UTC)',
    riverLevelMeters: 206.20,
    activeIncidents: 14,
    evacuatedCount: 23400,
    respondersDeployed: 540,
    majorEvents: [
      {
        time: '01:00 UTC',
        title: 'Disinfection & Chlorine Distribution Initiated in Shelters',
        category: 'CIVIL',
        desc: 'Mobile medical vans treating evacuees for water-borne illnesses.',
      },
    ],
  },
];

export const TimelinePage: React.FC = () => {
  const { currentDisaster } = useDisasterStore();
  const [currentIndex, setCurrentIndex] = useState(2); // Start at peak surge (T-0h)
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(2000); // 2 seconds per tick

  const currentStep = mockTimeline[currentIndex];

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentIndex((prev) => (prev < mockTimeline.length - 1 ? prev + 1 : 0));
      }, playbackSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed]);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              DISASTER TIME MACHINE (4D REPLAY)
            </span>
            <span className="text-xs text-slate-400">Chronicle: {currentDisaster?.name || 'Yamuna Flood 2026'}</span>
          </div>
          <h1 className="text-2xl font-black text-slate-100 tracking-tight mt-1 flex items-center space-x-2.5">
            <History className="w-6 h-6 text-cyan-400" />
            <span>Temporal Incident Reconstruction & Timeline</span>
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Replay the chronological progression of inundation levels, barrage outflows, and emergency response actions.
          </p>
        </div>
      </div>

      {/* Main Scrubber & Player Bar */}
      <div className="p-5 rounded-xl bg-[#0F172A] border border-cyan-500/30 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400 font-mono">
              ACTIVE TIMESTAMP SNAPSHOT
            </span>
            <h2 className="text-lg font-bold text-slate-100">{currentStep.timeLabel}</h2>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
              title="Step Back"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center space-x-1.5 transition-all shadow-md"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isPlaying ? 'Pause Replay' : 'Play Sequence'}</span>
            </button>

            <button
              onClick={() => setCurrentIndex((prev) => Math.min(mockTimeline.length - 1, prev + 1))}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
              title="Step Forward"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            <button
              onClick={() => setCurrentIndex(0)}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 transition-all"
              title="Rewind to T-24h"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Range Slider */}
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max={mockTimeline.length - 1}
            value={currentIndex}
            onChange={(e) => setCurrentIndex(Number(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
          />
          <div className="flex justify-between text-[11px] font-mono text-slate-500">
            {mockTimeline.map((s, idx) => (
              <span
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`cursor-pointer transition-colors ${
                  currentIndex === idx ? 'text-cyan-300 font-bold' : 'hover:text-slate-300'
                }`}
              >
                {s.hourOffset > 0 ? `+${s.hourOffset}h` : `${s.hourOffset}h`}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Snapshot KPI Grid at Current Timestamp */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#0F172A] border border-slate-800">
          <div className="text-[11px] font-mono text-slate-400 uppercase flex items-center space-x-1.5">
            <Waves className="w-3.5 h-3.5 text-cyan-400" />
            <span>Yamuna Water Gauge</span>
          </div>
          <div className="text-2xl font-black font-mono text-cyan-300 mt-1">
            {currentStep.riverLevelMeters.toFixed(2)}{' '}
            <span className="text-xs font-normal text-slate-400">m (Danger: 205.33m)</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0F172A] border border-slate-800">
          <div className="text-[11px] font-mono text-slate-400 uppercase flex items-center space-x-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
            <span>Active Verified Incidents</span>
          </div>
          <div className="text-2xl font-black font-mono text-red-400 mt-1">
            {currentStep.activeIncidents} <span className="text-xs font-normal text-slate-400">critical</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0F172A] border border-slate-800">
          <div className="text-[11px] font-mono text-slate-400 uppercase flex items-center space-x-1.5">
            <Users className="w-3.5 h-3.5 text-amber-400" />
            <span>Citizens In Shelters</span>
          </div>
          <div className="text-2xl font-black font-mono text-amber-300 mt-1">
            {currentStep.evacuatedCount.toLocaleString()}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0F172A] border border-slate-800">
          <div className="text-[11px] font-mono text-slate-400 uppercase flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Field Responders Deployed</span>
          </div>
          <div className="text-2xl font-black font-mono text-emerald-400 mt-1">
            {currentStep.respondersDeployed} <span className="text-xs font-normal text-slate-400">NDRF & SDRF</span>
          </div>
        </div>
      </div>

      {/* Chronological Event Log Stream */}
      <div className="p-5 rounded-xl bg-[#0F172A] border border-slate-800 space-y-4 shadow-xl">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 border-b border-slate-800 pb-3">
          Milestones & Incident Log at this Hour
        </h3>

        <div className="space-y-3">
          {currentStep.majorEvents.map((evt, idx) => (
            <div
              key={idx}
              className="p-4 rounded-lg bg-slate-900/80 border border-slate-800 flex items-start space-x-3.5"
            >
              <div className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950/40 px-2 py-1 rounded border border-cyan-800/40 shrink-0">
                {evt.time}
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <h4 className="text-xs font-bold text-slate-100">{evt.title}</h4>
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                    {evt.category}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{evt.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
