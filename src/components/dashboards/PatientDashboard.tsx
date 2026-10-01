// CareOS Hospital Operating System — Dedicated Patient Portal Dashboard (Calm UX with Caretakers & Medication Alarms)
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
  Users,
  Bell,
  Plus,
  Trash2,
  Phone,
  Check,
  AlertCircle,
  Calendar,
  Shield,
  UserCheck,
} from 'lucide-react';

interface Caretaker {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  passNumber: string;
  isPrimary: boolean;
  permissions: string[];
  status: 'In Room' | 'Off Campus' | 'Visiting';
}

interface MedicationAlarm {
  id: string;
  time: string;
  rawTime: string;
  period: 'Morning' | 'Afternoon' | 'Night';
  medications: string[];
  instructions: string;
  enabled: boolean;
  takenToday: boolean;
}

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
  const [activeTab, setActiveTab] = useState<'journey' | 'reports' | 'meds' | 'billing' | 'caretakers' | 'alarms'>('journey');

  // Caretaker State
  const [caretakers, setCaretakers] = useState<Caretaker[]>([
    {
      id: 'CT-1',
      name: 'Sunita Kumar',
      relationship: 'Spouse (Wife)',
      phone: '+91 98480 12345',
      passNumber: 'VP-401',
      isPrimary: true,
      permissions: ['24/7 Bedside Attendant Pass', 'Receives SMS Health Updates', 'Emergency Medical Decision Contact'],
      status: 'In Room',
    },
    {
      id: 'CT-2',
      name: 'Rahul Kumar',
      relationship: 'Son',
      phone: '+91 98480 67890',
      passNumber: 'VP-402',
      isPrimary: false,
      permissions: ['Visiting Pass (16:00 - 19:00)', 'Receives Discharge & Billing SMS'],
      status: 'Off Campus',
    },
  ]);

  const [isAddingCaretaker, setIsAddingCaretaker] = useState(false);
  const [newCaretakerName, setNewCaretakerName] = useState('');
  const [newCaretakerRel, setNewCaretakerRel] = useState('Daughter');
  const [newCaretakerPhone, setNewCaretakerPhone] = useState('');
  const [newCaretakerBedside, setNewCaretakerBedside] = useState(true);

  // Medication Alarms State
  const [alarms, setAlarms] = useState<MedicationAlarm[]>([
    {
      id: 'ALM-1',
      time: '08:30 AM',
      rawTime: '08:30',
      period: 'Morning',
      medications: ['Tab Ecosprin 75mg', 'Tab Metoprolol 25mg'],
      instructions: '30 mins after breakfast with full glass of water',
      enabled: true,
      takenToday: true,
    },
    {
      id: 'ALM-2',
      time: '01:30 PM',
      rawTime: '13:30',
      period: 'Afternoon',
      medications: ['Tab Calcium & Vitamin D3'],
      instructions: 'Post-lunch chewable tablet with water',
      enabled: true,
      takenToday: false,
    },
    {
      id: 'ALM-3',
      time: '09:30 PM',
      rawTime: '21:30',
      period: 'Night',
      medications: ['Tab Atorvastatin 20mg'],
      instructions: 'After dinner before bedtime',
      enabled: true,
      takenToday: false,
    },
  ]);

  const [isAddingAlarm, setIsAddingAlarm] = useState(false);
  const [newAlarmTime, setNewAlarmTime] = useState('08:00');
  const [newAlarmMed, setNewAlarmMed] = useState('Tab Ecosprin 75mg');
  const [newAlarmInstructions, setNewAlarmInstructions] = useState('After breakfast');
  const [newAlarmPeriod, setNewAlarmPeriod] = useState<'Morning' | 'Afternoon' | 'Night'>('Morning');

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

  const handleAddCaretakerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCaretakerName.trim() || !newCaretakerPhone.trim()) return;

    const newId = `CT-${Date.now().toString().slice(-3)}`;
    const passNum = `VP-${Math.floor(400 + Math.random() * 90)}`;
    const item: Caretaker = {
      id: newId,
      name: newCaretakerName.trim(),
      relationship: newCaretakerRel,
      phone: newCaretakerPhone.trim(),
      passNumber: passNum,
      isPrimary: caretakers.length === 0,
      permissions: [
        newCaretakerBedside ? '24/7 Bedside Attendant Pass' : 'Standard Visitor Pass',
        'Receives SMS Discharge Updates',
      ],
      status: 'Visiting',
    };

    setCaretakers([...caretakers, item]);
    speakText(`Caretaker ${newCaretakerName} registered with hospital visitor pass ${passNum}.`);
    setNewCaretakerName('');
    setNewCaretakerPhone('');
    setIsAddingCaretaker(false);
  };

  const handleRemoveCaretaker = (id: string, name: string) => {
    setCaretakers(caretakers.filter((c) => c.id !== id));
    speakText(`Caretaker ${name} removed.`);
  };

  const handleToggleAlarm = (id: string) => {
    setAlarms(
      alarms.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a))
    );
  };

  const handleToggleTaken = (id: string) => {
    setAlarms(
      alarms.map((a) => (a.id === id ? { ...a, takenToday: !a.takenToday } : a))
    );
  };

  const handleTestAlarmChime = (alarm: MedicationAlarm) => {
    speakText(
      `Medication reminder: It is ${alarm.time}. Please take ${alarm.medications.join(' and ')}. ${alarm.instructions}.`
    );
  };

  const handleAddAlarmSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlarmMed.trim()) return;

    // format time 12h
    const [hh, mm] = newAlarmTime.split(':');
    const hour = parseInt(hh, 10);
    const suffix = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    const formatted = `${String(displayHour).padStart(2, '0')}:${mm} ${suffix}`;

    const newAlarm: MedicationAlarm = {
      id: `ALM-${Date.now().toString().slice(-3)}`,
      time: formatted,
      rawTime: newAlarmTime,
      period: newAlarmPeriod,
      medications: [newAlarmMed.trim()],
      instructions: newAlarmInstructions.trim(),
      enabled: true,
      takenToday: false,
    };

    setAlarms([...alarms, newAlarm]);
    speakText(`Alarm saved for ${formatted} to take ${newAlarmMed}.`);
    setIsAddingAlarm(false);
  };

  const isDischarged = patient.status === 'Discharged';
  const takenCount = alarms.filter((a) => a.takenToday).length;

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
          className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
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
          className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'reports'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Test Results</span>
        </button>

        <button
          onClick={() => setActiveTab('meds')}
          className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'meds'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Pill className="w-4 h-4" />
          <span>Prescriptions</span>
        </button>

        <button
          onClick={() => setActiveTab('billing')}
          className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'billing'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Insurance & Billing</span>
        </button>

        {/* Newly Added: Care Takers */}
        <button
          onClick={() => setActiveTab('caretakers')}
          className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'caretakers'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Care Takers ({caretakers.length})</span>
        </button>

        {/* Newly Added: Medication Alarms */}
        <button
          onClick={() => setActiveTab('alarms')}
          className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'alarms'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Medication Alarms ({alarms.filter((a) => a.enabled).length})</span>
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
                <button
                  onClick={() => {
                    setActiveTab('alarms');
                    setNewAlarmMed(med.name);
                    setIsAddingAlarm(true);
                  }}
                  className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>Set Alarm</span>
                </button>
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

      {/* Tab 5: Care Takers */}
      {activeTab === 'caretakers' && (
        <div className="space-y-4 animate-in fade-in duration-150 text-xs">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-semibold text-slate-900 text-sm">Designated Family & Care Takers</h3>
                <p className="text-slate-500 mt-0.5">
                  Authorized attendants holding official hospital visitor and bedside passes
                </p>
              </div>

              <button
                onClick={() => setIsAddingCaretaker(!isAddingCaretaker)}
                className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium flex items-center gap-1.5 self-start sm:self-auto shadow-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Caretaker</span>
              </button>
            </div>

            {/* Inline Add Caretaker Form */}
            {isAddingCaretaker && (
              <form onSubmit={handleAddCaretakerSubmit} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="font-semibold text-slate-900">Register New Caretaker / Family Attendant</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Priya Kumar"
                      value={newCaretakerName}
                      onChange={(e) => setNewCaretakerName(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-900 text-xs outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">Relationship</label>
                    <select
                      value={newCaretakerRel}
                      onChange={(e) => setNewCaretakerRel(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-900 text-xs outline-none focus:border-blue-600"
                    >
                      <option value="Spouse">Spouse</option>
                      <option value="Son">Son</option>
                      <option value="Daughter">Daughter</option>
                      <option value="Parent">Parent</option>
                      <option value="Sibling">Sibling</option>
                      <option value="Guardian">Guardian</option>
                      <option value="Relative/Friend">Relative / Friend</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">Mobile Phone (for SMS updates)</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98480 12345"
                      value={newCaretakerPhone}
                      onChange={(e) => setNewCaretakerPhone(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-900 text-xs outline-none focus:border-blue-600"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="bedsidePass"
                    checked={newCaretakerBedside}
                    onChange={(e) => setNewCaretakerBedside(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="bedsidePass" className="text-slate-700 text-xs">
                    Issue 24/7 Bedside Attendant Security Pass for Bed 101
                  </label>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-xs"
                  >
                    Confirm & Issue Pass
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingCaretaker(false)}
                    className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Caretakers List */}
            <div className="space-y-3">
              {caretakers.map((ct) => (
                <div
                  key={ct.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900 text-sm">{ct.name}</span>
                        <span className="text-slate-400">·</span>
                        <span className="text-slate-600 font-medium">{ct.relationship}</span>
                        {ct.isPrimary && (
                          <>
                            <span className="text-slate-400">·</span>
                            <span className="text-blue-700 font-medium">Primary Contact</span>
                          </>
                        )}
                      </div>
                      <div className="text-slate-500 mt-0.5 flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-400" />
                          {ct.phone}
                        </span>
                        <span>·</span>
                        <span>Pass: <strong className="font-mono text-slate-700">{ct.passNumber}</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`font-medium ${ct.status === 'In Room' ? 'text-emerald-700' : 'text-slate-500'}`}>
                        {ct.status}
                      </span>
                      {caretakers.length > 1 && (
                        <button
                          onClick={() => handleRemoveCaretaker(ct.id, ct.name)}
                          title="Remove Caretaker"
                          className="p-1 rounded text-slate-400 hover:text-rose-600 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-[11px] text-slate-600">
                    <span className="text-slate-400">Access:</span>
                    {ct.permissions.map((p, idx) => (
                      <span key={idx} className="bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3.5 rounded-lg bg-blue-50/60 border border-blue-100 text-slate-600 leading-relaxed">
              <span className="font-semibold text-blue-900 block mb-0.5">Automated Family Updates:</span>
              All registered caretakers receive automated SMS alerts when clinical discharge clearance is granted, insurance pre-auth is approved, or take-home prescriptions are ready for collection.
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Medication Alarms */}
      {activeTab === 'alarms' && (
        <div className="space-y-4 animate-in fade-in duration-150 text-xs">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-slate-900 text-sm">Daily Medication Alarms & Reminders</h3>
                  <span className="text-slate-400">·</span>
                  <span className="text-emerald-700 font-medium">
                    {takenCount} of {alarms.length} Taken Today
                  </span>
                </div>
                <p className="text-slate-500 mt-0.5">
                  Synchronized schedule for your take-home heart medications
                </p>
              </div>

              <button
                onClick={() => setIsAddingAlarm(!isAddingAlarm)}
                className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium flex items-center gap-1.5 self-start sm:self-auto shadow-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Set New Alarm</span>
              </button>
            </div>

            {/* Inline Add Alarm Form */}
            {isAddingAlarm && (
              <form onSubmit={handleAddAlarmSubmit} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="font-semibold text-slate-900">Schedule Medication Alarm</div>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">Medication Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tab Ecosprin 75mg"
                      value={newAlarmMed}
                      onChange={(e) => setNewAlarmMed(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-900 text-xs outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">Alarm Time (24h)</label>
                    <input
                      type="time"
                      required
                      value={newAlarmTime}
                      onChange={(e) => setNewAlarmTime(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-900 text-xs outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">Day Period</label>
                    <select
                      value={newAlarmPeriod}
                      onChange={(e) => setNewAlarmPeriod(e.target.value as any)}
                      className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-900 text-xs outline-none focus:border-blue-600"
                    >
                      <option value="Morning">Morning</option>
                      <option value="Afternoon">Afternoon</option>
                      <option value="Night">Night</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">Meal Relation / Instructions</label>
                    <input
                      type="text"
                      placeholder="e.g. After breakfast with water"
                      value={newAlarmInstructions}
                      onChange={(e) => setNewAlarmInstructions(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-900 text-xs outline-none focus:border-blue-600"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-xs"
                  >
                    Save & Activate Alarm
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingAlarm(false)}
                    className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Alarm Cards */}
            <div className="space-y-3">
              {alarms.map((alarm) => (
                <div
                  key={alarm.id}
                  className={`p-4 rounded-xl border transition-all ${
                    alarm.enabled
                      ? alarm.takenToday
                        ? 'border-emerald-200 bg-emerald-50/20'
                        : 'border-slate-200 bg-slate-50/50'
                      : 'border-slate-200 bg-slate-100/50 opacity-60'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex flex-col items-center justify-center font-mono font-bold text-slate-800 shrink-0 shadow-2xs">
                        <Clock className="w-4 h-4 text-blue-600 mb-0.5" />
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900 text-base font-mono">
                            {alarm.time}
                          </span>
                          <span className="text-slate-400">·</span>
                          <span className="text-xs font-medium text-slate-600">{alarm.period}</span>
                        </div>

                        <div className="font-medium text-slate-800 text-xs mt-0.5">
                          {alarm.medications.join(' + ')}
                        </div>

                        <p className="text-slate-500 text-[11px] mt-0.5">
                          {alarm.instructions}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <button
                        onClick={() => handleTestAlarmChime(alarm)}
                        title="Play Voice Reminder"
                        className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-1 font-medium transition-colors"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-blue-600" />
                        <span>Voice Alarm</span>
                      </button>

                      <button
                        onClick={() => handleToggleTaken(alarm.id)}
                        className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all ${
                          alarm.takenToday
                            ? 'bg-emerald-600 text-white'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{alarm.takenToday ? 'Taken ✓' : 'Mark Taken'}</span>
                      </button>

                      {/* On/Off Switch */}
                      <button
                        onClick={() => handleToggleAlarm(alarm.id)}
                        className={`w-10 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                          alarm.enabled ? 'bg-blue-600' : 'bg-slate-300'
                        }`}
                        title={alarm.enabled ? 'Alarm Active' : 'Alarm Disabled'}
                      >
                        <span
                          className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform transform ${
                            alarm.enabled ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 flex items-center justify-between text-xs">
              <div>
                <span className="font-semibold text-slate-900 block">Smart Medication Adherence:</span>
                Alarms chime automatically via your device and send a push notification to your designated primary caretaker ({caretakers[0]?.name || 'Sunita Kumar'}).
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
