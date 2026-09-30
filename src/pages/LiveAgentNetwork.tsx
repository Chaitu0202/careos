// CareOS Hospital Operating System — Live Agent Network Visualizer
import React, { useState } from 'react';
import { useHospital } from '../state/hospitalStore';
import { AgentId } from '../types/hospital';
import { AGENT_CONTRACTS } from '../agents/agentContracts';
import {
  Cpu,
  Activity,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Shield,
  Layers,
  RefreshCw,
  Search,
} from 'lucide-react';

export const LiveAgentNetwork: React.FC = () => {
  const { setSelectedAgentId, currentInvestigation, isInvestigating, executeCommand } = useHospital();
  const [filterQuery, setFilterQuery] = useState('');

  // Structured rings for the network
  const centralAgent: AgentId = 'orchestrator';

  // Ring 1: High-Level Orchestration & Analysis Agents
  const ring1Agents: AgentId[] = [
    'journey_agent',
    'doctor_agent',
    'discharge_agent',
    'bottleneck_agent',
    'operations_agent',
    'billing_agent',
    'insurance_agent',
  ];

  // Ring 2: Operational & Resource Department Agents
  const ring2Agents: AgentId[] = [
    'radiology_agent',
    'laboratory_agent',
    'pharmacy_agent',
    'queue_agent',
    'bed_agent',
    'admission_agent',
    'resource_agent',
    'nursing_agent',
    'appointment_agent',
    'finance_agent',
  ];

  const allAgents: AgentId[] = [centralAgent, ...ring1Agents, ...ring2Agents];

  const filteredAgents = allAgents.filter((id) => {
    const c = AGENT_CONTRACTS[id];
    return (
      c.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      c.domain.toLowerCase().includes(filterQuery.toLowerCase())
    );
  });

  const getAgentStatus = (id: AgentId) => {
    if (isInvestigating && currentInvestigation?.selectedAgents.includes(id)) {
      const status = currentInvestigation.agentStatuses[id];
      if (status === 'running') return 'ANALYZING';
      if (status === 'completed') return 'ACTIVE';
      return 'WAITING';
    }
    return 'ACTIVE';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ANALYZING':
        return 'bg-[#2563EB] text-white ring-4 ring-[#2563EB]/20 animate-pulse';
      case 'ACTIVE':
        return 'bg-[#E8F8F6] text-[#0F9F9A] border-[#0F9F9A]/30';
      case 'WAITING':
        return 'bg-[#FFF6E5] text-[#D97706] border-[#D97706]/30';
      case 'BLOCKED':
        return 'bg-[#FEECEC] text-[#DC2626] border-[#DC2626]/30';
      default:
        return 'bg-[#F6F9FC] text-[#64748B] border-[#E2E8F0]';
    }
  };

  return (
    <div className="space-y-4">
      {/* Network Header */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs p-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-[#172B4D]">
              CareOS Live Agent Network (18 Multi-Agent Nodes)
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E8F8F6] text-[#0F9F9A] border border-[#0F9F9A]/20">
              Autonomous Mesh Active
            </span>
          </div>
          <p className="text-xs text-[#64748B] mt-0.5">
            Decentralized domain agents coordinated through strict contracts and event-driven task routing
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filter agents..."
              className="bg-[#F6F9FC] border border-[#E2E8F0] rounded-lg pl-8 pr-3 py-1 text-xs text-[#172B4D] outline-none focus:border-[#2563EB]"
            />
          </div>

          <button
            onClick={() => executeCommand('Find today\'s bottlenecks')}
            disabled={isInvestigating}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold transition-colors disabled:opacity-40"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Simulate Swarm Run</span>
          </button>
        </div>
      </div>

      {/* Central Visual Architecture Diagram */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs p-6 relative overflow-hidden">
        <div className="text-center mb-6">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
            Interactive Orchestration Mesh
          </span>
          <p className="text-xs text-[#64748B]">
            Click any agent node to inspect permissions, registered tools, and telemetry
          </p>
        </div>

        {/* Central Core */}
        <div className="flex flex-col items-center justify-center my-4">
          <button
            onClick={() => setSelectedAgentId('orchestrator')}
            className={`px-6 py-3.5 rounded-2xl border-2 transition-all shadow-md flex items-center gap-3 ${
              isInvestigating
                ? 'bg-[#2563EB] text-white border-[#2563EB] ring-8 ring-[#2563EB]/15 scale-105'
                : 'bg-white text-[#172B4D] border-[#2563EB] hover:shadow-lg'
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isInvestigating ? 'bg-white/20 text-white' : 'bg-[#2563EB] text-white'}`}>
              <Cpu className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold uppercase tracking-wider">CareOS Orchestrator</div>
              <div className={`text-[11px] ${isInvestigating ? 'text-white/80' : 'text-[#64748B]'}`}>
                Core Planning & Synthesis
              </div>
            </div>
          </button>
        </div>

        {/* Ring 1: Primary Orchestration Layer */}
        <div className="my-6">
          <div className="text-center mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#2563EB] bg-[#EAF2FF] px-2.5 py-0.5 rounded-full border border-[#2563EB]/20">
              Layer 1: Clinical & Administrative Trajectory Agents
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-2.5">
            {ring1Agents.map((ag) => {
              const contract = AGENT_CONTRACTS[ag];
              const status = getAgentStatus(ag);
              const isActiveInRun = isInvestigating && currentInvestigation?.selectedAgents.includes(ag);

              return (
                <button
                  key={ag}
                  onClick={() => setSelectedAgentId(ag)}
                  className={`p-3 rounded-xl border text-left transition-all hover:scale-[1.02] ${
                    isActiveInRun
                      ? 'border-[#2563EB] bg-[#EAF2FF] shadow-xs'
                      : 'border-[#E2E8F0] bg-[#F6F9FC] hover:bg-white hover:border-[#2563EB]/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-[#172B4D] truncate">
                      {contract.name.replace(' Agent', '')}
                    </span>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        status === 'ANALYZING'
                          ? 'bg-[#2563EB] animate-ping'
                          : 'bg-[#16A34A]'
                      }`}
                    />
                  </div>
                  <div className="text-[10px] text-[#64748B] truncate">
                    {contract.domain}
                  </div>
                  <div className="mt-2 text-[10px] font-mono text-[#2563EB] font-semibold">
                    {status}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Ring 2: Departmental & Asset Agents */}
        <div className="mt-8">
          <div className="text-center mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#0F9F9A] bg-[#E8F8F6] px-2.5 py-0.5 rounded-full border border-[#0F9F9A]/20">
              Layer 2: Specialized Diagnostics, Services & Infrastructure Agents
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {ring2Agents.map((ag) => {
              const contract = AGENT_CONTRACTS[ag];
              const status = getAgentStatus(ag);
              const isActiveInRun = isInvestigating && currentInvestigation?.selectedAgents.includes(ag);

              return (
                <button
                  key={ag}
                  onClick={() => setSelectedAgentId(ag)}
                  className={`p-3 rounded-xl border text-left transition-all hover:scale-[1.02] ${
                    isActiveInRun
                      ? 'border-[#2563EB] bg-[#EAF2FF] shadow-xs'
                      : 'border-[#E2E8F0] bg-white hover:border-[#0F9F9A]/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-[#172B4D] truncate">
                      {contract.name.replace(' Agent', '')}
                    </span>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        status === 'ANALYZING'
                          ? 'bg-[#2563EB] animate-ping'
                          : 'bg-[#16A34A]'
                      }`}
                    />
                  </div>
                  <div className="text-[10px] text-[#64748B] truncate">
                    {contract.domain}
                  </div>
                  <div className="mt-2 text-[10px] font-mono text-[#0F9F9A] font-semibold">
                    {status}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Agent Contract Matrix Summary */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs p-4">
        <h3 className="text-xs font-bold text-[#172B4D] uppercase tracking-wider mb-3">
          Agent Registry & Security Boundaries ({filteredAgents.length} Agents)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E2E8F0] text-[10px] text-[#64748B] uppercase">
                <th className="pb-2 font-semibold">Agent Node</th>
                <th className="pb-2 font-semibold">Domain</th>
                <th className="pb-2 font-semibold">Allowed Data</th>
                <th className="pb-2 font-semibold">Registered Tools</th>
                <th className="pb-2 font-semibold">Fail-Safe Behavior</th>
                <th className="pb-2 font-semibold text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {filteredAgents.map((ag) => {
                const c = AGENT_CONTRACTS[ag];
                return (
                  <tr key={ag} className="hover:bg-[#F6F9FC] transition-colors">
                    <td className="py-2.5 font-bold text-[#172B4D] flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-[#2563EB]" />
                      <span>{c.name}</span>
                    </td>
                    <td className="py-2.5 text-[#64748B]">{c.domain}</td>
                    <td className="py-2.5 text-[#172B4D] font-mono text-[11px]">
                      {c.allowedData.slice(0, 2).join(', ')}
                    </td>
                    <td className="py-2.5">
                      <div className="flex gap-1 flex-wrap">
                        {c.tools.slice(0, 2).map((t) => (
                          <span
                            key={t}
                            className="px-1.5 py-0.5 rounded bg-[#F6F9FC] border border-[#E2E8F0] text-[10px] font-mono"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-2.5 text-[11px] text-[#64748B] max-w-xs truncate">
                      {c.failureBehavior}
                    </td>
                    <td className="py-2.5 text-right">
                      <button
                        onClick={() => setSelectedAgentId(ag)}
                        className="text-[#2563EB] hover:underline font-semibold text-xs"
                      >
                        Inspect →
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
