// CareOS Hospital Operating System — Dedicated Patient Portal Dashboard (Calm UX)
import React, { useState } from 'react';
import { useHospital } from '../../state/hospitalStore';
import {
  Heart,
  CheckCircle2,
  Clock,
  FileText,
  Pill,
  ShieldCheck,
  Stethoscope,
  PhoneCall,
  Activity,
  Sparkles,
  Volume2,
} from 'lucide-react';

export const PatientDashboard: React.FC = () => {
  const {
    patients,
    bills,
    insuranceAuths,
    pharmacyOrders,
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

  const handleCallNurse = () => {
    setCallNurseSent(true);
    speakText('Nurse call dispatched. Sister Kavitha Rao has been notified to Bed 101.');
    setTimeout(() => setCallNurseSent(false), 5000);
  };

  const isDischarged = patient.status === 'Discharged';

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Calm Patient Welcome & Status Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold text-slate-900 tracking-tight">
                Welcome, {patient.name}
              </h2>
              <span className="text-slate-400">·</span>
              <span className="text-xs text-slate-500">ID: {patient.id}</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              CareOne Multispecialty Hospital · Cardiology Inpatient Service · Bed {patient.roomBed || 'BED101'}
            </p>
          </div>

          <button
            onClick={handleCallNurse}
            disabled={callNurseSent}
            className={`px-4 py-2 rounded-xl text-xs font-medium flex items-center gap-2 transition-all ${
              callNurseSent
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
            }`}
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>{callNurseSent ? 'Sister Kavitha Alerted ✓' : 'Call Ward Nurse'}</span>
          </button>
        </div>

        {/* Clear, Human Explanation of Current Status */}
        <div className="pt-4 flex items-start gap-3.5">
          <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="text-xs text-slate-600 leading-relaxed">
            {isDischarged ? (
              <div>
                <span className="font-semibold text-slate-900 block text-sm mb-1">
                  Discharge Finalized · Ready for Exit
                </span>
                Your cashless insurance authorization has been completed with MedAssist TPA, your co-pay differential is settled, and your take-home medications are packaged and waiting at Pharmacy Bay 2.
              </div>
            ) : (
              <div>
                <span className="font-semibold text-slate-900 block text-sm mb-1">
                  Clinical Observation Complete · Approved for Discharge
                </span>
                Dr. S. K. Murthy has verified your diagnostic scans and confirmed normal heart function (ejection fraction 62%). The hospital billing team is currently coordinating your final cashless pre-authorization with <span className="font-medium text-slate-900">MedAssist TPA</span> to prevent unexpected out-of-pocket expenses before you head home.
              </div>
            )}
          </div>
        </div>

        {/* Quiet Care Team Info */}
        <div className="mt-4 pt-3.5 border-t border-slate-100 flex flex-wrap items-center gap-6 text-xs text-slate-500">
          <div>
            Attending Cardiologist: <span className="font-medium text-slate-800">{patient.doctorName}</span>
          </div>
          <span className="text-slate-300">·</span>
          <div>
            Ward Supervisor: <span className="font-medium text-slate-800">Sister Kavitha Rao</span>
          </div>
          <span className="text-slate-300">·</span>
          <div>
            Admitted: <span className="font-medium text-slate-800">{patient.admissionDate}</span>
          </div>
        </div>
      </div>

      {/* Menu Bar: Progressive Disclosure Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-px overflow-x-auto">
        <button
          onClick={() => setActiveTab('journey')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'journey'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>My Care Journey</span>
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'reports'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Diagnostic Test Results</span>
        </button>

        <button
          onClick={() => setActiveTab('meds')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'meds'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Pill className="w-4 h-4" />
          <span>Discharge Medications</span>
        </button>

        <button
          onClick={() => setActiveTab('billing')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'billing'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Insurance & Billing Ledger</span>
        </button>
      </div>

      {/* Tab 1: Journey */}
      {activeTab === 'journey' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs animate-in fade-in duration-150">
          <h3 className="text-xs font-semibold text-slate-900 tracking-wide mb-6">
            Hospital Stay Milestones
          </h3>

          <div className="space-y-6">
            {patient.journeySteps.map((step, idx) => {
              const isDone = step.status === 'COMPLETED';
              const isBlocked = step.status === 'BLOCKED' && !isDischarged;

              return (
                <div key={step.stage} className="flex items-start gap-4 text-xs">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-medium ${
                        isDone
                          ? 'bg-emerald-600 text-white'
                          : isBlocked
                          ? 'bg-amber-600 text-white animate-pulse'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                    </div>
                    {idx < patient.journeySteps.length - 1 && (
                      <div className={`w-px h-8 my-1.5 ${isDone ? 'bg-emerald-600' : 'bg-slate-200'}`} />
                    )}
                  </div>

                  <div className="flex-1 pb-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900">{step.stage}</span>
                      <span className="text-[11px] text-slate-400">{step.timestamp || 'In Progress'}</span>
                    </div>

                    <p className="text-slate-500 text-[11px] mt-0.5">
                      Handled by {step.owner} · {step.relatedDepartment}
                    </p>

                    {step.notes && (
                      <p className="mt-1.5 p-3 rounded-lg bg-slate-50 border border-slate-100 text-slate-700 text-xs">
                        {step.notes}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Reports */}
      {activeTab === 'reports' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4 animate-in fade-in duration-150 text-xs">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="font-semibold text-slate-900">Diagnostic Scans & Lab Panels</h3>
              <p className="text-slate-500 mt-0.5">All results verified by department heads</p>
            </div>
            <button
              onClick={() => speakText('Ravi Kumar, your cardiac MRI shows normal left ventricular dimensions with an ejection fraction of 62 percent. Your troponin blood tests are completely negative. Your heart is in healthy condition.')}
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1.5"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Listen to Summary</span>
            </button>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-900 text-sm">Cardiac MRI Study (Siemens Skyra 3.0T)</span>
              <span className="text-emerald-700 font-medium">Normal · Ejection Fraction 62%</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Findings: Normal ventricular chambers. Left ventricular systolic function well preserved. No evidence of myocardial scarring or edema. Signed by Dr. Priya Varma (Chief of Radiology).
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-900 text-sm">Cardiac Biomarkers (High-Sensitivity Troponin-T)</span>
              <span className="text-emerald-700 font-medium">&lt; 5 ng/L (Negative)</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Findings: Negative for acute myocardial injury. Serum electrolytes, renal profile, and hemogram within normal limits.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-900 text-sm">12-Lead Electrocardiogram (ECG)</span>
              <span className="text-emerald-700 font-medium">Normal Sinus Rhythm</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Findings: Regular sinus rhythm at 74 bpm. No ischemic ST-segment deviation or conduction blocks.
            </p>
          </div>
        </div>
      )}

      {/* Tab 3: Meds */}
      {activeTab === 'meds' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4 animate-in fade-in duration-150 text-xs">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="font-semibold text-slate-900">Take-Home Prescriptions</h3>
              <p className="text-slate-500 mt-0.5">Prescribed by Dr. S. K. Murthy · Packaged at Central Pharmacy</p>
            </div>
            <span className="text-emerald-700 font-medium">Ready at Pharmacy Bay 2</span>
          </div>

          <div className="space-y-3">
            {pharmacy?.medications.map((med, i) => (
              <div key={i} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-900 text-sm">{med.name}</span>
                  <p className="text-slate-500 mt-0.5">
                    Schedule: <span className="font-medium text-slate-800">{med.dosage}</span> · Quantity: {med.quantity} tablets
                  </p>
                </div>
                <span className="text-slate-400 font-mono">Packaged ✓</span>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 text-slate-700 space-y-1">
            <span className="font-semibold text-blue-900 block">Doctor's Recovery Guidance:</span>
            <p className="text-slate-600 leading-relaxed">
              Take medications after meals with water. Avoid strenuous workouts or heavy lifting for 7 days. Low-sodium, heart-healthy diet recommended. Follow-up consultation scheduled in 2 weeks.
            </p>
          </div>
        </div>
      )}

      {/* Tab 4: Billing */}
      {activeTab === 'billing' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5 animate-in fade-in duration-150 text-xs">
          <div>
            <h3 className="font-semibold text-slate-900">Cashless Insurance & Hospital Ledger</h3>
            <p className="text-slate-500 mt-0.5">MedAssist Health Insurance TPA · Policy {auth?.policyNumber}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <div>
              <span className="text-slate-400 block text-[11px]">Total Hospital Bill</span>
              <span className="font-semibold text-slate-900 text-base mt-1 block">
                ₹{bill?.totalAmount.toLocaleString('en-IN')}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Insurance Approved</span>
              <span className="font-semibold text-emerald-700 text-base mt-1 block">
                ₹{bill?.insuranceCovered.toLocaleString('en-IN')}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Co-pay Paid</span>
              <span className="font-semibold text-slate-900 text-base mt-1 block">
                ₹{bill?.amountPaid.toLocaleString('en-IN')}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Settlement Balance</span>
              <span className="font-semibold text-slate-900 text-base mt-1 block">
                ₹{bill?.outstandingBalance.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
            <span className="font-semibold text-slate-900 block">Cashless Clearance Status:</span>
            <p className="text-slate-600 leading-relaxed">
              {isDischarged
                ? 'Your final cashless settlement has been approved by MedAssist TPA. You do not need to visit the billing counter. Your exit pass is active.'
                : 'The hospital insurance desk has submitted the implant serial documentation to MedAssist TPA. Once the clearance token syncs, your discharge exit pass will be automatically released.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
