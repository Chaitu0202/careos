// CareOS Hospital Operating System — Alerts Banner & Investigation Drawer
import React, { useState } from 'react';
import { useHospital } from '../../state/hospitalStore';
import { AlertItem } from '../../types/hospital';
import {
  AlertTriangle,
  ShieldAlert,
  Info,
  ChevronRight,
  Sparkles,
  X,
  CheckCircle2,
  Cpu,
} from 'lucide-react';

export const AlertsBanner: React.FC = () => {
  const { alerts, executeCommand, setSelectedAlertId, selectedAlertId, setSelectedAgentId } = useHospital();
  const [activeModalAlert, setActiveModalAlert] = useState<AlertItem | null>(null);

  const unresolved = alerts.filter((a) => !a.resolved);
  if (unresolved.length === 0) return null;

  const topAlert = unresolved[0];

  const handleInvestigateAlert = (alert: AlertItem) => {
    if (alert.title.includes('Radiology')) {
      executeCommand('How many patients are waiting in radiology and why?');
    } else if (alert.title.includes('Discharge') || alert.title.includes('P1001')) {
      executeCommand('Why is P1001 delayed?');
    } else if (alert.title.includes('ICU')) {
      executeCommand('Find available beds for a new ICU admission');
    } else {
      executeCommand(`Investigate alert: ${alert.title}`);
    }
    setActiveModalAlert(null);
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-[#D97706]/30 shadow-xs p-3 my-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#FFF6E5] text-[#D97706] flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#172B4D]">
                  {topAlert.title}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FFF6E5] text-[#D97706] border border-[#D97706]/20 uppercase">
                  {topAlert.severity}
                </span>
                <span className="text-[11px] text-[#64748B]">
                  • {topAlert.department} ({topAlert.timestamp})
                </span>
              </div>
              <p className="text-xs text-[#64748B] mt-0.5">
                {topAlert.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveModalAlert(topAlert)}
              className="px-3 py-1.5 rounded-lg bg-white border border-[#E2E8F0] hover:bg-[#F6F9FC] text-xs font-semibold text-[#172B4D] transition-colors"
            >
              Details & Evidence
            </button>

            <button
              onClick={() => handleInvestigateAlert(topAlert)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-xs transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Investigate with CareOS</span>
            </button>
          </div>
        </div>
      </div>

      {/* Alert Investigation Modal */}
      {activeModalAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F6F9FC]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#FFF6E5] text-[#D97706] flex items-center justify-center font-bold">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#172B4D]">{activeModalAlert.title}</h3>
                  <p className="text-[11px] text-[#64748B]">
                    Alert Investigation Dossier • {activeModalAlert.department}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveModalAlert(null)}
                className="p-1 rounded-md text-[#64748B] hover:text-[#172B4D] hover:bg-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              {/* Cause & Severity */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-[#F6F9FC] border border-[#E2E8F0]">
                  <div className="text-[10px] font-semibold text-[#64748B] uppercase">Severity</div>
                  <div className="text-xs font-bold text-[#D97706] mt-0.5">{activeModalAlert.severity}</div>
                </div>
                <div className="p-3 rounded-lg bg-[#F6F9FC] border border-[#E2E8F0]">
                  <div className="text-[10px] font-semibold text-[#64748B] uppercase">Responsible Unit</div>
                  <div className="text-xs font-bold text-[#172B4D] mt-0.5">{activeModalAlert.responsibleDepartment}</div>
                </div>
              </div>

              {/* Root Cause */}
              <div>
                <div className="text-[11px] font-bold text-[#172B4D] uppercase tracking-wider mb-1">
                  Root Cause
                </div>
                <div className="p-3 rounded-lg bg-[#FFF6E5]/40 border border-[#D97706]/20 text-[#172B4D] font-medium leading-relaxed">
                  {activeModalAlert.cause}
                </div>
              </div>

              {/* Affected Cohorts & Resources */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-white border border-[#E2E8F0]">
                  <div className="text-[11px] font-bold text-[#172B4D] uppercase tracking-wider mb-1">
                    Affected Patients ({activeModalAlert.affectedPatients.length})
                  </div>
                  <div className="space-y-1">
                    {activeModalAlert.affectedPatients.map((p, i) => (
                      <div key={i} className="text-xs text-[#172B4D] font-mono bg-[#F6F9FC] px-2 py-1 rounded">
                        {p}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-white border border-[#E2E8F0]">
                  <div className="text-[11px] font-bold text-[#172B4D] uppercase tracking-wider mb-1">
                    Affected Hospital Assets ({activeModalAlert.affectedResources.length})
                  </div>
                  <div className="space-y-1">
                    {activeModalAlert.affectedResources.map((r, i) => (
                      <div key={i} className="text-xs text-[#172B4D] font-mono bg-[#F6F9FC] px-2 py-1 rounded">
                        {r}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Agents Involved */}
              <div>
                <div className="text-[11px] font-bold text-[#172B4D] uppercase tracking-wider mb-1.5">
                  Agents Involved In Correlation
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {activeModalAlert.agentsInvolved.map((ag) => (
                    <button
                      key={ag}
                      onClick={() => {
                        setSelectedAgentId(ag);
                        setActiveModalAlert(null);
                      }}
                      className="px-2.5 py-1 rounded-md bg-[#EAF2FF] text-[#2563EB] font-medium border border-[#2563EB]/20 hover:bg-[#2563EB] hover:text-white transition-colors flex items-center gap-1.5"
                    >
                      <Cpu className="w-3 h-3" />
                      <span>{ag.replace(/_/g, ' ')}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Evidence */}
              <div>
                <div className="text-[11px] font-bold text-[#172B4D] uppercase tracking-wider mb-1">
                  Verified Operational Evidence
                </div>
                <div className="p-3 rounded-lg bg-[#F6F9FC] border border-[#E2E8F0] text-[#172B4D] leading-relaxed">
                  {activeModalAlert.evidence}
                </div>
              </div>

              {/* Recommended Action */}
              <div className="p-3 rounded-lg bg-[#EAF2FF] border border-[#2563EB]/30">
                <div className="text-[11px] font-bold text-[#2563EB] uppercase tracking-wider mb-1">
                  CareOS Proposed Operational Mitigation
                </div>
                <div className="text-xs text-[#172B4D] font-medium leading-relaxed">
                  {activeModalAlert.recommendedAction}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="px-6 py-4 bg-[#F6F9FC] border-t border-[#E2E8F0] flex items-center justify-end gap-2">
              <button
                onClick={() => setActiveModalAlert(null)}
                className="px-4 py-2 rounded-lg bg-white border border-[#E2E8F0] text-xs font-semibold text-[#172B4D] hover:bg-[#F6F9FC]"
              >
                Close
              </button>
              <button
                onClick={() => handleInvestigateAlert(activeModalAlert)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-xs"
              >
                <Sparkles className="w-4 h-4" />
                <span>Launch Multi-Agent Investigation</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
