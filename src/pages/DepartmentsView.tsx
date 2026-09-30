// CareOS Hospital Operating System — Departments View (15 Specialties)
import React, { useState } from 'react';
import { useHospital } from '../state/hospitalStore';
import { Department } from '../types/hospital';
import {
  Building2,
  Cpu,
  ArrowRight,
  Users,
  Clock,
  Sparkles,
  Search,
} from 'lucide-react';

export const DepartmentsView: React.FC = () => {
  const { departments, executeCommand, setSelectedAgentId } = useHospital();
  const [filter, setFilter] = useState('');

  const filteredDepts = departments.filter((d) =>
    d.name.toLowerCase().includes(filter.toLowerCase()) ||
    d.headDoctor.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs p-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-[#172B4D]">Hospital Departments & Clinical Wings</h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E8F8F6] text-[#0F9F9A] border border-[#0F9F9A]/20">
              15 Clinical Specialties
            </span>
          </div>
          <p className="text-xs text-[#64748B] mt-0.5">
            Operational loads, clinical leads, key diagnostic assets, and dedicated AI agent controllers
          </p>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search department..."
            className="bg-[#F6F9FC] border border-[#E2E8F0] rounded-lg pl-8 pr-3 py-1 text-xs text-[#172B4D] outline-none focus:border-[#2563EB]"
          />
        </div>
      </div>

      {/* Grid of 15 Departments */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredDepts.map((d) => {
          const isBottleneck = d.status === 'Bottleneck';
          const isHighLoad = d.status === 'High Load';

          return (
            <div
              key={d.id}
              className={`rounded-xl border p-4 bg-white shadow-xs transition-all hover:shadow-sm ${
                isBottleneck
                  ? 'border-[#DC2626]/40 bg-gradient-to-b from-[#FEECEC]/20 to-white'
                  : isHighLoad
                  ? 'border-[#D97706]/30 bg-gradient-to-b from-[#FFF6E5]/15 to-white'
                  : 'border-[#E2E8F0]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#172B4D]">{d.name}</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    isBottleneck
                      ? 'bg-[#FEECEC] text-[#DC2626]'
                      : isHighLoad
                      ? 'bg-[#FFF6E5] text-[#D97706]'
                      : 'bg-[#E8F8F6] text-[#0F9F9A]'
                  }`}
                >
                  {d.status}
                </span>
              </div>

              <div className="text-[11px] text-[#64748B] mb-3">
                <span className="font-semibold text-[#172B4D]">Lead:</span> {d.headDoctor}
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-2 py-2 border-y border-[#E2E8F0] text-center my-2 bg-[#F6F9FC] rounded-lg text-xs">
                <div>
                  <div className="text-[10px] text-[#64748B]">Active</div>
                  <div className="font-bold text-[#172B4D]">{d.activePatients}</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#64748B]">Waiting</div>
                  <div className={`font-bold ${d.waitingCount >= 6 ? 'text-[#DC2626]' : 'text-[#172B4D]'}`}>
                    {d.waitingCount}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-[#64748B]">Capacity</div>
                  <div className="font-bold text-[#172B4D]">{d.capacityUtilization}%</div>
                </div>
              </div>

              {/* Key Assets */}
              <div className="text-[11px] text-[#64748B] my-2">
                <span className="font-semibold text-[#172B4D]">Assets:</span> {d.keyResources.join(', ')}
              </div>

              {/* Bottom Actions */}
              <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between text-xs">
                <button
                  onClick={() => setSelectedAgentId(d.associatedAgent)}
                  className="flex items-center gap-1 text-[#2563EB] hover:underline font-medium text-[11px]"
                >
                  <Cpu className="w-3 h-3" />
                  <span>{d.associatedAgent.replace(/_/g, ' ')}</span>
                </button>

                <button
                  onClick={() => executeCommand(`Analyze operations in ${d.name}`)}
                  className="px-2.5 py-1 rounded bg-[#F6F9FC] hover:bg-[#EAF2FF] text-[#172B4D] hover:text-[#2563EB] border border-[#E2E8F0] font-semibold text-xs transition-colors"
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
