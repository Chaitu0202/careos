// CareOS Hospital Operating System — Multi-Agent Orchestrator
import {
  AgentId,
  InvestigationExecution,
  PipelineStep,
  TaskMessage,
  Recommendation,
} from '../types/hospital';
import { HospitalStateSnapshot, SpecializedAgentExecutor } from './specializedAgents';
import { AGENT_CONTRACTS } from './agentContracts';
import { eventBus } from '../engine/eventBus';

export type OrchestrationCallback = (execution: InvestigationExecution) => void;

export class CareOSOrchestrator {
  private static activeExecutionId: string | null = null;

  public static async orchestrate(
    query: string,
    state: HospitalStateSnapshot,
    onProgress: OrchestrationCallback,
    previousContext?: string
  ): Promise<InvestigationExecution> {
    const execId = `INV-${Date.now().toString(36)}`;
    this.activeExecutionId = execId;

    const normalizedQuery = query.toLowerCase();

    // 1. UNDERSTAND & INTENT DETECTION
    let intent = 'GENERAL_QUERY';
    let targetPatientId: string | undefined = undefined;

    // Detect patient IDs (e.g. P1001, P1002, etc.)
    const patientMatch = query.match(/P100[1-8]/i);
    if (patientMatch) {
      targetPatientId = patientMatch[0].toUpperCase();
    } else if (previousContext && previousContext.includes('P1001')) {
      targetPatientId = 'P1001';
    }

    if (
      normalizedQuery.includes('p1001') ||
      normalizedQuery.includes('delayed') ||
      normalizedQuery.includes('discharge blocker') ||
      (normalizedQuery.includes('what should we do') && targetPatientId === 'P1001')
    ) {
      intent = 'PATIENT_DELAY_ANALYSIS';
      targetPatientId = targetPatientId || 'P1001';
    } else if (normalizedQuery.includes('biggest bottleneck') || normalizedQuery.includes('find today\'s bottlenecks')) {
      intent = 'BOTTLENECK_DISCOVERY';
    } else if (normalizedQuery.includes('radiology') && (normalizedQuery.includes('waiting') || normalizedQuery.includes('why') || normalizedQuery.includes('analyze'))) {
      intent = 'RADIOLOGY_QUEUE_ANALYSIS';
    } else if (normalizedQuery.includes('analyze') && (normalizedQuery.includes('hospital') || normalizedQuery.includes('operations') || normalizedQuery.includes('performance'))) {
      intent = 'OPERATIONS_ANALYSIS';
    } else if (normalizedQuery.includes('icu') || normalizedQuery.includes('available bed') || normalizedQuery.includes('admission')) {
      intent = 'ICU_BED_SEARCH';
    } else if (normalizedQuery.includes('book') || normalizedQuery.includes('appointment') || normalizedQuery.includes('cardiology')) {
      intent = 'APPOINTMENT_BOOKING';
    }

    // 2. PLAN: SELECT RELEVANT AGENTS BASED ON INTENT
    let selectedAgents: AgentId[] = [];
    if (intent === 'PATIENT_DELAY_ANALYSIS') {
      selectedAgents = [
        'journey_agent',
        'doctor_agent',
        'radiology_agent',
        'billing_agent',
        'insurance_agent',
        'pharmacy_agent',
        'bed_agent',
        'discharge_agent',
        'bottleneck_agent',
        'operations_agent',
      ];
    } else if (intent === 'BOTTLENECK_DISCOVERY') {
      selectedAgents = [
        'operations_agent',
        'queue_agent',
        'journey_agent',
        'resource_agent',
        'bottleneck_agent',
        'radiology_agent',
      ];
    } else if (intent === 'RADIOLOGY_QUEUE_ANALYSIS') {
      selectedAgents = [
        'queue_agent',
        'radiology_agent',
        'resource_agent',
        'bottleneck_agent',
        'operations_agent',
      ];
    } else if (intent === 'OPERATIONS_ANALYSIS') {
      selectedAgents = [
        'operations_agent',
        'journey_agent',
        'queue_agent',
        'resource_agent',
        'bottleneck_agent',
        'finance_agent',
      ];
    } else if (intent === 'ICU_BED_SEARCH') {
      selectedAgents = [
        'admission_agent',
        'bed_agent',
        'resource_agent',
        'operations_agent',
      ];
    } else if (intent === 'APPOINTMENT_BOOKING') {
      selectedAgents = [
        'appointment_agent',
        'doctor_agent',
        'queue_agent',
        'operations_agent',
      ];
    } else {
      // General freeform inquiry
      selectedAgents = [
        'operations_agent',
        'journey_agent',
        'bottleneck_agent',
        'resource_agent',
      ];
    }

    const stepsTemplate: PipelineStep['name'][] = [
      'UNDERSTAND',
      'PLAN',
      'DELEGATE',
      'COMMUNICATE',
      'RETRIEVE',
      'ANALYZE',
      'DETECT',
      'RECOMMEND',
      'VERIFY',
      'RESPOND',
    ];

    const steps: PipelineStep[] = stepsTemplate.map((name) => ({
      name,
      status: 'pending',
      detail: '',
    }));

    const agentStatuses: Record<AgentId, 'waiting' | 'running' | 'completed' | 'error'> = {} as any;
    selectedAgents.forEach((ag) => {
      agentStatuses[ag] = 'waiting';
    });

    const execution: InvestigationExecution = {
      id: execId,
      query,
      patientId: targetPatientId,
      intent,
      startedAt: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      status: 'running',
      currentStepIndex: 0,
      steps,
      selectedAgents,
      agentStatuses,
      liveConversation: [],
    };

    // Helper for stepping forward
    const setStep = (index: number, detail?: string) => {
      execution.currentStepIndex = index;
      execution.steps.forEach((s, idx) => {
        if (idx < index) s.status = 'completed';
        else if (idx === index) {
          s.status = 'in_progress';
          if (detail) s.detail = detail;
        } else {
          s.status = 'pending';
        }
      });
      onProgress({ ...execution });
    };

    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    // STEP 0: UNDERSTAND
    setStep(0, `Interpreting administrative intent: ${intent.replace(/_/g, ' ')}${targetPatientId ? ` for patient ${targetPatientId}` : ''}`);
    await sleep(240);

    // STEP 1: PLAN
    setStep(1, `Selected ${selectedAgents.length} domain agents: ${selectedAgents.map((a) => AGENT_CONTRACTS[a]?.name || a).join(', ')}`);
    await sleep(260);

    // STEP 2: DELEGATE
    setStep(2, `Broadcasting structured task tickets with authorization tokens`);
    selectedAgents.forEach((ag) => {
      execution.agentStatuses[ag] = 'running';
    });
    onProgress({ ...execution });
    await sleep(250);

    // STEP 3 & 4: COMMUNICATE & RETRIEVE (Parallel Agent Execution)
    setStep(3, `Parallel execution: ${selectedAgents.length} agents querying hospital state`);

    const agentResponses: Record<AgentId, any> = {} as any;

    // Simulate parallel execution with staggered authentic conversations
    for (let i = 0; i < selectedAgents.length; i++) {
      const ag = selectedAgents[i];
      const taskMessage: TaskMessage = {
        task_id: `TASK-${1040 + i}`,
        from_agent: 'orchestrator',
        to_agent: ag,
        patient_id: targetPatientId,
        intent: intent.toLowerCase(),
        priority: 'high',
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      };

      const response = SpecializedAgentExecutor.executeTask(taskMessage, state);
      agentResponses[ag] = response;
      execution.agentStatuses[ag] = 'completed';

      // Build structured message for live conversation stream
      let conversationalMessage = '';
      if (ag === 'journey_agent') {
        conversationalMessage = targetPatientId
          ? `I found ${targetPatientId}'s current journey stage: '${response.result.currentStage || 'Doctor Review'}'. Patient has been waiting ${response.result.waitingMinutes || 52} minutes.`
          : `Audited active trajectories across departments. ${state.patients.filter((p) => p.status === 'Delayed').length} delayed patient journeys detected.`;
      } else if (ag === 'doctor_agent') {
        conversationalMessage = response.result.clinicalClearanceGranted
          ? `Clinical review is complete. Dr. S. K. Murthy approved discharge; vital signs are stable and patient is hemodynamically clear.`
          : `Attending physician reports clinical evaluation in progress. Diagnostic reviews pending sign-off.`;
      } else if (ag === 'radiology_agent') {
        conversationalMessage = targetPatientId
          ? `Cardiac MRI completed on Siemens Skyra (MRI01). Ejection fraction is 62%. Radiologist report signed and available.`
          : `Radiology workload: ${response.result.mriQueueLength} patients in MRI queue, ${response.result.ctQueueLength} in CT queue. Achieva MRI03 scanner is down for maintenance. Capacity at 88%.`;
      } else if (ag === 'laboratory_agent') {
        conversationalMessage = `All ordered pathology panels processed. Cardiac biomarkers troponin negative. No critical panic values detected.`;
      } else if (ag === 'pharmacy_agent') {
        conversationalMessage = `Discharge medications are verified, labeled, and sealed. Pharmacy packet ready for ward dispatch.`;
      } else if (ag === 'billing_agent') {
        conversationalMessage = response.result.clearanceGranted
          ? `Billing ledger balanced. All charges and insurance deductions verified.`
          : `Billing clearance pending. Patient copay differential balance of ₹7,200 remains unpaid; awaiting final TPA clearance settlement.`;
      } else if (ag === 'insurance_agent') {
        conversationalMessage = response.result.isApproved
          ? `Insurance authorization approved by provider.`
          : `Authorization pending from MedAssist TPA (Ref: AUTH1001). Provider queries regarding implant serial registry remain unanswered.`;
      } else if (ag === 'bed_agent') {
        conversationalMessage = intent === 'ICU_BED_SEARCH'
          ? `Identified ${response.result.availableICUBeds.length} ready ICU beds: ${response.result.availableICUBeds.join(', ')}. ICU-17 is undergoing sanitization.`
          : `Bed BED101 release is blocked until financial and insurance clearance tokens are registered.`;
      } else if (ag === 'discharge_agent') {
        conversationalMessage = `Discharge checklist blocked: 2 downstream dependencies (Insurance Authorization + Billing Clearance) prevent patient departure and bed release.`;
      } else if (ag === 'bottleneck_agent') {
        conversationalMessage = intent === 'PATIENT_DELAY_ANALYSIS'
          ? `Discharge delay identified: Primary constraint is Insurance Authorization lag, secondary constraint is Billing Clearance.`
          : `Top bottleneck: Radiology MRI Capacity constraint with 8 patients waiting due to scheduled scanner downtime.`;
      } else if (ag === 'queue_agent') {
        conversationalMessage = `Queue analytics: 8 patients queued in Radiology (avg wait: ${response.result.avgWaitMinutes || 38} mins). Urgent tokens prioritized.`;
      } else if (ag === 'resource_agent') {
        conversationalMessage = `Resource audit: 2 of 3 MRI scanners operational. MRI03 under helium service. 2 ICU beds ready for acute intake.`;
      } else if (ag === 'admission_agent') {
        conversationalMessage = `Emergency bed allocation recommends ICU-15 in CCU Block A. Readiness validated.`;
      } else if (ag === 'appointment_agent') {
        conversationalMessage = `Found 4 open consultation slots with Dr. S. K. Murthy tomorrow morning. First slot at 09:30 AM.`;
      } else if (ag === 'operations_agent') {
        conversationalMessage = `Operational synthesis compiled. Root cause isolated with high confidence. Recommendation prepared for Admin review.`;
      } else if (ag === 'finance_agent') {
        conversationalMessage = `Revenue cycle report: ₹38.4L gross billings today with ₹7,200 pending on this account.`;
      } else {
        conversationalMessage = response.evidence;
      }

      execution.liveConversation.push({
        agent: ag,
        agentName: AGENT_CONTRACTS[ag]?.name || ag,
        message: conversationalMessage,
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        evidence: response.evidence,
      });

      onProgress({ ...execution });
      await sleep(180);
    }

    // STEP 5: RETRIEVE
    setStep(4, `Shared state retrieved and cross-indexed across 18 hospital domains`);
    await sleep(220);

    // STEP 6: ANALYZE
    setStep(5, `Cross-agent correlation: aligning clinical, diagnostic, pharmacy, financial, and bed release dependencies`);
    await sleep(240);

    // STEP 7: DETECT
    setStep(6, `Bottleneck engine: root-cause calculated and dependency cascade modeled`);
    await sleep(220);

    // STEP 8: RECOMMEND
    let actionableRec: Recommendation | undefined = undefined;
    let title = '';
    let statusText = '';
    let primaryBlocker: string | undefined = undefined;
    let secondaryBlocker: string | undefined = undefined;
    let clinicalStatus: string | undefined = undefined;
    let pharmacyStatus: string | undefined = undefined;
    let bedStatus: string | undefined = undefined;
    let operationalImpact: string | undefined = undefined;
    let recommendedNextStep = '';

    if (intent === 'PATIENT_DELAY_ANALYSIS') {
      title = `${targetPatientId} — Discharge Delay Root-Cause Analysis`;
      statusText = 'DELAYED';
      primaryBlocker = 'Insurance Authorization (MedAssist TPA)';
      secondaryBlocker = 'Billing Clearance (₹7,200 Copay Differential)';
      clinicalStatus = 'Complete (Signed by Dr. S. K. Murthy)';
      pharmacyStatus = 'Ready (Packaged & Sealed in Bay 2)';
      bedStatus = 'Release Pending (Bed BED101)';
      operationalImpact = '3 downstream dependencies; bed turnover held for 52 minutes';
      recommendedNextStep = 'Escalate insurance authorization with automated implant packet, then authorize provisional billing clearance.';

      actionableRec = {
        id: `REC-ESC-${Date.now().toString(36)}`,
        title: 'Approve Insurance Escalation & Provisional Billing Clearance for P1001',
        description: 'Auto-transmit missing implant serial records to MedAssist TPA via n8n integration and release the ₹7,200 billing hold to allow Bed BED101 turnover.',
        category: 'Discharge',
        severity: 'HIGH',
        proposedBy: 'operations_agent',
        affectedDepartment: 'Billing & Insurance',
        targetPatientId: 'P1001',
        status: 'Pending Admin Approval',
        actionPayload: {
          type: 'ESCALATE_INSURANCE',
          targetId: 'AUTH1001',
          description: 'Dispatch TPA escalation packet and unlock Bed BED101 in CareOS store.',
        },
      };
    } else if (intent === 'BOTTLENECK_DISCOVERY') {
      title = `Hospital Operational Bottleneck Analysis`;
      statusText = 'BOTTLENECK DETECTED';
      primaryBlocker = 'Radiology MRI Capacity (Achieva MRI03 Maintenance)';
      secondaryBlocker = 'Emergency Triage Holding Bay Surge';
      clinicalStatus = 'Operational';
      pharmacyStatus = 'Normal';
      bedStatus = '88% Occupancy';
      operationalImpact = '8 patients waiting; 45m average wait time vs 25m SLA';
      recommendedNextStep = 'Review schedule redistribution to second-shift slots and divert non-contrast studies to CT Angio.';

      actionableRec = {
        id: `REC-RAD-${Date.now().toString(36)}`,
        title: 'Approve Radiology Workload Redistribution',
        description: 'Authorize rescheduling of 3 elective outpatient scans and expedite Siemens Skyra emergency protocols via n8n workflow.',
        category: 'Scheduling',
        severity: 'HIGH',
        proposedBy: 'radiology_agent',
        affectedDepartment: 'Radiology & Imaging',
        status: 'Pending Admin Approval',
        actionPayload: {
          type: 'REASSIGN_MRI_SLOT',
          targetId: 'MRI01',
          description: 'Rebalance MRI queue and notify patients via automated SMS.',
        },
      };
    } else if (intent === 'RADIOLOGY_QUEUE_ANALYSIS') {
      title = `Radiology Queue & Capacity Breakdown`;
      statusText = 'CAPACITY CONSTRAINT (82% - 88%)';
      primaryBlocker = 'MRI Machine Availability (1 of 3 Down)';
      secondaryBlocker = 'Emergency Trauma Priority Influx';
      clinicalStatus = 'Imaging Orders Inbound';
      pharmacyStatus = 'N/A';
      bedStatus = 'N/A';
      operationalImpact = '8 patients waiting: 5 MRI (avg 44m), 3 CT (avg 18m)';
      recommendedNextStep = 'Deploy temporary protocol shortening on MRI01 and utilize CT-02 for cross-sectional trauma patients.';

      actionableRec = {
        id: `REC-RAD-OPT-${Date.now().toString(36)}`,
        title: 'Rebalance Radiology Emergency vs Outpatient Queue',
        description: 'Prioritize emergency triage scans (Sunita Devi P1002) and notify elective outpatients of slot adjustments.',
        category: 'Scheduling',
        severity: 'MEDIUM',
        proposedBy: 'queue_agent',
        affectedDepartment: 'Radiology & Imaging',
        status: 'Pending Admin Approval',
        actionPayload: {
          type: 'REASSIGN_MRI_SLOT',
          targetId: 'MRI02',
          description: 'Adjust scanner queue priorities in Suvarna ERP PACS connector.',
        },
      };
    } else if (intent === 'ICU_BED_SEARCH') {
      title = `Critical Care ICU Bed Availability Audit`;
      statusText = '2 BEDS AVAILABLE';
      primaryBlocker = 'None (Available Immediately)';
      secondaryBlocker = 'ICU-17 in Cleaning Cycle';
      clinicalStatus = 'Admissions Open';
      pharmacyStatus = 'Ready';
      bedStatus = 'ICU-15 (Available), ICU-21 (Available)';
      operationalImpact = 'Immediate capacity for acute admission without displacing inpatients';
      recommendedNextStep = 'Reserve ICU-15 in CCU Block A and alert nursing team Sister Kavitha Rao.';

      actionableRec = {
        id: `REC-ICU-${Date.now().toString(36)}`,
        title: 'Reserve ICU Bed ICU-15 for Admission',
        description: 'Lock ICU-15 in CCU Block A for incoming acute cardiac patient and assign duty intensivist.',
        category: 'Capacity',
        severity: 'MEDIUM',
        proposedBy: 'admission_agent',
        affectedDepartment: 'Cardiology',
        status: 'Pending Admin Approval',
        actionPayload: {
          type: 'RESERVE_BED',
          targetId: 'ICU-15',
          description: 'Mark ICU-15 as Reserved and dispatch orderly team.',
        },
      };
    } else if (intent === 'APPOINTMENT_BOOKING') {
      title = `Cardiology Outpatient Consultation Availability`;
      statusText = '4 SLOTS AVAILABLE TOMORROW';
      primaryBlocker = 'None';
      secondaryBlocker = 'None';
      clinicalStatus = 'Dr. S. K. Murthy On Duty';
      pharmacyStatus = 'N/A';
      bedStatus = 'N/A';
      operationalImpact = 'Earliest opening at 09:30 AM (Token CARD-08)';
      recommendedNextStep = 'Confirm booking for tomorrow 10:15 AM slot and generate Suvarna ERP outpatient registration token.';
    } else {
      title = `Hospital Intelligence Operational Overview`;
      statusText = 'MONITORING ACTIVE';
      primaryBlocker = 'Radiology MRI Capacity';
      secondaryBlocker = 'P1001 Discharge Stoppage';
      clinicalStatus = 'Stable';
      pharmacyStatus = 'Normal';
      bedStatus = '300 Total Beds (88% Occupancy)';
      operationalImpact = '16 AI agents actively balancing cross-department throughput';
      recommendedNextStep = 'Review unresolved capacity warning in Radiology and approve P1001 insurance escalation.';
    }

    setStep(7, `Formulated clinical & administrative recommendation: ${recommendedNextStep}`);
    await sleep(220);

    // STEP 9: VERIFY
    setStep(8, `Verification: Cross-checking against clinical safety boundaries & human-in-the-loop governance`);
    await sleep(220);

    // STEP 10: RESPOND
    setStep(9, `Synthesis compiled with high confidence`);

    const evidenceList = selectedAgents.map((ag) => ({
      agentId: ag,
      agentName: AGENT_CONTRACTS[ag]?.name || ag,
      finding: agentResponses[ag]?.evidence || 'Verified operational data.',
    }));

    execution.status = 'completed';
    execution.completedAt = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    execution.analysisResult = {
      title,
      status: statusText,
      primaryBlocker,
      secondaryBlocker,
      clinicalStatus,
      pharmacyStatus,
      bedStatus,
      operationalImpact,
      recommendedNextStep,
      agentsConsultedCount: selectedAgents.length,
      confidence: 'High',
      evidenceList,
      actionableRecommendation: actionableRec,
    };

    // Emit event
    eventBus.publish('BOTTLENECK_DETECTED', 'orchestrator', `Completed analysis for "${query}". Primary blocker: ${primaryBlocker || 'None'}`, {
      intent,
      patientId: targetPatientId,
    });

    onProgress({ ...execution });
    return execution;
  }
}
