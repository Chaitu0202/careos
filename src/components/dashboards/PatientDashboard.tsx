// CareOS Hospital Operating System — Dedicated Patient Portal Dashboard
import React, { useState } from 'react';
import { useHospital } from '../../state/hospitalStore';
import {
  Heart,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Pill,
  ShieldCheck,
  Stethoscope,
  PhoneCall,
  User,
  Activity,
  Sparkles,
  Download,
  Calendar,
  MessageSquare,
  BedDouble,
  ChevronRight,
} from 'lucide-react';

export const PatientDashboard: React.FC = () => {
  const {
    patients,
    bills,
    insuranceAuths,
    pharmacyOrders,
    imagingOrders,
    executeCommand,
    speakText,
  } = useHospital();

  const [callNurseSent, setCallNurseSent] = useState(false);
  const [activeTab, setActiveTab] = useState<'journey' | 'reports' | 'meds' | 'billing'>('journey');

  // Active demo patient Ravi Kumar (P1001)
  const patient = patients.find((p) => p.id === 'P1001') || patients[0];
  const bill = bills.find((b) => b.patientId === patient.id) || bills[0];
  const auth = insuranceAuths.find((a) => a.patientId === patient.id) || insuranceAuths[0];
  const pharmacy = pharmacyOrders.find((p) => p.patientId === patient.id) || pharmacyOrders[0];
  const imaging = imagingOrders.filter((i) => i.patientId === patient.id);

  const handleCallNurse = () => {
    setCallNurseSent(true);
    speakText('Nurse call notified. Sister Kavitha Rao has been alerted to room Bed 101.');
    setTimeout(() => setCallNurseSent(false), 5000);
  };

  const handleAskCareOS = (query: string) => {
    executeCommand(query);
  };

  const isDischarged = patient.status === 'Discharged';

  return (
    <div className="space-y-4">
      {/* Patient Welcome Hero Card */}
      <div className="bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] rounded-2xl p-5 text-white shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center font-bold text-lg text-white border border-white/30 shadow-xs">
              RK
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold tracking-tight">
                  Welcome, {patient.name}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-white border border-white/30 uppercase tracking-wider">
                  Patient ID: {patient.id}
                </span>
              </div>
              <p className="text-xs text-blue-100 mt-0.5">
                CareOne Multispecialty Hospital • Cardiology Department • Room/Bed: <span className="font-semibold text-white">{patient.roomBed || 'BED101'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCallNurse}
              disabled={callNurseSent}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs ${
                callNurseSent
                  ? 'bg-emerald-500 text-white'
                  : 'bg-white text-[#2563EB] hover:bg-blue-50'
              }`}
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>{callNurseSent ? 'Nurse Notified ✓' : 'Call Ward Nurse'}</span>
            </button>
          </div>
        </div>

        {/* Live Care Summary Bar */}
        <div className="mt-4 pt-3.5 border-t border-white/20 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <div className="text-blue-200 text-[10px] uppercase font-semibold">Attending Cardiologist</div>
            <div className="font-bold text-white mt-0.5">{patient.doctorName}</div>
          </div>
          <div>
            <div className="text-blue-200 text-[10px] uppercase font-semibold">Ward Supervisor</div>
            <div className="font-bold text-white mt-0.5">Sister Kavitha Rao</div>
          </div>
          <div>
            <div className="text-blue-200 text-[10px] uppercase font-semibold">Admission Date</div>
            <div className="font-bold text-white mt-0.5">{patient.admissionDate}</div>
          </div>
          <div>
            <div className="text-blue-200 text-[10px] uppercase font-semibold">Discharge Status</div>
            <div className="font-bold text-white mt-0.5 flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${isDischarged ? 'bg-emerald-400' : 'bg-amber-300 animate-ping'}`} />
              <span>{isDischarged ? 'Cleared & Discharged ✓' : 'Clinical Clearance Signed ✓'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Transparent Care Status Notice */}
      <div className={`p-4 rounded-xl border flex items-start gap-3 ${
        isDischarged
          ? 'bg-[#E8F8F6] border-[#0F9F9A]/30 text-[#0F9F9A]'
          : 'bg-[#FFF6E5] border-[#D97706]/30 text-[#172B4D]'
      }`}>
        <Sparkles className="w-5 h-5 text-[#2563EB] shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed">
          {isDischarged ? (
            <div>
              <span className="font-bold text-[#16A34A] block mb-0.5 text-sm">
                Discharge Completed! You are ready to go home.
              </span>
              Your insurance cashless pre-authorization has been finalized with MedAssist TPA, your copay differential is cleared, and your discharge pass is active. Your medications are packaged and ready for pickup at Pharmacy Bay 2.
            </div>
          ) : (
            <div>
              <span className="font-bold text-[#172B4D] block mb-0.5 text-sm">
                Clinical Health Status: Approved for Discharge by Dr. S. K. Murthy
              </span>
              Your vital signs are healthy and your cardiac MRI confirms normal cardiac function (ejection fraction 62%). CareOS is currently expediting your cashless authorization with <span className="font-semibold text-[#2563EB]">MedAssist TPA</span> to ensure zero out-of-pocket surprise charges before you leave.
            </div>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1 border-b border-[#E2E8F0] pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('journey')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
            activeTab === 'journey'
              ? 'bg-[#2563EB] text-white shadow-xs'
              : 'text-[#64748B] hover:text-[#172B4D] hover:bg-white'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>My Care Journey</span>
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
            activeTab === 'reports'
              ? 'bg-[#2563EB] text-white shadow-xs'
              : 'text-[#64748B] hover:text-[#172B4D] hover:bg-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>My Diagnostic Reports</span>
        </button>

        <button
          onClick={() => setActiveTab('meds')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
            activeTab === 'meds'
              ? 'bg-[#2563EB] text-white shadow-xs'
              : 'text-[#64748B] hover:text-[#172B4D] hover:bg-white'
          }`}
        >
          <Pill className="w-3.5 h-3.5" />
          <span>Discharge Medications</span>
        </button>

        <button
          onClick={() => setActiveTab('billing')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
            activeTab === 'billing'
              ? 'bg-[#2563EB] text-white shadow-xs'
              : 'text-[#64748B] hover:text-[#172B4D] hover:bg-white'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Billing & Insurance Breakdown</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'journey' && (
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs p-5">
          <h3 className="text-xs font-bold text-[#172B4D] uppercase tracking-wider mb-4">
            My Hospital Stay Journey Milestones
          </h3>

          <div className="space-y-4">
            {patient.journeySteps.map((step, idx) => {
              const isDone = step.status === 'COMPLETED';
              const isBlocked = step.status === 'BLOCKED' && !isDischarged;
              const isCurrent = step.status === 'IN_PROGRESS' || (step.status === 'BLOCKED' && !isDischarged);

              return (
                <div key={step.stage} className="flex items-start gap-3 text-xs">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-bold transition-all ${
                        isDone
                          ? 'bg-[#16A34A] text-white'
                          : isBlocked
                          ? 'bg-[#D97706] text-white animate-pulse'
                          : 'bg-[#F6F9FC] text-[#64748B] border border-[#E2E8F0]'
                      }`}
                    >
                      {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                    </div>
                    {idx < patient.journeySteps.length - 1 && (
                      <div className={`w-0.5 h-7 my-1 ${isDone ? 'bg-[#16A34A]' : 'bg-[#E2E8F0]'}`} />
                    )}
                  </div>

                  <div className="flex-1 pb-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#172B4D] text-xs">
                        {step.stage}
                      </span>
                      <span className="text-[11px] font-mono text-[#64748B]">
                        {step.timestamp || 'In Progress'}
                      </span>
                    </div>

                    <div className="text-[11px] text-[#64748B] mt-0.5">
                      Handled by: <span className="text-[#172B4D] font-medium">{step.owner}</span> • {step.relatedDepartment}
                    </div>

                    {step.notes && (
                      <div className="mt-1 p-2 rounded-lg bg-[#F6F9FC] border border-[#E2E8F0] text-[11px] text-[#172B4D]">
                        {step.notes}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs p-5 space-y-3">
          <h3 className="text-xs font-bold text-[#172B4D] uppercase tracking-wider mb-2">
            My Diagnostic Test Results & Scans
          </h3>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl border border-[#E2E8F0] bg-[#F6F9FC] flex items-start justify-between gap-3 text-xs">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#172B4D]">Cardiac MRI Function Study (3.0T Siemens Skyra)</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E8F8F6] text-[#0F9F9A]">
                    Report Ready ✓
                  </span>
                </div>
                <p className="text-[#64748B] text-[11px] mt-1 leading-relaxed">
                  Findings: Normal ventricular dimensions. Left ventricular ejection fraction 62% (Healthy). No myocardial edema or scarring detected. Signed by Chief Radiologist Dr. Priya Varma.
                </p>
              </div>
              <button
                onClick={() => speakText('Cardiac MRI Report: Normal ventricular dimensions. Ejection fraction 62%. Dr. Priya Varma confirmed normal myocardial perfusion.')}
                className="px-2.5 py-1 rounded bg-white border border-[#E2E8F0] text-[#2563EB] font-semibold text-xs hover:bg-[#EAF2FF] shrink-0"
              >
                Listen Report
              </button>
            </div>

            <div className="p-3.5 rounded-xl border border-[#E2E8F0] bg-[#F6F9FC] flex items-start justify-between gap-3 text-xs">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#172B4D]">Cardiac Biomarkers (Troponin-T & CK-MB)</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E8F8F6] text-[#0F9F9A]">
                    Normal / Negative ✓
                  </span>
                </div>
                <p className="text-[#64748B] text-[11px] mt-1 leading-relaxed">
                  Findings: High-sensitivity Troponin-T &lt; 5 ng/L (Negative for acute myocardial injury). Serum electrolytes and renal markers within physiological limits.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-[#E2E8F0] bg-[#F6F9FC] flex items-start justify-between gap-3 text-xs">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#172B4D]">12-Lead Electrocardiogram (ECG)</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E8F8F6] text-[#0F9F9A]">
                    Normal Sinus Rhythm ✓
                  </span>
                </div>
                <p className="text-[#64748B] text-[11px] mt-1 leading-relaxed">
                  Findings: Heart rate 74 bpm, regular rhythm, no ischemic ST-segment changes.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'meds' && (
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs p-5 space-y-3">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-xs font-bold text-[#172B4D] uppercase tracking-wider">
                My Take-Home Medications
              </h3>
              <p className="text-[11px] text-[#64748B]">
                Prescribed by Dr. S. K. Murthy • Packaged & sealed at Central Pharmacy
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-[#E8F8F6] text-[#0F9F9A] text-xs font-bold border border-[#0F9F9A]/30">
              Ready for Collection (Bay 2)
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            {pharmacy?.medications.map((med, i) => (
              <div
                key={i}
                className="p-3 rounded-xl border border-[#E2E8F0] bg-[#F6F9FC] flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#2563EB]/10 text-[#2563EB] flex items-center justify-center font-bold">
                    <Pill className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-[#172B4D]">{med.name}</div>
                    <div className="text-[11px] text-[#64748B]">
                      Dosage: <span className="font-semibold text-[#172B4D]">{med.dosage}</span> • Quantity: {med.quantity} tablets
                    </div>
                  </div>
                </div>

                <span className="text-[11px] font-bold text-[#16A34A] bg-[#E8F8F6] px-2 py-0.5 rounded">
                  Stock Verified ✓
                </span>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-[#EAF2FF] border border-[#2563EB]/20 text-xs text-[#172B4D]">
            <span className="font-bold">Doctor's Lifestyle Advice:</span> Take medicines after breakfast and dinner as indicated. Avoid strenuous heavy lifting for 7 days. Low-sodium Mediterranean heart diet recommended.
          </div>
        </div>
      )}

      {activeTab === 'billing' && (
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs p-5 space-y-4">
          <h3 className="text-xs font-bold text-[#172B4D] uppercase tracking-wider border-b border-[#E2E8F0] pb-2">
            Transparent Billing & TPA Insurance Ledger
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-center">
            <div className="p-3 rounded-xl bg-[#F6F9FC] border border-[#E2E8F0]">
              <div className="text-[10px] text-[#64748B] uppercase font-semibold">Total Hospital Bill</div>
              <div className="text-base font-bold text-[#172B4D] mt-0.5">
                ₹{bill?.totalAmount.toLocaleString('en-IN')}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#E8F8F6] border border-[#0F9F9A]/30">
              <div className="text-[10px] text-[#0F9F9A] uppercase font-semibold">Insurance Covered</div>
              <div className="text-base font-bold text-[#0F9F9A] mt-0.5">
                ₹{bill?.insuranceCovered.toLocaleString('en-IN')}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#F6F9FC] border border-[#E2E8F0]">
              <div className="text-[10px] text-[#64748B] uppercase font-semibold">Patient Share Paid</div>
              <div className="text-base font-bold text-[#172B4D] mt-0.5">
                ₹{bill?.amountPaid.toLocaleString('en-IN')}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#FFF6E5] border border-[#D97706]/30">
              <div className="text-[10px] text-[#D97706] uppercase font-semibold">Remaining Balance</div>
              <div className="text-base font-bold text-[#D97706] mt-0.5">
                ₹{bill?.outstandingBalance.toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          {/* Insurance Details */}
          <div className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F6F9FC] text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#172B4D]">TPA Health Policy Details</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                isDischarged ? 'bg-[#E8F8F6] text-[#0F9F9A]' : 'bg-[#FFF6E5] text-[#D97706]'
              }`}>
                {isDischarged ? 'Pre-Auth Approved ✓' : 'TPA Pre-Auth Query in Progress'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] text-[#64748B]">
              <div>Provider: <span className="font-semibold text-[#172B4D]">{auth?.tpaProvider}</span></div>
              <div>Policy Number: <span className="font-mono font-semibold text-[#172B4D]">{auth?.policyNumber}</span></div>
            </div>

            <p className="text-[11px] text-[#64748B] leading-relaxed pt-1 border-t border-[#E2E8F0]">
              Note: The hospital administration has already submitted the documentation. You do not need to stand in billing queues — your discharge token will be automatically released once the portal syncs.
            </p>
          </div>
        </div>
      )}

      {/* Quick Questions for CareOS */}
      <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-xs">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-2 block">
          Ask CareOS Assistant About Your Stay:
        </span>
        <div className="flex flex-wrap gap-2 text-xs">
          <button
            onClick={() => handleAskCareOS('Why is P1001 delayed?')}
            className="px-3 py-1.5 rounded-lg bg-[#F6F9FC] hover:bg-[#EAF2FF] text-[#2563EB] border border-[#E2E8F0] font-medium transition-colors"
          >
            "Why is my discharge pending?"
          </button>
          <button
            onClick={() => handleAskCareOS('Show discharge blockers for P1001')}
            className="px-3 py-1.5 rounded-lg bg-[#F6F9FC] hover:bg-[#EAF2FF] text-[#2563EB] border border-[#E2E8F0] font-medium transition-colors"
          >
            "Show my discharge blockers"
          </button>
          <button
            onClick={() => speakText('Ravi Kumar, your clinical reports are completely clear. Your ejection fraction is 62 percent and heart function is normal. You will be cleared as soon as your cashless pre-authorization is confirmed.')}
            className="px-3 py-1.5 rounded-lg bg-[#F6F9FC] hover:bg-[#EAF2FF] text-[#2563EB] border border-[#E2E8F0] font-medium transition-colors"
          >
            "Read my doctor's summary"
          </button>
        </div>
      </div>
    </div>
  );
};
