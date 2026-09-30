// CareOS Hospital Operating System — Patient Operations & Journey Trajectory
import React, { useState } from 'react';
import { useHospital } from '../state/hospitalStore';
import { Patient, JourneyStep } from '../types/hospital';
import {
  Users,
  GitBranch,
  Calendar,
  Clock,
  UserCheck,
  UserMinus,
  CheckCircle2,
  AlertCircle,
  Clock3,
  Sparkles,
  ArrowRight,
  Search,
} from 'lucide-react';

export const PatientOperations: React.FC = () => {
  const { patients, appointments, queues, executeCommand, setSelectedPatientId } = useHospital();
  const [activeTab, setActiveTab] = useState<'all' | 'journeys' | 'appointments' | 'queues' | 'discharges'>('all');
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedPatientForTimeline, setSelectedPatientForTimeline] = useState<Patient>(patients[0]);

  const filteredPatients = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.id.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.department.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const getStepIcon = (status: JourneyStep['status']) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />;
      case 'IN_PROGRESS':
        return <span className="w-3.5 h-3.5 rounded-full bg-[#2563EB] animate-ping" />;
      case 'BLOCKED':
        return <AlertCircle className="w-4 h-4 text-[#DC2626]" />;
      default:
        return <Clock3 className="w-4 h-4 text-[#64748B]" />;
    }
  };

  const getStepColor = (status: JourneyStep['status']) => {
    switch (status) {
      case 'COMPLETED':
        return 'border-[#16A34A] bg-[#E8F8F6] text-[#16A34A]';
      case 'IN_PROGRESS':
        return 'border-[#2563EB] bg-[#EAF2FF] text-[#2563EB] font-bold';
      case 'BLOCKED':
        return 'border-[#DC2626] bg-[#FEECEC] text-[#DC2626] font-bold';
      default:
        return 'border-[#E2E8F0] bg-[#F6F9FC] text-[#64748B]';
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Header & Tabs */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs p-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-[#172B4D]">Patient Operations Hub</h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#EAF2FF] text-[#2563EB] border border-[#2563EB]/20">
              CareOne Census: 248 Inpatients
            </span>
          </div>
          <p className="text-xs text-[#64748B] mt-0.5">
            End-to-end trajectory reconstruction, appointment scheduling, and discharge blockers
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search patient, ID, or ward..."
              className="bg-[#F6F9FC] border border-[#E2E8F0] rounded-lg pl-8 pr-3 py-1 text-xs text-[#172B4D] outline-none focus:border-[#2563EB]"
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-[#E2E8F0] pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
            activeTab === 'all'
              ? 'bg-[#2563EB] text-white shadow-xs'
              : 'text-[#64748B] hover:text-[#172B4D] hover:bg-white'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>All Inpatients ({patients.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('journeys')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
            activeTab === 'journeys'
              ? 'bg-[#2563EB] text-white shadow-xs'
              : 'text-[#64748B] hover:text-[#172B4D] hover:bg-white'
          }`}
        >
          <GitBranch className="w-3.5 h-3.5" />
          <span>Patient Journey Milestones</span>
        </button>

        <button
          onClick={() => setActiveTab('appointments')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
            activeTab === 'appointments'
              ? 'bg-[#2563EB] text-white shadow-xs'
              : 'text-[#64748B] hover:text-[#172B4D] hover:bg-white'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Appointments ({appointments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('queues')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
            activeTab === 'queues'
              ? 'bg-[#2563EB] text-white shadow-xs'
              : 'text-[#64748B] hover:text-[#172B4D] hover:bg-white'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Queue & Waiting ({queues.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('discharges')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
            activeTab === 'discharges'
              ? 'bg-[#2563EB] text-white shadow-xs'
              : 'text-[#64748B] hover:text-[#172B4D] hover:bg-white'
          }`}
        >
          <UserMinus className="w-3.5 h-3.5" />
          <span>Discharges & Blockers</span>
        </button>
      </div>

      {/* Tab 1: All Patients */}
      {activeTab === 'all' && (
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E2E8F0] bg-[#F6F9FC] text-[10px] text-[#64748B] uppercase">
                  <th className="py-2.5 px-4 font-semibold">Patient</th>
                  <th className="py-2.5 px-4 font-semibold">Department & Doctor</th>
                  <th className="py-2.5 px-4 font-semibold">Current Stage</th>
                  <th className="py-2.5 px-4 font-semibold">Bed / Location</th>
                  <th className="py-2.5 px-4 font-semibold">Status & Wait</th>
                  <th className="py-2.5 px-4 font-semibold">Dependencies</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Orchestrator Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {filteredPatients.map((p) => {
                  const isDelayed = p.status === 'Delayed';
                  const isCritical = p.status === 'Critical';

                  return (
                    <tr key={p.id} className="hover:bg-[#F6F9FC] transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-[#172B4D]">{p.name}</div>
                        <div className="text-[10px] text-[#64748B] font-mono">
                          {p.id} • {p.age}y/{p.gender}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-[#172B4D]">{p.department}</div>
                        <div className="text-[11px] text-[#64748B]">{p.doctorName}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#EAF2FF] text-[#2563EB] border border-[#2563EB]/20">
                          {p.journeyStage}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-medium text-[#172B4D]">
                        {p.roomBed || 'Holding Bay'}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
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
                          <span className="text-[11px] font-mono text-[#64748B]">
                            {p.waitingMinutes}m
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {p.dependencies.length > 0 ? (
                          <div className="space-y-0.5">
                            {p.dependencies.map((d, i) => (
                              <div
                                key={i}
                                className="text-[10px] text-[#DC2626] bg-[#FEECEC] px-1.5 py-0.5 rounded font-medium inline-block mr-1"
                              >
                                {d}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-[#16A34A] text-[11px]">Clear</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => executeCommand(`Why is ${p.id} delayed?`)}
                          className="px-2.5 py-1 rounded bg-[#EAF2FF] hover:bg-[#2563EB] text-[#2563EB] hover:text-white font-semibold text-xs transition-colors"
                        >
                          Investigate
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Patient Journey Trajectories */}
      {activeTab === 'journeys' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Patient Selector */}
          <div className="lg:col-span-4 bg-white rounded-xl border border-[#E2E8F0] shadow-xs p-3 space-y-1.5">
            <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-2">
              Select Patient Trajectory
            </div>
            {patients.map((p) => {
              const isSelected = selectedPatientForTimeline.id === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedPatientForTimeline(p)}
                  className={`w-full p-2.5 rounded-lg border text-left transition-all ${
                    isSelected
                      ? 'border-[#2563EB] bg-[#EAF2FF]'
                      : 'border-[#E2E8F0] hover:bg-[#F6F9FC]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#172B4D] text-xs">{p.name}</span>
                    <span className="font-mono text-[10px] text-[#64748B]">{p.id}</span>
                  </div>
                  <div className="text-[11px] text-[#64748B]">
                    {p.department} • Stage: {p.journeyStage}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Timeline View */}
          <div className="lg:col-span-8 bg-white rounded-xl border border-[#E2E8F0] shadow-xs p-5">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#E2E8F0] mb-4">
              <div>
                <h3 className="text-sm font-bold text-[#172B4D]">
                  {selectedPatientForTimeline.name} ({selectedPatientForTimeline.id}) — Trajectory Timeline
                </h3>
                <p className="text-xs text-[#64748B]">
                  Admitted {selectedPatientForTimeline.admissionDate} • Attending: {selectedPatientForTimeline.doctorName}
                </p>
              </div>

              <button
                onClick={() => executeCommand(`Why is ${selectedPatientForTimeline.id} delayed?`)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Investigate Bottleneck</span>
              </button>
            </div>

            {/* Stages Stepper */}
            <div className="space-y-4">
              {selectedPatientForTimeline.journeySteps.map((step, idx) => (
                <div key={step.stage} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center border ${getStepColor(
                        step.status
                      )}`}
                    >
                      {getStepIcon(step.status)}
                    </div>
                    {idx < selectedPatientForTimeline.journeySteps.length - 1 && (
                      <div className="w-0.5 h-8 bg-[#E2E8F0] my-1" />
                    )}
                  </div>

                  <div className="flex-1 pb-1 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#172B4D]">{step.stage}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#F6F9FC] border border-[#E2E8F0] text-[#64748B]">
                          Agent: {step.relatedAgent.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-[#64748B]">
                        {step.timestamp || 'Pending'}
                      </span>
                    </div>

                    <div className="text-[11px] text-[#64748B] mt-0.5">
                      Responsible: {step.owner} • Department: {step.relatedDepartment}
                    </div>

                    {step.notes && (
                      <div className="mt-1 p-2 rounded bg-[#F6F9FC] border border-[#E2E8F0] text-[11px] text-[#172B4D]">
                        {step.notes}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Appointments */}
      {activeTab === 'appointments' && (
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs p-4">
          <h3 className="text-xs font-bold text-[#172B4D] uppercase tracking-wider mb-3">
            Today's Scheduled Consultations & OPD Tokens
          </h3>
          <div className="space-y-2">
            {appointments.map((apt) => (
              <div
                key={apt.id}
                className="p-3 rounded-lg border border-[#E2E8F0] flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-[#172B4D]">
                    {apt.patientName} ({apt.patientId})
                  </div>
                  <div className="text-[11px] text-[#64748B]">
                    Doctor: {apt.doctorName} • {apt.department} • Time: {apt.timeSlot}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-2 py-1 rounded bg-[#EAF2FF] text-[#2563EB] font-mono font-bold">
                    Token: {apt.tokenNumber}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#E8F8F6] text-[#0F9F9A]">
                    {apt.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Queues & Waiting */}
      {activeTab === 'queues' && (
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs p-4">
          <h3 className="text-xs font-bold text-[#172B4D] uppercase tracking-wider mb-3">
            Department Token Queues & Estimated Wait Times
          </h3>
          <div className="space-y-2">
            {queues.map((q) => (
              <div
                key={q.id}
                className="p-3 rounded-lg border border-[#E2E8F0] flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-[#172B4D]">
                    {q.patientName} • Token: <span className="font-mono text-[#2563EB]">{q.tokenNumber}</span>
                  </div>
                  <div className="text-[11px] text-[#64748B]">
                    {q.department} • Service: {q.service} • Queue Pos: #{q.queuePosition}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-semibold text-[#DC2626]">
                    Wait: {q.actualWaitMinutes}m (Est: {q.estimatedWaitMinutes}m)
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      q.status === 'Delayed'
                        ? 'bg-[#FEECEC] text-[#DC2626]'
                        : 'bg-[#EAF2FF] text-[#2563EB]'
                    }`}
                  >
                    {q.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Discharges */}
      {activeTab === 'discharges' && (
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs p-4 space-y-3">
          <h3 className="text-xs font-bold text-[#172B4D] uppercase tracking-wider">
            Inpatient Discharge Dependency Monitor
          </h3>

          <div className="p-4 rounded-xl border border-[#DC2626]/30 bg-[#FEECEC]/30 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#172B4D] text-sm">P1001 — Ravi Kumar</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#DC2626] text-white">
                  DELAYED (52m)
                </span>
              </div>

              <button
                onClick={() => executeCommand('Why is P1001 delayed?')}
                className="px-3 py-1.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold"
              >
                Trigger Cross-Agent Investigation
              </button>
            </div>

            <p className="text-xs text-[#172B4D] leading-relaxed">
              Patient clinically cleared by Dr. S. K. Murthy. Physical exit held because MedAssist TPA discharge approval is pending (Ref: AUTH1001) and copay balance ₹7,200 is uncollected. Bed BED101 turnover blocked.
            </p>

            <div className="pt-2 border-t border-[#DC2626]/20 flex items-center justify-between text-xs text-[#64748B]">
              <span>Active Blocker Count: 2</span>
              <span>Downstream Impact: Incoming cardiac post-op patient holding in ER</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
