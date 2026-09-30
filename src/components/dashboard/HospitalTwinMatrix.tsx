// CareOS Hospital Operating System — Hospital Operational Digital Twin
import React from 'react';
import { useHospital } from '../../state/hospitalStore';
import {
  Building2,
  Scan,
  HeartPulse,
  BedDouble,
  FlaskConical,
  Pill,
  Receipt,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Cpu,
} from 'lucide-react';

export const HospitalTwinMatrix: React.FC = () => {
  const { departments, resources, executeCommand, setSelectedAgentId, setActivePage } = useHospital();

  const handleInvestigateDepartment = (deptName: string) => {
    if (deptName.includes('Radiology')) {
      executeCommand('How many patients are waiting in radiology and why?');
    } else if (deptName.includes('Cardiology')) {
      executeCommand('Why is P1001 delayed?');
    } else {
      executeCommand(`Analyze operations in ${deptName}`);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Bottleneck':
        return 'bg-[#FEECEC] text-[#DC2626] border-[#DC2626]/20';
      case 'High Load':
        return 'bg-[#FFF6E5] text-[#D97706] border-[#D97706]/20';
      default:
        return 'bg-[#E8F8F6] text-[#0F9F9A] border-[#0F9F9A]/20';
    }
  };

  // Top critical operational sectors
  const keySectors = departments.slice(0, 6);

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs p-4">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#0F9F9A]/10 text-[#0F9F9A] flex items-center justify-center font-bold text-xs">
            <Building2 className="w-3.5 h-3.5" />
          </div>
          <h2 className="text-xs font-bold text-[#172B4D] uppercase tracking-wider">
            Hospital Operational Graph & Digital Twin
          </h2>
          <span className="text-[11px] text-[#64748B]">
            • Live Departmental Census & Resource Correlator
          </span>
        </div>

        <button
          onClick={() => setActivePage('departments')}
          className="text-xs text-[#2563EB] hover:underline font-semibold flex items-center gap-1"
        >
          <span>View All 15 Departments</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Grid of Major Department Pods */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {keySectors.map((dept) => {
          const isBottleneck = dept.status === 'Bottleneck';
          const isHighLoad = dept.status === 'High Load';

          return (
            <div
              key={dept.id}
              className={`rounded-xl border p-3.5 transition-all ${
                isBottleneck
                  ? 'border-[#DC2626]/40 bg-gradient-to-b from-[#FEECEC]/30 to-white'
                  : isHighLoad
                  ? 'border-[#D97706]/30 bg-gradient-to-b from-[#FFF6E5]/20 to-white'
                  : 'border-[#E2E8F0] bg-white hover:border-[#2563EB]/30'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#172B4D]">
                    {dept.name}
                  </span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${getStatusBadge(
                    dept.status
                  )}`}
                >
                  {dept.status}
                </span>
              </div>

              {/* Metrics Row */}
              <div className="grid grid-cols-3 gap-2 py-2 border-y border-[#E2E8F0]/70 text-center my-2 bg-[#F6F9FC]/60 rounded-md">
                <div>
                  <div className="text-[10px] text-[#64748B]">Active</div>
                  <div className="text-xs font-bold text-[#172B4D]">
                    {dept.activePatients}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-[#64748B]">Waiting</div>
                  <div
                    className={`text-xs font-bold ${
                      dept.waitingCount >= 6 ? 'text-[#DC2626]' : 'text-[#172B4D]'
                    }`}
                  >
                    {dept.waitingCount}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-[#64748B]">Capacity</div>
                  <div className="text-xs font-bold text-[#172B4D]">
                    {dept.capacityUtilization}%
                  </div>
                </div>
              </div>

              {/* Head Doctor & Key Resource */}
              <div className="text-[11px] text-[#64748B] space-y-1 mb-3">
                <div className="truncate">
                  <span className="font-semibold text-[#172B4D]">Clinical Lead:</span> {dept.headDoctor}
                </div>
                <div className="truncate">
                  <span className="font-semibold text-[#172B4D]">Key Assets:</span>{' '}
                  {dept.keyResources.slice(0, 3).join(', ')}
                </div>
              </div>

              {/* Action & Connected Agent */}
              <div className="flex items-center justify-between pt-2 border-t border-[#E2E8F0]/70">
                <button
                  onClick={() => setSelectedAgentId(dept.associatedAgent)}
                  className="flex items-center gap-1 text-[11px] font-medium text-[#2563EB] hover:underline"
                >
                  <Cpu className="w-3 h-3" />
                  <span>{dept.associatedAgent.replace(/_/g, ' ')}</span>
                </button>

                <button
                  onClick={() => handleInvestigateDepartment(dept.name)}
                  className="px-2.5 py-1 rounded bg-white hover:bg-[#EAF2FF] border border-[#E2E8F0] hover:border-[#2563EB]/40 text-xs font-semibold text-[#172B4D] hover:text-[#2563EB] transition-colors"
                >
                  Investigate →
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
