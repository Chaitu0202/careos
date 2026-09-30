// CareOS Hospital Operating System — Analytics & Natural Language Performance
import React from 'react';
import { useHospital } from '../state/hospitalStore';
import {
  BarChart3,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Clock,
  Users,
  ShieldCheck,
  AlertTriangle,
  Receipt,
  BedDouble,
  Scan,
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { executeCommand, isInvestigating } = useHospital();

  const handleRunFullAnalysis = () => {
    executeCommand("Analyze today's hospital operations");
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs p-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-[#172B4D]">Hospital Operations Analytics & Intelligence</h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E8F8F6] text-[#0F9F9A] border border-[#0F9F9A]/20">
              Executive Cross-Domain Reporting
            </span>
          </div>
          <p className="text-xs text-[#64748B] mt-0.5">
            Natural language synthesis, patient throughput velocity, diagnostic turnaround times, and financial clearances
          </p>
        </div>

        <button
          onClick={handleRunFullAnalysis}
          disabled={isInvestigating}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-xs transition-colors disabled:opacity-40"
        >
          <Sparkles className="w-4 h-4" />
          <span>Analyze Today's Hospital Performance</span>
        </button>
      </div>

      {/* Analytics KPI Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs">
          <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-1">
            Patient Flow Velocity
          </div>
          <div className="text-xl font-bold text-[#172B4D]">18.4 pts/hr</div>
          <div className="text-xs text-[#16A34A] font-semibold mt-1">
            ↑ 4.2% vs 7-day average
          </div>
          <p className="text-[11px] text-[#64748B] mt-2">
            OPD intake: 126 patients • Emergency admissions: 42
          </p>
        </div>

        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs">
          <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-1">
            Average OPD & Diagnostic Wait
          </div>
          <div className="text-xl font-bold text-[#D97706]">38.2 mins</div>
          <div className="text-xs text-[#DC2626] font-semibold mt-1">
            +13.2 mins above 25m SLA target
          </div>
          <p className="text-[11px] text-[#64748B] mt-2">
            Radiology MRI queue is the primary variance driver (44m)
          </p>
        </div>

        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs">
          <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-1">
            Bed Occupancy Rate
          </div>
          <div className="text-xl font-bold text-[#0F9F9A]">88.6%</div>
          <div className="text-xs text-[#0F9F9A] font-semibold mt-1">
            Optimal clinical band (85-90%)
          </div>
          <p className="text-[11px] text-[#64748B] mt-2">
            34 ward beds & 2 ICU beds currently ready
          </p>
        </div>

        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs">
          <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-1">
            Discharge Lag Financials
          </div>
          <div className="text-xl font-bold text-[#2563EB]">₹38.4 Lakhs</div>
          <div className="text-xs text-[#D97706] font-semibold mt-1">
            ₹7,200 pending clearance on P1001
          </div>
          <p className="text-[11px] text-[#64748B] mt-2">
            Average TPA discharge settlement time: 3.5 hrs
          </p>
        </div>
      </div>

      {/* Natural Language Operational Breakdown */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs p-5 space-y-4">
        <h3 className="text-xs font-bold text-[#172B4D] uppercase tracking-wider border-b border-[#E2E8F0] pb-2">
          Automated Operational Executive Synthesis
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-lg bg-[#F6F9FC] border border-[#E2E8F0] space-y-1.5">
            <div className="font-bold text-[#172B4D] flex items-center gap-1.5">
              <Scan className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>1. Diagnostic & Imaging Throughput</span>
            </div>
            <p className="text-[#64748B] leading-relaxed">
              Radiology department processed 42 imaging studies today. The chief operational constraint stems from the 1.5T Achieva MRI scanner undergoing helium servicing, diverting all spine and neuro scans to Siemens Skyra MRI01 (currently running at 94% utilization).
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-[#F6F9FC] border border-[#E2E8F0] space-y-1.5">
            <div className="font-bold text-[#172B4D] flex items-center gap-1.5">
              <BedDouble className="w-3.5 h-3.5 text-[#0F9F9A]" />
              <span>2. Inpatient Beds & ICU Capacity</span>
            </div>
            <p className="text-[#64748B] leading-relaxed">
              Overall hospital bed occupancy is at 88%. Adult ICU capacity is constrained with only 2 beds immediately available (ICU-15 in CCU and ICU-21 in MICU). ICU-17 is undergoing standard post-discharge terminal disinfection and will be available within 25 minutes.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-[#F6F9FC] border border-[#E2E8F0] space-y-1.5">
            <div className="font-bold text-[#172B4D] flex items-center gap-1.5">
              <Receipt className="w-3.5 h-3.5 text-[#D97706]" />
              <span>3. Discharge Velocity & TPA Barriers</span>
            </div>
            <p className="text-[#64748B] leading-relaxed">
              Discharge clearance velocity is impeded by insurance TPA query turnaround. For patient Ravi Kumar (P1001), clinical sign-off was achieved 12 hours ago, but MedAssist TPA pre-authorization query on implant documentation has stalled physical exit and bed turnover for 52 minutes.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-[#F6F9FC] border border-[#E2E8F0] space-y-1.5">
            <div className="font-bold text-[#172B4D] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#16A34A]" />
              <span>4. Operational Recommendations</span>
            </div>
            <p className="text-[#64748B] leading-relaxed">
              CareOS proposes dispatching an automated implant proof packet to MedAssist TPA via n8n integration, authorizing a provisional copay waiver of ₹7,200 for P1001, and diverting 3 non-contrast soft-tissue scans to CT-02 to rebalance the imaging queue.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
