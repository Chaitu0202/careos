// CareOS Hospital Operating System — Agent Detail Drawer
import React from 'react';
import { useHospital } from '../../state/hospitalStore';
import { AGENT_CONTRACTS } from '../../agents/agentContracts';
import {
  X,
  Cpu,
  CheckCircle2,
  Shield,
  Wrench,
  Activity,
  FileCode2,
  Clock,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

export const AgentDetailDrawer: React.FC = () => {
  const { selectedAgentId, setSelectedAgentId, currentInvestigation, executeCommand } = useHospital();

  if (!selectedAgentId) return null;

  const contract = AGENT_CONTRACTS[selectedAgentId];
  if (!contract) return null;

  const isCurrentInvestigating =
    currentInvestigation?.selectedAgents.includes(selectedAgentId);

  const handleTestAgent = () => {
    if (selectedAgentId === 'radiology_agent') {
      executeCommand('How many patients are waiting in radiology and why?');
    } else if (selectedAgentId === 'journey_agent' || selectedAgentId === 'discharge_agent') {
      executeCommand('Why is P1001 delayed?');
    } else if (selectedAgentId === 'bed_agent' || selectedAgentId === 'admission_agent') {
      executeCommand('Find available beds for a new ICU admission');
    } else {
      executeCommand(`Query status from ${contract.name}`);
    }
    setSelectedAgentId(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/30 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col border-l border-[#E2E8F0] animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="px-6 py-4 border-b border-[#E2E8F0] bg-[#F6F9FC] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#2563EB] text-white flex items-center justify-center font-bold">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[#172B4D]">{contract.name}</h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#E8F8F6] text-[#0F9F9A] border border-[#0F9F9A]/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-ping" />
                  ACTIVE
                </span>
              </div>
              <p className="text-[11px] text-[#64748B]">{contract.domain}</p>
            </div>
          </div>

          <button
            onClick={() => setSelectedAgentId(null)}
            className="p-1.5 rounded-md text-[#64748B] hover:text-[#172B4D] hover:bg-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
          {/* Active Context */}
          <div className="p-3.5 rounded-xl bg-[#EAF2FF]/60 border border-[#2563EB]/20 space-y-2">
            <div className="text-[10px] font-bold text-[#2563EB] uppercase tracking-wider">
              Runtime Telemetry
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-[#64748B]">Current Task:</span>{' '}
                <span className="font-semibold text-[#172B4D]">
                  {isCurrentInvestigating ? 'Active Task In Flight' : 'Awaiting Orchestrator Dispatch'}
                </span>
              </div>
              <div>
                <span className="text-[#64748B]">Assigned Patient:</span>{' '}
                <span className="font-semibold text-[#172B4D]">
                  {currentInvestigation?.patientId || 'P1001 (Ravi Kumar)'}
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-[#64748B]">Active Inter-Agent Mesh:</span>{' '}
                <span className="font-semibold text-[#172B4D]">
                  CareOS Orchestrator ↔ Bottleneck Agent ↔ Resource Agent
                </span>
              </div>
            </div>
          </div>

          {/* Responsibilities */}
          <div>
            <div className="text-[11px] font-bold text-[#172B4D] uppercase tracking-wider mb-2">
              Domain Responsibilities
            </div>
            <ul className="space-y-1.5">
              {contract.responsibilities.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-[#172B4D] bg-[#F6F9FC] p-2 rounded-md border border-[#E2E8F0]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A] shrink-0 mt-0.5" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tools & Connected Integrations */}
          <div>
            <div className="text-[11px] font-bold text-[#172B4D] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Registered Tools</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {contract.tools.map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-1 rounded bg-[#F6F9FC] border border-[#E2E8F0] text-[#172B4D] font-mono text-[11px]"
                >
                  {t}()
                </span>
              ))}
            </div>
          </div>

          {/* Permissions & Security Boundaries */}
          <div>
            <div className="text-[11px] font-bold text-[#172B4D] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-[#0F9F9A]" />
              <span>RBAC Permissions & Boundary</span>
            </div>
            <div className="space-y-1">
              {contract.permissions.map((p) => (
                <div
                  key={p}
                  className="flex items-center gap-2 px-2.5 py-1 rounded bg-[#E8F8F6]/50 text-[#0F9F9A] border border-[#0F9F9A]/20 font-mono text-[11px]"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0F9F9A]" />
                  <span>{p}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Schemas */}
          <div>
            <div className="text-[11px] font-bold text-[#172B4D] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <FileCode2 className="w-3.5 h-3.5 text-[#64748B]" />
              <span>Contract Data Schemas</span>
            </div>
            <div className="space-y-2">
              <div className="p-2.5 rounded-lg bg-[#172B4D] text-white font-mono text-[10px]">
                <div className="text-[#64748B] mb-0.5">// Input Contract</div>
                <div>{contract.inputSchema}</div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#172B4D] text-white font-mono text-[10px]">
                <div className="text-[#64748B] mb-0.5">// Output Contract</div>
                <div>{contract.outputSchema}</div>
              </div>
            </div>
          </div>

          {/* Escalation Rules & Fail-Safe */}
          <div className="p-3 rounded-lg bg-[#FFF6E5] border border-[#D97706]/30 text-[#172B4D]">
            <div className="text-[10px] font-bold text-[#D97706] uppercase tracking-wider mb-1">
              Escalation & Safety Protocol
            </div>
            <p className="text-[11px] leading-relaxed mb-2">{contract.escalationRules}</p>
            <div className="text-[10px] font-semibold text-[#64748B] uppercase">Fail-safe:</div>
            <p className="text-[11px] text-[#64748B] mt-0.5">{contract.failureBehavior}</p>
          </div>
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-4 border-t border-[#E2E8F0] bg-[#F6F9FC] flex items-center justify-between">
          <span className="text-[11px] text-[#64748B]">Autonomous Service Mesh</span>
          <button
            onClick={handleTestAgent}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-colors shadow-xs"
          >
            <span>Query {contract.name.replace(' Agent', '')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
