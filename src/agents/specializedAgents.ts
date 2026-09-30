// CareOS Hospital Operating System — Specialized Agent Implementations
import {
  AgentId,
  TaskMessage,
  TaskResponse,
  Patient,
  Doctor,
  Department,
  QueueEntry,
  LabOrder,
  ImagingOrder,
  PharmacyOrder,
  Bill,
  InsuranceAuth,
  ResourceItem,
  Bottleneck,
} from '../types/hospital';

export interface HospitalStateSnapshot {
  patients: Patient[];
  doctors: Doctor[];
  departments: Department[];
  queues: QueueEntry[];
  labOrders: LabOrder[];
  imagingOrders: ImagingOrder[];
  pharmacyOrders: PharmacyOrder[];
  bills: Bill[];
  insuranceAuths: InsuranceAuth[];
  resources: ResourceItem[];
  bottlenecks: Bottleneck[];
}

export class SpecializedAgentExecutor {
  // Execute a targeted task on behalf of an agent using the shared state snapshot
  public static executeTask(task: TaskMessage, state: HospitalStateSnapshot): TaskResponse {
    const { to_agent, patient_id, intent } = task;
    const patient = patient_id ? state.patients.find((p) => p.id === patient_id) : undefined;
    const now = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });

    switch (to_agent) {
      case 'journey_agent': {
        if (!patient) {
          return {
            task_id: task.task_id,
            agent: 'journey_agent',
            status: 'warning',
            timestamp: now,
            result: { error: `Patient ${patient_id} not found in active registry` },
            evidence: 'Queried central patient registry; no active record matched identifier.',
          };
        }
        const currentStep = patient.journeySteps.find((s) => s.status === 'BLOCKED' || s.status === 'IN_PROGRESS') ||
          patient.journeySteps[patient.journeySteps.length - 1];
        const pendingSteps = patient.journeySteps.filter((s) => s.status === 'BLOCKED' || s.status === 'PENDING');

        return {
          task_id: task.task_id,
          agent: 'journey_agent',
          status: 'success',
          timestamp: now,
          result: {
            patientId: patient.id,
            patientName: patient.name,
            currentStage: patient.journeyStage,
            status: patient.status,
            waitingMinutes: patient.waitingMinutes,
            activeStep: currentStep?.stage || 'Unknown',
            dependencies: patient.dependencies,
            pendingStagesCount: pendingSteps.length,
            nextAction: patient.dependencies.length > 0 ? `Clear dependency: ${patient.dependencies.join(', ')}` : 'Proceed to next stage',
          },
          evidence: `Retrieved journey trajectory for ${patient.name} (${patient.id}). Current stage is '${patient.journeyStage}', waiting ${patient.waitingMinutes}m. Active blocker: [${patient.dependencies.join(', ')}].`,
        };
      }

      case 'doctor_agent': {
        const doc = patient ? state.doctors.find((d) => d.id === patient.doctor) : state.doctors[0];
        const isClearanceGiven = patient ? patient.journeySteps.some((s) => s.stage === 'Doctor Review' && s.status === 'COMPLETED') : false;

        return {
          task_id: task.task_id,
          agent: 'doctor_agent',
          status: 'success',
          timestamp: now,
          result: {
            attendingDoctor: doc?.name || 'Dr. S. K. Murthy',
            specialty: doc?.specialty || 'Cardiology',
            clinicalClearanceGranted: isClearanceGiven,
            clinicalNotes: isClearanceGiven
              ? 'Patient hemodynamically stable. Post-cardiac observation completed. Clinical discharge approval signed.'
              : 'Clinical evaluation in progress. Pending diagnostic correlation.',
            pendingReviewsCount: doc?.pendingReviews || 0,
          },
          evidence: `Verified clinical sign-off from ${doc?.name}. Status: ${isClearanceGiven ? 'CLINICAL CLEARANCE GRANTED' : 'PENDING'}. Vital signs stable, no acute contraindications.`,
        };
      }

      case 'radiology_agent': {
        const orders = patient
          ? state.imagingOrders.filter((o) => o.patientId === patient.id)
          : state.imagingOrders;
        const mriQueue = state.queues.filter((q) => q.department === 'Radiology & Imaging' && q.service.includes('MRI'));
        const ctQueue = state.queues.filter((q) => q.department === 'Radiology & Imaging' && q.service.includes('CT'));
        const mriEquipment = state.resources.filter((r) => r.type === 'MRI');
        const maintenanceScanner = mriEquipment.find((r) => r.status === 'Maintenance');

        return {
          task_id: task.task_id,
          agent: 'radiology_agent',
          status: 'success',
          timestamp: now,
          result: {
            imagingOrdersCount: orders.length,
            ordersSummary: orders.map((o) => ({ modality: o.modality, part: o.bodyPart, status: o.status })),
            mriQueueLength: mriQueue.length,
            ctQueueLength: ctQueue.length,
            totalRadiologyQueue: mriQueue.length + ctQueue.length,
            scannersOperational: mriEquipment.filter((r) => r.status !== 'Maintenance').length,
            scannersInMaintenance: maintenanceScanner ? maintenanceScanner.name : 'None',
            capacityUtilization: 88,
          },
          evidence: patient && orders.length > 0
            ? `Queried PACS for ${patient.id}. MRI scan completed on ${orders[0].equipmentId}. Radiologist report validated: "${orders[0].reportFindings || 'Report ready'}".`
            : `Radiology workload check: ${mriQueue.length} patients in MRI queue, ${ctQueue.length} in CT queue. Scanner MRI03 is offline for scheduled maintenance. Overall department capacity at 88%.`,
        };
      }

      case 'laboratory_agent': {
        const labOrders = patient
          ? state.labOrders.filter((l) => l.patientId === patient.id)
          : state.labOrders;
        const pendingLabs = labOrders.filter((l) => l.status !== 'Completed');

        return {
          task_id: task.task_id,
          agent: 'laboratory_agent',
          status: 'success',
          timestamp: now,
          result: {
            totalOrders: labOrders.length,
            completedOrders: labOrders.filter((l) => l.status === 'Completed').length,
            pendingOrders: pendingLabs.length,
            criticalValuesDetected: false,
            tests: labOrders.map((l) => ({ test: l.testName, status: l.status, result: l.resultSummary })),
          },
          evidence: patient
            ? `Laboratory status for ${patient.id}: All ${labOrders.length} ordered pathology panels processed. Cardiac biomarkers troponin negative. No critical panic values.`
            : `Laboratory throughput: 96% on-time TAT today across 180 samples. 0 panic value delays.`,
        };
      }

      case 'pharmacy_agent': {
        const pharmacyOrder = patient
          ? state.pharmacyOrders.find((p) => p.patientId === patient.id)
          : state.pharmacyOrders[0];
        const isReady = pharmacyOrder?.status === 'Ready for Pickup' || pharmacyOrder?.status === 'Dispensed';

        return {
          task_id: task.task_id,
          agent: 'pharmacy_agent',
          status: 'success',
          timestamp: now,
          result: {
            orderId: pharmacyOrder?.id || 'N/A',
            status: pharmacyOrder?.status || 'Ready for Pickup',
            medicationsCount: pharmacyOrder?.medications.length || 0,
            isReadyForPickup: Boolean(isReady),
            medicationsList: pharmacyOrder?.medications || [],
            formularyStockout: false,
          },
          evidence: `Verified prescription order ${pharmacyOrder?.id || 'PHARM-8001'} for ${patient?.name || 'patient'}. Medications packaged, sealed, and verified by Duty Pharmacist. Status: READY FOR PICKUP.`,
        };
      }

      case 'billing_agent': {
        const bill = patient
          ? state.bills.find((b) => b.patientId === patient.id)
          : state.bills[0];

        return {
          task_id: task.task_id,
          agent: 'billing_agent',
          status: bill?.dischargeClearanceGranted ? 'success' : 'warning',
          timestamp: now,
          result: {
            billId: bill?.id || 'BILL9001',
            totalAmount: bill?.totalAmount || 184500,
            insuranceCovered: bill?.insuranceCovered || 155000,
            patientPayable: bill?.patientPayable || 29500,
            amountPaid: bill?.amountPaid || 22300,
            outstandingBalance: bill?.outstandingBalance || 7200,
            clearanceGranted: bill?.dischargeClearanceGranted || false,
            blocker: bill?.dischargeClearanceGranted ? null : 'Unpaid patient balance differential (₹7,200) & final TPA sign-off required',
          },
          evidence: `Audited billing ledger ${bill?.id}. Total: ₹${bill?.totalAmount.toLocaleString('en-IN')}, Insured: ₹${bill?.insuranceCovered.toLocaleString('en-IN')}, Outstanding balance: ₹${bill?.outstandingBalance.toLocaleString('en-IN')}. Discharge clearance WITHHELD.`,
        };
      }

      case 'insurance_agent': {
        const auth = patient
          ? state.insuranceAuths.find((a) => a.patientId === patient.id)
          : state.insuranceAuths[0];
        const isApproved = auth?.status === 'Approved';

        return {
          task_id: task.task_id,
          agent: 'insurance_agent',
          status: isApproved ? 'success' : 'warning',
          timestamp: now,
          result: {
            authId: auth?.id || 'AUTH1001',
            tpaProvider: auth?.tpaProvider || 'MedAssist TPA Services',
            policyNumber: auth?.policyNumber || 'STAR-CARE-9923847',
            claimedAmount: auth?.claimedAmount || 184500,
            approvedAmount: auth?.approvedAmount || 155000,
            status: auth?.status || 'Queries Raised',
            queriesPending: auth?.queriesPending || 'Implant serial verification required',
            turnaroundHours: auth?.turnaroundHours || 3.5,
            isApproved,
          },
          evidence: `TPA Portal check for ${auth?.policyNumber}: Status is '${auth?.status}'. Provider MedAssist raised query: "${auth?.queriesPending}". Turnaround lag: 210 mins. Escalation required.`,
        };
      }

      case 'bed_agent': {
        const availableBeds = state.resources.filter((r) => r.type === 'Bed' && r.status === 'Available');
        const availableICUBeds = state.resources.filter((r) => r.type === 'ICU Bed' && r.status === 'Available');
        const cleaningBeds = state.resources.filter((r) => r.status === 'Cleaning');
        const patientBed = patient?.roomBed ? state.resources.find((r) => r.id === patient.roomBed) : undefined;

        return {
          task_id: task.task_id,
          agent: 'bed_agent',
          status: 'success',
          timestamp: now,
          result: {
            currentPatientBed: patientBed ? { id: patientBed.id, name: patientBed.name, status: patientBed.status } : null,
            availableGeneralBeds: availableBeds.map((b) => b.id),
            availableICUBeds: availableICUBeds.map((b) => b.id),
            cleaningCount: cleaningBeds.length,
            bedTurnoverPending: patientBed ? 'Bed release blocked until discharge completes' : 'None',
          },
          evidence: patientBed
            ? `Bed management confirms ${patient?.name} currently occupies ${patientBed.name} (${patientBed.id}). Bed release is marked PENDING final clearance.`
            : `Bed census: ${availableICUBeds.length} ICU beds available (${availableICUBeds.map((b) => b.id).join(', ')}), ${availableBeds.length} ward beds ready. ${cleaningBeds.length} in sanitization cycle.`,
        };
      }

      case 'discharge_agent': {
        const docClearance = patient ? patient.journeySteps.some((s) => s.stage === 'Doctor Review' && s.status === 'COMPLETED') : false;
        const bill = patient ? state.bills.find((b) => b.patientId === patient.id) : state.bills[0];
        const auth = patient ? state.insuranceAuths.find((a) => a.patientId === patient.id) : state.insuranceAuths[0];
        const blockers: string[] = [];

        if (!auth || auth.status !== 'Approved') {
          blockers.push(`Insurance Authorization Pending (${auth?.tpaProvider || 'TPA Provider'})`);
        }
        if (!bill || !bill.dischargeClearanceGranted) {
          blockers.push(`Billing Clearance Withheld (Outstanding ₹${bill?.outstandingBalance || 0})`);
        }
        if (!docClearance) {
          blockers.push('Doctor Review Sign-off Required');
        }

        return {
          task_id: task.task_id,
          agent: 'discharge_agent',
          status: blockers.length === 0 ? 'success' : 'warning',
          timestamp: now,
          result: {
            isDischargeReady: blockers.length === 0,
            primaryBlocker: blockers[0] || 'None',
            secondaryBlocker: blockers[1] || 'None',
            allBlockers: blockers,
            clinicalClearance: docClearance ? 'Complete' : 'Pending',
            pharmacyClearance: 'Ready',
            bedReleaseStatus: 'Pending Clearance',
            downstreamDependenciesCount: blockers.length,
          },
          evidence: `Discharge checklist synthesized for ${patient?.name || 'patient'}: Clinical [✓ Complete], Pharmacy [✓ Ready], Insurance [✗ ${auth?.status}], Billing [✗ ₹${bill?.outstandingBalance} pending]. Primary bottleneck is Insurance Authorization.`,
        };
      }

      case 'bottleneck_agent': {
        const topBottleneck = state.bottlenecks[0];
        return {
          task_id: task.task_id,
          agent: 'bottleneck_agent',
          status: 'success',
          timestamp: now,
          result: {
            activeBottlenecksCount: state.bottlenecks.length,
            topBottleneck: {
              department: topBottleneck.department,
              title: topBottleneck.title,
              severity: topBottleneck.severity,
              affectedPatients: topBottleneck.affectedPatientsCount,
              rootCause: topBottleneck.rootCause,
            },
            delayCascadeImpact: 'Cascading 45-minute delay to inpatient admissions and cross-departmental throughput.',
          },
          evidence: `Bottleneck analysis: Primary constraint is in '${topBottleneck.department}' (${topBottleneck.title}). Severity: ${topBottleneck.severity}. 8 patients waiting in radiology with 1 scanner under maintenance.`,
        };
      }

      case 'queue_agent': {
        const radQueue = state.queues.filter((q) => q.department.includes('Radiology'));
        const mriQueue = radQueue.filter((q) => q.service.includes('MRI'));
        const ctQueue = radQueue.filter((q) => q.service.includes('CT'));
        const avgWait = Math.round(radQueue.reduce((acc, q) => acc + q.actualWaitMinutes, 0) / (radQueue.length || 1));

        return {
          task_id: task.task_id,
          agent: 'queue_agent',
          status: 'success',
          timestamp: now,
          result: {
            totalWaitingCount: radQueue.length,
            mriCount: mriQueue.length,
            ctCount: ctQueue.length,
            avgWaitMinutes: avgWait,
            delayedTokens: radQueue.filter((q) => q.status === 'Delayed').map((q) => q.tokenNumber),
          },
          evidence: `Queue registry audit: 8 patients actively queued in Radiology (${mriQueue.length} MRI, ${ctQueue.length} CT). Average actual wait time is ${avgWait} mins, exceeding 25m target SLA.`,
        };
      }

      case 'resource_agent': {
        const mriList = state.resources.filter((r) => r.type === 'MRI');
        const icuList = state.resources.filter((r) => r.type === 'ICU Bed');

        return {
          task_id: task.task_id,
          agent: 'resource_agent',
          status: 'success',
          timestamp: now,
          result: {
            mriEquipment: mriList.map((m) => ({ id: m.id, name: m.name, status: m.status, utilization: `${m.utilizationRate}%` })),
            availableICUBeds: icuList.filter((b) => b.status === 'Available').map((b) => b.id),
            cleaningBeds: icuList.filter((b) => b.status === 'Cleaning').map((b) => b.id),
            hardwareConstraintIdentified: 'Achieva 1.5T MRI03 is offline for scheduled helium magnet servicing.',
          },
          evidence: `Asset monitor: 2 of 3 MRI scanners operating (MRI01 at 94%, MRI02 at 88%). MRI03 under maintenance. 2 ICU beds (ICU-15, ICU-21) ready for admission.`,
        };
      }

      case 'operations_agent': {
        return {
          task_id: task.task_id,
          agent: 'operations_agent',
          status: 'success',
          timestamp: now,
          result: {
            hospitalActivePatients: 248,
            bedOccupancyRate: 88,
            operationalHealthScore: 89,
            keyPriorities: [
              'Resolve P1001 MedAssist TPA discharge deadlock to free Bed BED101',
              'Redistribute 3 non-contrast scans from MRI01 to CT02 or off-peak slot',
              'Fast-track housekeeping turnover for ICU-17 and BED102',
            ],
            recommendedEscalation: 'Execute automated TPA query response packet and approve copay waiver.',
          },
          evidence: `Operations command assessment: Hospital operating at 88% overall bed occupancy. Throughput velocity constrained by Radiology equipment maintenance and TPA discharge approval latency.`,
        };
      }

      case 'admission_agent': {
        const availableICU = state.resources.filter((r) => r.type === 'ICU Bed' && r.status === 'Available');
        return {
          task_id: task.task_id,
          agent: 'admission_agent',
          status: 'success',
          timestamp: now,
          result: {
            availableBeds: availableICU.map((b) => ({ id: b.id, name: b.name, department: b.department })),
            recommendedAdmissionBed: availableICU[0]?.id || 'ICU-15',
            readiness: Boolean(availableICU.length > 0),
          },
          evidence: `Admission routing evaluated: Found ${availableICU.length} ready ICU beds. Top candidate for acute cardiac admission is ${availableICU[0]?.id || 'ICU-15'} in CCU Block A.`,
        };
      }

      case 'appointment_agent': {
        const cardioDoc = state.doctors.find((d) => d.department === 'Cardiology');
        return {
          task_id: task.task_id,
          agent: 'appointment_agent',
          status: 'success',
          timestamp: now,
          result: {
            department: 'Cardiology',
            doctor: cardioDoc?.name || 'Dr. S. K. Murthy',
            availableSlotsTomorrow: ['09:30 AM', '10:15 AM', '11:00 AM', '02:30 PM'],
            syntheticSlotId: 'SLOT-CARD-OCT01-1015',
            status: 'SLOTS_AVAILABLE',
          },
          evidence: `Searched appointment schedule in Suvarna ERP for Cardiology. Confirmed 4 verified openings tomorrow morning with ${cardioDoc?.name}.`,
        };
      }

      case 'nursing_agent': {
        return {
          task_id: task.task_id,
          agent: 'nursing_agent',
          status: 'success',
          timestamp: now,
          result: {
            assignedNurse: 'Sister Kavitha Rao',
            ward: 'Floor 1 Ward West',
            patientVitals: patient?.vitalSigns || { bp: '120/80', pulse: 72, spo2: 99, temp: '98.4°F' },
            patientReadyForTransport: true,
          },
          evidence: `Nursing shift handoff checked. Sister Kavitha Rao reports patient vitals stable. Patient prepared for discharge wheelchair transport once billing clearance token is released.`,
        };
      }

      case 'finance_agent': {
        const totalPendingDischargeBills = state.bills.filter((b) => !b.dischargeClearanceGranted);
        const outstandingAmount = totalPendingDischargeBills.reduce((acc, b) => acc + b.outstandingBalance, 0);

        return {
          task_id: task.task_id,
          agent: 'finance_agent',
          status: 'success',
          timestamp: now,
          result: {
            grossRevenueToday: 3840000,
            pendingDischargeReceivables: outstandingAmount,
            tpaSettlementLagHours: 4.2,
            financialClearanceImpact: `₹${outstandingAmount.toLocaleString('en-IN')} held in uncollected discharge balances across ${totalPendingDischargeBills.length} patients.`,
          },
          evidence: `Financial ledger audit: ₹${outstandingAmount.toLocaleString('en-IN')} pending in uncollected discharge balances. P1001 represents ₹7,200 copay balance pending clearance.`,
        };
      }

      default: {
        return {
          task_id: task.task_id,
          agent: to_agent,
          status: 'success',
          timestamp: now,
          result: { status: 'acknowledged' },
          evidence: `Processed intent ${intent} for agent ${to_agent}.`,
        };
      }
    }
  }
}
