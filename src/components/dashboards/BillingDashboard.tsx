// CareOS Hospital Operating System — Billing & TPA Clearance Dashboard (Calm UX)
import React, { useState } from 'react';
import { useHospital } from '../../state/hospitalStore';
import {
  Receipt,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  FileCheck2,
} from 'lucide-react';

export const BillingDashboard: React.FC = () => {
  const { bills, insuranceAuths, approveRecommendation, recommendations, executeCommand } = useHospital();
  const [activeTab, setActiveTab] = useState<'auth' | 'ledgers'>('auth');
  const [isApproving, setIsApproving] = useState(false);

  const pendingAuths = insuranceAuths.filter((a) => a.status !== 'Approved');
  const p1001Rec = recommendations.find((r) => r.targetPatientId === 'P1001');

  const handleApproveWaiver = async () => {
    if (!p1001Rec) return;
    setIsApproving(true);
    try {
      await approveRecommendation(p1001Rec.id);
    } finally {
      setIsApproving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Calm Financial Officer Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 tracking-tight">
            Insurance & Patient Accounts Desk
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Anand Swaroop · Lead Insurance & TPA Clearance Officer · CareOne Multispecialty
          </p>
        </div>

        {/* Financial Pulse */}
        <div className="flex items-center gap-6 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Revenue Today</span>
            <span className="font-semibold text-slate-800">₹38.4 Lakhs</span>
          </div>
          <div className="h-7 w-px bg-slate-200" />
          <div>
            <span className="text-slate-400 block text-[11px]">TPA Queries</span>
            <span className="font-semibold text-amber-700">1 Query Pending (MedAssist)</span>
          </div>
          <div className="h-7 w-px bg-slate-200" />
          <div>
            <span className="text-slate-400 block text-[11px]">Discharge Holds</span>
            <span className="font-semibold text-rose-700">1 Patient (P1001)</span>
          </div>
        </div>
      </div>

      {/* Menu Bar: Progressive Disclosure Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-px">
        <button
          onClick={() => setActiveTab('auth')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors ${
            activeTab === 'auth'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Pending TPA Authorizations ({insuranceAuths.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('ledgers')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors ${
            activeTab === 'ledgers'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>Hospital Inpatient Ledgers</span>
        </button>
      </div>

      {/* Tab 1: Pending TPA Authorizations */}
      {activeTab === 'auth' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs divide-y divide-slate-100">
            {insuranceAuths.map((auth) => {
              const isApproved = auth.status === 'Approved';

              return (
                <div key={auth.id} className="p-5 hover:bg-slate-50/50 transition-colors text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900 text-sm">{auth.patientName}</span>
                        <span className="text-slate-400">·</span>
                        <span className="text-slate-500">{auth.patientId}</span>
                        <span className="text-slate-400">·</span>
                        <span className="text-slate-700 font-medium">Policy: {auth.policyNumber}</span>
                      </div>
                      <p className="text-slate-500 mt-0.5">
                        TPA: {auth.tpaProvider} · Turnaround: {auth.turnaroundHours} hours
                      </p>
                    </div>

                    <span className={`font-medium ${isApproved ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {isApproved ? 'Authorization Finalized ✓' : 'Awaiting Query Resolution'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 py-3 my-2 bg-slate-50 rounded-lg px-3.5 text-slate-600">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Claimed Amount</span>
                      <span className="font-medium text-slate-800">₹{auth.claimedAmount.toLocaleString('en-IN')}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Approved Amount</span>
                      <span className="font-medium text-emerald-700">₹{auth.approvedAmount.toLocaleString('en-IN')}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Patient Co-pay</span>
                      <span className="font-medium text-slate-800">₹{(auth.claimedAmount - auth.approvedAmount).toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {auth.queriesPending && (
                    <div className="p-3 my-2 rounded-lg bg-amber-50/60 border border-amber-200/60 text-slate-700">
                      <span className="font-semibold text-amber-900">Query from {auth.tpaProvider}:</span>{' '}
                      {auth.queriesPending}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-slate-400">
                      Discharge Pass: {isApproved ? 'Released' : 'Held pending pre-auth'}
                    </span>

                    {!isApproved && p1001Rec && (
                      <button
                        onClick={handleApproveWaiver}
                        disabled={isApproving}
                        className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs shadow-xs transition-colors"
                      >
                        {isApproving ? 'Authorizing...' : 'Grant Provisional Clearance & Release Hold'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Hospital Inpatient Ledgers */}
      {activeTab === 'ledgers' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs divide-y divide-slate-100 animate-in fade-in duration-150">
          {bills.map((bill) => (
            <div key={bill.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900">{bill.patientName}</span>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-500">{bill.patientId}</span>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-500 font-mono">{bill.id}</span>
                </div>
                <div className="text-slate-500 mt-0.5">
                  Total: ₹{bill.totalAmount.toLocaleString('en-IN')} · Insurance: ₹{bill.insuranceCovered.toLocaleString('en-IN')}
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div>
                  <span className="text-slate-400 block text-[11px]">Paid</span>
                  <span className="font-medium text-slate-800">₹{bill.amountPaid.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Balance</span>
                  <span className={`font-semibold ${bill.outstandingBalance > 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
                    ₹{bill.outstandingBalance.toLocaleString('en-IN')}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Discharge Clearance</span>
                  <span className="font-medium text-slate-800">
                    {bill.dischargeClearanceGranted ? 'Granted ✓' : 'Pending'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
