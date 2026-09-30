// CareOS Hospital Operating System — Top Header with Role-Based Authentication
import React, { useState } from 'react';
import { useHospital } from '../../state/hospitalStore';
import { ROLE_DEFINITIONS } from '../../data/userRoles';
import {
  Activity,
  Mic,
  Bell,
  Cpu,
  Search,
  Volume2,
  VolumeX,
  Play,
  Pause,
  User,
  ShieldCheck,
  ChevronDown,
  Lock,
} from 'lucide-react';

interface HeaderProps {
  onOpenVoice: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenVoice }) => {
  const {
    executeCommand,
    isInvestigating,
    alerts,
    setActivePage,
    liveDemoMode,
    setLiveDemoMode,
    isSpeaking,
    stopSpeaking,
    currentUser,
    setIsLoginModalOpen,
  } = useHospital();

  const [searchQuery, setSearchQuery] = useState('');

  const unresolvedAlerts = alerts.filter((a) => !a.resolved);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      executeCommand(searchQuery.trim());
      setSearchQuery('');
    }
  };

  const roleMeta = currentUser ? ROLE_DEFINITIONS[currentUser.role] : null;

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-[#E2E8F0] shadow-[0_1px_3px_rgba(15,23,42,0.03)] px-4 lg:px-6 py-2.5">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Branding & Subtitle */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-[#2563EB] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
            <Activity className="w-4 h-4" />
          </div>
          <div className="truncate">
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-[#172B4D] tracking-tight">
                Hospital Command Center
              </h1>
              <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#E8F8F6] text-[#0F9F9A] border border-[#0F9F9A]/20">
                Synthetic Demo
              </span>
            </div>
            <p className="text-[11px] text-[#64748B] truncate">
              CareOne Multispecialty • Visakhapatnam
            </p>
          </div>
        </div>

        {/* Center: Search / Prompt input */}
        <div className="flex-1 max-w-lg hidden md:block">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ask CareOS anything... (e.g. Why is P1001 delayed?)"
              className="w-full bg-[#F6F9FC] border border-[#E2E8F0] focus:border-[#2563EB] focus:bg-white rounded-lg pl-8 pr-16 py-1.5 text-xs text-[#172B4D] placeholder-[#64748B] outline-none transition-all"
            />
            <button
              type="submit"
              disabled={isInvestigating || !searchQuery.trim()}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded bg-[#2563EB] text-white text-[11px] font-medium disabled:opacity-40 hover:bg-[#1D4ED8] transition-colors"
            >
              Ask
            </button>
          </form>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 lg:gap-2.5 shrink-0">
          {/* TTS Speaker status */}
          {isSpeaking && (
            <button
              onClick={stopSpeaking}
              title="Stop audio playback"
              className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-[#EAF2FF] text-[#2563EB] text-xs font-medium border border-[#2563EB]/30 animate-pulse"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">Speaking</span>
              <VolumeX className="w-3 h-3 text-[#DC2626]" />
            </button>
          )}

          {/* Live Demo Toggle */}
          <button
            onClick={() => setLiveDemoMode(!liveDemoMode)}
            title={liveDemoMode ? 'Pause live simulation events' : 'Start live simulation events'}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
              liveDemoMode
                ? 'bg-[#E8F8F6] text-[#0F9F9A] border-[#0F9F9A]/30'
                : 'bg-white text-[#64748B] border-[#E2E8F0] hover:bg-[#F6F9FC]'
            }`}
          >
            {liveDemoMode ? <Pause className="w-3 h-3 text-[#0F9F9A]" /> : <Play className="w-3 h-3 text-[#64748B]" />}
            <span className="hidden sm:inline text-[11px]">Live Demo</span>
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                liveDemoMode ? 'bg-[#0F9F9A] animate-ping' : 'bg-gray-300'
              }`}
            />
          </button>

          {/* Voice Talk Button */}
          <button
            onClick={onOpenVoice}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Mic className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Talk to CareOS</span>
          </button>

          {/* Alerts Bell */}
          <button
            onClick={() => setActivePage('alerts')}
            className="relative p-1.5 rounded-lg text-[#64748B] hover:text-[#172B4D] hover:bg-[#F6F9FC] border border-[#E2E8F0] transition-colors"
            title="Hospital Alerts"
          >
            <Bell className="w-4 h-4" />
            {unresolvedAlerts.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#DC2626] text-white text-[10px] font-bold flex items-center justify-center">
                {unresolvedAlerts.length}
              </span>
            )}
          </button>

          {/* Active Agents Badge */}
          <button
            onClick={() => setActivePage('agent_network')}
            className="hidden xl:flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#F6F9FC] hover:bg-[#EAF2FF] text-[#2563EB] border border-[#E2E8F0] text-xs font-medium transition-colors"
            title="View Live Agent Network"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span className="text-[11px]">18 Agents Active</span>
          </button>

          {/* Role-Based Login & Profile Button */}
          <div className="pl-1 sm:pl-2 border-l border-[#E2E8F0]">
            {currentUser ? (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="flex items-center gap-2 px-2.5 py-1 rounded-lg border border-[#E2E8F0] hover:border-[#2563EB]/40 bg-white hover:bg-[#F6F9FC] transition-all text-left group shadow-2xs"
                title="Click to Switch Active Role or Sign Out"
              >
                <div className="w-7 h-7 rounded-full bg-[#2563EB] text-white text-xs font-bold flex items-center justify-center shrink-0">
                  {currentUser.initials}
                </div>
                <div className="hidden sm:block">
                  <div className="text-xs font-semibold text-[#172B4D] flex items-center gap-1 leading-tight group-hover:text-[#2563EB]">
                    <span>{currentUser.name.split(' ')[0]}</span>
                    <ChevronDown className="w-3 h-3 text-[#64748B]" />
                  </div>
                  <div className="text-[10px] font-medium text-[#64748B] flex items-center gap-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${roleMeta?.bg ? 'bg-[#2563EB]' : 'bg-gray-400'}`} />
                    <span className="truncate max-w-[90px]">{roleMeta?.label.split(' ')[0] || currentUser.role}</span>
                  </div>
                </div>
              </button>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#172B4D] hover:bg-[#2563EB] text-white text-xs font-semibold shadow-xs transition-colors"
              >
                <Lock className="w-3 h-3" />
                <span>Staff Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
