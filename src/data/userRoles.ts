// CareOS Hospital Operating System — Pre-configured Role Users
import { UserProfile, UserRole } from '../types/hospital';

export const PRESET_USERS: UserProfile[] = [
  {
    id: 'USR-ADMIN-01',
    name: 'Dr. Rajeshwari Varma',
    email: 'admin@careone.health',
    role: 'admin',
    title: 'Hospital Administrator & Medical Director',
    department: 'Hospital Command & Operations',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
    initials: 'RV',
    permissions: [
      'all_access',
      'orchestrate_agents',
      'approve_high_impact_actions',
      'override_blockers',
      'view_audit_ledger',
      'manage_integrations',
      'view_financial_ledgers',
    ],
  },
  {
    id: 'USR-OPS-02',
    name: 'Vikramaditya Rao',
    email: 'operations@careone.health',
    role: 'operations',
    title: 'Chief Operating Officer (COO)',
    department: 'Hospital Operations',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    initials: 'VR',
    permissions: [
      'view_command_center',
      'manage_bottlenecks',
      'allocate_beds',
      'manage_queues',
      'approve_operational_mitigation',
      'view_agent_network',
    ],
  },
  {
    id: 'USR-DOC-03',
    name: 'Dr. S. K. Murthy',
    email: 'dr.murthy@careone.health',
    role: 'doctor',
    title: 'Senior Interventional Cardiologist',
    department: 'Cardiology & CCU',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
    initials: 'SM',
    permissions: [
      'view_patient_journeys',
      'sign_clinical_discharge',
      'review_diagnostics',
      'order_imaging_labs',
      'view_cardiology_wing',
    ],
  },
  {
    id: 'USR-NUR-04',
    name: 'Sister Kavitha Rao',
    email: 'kavitha.nurse@careone.health',
    role: 'nurse',
    title: 'Nursing Supervisor & Ward In-Charge',
    department: 'Floor 1 Ward West & CCU',
    avatar: 'https://images.unsplash.com/photo-1594824813589-9a2cf1f786d7?w=150&auto=format&fit=crop&q=80',
    initials: 'KR',
    permissions: [
      'record_vitals',
      'manage_bedside_tasks',
      'request_bed_cleaning',
      'coordinate_patient_transport',
      'view_ward_census',
    ],
  },
  {
    id: 'USR-BIL-05',
    name: 'Anand Swaroop',
    email: 'anand.billing@careone.health',
    role: 'billing',
    title: 'Lead Insurance & TPA Clearance Officer',
    department: 'Billing & Patient Accounts',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    initials: 'AS',
    permissions: [
      'grant_billing_clearance',
      'submit_tpa_queries',
      'verify_copay_waivers',
      'view_financial_ledgers',
      'approve_discharge_pass',
    ],
  },
  {
    id: 'USR-PAT-01',
    name: 'Ravi Kumar',
    email: 'ravi.kumar@patient.careone.health',
    role: 'patient',
    title: 'Admitted Inpatient (ID: P1001)',
    department: 'Cardiology (Bed BED101)',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    initials: 'RK',
    permissions: [
      'view_my_journey',
      'view_my_reports',
      'view_my_prescriptions',
      'view_my_billing',
      'request_nurse_assistance',
    ],
  },
];

export const ROLE_DEFINITIONS: Record<
  UserRole,
  {
    label: string;
    description: string;
    color: string;
    bg: string;
    border: string;
    primaryAccessiblePages: string[];
  }
> = {
  admin: {
    label: 'Hospital Administrator',
    description: 'Unrestricted enterprise control, all 18 AI agents, approval authority & audit oversight.',
    color: 'text-[#2563EB]',
    bg: 'bg-[#EAF2FF]',
    border: 'border-[#2563EB]/30',
    primaryAccessiblePages: [
      'command_center',
      'agent_network',
      'patients',
      'departments',
      'resources',
      'bottlenecks',
      'analytics',
      'integrations',
      'audit',
    ],
  },
  operations: {
    label: 'Hospital Operations (COO)',
    description: 'Real-time bottleneck resolution, bed turnover, equipment utilization & queues.',
    color: 'text-[#0F9F9A]',
    bg: 'bg-[#E8F8F6]',
    border: 'border-[#0F9F9A]/30',
    primaryAccessiblePages: [
      'command_center',
      'agent_network',
      'bottlenecks',
      'resources',
      'departments',
      'analytics',
    ],
  },
  doctor: {
    label: 'Attending Physician / Doctor',
    description: 'Patient clinical trajectories, diagnostic review sign-offs, and discharge readiness.',
    color: 'text-[#7C3AED]',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    primaryAccessiblePages: ['patients', 'departments', 'command_center'],
  },
  nurse: {
    label: 'Nursing & Ward Supervisor',
    description: 'Patient bedside care, vital signs tracking, bed turnover and discharge escort.',
    color: 'text-[#16A34A]',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    primaryAccessiblePages: ['patients', 'resources', 'departments'],
  },
  billing: {
    label: 'Billing & TPA Officer',
    description: 'Insurance pre-authorizations, copay balance settlements, and final clearance passes.',
    color: 'text-[#D97706]',
    bg: 'bg-[#FFF6E5]',
    border: 'border-[#D97706]/30',
    primaryAccessiblePages: ['bottlenecks', 'patients', 'audit', 'command_center'],
  },
  patient: {
    label: 'Patient Care Portal',
    description: 'Transparent personal care trajectory, live doctor/nurse contacts, reports, prescriptions, and discharge status.',
    color: 'text-[#0284C7]',
    bg: 'bg-sky-50',
    border: 'border-sky-200',
    primaryAccessiblePages: ['command_center', 'patients'],
  },
};
