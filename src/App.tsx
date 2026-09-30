// CareOS — Complete Agentic Hospital Operating System
import React, { useState } from 'react';
import { HospitalProvider, useHospital } from './state/hospitalStore';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { CommandCenter } from './pages/CommandCenter';
import { LiveAgentNetwork } from './pages/LiveAgentNetwork';
import { PatientOperations } from './pages/PatientOperations';
import { DepartmentsView } from './pages/DepartmentsView';
import { ResourcesView } from './pages/ResourcesView';
import { BottlenecksView } from './pages/BottlenecksView';
import { AnalyticsView } from './pages/AnalyticsView';
import { IntegrationsView } from './pages/IntegrationsView';
import { AuditView } from './pages/AuditView';
import { AgentDetailDrawer } from './components/drawers/AgentDetailDrawer';
import { VoiceModal } from './components/command/VoiceModal';
import { Menu } from 'lucide-react';

const AppLayout: React.FC = () => {
  const { activePage } = useHospital();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  const renderActivePage = () => {
    switch (activePage) {
      case 'command_center':
        return <CommandCenter onOpenVoice={() => setIsVoiceModalOpen(true)} />;
      case 'agent_network':
        return <LiveAgentNetwork />;
      case 'patients':
        return <PatientOperations />;
      case 'departments':
        return <DepartmentsView />;
      case 'resources':
        return <ResourcesView />;
      case 'bottlenecks':
      case 'alerts':
        return <BottlenecksView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'integrations':
        return <IntegrationsView />;
      case 'audit':
        return <AuditView />;
      default:
        return <CommandCenter onOpenVoice={() => setIsVoiceModalOpen(true)} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F9FC] text-[#172B4D] flex">
      {/* Sidebar Navigation */}
      <Sidebar
        isOpenMobile={isMobileNavOpen}
        onCloseMobile={() => setIsMobileNavOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Top Header */}
        <Header onOpenVoice={() => setIsVoiceModalOpen(true)} />

        {/* Mobile Nav Toggle Bar */}
        <div className="lg:hidden bg-white border-b border-[#E2E8F0] px-4 py-2 flex items-center justify-between">
          <button
            onClick={() => setIsMobileNavOpen(true)}
            className="flex items-center gap-2 text-xs font-semibold text-[#172B4D] p-1.5 rounded-md hover:bg-[#F6F9FC]"
          >
            <Menu className="w-4 h-4 text-[#2563EB]" />
            <span>Navigation Menu</span>
          </button>
          <span className="text-[11px] font-mono text-[#64748B]">CareOne Multispecialty</span>
        </div>

        {/* Page Content Container */}
        <main className="flex-1 p-4 lg:p-6 max-w-7xl w-full mx-auto">
          {renderActivePage()}
        </main>
      </div>

      {/* Slide-out Agent Detail Drawer */}
      <AgentDetailDrawer />

      {/* Real-time Voice Conversation Modal */}
      <VoiceModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <HospitalProvider>
      <AppLayout />
    </HospitalProvider>
  );
}
