// CareOS Hospital Operating System — Resources & Assets View
import React, { useState } from 'react';
import { useHospital } from '../state/hospitalStore';
import { ResourceItem } from '../types/hospital';
import {
  BedDouble,
  Boxes,
  HeartPulse,
  Scan,
  Truck,
  Building,
  CheckCircle2,
  Clock,
  Wrench,
  Search,
  Cpu,
} from 'lucide-react';

export const ResourcesView: React.FC = () => {
  const { resources, setSelectedAgentId, executeCommand } = useHospital();
  const [selectedType, setSelectedType] = useState<string>('All');
  const [search, setSearch] = useState('');

  const types = ['All', 'Bed', 'ICU Bed', 'MRI', 'CT', 'Operation Theater', 'Wheelchair/Transport'];

  const filteredResources = resources.filter((r) => {
    const matchesType = selectedType === 'All' || r.type === selectedType;
    const matchesSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.department.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getStatusBadge = (status: ResourceItem['status']) => {
    switch (status) {
      case 'Available':
        return 'bg-[#E8F8F6] text-[#0F9F9A] border-[#0F9F9A]/30';
      case 'In Use':
        return 'bg-[#EAF2FF] text-[#2563EB] border-[#2563EB]/30';
      case 'Cleaning':
        return 'bg-[#FFF6E5] text-[#D97706] border-[#D97706]/30';
      case 'Maintenance':
        return 'bg-[#FEECEC] text-[#DC2626] border-[#DC2626]/30';
      case 'Reserved':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-[#F6F9FC] text-[#64748B] border-[#E2E8F0]';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs p-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-[#172B4D]">Hospital Resources & Capital Assets</h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E8F8F6] text-[#0F9F9A] border border-[#0F9F9A]/20">
              300 Beds • 3 MRI • 2 CT • 3 OR Suites
            </span>
          </div>
          <p className="text-xs text-[#64748B] mt-0.5">
            Real-time telemetry, maintenance cycles, current patient assignments, and utilization rates
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search resource ID or name..."
              className="bg-[#F6F9FC] border border-[#E2E8F0] rounded-lg pl-8 pr-3 py-1 text-xs text-[#172B4D] outline-none focus:border-[#2563EB]"
            />
          </div>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {types.map((t) => (
          <button
            key={t}
            onClick={() => setSelectedType(t)}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
              selectedType === t
                ? 'bg-[#2563EB] text-white shadow-xs'
                : 'bg-white border border-[#E2E8F0] text-[#64748B] hover:text-[#172B4D]'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Resource Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredResources.map((res) => (
          <div
            key={res.id}
            className={`rounded-xl border p-4 bg-white shadow-xs transition-all hover:shadow-sm ${
              res.status === 'Maintenance'
                ? 'border-[#DC2626]/30 bg-[#FEECEC]/10'
                : 'border-[#E2E8F0]'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="font-bold text-[#172B4D] text-xs">{res.name}</span>
                <div className="text-[10px] font-mono text-[#64748B]">{res.id}</div>
              </div>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${getStatusBadge(
                  res.status
                )}`}
              >
                {res.status}
              </span>
            </div>

            <div className="text-xs text-[#64748B] space-y-1 mb-3">
              <div>
                <span className="font-semibold text-[#172B4D]">Department:</span> {res.department}
              </div>
              <div>
                <span className="font-semibold text-[#172B4D]">Location:</span> {res.location}
              </div>
              {res.currentPatientId && (
                <div>
                  <span className="font-semibold text-[#172B4D]">Occupant:</span>{' '}
                  <span className="font-mono text-[#2563EB] font-bold">{res.currentPatientId}</span>
                </div>
              )}
              {res.assignedStaff && (
                <div>
                  <span className="font-semibold text-[#172B4D]">Operator:</span> {res.assignedStaff}
                </div>
              )}
            </div>

            {/* Utilization Bar */}
            <div className="py-2 border-t border-[#E2E8F0]">
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="text-[#64748B]">Capacity Utilization</span>
                <span className="font-bold text-[#172B4D]">{res.utilizationRate}%</span>
              </div>
              <div className="w-full bg-[#E2E8F0] h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    res.utilizationRate > 85
                      ? 'bg-[#DC2626]'
                      : res.utilizationRate > 60
                      ? 'bg-[#2563EB]'
                      : 'bg-[#16A34A]'
                  }`}
                  style={{ width: `${res.utilizationRate}%` }}
                />
              </div>
            </div>

            {/* Bottom: Connected Agent */}
            <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between text-xs">
              <button
                onClick={() => setSelectedAgentId(res.connectedAgent)}
                className="flex items-center gap-1 text-[11px] text-[#2563EB] hover:underline font-medium"
              >
                <Cpu className="w-3 h-3" />
                <span>{res.connectedAgent.replace(/_/g, ' ')}</span>
              </button>

              {res.type.includes('Bed') && res.status === 'Available' && (
                <button
                  onClick={() => executeCommand(`Find available beds for a new ICU admission`)}
                  className="px-2 py-0.5 rounded bg-[#EAF2FF] text-[#2563EB] font-semibold text-[11px] hover:bg-[#2563EB] hover:text-white transition-colors"
                >
                  Allocate Bed
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
