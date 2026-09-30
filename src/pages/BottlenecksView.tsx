// CareOS Hospital Operating System — Bottlenecks Deep Dive
import React from 'react';
import { useHospital } from '../state/hospitalStore';
import {
  TrendingDown,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  FileCheck2,
  Cpu,
  ShieldAlert,
} from 'lucide-react';

export const BottlenecksView: React.FC = () => {
  const { bottlenecks, executeCommand, approveRecommendation, recommendations, setSelectedAgentId } = useHospital();

  const handleMitigate = (btnId: string) => {
    if (btnId === 'BTN-01') {
      executeCommand('How many patients are waiting in radiology and why?');
    } else if (btnId === 'BTN-02') {
      executeCommand('Why is P1001 delayed?');
    } else {
      executeCommand("Find today's bottlenecks");
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs p-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-[#172B4D]">Hospital Process Bottlenecks</h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FEECEC] text-[#DC2626] border border-[#DC2626]/20">
              {bottlenecks.length} Active Operational Constraints
            </span>
          </div>
          <p className="text-xs text-[#64748B] mt-0.5">
            Root-cause dependency mapping, cascade propagation models, and proactive mitigation proposals
          </p>
        </div>

        <button
          onClick={() => executeCommand("Find today's bottlenecks")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-xs transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Run Bottleneck Engine</span>
        </button>
      </div>

      {/* Bottlenecks List */}
      <div className="space-y-4">
        {bottlenecks.map((btn) => {
          const isHigh = btn.severity === 'HIGH' || btn.severity === 'CRITICAL';
          const relatedRec = recommendations.find((r) => r.affectedDepartment.includes(btn.department.split(' ')[0]));

          return (
            <div
              key={btn.id}
              className={`bg-white rounded-xl border p-5 shadow-xs transition-all ${
                isHigh ? 'border-[#DC2626]/40 shadow-xs' : 'border-[#E2E8F0]'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#E2E8F0]">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${
                      isHigh ? 'bg-[#FEECEC] text-[#DC2626]' : 'bg-[#FFF6E5] text-[#D97706]'
                    }`}
                  >
                    <TrendingDown className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#172B4D]">{btn.title}</h3>
                    <div className="text-[11px] text-[#64748B]">
                      {btn.department} • Detected at {btn.detectedAt} by{' '}
                      <button
                        onClick={() => setSelectedAgentId(btn.detectedBy)}
                        className="text-[#2563EB] hover:underline font-semibold"
                      >
                        {btn.detectedBy.replace(/_/g, ' ')}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                      isHigh ? 'bg-[#FEECEC] text-[#DC2626]' : 'bg-[#FFF6E5] text-[#D97706]'
                    }`}
                  >
                    {btn.severity} SEVERITY
                  </span>
                  <span
                    className={`px-2.5 py-1 rounded text-xs font-semibold ${
                      btn.status === 'Resolved'
                        ? 'bg-[#E8F8F6] text-[#0F9F9A]'
                        : 'bg-[#F6F9FC] text-[#172B4D] border border-[#E2E8F0]'
                    }`}
                  >
                    {btn.status}
                  </span>
                </div>
              </div>

              {/* Details & Root Cause */}
              <div className="py-4 space-y-3 text-xs">
                <div>
                  <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-1">
                    Resource / Asset Constraint
                  </div>
                  <div className="font-semibold text-[#172B4D] bg-[#F6F9FC] p-2.5 rounded-lg border border-[#E2E8F0]">
                    {btn.resourceConstraint}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-1">
                    Root-Cause Analysis
                  </div>
                  <div className="text-[#172B4D] leading-relaxed bg-[#F6F9FC] p-2.5 rounded-lg border border-[#E2E8F0]">
                    {btn.rootCause}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-2.5 rounded-lg bg-white border border-[#E2E8F0]">
                    <span className="text-[#64748B]">Affected Cohort Count:</span>{' '}
                    <span className="font-bold text-[#172B4D]">{btn.affectedPatientsCount} Patients</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-[#E2E8F0]">
                    <span className="text-[#64748B]">Patient Identifiers:</span>{' '}
                    <span className="font-mono text-[#2563EB] font-bold">
                      {btn.affectedPatientIds.join(', ')}
                    </span>
                  </div>
                </div>

                {/* Proposed Action */}
                <div className="p-3.5 rounded-xl bg-[#EAF2FF] border border-[#2563EB]/30">
                  <div className="text-[10px] font-bold text-[#2563EB] uppercase tracking-wider mb-1">
                    CareOS Mitigating Recommendation
                  </div>
                  <div className="text-xs text-[#172B4D] font-medium leading-relaxed mb-3">
                    {btn.suggestedAction}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#2563EB]/20">
                    <span className="text-[11px] text-[#64748B]">
                      {btn.actionApprovalRequired
                        ? 'Requires Administrator Authorization to execute'
                        : 'Autonomous adjustment enabled'}
                    </span>

                    <div className="flex items-center gap-2">
                      {relatedRec && relatedRec.status === 'Pending Admin Approval' && (
                        <button
                          onClick={() => approveRecommendation(relatedRec.id)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-xs shadow-xs"
                        >
                          <FileCheck2 className="w-3.5 h-3.5" />
                          <span>Approve Action</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleMitigate(btn.id)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs shadow-xs"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Launch Multi-Agent Investigation</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
