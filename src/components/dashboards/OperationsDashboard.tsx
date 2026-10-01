// CareOS Hospital Operating System — Chief Operating Officer (COO) Dashboard (Calm UX)
import React, { useState } from 'react';
import { useHospital } from '../../state/hospitalStore';
import { HospitalTwinMatrix } from '../dashboard/HospitalTwinMatrix';
import {
  Building2,
  TrendingDown,
  Layers,
  BedDouble,
  Scan,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const OperationsDashboard: React.FC = () => {
  const { bottlenecks, executeCommand, setActivePage } = useHospital();
  const [activeTab, setActiveTab] = useState<'constraints' | 'wings'>('constraints');

  const activeBottlenecks = bottlenecks.filter((b) => b.status === 'Active');

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Calm Operations Executive Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 tracking-tight">
            Hospital Operations & Flow Velocity
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Vikramaditya Rao, MBA · Chief Operating Officer (COO) · Enterprise Flow
          </p>
        </div>

        {/* Operations Pulse */}
        <div className="flex items-center gap-6 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Flow Velocity</span>
            <span className="font-semibold text-slate-800">18.4 patients/hr</span>
          </div>
          <div className="h-7 w-px bg-slate-200" />
          <div>
            <span className="text-slate-400 block text-[11px]">Bed Occupancy</span>
            <span className="font-semibold text-emerald-700">82.6% · 34 Ready</span>
          </div>
          <div className="h-7 w-px bg-slate-200" />
          <div>
            <span className="text-slate-400 block text-[11px]">Constraints</span>
            <span className="font-semibold text-amber-700">{activeBottlenecks.length} Active</span>
          </div>
        </div>
      </div>

      {/* Menu Bar: Progressive Disclosure Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-px">
        <button
          onClick={() => setActiveTab('constraints')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors ${
            activeTab === 'constraints'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <TrendingDown className="w-4 h-4" />
          <span>Active Flow Constraints ({activeBottlenecks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('wings')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors ${
            activeTab === 'wings'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Hospital Capacity & Wings</span>
        </button>
      </div>

      {/* Tab 1: Constraints & Solutions */}
      {activeTab === 'constraints' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-semibold text-slate-900 tracking-wide">
              Priority Constraints Requiring Mitigation
            </h3>

            <div className="space-y-3 text-xs">
              {activeBottlenecks.map((btn) => (
                <div
                  key={btn.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="max-w-2xl">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-slate-900 text-sm">{btn.title}</span>
                      <span className="text-slate-400">·</span>
                      <span className="text-slate-500">{btn.department}</span>
                      <span className="text-slate-400">·</span>
                      <span className="text-rose-700 font-medium">Affecting {btn.affectedPatientsCount} Patients</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed">
                      {btn.rootCause}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      if (btn.id === 'BTN-01') {
                        executeCommand('How many patients are waiting in radiology and why?');
                      } else {
                        executeCommand('Why is P1001 delayed?');
                      }
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-xs transition-colors shrink-0"
                  >
                    Orchestrate Mitigation →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Wings & Capacity */}
      {activeTab === 'wings' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <HospitalTwinMatrix />
        </div>
      )}
    </div>
  );
};
