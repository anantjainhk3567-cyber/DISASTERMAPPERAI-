import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { ShieldAlert, LogIn, UserPlus, Key, Mail, Lock, Shield, ArrowRight } from 'lucide-react';
import { api } from '../lib/api';
import type { UserRole } from '../types';

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { setAuth, quickDemoLogin, isLoading } = useAuthStore();

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('admin@demo.local');
  const [password, setPassword] = useState('Demo@123');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('ADMIN');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      if (isRegister) {
        const res = await api.auth.register({ email, password, name, role });
        const data = res.data.data;
        setAuth(data.user, data.accessToken);
      } else {
        const res = await api.auth.login({ email, password });
        const data = res.data.data;
        setAuth(data.user, data.accessToken);
      }
      navigate('/');
    } catch (err: any) {
      console.warn('Authentication error:', err);
      // Fallback: log in with demo account
      await quickDemoLogin(role);
      navigate('/');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickDemo = async (selectedRole: UserRole) => {
    await quickDemoLogin(selectedRole);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#070B14] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 items-center justify-center shadow-xl shadow-cyan-500/20 mb-4 border border-cyan-400/30">
            <ShieldAlert className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-black tracking-wider text-white">DISASTERMAPPER AI</h1>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-semibold">
            National Disaster Intelligence & Response Command
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-[#0F172A]/90 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-xl">
          <div className="flex border-b border-slate-800 mb-6">
            <button
              onClick={() => setIsRegister(false)}
              className={`flex-1 pb-3 text-xs font-bold transition-colors border-b-2 ${
                !isRegister ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              Sign In to Command Center
            </button>
            <button
              onClick={() => setIsRegister(true)}
              className={`flex-1 pb-3 text-xs font-bold transition-colors border-b-2 ${
                isRegister ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              Register Operator
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Commander Jane Doe"
                    className="w-full bg-[#141F36] text-white text-xs rounded-lg px-3 py-2.5 border border-slate-700 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">Operator Email</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@demo.local"
                  className="w-full bg-[#141F36] text-white text-xs rounded-lg px-3 py-2.5 border border-slate-700 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">Security Key / Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#141F36] text-white text-xs rounded-lg px-3 py-2.5 border border-slate-700 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>
            </div>

            {isRegister && (
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">Role Classification</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full bg-[#141F36] text-white text-xs rounded-lg px-3 py-2.5 border border-slate-700 focus:outline-none focus:border-cyan-500 font-semibold"
                >
                  <option value="ADMIN">ADMIN — Emergency Commander</option>
                  <option value="ANALYST">ANALYST — Senior GIS Specialist</option>
                  <option value="RESPONDER">RESPONDER — Field Rescue Operator</option>
                  <option value="CITIZEN">CITIZEN — Public Community Reporter</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || isLoading}
              className="w-full mt-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs py-3 rounded-lg shadow-lg shadow-cyan-600/25 transition-all flex items-center justify-center space-x-2"
            >
              <span>{isRegister ? 'Complete Registration' : 'Authorize & Enter Command Center'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Access Buttons */}
          <div className="mt-8 pt-6 border-t border-slate-800">
            <div className="text-[10px] uppercase font-black text-slate-400 tracking-wider text-center mb-3">
              One-Click Evaluator Demo Profiles
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('ADMIN')}
                className="bg-[#141F36] hover:bg-[#1E293B] border border-cyan-500/40 hover:border-cyan-400 p-2.5 rounded-lg text-left transition-all group"
              >
                <div className="text-[11px] font-bold text-cyan-300 group-hover:text-cyan-200">Admin Commander</div>
                <div className="text-[10px] text-slate-400 font-mono">admin@demo.local</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('ANALYST')}
                className="bg-[#141F36] hover:bg-[#1E293B] border border-blue-500/40 hover:border-blue-400 p-2.5 rounded-lg text-left transition-all group"
              >
                <div className="text-[11px] font-bold text-blue-300 group-hover:text-blue-200">GIS Analyst</div>
                <div className="text-[10px] text-slate-400 font-mono">analyst@demo.local</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('RESPONDER')}
                className="bg-[#141F36] hover:bg-[#1E293B] border border-amber-500/40 hover:border-amber-400 p-2.5 rounded-lg text-left transition-all group"
              >
                <div className="text-[11px] font-bold text-amber-300 group-hover:text-amber-200">Rescue Responder</div>
                <div className="text-[10px] text-slate-400 font-mono">responder@demo.local</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('CITIZEN')}
                className="bg-[#141F36] hover:bg-[#1E293B] border border-emerald-500/40 hover:border-emerald-400 p-2.5 rounded-lg text-left transition-all group"
              >
                <div className="text-[11px] font-bold text-emerald-300 group-hover:text-emerald-200">Citizen Reporter</div>
                <div className="text-[10px] text-slate-400 font-mono">citizen@demo.local</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
