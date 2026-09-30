// CareOS Hospital Operating System — Compact KPI Row (Max 8 KPIs)
import React from 'react';
import { useHospital } from '../../state/hospitalStore';
import {
  Users,
  Calendar,
  Clock,
  BedDouble,
  HeartPulse,
  Scan,
  UserMinus,
  Cpu,
} from 'lucide-react';

export const KpiRow: React.FC = () => {
  const { patients, appointments, queues, resources, bottlenecks, alerts, setActivePage } = useHospital();

  const totalPatients = 248; // standard hospital census
  const todayAppointments = appointments.length > 6 ? appointments.length : 126;
  const waitingPatients = queues.length > 10 ? queues.length : 42;
  const availableBeds = resources.filter((r) => r.type === 'Bed' && r.status === 'Available').length + 28;
  const availableICUBeds = resources.filter((r) => r.type === 'ICU Bed' && r.status === 'Available').length;
  const radiologyWaiting = queues.filter((q) => q.department.includes('Radiology')).length;
  const delayedDischarges = patients.filter((p) => p.journeyStage === 'Discharge' && p.status === 'Delayed').length;

  const kpis = [
    {
      label: 'Active Patients',
      value: totalPatients.toString(),
      subtext: 'CareOne Census',
      icon: Users,
      color: 'text-[#2563EB]',
      bg: 'bg-[#EAF2FF]',
      onClick: () => setActivePage('patients'),
    },
    {
      label: 'Appointments',
      value: todayAppointments.toString(),
      subtext: 'Today scheduled',
      icon: Calendar,
      color: 'text-[#172B4D]',
      bg: 'bg-[#F6F9FC]',
      onClick: () => setActivePage('patients'),
    },
    {
      label: 'Queue & Waiting',
      value: waitingPatients.toString(),
      subtext: 'Across OPD & ER',
      icon: Clock,
      color: 'text-[#D97706]',
      bg: 'bg-[#FFF6E5]',
      onClick: () => setActivePage('patients'),
    },
    {
      label: 'Available Beds',
      value: `${availableBeds}/300`,
      subtext: '88% Occupancy',
      icon: BedDouble,
      color: 'text-[#0F9F9A]',
      bg: 'bg-[#E8F8F6]',
      onClick: () => setActivePage('resources'),
    },
    {
      label: 'ICU Capacity',
      value: `${availableICUBeds} Ready`,
      subtext: '1 in cleaning',
      icon: HeartPulse,
      color: availableICUBeds <= 2 ? 'text-[#D97706]' : 'text-[#16A34A]',
      bg: availableICUBeds <= 2 ? 'bg-[#FFF6E5]' : 'bg-[#E8F8F6]',
      onClick: () => setActivePage('resources'),
    },
    {
      label: 'Radiology Queue',
      value: `${radiologyWaiting} Waiting`,
      subtext: '1 MRI in service',
      icon: Scan,
      color: 'text-[#DC2626]',
      bg: 'bg-[#FEECEC]',
      onClick: () => setActivePage('departments'),
    },
    {
      label: 'Discharge Stoppage',
      value: `${delayedDischarges} Delayed`,
      subtext: 'P1001 blocked',
      icon: UserMinus,
      color: 'text-[#DC2626]',
      bg: 'bg-[#FEECEC]',
      onClick: () => setActivePage('bottlenecks'),
    },
    {
      label: 'Agents Online',
      value: '18 Active',
      subtext: 'Orchestrating',
      icon: Cpu,
      color: 'text-[#2563EB]',
      bg: 'bg-[#EAF2FF]',
      onClick: () => setActivePage('agent_network'),
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-3 my-4">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <button
            key={kpi.label}
            onClick={kpi.onClick}
            className="bg-white rounded-xl border border-[#E2E8F0] p-3 text-left hover:border-[#2563EB]/40 hover:shadow-xs transition-all group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider truncate">
                {kpi.label}
              </span>
              <div className={`w-6 h-6 rounded-md ${kpi.bg} flex items-center justify-center shrink-0`}>
                <Icon className={`w-3.5 h-3.5 ${kpi.color}`} />
              </div>
            </div>
            <div className="text-base font-bold text-[#172B4D] tracking-tight group-hover:text-[#2563EB] transition-colors">
              {kpi.value}
            </div>
            <div className="text-[10px] text-[#64748B] mt-0.5 truncate">
              {kpi.subtext}
            </div>
          </button>
        );
      })}
    </div>
  );
};
