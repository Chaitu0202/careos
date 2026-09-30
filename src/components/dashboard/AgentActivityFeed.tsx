// CareOS Hospital Operating System — Live Agent Activity Feed
import React from 'react';
import { useHospital } from '../../state/hospitalStore';
import { AgentId } from '../../types/hospital';
import { AGENT_CONTRACTS } from '../../agents/agentContracts';
import { Activity, Clock, Cpu, CheckCircle2, ArrowRight } from 'lucide-react';

export const AgentActivityFeed: React.FC = () => {
  const { events, setSelectedAgentId, setActivePage } = useHospital();

  // If no dynamic events yet, show the authentic bootstrap events
  const defaultEvents = [
    {
      time: '08:34 AM',
      agent: 'operations_agent',
      action: 'Recommendation generated',
      detail: 'Formulated TPA authorization escalation protocol for P1001',
    },
    {
      time: '08:33 AM',
      agent: 'bottleneck_agent',
      action: 'Discharge delay detected',
      detail: 'P1001 discharge stalled 52m past clinical sign-off',
    },
    {
      time: '08:32 AM',
      agent: 'insurance_agent',
      action: 'Authorization pending',
      detail: 'MedAssist TPA query unanswered for AUTH1001',
    },
    {
      time: '08:32 AM',
      agent: 'billing_agent',
      action: 'Clearance verified',
      detail: 'Discharge clearance withheld for ₹7,200 copay balance',
    },
    {
      time: '08:31 AM',
      agent: 'radiology_agent',
      action: 'MRI capacity checked',
      detail: 'Scanner MRI03 offline for maintenance; 8 patients queued',
    },
    {
      time: '08:30 AM',
      agent: 'journey_agent',
      action: 'P1001 journey updated',
      detail: 'Trajectory stage reached: Discharge Blocked',
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs p-4 flex flex-col h-full">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#2563EB]/10 text-[#2563EB] flex items-center justify-center">
            <Activity className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold text-[#172B4D] uppercase tracking-wider">
            Live Agent Activity
          </span>
          <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
        </div>

        <button
          onClick={() => setActivePage('agent_network')}
          className="text-[11px] text-[#2563EB] hover:underline font-semibold flex items-center gap-1"
        >
          <span>Live Network</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[380px] pr-1">
        {events.length > 0
          ? events.slice(0, 10).map((evt) => {
              const contract = AGENT_CONTRACTS[evt.sourceAgent];
              return (
                <div
                  key={evt.id}
                  className="p-2.5 rounded-lg bg-[#F6F9FC] border border-[#E2E8F0] hover:border-[#2563EB]/30 transition-all text-xs"
                >
                  <div className="flex items-center justify-between mb-1">
                    <button
                      onClick={() => setSelectedAgentId(evt.sourceAgent)}
                      className="font-semibold text-[#2563EB] hover:underline flex items-center gap-1.5"
                    >
                      <Cpu className="w-3 h-3 text-[#2563EB]" />
                      <span>{contract?.name || evt.sourceAgent}</span>
                    </button>
                    <span className="text-[10px] font-mono text-[#64748B] flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      {evt.timestamp}
                    </span>
                  </div>
                  <div className="text-[#172B4D] font-medium text-[11px]">{evt.description}</div>
                </div>
              );
            })
          : defaultEvents.map((evt, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-lg bg-[#F6F9FC] border border-[#E2E8F0] hover:border-[#2563EB]/30 transition-all text-xs"
              >
                <div className="flex items-center justify-between mb-1">
                  <button
                    onClick={() => setSelectedAgentId(evt.agent as AgentId)}
                    className="font-semibold text-[#2563EB] hover:underline flex items-center gap-1.5"
                  >
                    <Cpu className="w-3 h-3 text-[#2563EB]" />
                    <span>{AGENT_CONTRACTS[evt.agent as AgentId]?.name || evt.agent}</span>
                  </button>
                  <span className="text-[10px] font-mono text-[#64748B] flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" />
                    {evt.time}
                  </span>
                </div>
                <div className="text-xs font-semibold text-[#172B4D]">{evt.action}</div>
                <div className="text-[11px] text-[#64748B] mt-0.5">{evt.detail}</div>
              </div>
            ))}
      </div>
    </div>
  );
};
