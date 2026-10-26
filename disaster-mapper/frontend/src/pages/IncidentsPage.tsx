import React, { useState } from 'react';
import { useDisasterStore } from '../store/useDisasterStore';
import { api } from '../lib/api';
import {
  AlertTriangle,
  Plus,
  Search,
  Filter,
  MapPin,
  Calendar,
  ExternalLink,
  Edit2,
  Trash2,
  ShieldAlert,
  Flame,
  Droplets,
  Wind
} from 'lucide-react';
import { Link } from 'react-router-dom';
import type { DisasterType, Severity, DisasterStatus } from '../types';

export const IncidentsPage: React.FC = () => {
  const { disastersList, setDisastersList, setSelectedDisaster, selectedDisaster } = useDisasterStore();

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [modalOpen, setModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [type, setType] = useState<DisasterType>('FLOOD');
  const [severity, setSeverity] = useState<Severity>('HIGH');
  const [status, setStatus] = useState<DisasterStatus>('ACTIVE');
  const [description, setDescription] = useState('');
  const [lat, setLat] = useState('28.6139');
  const [lng, setLng] = useState('77.2090');
  const [creating, setCreating] = useState(false);

  const filtered = disastersList.filter((d) => {
    const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.description?.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'ALL' || d.type === typeFilter;
    const matchesSev = severityFilter === 'ALL' || d.severity === severityFilter;
    return matchesSearch && matchesType && matchesSev;
  });

  const handleCreateDisaster = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await api.disasters.create({
        name,
        type,
        severity,
        status,
        description,
        centerLatitude: parseFloat(lat),
        centerLongitude: parseFloat(lng)
      });
      const created = res.data.data;
      setDisastersList([created, ...disastersList]);
      setSelectedDisaster(created);
      setModalOpen(false);
      setName('');
      setDescription('');
    } catch (err) {
      console.warn('Failed creating disaster via API, adding locally:', err);
      const newDisaster = {
        id: `local-${Date.now()}`,
        organizationId: 'org-1',
        name,
        type,
        severity,
        status,
        description,
        centerLatitude: parseFloat(lat),
        centerLongitude: parseFloat(lng),
        startedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setDisastersList([newDisaster, ...disastersList]);
      setSelectedDisaster(newDisaster);
      setModalOpen(false);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center space-x-2">
            <AlertTriangle className="w-6 h-6 text-cyan-400" />
            <span>Disaster Incident Registry</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Authoritative master catalog of active emergencies, declarations, and response theaters.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs px-4 py-2.5 rounded-lg flex items-center space-x-2 shadow-lg shadow-cyan-600/25 transition-all self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Declare New Disaster Incident</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-[#0F172A] p-4 rounded-xl border border-slate-800">
        <div className="relative md:col-span-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search incident name, location, or description..."
            className="w-full bg-[#141F36] text-white text-xs rounded-lg pl-9 pr-3 py-2 border border-slate-700 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full bg-[#141F36] text-white text-xs rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:border-cyan-500 font-semibold"
          >
            <option value="ALL">All Disaster Types</option>
            <option value="FLOOD">Floods</option>
            <option value="LANDSLIDE">Landslides</option>
            <option value="EARTHQUAKE">Earthquakes</option>
            <option value="CYCLONE">Cyclones</option>
            <option value="WILDFIRE">Wildfires</option>
          </select>
        </div>

        <div>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="w-full bg-[#141F36] text-white text-xs rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:border-cyan-500 font-semibold"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical Only</option>
            <option value="HIGH">High Severity</option>
            <option value="MEDIUM">Medium Severity</option>
            <option value="LOW">Low Severity</option>
          </select>
        </div>
      </div>

      {/* Incidents Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((d) => (
          <div
            key={d.id}
            className={`bg-[#0F172A] border rounded-2xl p-5 shadow-xl flex flex-col justify-between transition-all ${
              selectedDisaster?.id === d.id
                ? 'border-cyan-500/80 ring-1 ring-cyan-500/50 bg-[#121E36]'
                : 'border-slate-800 hover:border-slate-700'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded text-[10px] font-mono font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center space-x-1">
                  <span>{d.type}</span>
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  d.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-amber-500/20 text-amber-400'
                }`}>
                  {d.severity} SEVERITY
                </span>
              </div>

              <h3 className="text-base font-bold text-white mb-2">{d.name}</h3>
              <p className="text-xs text-slate-300 line-clamp-2 mb-4 leading-relaxed">
                {d.description || 'No descriptive field notes logged.'}
              </p>

              <div className="space-y-1.5 text-xs text-slate-400 border-t border-slate-800/80 pt-3 font-mono">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{d.centerLatitude.toFixed(4)}, {d.centerLongitude.toFixed(4)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>Declared: {new Date(d.startedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => setSelectedDisaster(d)}
                className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all ${
                  selectedDisaster?.id === d.id
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                    : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                }`}
              >
                {selectedDisaster?.id === d.id ? 'Active Focus' : 'Set as Focus'}
              </button>

              <Link
                to={`/incidents/${d.id}`}
                className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center space-x-1 font-semibold"
              >
                <span>Deep Inspection</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Create Disaster */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-[#0F172A] border border-slate-700 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Declare Disaster Emergency</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateDisaster} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Disaster Event Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Mumbai Coastal Surge Emergency"
                  className="w-full bg-[#141F36] text-white rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as DisasterType)}
                    className="w-full bg-[#141F36] text-white rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="FLOOD">FLOOD</option>
                    <option value="LANDSLIDE">LANDSLIDE</option>
                    <option value="EARTHQUAKE">EARTHQUAKE</option>
                    <option value="CYCLONE">CYCLONE</option>
                    <option value="WILDFIRE">WILDFIRE</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Severity Rating</label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as Severity)}
                    className="w-full bg-[#141F36] text-white rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Center Latitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                    className="w-full bg-[#141F36] text-white rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Center Longitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    value={lng}
                    onChange={(e) => setLng(e.target.value)}
                    className="w-full bg-[#141F36] text-white rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Operational Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detail primary threat, meteorological driver, and initial area impact..."
                  className="w-full bg-[#141F36] text-white rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold"
                >
                  {creating ? 'Registering...' : 'Register Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
