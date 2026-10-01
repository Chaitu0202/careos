// CareOS Hospital Operating System — Nursing & Ward Station Dashboard
import React, { useState } from 'react';
import { useHospital } from '../../state/hospitalStore';
import {
  HeartHandshake,
  Activity,
  BedDouble,
  CheckCircle2,
  Clock,
  AlertTriangle,
  UserCheck,
  Truck,
  Sparkles,
  PhoneCall,
  User,
} from 'lucide-react';

export const NurseDashboard: React.FC = () => {
  const { patients, resources, speakText, executeCommand } = useHospital();
  const [cleaningRequested, setCleaningRequested] = useState<string | null>(null);

  const wardBeds = resources.filter((r) => r.type === 'Bed' || r.type === 'ICU Bed');

  const handleRequestCleaning = (bedId: string) => {
    setCleaningRequested(bedId);
    speakText(`Housekeeping dispatched for disinfection on bed ${bedId}.`);
    setTimeout(() => setCleaningRequested(null), 4000);
  };

  return (
    <div className="space-y-4">
      {/* Nurse Header */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-[#16A34A] flex items-center justify-center font-bold text-lg border border-emerald-200 shadow-xs">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[#172B4D]">
                Sister Kavitha Rao, B.Sc Nursing
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-[#16A34A] border border-emerald-200 uppercase">
                Nursing Supervisor • Floor 1 West & CCU
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-0.5">
              Ward Floor 1 • Shift: Morning (07:00 - 15:30) • CareOne Multispecialty Hospital
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => executeCommand('Find available beds for a new ICU admission')}
            className="px-3.5 py-1.5 rounded-lg bg-[#2563EB] text-white text-xs font-semibold hover:bg-[#1D4ED8] transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <BedDouble className="w-3.5 h-3.5" />
            <span>Check ICU Bed Census</span>
          </button>
        </div>
      </div>

      {/* Nursing Status Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs">
          <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-1">
            Ward Inpatients
          </div>
          <div className="text-xl font-bold text-[#172B4D]">18 Patients</div>
          <p className="text-[11px] text-[#16A34A] mt-1">All vitals updated</p>
        </div>

        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs">
          <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-1">
            Beds In Sanitization
          </div>
          <div className="text-xl font-bold text-[#D97706]">2 Beds</div>
          <p className="text-[11px] text-[#64748B] mt-1">Turnover: ~25 mins</p>
        </div>

        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs">
          <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-1">
            Pending Discharge Prep
          </div>
          <div className="text-xl font-bold text-[#2563EB]">1 Patient</div>
          <p className="text-[11px] text-[#64748B] mt-1">Ravi Kumar (BED101)</p>
        </div>

        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs">
          <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-1">
            Nurse-to-Patient Ratio
          </div>
          <div className="text-xl font-bold text-[#16A34A]">1 : 4.5</div>
          <p className="text-[11px] text-[#16A34A] mt-1">NABH compliant</p>
        </div>
      </div>

      {/* Ward Bed Census & Floor Map */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-[#172B4D] uppercase tracking-wider">
              Ward Bed Census & Turnover Station
            </h3>
            <p className="text-[11px] text-[#64748B]">
              Real-time occupancy, sanitization status, and patient escort readiness
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {wardBeds.slice(0, 6).map((bed) => {
            const isOcc = bed.status === 'In Use';
            const isClean = bed.status === 'Cleaning';
            const isAvail = bed.status === 'Available';

            return (
              <div
                key={bed.id}
                className={`p-3.5 rounded-xl border text-xs transition-all ${
                  isClean
                    ? 'border-[#D97706]/40 bg-[#FFF6E5]/40'
                    : isOcc
                    ? 'border-[#2563EB]/30 bg-[#F6F9FC]'
                    : 'border-[#E2E8F0] bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-[#172B4D]">{bed.name}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      isOcc
                        ? 'bg-[#EAF2FF] text-[#2563EB]'
                        : isClean
                        ? 'bg-[#FFF6E5] text-[#D97706]'
                        : 'bg-[#E8F8F6] text-[#0F9F9A]'
                    }`}
                  >
                    {bed.status}
                  </span>
                </div>

                <div className="text-[11px] text-[#64748B] mb-2">
                  Location: {bed.location}
                  {bed.currentPatientId && (
                    <div className="font-semibold text-[#172B4D] mt-0.5">
                      Assigned: Patient {bed.currentPatientId}
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between">
                  <span className="text-[10px] text-[#64748B]">
                    Assigned: {bed.assignedStaff || 'Sister Kavitha'}
                  </span>

                  {isOcc ? (
                    <button
                      onClick={() => handleRequestCleaning(bed.id)}
                      className="text-[11px] text-[#D97706] hover:underline font-semibold"
                    >
                      {cleaningRequested === bed.id ? 'Housekeeping Alerted ✓' : 'Request Cleaning'}
                    </button>
                  ) : isAvail ? (
                    <span className="text-[11px] text-[#16A34A] font-semibold">
                      Ready for Admit ✓
                    </span>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
