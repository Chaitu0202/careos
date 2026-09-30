// CareOS Hospital Operating System — Central Shared State Context
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  Patient,
  Doctor,
  Nurse,
  Department,
  Appointment,
  QueueEntry,
  LabOrder,
  ImagingOrder,
  PharmacyOrder,
  Bill,
  InsuranceAuth,
  ResourceItem,
  Bottleneck,
  AlertItem,
  AuditLogEntry,
  Recommendation,
  HospitalEvent,
  InvestigationExecution,
  AgentId,
} from '../types/hospital';
import {
  INITIAL_PATIENTS,
  INITIAL_DOCTORS,
  INITIAL_NURSES,
  INITIAL_DEPARTMENTS,
  INITIAL_APPOINTMENTS,
  INITIAL_QUEUES,
  INITIAL_LAB_ORDERS,
  INITIAL_IMAGING_ORDERS,
  INITIAL_PHARMACY_ORDERS,
  INITIAL_BILLS,
  INITIAL_INSURANCE_AUTHS,
  INITIAL_RESOURCES,
  INITIAL_BOTTLENECKS,
  INITIAL_ALERTS,
  INITIAL_AUDIT_LOGS,
  INITIAL_RECOMMENDATIONS,
} from '../data/initialHospitalData';
import { eventBus } from '../engine/eventBus';
import { CareOSOrchestrator } from '../agents/orchestrator';
import { HospitalWorkflowEngine } from '../engine/workflowEngine';
import { HospitalStateSnapshot } from '../agents/specializedAgents';

export type ActivePage =
  | 'command_center'
  | 'agent_network'
  | 'patients'
  | 'departments'
  | 'resources'
  | 'bottlenecks'
  | 'alerts'
  | 'analytics'
  | 'integrations'
  | 'audit';

interface HospitalContextType {
  // State
  patients: Patient[];
  doctors: Doctor[];
  nurses: Nurse[];
  departments: Department[];
  appointments: Appointment[];
  queues: QueueEntry[];
  labOrders: LabOrder[];
  imagingOrders: ImagingOrder[];
  pharmacyOrders: PharmacyOrder[];
  bills: Bill[];
  insuranceAuths: InsuranceAuth[];
  resources: ResourceItem[];
  bottlenecks: Bottleneck[];
  alerts: AlertItem[];
  auditLogs: AuditLogEntry[];
  recommendations: Recommendation[];
  events: HospitalEvent[];

  // Navigation & Drawers
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  selectedAgentId: AgentId | null;
  setSelectedAgentId: (id: AgentId | null) => void;
  selectedPatientId: string | null;
  setSelectedPatientId: (id: string | null) => void;
  selectedAlertId: string | null;
  setSelectedAlertId: (id: string | null) => void;

  // Active Multi-Agent Investigation
  currentInvestigation: InvestigationExecution | null;
  isInvestigating: boolean;
  executeCommand: (query: string) => Promise<void>;
  clearInvestigation: () => void;
  investigationHistory: InvestigationExecution[];

  // Action Approvals (Human-in-the-loop)
  approveRecommendation: (recId: string) => Promise<void>;

  // Voice & Speech
  isVoiceListening: boolean;
  setIsVoiceListening: (listening: boolean) => void;
  isSpeaking: boolean;
  speakText: (text: string) => void;
  stopSpeaking: () => void;

  // Live Demo Simulation Mode
  liveDemoMode: boolean;
  setLiveDemoMode: (enabled: boolean) => void;
  injectDemoEvent: () => void;
}

const HospitalContext = createContext<HospitalContextType | undefined>(undefined);

export const HospitalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [doctors, setDoctors] = useState<Doctor[]>(INITIAL_DOCTORS);
  const [nurses] = useState<Nurse[]>(INITIAL_NURSES);
  const [departments, setDepartments] = useState<Department[]>(INITIAL_DEPARTMENTS);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [queues, setQueues] = useState<QueueEntry[]>(INITIAL_QUEUES);
  const [labOrders, setLabOrders] = useState<LabOrder[]>(INITIAL_LAB_ORDERS);
  const [imagingOrders, setImagingOrders] = useState<ImagingOrder[]>(INITIAL_IMAGING_ORDERS);
  const [pharmacyOrders, setPharmacyOrders] = useState<PharmacyOrder[]>(INITIAL_PHARMACY_ORDERS);
  const [bills, setBills] = useState<Bill[]>(INITIAL_BILLS);
  const [insuranceAuths, setInsuranceAuths] = useState<InsuranceAuth[]>(INITIAL_INSURANCE_AUTHS);
  const [resources, setResources] = useState<ResourceItem[]>(INITIAL_RESOURCES);
  const [bottlenecks, setBottlenecks] = useState<Bottleneck[]>(INITIAL_BOTTLENECKS);
  const [alerts, setAlerts] = useState<AlertItem[]>(INITIAL_ALERTS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [recommendations, setRecommendations] = useState<Recommendation[]>(INITIAL_RECOMMENDATIONS);
  const [events, setEvents] = useState<HospitalEvent[]>([]);

  // Navigation
  const [activePage, setActivePage] = useState<ActivePage>('command_center');
  const [selectedAgentId, setSelectedAgentId] = useState<AgentId | null>(null);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);

  // Investigation
  const [currentInvestigation, setCurrentInvestigation] = useState<InvestigationExecution | null>(null);
  const [isInvestigating, setIsInvestigating] = useState<boolean>(false);
  const [investigationHistory, setInvestigationHistory] = useState<InvestigationExecution[]>([]);
  const [lastContext, setLastContext] = useState<string>('');

  // Voice
  const [isVoiceListening, setIsVoiceListening] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Live Demo
  const [liveDemoMode, setLiveDemoMode] = useState<boolean>(false);

  // Subscribe to Event Bus
  useEffect(() => {
    const unsubscribe = eventBus.subscribe('*', (evt) => {
      setEvents((prev) => [evt, ...prev.slice(0, 49)]);

      // Also add to audit logs if significant
      const auditEntry: AuditLogEntry = {
        id: `AUD-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`,
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }) + '.' + Math.floor(Math.random() * 900 + 100),
        actor: evt.sourceAgent.replace(/_/g, ' ').toUpperCase(),
        agentId: evt.sourceAgent,
        action: evt.name,
        target: evt.payload?.patientId || evt.payload?.target || evt.payload?.bedId || 'Hospital Operational Core',
        details: evt.description,
        status: 'SUCCESS',
        verificationHash: `sha256-${Math.random().toString(36).substring(2, 10)}`,
      };
      setAuditLogs((prev) => [auditEntry, ...prev.slice(0, 99)]);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Text-To-Speech function
  const speakText = useCallback((text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      utterance.lang = 'en-US';

      // Pick a clean natural voice if available
      const voices = window.speechSynthesis.getVoices();
      const naturalVoice = voices.find((v) => v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.lang.startsWith('en'));
      if (naturalVoice) {
        utterance.voice = naturalVoice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
      setIsSpeaking(false);
    }
  }, []);

  const stopSpeaking = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, []);

  // Execute Command via Orchestrator
  const executeCommand = useCallback(
    async (query: string) => {
      if (!query.trim() || isInvestigating) return;

      setIsInvestigating(true);

      const stateSnapshot: HospitalStateSnapshot = {
        patients,
        doctors,
        departments,
        queues,
        labOrders,
        imagingOrders,
        pharmacyOrders,
        bills,
        insuranceAuths,
        resources,
        bottlenecks,
      };

      try {
        const execution = await CareOSOrchestrator.orchestrate(
          query,
          stateSnapshot,
          (updatedExec) => {
            setCurrentInvestigation(updatedExec);
          },
          lastContext
        );

        setCurrentInvestigation(execution);
        setInvestigationHistory((prev) => [execution, ...prev.slice(0, 9)]);
        setLastContext(query + ' | ' + (execution.analysisResult?.title || ''));

        // Speak the final verified response
        if (execution.analysisResult?.recommendedNextStep) {
          const speakMessage = `${execution.analysisResult.title}. Status: ${execution.analysisResult.status}. ${execution.analysisResult.primaryBlocker ? `Primary constraint: ${execution.analysisResult.primaryBlocker}. ` : ''}CareOS recommends: ${execution.analysisResult.recommendedNextStep}`;
          speakText(speakMessage);
        }
      } catch (err) {
        console.error('Orchestration error:', err);
      } finally {
        setIsInvestigating(false);
      }
    },
    [
      isInvestigating,
      patients,
      doctors,
      departments,
      queues,
      labOrders,
      imagingOrders,
      pharmacyOrders,
      bills,
      insuranceAuths,
      resources,
      bottlenecks,
      lastContext,
      speakText,
    ]
  );

  const clearInvestigation = useCallback(() => {
    setCurrentInvestigation(null);
    stopSpeaking();
  }, [stopSpeaking]);

  // Human-in-the-Loop: Approve Recommendation
  const approveRecommendation = useCallback(
    async (recId: string) => {
      const rec = recommendations.find((r) => r.id === recId) ||
        currentInvestigation?.analysisResult?.actionableRecommendation;

      if (!rec) return;

      const result = await HospitalWorkflowEngine.executeApprovedAction(rec);

      if (result.success) {
        const changes = result.updatedStateChanges;

        // Apply changes to shared state
        if (changes.patientId) {
          setPatients((prev) =>
            prev.map((p) => {
              if (p.id === changes.patientId) {
                return {
                  ...p,
                  status: changes.patientStatus || p.status,
                  journeyStage: 'Discharge',
                  dischargeBlockers: [],
                  dependencies: [],
                  journeySteps: p.journeySteps.map((s) =>
                    s.stage === 'Billing' || s.stage === 'Discharge'
                      ? { ...s, status: 'COMPLETED', notes: 'Cleared via Admin Approval & TPA webhook' }
                      : s
                  ),
                };
              }
              return p;
            })
          );
        }

        if (changes.insuranceAuthStatus) {
          setInsuranceAuths((prev) =>
            prev.map((a) => (a.patientId === changes.patientId ? { ...a, status: 'Approved' } : a))
          );
        }

        if (changes.billingStatus) {
          setBills((prev) =>
            prev.map((b) =>
              b.patientId === changes.patientId
                ? { ...b, status: 'Cleared', dischargeClearanceGranted: true, outstandingBalance: 0 }
                : b
            )
          );
        }

        if (changes.releasedBedId) {
          setResources((prev) =>
            prev.map((r) =>
              r.id === changes.releasedBedId
                ? { ...r, status: 'Cleaning', currentPatientId: undefined }
                : r
            )
          );
        }

        if (changes.reservedBedId) {
          setResources((prev) =>
            prev.map((r) =>
              r.id === changes.reservedBedId
                ? { ...r, status: 'Reserved' }
                : r
            )
          );
        }

        if (changes.radiologyBottleneckResolved) {
          setQueues((prev) =>
            prev.map((q) => (q.status === 'Delayed' ? { ...q, status: 'Processing' } : q))
          );
          setBottlenecks((prev) =>
            prev.map((b) => (b.id === 'BTN-01' ? { ...b, status: 'Mitigating' } : b))
          );
        }

        // Mark recommendation as executed
        setRecommendations((prev) =>
          prev.map((r) => (r.id === recId ? { ...r, status: 'Executed' } : r))
        );

        // Update current investigation result state if present
        if (currentInvestigation?.analysisResult) {
          setCurrentInvestigation((prev) =>
            prev
              ? {
                  ...prev,
                  analysisResult: {
                    ...prev.analysisResult!,
                    status: 'RESOLVED / EXECUTED',
                    recommendedNextStep: 'Workflow completed successfully. Bed released to Housekeeping; audit record sealed.',
                    actionableRecommendation: undefined,
                  },
                }
              : null
          );
        }

        // Add audit log
        setAuditLogs((prev) => [result.auditEntry, ...prev]);

        speakText(`Administrative approval verified. ${result.message}`);
      }
    },
    [recommendations, currentInvestigation, speakText]
  );

  // Manual or timer-based Demo Event Injection
  const injectDemoEvent = useCallback(() => {
    const demoEvents = [
      () => {
        eventBus.publish('MRI_COMPLETED', 'radiology_agent', 'MRI Scan completed on MRI-02 (GE Signa) for patient Sunita Devi (P1002). Radiologist report generation initiated.', { patientId: 'P1002' });
        setImagingOrders((prev) =>
          prev.map((o) => (o.patientId === 'P1002' ? { ...o, status: 'Report Ready' } : o))
        );
      },
      () => {
        eventBus.publish('LAB_RESULT_READY', 'laboratory_agent', 'Comprehensive Liver Function panel completed for K. Venkatesh (P1005). Serum bilirubin normal (0.8 mg/dL).', { patientId: 'P1005' });
        setLabOrders((prev) =>
          prev.map((l) => (l.patientId === 'P1005' ? { ...l, status: 'Completed', resultSummary: 'Bilirubin normal (0.8 mg/dL)' } : l))
        );
      },
      () => {
        eventBus.publish('BED_RELEASED', 'bed_agent', 'Housekeeping completed disinfection cycle for Bed BED102. Marked AVAILABLE for ward admission.', { bedId: 'BED102' });
        setResources((prev) =>
          prev.map((r) => (r.id === 'BED102' ? { ...r, status: 'Available' } : r))
        );
      },
      () => {
        eventBus.publish('APPOINTMENT_BOOKED', 'appointment_agent', 'New Cardiology outpatient appointment confirmed for tomorrow 11:30 AM via Suvarna ERP web portal.', { token: 'CARD-11' });
      },
    ];

    const randomFn = demoEvents[Math.floor(Math.random() * demoEvents.length)];
    randomFn();
  }, []);

  // Periodic timer for Live Demo mode
  useEffect(() => {
    if (!liveDemoMode) return;
    const interval = setInterval(() => {
      injectDemoEvent();
    }, 14000);

    return () => clearInterval(interval);
  }, [liveDemoMode, injectDemoEvent]);

  return (
    <HospitalContext.Provider
      value={{
        patients,
        doctors,
        nurses,
        departments,
        appointments,
        queues,
        labOrders,
        imagingOrders,
        pharmacyOrders,
        bills,
        insuranceAuths,
        resources,
        bottlenecks,
        alerts,
        auditLogs,
        recommendations,
        events,
        activePage,
        setActivePage,
        selectedAgentId,
        setSelectedAgentId,
        selectedPatientId,
        setSelectedPatientId,
        selectedAlertId,
        setSelectedAlertId,
        currentInvestigation,
        isInvestigating,
        executeCommand,
        clearInvestigation,
        investigationHistory,
        approveRecommendation,
        isVoiceListening,
        setIsVoiceListening,
        isSpeaking,
        speakText,
        stopSpeaking,
        liveDemoMode,
        setLiveDemoMode,
        injectDemoEvent,
      }}
    >
      {children}
    </HospitalContext.Provider>
  );
};

export const useHospital = (): HospitalContextType => {
  const context = useContext(HospitalContext);
  if (!context) {
    throw new Error('useHospital must be used within a HospitalProvider');
  }
  return context;
};
