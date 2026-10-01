// CareOS Hospital Operating System — Administrator Master Command Dashboard (Calm UX)
import React, { useState } from 'react';
import { useHospital } from '../../state/hospitalStore';
import { CommandTerminal } from '../command/CommandTerminal';
import { ExecutionPipeline } from '../command/ExecutionPipeline';
import { HospitalTwinMatrix } from '../dashboard/HospitalTwinMatrix';
import { AgentActivityFeed } from '../dashboard/AgentActivityFeed';
import {
  Sparkles,
  TrendingDown,
  Layers,
  Activity,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ChevronRight,
} from 'lucide-react';

interface AdminDashboardProps {
  onOpenVoice: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onOpenVoice }) => {
  const { bottlenecks, executeCommand, setActivePage, currentInvestigation, patients } = useHospital();
  const [activeTab, setActiveTab] = useState<'command' | 'twin' | 'constraints' | 'feed'>('command');

  const activeBottlenecks = bottlenecks.filter((b) => b.status === 'Active');
  const delayedPatients = patients.filter((p) => p.status === 'Delayed');

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Calm Executive Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 tracking-tight">
            Hospital Command & Operations
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Dr. Rajeshwari Varma · Medical Director · CareOne Multispecialty (300 beds)
          </p>
        </div>

        {/* 3 Calm High-Level Indicators */}
        <div className="flex items-center gap-6 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Bed Census</span>
            <span className="font-semibold text-slate-800">82.6% · 248 Inpatients</span>
          </div>
          <div className="h-7 w-px bg-slate-200" />
          <div>
            <span className="text-slate-400 block text-[11px]">Discharge Holds</span>
            <span className="font-semibold text-amber-700">{delayedPatients.length} Under Review</span>
          </div>
          <div className="h-7 w-px bg-slate-200" />
          <div>
            <span className="text-slate-400 block text-[11px]">Agent Network</span>
            <span className="font-semibold text-emerald-700 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              18 Agents Active
            </span>
          </div>
        </div>
      </div>

      {/* Menu Bar: Progressive Disclosure Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-px overflow-x-auto">
        <button
          onClick={() => setActiveTab('command')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'command'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Orchestration & Command</span>
          {currentInvestigation && (
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('constraints')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'constraints'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <TrendingDown className="w-4 h-4" />
          <span>Active Constraints</span>
          {activeBottlenecks.length > 0 && (
            <span className="text-[10px] font-semibold text-rose-600">
              ({activeBottlenecks.length})
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('twin')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'twin'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Hospital Capacity & Wings</span>
        </button>

        <button
          onClick={() => setActiveTab('feed')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'feed'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Agent Activity Stream</span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'command' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Main Natural Language Command Terminal */}
          <CommandTerminal onOpenVoice={onOpenVoice} />

          {/* Observable Multi-Agent Investigation Pipeline */}
          <ExecutionPipeline />

          {/* Quick Context Card: Today's Priorities */}
          {!currentInvestigation && (
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <h3 className="text-xs font-semibold text-slate-900 tracking-wide mb-3">
                Current Operational Focus
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="font-semibold text-slate-900 mb-1">
                    Cardiology Discharge Delay (Patient P1001)
                  </div>
                  <p className="text-slate-600 leading-relaxed mb-3">
                    Bed 101 occupied past scheduled discharge due to MedAssist TPA approval hold. Clinical sign-off is complete.
                  </p>
                  <button
                    onClick={() => executeCommand('Why is P1001 delayed?')}
                    className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
                  >
                    <span>Investigate Delay with CareOS</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="font-semibold text-slate-900 mb-1">
                    Radiology MRI Throughput
                  </div>
                  <p className="text-slate-600 leading-relaxed mb-3">
                    Scanner MRI03 undergoing scheduled helium top-up. 8 outpatients queued on Skyra MRI01.
                  </p>
                  <button
                    onClick={() => executeCommand('How many patients are waiting in radiology and why?')}
                    className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
                  >
                    <span>Analyze Radiology Queue</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'constraints' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Active Constraints & Bottlenecks
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Proactively detected operational impediments across departments
                </p>
              </div>
              <button
                onClick={() => setActivePage('bottlenecks')}
                className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
              >
                <span>Full Bottleneck Ledger</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {activeBottlenecks.map((btn) => (
                <div
                  key={btn.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors text-xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900 text-sm">{btn.title}</span>
                      <span className="text-slate-500 font-medium">·</span>
                      <span className="text-slate-600">{btn.department}</span>
                    </div>
                    <span className="text-rose-700 font-medium">
                      High Impact · {btn.affectedPatientsCount} Patients
                    </span>
                  </div>

                  <p className="text-slate-600 leading-relaxed mb-3">
                    {btn.rootCause}
                  </p>

                  <div className="flex items-center justify-between pt-2.5 border-t border-slate-200">
                    <span className="text-slate-500">
                      Identified by {btn.detectedBy.replace(/_/g, ' ')}
                    </span>
                    <button
                      onClick={() => {
                        setActiveTab('command');
                        if (btn.id === 'BTN-01') {
                          executeCommand('How many patients are waiting in radiology and why?');
                        } else {
                          executeCommand('Why is P1001 delayed?');
                        }
                      }}
                      className="text-blue-600 font-semibold hover:underline flex items-center gap-1"
                    >
                      <span>Launch Resolution</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'twin' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <HospitalTwinMatrix />
        </div>
      )}

      {activeTab === 'feed' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <AgentActivityFeed />
        </div>
      )}
    </div>
  );
};
