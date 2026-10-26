import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Map,
  AlertTriangle,
  Droplets,
  Activity,
  Compass,
  Wind,
  Flame,
  Mountain,
  Cpu,
  Satellite,
  SplitSquareVertical,
  Users,
  CheckCircle2,
  Navigation,
  Home,
  Building2,
  History,
  Gauge,
  BellRing,
  BarChart3,
  Settings
} from 'lucide-react';

interface NavItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  category: 'core' | 'hazards' | 'intelligence' | 'response' | 'system';
}

const navItems: NavItem[] = [
  // Core Operational
  { name: 'Command Overview', path: '/', icon: LayoutDashboard, category: 'core' },
  { name: 'Live GIS Map', path: '/map', icon: Map, badge: '3D', category: 'core' },
  { name: 'Incident Registry', path: '/incidents', icon: AlertTriangle, category: 'core' },

  // Hazard Intelligence Boards
  { name: 'Flood Intelligence', path: '/flood', icon: Droplets, badge: 'HYDRO', category: 'hazards' },
  { name: 'Earthquake Intelligence', path: '/earthquake', icon: Activity, badge: 'SEISMIC', category: 'hazards' },
  { name: 'Volcano Intelligence', path: '/volcano', icon: Compass, badge: 'VAL-4', category: 'hazards' },
  { name: 'Cyclone Intelligence', path: '/cyclone', icon: Wind, badge: 'CAT-4', category: 'hazards' },
  { name: 'Wildfire Intelligence', path: '/wildfire', icon: Flame, badge: 'FIRE', category: 'hazards' },
  { name: 'Landslide Intelligence', path: '/landslide', icon: Mountain, badge: 'SLOPE', category: 'hazards' },

  // AI & Simulation
  { name: 'AI Models & Agents', path: '/ai-systems', icon: Cpu, badge: 'OPS', category: 'intelligence' },
  { name: 'Disaster Simulator', path: '/simulator', icon: Cpu, badge: 'AI', category: 'intelligence' },
  { name: 'Satellite Imagery', path: '/imagery', icon: Satellite, category: 'intelligence' },
  { name: 'Before/After Slider', path: '/comparison', icon: SplitSquareVertical, category: 'intelligence' },
  { name: 'Prediction vs Reality', path: '/validation', icon: Gauge, category: 'intelligence' },

  // Emergency Response Operations
  { name: 'Where Help is Needed', path: '/priorities', icon: Flame, badge: 'PRIORITY', category: 'response' },
  { name: 'Emergency Routing', path: '/routing', icon: Navigation, category: 'response' },
  { name: 'Shelter Management', path: '/shelters', icon: Home, category: 'response' },
  { name: 'Infrastructure Impact', path: '/impact', icon: Building2, category: 'response' },
  { name: 'Citizen Reports', path: '/citizen-reports', icon: Users, category: 'response' },
  { name: 'Verification Queue', path: '/verification', icon: CheckCircle2, category: 'response' },

  // Retrospective & Reporting
  { name: 'Disaster Timeline', path: '/timeline', icon: History, category: 'system' },
  { name: 'Alerts Operations', path: '/alerts', icon: BellRing, category: 'system' },
  { name: 'Analytics & Reports', path: '/analytics', icon: BarChart3, category: 'system' },
  { name: 'System Settings', path: '/settings', icon: Settings, category: 'system' },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-[#090D16] border-r border-[#1E293B] flex flex-col h-[calc(100vh-4rem)] select-none">
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {/* Navigation Categories */}
        <div>
          <div className="px-3 mb-2 text-[10px] font-black uppercase tracking-wider text-slate-500">
            Mission Control
          </div>
          <div className="space-y-1">
            {navItems
              .filter((i) => i.category === 'core')
              .map((item) => (
                <NavItemLink key={item.path} item={item} />
              ))}
          </div>
        </div>

        <div>
          <div className="px-3 mb-2 text-[10px] font-black uppercase tracking-wider text-purple-400/90 flex items-center justify-between">
            <span>Hazard Intelligence</span>
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300">6 HAZARDS</span>
          </div>
          <div className="space-y-1">
            {navItems
              .filter((i) => i.category === 'hazards')
              .map((item) => (
                <NavItemLink key={item.path} item={item} />
              ))}
          </div>
        </div>

        <div>
          <div className="px-3 mb-2 text-[10px] font-black uppercase tracking-wider text-cyan-500/80">
            AI Simulation & Imagery
          </div>
          <div className="space-y-1">
            {navItems
              .filter((i) => i.category === 'intelligence')
              .map((item) => (
                <NavItemLink key={item.path} item={item} />
              ))}
          </div>
        </div>

        <div>
          <div className="px-3 mb-2 text-[10px] font-black uppercase tracking-wider text-amber-500/80">
            Emergency Response
          </div>
          <div className="space-y-1">
            {navItems
              .filter((i) => i.category === 'response')
              .map((item) => (
                <NavItemLink key={item.path} item={item} />
              ))}
          </div>
        </div>

        <div>
          <div className="px-3 mb-2 text-[10px] font-black uppercase tracking-wider text-slate-500">
            Review & Diagnostics
          </div>
          <div className="space-y-1">
            {navItems
              .filter((i) => i.category === 'system')
              .map((item) => (
                <NavItemLink key={item.path} item={item} />
              ))}
          </div>
        </div>
      </div>

      {/* Footer System Status Banner */}
      <div className="p-3 border-t border-slate-800/80 bg-[#0B1120]">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span className="font-medium">Command Ops Online</span>
          </span>
          <span className="font-mono text-[10px] text-slate-500">v2.4.0</span>
        </div>
      </div>
    </aside>
  );
};

const NavItemLink: React.FC<{ item: NavItem }> = ({ item }) => {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.path}
      end={item.path === '/'}
      className={({ isActive }) =>
        `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
          isActive
            ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-300 font-semibold border-l-2 border-cyan-400 pl-2.5'
            : 'text-slate-400 hover:text-slate-100 hover:bg-[#141F36]/60'
        }`
      }
    >
      <div className="flex items-center space-x-3 truncate">
        <Icon className="w-4 h-4 shrink-0 transition-colors group-hover:text-cyan-400" />
        <span className="truncate">{item.name}</span>
      </div>
      {item.badge && (
        <span
          className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
            item.badge === 'LIVE'
              ? 'bg-emerald-500/20 text-emerald-400'
              : item.badge === 'AI'
              ? 'bg-cyan-500/20 text-cyan-300'
              : 'bg-red-500/20 text-red-400'
          }`}
        >
          {item.badge}
        </span>
      )}
    </NavLink>
  );
};
