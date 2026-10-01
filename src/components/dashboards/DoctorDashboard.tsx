// CareOS Hospital Operating System — Attending Physician & Doctor Dashboard
import React from 'react';
import { useHospital } from '../../state/hospitalStore';
import {
  Stethoscope,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCheck2,
  Calendar,
  Sparkles,
  ArrowRight,
  Activity,
  HeartHandshake,
} from 'lucide-react';

export const DoctorDashboard: React.FC = () => {
  const { patients, appointments, executeCommand, speakText, approveRecommendation } = useHospital();

  // Filter patients under Dr. S. K. Murthy (DOC101) or Cardiology
  const myPatients = patients.filter((p) => p.doctor === 'DOC101' || p.department === 'Cardiology');
  const myAppointments = appointments.filter((a) => a.doctorId === 'DOC101');

  const handleSignDischarge = (patientId: string) => {
    executeCommand(`Why is ${patientId} delayed?`);
  };

  return (
    <div className="space-y-4">
      {/* Doctor Header */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-lg border border-purple-200 shadow-xs">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[#172B4D]">
                Dr. S. K. Murthy, MD, DM (Cardiology)
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200 uppercase">
                Senior Interventional Cardiologist
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-0.5">
              Floor 1 Inpatient Wards • CCU Wing A • CareOne Multispecialty Hospital
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => executeCommand('Book a cardiology appointment tomorrow morning')}
            className="px-3.5 py-1.5 rounded-lg bg-[#2563EB] text-white text-xs font-semibold hover:bg-[#1D4ED8] transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Consultation Schedule</span>
          </button>
        </div>
      </div>

      {/* Doctor Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs">
          <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-1">
            My Inpatients
          </div>
          <div className="text-xl font-bold text-[#172B4D]">{myPatients.length} Active</div>
          <p className="text-[11px] text-[#64748B] mt-1">CCU: 1 • Wards: {myPatients.length - 1}</p>
        </div>

        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs">
          <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-1">
            Pending Reviews
          </div>
          <div className="text-xl font-bold text-[#D97706]">2 Diagnostic</div>
          <p className="text-[11px] text-[#64748B] mt-1">MRI & Lab panels</p>
        </div>

        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs">
          <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-1">
            Discharges Delayed
          </div>
          <div className="text-xl font-bold text-[#DC2626]">1 (P1001)</div>
          <p className="text-[11px] text-[#DC2626] mt-1">Awaiting TPA approval</p>
        </div>

        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs">
          <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-1">
            Cath Lab Booked
          </div>
          <div className="text-xl font-bold text-[#0F9F9A]">1 Procedure</div>
          <p className="text-[11px] text-[#64748B] mt-1">Hybrid OR 1 at 02:00 PM</p>
        </div>
      </div>

      {/* Patient Trajectory Roster */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xs font-bold text-[#172B4D] uppercase tracking-wider">
              My Active Inpatient Roster & Clinical Sign-Offs
            </h3>
            <p className="text-[11px] text-[#64748B]">
              Direct patient trajectory review, diagnostic validation, and discharge approval
            </p>
          </div>

          <span className="text-xs text-[#2563EB] font-semibold">
            {myPatients.length} Patients Assigned
          </span>
        </div>

        <div className="space-y-3">
          {myPatients.map((p) => {
            const isDelayed = p.status === 'Delayed';
            const isCritical = p.status === 'Critical';

            return (
              <div
                key={p.id}
                className="p-4 rounded-xl border border-[#E2E8F0] hover:border-[#2563EB]/40 bg-[#F6F9FC] transition-all text-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#172B4D] text-sm">{p.name}</span>
                    <span className="font-mono text-[11px] text-[#64748B]">
                      ({p.id}) • {p.age}y/{p.gender}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#EAF2FF] text-[#2563EB]">
                      {p.roomBed || 'Holding Bay'}
                    </span>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      isDelayed
                        ? 'bg-[#FEECEC] text-[#DC2626]'
                        : isCritical
                        ? 'bg-[#DC2626] text-white'
                        : 'bg-[#E8F8F6] text-[#0F9F9A]'
                    }`}
                  >
                    {p.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-[#64748B] mb-3">
                  <div>
                    <span className="font-semibold text-[#172B4D]">Current Stage:</span> {p.journeyStage}
                  </div>
                  <div>
                    <span className="font-semibold text-[#172B4D]">Vitals:</span> BP {p.vitalSigns?.bp || '120/80'}, HR {p.vitalSigns?.pulse || 72}
                  </div>
                  <div>
                    <span className="font-semibold text-[#172B4D]">SpO2:</span> {p.vitalSigns?.spo2 || 99}%
                  </div>
                  <div>
                    <span className="font-semibold text-[#172B4D]">Waiting:</span> {p.waitingMinutes} mins
                  </div>
                </div>

                {p.dischargeBlockers && p.dischargeBlockers.length > 0 && (
                  <div className="p-2.5 rounded-lg bg-[#FFF6E5] border border-[#D97706]/30 text-[11px] text-[#172B4D] mb-3">
                    <span className="font-bold text-[#D97706]">Discharge Blocker:</span>{' '}
                    {p.dischargeBlockers.join(' • ')}
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#E2E8F0]">
                  <span className="text-[11px] text-[#64748B]">
                    Clinical Status: <span className="font-semibold text-[#16A34A]">Observation Complete & Cleared</span>
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSignDischarge(p.id)}
                      className="px-3 py-1.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-xs flex items-center gap-1 transition-colors shadow-xs"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Investigate Delay with CareOS</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
