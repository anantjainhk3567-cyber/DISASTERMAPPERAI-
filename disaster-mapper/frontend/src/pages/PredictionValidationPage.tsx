import React, { useState } from 'react';
import { useDisasterStore } from '../store/useDisasterStore';
import { api } from '../lib/api';
import {
  Gauge,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Layers,
  ArrowRight,
  TrendingUp,
  BrainCircuit,
  Sliders,
  ShieldCheck,
  FileCheck
} from 'lucide-react';

export const PredictionValidationPage: React.FC = () => {
  const { currentDisaster } = useDisasterStore();

  const [metrics, setMetrics] = useState({
    iouScore: 0.764,
    precision: 0.821,
    recall: 0.875,
    f1Score: 0.847,
    truePositiveAreaKm2: 18.2,
    falsePositiveAreaKm2: 4.1,
    falseNegativeAreaKm2: 2.6,
    evaluatedPolygonsCount: 64,
    evaluatedDate: '2026-10-12 11:30 UTC',
    modelSignature: 'DeepLabV3+ Hydrological-Ensemble v2.4',
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              AI MODEL GROUND TRUTH VERIFICATION
            </span>
            <span className="text-xs text-slate-400">Target Area: {currentDisaster?.name || 'NCR Sector'}</span>
          </div>
          <h1 className="text-2xl font-black text-slate-100 tracking-tight mt-1 flex items-center space-x-2.5">
            <Gauge className="w-6 h-6 text-cyan-400" />
            <span>Prediction vs Reality Evaluation</span>
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Spatially evaluate hydrological predictions against verified satellite passes and ground truth rescue telemetry.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
            Model: {metrics.modelSignature}
          </span>
        </div>
      </div>

      {/* Main 4 Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* IoU */}
        <div className="p-5 rounded-xl bg-[#0F172A] border border-cyan-500/40 space-y-1 relative overflow-hidden">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Intersection over Union (IoU)</div>
          <div className="text-3xl font-black font-mono text-cyan-300">
            {(metrics.iouScore * 100).toFixed(1)}%
          </div>
          <div className="text-[11px] text-cyan-400/80 font-medium">Jaccard Spatial Agreement</div>
          <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden mt-2">
            <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${metrics.iouScore * 100}%` }} />
          </div>
        </div>

        {/* Precision */}
        <div className="p-5 rounded-xl bg-[#0F172A] border border-slate-800 space-y-1">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Precision</div>
          <div className="text-3xl font-black font-mono text-emerald-400">
            {(metrics.precision * 100).toFixed(1)}%
          </div>
          <div className="text-[11px] text-slate-400">Low False Alarm Frequency</div>
          <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden mt-2">
            <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${metrics.precision * 100}%` }} />
          </div>
        </div>

        {/* Recall */}
        <div className="p-5 rounded-xl bg-[#0F172A] border border-slate-800 space-y-1">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Recall / Sensitivity</div>
          <div className="text-3xl font-black font-mono text-indigo-400">
            {(metrics.recall * 100).toFixed(1)}%
          </div>
          <div className="text-[11px] text-slate-400">High True Hazard Capture</div>
          <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden mt-2">
            <div className="bg-indigo-400 h-full rounded-full" style={{ width: `${metrics.recall * 100}%` }} />
          </div>
        </div>

        {/* F1 Score */}
        <div className="p-5 rounded-xl bg-[#0F172A] border border-slate-800 space-y-1">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Composite F1 Score</div>
          <div className="text-3xl font-black font-mono text-purple-400">
            {(metrics.f1Score * 100).toFixed(1)}%
          </div>
          <div className="text-[11px] text-slate-400">Harmonic Model Equilibrium</div>
          <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden mt-2">
            <div className="bg-purple-400 h-full rounded-full" style={{ width: `${metrics.f1Score * 100}%` }} />
          </div>
        </div>
      </div>

      {/* Spatial Confusion Breakdown Matrix */}
      <div className="p-6 rounded-xl bg-[#0F172A] border border-slate-800 space-y-5 shadow-xl">
        <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Spatial Confusion Polygon Breakdown
          </h2>
          <span className="text-[11px] text-slate-500 font-mono">
            Evaluated on {metrics.evaluatedPolygonsCount} Verified Ground Polygons
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* True Positives */}
          <div className="p-4 rounded-lg bg-emerald-950/20 border border-emerald-500/30 space-y-2">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-emerald-400 shrink-0" />
              <span className="text-xs font-bold text-emerald-300">True Positives (Accurate Inundation)</span>
            </div>
            <div className="text-2xl font-black font-mono text-emerald-200">
              {metrics.truePositiveAreaKm2} <span className="text-xs font-normal text-slate-400">km²</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Model predicted flood, and ground truth satellite & citizen reports confirmed actual inundation.
            </p>
          </div>

          {/* False Positives */}
          <div className="p-4 rounded-lg bg-amber-950/20 border border-amber-500/30 space-y-2">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-amber-400 shrink-0" />
              <span className="text-xs font-bold text-amber-300">False Positives (Over-Prediction)</span>
            </div>
            <div className="text-2xl font-black font-mono text-amber-200">
              {metrics.falsePositiveAreaKm2} <span className="text-xs font-normal text-slate-400">km²</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Model predicted flooding, but local municipal pumps or sandbags kept pavement dry (safe false alarms).
            </p>
          </div>

          {/* False Negatives */}
          <div className="p-4 rounded-lg bg-red-950/20 border border-red-500/30 space-y-2">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-red-400 shrink-0" />
              <span className="text-xs font-bold text-red-300">False Negatives (Missed Hazards)</span>
            </div>
            <div className="text-2xl font-black font-mono text-red-200">
              {metrics.falseNegativeAreaKm2} <span className="text-xs font-normal text-slate-400">km²</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Model missed inundation due to unmapped drainage backflow or local culvert clogs. High priority for retuning.
            </p>
          </div>
        </div>
      </div>

      {/* Model Retrospective Analysis */}
      <div className="p-5 rounded-xl bg-[#0F172A] border border-slate-800 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center space-x-2">
          <BrainCircuit className="w-4 h-4 text-cyan-400" />
          <span>Hydrological Calibration & Model Adaptation Memo</span>
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          The evaluation demonstrates high overall spatial fidelity (<strong className="text-cyan-300 font-mono">IoU: 76.4%</strong>),
          outperforming conventional static elevation models by +22.8%. The 2.6 km² of false negatives were localized in
          Kashmere Gate transit lanes where subterranean stormwater drain backflow was not incorporated into the open elevation DEM.
          Next retraining loop should assimilate real-time municipal culvert flow sensors.
        </p>
      </div>
    </div>
  );
};
