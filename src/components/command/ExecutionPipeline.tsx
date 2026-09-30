// CareOS Hospital Operating System — Execution Pipeline Visualizer
import React, { useState } from 'react';
import { useHospital } from '../../state/hospitalStore';
import { AGENT_CONTRACTS } from '../../agents/agentContracts';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Cpu,
  Workflow,
  Sparkles,
  ThumbsUp,
  FileCheck2,
} from 'lucide-react';

export const ExecutionPipeline: React.FC = () => {
  const {
    currentInvestigation,
    isInvestigating,
    approveRecommendation,
    setSelectedAgentId,
    currentUser,
    setIsLoginModalOpen,
  } = useHospital();
  const [showEvidence, setShowEvidence] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

  if (!currentInvestigation) return null;

  const {
    query,
    intent,
    patientId,
    steps,
    currentStepIndex,
    selectedAgents,
    agentStatuses,
    liveConversation,
    analysisResult,
  } = currentInvestigation;

  const completedAgentsCount = selectedAgents.filter((a) => agentStatuses[a] === 'completed').length;
  const isParallelWorking = isInvestigating && completedAgentsCount < selectedAgents.length;

  const handleApproveAction = async () => {
    if (!analysisResult?.actionableRecommendation) return;
    setIsApproving(true);
    try {
      await approveRecommendation(analysisResult.actionableRecommendation.id);
    } finally {
      setIsApproving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[#2563EB]/30 shadow-[0_4px_16px_rgba(37,99,235,0.06)] overflow-hidden transition-all my-4">
      {/* Investigation Header */}
      <div className="bg-[#F6F9FC] border-b border-[#E2E8F0] px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#2563EB] text-white flex items-center justify-center font-bold text-xs shadow-xs">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#172B4D]">
                Orchestrator Run: <span className="font-mono text-[#2563EB]">{query}</span>
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#EAF2FF] text-[#2563EB] border border-[#2563EB]/20">
                INTENT: {intent}
              </span>
              {patientId && (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#E8F8F6] text-[#0F9F9A] border border-[#0F9F9A]/20">
                  PATIENT: {patientId}
                </span>
              )}
            </div>
            <div className="text-[11px] text-[#64748B]">
              Started at {currentInvestigation.startedAt} • Coordinating {selectedAgents.length} specialized domain agents
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isInvestigating ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#EAF2FF] text-[#2563EB] border border-[#2563EB]/30">
              <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-ping" />
              Active Orchestration
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#E8F8F6] text-[#0F9F9A] border border-[#0F9F9A]/30">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Verified Synthesis
            </span>
          )}
        </div>
      </div>

      {/* 10-Step Pipeline Progression */}
      <div className="px-4 py-3 border-b border-[#E2E8F0] overflow-x-auto bg-white">
        <div className="flex items-center justify-between min-w-[760px] gap-1">
          {steps.map((st, idx) => {
            const isCompleted = st.status === 'completed';
            const isCurrent = st.status === 'in_progress';
            return (
              <div key={st.name} className="flex-1 flex items-center">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                      isCompleted
                        ? 'bg-[#16A34A] text-white'
                        : isCurrent
                        ? 'bg-[#2563EB] text-white ring-4 ring-[#2563EB]/20 animate-pulse'
                        : 'bg-[#F6F9FC] text-[#64748B] border border-[#E2E8F0]'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                  </div>
                  <span
                    className={`text-[9px] font-semibold mt-1 uppercase tracking-tight text-center ${
                      isCurrent
                        ? 'text-[#2563EB]'
                        : isCompleted
                        ? 'text-[#172B4D]'
                        : 'text-[#64748B]'
                    }`}
                  >
                    {st.name}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 transition-all mx-1 ${
                      idx < currentStepIndex ? 'bg-[#16A34A]' : 'bg-[#E2E8F0]'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
        {steps[currentStepIndex]?.detail && (
          <div className="mt-2 text-center text-xs font-medium text-[#2563EB] bg-[#EAF2FF]/60 py-1 px-3 rounded-md">
            Current Phase: {steps[currentStepIndex].detail}
          </div>
        )}
      </div>

      {/* Parallel Agent Execution Matrix */}
      <div className="px-4 py-3 bg-[#F6F9FC] border-b border-[#E2E8F0]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold text-[#172B4D] uppercase tracking-wider flex items-center gap-1.5">
            <Workflow className="w-3.5 h-3.5 text-[#2563EB]" />
            Agent Swarm Activity:
            {isParallelWorking ? (
              <span className="text-[#2563EB] font-mono normal-case">
                ({completedAgentsCount} of {selectedAgents.length} completed...)
              </span>
            ) : (
              <span className="text-[#16A34A] font-mono normal-case">
                (All {selectedAgents.length} agents completed)
              </span>
            )}
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {selectedAgents.map((ag) => {
            const status = agentStatuses[ag];
            const contract = AGENT_CONTRACTS[ag];
            return (
              <button
                key={ag}
                onClick={() => setSelectedAgentId(ag)}
                title={`Click to inspect ${contract?.name || ag}`}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition-all ${
                  status === 'completed'
                    ? 'bg-white text-[#172B4D] border-[#16A34A]/40 hover:border-[#16A34A]'
                    : status === 'running'
                    ? 'bg-[#EAF2FF] text-[#2563EB] border-[#2563EB] animate-pulse'
                    : 'bg-white text-[#64748B] border-[#E2E8F0]'
                }`}
              >
                {status === 'completed' ? (
                  <CheckCircle2 className="w-3 h-3 text-[#16A34A]" />
                ) : status === 'running' ? (
                  <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-ping" />
                ) : (
                  <Clock className="w-3 h-3 text-[#64748B]" />
                )}
                <span>{contract?.name?.replace(' Agent', '') || ag}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Live Agent Conversation Feed */}
      {liveConversation.length > 0 && (
        <div className="px-4 py-3 border-b border-[#E2E8F0] bg-white">
          <div className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-2">
            Inter-Agent Task Exchanges ({liveConversation.length} messages)
          </div>
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {liveConversation.map((msg, i) => (
              <div
                key={i}
                className="flex items-start gap-2.5 p-2 rounded-lg bg-[#F6F9FC] border border-[#E2E8F0]/80 text-xs"
              >
                <div className="px-2 py-0.5 rounded bg-white border border-[#E2E8F0] font-semibold text-[#2563EB] text-[10px] shrink-0">
                  {msg.agentName}
                </div>
                <div className="flex-1 text-[#172B4D] leading-relaxed">
                  {msg.message}
                </div>
                <div className="text-[10px] font-mono text-[#64748B] shrink-0">
                  {msg.timestamp}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Final Analysis & Recommendation Card */}
      {analysisResult && (
        <div className="p-4 bg-white">
          <div className="rounded-xl border border-[#E2E8F0] p-4 bg-gradient-to-b from-white to-[#F6F9FC] shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#E2E8F0]">
              <div>
                <h3 className="text-base font-bold text-[#172B4D] tracking-tight">
                  {analysisResult.title}
                </h3>
                <div className="text-xs text-[#64748B]">
                  Correlated across {analysisResult.agentsConsultedCount} domain agents • Confidence: {analysisResult.confidence}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${
                    analysisResult.status.includes('DELAYED') || analysisResult.status.includes('BOTTLENECK')
                      ? 'bg-[#FEECEC] text-[#DC2626] border border-[#DC2626]/20'
                      : 'bg-[#E8F8F6] text-[#0F9F9A] border border-[#0F9F9A]/20'
                  }`}
                >
                  {analysisResult.status}
                </span>
              </div>
            </div>

            {/* Diagnostic / Clinical Status Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 my-3">
              {analysisResult.primaryBlocker && (
                <div className="p-2.5 rounded-lg bg-[#FEECEC]/50 border border-[#DC2626]/20">
                  <div className="text-[10px] font-semibold text-[#DC2626] uppercase tracking-wide">
                    Primary Constraint
                  </div>
                  <div className="text-xs font-bold text-[#172B4D] mt-0.5">
                    {analysisResult.primaryBlocker}
                  </div>
                </div>
              )}

              {analysisResult.secondaryBlocker && (
                <div className="p-2.5 rounded-lg bg-[#FFF6E5]/60 border border-[#D97706]/20">
                  <div className="text-[10px] font-semibold text-[#D97706] uppercase tracking-wide">
                    Secondary Constraint
                  </div>
                  <div className="text-xs font-bold text-[#172B4D] mt-0.5">
                    {analysisResult.secondaryBlocker}
                  </div>
                </div>
              )}

              {analysisResult.clinicalStatus && (
                <div className="p-2.5 rounded-lg bg-white border border-[#E2E8F0]">
                  <div className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wide">
                    Clinical Status
                  </div>
                  <div className="text-xs font-medium text-[#172B4D] mt-0.5">
                    {analysisResult.clinicalStatus}
                  </div>
                </div>
              )}

              {analysisResult.pharmacyStatus && (
                <div className="p-2.5 rounded-lg bg-white border border-[#E2E8F0]">
                  <div className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wide">
                    Pharmacy
                  </div>
                  <div className="text-xs font-medium text-[#172B4D] mt-0.5">
                    {analysisResult.pharmacyStatus}
                  </div>
                </div>
              )}

              {analysisResult.bedStatus && (
                <div className="p-2.5 rounded-lg bg-white border border-[#E2E8F0]">
                  <div className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wide">
                    Bed Census Impact
                  </div>
                  <div className="text-xs font-medium text-[#172B4D] mt-0.5">
                    {analysisResult.bedStatus}
                  </div>
                </div>
              )}

              {analysisResult.operationalImpact && (
                <div className="p-2.5 rounded-lg bg-white border border-[#E2E8F0]">
                  <div className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wide">
                    Operational Impact
                  </div>
                  <div className="text-xs font-medium text-[#172B4D] mt-0.5">
                    {analysisResult.operationalImpact}
                  </div>
                </div>
              )}
            </div>

            {/* Recommended Action & Human Approval Button */}
            <div className="p-3 rounded-lg bg-[#EAF2FF] border border-[#2563EB]/20 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <Sparkles className="w-5 h-5 text-[#2563EB] shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-[#172B4D]">
                    CareOS Recommended Administrative Action
                  </div>
                  <div className="text-xs text-[#172B4D]/90 mt-0.5 leading-relaxed">
                    {analysisResult.recommendedNextStep}
                  </div>
                </div>
              </div>

              {analysisResult.actionableRecommendation && (() => {
                const isAuthorized = currentUser && (
                  currentUser.role === 'admin' ||
                  currentUser.role === 'operations' ||
                  (currentUser.role === 'billing' && analysisResult.actionableRecommendation.actionPayload.type === 'ESCALATE_INSURANCE') ||
                  (currentUser.role === 'doctor' && analysisResult.actionableRecommendation.actionPayload.type === 'REASSIGN_MRI_SLOT')
                );

                if (isAuthorized) {
                  return (
                    <button
                      onClick={handleApproveAction}
                      disabled={isApproving}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold shadow-sm transition-colors shrink-0"
                    >
                      <FileCheck2 className="w-4 h-4" />
                      <span>{isApproving ? 'Executing...' : `Approve Action as ${currentUser.name.split(' ')[0]} (${currentUser.role.toUpperCase()})`}</span>
                    </button>
                  );
                }

                return (
                  <button
                    onClick={() => setIsLoginModalOpen(true)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-bold shadow-sm transition-colors shrink-0"
                    title="Click to authenticate as Hospital Administrator or Chief Operating Officer"
                  >
                    <ShieldAlert className="w-4 h-4" />
                    <span>Switch to Authorized Role (Admin/COO) to Approve</span>
                  </button>
                );
              })()}
            </div>

            {/* Evidence Disclosure Accordion */}
            <div className="mt-3 pt-3 border-t border-[#E2E8F0]">
              <button
                onClick={() => setShowEvidence(!showEvidence)}
                className="flex items-center justify-between w-full text-xs font-semibold text-[#64748B] hover:text-[#172B4D]"
              >
                <span>Why CareOS reached this conclusion ({analysisResult.evidenceList.length} verified evidence checkpoints)</span>
                {showEvidence ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showEvidence && (
                <div className="mt-2.5 space-y-2">
                  {analysisResult.evidenceList.map((ev) => (
                    <div
                      key={ev.agentId}
                      className="p-2 rounded-md bg-white border border-[#E2E8F0] text-xs flex items-start gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-[#172B4D]">{ev.agentName}: </span>
                        <span className="text-[#64748B]">{ev.finding}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
