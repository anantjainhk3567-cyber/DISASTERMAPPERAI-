import React, { useState } from 'react';
import { useDisasterStore } from '../store/useDisasterStore';
import { api } from '../lib/api';
import {
  BellRing,
  AlertTriangle,
  ShieldAlert,
  Info,
  CheckCircle2,
  Send,
  Plus,
  Filter,
  Users,
  Radio,
  Clock,
  Check
} from 'lucide-react';

interface AlertItem {
  id: string;
  title: string;
  message: string;
  severity: 'CRITICAL' | 'WARNING' | 'ADVISORY' | 'INFO';
  targetAudience: 'PUBLIC' | 'FIRST_RESPONDERS' | 'INTER_AGENCY';
  isAcknowledged: boolean;
  acknowledgedBy?: string;
  createdAt: string;
}

const mockAlerts: AlertItem[] = [
  {
    id: 'alt-01',
    title: 'MANDATORY EVACUATION: Yamuna Khadar Lowland Sector 1',
    message: 'Water levels reaching 2.2m. Immediate evacuation ordered. Civil Defence transport buses staging at Majnu Ka Tila.',
    severity: 'CRITICAL',
    targetAudience: 'PUBLIC',
    isAcknowledged: false,
    createdAt: '18 mins ago',
  },
  {
    id: 'alt-02',
    title: 'HAZARDOUS CURRENT: Old Railway Bridge Access Pier Closed',
    message: 'All vehicular and pedestrian movements suspended. Structural scour inspection team deployed.',
    severity: 'WARNING',
    targetAudience: 'PUBLIC',
    isAcknowledged: true,
    acknowledgedBy: 'Duty Officer Verma',
    createdAt: '42 mins ago',
  },
  {
    id: 'alt-03',
    title: 'RESCUE LOGISTICS: NDRF 8th Battalion Boats Operating on VHF Ch 4',
    message: 'Boat units coordinate air-drop coordinates with Sector Command on primary emergency radio frequency.',
    severity: 'INFO',
    targetAudience: 'FIRST_RESPONDERS',
    isAcknowledged: true,
    acknowledgedBy: 'NDRF Comm Center',
    createdAt: '1.5 hrs ago',
  },
  {
    id: 'alt-04',
    title: 'POTABLE WATER SUPPLY INTERRUPTED: Civil Lines North',
    message: 'Wazirabad Water Treatment Plant functioning at 30% capacity. Mobile drinking water tankers dispatched.',
    severity: 'WARNING',
    targetAudience: 'INTER_AGENCY',
    isAcknowledged: false,
    createdAt: '2.1 hrs ago',
  },
];

export const AlertsPage: React.FC = () => {
  const { currentDisaster } = useDisasterStore();
  const [alerts, setAlerts] = useState<AlertItem[]>(mockAlerts);
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);

  // New alert form state
  const [newHeadline, setNewHeadline] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [newSeverity, setNewSeverity] = useState<'CRITICAL' | 'WARNING' | 'ADVISORY' | 'INFO'>('CRITICAL');
  const [newAudience, setNewAudience] = useState<'PUBLIC' | 'FIRST_RESPONDERS' | 'INTER_AGENCY'>('PUBLIC');

  const handleAcknowledge = async (id: string) => {
    try {
      await api.alerts.acknowledge(id);
    } catch {
      // Offline fallback
    }

    setAlerts((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, isAcknowledged: true, acknowledgedBy: 'Incident Commander' } : a
      )
    );
  };

  const handleAcknowledgeAll = async () => {
    try {
      await api.alerts.acknowledgeAll(currentDisaster?.id);
    } catch {
      // Offline fallback
    }

    setAlerts((prev) =>
      prev.map((a) => ({ ...a, isAcknowledged: true, acknowledgedBy: 'Incident Commander' }))
    );
  };

  const handleBroadcastAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHeadline.trim()) return;

    try {
      await api.alerts.create({
        disasterId: currentDisaster?.id,
        title: newHeadline,
        message: newMessage,
        severity: newSeverity,
        targetAudience: newAudience,
      });
    } catch {
      // Offline fallback
    }

    const created: AlertItem = {
      id: `alt-${Date.now()}`,
      title: newHeadline,
      message: newMessage,
      severity: newSeverity,
      targetAudience: newAudience,
      isAcknowledged: true,
      acknowledgedBy: 'Transmitting Officer',
      createdAt: 'Just now',
    };

    setAlerts([created, ...alerts]);
    setIsBroadcastModalOpen(false);
    setNewHeadline('');
    setNewMessage('');
  };

  const filtered = alerts.filter((a) => {
    if (filterSeverity === 'ALL') return true;
    return a.severity === filterSeverity;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-red-500/20 text-red-400 border border-red-500/30">
              NATIONAL EMERGENCY BROADCAST SYSTEM
            </span>
            <span className="text-xs text-slate-400">Jurisdiction: {currentDisaster?.name || 'NCR Sector'}</span>
          </div>
          <h1 className="text-2xl font-black text-slate-100 tracking-tight mt-1 flex items-center space-x-2.5">
            <BellRing className="w-6 h-6 text-red-500" />
            <span>Operational Alerts & Warnings Center</span>
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Issue CAP-standard emergency broadcasts to first responders, inter-agency desks, and the general public.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleAcknowledgeAll}
            className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-all"
          >
            Acknowledge All Unread
          </button>
          <button
            onClick={() => setIsBroadcastModalOpen(true)}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-slate-100 text-xs font-bold flex items-center space-x-1.5 transition-all shadow-md shadow-red-950/40"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Broadcast CAP Alert</span>
          </button>
        </div>
      </div>

      {/* Severity Filter Pills */}
      <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 p-1 rounded-lg w-fit">
        {['ALL', 'CRITICAL', 'WARNING', 'ADVISORY', 'INFO'].map((sev) => (
          <button
            key={sev}
            onClick={() => setFilterSeverity(sev)}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              filterSeverity === sev
                ? 'bg-slate-800 text-cyan-300 font-bold border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {sev}
          </button>
        ))}
      </div>

      {/* Alerts Feed */}
      <div className="space-y-3">
        {filtered.map((alert) => {
          const isCritical = alert.severity === 'CRITICAL';
          const isWarning = alert.severity === 'WARNING';

          return (
            <div
              key={alert.id}
              className={`p-5 rounded-xl border transition-all space-y-3 ${
                isCritical
                  ? 'bg-[#180A0A]/90 border-red-500/40 shadow-lg shadow-red-950/20'
                  : isWarning
                  ? 'bg-[#18120A]/90 border-amber-500/30 shadow-lg shadow-amber-950/20'
                  : 'bg-[#0F172A] border-slate-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center space-x-3">
                  <span
                    className={`text-[9px] font-black px-2 py-0.5 rounded font-mono ${
                      isCritical
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse'
                        : isWarning
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}
                  >
                    {alert.severity}
                  </span>
                  <h3 className="text-sm font-bold text-slate-100">{alert.title}</h3>
                </div>

                <div className="flex items-center space-x-2 text-[11px] font-mono text-slate-400 shrink-0">
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                    TARGET: {alert.targetAudience}
                  </span>
                  <span>{alert.createdAt}</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed pl-1">{alert.message}</p>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                {alert.isAcknowledged ? (
                  <span className="text-emerald-400 text-[11px] font-mono flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Acknowledged by {alert.acknowledgedBy}</span>
                  </span>
                ) : (
                  <span className="text-amber-400 text-[11px] font-mono">
                    Pending Commander Acknowledgment
                  </span>
                )}

                {!alert.isAcknowledged && (
                  <button
                    onClick={() => handleAcknowledge(alert.id)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-1 border border-slate-700 transition-all"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Acknowledge</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Broadcast CAP Alert Modal */}
      {isBroadcastModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <form
            onSubmit={handleBroadcastAlert}
            className="bg-[#0F172A] border border-red-500/40 rounded-xl p-6 max-w-lg w-full space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
                <Radio className="w-4 h-4 text-red-500" />
                <span>Issue Common Alerting Protocol (CAP) Broadcast</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsBroadcastModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Alert Headline</label>
              <input
                type="text"
                required
                placeholder="e.g. FLASH FLOOD WARNING: Evacuate Yamuna Floodplain..."
                value={newHeadline}
                onChange={(e) => setNewHeadline(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Severity Tier</label>
                <select
                  value={newSeverity}
                  onChange={(e) => setNewSeverity(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-slate-200 focus:outline-none focus:border-red-500"
                >
                  <option value="CRITICAL">CRITICAL (Red)</option>
                  <option value="WARNING">WARNING (Amber)</option>
                  <option value="ADVISORY">ADVISORY (Cyan)</option>
                  <option value="INFO">INFO (Slate)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Target Audience</label>
                <select
                  value={newAudience}
                  onChange={(e) => setNewAudience(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-slate-200 focus:outline-none focus:border-red-500"
                >
                  <option value="PUBLIC">General Public</option>
                  <option value="FIRST_RESPONDERS">First Responders Only</option>
                  <option value="INTER_AGENCY">Inter-Agency Desks</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Detailed Action Instruction</label>
              <textarea
                rows={3}
                required
                placeholder="Specify precise actions, staging areas, emergency contact lines..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setIsBroadcastModalOpen(false)}
                className="px-3 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-slate-100 text-xs font-bold transition-all shadow-md"
              >
                Transmit Emergency Broadcast
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
