// CareOS Hospital Operating System — Top Header
import React from 'react';
import { useHospital } from '../../state/hospitalStore';
import {
  Activity,
  Mic,
  MicOff,
  Bell,
  Cpu,
  Search,
  Sparkles,
  Volume2,
  VolumeX,
  Play,
  Pause,
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
  } = useHospital();

  const [searchQuery, setSearchQuery] = React.useState('');

  const unresolvedAlerts = alerts.filter((a) => !a.resolved);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      executeCommand(searchQuery.trim());
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-[#E2E8F0] shadow-[0_1px_3px_rgba(15,23,42,0.04)] px-4 lg:px-6 py-2.5">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Hospital Name & Title */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-[#2563EB]/10 border border-[#2563EB]/20 flex items-center justify-center text-[#2563EB] shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          <div className="truncate">
            <div className="flex items-center gap-2">
              <h1 className="text-base font-semibold text-[#172B4D] tracking-tight">
                Hospital Command Center
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#E8F8F6] text-[#0F9F9A] border border-[#0F9F9A]/20">
                Synthetic Demo Data
              </span>
            </div>
            <p className="text-xs text-[#64748B] truncate">
              Real-time hospital operations with multi-agent orchestration • CareOne Multispecialty Hospital
            </p>
          </div>
        </div>

        {/* Center: Search / Prompt input */}
        <div className="flex-1 max-w-xl hidden md:block">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ask CareOS anything... (e.g. Why is P1001 delayed?)"
              className="w-full bg-[#F6F9FC] border border-[#E2E8F0] focus:border-[#2563EB] focus:bg-white rounded-lg pl-9 pr-24 py-1.5 text-xs text-[#172B4D] placeholder-[#64748B] outline-none transition-all"
            />
            <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <button
                type="submit"
                disabled={isInvestigating || !searchQuery.trim()}
                className="px-2 py-0.5 rounded bg-[#2563EB] text-white text-[11px] font-medium disabled:opacity-40 hover:bg-[#1D4ED8] transition-colors"
              >
                Ask
              </button>
            </div>
          </form>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 lg:gap-3 shrink-0">
          {/* TTS Speaker status */}
          {isSpeaking && (
            <button
              onClick={stopSpeaking}
              title="Stop audio playback"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#EAF2FF] text-[#2563EB] text-xs font-medium border border-[#2563EB]/30 animate-pulse"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Speaking</span>
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
            <span className="hidden sm:inline">Live Demo</span>
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                liveDemoMode ? 'bg-[#0F9F9A] animate-ping' : 'bg-gray-300'
              }`}
            />
          </button>

          {/* Voice Talk Button */}
          <button
            onClick={onOpenVoice}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-medium shadow-sm transition-colors"
          >
            <Mic className="w-3.5 h-3.5" />
            <span className="font-semibold">Talk to CareOS</span>
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
            className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#EAF2FF] text-[#2563EB] border border-[#2563EB]/20 text-xs font-medium"
            title="View Live Agent Network"
          >
            <Cpu className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>18 Agents Active</span>
          </button>

          {/* Admin Profile */}
          <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-[#E2E8F0]">
            <div className="w-7 h-7 rounded-full bg-[#172B4D] text-white text-xs font-semibold flex items-center justify-center">
              AD
            </div>
            <div className="text-left hidden lg:block">
              <div className="text-xs font-medium text-[#172B4D]">Hospital Admin</div>
              <div className="text-[10px] text-[#64748B]">CareOne, Vizag</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
