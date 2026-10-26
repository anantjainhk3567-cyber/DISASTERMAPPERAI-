import React, { useState } from 'react';
import { useDisasterStore } from '../store/useDisasterStore';
import { api } from '../lib/api';
import {
  Home,
  Users,
  Activity,
  Zap,
  Accessibility,
  Plus,
  Edit2,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  MapPin,
  Phone,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';

interface ShelterItem {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  totalCapacity: number;
  currentOccupancy: number;
  hasMedical: boolean;
  hasPowerBackup: boolean;
  isAccessible: boolean;
  suppliesDaysRemaining: number;
  contactPerson: string;
  contactPhone: string;
}

const initialShelters: ShelterItem[] = [
  {
    id: 'sh-as-01',
    name: 'Morigaon District Sports Stadium Relief Complex',
    address: 'Stadium Road, Morigaon Civil Sub-Division, Assam',
    lat: 26.2480,
    lng: 92.5180,
    totalCapacity: 3000,
    currentOccupancy: 2850,
    hasMedical: true,
    hasPowerBackup: true,
    isAccessible: true,
    suppliesDaysRemaining: 5.5,
    contactPerson: 'ADC Relief Pankaj Borah (ASDMA)',
    contactPhone: '+91 94350 21980',
  },
  {
    id: 'sh-as-02',
    name: 'Silghat Higher Secondary School Emergency Camp',
    address: 'Silghat River Road, Kaliabor, Nagaon, Assam',
    lat: 26.3420,
    lng: 92.9320,
    totalCapacity: 1200,
    currentOccupancy: 980,
    hasMedical: true,
    hasPowerBackup: true,
    isAccessible: true,
    suppliesDaysRemaining: 4.0,
    contactPerson: 'Circle Officer Anupama Saikia',
    contactPhone: '+91 94351 88421',
  },
  {
    id: 'sh-jk-01',
    name: 'Chanderkote National Highway Transit Camp',
    address: 'NH-44 Bypass Corridor, Ramban, Jammu & Kashmir',
    lat: 33.1950,
    lng: 75.1850,
    totalCapacity: 2500,
    currentOccupancy: 1840,
    hasMedical: true,
    hasPowerBackup: true,
    isAccessible: true,
    suppliesDaysRemaining: 6.0,
    contactPerson: 'Sub-Divisional Magistrate Tariq Bhat',
    contactPhone: '+91 94190 32189',
  },
  {
    id: 'sh-shimla-01',
    name: 'Shimla Municipal Indoor Stadium Emergency Camp',
    address: 'Circular Cart Road, Near Lift, Shimla, Himachal Pradesh',
    lat: 31.1010,
    lng: 77.1650,
    totalCapacity: 850,
    currentOccupancy: 380,
    hasMedical: true,
    hasPowerBackup: true,
    isAccessible: true,
    suppliesDaysRemaining: 8.0,
    contactPerson: 'SDM Urban Shimla Bhanu Pratap (HPSDMA)',
    contactPhone: '+91 98160 44210',
  },
  {
    id: 'sh-shimla-02',
    name: 'Government Senior Secondary School Boileauganj',
    address: 'Summer Hill Road, Boileauganj, Shimla, Himachal Pradesh',
    lat: 31.1070,
    lng: 77.1420,
    totalCapacity: 400,
    currentOccupancy: 210,
    hasMedical: false,
    hasPowerBackup: true,
    isAccessible: true,
    suppliesDaysRemaining: 5.5,
    contactPerson: 'Relief Incharge Meenakshi Sharma',
    contactPhone: '+91 98161 33490',
  },
  {
    id: 'sh-01',
    name: 'Kashmere Gate Community Relief Shelter',
    address: 'Near ISBT Terminal, Lothian Road',
    lat: 28.6670,
    lng: 77.2310,
    totalCapacity: 800,
    currentOccupancy: 690,
    hasMedical: true,
    hasPowerBackup: true,
    isAccessible: true,
    suppliesDaysRemaining: 4.5,
    contactPerson: 'Inspector Rajesh Verma',
    contactPhone: '+91 98112 77889',
  },
  {
    id: 'sh-02',
    name: 'Civil Lines Government Boys Senior Sec. School',
    address: 'Sham Nath Marg, Civil Lines',
    lat: 28.6750,
    lng: 77.2240,
    totalCapacity: 1200,
    currentOccupancy: 540,
    hasMedical: true,
    hasPowerBackup: true,
    isAccessible: true,
    suppliesDaysRemaining: 7.0,
    contactPerson: 'Principal M. K. Sharma',
    contactPhone: '+91 98450 33445',
  },
  {
    id: 'sh-03',
    name: 'Geeta Colony Sports Complex Relief Center',
    address: 'Geeta Colony Ring Road Approach',
    lat: 28.6540,
    lng: 77.2650,
    totalCapacity: 600,
    currentOccupancy: 580,
    hasMedical: false,
    hasPowerBackup: true,
    isAccessible: false,
    suppliesDaysRemaining: 2.5,
    contactPerson: 'Ward Officer Sunita Rao',
    contactPhone: '+91 97110 55667',
  },
  {
    id: 'sh-04',
    name: 'Majnu Ka Tila Tibetan Camp Community Hall',
    address: 'Aruna Nagar, Outer Ring Road',
    lat: 28.7020,
    lng: 77.2290,
    totalCapacity: 500,
    currentOccupancy: 180,
    hasMedical: true,
    hasPowerBackup: false,
    isAccessible: true,
    suppliesDaysRemaining: 6.0,
    contactPerson: 'Camp Lead Tenzin Norbu',
    contactPhone: '+91 99882 11223',
  },
];

export const SheltersPage: React.FC = () => {
  const { currentDisaster } = useDisasterStore();
  const [shelters, setShelters] = useState<ShelterItem[]>(initialShelters);

  // Evacuation Allocation Assistant State
  const [evacueeCount, setEvacueeCount] = useState(350);
  const [selectedOrigin, setSelectedOrigin] = useState('Yamuna Khadar Sector 1');
  const [allocationPlan, setAllocationPlan] = useState<any>(null);
  const [isAllocating, setIsAllocating] = useState(false);

  // Quick Occupancy Update Modal
  const [activeShelterEdit, setActiveShelterEdit] = useState<ShelterItem | null>(null);
  const [newOccupancy, setNewOccupancy] = useState<number>(0);

  // Aggregate stats
  const totalCapacity = shelters.reduce((acc, s) => acc + s.totalCapacity, 0);
  const totalOccupied = shelters.reduce((acc, s) => acc + s.currentOccupancy, 0);
  const totalAvailable = totalCapacity - totalOccupied;
  const occupancyPercent = ((totalOccupied / totalCapacity) * 100).toFixed(1);

  const handleRunAllocation = () => {
    setIsAllocating(true);
    setAllocationPlan(null);

    setTimeout(() => {
      // Find candidate shelters with available beds
      const availableShelters = [...shelters]
        .map((s) => ({ ...s, available: s.totalCapacity - s.currentOccupancy }))
        .filter((s) => s.available > 0)
        .sort((a, b) => b.available - a.available);

      let remaining = evacueeCount;
      const assignments: any[] = [];

      for (const sh of availableShelters) {
        if (remaining <= 0) break;
        const take = Math.min(remaining, sh.available);
        assignments.push({
          shelter: sh,
          assigned: take,
          remainingAfter: sh.available - take,
        });
        remaining -= take;
      }

      setAllocationPlan({
        totalRequested: evacueeCount,
        origin: selectedOrigin,
        assignments,
        fullyAccommodated: remaining <= 0,
        unallocated: remaining > 0 ? remaining : 0,
      });
      setIsAllocating(false);
    }, 500);
  };

  const handleSaveOccupancy = async () => {
    if (!activeShelterEdit) return;

    try {
      await api.shelters.updateOccupancy(activeShelterEdit.id, newOccupancy);
    } catch {
      // Offline fallback
    }

    setShelters((prev) =>
      prev.map((s) => (s.id === activeShelterEdit.id ? { ...s, currentOccupancy: newOccupancy } : s))
    );
    setActiveShelterEdit(null);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              CIVIL DEFENSE SHELTER NETWORK
            </span>
            <span className="text-xs text-slate-400">Jurisdiction: {currentDisaster?.name || 'NCR Sector'}</span>
          </div>
          <h1 className="text-2xl font-black text-slate-100 tracking-tight mt-1 flex items-center space-x-2.5">
            <Home className="w-6 h-6 text-emerald-400" />
            <span>Shelter Management & Smart Evacuation Allocation</span>
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Real-time bed availability tracking, medical preparedness verification, and automated multi-shelter evacuation routing.
          </p>
        </div>
      </div>

      {/* Aggregate KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#0F172A] border border-slate-800">
          <div className="text-[11px] font-mono text-slate-400 uppercase">Total Bed Capacity</div>
          <div className="text-2xl font-black font-mono text-slate-100 mt-1">
            {totalCapacity.toLocaleString()} <span className="text-xs font-normal text-slate-400">beds</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0F172A] border border-slate-800">
          <div className="text-[11px] font-mono text-slate-400 uppercase">Current Occupants</div>
          <div className="text-2xl font-black font-mono text-amber-300 mt-1">
            {totalOccupied.toLocaleString()} <span className="text-xs font-normal text-slate-400">({occupancyPercent}%)</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0F172A] border border-slate-800">
          <div className="text-[11px] font-mono text-slate-400 uppercase">Available Buffer Beds</div>
          <div className="text-2xl font-black font-mono text-emerald-400 mt-1">
            {totalAvailable.toLocaleString()} <span className="text-xs font-normal text-slate-400">available</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0F172A] border border-slate-800">
          <div className="text-[11px] font-mono text-slate-400 uppercase">Active Shelters</div>
          <div className="text-2xl font-black font-mono text-cyan-300 mt-1">
            {shelters.length} <span className="text-xs font-normal text-slate-400">facilities</span>
          </div>
        </div>
      </div>

      {/* Main Layout: Shelter Grid (8 cols) & Automated Evacuation Planner (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Shelter Cards List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Designated Emergency Shelters
            </h2>
            <span className="text-xs text-slate-500 font-mono">Updated every 5 mins</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...shelters].sort((a, b) => {
              const lat = currentDisaster?.centerLatitude || 26.3150;
              const lng = currentDisaster?.centerLongitude || 92.9376;
              const distA = Math.hypot(a.lat - lat, a.lng - lng);
              const distB = Math.hypot(b.lat - lat, b.lng - lng);
              return distA - distB;
            }).map((s) => {
              const occRatio = s.currentOccupancy / s.totalCapacity;
              const isFull = occRatio >= 0.9;
              const isMedium = occRatio >= 0.7;

              return (
                <div
                  key={s.id}
                  className="p-5 rounded-xl bg-[#0F172A] border border-slate-800 hover:border-slate-700 transition-all space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 pr-2">
                        <h3 className="text-sm font-bold text-slate-100 truncate">{s.name}</h3>
                        <p className="text-[11px] text-slate-400 flex items-center space-x-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                          <span className="truncate">{s.address}</span>
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          setActiveShelterEdit(s);
                          setNewOccupancy(s.currentOccupancy);
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all shrink-0"
                        title="Update Occupancy"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Capacity Progress Bar */}
                    <div className="space-y-1.5 pt-2">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-slate-400">Occupancy</span>
                        <span
                          className={`font-bold ${
                            isFull ? 'text-red-400' : isMedium ? 'text-amber-400' : 'text-emerald-400'
                          }`}
                        >
                          {s.currentOccupancy} / {s.totalCapacity} ({(occRatio * 100).toFixed(0)}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            isFull ? 'bg-red-500' : isMedium ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min(100, occRatio * 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Badges Strip */}
                    <div className="flex items-center space-x-2 pt-1 flex-wrap gap-y-1">
                      {s.hasMedical && (
                        <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-pink-500/20 text-pink-300 border border-pink-500/30 flex items-center space-x-1">
                          <Activity className="w-3 h-3" />
                          <span>Medical Aid</span>
                        </span>
                      )}
                      {s.hasPowerBackup && (
                        <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 flex items-center space-x-1">
                          <Zap className="w-3 h-3" />
                          <span>Generator</span>
                        </span>
                      )}
                      {s.isAccessible && (
                        <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center space-x-1">
                          <Accessibility className="w-3 h-3" />
                          <span>Accessible</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Stock: {s.suppliesDaysRemaining} days</span>
                    <span className="font-mono text-slate-500">{s.contactPhone}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Smart Evacuation Allocation Tool */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-xl bg-[#0F172A] border border-slate-800 space-y-4 shadow-xl">
            <div className="border-b border-slate-800 pb-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400">
                AUTOMATED EVACUATION DISPATCH
              </span>
              <h3 className="text-sm font-bold text-slate-100 mt-0.5">Smart Allocation Assistant</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Calculates optimal distribution across non-saturated shelters based on bed headroom.
              </p>
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Evacuee Count</label>
                <input
                  type="number"
                  min="10"
                  max="5000"
                  step="25"
                  value={evacueeCount}
                  onChange={(e) => setEvacueeCount(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono font-bold text-cyan-300 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Origin Danger Zone</label>
                <select
                  value={selectedOrigin}
                  onChange={(e) => setSelectedOrigin(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs font-medium text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="Yamuna Khadar Sector 1">Yamuna Khadar Sector 1 (High Risk)</option>
                  <option value="Kashmere Gate Lowlands">Kashmere Gate Lowlands (Inundated)</option>
                  <option value="Geeta Colony Embankment">Geeta Colony Embankment (Threatened)</option>
                </select>
              </div>

              <button
                onClick={handleRunAllocation}
                disabled={isAllocating}
                className={`w-full py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-md ${
                  isAllocating
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/20'
                }`}
              >
                {isAllocating ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-slate-900 border-t-cyan-400 rounded-full animate-spin" />
                    <span>Allocating Beds...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate Evacuation Split</span>
                  </>
                )}
              </button>
            </div>

            {/* Generated Allocation Plan */}
            {allocationPlan && (
              <div className="p-4 rounded-lg bg-slate-900 border border-cyan-500/30 space-y-3 pt-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-200 border-b border-slate-800 pb-2">
                  <span>Allocation Recommendation</span>
                  <span className="text-emerald-400 font-mono text-[10px]">OPTIMAL FIT</span>
                </div>

                <div className="space-y-2">
                  {allocationPlan.assignments.map((item: any) => (
                    <div
                      key={item.shelter.id}
                      className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="font-semibold text-slate-200 truncate">{item.shelter.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          Buffer left: {item.remainingAfter} beds
                        </div>
                      </div>
                      <div className="font-mono font-bold text-cyan-300 shrink-0">
                        +{item.assigned} persons
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => alert(`Evacuation dispatch orders broadcast to Civil Defence transport units for ${evacueeCount} evacuees.`)}
                  className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center justify-center space-x-1.5 transition-all shadow"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Confirm & Issue Transport Orders</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Occupancy Modal */}
      {activeShelterEdit && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-slate-100">Update Live Shelter Occupancy</h3>
            <p className="text-xs text-slate-400">{activeShelterEdit.name}</p>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Current Inhabitants Count</label>
              <input
                type="number"
                min="0"
                max={activeShelterEdit.totalCapacity}
                value={newOccupancy}
                onChange={(e) => setNewOccupancy(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono font-bold text-cyan-300 focus:outline-none focus:border-cyan-500"
              />
              <div className="text-[10px] text-slate-500 font-mono">
                Total Capacity: {activeShelterEdit.totalCapacity} beds
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setActiveShelterEdit(null)}
                className="px-3 py-2 bg-slate-800 text-slate-300 text-xs rounded-lg font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveOccupancy}
                className="px-4 py-2 bg-cyan-500 text-slate-950 text-xs rounded-lg font-bold hover:bg-cyan-400"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
