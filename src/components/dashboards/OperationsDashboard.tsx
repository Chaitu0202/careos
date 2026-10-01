// CareOS Hospital Operating System — Chief Operating Officer (COO) Dashboard
import React from 'react';
import { useHospital } from '../../state/hospitalStore';
import { HospitalTwinMatrix } from '../dashboard/HospitalTwinMatrix';
import {
  Building2,
  TrendingDown,
  BedDouble,
  Scan,
  Clock,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';

export const OperationsDashboard: React.FC = () => {
  const { bottlenecks, executeCommand, setActivePage, approveRecommendation, recommendations } = useHospital();

  const activeBottlenecks = bottlenecks.filter((b) => b.status === 'Active');

  return (
    <div className="space-y-4">
      {/* COO Header */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-teal-100 text-[#0F9F9A] flex items-center justify-center font-bold text-lg border border-teal-200 shadow-xs">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[#172B4D]">
                Vikramaditya Rao, MBA (Hospital Administration)
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E8F8F6] text-[#0F9F9A] border border-[#0F9F9A]/20 uppercase">
                Chief Operating Officer (COO)
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-0.5">
              Enterprise Operations & Flow Optimization • CareOne Multispecialty
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => executeCommand("Find today's bottlenecks")}
            className="px-3.5 py-1.5 rounded-lg bg-[#2563EB] text-white text-xs font-semibold hover:bg-[#1D4ED8] transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Discover Active Bottlenecks</span>
          </button>
        </div>
      </div>

      {/* Operational Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs">
          <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-1">
            Throughput Velocity
          </div>
          <div className="text-xl font-bold text-[#172B4D]">18.4 pts/hr</div>
          <p className="text-[11px] text-[#16A34A] mt-1">↑ 4.2% on-time flow</p>
        </div>

        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs">
          <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-1">
            Bed Occupancy
          </div>
          <div className="text-xl font-bold text-[#0F9F9A]">88.6%</div>
          <p className="text-[11px] text-[#0F9F9A] mt-1">34 beds ready</p>
        </div>

        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs">
          <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-1">
            Active Bottlenecks
          </div>
          <div className="text-xl font-bold text-[#DC2626]">{activeBottlenecks.length} Critical</div>
          <p className="text-[11px] text-[#DC2626] mt-1">Radiology & P1001</p>
        </div>

        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs">
          <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-1">
            Asset Telemetry
          </div>
          <div className="text-xl font-bold text-[#D97706]">1 Offline</div>
          <p className="text-[11px] text-[#D97706] mt-1">Achieva MRI03 servicing</p>
        </div>
      </div>

      {/* Operational Twin Matrix */}
      <HospitalTwinMatrix />

      {/* Bottlenecks Deep Dive Spotlight */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-[#172B4D] uppercase tracking-wider">
            Operational Constraints Under Review ({activeBottlenecks.length})
          </h3>

          <button
            onClick={() => setActivePage('bottlenecks')}
            className="text-xs text-[#2563EB] hover:underline font-semibold"
          >
            Manage All Constraints →
          </button>
        </div>

        <div className="space-y-3 text-xs">
          {activeBottlenecks.map((btn) => (
            <div
              key={btn.id}
              className="p-3.5 rounded-xl border border-[#E2E8F0] bg-[#F6F9FC] flex flex-wrap items-center justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-[#172B4D]">{btn.title}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FEECEC] text-[#DC2626] uppercase">
                    {btn.severity}
                  </span>
                </div>
                <p className="text-[11px] text-[#64748B] leading-relaxed max-w-2xl">
                  {btn.rootCause}
                </p>
              </div>

              <button
                onClick={() => {
                  if (btn.id === 'BTN-01') {
                    executeCommand('How many patients are waiting in radiology and why?');
                  } else {
                    executeCommand('Why is P1001 delayed?');
                  }
                }}
                className="px-3 py-1.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold shadow-xs"
              >
                Orchestrate Solution →
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
