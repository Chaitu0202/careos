// CareOS Hospital Operating System — Nursing & Ward Station Dashboard (Calm UX)
import React, { useState } from 'react';
import { useHospital } from '../../state/hospitalStore';
import {
  HeartHandshake,
  Activity,
  BedDouble,
  CheckCircle2,
  Clock,
  Sparkles,
  PhoneCall,
  User,
  AlertCircle,
} from 'lucide-react';

export const NurseDashboard: React.FC = () => {
  const { patients, resources, speakText, executeCommand } = useHospital();
  const [activeTab, setActiveTab] = useState<'census' | 'vitals' | 'tasks'>('census');
  const [dispatchedBeds, setDispatchedBeds] = useState<string[]>([]);

  const wardBeds = resources.filter((r) => r.type === 'Bed' || r.type === 'ICU Bed');
  const occupiedCount = wardBeds.filter((b) => b.status === 'In Use').length;
  const cleaningCount = wardBeds.filter((b) => b.status === 'Cleaning').length;
  const readyCount = wardBeds.filter((b) => b.status === 'Available').length;

  const handleHousekeepingCall = (bedId: string) => {
    setDispatchedBeds([...dispatchedBeds, bedId]);
    speakText(`Housekeeping requested for disinfection on bed ${bedId}.`);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Calm Nursing Station Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 tracking-tight">
            Floor 1 Nursing Station & Ward Management
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Sister Kavitha Rao, B.Sc Nursing · Nursing Supervisor · Floor 1 West & CCU
          </p>
        </div>

        {/* Nursing Pulse */}
        <div className="flex items-center gap-6 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Active Inpatients</span>
            <span className="font-semibold text-slate-800">{occupiedCount} Beds Occupied</span>
          </div>
          <div className="h-7 w-px bg-slate-200" />
          <div>
            <span className="text-slate-400 block text-[11px]">Beds Ready</span>
            <span className="font-semibold text-emerald-700">{readyCount} Available</span>
          </div>
          <div className="h-7 w-px bg-slate-200" />
          <div>
            <span className="text-slate-400 block text-[11px]">In Sanitization</span>
            <span className="font-semibold text-amber-700">{cleaningCount} Beds</span>
          </div>
        </div>
      </div>

      {/* Menu Bar: Progressive Disclosure Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-px">
        <button
          onClick={() => setActiveTab('census')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors ${
            activeTab === 'census'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BedDouble className="w-4 h-4" />
          <span>Bed Census & Turnover ({wardBeds.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('vitals')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors ${
            activeTab === 'vitals'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Patient Vitals Monitoring</span>
        </button>

        <button
          onClick={() => setActiveTab('tasks')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors ${
            activeTab === 'tasks'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <HeartHandshake className="w-4 h-4" />
          <span>Bedside Care Tasks</span>
        </button>
      </div>

      {/* Tab 1: Bed Census */}
      {activeTab === 'census' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {wardBeds.slice(0, 9).map((bed) => {
              const isOcc = bed.status === 'In Use';
              const isClean = bed.status === 'Cleaning';
              const isAvail = bed.status === 'Available';
              const isDispatched = dispatchedBeds.includes(bed.id);

              return (
                <div
                  key={bed.id}
                  className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors text-xs"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-slate-900">{bed.name}</span>
                    <span className={`text-[11px] font-medium ${
                      isOcc ? 'text-blue-700' : isClean ? 'text-amber-700' : 'text-emerald-700'
                    }`}>
                      {isOcc ? 'Occupied' : isClean ? 'Disinfecting' : 'Ready'}
                    </span>
                  </div>

                  <p className="text-slate-500 text-[11px] mb-3">
                    {bed.location} · {bed.type}
                    {bed.currentPatientId && (
                      <span className="block text-slate-700 font-medium mt-0.5">
                        Patient ID: {bed.currentPatientId}
                      </span>
                    )}
                  </p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-slate-400 text-[11px]">Nurse: Sister Kavitha</span>

                    {isOcc && (
                      <button
                        onClick={() => handleHousekeepingCall(bed.id)}
                        disabled={isDispatched}
                        className={`text-xs font-semibold ${
                          isDispatched ? 'text-emerald-600' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {isDispatched ? 'Dispatched ✓' : 'Dispatch Sanitization'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Patient Vitals */}
      {activeTab === 'vitals' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs divide-y divide-slate-100 animate-in fade-in duration-150">
          {patients.slice(0, 5).map((p) => (
            <div key={p.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900">{p.name}</span>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-500">{p.id}</span>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-600 font-medium">{p.roomBed || 'CCU'}</span>
                </div>
                <div className="text-slate-500 mt-1">
                  Physician: {p.doctorName} · {p.department}
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div>
                  <span className="text-slate-400 block text-[11px]">Blood Pressure</span>
                  <span className="font-medium text-slate-800">{p.vitalSigns?.bp || '120/80'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Pulse</span>
                  <span className="font-medium text-slate-800">{p.vitalSigns?.pulse || 72} bpm</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">SpO2</span>
                  <span className="font-medium text-slate-800">{p.vitalSigns?.spo2 || 99}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Bedside Tasks */}
      {activeTab === 'tasks' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3 animate-in fade-in duration-150 text-xs">
          <h3 className="text-xs font-semibold text-slate-900 tracking-wide mb-2">
            Nursing Checklist & Shift Handover
          </h3>

          <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
            <div>
              <span className="font-semibold text-slate-900">Bed 101 (Ravi Kumar) Pre-Discharge Checklist</span>
              <p className="text-slate-500 mt-0.5">Cannula removal, verify take-home medications received</p>
            </div>
            <span className="text-blue-700 font-medium">Pending TPA Clearance</span>
          </div>

          <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
            <div>
              <span className="font-semibold text-slate-900">Bed 105 (K. Venkatesh) Midday Vitals</span>
              <p className="text-slate-500 mt-0.5">Record temperature and blood glucose check at 12:00</p>
            </div>
            <span className="text-emerald-700 font-medium">Completed ✓</span>
          </div>
        </div>
      )}
    </div>
  );
};
