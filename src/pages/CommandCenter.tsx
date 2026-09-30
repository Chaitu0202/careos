// CareOS Hospital Operating System — Hospital Command Center (Main Screen)
import React from 'react';
import { useHospital } from '../state/hospitalStore';
import { ROLE_DEFINITIONS } from '../data/userRoles';
import { KpiRow } from '../components/dashboard/KpiRow';
import { AlertsBanner } from '../components/dashboard/AlertsBanner';
import { HospitalTwinMatrix } from '../components/dashboard/HospitalTwinMatrix';
import { AgentActivityFeed } from '../components/dashboard/AgentActivityFeed';
import { CommandTerminal } from '../components/command/CommandTerminal';
import { ExecutionPipeline } from '../components/command/ExecutionPipeline';
import {
  TrendingDown,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  User,
  Activity,
} from 'lucide-react';

interface CommandCenterProps {
  onOpenVoice: () => void;
}

export const CommandCenter: React.FC<CommandCenterProps> = ({ onOpenVoice }) => {
  const {
    bottlenecks,
    executeCommand,
    setActivePage,
    currentUser,
    setIsLoginModalOpen,
  } = useHospital();

  const activeBottlenecks = bottlenecks.filter((b) => b.status === 'Active');
  const roleMeta = currentUser ? ROLE_DEFINITIONS[currentUser.role] : null;

  return (
    <div className="space-y-4">
      {/* Role & Access Status Bar */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] px-4 py-2.5 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#2563EB]/10 text-[#2563EB] flex items-center justify-center font-bold text-xs shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#172B4D]">
                Active Persona: {currentUser?.name || 'Guest Observer'}
              </span>
              {roleMeta && (
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${roleMeta.bg} ${roleMeta.color} ${roleMeta.border}`}
                >
                  {roleMeta.label}
                </span>
              )}
            </div>
            <p className="text-[11px] text-[#64748B]">
              {roleMeta?.description || 'Sign in to access clinical and administrative authorization powers.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsLoginModalOpen(true)}
          className="px-3 py-1 rounded-lg bg-[#F6F9FC] hover:bg-[#EAF2FF] text-[#2563EB] border border-[#E2E8F0] text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-2xs"
        >
          <User className="w-3.5 h-3.5" />
          <span>Switch Persona / Log In</span>
        </button>
      </div>

      {/* Prominent Command Terminal at the top for immediate access */}
      <CommandTerminal onOpenVoice={onOpenVoice} />

      {/* Observable Multi-Agent Pipeline & Investigation Result */}
      <ExecutionPipeline />

      {/* 8-Compact KPI Row */}
      <KpiRow />

      {/* Proactive Alerts Banner */}
      <AlertsBanner />

      {/* Main 2-Column Command Center Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column (8 cols): Digital Twin + Critical Bottleneck Spotlight */}
        <div className="lg:col-span-8 space-y-4">
          {/* Operational Twin Matrix */}
          <HospitalTwinMatrix />

          {/* Active Operational Bottleneck Spotlight */}
          {activeBottlenecks.length > 0 && (
            <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs p-4">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#E2E8F0]">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-[#DC2626]/10 text-[#DC2626] flex items-center justify-center">
                    <TrendingDown className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="text-xs font-bold text-[#172B4D] uppercase tracking-wider">
                    Critical Bottleneck Spotlight ({activeBottlenecks.length} Active Constraints)
                  </h3>
                </div>

                <button
                  onClick={() => setActivePage('bottlenecks')}
                  className="text-xs text-[#2563EB] hover:underline font-semibold flex items-center gap-1"
                >
                  <span>All Bottlenecks</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-3">
                {activeBottlenecks.slice(0, 2).map((btn) => (
                  <div
                    key={btn.id}
                    className="p-3.5 rounded-xl border border-[#E2E8F0] hover:border-[#DC2626]/30 bg-[#F6F9FC] transition-all text-xs"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#172B4D] text-sm">{btn.title}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FEECEC] text-[#DC2626] border border-[#DC2626]/20 uppercase">
                          {btn.severity}
                        </span>
                      </div>
                      <span className="text-[11px] font-medium text-[#64748B]">
                        {btn.department} • Detected by {btn.detectedBy.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <p className="text-xs text-[#172B4D] leading-relaxed mb-2">
                      {btn.rootCause}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#E2E8F0]/70 text-[11px]">
                      <div className="text-[#64748B]">
                        <span className="font-semibold text-[#172B4D]">Affected Cohort:</span>{' '}
                        {btn.affectedPatientsCount} patients ({btn.affectedPatientIds.join(', ')})
                      </div>

                      <button
                        onClick={() => {
                          if (btn.id === 'BTN-01') {
                            executeCommand('How many patients are waiting in radiology and why?');
                          } else {
                            executeCommand('Why is P1001 delayed?');
                          }
                        }}
                        className="flex items-center gap-1 text-[#2563EB] font-bold hover:underline"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Launch Agent Resolution →</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column (4 cols): Live Agent Stream */}
        <div className="lg:col-span-4">
          <AgentActivityFeed />
        </div>
      </div>
    </div>
  );
};
