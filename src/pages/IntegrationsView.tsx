// CareOS Hospital Operating System — Enterprise Systems & n8n Workflows
import React from 'react';
import { useHospital } from '../state/hospitalStore';
import {
  Workflow,
  Server,
  Database,
  CheckCircle2,
  ShieldCheck,
  Zap,
  ArrowRight,
  ExternalLink,
  Layers,
} from 'lucide-react';

export const IntegrationsView: React.FC = () => {
  const integrations = [
    {
      name: 'Suvarna Hospital Information System (HIS / ERP)',
      type: 'Core Hospital ERP',
      status: 'Connected (Live)',
      latency: '14ms',
      description: 'Central database for patient admissions, master patient index (MPI), doctor rosters, and billing ledgers. CareOS agents access strictly via read-only tools and verified API contracts.',
      features: ['Patient Master Index', 'Bed Census Sync', 'Doctor Schedules', 'Outpatient Tokens'],
      securityBoundary: 'Read-only adapter; no direct SQL generation permitted by LLMs.',
    },
    {
      name: 'n8n Workflow Automation Engine',
      type: 'Deterministic Workflow Layer',
      status: 'Active (Port 5678)',
      latency: '8ms',
      description: 'Orchestrates deterministic multi-step actions across Suvarna, TPA portals, and SMS notifications following explicit Administrator approvals.',
      features: ['TPA Escalation Webhooks', 'Discharge Checklist Orchestration', 'Bed Housekeeping Dispatch'],
      securityBoundary: 'Human-in-the-loop requirement enforced for state-mutating actions.',
    },
    {
      name: 'GE Healthcare PACS / DICOM Gateway',
      type: 'Diagnostic Imaging Modality',
      status: 'Connected',
      latency: '22ms',
      description: 'Retrieves MRI/CT scan completion events, radiologist report signatures, and scanner telemetry without exposing patient PII.',
      features: ['Modality Worklist (MWL)', 'DICOM Image Metadata', 'Radiologist Sign-off Webhooks'],
      securityBoundary: 'HIPAA/NABH de-identification protocol applied on all image metadata.',
    },
    {
      name: 'MedAssist & MediBuddy TPA Portals',
      type: 'Health Insurance Gateway',
      status: 'Connected',
      latency: '85ms',
      description: 'Queries real-time insurance authorization states, query submissions, and final discharge clearance tokens.',
      features: ['Pre-auth Submission', 'Query Resolution API', 'Final Discharge Approval Token'],
      securityBoundary: 'Encrypted HL7 / FHIR data transmission over TLS 1.3.',
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs p-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-[#172B4D]">Hospital Enterprise Integrations & Workflows</h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E8F8F6] text-[#0F9F9A] border border-[#0F9F9A]/20">
              Deterministic Infrastructure
            </span>
          </div>
          <p className="text-xs text-[#64748B] mt-0.5">
            CareOS integrates above existing ERPs and workflows — never replacing core systems or running unvalidated SQL
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-[#16A34A] bg-[#E8F8F6] px-3 py-1.5 rounded-lg border border-[#0F9F9A]/30">
          <CheckCircle2 className="w-4 h-4" />
          <span>All 4 Enterprise Gateways Operational</span>
        </div>
      </div>

      {/* Integration Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {integrations.map((item) => (
          <div
            key={item.name}
            className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#2563EB]/10 text-[#2563EB] flex items-center justify-center font-bold">
                  <Server className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-[#172B4D]">{item.name}</h3>
                  <span className="text-[11px] text-[#64748B]">{item.type}</span>
                </div>
              </div>

              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E8F8F6] text-[#0F9F9A] border border-[#0F9F9A]/30">
                {item.status}
              </span>
            </div>

            <p className="text-xs text-[#172B4D] leading-relaxed">
              {item.description}
            </p>

            <div className="space-y-1.5 pt-2 border-t border-[#E2E8F0]">
              <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                Supported Capabilities
              </div>
              <div className="flex flex-wrap gap-1">
                {item.features.map((f) => (
                  <span
                    key={f}
                    className="px-2 py-0.5 rounded bg-[#F6F9FC] border border-[#E2E8F0] text-[10px] text-[#172B4D]"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-[#F6F9FC] border border-[#E2E8F0] text-[11px] text-[#64748B]">
              <span className="font-semibold text-[#172B4D]">Security Boundary:</span> {item.securityBoundary}
            </div>
          </div>
        ))}
      </div>

      {/* Workflow Diagram */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs">
        <h3 className="text-xs font-bold text-[#172B4D] uppercase tracking-wider mb-3">
          CareOS ↔ n8n ↔ Suvarna Enterprise Architecture
        </h3>

        <div className="p-4 rounded-xl bg-[#F6F9FC] border border-[#E2E8F0] font-mono text-xs text-[#172B4D] space-y-2">
          <div className="text-[#2563EB] font-bold">
            CareOS Agent (e.g. Discharge Agent)
          </div>
          <div className="pl-4 text-[#64748B]">↓ Dispatches approved tool ticket</div>
          <div className="pl-4 text-[#172B4D] font-bold">
            n8n Automation Engine (Deterministic webhook workflow)
          </div>
          <div className="pl-8 text-[#64748B]">
            ├── 1. Query Suvarna ERP Inpatient Ledger
          </div>
          <div className="pl-8 text-[#64748B]">
            ├── 2. Verify MedAssist TPA pre-authorization status
          </div>
          <div className="pl-8 text-[#64748B]">
            ├── 3. Confirm Pharmacy medication dispensation
          </div>
          <div className="pl-8 text-[#64748B]">
            └── 4. Trigger Housekeeping bed release for turnover
          </div>
          <div className="pl-4 text-[#16A34A] font-bold">
            ✓ Structured verified result returned to CareOS Orchestrator
          </div>
        </div>
      </div>
    </div>
  );
};
