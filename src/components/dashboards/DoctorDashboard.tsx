// CareOS Hospital Operating System — Attending Physician & Doctor Dashboard (Calm UX)
import React, { useState } from 'react';
import { useHospital } from '../../state/hospitalStore';
import {
  Stethoscope,
  Users,
  CheckCircle2,
  Clock,
  FileCheck2,
  Calendar,
  Sparkles,
  ArrowRight,
  Activity,
  Heart,
  FileText,
} from 'lucide-react';

export const DoctorDashboard: React.FC = () => {
  const { patients, appointments, executeCommand, speakText } = useHospital();
  const [activeTab, setActiveTab] = useState<'inpatients' | 'diagnostics' | 'schedule'>('inpatients');

  // Filter patients under Dr. S. K. Murthy
  const myPatients = patients.filter((p) => p.doctor === 'DOC101' || p.department === 'Cardiology');
  const myAppointments = appointments.filter((a) => a.doctorId === 'DOC101');

  const pendingReviewPatients = myPatients.filter((p) => p.status === 'Delayed' || p.dischargeBlockers?.length);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Calm Clinician Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 tracking-tight">
            Cardiology Inpatient Service
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Dr. S. K. Murthy, MD, DM · Senior Interventional Cardiologist · Floor 1 Wards & CCU
          </p>
        </div>

        {/* Clinician Pulse */}
        <div className="flex items-center gap-6 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">My Inpatients</span>
            <span className="font-semibold text-slate-800">{myPatients.length} Active</span>
          </div>
          <div className="h-7 w-px bg-slate-200" />
          <div>
            <span className="text-slate-400 block text-[11px]">Action Needed</span>
            <span className="font-semibold text-amber-700">{pendingReviewPatients.length} Pending Sign-Off</span>
          </div>
          <div className="h-7 w-px bg-slate-200" />
          <div>
            <span className="text-slate-400 block text-[11px]">Cath Lab</span>
            <span className="font-semibold text-slate-800">14:00 (Hybrid OR 1)</span>
          </div>
        </div>
      </div>

      {/* Menu Bar: Progressive Disclosure Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-px">
        <button
          onClick={() => setActiveTab('inpatients')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors ${
            activeTab === 'inpatients'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>My Inpatient Cohort ({myPatients.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('diagnostics')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors ${
            activeTab === 'diagnostics'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileCheck2 className="w-4 h-4" />
          <span>Diagnostic Sign-Offs (2)</span>
        </button>

        <button
          onClick={() => setActiveTab('schedule')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors ${
            activeTab === 'schedule'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Rounds & Schedule</span>
        </button>
      </div>

      {/* Tab 1: Inpatient Cohort */}
      {activeTab === 'inpatients' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs divide-y divide-slate-100">
            {myPatients.map((p) => {
              const isDelayed = p.status === 'Delayed';
              const isCritical = p.status === 'Critical';

              return (
                <div key={p.id} className="p-5 hover:bg-slate-50/50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className="font-semibold text-slate-900 text-sm">{p.name}</span>
                        <span className="text-slate-400">·</span>
                        <span className="text-xs text-slate-500">{p.id}</span>
                        <span className="text-slate-400">·</span>
                        <span className="text-xs font-medium text-slate-700">{p.roomBed || 'CCU'}</span>
                        <span className="text-slate-400">·</span>
                        <span className="text-xs text-slate-500">{p.age}y / {p.gender}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        Service: {p.department} · Current Stage: {p.journeyStage}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-medium ${
                        isDelayed ? 'text-amber-700' : isCritical ? 'text-rose-700' : 'text-emerald-700'
                      }`}>
                        {isDelayed ? 'Discharge Pending Hold' : isCritical ? 'Critical Monitoring' : 'Stable Inpatient'}
                      </span>
                    </div>
                  </div>

                  {/* Clinical Indicators */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 my-2 bg-slate-50 rounded-lg px-3.5 text-xs text-slate-600">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Blood Pressure</span>
                      <span className="font-medium text-slate-800">{p.vitalSigns?.bp || '120/80'} mmHg</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Heart Rate</span>
                      <span className="font-medium text-slate-800">{p.vitalSigns?.pulse || 74} bpm</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Oxygen Saturation</span>
                      <span className="font-medium text-slate-800">{p.vitalSigns?.spo2 || 99}% SpO2</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Clinical Trajectory</span>
                      <span className="font-medium text-emerald-700">Cleared for Exit</span>
                    </div>
                  </div>

                  {/* Discharge Blocker Notice if present */}
                  {p.dischargeBlockers && p.dischargeBlockers.length > 0 && (
                    <div className="text-xs text-slate-600 bg-amber-50/60 border border-amber-200/60 rounded-lg p-3 my-2">
                      <span className="font-semibold text-amber-900">Current Hold Reason:</span>{' '}
                      {p.dischargeBlockers.join(' · ')}
                    </div>
                  )}

                  {/* Doctor Actions */}
                  <div className="flex items-center justify-between pt-2 text-xs">
                    <span className="text-slate-400">
                      Admitted: {p.admissionDate}
                    </span>

                    <button
                      onClick={() => executeCommand(`Why is ${p.id} delayed?`)}
                      className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Review Journey with CareOS</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Diagnostic Sign-Offs */}
      {activeTab === 'diagnostics' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-semibold text-slate-900 tracking-wide">
              Reports Awaiting Clinician Validation
            </h3>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-900 text-sm">Cardiac MRI Study (Patient P1001 · Ravi Kumar)</span>
                  <p className="text-slate-500 mt-0.5">Siemens Skyra 3.0T · Chief Radiologist Dr. Priya Varma</p>
                </div>
                <span className="text-emerald-700 font-medium">Normal Findings</span>
              </div>

              <p className="text-slate-600 leading-relaxed">
                Summary: Left ventricular ejection fraction 62% (healthy). Normal myocardial perfusion. No evidence of ischemia or fibrosis.
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                <span className="text-slate-400">Completed at 10:15 AM</span>
                <button
                  onClick={() => speakText('Cardiac MRI validated. Dr. Murthy signs off normal left ventricular ejection fraction of 62 percent.')}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs shadow-xs transition-colors"
                >
                  Confirm Clinical Sign-Off
                </button>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-900 text-sm">High-Sensitivity Troponin-T (Patient P1003 · M. Afzal)</span>
                  <p className="text-slate-500 mt-0.5">Central Pathology Laboratory · Dr. Anita Sharma</p>
                </div>
                <span className="text-emerald-700 font-medium">&lt; 5 ng/L (Negative)</span>
              </div>

              <p className="text-slate-600 leading-relaxed">
                Summary: Serum cardiac biomarkers non-elevated. CK-MB within normal reference range (14 U/L).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Rounds & Schedule */}
      {activeTab === 'schedule' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4 animate-in fade-in duration-150">
          <h3 className="text-xs font-semibold text-slate-900 tracking-wide">
            Today's Clinical Rounds & Cath Lab
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-900">Ward Rounds (Floor 1 Cardiology)</span>
                <p className="text-slate-500 mt-0.5">3 Inpatients (P1001, P1003, P1005)</p>
              </div>
              <span className="text-slate-600 font-medium">09:00 - 10:30 AM · Completed</span>
            </div>

            <div className="p-3.5 rounded-lg border border-blue-200 bg-blue-50/50 flex items-center justify-between">
              <div>
                <span className="font-semibold text-blue-900">Cath Lab: Hybrid OR 1 (Elective Angiography)</span>
                <p className="text-blue-700 mt-0.5">Patient P1008 · Pre-op labs verified</p>
              </div>
              <span className="text-blue-900 font-semibold">14:00 PM · Scheduled</span>
            </div>

            <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-900">Outpatient Consultation Clinic (OPD Bay 4)</span>
                <p className="text-slate-500 mt-0.5">6 Appointments scheduled</p>
              </div>
              <span className="text-slate-600 font-medium">16:00 - 18:30 PM</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
