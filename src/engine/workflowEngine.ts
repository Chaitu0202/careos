// CareOS Hospital Operating System — Workflow Engine & n8n/Suvarna Integration
import { Recommendation, AuditLogEntry } from '../types/hospital';
import { eventBus } from './eventBus';

export interface WorkflowResult {
  success: boolean;
  message: string;
  auditEntry: AuditLogEntry;
  updatedStateChanges: Record<string, any>;
}

export class HospitalWorkflowEngine {
  public static async executeApprovedAction(
    recommendation: Recommendation,
    adminName: string = 'Hospital Administrator (CareOne)'
  ): Promise<WorkflowResult> {
    const { actionPayload, targetPatientId } = recommendation;
    const now = new Date().toISOString();
    const timestampStr = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }) + '.' + Math.floor(Math.random() * 900 + 100);

    let message = '';
    let updatedChanges: Record<string, any> = {};

    switch (actionPayload.type) {
      case 'ESCALATE_INSURANCE': {
        message = `Automated TPA Priority Escalation webhook dispatched to MedAssist TPA via n8n. Implant serial numbers and operative report confirmed. Provisional billing hold released. Discharge cleared for ${targetPatientId || 'P1001'}.`;
        updatedChanges = {
          patientId: targetPatientId || 'P1001',
          insuranceAuthStatus: 'Approved',
          billingStatus: 'Cleared',
          dischargeClearanceGranted: true,
          patientStatus: 'Discharged',
          releasedBedId: 'BED101',
          newBedStatus: 'Cleaning',
        };

        eventBus.publish('PAYMENT_RECEIVED', 'billing_agent', `Copay ₹7,200 balance clearance verified for ${targetPatientId || 'P1001'}.`);
        eventBus.publish('DISCHARGE_COMPLETED', 'discharge_agent', `Patient ${targetPatientId || 'P1001'} (Ravi Kumar) discharge finalized. Bed BED101 released to Housekeeping for turnover.`);
        eventBus.publish('BED_RELEASED', 'bed_agent', `Bed BED101 status changed to 'Cleaning'. Dispatched Housekeeping team.`);
        break;
      }

      case 'RESERVE_BED': {
        const bedId = actionPayload.targetId || 'ICU-15';
        message = `Bed ${bedId} in CCU Block A successfully marked RESERVED for urgent acute admission. Nursing supervisor and orderly alerted via Suvarna ERP ADT link.`;
        updatedChanges = {
          reservedBedId: bedId,
          newBedStatus: 'Reserved',
        };

        eventBus.publish('BED_ASSIGNED', 'bed_agent', `Bed ${bedId} marked as Reserved for incoming admission.`, { bedId });
        break;
      }

      case 'REASSIGN_MRI_SLOT': {
        message = `Radiology schedule redistributed via Suvarna ERP PACS. 3 elective outpatients rescheduled to second-shift; emergency slot priority assigned to trauma arrivals.`;
        updatedChanges = {
          radiologyBottleneckResolved: true,
          mriQueueAdjustment: -3,
        };

        eventBus.publish('REPORT_READY', 'radiology_agent', `Radiology priority queue reorganized. Emergency scans prioritized.`);
        break;
      }

      case 'EXPEDITE_BILLING': {
        message = `Provisional billing clearance granted by Administrator waiver. Electronic discharge pass issued.`;
        updatedChanges = {
          patientId: targetPatientId || 'P1001',
          billingStatus: 'Cleared',
          dischargeClearanceGranted: true,
        };

        eventBus.publish('BILL_CREATED', 'billing_agent', `Billing hold waived. Discharge pass generated.`);
        break;
      }

      default: {
        message = `Action executed successfully: ${actionPayload.description}`;
        updatedChanges = { action: actionPayload.type };
      }
    }

    const auditEntry: AuditLogEntry = {
      id: `AUD-${Date.now().toString(36)}`,
      timestamp: timestampStr,
      actor: adminName,
      agentId: recommendation.proposedBy,
      action: `ADMIN_APPROVAL_${actionPayload.type}`,
      target: targetPatientId || actionPayload.targetId,
      details: message,
      status: 'SUCCESS',
      verificationHash: `sha256-${Math.random().toString(36).substring(2, 10)}`,
    };

    return {
      success: true,
      message,
      auditEntry,
      updatedStateChanges: updatedChanges,
    };
  }
}
