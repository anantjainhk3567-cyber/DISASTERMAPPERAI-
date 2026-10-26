import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useDisasterStore } from '../../store/useDisasterStore';
import {
  ShieldAlert,
  Search,
  Bell,
  RefreshCw,
  UserCheck,
  ChevronDown,
  Layers,
  Database,
  Sliders,
  LogOut,
  Bot
} from 'lucide-react';
import { Link } from 'react-router-dom';
import type { UserRole } from '../../types';

export const Navbar: React.FC<{ onOpenCopilot?: () => void }> = ({ onOpenCopilot }) => {
  const { user, logout, quickDemoLogin } = useAuthStore();
  const {
    selectedDisaster,
    disastersList,
    setSelectedDisaster,
    isDemoMode,
    setDemoMode,
    searchQuery,
    setSearchQuery
  } = useDisasterStore();

  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const roles: UserRole[] = ['ADMIN', 'ANALYST', 'RESPONDER', 'CITIZEN'];

  return (
    <header className="h-16 bg-[#0B1120] border-b border-[#1E293B] flex items-center justify-between px-6 sticky top-0 z-40 select-none">
      {/* Brand & Active Incident Selector */}
      <div className="flex items-center space-x-6">
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <ShieldAlert className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-base tracking-wider text-white">DISASTERMAPPER</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">AI</span>
            </div>
            <div className="text-[11px] font-medium text-slate-400">National Response Command</div>
          </div>
        </Link>

        {/* Selected Incident Dropdown */}
        <div className="hidden md:flex items-center space-x-2 pl-4 border-l border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Active Event:</span>
          <select
            value={selectedDisaster?.id || ''}
            onChange={(e) => {
              const d = disastersList.find((item) => item.id === e.target.value);
              if (d) setSelectedDisaster(d);
            }}
            className="bg-[#141F36] text-white text-xs rounded-md px-3 py-1.5 border border-slate-700 focus:outline-none focus:border-cyan-500 font-semibold max-w-[220px] truncate"
          >
            {disastersList.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.type})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Center Search Bar */}
      <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search disasters, zones, facilities, or coordinates..."
            className="w-full bg-[#141F36]/80 text-white text-xs rounded-lg pl-9 pr-4 py-2 border border-slate-800 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>
      </div>

      {/* Right Controls: AI Copilot, Mode Toggle, Sync, Alerts, Profile */}
      <div className="flex items-center space-x-3">
        {/* AI Copilot Button */}
        <button
          onClick={onOpenCopilot}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold shadow-md shadow-cyan-600/20 transition-all border border-cyan-400/30"
          title="Open Disaster Intelligence Copilot"
        >
          <Bot className="w-3.5 h-3.5 text-cyan-200" />
          <span>AI Copilot</span>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-pulse"></span>
        </button>

        {/* Mode Badge (Connected vs Demo) */}
        <button
          onClick={() => setDemoMode(!isDemoMode)}
          className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
            isDemoMode
              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
          }`}
          title="Click to toggle Connected vs Demo Mode"
        >
          <Database className="w-3 h-3" />
          <span>{isDemoMode ? 'Demo Mode' : 'Connected Mode'}</span>
        </button>

        {/* Live Telemetry Pulse */}
        <div className="hidden sm:flex items-center space-x-1.5 text-xs text-slate-400">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>
          <span className="font-mono text-[11px] text-slate-400">100% Sync</span>
        </div>

        {/* Notifications Icon Link */}
        <Link
          to="/alerts"
          className="relative p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          title="Alerts Center"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500"></span>
        </Link>

        {/* Role Switcher & User Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setRoleMenuOpen(!roleMenuOpen)}
            className="flex items-center space-x-2 bg-[#141F36] hover:bg-[#1E293B] border border-slate-700/80 px-3 py-1.5 rounded-lg text-xs font-medium text-white transition-colors"
          >
            <div className="w-5 h-5 rounded-full bg-cyan-600/30 text-cyan-400 flex items-center justify-center font-bold text-[10px]">
              {user?.role?.charAt(0) || 'U'}
            </div>
            <span className="max-w-[100px] truncate">{user?.name || 'Commander'}</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-800 text-cyan-300 font-mono">
              {user?.role || 'ADMIN'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {roleMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-[#0F172A] border border-slate-700 rounded-lg shadow-2xl z-50 py-2">
              <div className="px-3 py-2 border-b border-slate-800">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Switch Active Role</div>
                <div className="text-xs text-slate-300 mt-1 font-mono truncate">{user?.email}</div>
              </div>

              <div className="p-1">
                {roles.map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      quickDemoLogin(r);
                      setRoleMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded text-left transition-colors ${
                      user?.role === r
                        ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>{r}</span>
                    {user?.role === r && <UserCheck className="w-3.5 h-3.5 text-cyan-400" />}
                  </button>
                ))}
              </div>

              <div className="border-t border-slate-800 pt-1 mt-1">
                <button
                  onClick={() => {
                    logout();
                    setRoleMenuOpen(false);
                  }}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 rounded text-left"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
