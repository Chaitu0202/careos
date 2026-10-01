// CareOS Hospital Operating System — Streamlined Sidebar Navigation
import React from 'react';
import { useHospital, ActivePage } from '../../state/hospitalStore';
import {
  LayoutDashboard,
  Network,
  Users,
  Building2,
  BedDouble,
  TrendingDown,
  BarChart3,
  Workflow,
  FileText,
  Activity,
  HeartHandshake,
  Stethoscope,
  Pill,
  Receipt,
  FileCheck2,
  Calendar,
} from 'lucide-react';

interface SidebarProps {
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpenMobile, onCloseMobile }) => {
  const {
    activePage,
    setActivePage,
    bottlenecks,
    currentUser,
  } = useHospital();

  const activeBottlenecksCount = bottlenecks.filter((b) => b.status === 'Active').length;
  const isPatientRole = currentUser?.role === 'patient';

  const navItemClass = (page: ActivePage) =>
    `flex items-center justify-between w-full px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
      activePage === page
        ? 'bg-[#2563EB] text-white shadow-xs'
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
        {/* Brand Header */}
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
            CareOne
          </span>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5 text-xs">
          {isPatientRole ? (
            /* Patient-Focused Navigation */
            <div>
              <div className="px-2 mb-2 text-[10px] font-bold text-[#0284C7] uppercase tracking-wider">
                My Patient Care Portal
              </div>
              <div className="space-y-1">
                <button onClick={() => handleNav('command_center')} className={navItemClass('command_center')}>
                  <div className="flex items-center gap-2.5">
                    <LayoutDashboard className="w-4 h-4" />
                    <span>My Care Dashboard</span>
                  </div>
                </button>

                <button onClick={() => handleNav('patients')} className={navItemClass('patients')}>
                  <div className="flex items-center gap-2.5">
                    <Activity className="w-4 h-4" />
                    <span>My Journey & Records</span>
                  </div>
                </button>
              </div>
            </div>
          ) : (
            /* Staff Navigation */
            <>
              {/* Section 1: Command & Intelligence */}
              <div>
                <div className="px-2 mb-2 text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                  Command & Intelligence
                </div>
                <div className="space-y-1">
                  <button onClick={() => handleNav('command_center')} className={navItemClass('command_center')}>
                    <div className="flex items-center gap-2.5">
                      <LayoutDashboard className="w-4 h-4" />
                      <span>Command Center</span>
                    </div>
                  </button>

                  <button onClick={() => handleNav('agent_network')} className={navItemClass('agent_network')}>
                    <div className="flex items-center gap-2.5">
                      <Network className="w-4 h-4" />
                      <span>Live Agent Network</span>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
                  </button>

                  <button onClick={() => handleNav('bottlenecks')} className={navItemClass('bottlenecks')}>
                    <div className="flex items-center gap-2.5">
                      <TrendingDown className="w-4 h-4" />
                      <span>Bottlenecks & Delays</span>
                    </div>
                    {activeBottlenecksCount > 0 && (
                      <span
                        className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                          activePage === 'bottlenecks'
                            ? 'bg-white/20 text-white'
                            : 'bg-[#FEECEC] text-[#DC2626]'
                        }`}
                      >
                        {activeBottlenecksCount}
                      </span>
                    )}
                  </button>

                  <button onClick={() => handleNav('analytics')} className={navItemClass('analytics')}>
                    <div className="flex items-center gap-2.5">
                      <BarChart3 className="w-4 h-4" />
                      <span>Operations Analytics</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Section 2: Hospital Operations */}
              <div>
                <div className="px-2 mb-2 text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                  Operations & Care
                </div>
                <div className="space-y-1">
                  <button onClick={() => handleNav('patients')} className={navItemClass('patients')}>
                    <div className="flex items-center gap-2.5">
                      <Users className="w-4 h-4" />
                      <span>Patients & Journeys</span>
                    </div>
                    <span
                      className={`text-[10px] font-mono ${
                        activePage === 'patients' ? 'text-white' : 'text-[#64748B]'
                      }`}
                    >
                      248
                    </span>
                  </button>

                  <button onClick={() => handleNav('departments')} className={navItemClass('departments')}>
                    <div className="flex items-center gap-2.5">
                      <Building2 className="w-4 h-4" />
                      <span>Departments (15 Wings)</span>
                    </div>
                  </button>

                  <button onClick={() => handleNav('resources')} className={navItemClass('resources')}>
                    <div className="flex items-center gap-2.5">
                      <BedDouble className="w-4 h-4" />
                      <span>Beds & Capital Assets</span>
                    </div>
                    <span
                      className={`text-[10px] font-mono ${
                        activePage === 'resources' ? 'text-white' : 'text-[#0F9F9A]'
                      }`}
                    >
                      34 Avail
                    </span>
                  </button>
                </div>
              </div>

              {/* Section 3: Enterprise & Governance */}
              <div>
                <div className="px-2 mb-2 text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                  Systems & Audit
                </div>
                <div className="space-y-1">
                  <button onClick={() => handleNav('integrations')} className={navItemClass('integrations')}>
                    <div className="flex items-center gap-2.5">
                      <Workflow className="w-4 h-4" />
                      <span>Suvarna ERP & n8n</span>
                    </div>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
                  </button>

                  <button onClick={() => handleNav('audit')} className={navItemClass('audit')}>
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4" />
                      <span>Audit Logs & Ledger</span>
                    </div>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[#E2E8F0] bg-[#F6F9FC]">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-semibold text-[#172B4D]">CareOne Multispecialty</span>
            <span className="font-mono text-[#0F9F9A] font-bold">300 Beds</span>
          </div>
          <div className="text-[10px] text-[#64748B] mt-0.5">
            Visakhapatnam, Andhra Pradesh
          </div>
        </div>
      </aside>
    </>
  );
};
