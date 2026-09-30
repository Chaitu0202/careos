// CareOS Hospital Operating System — Sidebar Navigation
import React from 'react';
import { useHospital, ActivePage } from '../../state/hospitalStore';
import {
  LayoutDashboard,
  Network,
  Terminal,
  Activity,
  Users,
  GitBranch,
  Calendar,
  Clock,
  UserCheck,
  UserMinus,
  Building2,
  Stethoscope,
  HeartHandshake,
  FlaskConical,
  Scan,
  Pill,
  Receipt,
  ShieldCheck,
  BedDouble,
  Boxes,
  Truck,
  TrendingDown,
  BarChart3,
  Lightbulb,
  Workflow,
  Lock,
  FileText,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpenMobile, onCloseMobile }) => {
  const { activePage, setActivePage, bottlenecks, alerts } = useHospital();

  const activeBottlenecksCount = bottlenecks.filter((b) => b.status === 'Active').length;
  const activeAlertsCount = alerts.filter((a) => !a.resolved).length;

  const navItemClass = (page: ActivePage) =>
    `flex items-center justify-between w-full px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
      activePage === page
        ? 'bg-[#EAF2FF] text-[#2563EB] font-semibold'
        : 'text-[#172B4D] hover:bg-[#F6F9FC] hover:text-[#2563EB]'
    }`;

  const handleNav = (page: ActivePage) => {
    setActivePage(page);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/30 z-40 lg:hidden backdrop-blur-xs"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-[#E2E8F0] flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand / Logo */}
        <div className="h-14 border-b border-[#E2E8F0] px-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#2563EB] text-white flex items-center justify-center font-bold text-sm shadow-xs">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#172B4D] tracking-tight leading-none">
                CareOS
              </div>
              <div className="text-[10px] text-[#64748B] font-medium tracking-wide">
                Hospital Intelligence
              </div>
            </div>
          </div>
          <span className="text-[10px] font-semibold text-[#0F9F9A] bg-[#E8F8F6] px-1.5 py-0.5 rounded border border-[#0F9F9A]/20">
            v3.8
          </span>
        </div>

        {/* Scrollable Navigation Tree */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4 text-xs">
          {/* Group 1: COMMAND */}
          <div>
            <div className="px-2 mb-1 text-[10px] font-semibold text-[#64748B] uppercase tracking-wider">
              COMMAND
            </div>
            <div className="space-y-0.5">
              <button onClick={() => handleNav('command_center')} className={navItemClass('command_center')}>
                <div className="flex items-center gap-2">
                  <LayoutDashboard className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>Command Center</span>
                </div>
              </button>

              <button onClick={() => handleNav('agent_network')} className={navItemClass('agent_network')}>
                <div className="flex items-center gap-2">
                  <Network className="w-3.5 h-3.5 text-[#3B82F6]" />
                  <span>Live Agent Network</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
              </button>

              <button
                onClick={() => {
                  handleNav('command_center');
                  const terminal = document.getElementById('careos-command-terminal');
                  if (terminal) terminal.scrollIntoView({ behavior: 'smooth' });
                }}
                className={navItemClass('command_center')}
              >
                <div className="flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-[#64748B]" />
                  <span>AI Terminal</span>
                </div>
              </button>

              <button onClick={() => handleNav('audit')} className={navItemClass('audit')}>
                <div className="flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-[#64748B]" />
                  <span>Event Stream</span>
                </div>
              </button>
            </div>
          </div>

          {/* Group 2: PATIENT OPERATIONS */}
          <div>
            <div className="px-2 mb-1 text-[10px] font-semibold text-[#64748B] uppercase tracking-wider">
              PATIENT OPERATIONS
            </div>
            <div className="space-y-0.5">
              <button onClick={() => handleNav('patients')} className={navItemClass('patients')}>
                <div className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>Patients</span>
                </div>
                <span className="text-[10px] text-[#64748B] font-mono">248</span>
              </button>

              <button onClick={() => handleNav('patients')} className="flex items-center justify-between w-full px-2.5 py-1.5 rounded-md text-xs font-medium text-[#172B4D] hover:bg-[#F6F9FC]">
                <div className="flex items-center gap-2 pl-2">
                  <GitBranch className="w-3.5 h-3.5 text-[#0F9F9A]" />
                  <span>Patient Journeys</span>
                </div>
              </button>

              <button onClick={() => handleNav('patients')} className="flex items-center justify-between w-full px-2.5 py-1.5 rounded-md text-xs font-medium text-[#172B4D] hover:bg-[#F6F9FC]">
                <div className="flex items-center gap-2 pl-2">
                  <Calendar className="w-3.5 h-3.5 text-[#64748B]" />
                  <span>Appointments</span>
                </div>
                <span className="text-[10px] text-[#64748B] font-mono">126</span>
              </button>

              <button onClick={() => handleNav('patients')} className="flex items-center justify-between w-full px-2.5 py-1.5 rounded-md text-xs font-medium text-[#172B4D] hover:bg-[#F6F9FC]">
                <div className="flex items-center gap-2 pl-2">
                  <Clock className="w-3.5 h-3.5 text-[#D97706]" />
                  <span>Queue & Waiting</span>
                </div>
                <span className="text-[10px] text-[#D97706] font-bold">42</span>
              </button>

              <button onClick={() => handleNav('patients')} className="flex items-center justify-between w-full px-2.5 py-1.5 rounded-md text-xs font-medium text-[#172B4D] hover:bg-[#F6F9FC]">
                <div className="flex items-center gap-2 pl-2">
                  <UserCheck className="w-3.5 h-3.5 text-[#16A34A]" />
                  <span>Admissions</span>
                </div>
              </button>

              <button onClick={() => handleNav('patients')} className="flex items-center justify-between w-full px-2.5 py-1.5 rounded-md text-xs font-medium text-[#172B4D] hover:bg-[#F6F9FC]">
                <div className="flex items-center gap-2 pl-2">
                  <UserMinus className="w-3.5 h-3.5 text-[#DC2626]" />
                  <span>Discharges</span>
                </div>
                <span className="px-1.5 py-0.2 bg-[#FEECEC] text-[#DC2626] font-bold rounded text-[10px]">
                  1 Delayed
                </span>
              </button>
            </div>
          </div>

          {/* Group 3: DEPARTMENTS */}
          <div>
            <div className="px-2 mb-1 text-[10px] font-semibold text-[#64748B] uppercase tracking-wider">
              DEPARTMENTS
            </div>
            <div className="space-y-0.5">
              <button onClick={() => handleNav('departments')} className={navItemClass('departments')}>
                <div className="flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>15 Departments</span>
                </div>
                <span className="text-[10px] text-[#64748B]">Overview</span>
              </button>

              <button onClick={() => handleNav('departments')} className="flex items-center justify-between w-full px-2.5 py-1.5 rounded-md text-xs font-medium text-[#172B4D] hover:bg-[#F6F9FC]">
                <div className="flex items-center gap-2 pl-2">
                  <Scan className="w-3.5 h-3.5 text-[#DC2626]" />
                  <span>Radiology</span>
                </div>
                <span className="px-1.5 py-0.2 bg-[#FEECEC] text-[#DC2626] rounded text-[10px] font-bold">
                  8 Waiting
                </span>
              </button>

              <button onClick={() => handleNav('departments')} className="flex items-center justify-between w-full px-2.5 py-1.5 rounded-md text-xs font-medium text-[#172B4D] hover:bg-[#F6F9FC]">
                <div className="flex items-center gap-2 pl-2">
                  <Stethoscope className="w-3.5 h-3.5 text-[#64748B]" />
                  <span>Doctors (25+)</span>
                </div>
              </button>

              <button onClick={() => handleNav('departments')} className="flex items-center justify-between w-full px-2.5 py-1.5 rounded-md text-xs font-medium text-[#172B4D] hover:bg-[#F6F9FC]">
                <div className="flex items-center gap-2 pl-2">
                  <HeartHandshake className="w-3.5 h-3.5 text-[#64748B]" />
                  <span>Nursing & Wards</span>
                </div>
              </button>

              <button onClick={() => handleNav('departments')} className="flex items-center justify-between w-full px-2.5 py-1.5 rounded-md text-xs font-medium text-[#172B4D] hover:bg-[#F6F9FC]">
                <div className="flex items-center gap-2 pl-2">
                  <FlaskConical className="w-3.5 h-3.5 text-[#64748B]" />
                  <span>Laboratory</span>
                </div>
              </button>

              <button onClick={() => handleNav('departments')} className="flex items-center justify-between w-full px-2.5 py-1.5 rounded-md text-xs font-medium text-[#172B4D] hover:bg-[#F6F9FC]">
                <div className="flex items-center gap-2 pl-2">
                  <Pill className="w-3.5 h-3.5 text-[#64748B]" />
                  <span>Pharmacy</span>
                </div>
              </button>

              <button onClick={() => handleNav('departments')} className="flex items-center justify-between w-full px-2.5 py-1.5 rounded-md text-xs font-medium text-[#172B4D] hover:bg-[#F6F9FC]">
                <div className="flex items-center gap-2 pl-2">
                  <Receipt className="w-3.5 h-3.5 text-[#D97706]" />
                  <span>Billing & Accounts</span>
                </div>
              </button>

              <button onClick={() => handleNav('departments')} className="flex items-center justify-between w-full px-2.5 py-1.5 rounded-md text-xs font-medium text-[#172B4D] hover:bg-[#F6F9FC]">
                <div className="flex items-center gap-2 pl-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#64748B]" />
                  <span>Insurance & TPA</span>
                </div>
              </button>
            </div>
          </div>

          {/* Group 4: RESOURCES */}
          <div>
            <div className="px-2 mb-1 text-[10px] font-semibold text-[#64748B] uppercase tracking-wider">
              RESOURCES
            </div>
            <div className="space-y-0.5">
              <button onClick={() => handleNav('resources')} className={navItemClass('resources')}>
                <div className="flex items-center gap-2">
                  <BedDouble className="w-3.5 h-3.5 text-[#0F9F9A]" />
                  <span>Beds & Rooms (300)</span>
                </div>
                <span className="text-[10px] font-mono text-[#0F9F9A]">34 Avail</span>
              </button>

              <button onClick={() => handleNav('resources')} className="flex items-center justify-between w-full px-2.5 py-1.5 rounded-md text-xs font-medium text-[#172B4D] hover:bg-[#F6F9FC]">
                <div className="flex items-center gap-2 pl-2">
                  <Boxes className="w-3.5 h-3.5 text-[#64748B]" />
                  <span>Equipment (MRI/CT/OR)</span>
                </div>
              </button>

              <button onClick={() => handleNav('resources')} className="flex items-center justify-between w-full px-2.5 py-1.5 rounded-md text-xs font-medium text-[#172B4D] hover:bg-[#F6F9FC]">
                <div className="flex items-center gap-2 pl-2">
                  <Truck className="w-3.5 h-3.5 text-[#64748B]" />
                  <span>Transport & Stretchers</span>
                </div>
              </button>
            </div>
          </div>

          {/* Group 5: INTELLIGENCE */}
          <div>
            <div className="px-2 mb-1 text-[10px] font-semibold text-[#64748B] uppercase tracking-wider">
              INTELLIGENCE
            </div>
            <div className="space-y-0.5">
              <button onClick={() => handleNav('bottlenecks')} className={navItemClass('bottlenecks')}>
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-3.5 h-3.5 text-[#DC2626]" />
                  <span>Bottlenecks</span>
                </div>
                {activeBottlenecksCount > 0 && (
                  <span className="px-1.5 py-0.2 bg-[#FEECEC] text-[#DC2626] font-bold rounded text-[10px]">
                    {activeBottlenecksCount}
                  </span>
                )}
              </button>

              <button onClick={() => handleNav('analytics')} className={navItemClass('analytics')}>
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>Analytics</span>
                </div>
              </button>

              <button onClick={() => handleNav('alerts')} className={navItemClass('alerts')}>
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-3.5 h-3.5 text-[#D97706]" />
                  <span>Alerts & Actions</span>
                </div>
                {activeAlertsCount > 0 && (
                  <span className="px-1.5 py-0.2 bg-[#FFF6E5] text-[#D97706] font-bold rounded text-[10px]">
                    {activeAlertsCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Group 6: SYSTEMS */}
          <div>
            <div className="px-2 mb-1 text-[10px] font-semibold text-[#64748B] uppercase tracking-wider">
              SYSTEMS
            </div>
            <div className="space-y-0.5">
              <button onClick={() => handleNav('integrations')} className={navItemClass('integrations')}>
                <div className="flex items-center gap-2">
                  <Workflow className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>Suvarna ERP & n8n</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
              </button>
            </div>
          </div>

          {/* Group 7: SECURITY */}
          <div>
            <div className="px-2 mb-1 text-[10px] font-semibold text-[#64748B] uppercase tracking-wider">
              SECURITY
            </div>
            <div className="space-y-0.5">
              <button onClick={() => handleNav('audit')} className={navItemClass('audit')}>
                <div className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-[#64748B]" />
                  <span>Audit Logs</span>
                </div>
              </button>

              <button onClick={() => handleNav('integrations')} className="flex items-center justify-between w-full px-2.5 py-1.5 rounded-md text-xs font-medium text-[#172B4D] hover:bg-[#F6F9FC]">
                <div className="flex items-center gap-2 pl-2">
                  <Lock className="w-3.5 h-3.5 text-[#64748B]" />
                  <span>Agent Permissions</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-[#E2E8F0] bg-[#F6F9FC]">
          <div className="text-[11px] font-semibold text-[#172B4D]">CareOne Multispecialty</div>
          <div className="text-[10px] text-[#64748B]">Visakhapatnam, Andhra Pradesh</div>
          <div className="mt-1 flex items-center justify-between text-[10px] text-[#0F9F9A]">
            <span className="inline-flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]"></span>
              Operating Layer Active
            </span>
            <span className="font-mono text-[#64748B]">Port 3000</span>
          </div>
        </div>
      </aside>
    </>
  );
};
