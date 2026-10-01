// CareOS Hospital Operating System — Role-Adaptive Command Center
import React from 'react';
import { useHospital } from '../state/hospitalStore';
import { AdminDashboard } from '../components/dashboards/AdminDashboard';
import { OperationsDashboard } from '../components/dashboards/OperationsDashboard';
import { DoctorDashboard } from '../components/dashboards/DoctorDashboard';
import { NurseDashboard } from '../components/dashboards/NurseDashboard';
import { BillingDashboard } from '../components/dashboards/BillingDashboard';
import { PatientDashboard } from '../components/dashboards/PatientDashboard';

interface CommandCenterProps {
  onOpenVoice: () => void;
}

export const CommandCenter: React.FC<CommandCenterProps> = ({ onOpenVoice }) => {
  const { currentUser } = useHospital();

  const activeRole = currentUser?.role || 'admin';

  switch (activeRole) {
    case 'admin':
      return <AdminDashboard onOpenVoice={onOpenVoice} />;
    case 'operations':
      return <OperationsDashboard />;
    case 'doctor':
      return <DoctorDashboard />;
    case 'nurse':
      return <NurseDashboard />;
    case 'billing':
      return <BillingDashboard />;
    case 'patient':
      return <PatientDashboard />;
    default:
      return <AdminDashboard onOpenVoice={onOpenVoice} />;
  }
};
