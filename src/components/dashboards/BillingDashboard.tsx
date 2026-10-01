// CareOS Hospital Operating System — Billing & TPA Clearance Dashboard
import React from 'react';
import { useHospital } from '../../state/hospitalStore';
import {
  Receipt,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileCheck2,
  Sparkles,
  ArrowRight,
  CreditCard,
  Building,
} from 'lucide-react';

export const BillingDashboard: React.FC = () => {
  const { bills, insuranceAuths, patients, approveRecommendation, recommendations, executeCommand } = useHospital();

  const pendingBills = bills.filter((b) => !b.dischargeClearanceGranted);
  const pendingAuths = insuranceAuths.filter((a) => a.status !== 'Approved');

  const p1001Rec = recommendations.find((r) => r.targetPatientId === 'P1001');

  return (
    <div className="space-y-4">
      {/* Billing Header */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-[#D97706] flex items-center justify-center font-bold text-lg border border-amber-200 shadow-xs">
            <Receipt className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[#172B4D]">
                Anand Swaroop
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-[#D97706] border border-amber-200 uppercase">
                Lead Insurance & TPA Clearance Officer
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-0.5">
              Patient Accounts & Health Insurance TPA Gateway • CareOne Multispecialty
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => executeCommand('Why is P1001 delayed?')}
            className="px-3.5 py-1.5 rounded-lg bg-[#2563EB] text-white text-xs font-semibold hover:bg-[#1D4ED8] transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Audit P1001 Ledger</span>
          </button>
        </div>
      </div>

      {/* Financial Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs">
          <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-1">
            Total Revenue Today
          </div>
          <div className="text-xl font-bold text-[#172B4D]">₹38.4 Lakhs</div>
          <p className="text-[11px] text-[#16A34A] mt-1">94% collections rate</p>
        </div>

        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs">
          <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-1">
            Pending TPA Authorizations
          </div>
          <div className="text-xl font-bold text-[#D97706]">₹4.2 Lakhs</div>
          <p className="text-[11px] text-[#D97706] mt-1">2 claims under query</p>
        </div>

        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs">
          <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-1">
            Discharge Ledger Hold
          </div>
          <div className="text-xl font-bold text-[#DC2626]">₹7,200 (1 Patient)</div>
          <p className="text-[11px] text-[#DC2626] mt-1">P1001 copay differential</p>
        </div>

        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs">
          <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-1">
            Avg TPA Turnaround
          </div>
          <div className="text-xl font-bold text-[#2563EB]">3.5 Hours</div>
          <p className="text-[11px] text-[#64748B] mt-1">Target SLA: &lt; 2.0 hrs</p>
        </div>
      </div>

      {/* Pending TPA Pre-Auth Queue */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs p-5 space-y-3">
        <h3 className="text-xs font-bold text-[#172B4D] uppercase tracking-wider">
          TPA Insurance Clearance & Query Resolution Desk
        </h3>

        <div className="space-y-3">
          {insuranceAuths.map((auth) => {
            const isApproved = auth.status === 'Approved';

            return (
              <div
                key={auth.id}
                className={`p-4 rounded-xl border text-xs transition-all ${
                  isApproved
                    ? 'border-[#0F9F9A]/30 bg-[#E8F8F6]/30'
                    : 'border-[#DC2626]/30 bg-[#FEECEC]/20'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#172B4D] text-sm">{auth.patientName}</span>
                    <span className="font-mono text-[11px] text-[#64748B]">
                      ({auth.patientId}) • Policy: {auth.policyNumber}
                    </span>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      isApproved ? 'bg-[#E8F8F6] text-[#0F9F9A]' : 'bg-[#FFF6E5] text-[#D97706]'
                    }`}
                  >
                    {auth.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-[#64748B] mb-2">
                  <div>TPA: <span className="font-semibold text-[#172B4D]">{auth.tpaProvider}</span></div>
                  <div>Claimed: <span className="font-semibold text-[#172B4D]">₹{auth.claimedAmount.toLocaleString('en-IN')}</span></div>
                  <div>Approved: <span className="font-semibold text-[#172B4D]">₹{auth.approvedAmount.toLocaleString('en-IN')}</span></div>
                  <div>Turnaround: <span className="font-semibold text-[#DC2626]">{auth.turnaroundHours} hrs</span></div>
                </div>

                {auth.queriesPending && (
                  <div className="p-2.5 rounded-lg bg-white border border-[#E2E8F0] text-[11px] text-[#172B4D] mb-3">
                    <span className="font-bold text-[#D97706]">TPA Query:</span> {auth.queriesPending}
                  </div>
                )}

                <div className="pt-2 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[11px] text-[#64748B]">
                    Status: {isApproved ? 'Final clearance token generated ✓' : 'Awaiting automated packet confirmation'}
                  </span>

                  {!isApproved && p1001Rec && (
                    <button
                      onClick={() => approveRecommendation(p1001Rec.id)}
                      className="px-3.5 py-1.5 rounded-lg bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-xs shadow-xs transition-colors"
                    >
                      Authorize Escalation & Release Billing Hold
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
