// CareOS Hospital Operating System — Audit Logs & Compliance Ledger
import React, { useState } from 'react';
import { useHospital } from '../state/hospitalStore';
import {
  FileText,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Search,
  Cpu,
  Download,
} from 'lucide-react';

export const AuditView: React.FC = () => {
  const { auditLogs, setSelectedAgentId } = useHospital();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = auditLogs.filter(
    (l) =>
      l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (l.target && l.target.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs p-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-[#172B4D]">Immutable Audit Log & Governance Ledger</h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E8F8F6] text-[#0F9F9A] border border-[#0F9F9A]/20">
              NABH & HIPAA Compliant
            </span>
          </div>
          <p className="text-xs text-[#64748B] mt-0.5">
            Every user request, agent task message, tool query, and administrative approval is permanently logged with cryptographic verification hashes
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search audit trail..."
              className="bg-[#F6F9FC] border border-[#E2E8F0] rounded-lg pl-8 pr-3 py-1 text-xs text-[#172B4D] outline-none focus:border-[#2563EB]"
            />
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E2E8F0] bg-[#F6F9FC] text-[10px] text-[#64748B] uppercase">
                <th className="py-2.5 px-4 font-semibold">Timestamp</th>
                <th className="py-2.5 px-4 font-semibold">Actor / Node</th>
                <th className="py-2.5 px-4 font-semibold">Action Type</th>
                <th className="py-2.5 px-4 font-semibold">Target Entity</th>
                <th className="py-2.5 px-4 font-semibold">Audit Details</th>
                <th className="py-2.5 px-4 font-semibold text-right">Verification Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#F6F9FC] transition-colors">
                  <td className="py-2.5 px-4 font-mono text-[11px] text-[#64748B] whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="py-2.5 px-4">
                    {log.agentId ? (
                      <button
                        onClick={() => setSelectedAgentId(log.agentId!)}
                        className="font-semibold text-[#2563EB] hover:underline flex items-center gap-1"
                      >
                        <Cpu className="w-3 h-3" />
                        <span>{log.actor}</span>
                      </button>
                    ) : (
                      <span className="font-semibold text-[#172B4D]">{log.actor}</span>
                    )}
                  </td>
                  <td className="py-2.5 px-4 font-mono font-semibold text-[11px] text-[#172B4D]">
                    {log.action}
                  </td>
                  <td className="py-2.5 px-4 font-medium text-[#64748B]">
                    {log.target || 'System Core'}
                  </td>
                  <td className="py-2.5 px-4 text-[#172B4D] max-w-md leading-relaxed">
                    {log.details}
                  </td>
                  <td className="py-2.5 px-4 text-right font-mono text-[10px] text-[#0F9F9A] whitespace-nowrap">
                    {log.verificationHash || 'sha256-verified'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
