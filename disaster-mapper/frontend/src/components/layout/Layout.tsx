import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { AICopilotDrawer } from '../ai/AICopilotDrawer';
import { Bot } from 'lucide-react';
import { useDisasterStore, defaultDemoDisasters } from '../../store/useDisasterStore';
import { api } from '../../lib/api';

export const Layout: React.FC = () => {
  const { setDisastersList, setSelectedDisaster, selectedDisaster } = useDisasterStore();
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);

  useEffect(() => {
    async function loadDisasters() {
      try {
        const res = await api.disasters.list();
        const apiDisasters = res.data.data?.disasters || [];
        if (apiDisasters.length > 0) {
          // Merge API disasters with operational demo theater registry so no region is missing
          const merged = [...apiDisasters];
          for (const demo of defaultDemoDisasters) {
            const alreadyExists = merged.some(
              (d) => d.id === demo.id || d.name?.toLowerCase().includes(demo.name.slice(0, 15).toLowerCase())
            );
            if (!alreadyExists) {
              merged.push(demo);
            }
          }
          setDisastersList(merged);
        } else {
          setDisastersList(defaultDemoDisasters);
        }
      } catch (err) {
        console.warn('Backend API endpoint offline or initializing, running in standalone operational theater mode.');
        setDisastersList(defaultDemoDisasters);
      }
    }

    loadDisasters();
  }, []);

  return (
    <div className="min-h-screen bg-[#070B14] flex flex-col font-sans relative">
      <Navbar onOpenCopilot={() => setIsCopilotOpen(true)} />
      <div className="flex flex-1 h-[calc(100vh-4rem)] overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-[#070B14] text-slate-100 flex flex-col relative">
          <Outlet />

          {/* Floating Action Button for AI Copilot */}
          <button
            onClick={() => setIsCopilotOpen(true)}
            className="fixed bottom-6 right-6 z-40 px-4 py-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-2xl shadow-cyan-600/40 flex items-center space-x-2.5 border border-cyan-400/40 group hover:scale-105 transition-all cursor-pointer"
            title="Open Disaster Intelligence AI Copilot"
          >
            <div className="relative">
              <Bot className="w-5 h-5 text-white" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            </div>
            <span className="text-xs font-bold tracking-wide">AI Copilot</span>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-cyan-900/60 border border-cyan-400/40 text-cyan-200">
              12 AGENTS
            </span>
          </button>
        </main>
      </div>

      {/* Slide-out AI Copilot Drawer */}
      <AICopilotDrawer isOpen={isCopilotOpen} onClose={() => setIsCopilotOpen(false)} />
    </div>
  );
};
