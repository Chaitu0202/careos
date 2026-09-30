// CareOS Hospital Operating System — Type Definitions

export type UserRole = 'admin' | 'operations' | 'doctor' | 'nurse' | 'billing';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  title: string;
  department: string;
  avatar: string;
  initials: string;
  permissions: string[];
}

export type AgentId =
  | 'orchestrator'
  | 'journey_agent'
  | 'appointment_agent'
  | 'queue_agent'
  | 'doctor_agent'
  | 'nursing_agent'
  | 'laboratory_agent'
  | 'radiology_agent'
  | 'pharmacy_agent'
  | 'billing_agent'
  | 'insurance_agent'
  | 'bed_agent'
  | 'admission_agent'
  | 'discharge_agent'
  | 'bottleneck_agent'
  | 'resource_agent'
  | 'operations_agent'
  | 'finance_agent';

export type AgentStatus = 'ACTIVE' | 'IDLE' | 'WAITING' | 'ANALYZING' | 'BLOCKED' | 'ERROR';

export interface AgentContract {
  id: AgentId;
  name: string;
  domain: string;
  responsibilities: string[];
  allowedData: string[];
  tools: string[];
  permissions: string[];
  inputSchema: string;
  outputSchema: string;
  escalationRules: string;
  failureBehavior: string;
}

export type JourneyStage =
  | 'Registration'
  | 'Appointment'
  | 'Check-in'
  | 'Consultation'
  | 'Lab'
  | 'Radiology'
  | 'Doctor Review'
  | 'Billing'
  | 'Pharmacy'
  | 'Discharge';

export interface JourneyStep {
  stage: JourneyStage;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING' | 'BLOCKED' | 'SKIPPED';
  timestamp?: string;
  owner: string;
  dependencies: string[];
  waitingMinutes: number;
  relatedAgent: AgentId;
  relatedDepartment: string;
  notes?: string;
}

export interface Patient {
  id: string; // e.g. P1001
  name: string;
  age: number;
  gender: 'M' | 'F' | 'Other';
  department: string;
  doctor: string; // e.g. DOC101
  doctorName: string;
  journeyStage: JourneyStage;
  status: 'Normal' | 'Delayed' | 'Critical' | 'Discharged';
  waitingMinutes: number;
  admissionDate: string;
  roomBed?: string; // e.g. BED101, ICU-15
  dependencies: string[];
  journeySteps: JourneyStep[];
  dischargeBlockers?: string[];
  vitalSigns?: {
    bp: string;
    pulse: number;
    spo2: number;
    temp: string;
  };
}

export interface Doctor {
  id: string; // e.g. DOC101
  name: string;
  specialty: string;
  department: string;
  status: 'In Consultation' | 'In Surgery' | 'Available' | 'On Rounds' | 'Off Duty';
  activePatients: number;
  pendingReviews: number;
  nextAvailableSlot: string;
}

export interface Nurse {
  id: string;
  name: string;
  department: string;
  shift: 'Morning' | 'Evening' | 'Night';
  assignedPatients: string[];
  status: 'Active' | 'On Break';
}

export interface Department {
  id: string;
  name: string;
  headDoctor: string;
  activePatients: number;
  waitingCount: number;
  capacityUtilization: number; // percentage
  status: 'Normal' | 'Bottleneck' | 'High Load';
  keyResources: string[];
  associatedAgent: AgentId;
}

export interface Appointment {
  id: string; // APT5001
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  department: string;
  timeSlot: string;
  date: string;
  status: 'Scheduled' | 'Checked-in' | 'In Progress' | 'Completed' | 'Cancelled';
  tokenNumber: string;
}

export interface QueueEntry {
  id: string;
  patientId: string;
  patientName: string;
  department: string;
  service: string;
  tokenNumber: string;
  queuePosition: number;
  estimatedWaitMinutes: number;
  actualWaitMinutes: number;
  status: 'Waiting' | 'Called' | 'Processing' | 'Delayed';
  priority: 'Emergency' | 'Urgent' | 'Standard';
}

export interface LabOrder {
  id: string; // LAB7001
  patientId: string;
  patientName: string;
  testName: string;
  sampleType: string;
  orderedBy: string;
  orderedAt: string;
  status: 'Sample Collected' | 'Processing' | 'Completed' | 'Delayed';
  turnaroundMinutes: number;
  resultSummary?: string;
}

export interface ImagingOrder {
  id: string; // IMG7001
  patientId: string;
  patientName: string;
  modality: 'MRI' | 'CT' | 'X-Ray' | 'Ultrasound';
  bodyPart: string;
  equipmentId: string; // MRI01, CT01
  orderedBy: string;
  scheduledTime: string;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Report Pending' | 'Report Ready';
  reportFindings?: string;
  radiologistReviewer: string;
}

export interface PharmacyOrder {
  id: string;
  patientId: string;
  patientName: string;
  prescribedDoctor: string;
  medications: {
    name: string;
    dosage: string;
    quantity: number;
    available: boolean;
  }[];
  status: 'Pending' | 'Dispensing' | 'Ready for Pickup' | 'Dispensed';
  cost: number;
}

export interface Bill {
  id: string; // BILL9001
  patientId: string;
  patientName: string;
  department: string;
  totalAmount: number;
  insuranceCovered: number;
  patientPayable: number;
  amountPaid: number;
  outstandingBalance: number;
  status: 'Draft' | 'Pending Clearance' | 'Partially Paid' | 'Cleared';
  dischargeClearanceGranted: boolean;
}

export interface InsuranceAuth {
  id: string; // AUTH1001
  patientId: string;
  patientName: string;
  tpaProvider: string;
  policyNumber: string;
  claimedAmount: number;
  approvedAmount: number;
  status: 'Pending Submission' | 'Under Review' | 'Queries Raised' | 'Approved' | 'Rejected';
  turnaroundHours: number;
  lastUpdated: string;
  queriesPending?: string;
}

export interface ResourceItem {
  id: string; // BED101, MRI01, CT01, OR-03
  name: string;
  type: 'Bed' | 'ICU Bed' | 'MRI' | 'CT' | 'X-Ray' | 'Operation Theater' | 'Wheelchair/Transport';
  department: string;
  location: string;
  status: 'Available' | 'In Use' | 'Cleaning' | 'Maintenance' | 'Reserved';
  currentPatientId?: string;
  assignedStaff?: string;
  utilizationRate: number; // e.g. 82%
  connectedAgent: AgentId;
}

export interface TaskMessage {
  task_id: string;
  from_agent: AgentId;
  to_agent: AgentId;
  patient_id?: string;
  intent: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  payload?: any;
}

export interface TaskResponse {
  task_id: string;
  agent: AgentId;
  status: 'success' | 'warning' | 'error';
  timestamp: string;
  result: Record<string, any>;
  evidence: string;
}

export interface Bottleneck {
  id: string;
  department: string;
  title: string;
  resourceConstraint: string;
  affectedPatientsCount: number;
  affectedPatientIds: string[];
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  rootCause: string;
  detectedAt: string;
  detectedBy: AgentId;
  status: 'Active' | 'Mitigating' | 'Resolved';
  suggestedAction: string;
  actionApprovalRequired: boolean;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: 'Discharge' | 'Scheduling' | 'Capacity' | 'Staffing';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  proposedBy: AgentId;
  affectedDepartment: string;
  targetPatientId?: string;
  status: 'Pending Admin Approval' | 'Approved' | 'Executed' | 'Dismissed';
  actionPayload: {
    type: 'ESCALATE_INSURANCE' | 'RESERVE_BED' | 'EXPEDITE_BILLING' | 'REASSIGN_MRI_SLOT' | 'CALL_NURSING';
    targetId: string;
    description: string;
  };
}

export interface AlertItem {
  id: string;
  title: string;
  department: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  timestamp: string;
  description: string;
  cause: string;
  affectedPatients: string[];
  affectedResources: string[];
  responsibleDepartment: string;
  agentsInvolved: AgentId[];
  evidence: string;
  recommendedAction: string;
  potentialImpact: string;
  resolved: boolean;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string; // 'Admin' or Agent Name
  agentId?: AgentId;
  action: string;
  target?: string;
  details: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
  verificationHash?: string;
}

export type HospitalEventName =
  | 'PATIENT_REGISTERED'
  | 'APPOINTMENT_BOOKED'
  | 'CHECK_IN_COMPLETED'
  | 'CONSULTATION_STARTED'
  | 'LAB_ORDER_CREATED'
  | 'LAB_RESULT_READY'
  | 'MRI_SCHEDULED'
  | 'MRI_COMPLETED'
  | 'REPORT_READY'
  | 'BILL_CREATED'
  | 'PAYMENT_RECEIVED'
  | 'INSURANCE_AUTHORIZATION_PENDING'
  | 'BED_ASSIGNED'
  | 'BED_RELEASED'
  | 'DISCHARGE_STARTED'
  | 'DISCHARGE_BLOCKED'
  | 'DISCHARGE_COMPLETED'
  | 'RESOURCE_UNAVAILABLE'
  | 'BOTTLENECK_DETECTED';

export interface HospitalEvent {
  id: string;
  name: HospitalEventName;
  timestamp: string;
  sourceAgent: AgentId;
  payload: Record<string, any>;
  description: string;
}

export interface PipelineStep {
  name: 'UNDERSTAND' | 'PLAN' | 'DELEGATE' | 'COMMUNICATE' | 'RETRIEVE' | 'ANALYZE' | 'DETECT' | 'RECOMMEND' | 'VERIFY' | 'RESPOND';
  status: 'pending' | 'in_progress' | 'completed';
  detail?: string;
  timestamp?: string;
}

export interface InvestigationExecution {
  id: string;
  query: string;
  patientId?: string;
  intent: string;
  startedAt: string;
  completedAt?: string;
  status: 'running' | 'completed' | 'failed';
  currentStepIndex: number;
  steps: PipelineStep[];
  selectedAgents: AgentId[];
  agentStatuses: Record<AgentId, 'waiting' | 'running' | 'completed' | 'error'>;
  liveConversation: {
    agent: AgentId;
    agentName: string;
    message: string;
    timestamp: string;
    evidence?: string;
  }[];
  analysisResult?: {
    title: string;
    status: string;
    primaryBlocker?: string;
    secondaryBlocker?: string;
    clinicalStatus?: string;
    pharmacyStatus?: string;
    bedStatus?: string;
    operationalImpact?: string;
    recommendedNextStep: string;
    agentsConsultedCount: number;
    confidence: 'High' | 'Medium' | 'Limited';
    evidenceList: { agentId: AgentId; agentName: string; finding: string }[];
    actionableRecommendation?: Recommendation;
  };
}
