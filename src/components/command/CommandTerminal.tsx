// CareOS Hospital Operating System — Command Terminal
import React, { useState } from 'react';
import { useHospital } from '../../state/hospitalStore';
import { Terminal, Send, Mic, Sparkles, AlertCircle, RefreshCw, X } from 'lucide-react';

interface CommandTerminalProps {
  onOpenVoice: () => void;
}

export const CommandTerminal: React.FC<CommandTerminalProps> = ({ onOpenVoice }) => {
  const { executeCommand, isInvestigating, currentInvestigation, clearInvestigation } = useHospital();
  const [inputVal, setInputVal] = useState('');

  const demoShortcuts = [
    { label: 'Why is P1001 delayed?', query: 'Why is P1001 delayed?' },
    { label: "Find today's bottlenecks", query: "Find today's bottlenecks" },
    { label: 'Analyze radiology', query: 'How many patients are waiting in radiology and why?' },
    { label: 'Show discharge blockers', query: 'Show discharge blockers for P1001' },
    { label: 'Check available beds', query: 'Find available beds for a new ICU admission' },
    { label: 'Analyze hospital operations', query: "Analyze today's hospital operations" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim() && !isInvestigating) {
      executeCommand(inputVal.trim());
      setInputVal('');
    }
  };

  const handleShortcut = (query: string) => {
    setInputVal('');
    executeCommand(query);
  };

  return (
    <div
      id="careos-command-terminal"
      className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_2px_8px_rgba(15,23,42,0.05)] p-4 transition-all"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#2563EB]/10 text-[#2563EB] flex items-center justify-center">
            <Terminal className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold text-[#172B4D] uppercase tracking-wider">
            CareOS Command Terminal
          </span>
          <span className="text-[11px] text-[#64748B] hidden sm:inline">
            • Autonomous Multi-Agent Orchestration
          </span>
        </div>

        {currentInvestigation && (
          <button
            onClick={clearInvestigation}
            className="flex items-center gap-1 text-[11px] text-[#64748B] hover:text-[#DC2626] transition-colors"
          >
            <X className="w-3 h-3" />
            Clear active run
          </button>
        )}
      </div>

      {/* Main input form */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center gap-2 bg-[#F6F9FC] border border-[#E2E8F0] focus-within:border-[#2563EB] focus-within:bg-white rounded-lg px-3 py-2 transition-all">
          <Sparkles className="w-4 h-4 text-[#3B82F6] shrink-0" />
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            disabled={isInvestigating}
            placeholder="Ask CareOS to investigate the hospital... (e.g. Why is P1001 delayed? or Analyze radiology)"
            className="flex-1 bg-transparent text-xs text-[#172B4D] placeholder-[#64748B] outline-none disabled:opacity-50"
          />

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={onOpenVoice}
              disabled={isInvestigating}
              title="Voice Mode"
              className="p-1.5 rounded-md hover:bg-white text-[#2563EB] hover:shadow-xs transition-all disabled:opacity-40"
            >
              <Mic className="w-4 h-4" />
            </button>

            <button
              type="submit"
              disabled={isInvestigating || !inputVal.trim()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold shadow-xs disabled:opacity-40 transition-colors"
            >
              {isInvestigating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Investigating...</span>
                </>
              ) : (
                <>
                  <span>Dispatch</span>
                  <Send className="w-3 h-3" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Demo Shortcuts */}
      <div className="mt-3 flex items-center gap-1.5 flex-wrap">
        <span className="text-[10px] text-[#64748B] font-semibold uppercase tracking-wider shrink-0 mr-1">
          Demo Scenarios:
        </span>
        {demoShortcuts.map((sc) => (
          <button
            key={sc.label}
            onClick={() => handleShortcut(sc.query)}
            disabled={isInvestigating}
            className="px-2.5 py-1 rounded-md bg-[#F6F9FC] hover:bg-[#EAF2FF] text-[#172B4D] hover:text-[#2563EB] text-xs font-medium border border-[#E2E8F0] hover:border-[#2563EB]/30 transition-all disabled:opacity-40"
          >
            {sc.label}
          </button>
        ))}
      </div>
    </div>
  );
};
