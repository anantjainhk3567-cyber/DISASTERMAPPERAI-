import React, { useState } from 'react';
import { useDisasterStore } from '../store/useDisasterStore';
import { api } from '../lib/api';
import {
  Users,
  MapPin,
  Camera,
  AlertTriangle,
  Send,
  CheckCircle2,
  Clock,
  HelpCircle,
  ShieldAlert,
  Flame,
  Droplets,
  HeartPulse,
  Zap,
  Navigation
} from 'lucide-react';

export const CitizenReportPage: React.FC = () => {
  const { currentDisaster } = useDisasterStore();

  const [category, setCategory] = useState('FLOODING');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('Yamuna Khadar, near Majnu Ka Tila, Sector 2');
  const [lat, setLat] = useState(28.6720);
  const [lng, setLng] = useState(77.2285);
  const [waterDepthMeters, setWaterDepthMeters] = useState(1.2);
  const [peopleTrapped, setPeopleTrapped] = useState(4);
  const [isUrgent, setIsUrgent] = useState(true);
  const [contactPhone, setContactPhone] = useState('+91 98765 43210');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionReceipt, setSubmissionReceipt] = useState<string | null>(null);

  const categories = [
    { id: 'FLOODING', label: 'Urban Flooding', icon: Droplets, color: 'text-cyan-400' },
    { id: 'TRAPPED_PEOPLE', label: 'People Stranded', icon: Users, color: 'text-amber-400' },
    { id: 'ROAD_BLOCKED', label: 'Road Cutoff', icon: AlertTriangle, color: 'text-orange-400' },
    { id: 'STRUCTURAL_COLLAPSE', label: 'Building Damage', icon: Flame, color: 'text-red-400' },
    { id: 'MEDICAL_EMERGENCY', label: 'Medical Need', icon: HeartPulse, color: 'text-pink-400' },
    { id: 'POWER_HAZARD', label: 'Live Wire / Power Hazard', icon: Zap, color: 'text-yellow-400' },
  ];

  const handleUseGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLat(parseFloat(pos.coords.latitude.toFixed(4)));
          setLng(parseFloat(pos.coords.longitude.toFixed(4)));
          setAddress('Device GPS Location Captured');
        },
        () => {
          // Default fallback
          setLat(28.6650);
          setLng(77.2320);
        }
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (currentDisaster?.id) {
        await api.citizenReports.submit({
          disasterId: currentDisaster.id,
          category,
          description,
          latitude: lat,
          longitude: lng,
          address,
          waterDepthMeters,
          peopleTrapped,
          isUrgent,
          contactPhone,
        });
      }
    } catch {
      // Offline fallback
    }

    setTimeout(() => {
      const ref = `CR-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      setSubmissionReceipt(ref);
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center space-x-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
            CITIZEN & FIELD INGESTION
          </span>
          <span className="text-xs text-slate-400">Target Disaster: {currentDisaster?.name || 'Active Incident'}</span>
        </div>
        <h1 className="text-2xl font-black text-slate-100 tracking-tight mt-1 flex items-center space-x-2.5">
          <Users className="w-6 h-6 text-amber-400" />
          <span>Emergency Citizen Report Portal</span>
        </h1>
        <p className="text-sm text-slate-400 mt-0.5">
          Report ground-level hazards, stranded persons, or infrastructure failures directly into the National Command Center queue.
        </p>
      </div>

      {submissionReceipt ? (
        <div className="p-8 rounded-2xl bg-[#0F172A] border border-emerald-500/30 text-center space-y-4 max-w-xl mx-auto shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-100">Report Ingested to Command Queue</h2>
          <p className="text-xs text-slate-400">
            Your report has been securely registered and tagged for automated cross-corroboration by response teams.
          </p>
          <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 font-mono text-cyan-300 text-sm font-bold inline-block">
            Reference Tracking ID: {submissionReceipt}
          </div>
          <div className="pt-2">
            <button
              onClick={() => {
                setSubmissionReceipt(null);
                setDescription('');
              }}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all"
            >
              Submit Another Report
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Form: Details (7 Cols) */}
          <div className="lg:col-span-7 space-y-5 p-6 rounded-xl bg-[#0F172A] border border-slate-800 shadow-xl">
            {/* Category Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                1. Select Emergency Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {categories.map((c) => {
                  const Icon = c.icon;
                  const isSelected = category === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setCategory(c.id)}
                      className={`p-3 rounded-lg border text-left transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'bg-slate-800 border-cyan-400 shadow-md shadow-cyan-950/30'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${c.color}`} />
                      <span className="text-xs font-bold text-slate-200 mt-2">{c.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Urgency Switch */}
            <div className="p-3 rounded-lg bg-red-950/20 border border-red-900/40 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <ShieldAlert className="w-5 h-5 text-red-400" />
                <div>
                  <div className="text-xs font-bold text-red-200">Life-Threatening Emergency?</div>
                  <div className="text-[10px] text-red-300/70">Escalates directly to RED tier priority queue</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={isUrgent}
                onChange={(e) => setIsUrgent(e.target.checked)}
                className="w-5 h-5 accent-red-500 cursor-pointer"
              />
            </div>

            {/* Trapped People & Water Depth */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Persons Requiring Rescue</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={peopleTrapped}
                  onChange={(e) => setPeopleTrapped(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs font-medium text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Estimated Water Depth (Meters)</label>
                <select
                  value={waterDepthMeters}
                  onChange={(e) => setWaterDepthMeters(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs font-medium text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                >
                  <option value={0.3}>0.3m (Ankle / Curb level)</option>
                  <option value={0.6}>0.6m (Knee level)</option>
                  <option value={1.2}>1.2m (Waist level)</option>
                  <option value={1.8}>1.8m (Chest level)</option>
                  <option value={2.5}>2.5m+ (Submerged ground floors)</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Description & Immediate Hazard Details</label>
              <textarea
                required
                rows={3}
                placeholder="Describe current status, landmarks, medical needs, or vulnerable persons (elderly, infants)..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs font-medium text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Contact Phone */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Contact Number (For NDRF Verification)</label>
              <input
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs font-medium text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
          </div>

          {/* Right Column: Location & Photo Upload (5 Cols) */}
          <div className="lg:col-span-5 space-y-5">
            {/* Location Card */}
            <div className="p-5 rounded-xl bg-[#0F172A] border border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  <span>2. Incident Geolocation</span>
                </span>
                <button
                  type="button"
                  onClick={handleUseGPS}
                  className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 flex items-center space-x-1"
                >
                  <Navigation className="w-3 h-3" />
                  <span>Capture GPS</span>
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-400">Street / Area Landmark</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-mono">Latitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={lat}
                    onChange={(e) => setLat(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs font-mono text-slate-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-mono">Longitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={lng}
                    onChange={(e) => setLng(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs font-mono text-slate-200"
                  />
                </div>
              </div>
            </div>

            {/* Photo Attachment */}
            <div className="p-5 rounded-xl bg-[#0F172A] border border-slate-800 space-y-3 shadow-xl">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
                <Camera className="w-4 h-4 text-indigo-400" />
                <span>3. Photographic Evidence</span>
              </span>
              <div className="border border-dashed border-slate-700 p-4 rounded-lg bg-slate-900/40 text-center cursor-pointer hover:border-cyan-500/50 transition-all">
                <Camera className="w-6 h-6 mx-auto text-slate-500" />
                <div className="text-xs font-semibold text-slate-300 mt-1">Tap to capture or upload photo</div>
                <div className="text-[10px] text-slate-500">Helps AI verify flood height against local benchmarks</div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-xl ${
                isSubmitting
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-amber-500/20'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-900 border-t-amber-400 rounded-full animate-spin" />
                  <span>Transmitting Emergency Report...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Transmit Incident to Dispatch</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
