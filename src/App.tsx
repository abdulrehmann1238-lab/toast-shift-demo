import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import { LoadingScreen } from './components/loading/LoadingScreen';
import { AppSidebar } from './components/layout/AppSidebar';
import { TopNavigation } from './components/layout/TopNavigation';
import { ToastContainer } from './components/common/ToastContainer';
import { HelpModal } from './components/common/HelpModal';
import { ConfirmationModal } from './components/common/ConfirmationModal';

// Pages
import { LandingPage } from './pages/LandingPage';
import { OverviewDashboard } from './pages/OverviewDashboard';
import { LiveShiftManagement } from './pages/LiveShiftManagement';
import { EmployeeManagement } from './pages/EmployeeManagement';
import { EmployeeProfile } from './pages/EmployeeProfile';
import { ShiftClosing } from './pages/ShiftClosing';
import { ClosingChecklist } from './pages/ClosingChecklist';
import { Reconciliation } from './pages/Reconciliation';
import { ManagerApprovals } from './pages/ManagerApprovals';
import { ShiftReports } from './pages/ShiftReports';
import { WorkflowSettings } from './pages/WorkflowSettings';

export const AppContent: React.FC = () => {
  const { currentScreen, navigateTo, resetDemoData } = useApp();

  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  // If initial loading screen is active
  if (isLoading) {
    return <LoadingScreen onComplete={() => setIsLoading(false)} />;
  }

  // If Landing Page is active
  if (currentScreen === 'landing') {
    return (
      <LandingPage
        onEnterApp={() => {
          navigateTo('overview');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text flex flex-col antialiased selection:bg-brand-sage-soft selection:text-brand-sage-dark">
      {/* Sidebar */}
      <AppSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onOpenHelp={() => setHelpOpen(true)}
      />

      {/* Main Content Area (shifted right on desktop) */}
      <div className="lg:pl-64 flex flex-col flex-1 min-w-0">
        {/* Top Sticky Navigation */}
        <TopNavigation
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onOpenResetConfirm={() => setResetConfirmOpen(true)}
        />

        {/* Dynamic Screen View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentScreen === 'overview' && <OverviewDashboard />}
          {currentScreen === 'live_shifts' && <LiveShiftManagement />}
          {currentScreen === 'employees' && <EmployeeManagement />}
          {currentScreen === 'employee_profile' && <EmployeeProfile />}
          {currentScreen === 'shift_closing' && <ShiftClosing />}
          {currentScreen === 'checklist' && <ClosingChecklist />}
          {currentScreen === 'reconciliation' && <Reconciliation />}
          {currentScreen === 'approvals' && <ManagerApprovals />}
          {currentScreen === 'reports' && <ShiftReports />}
          {currentScreen === 'settings' && <WorkflowSettings />}
        </main>
      </div>

      {/* Global Modals & Notifications */}
      <HelpModal isOpen={helpOpen} onClose={() => setHelpOpen(false)} />
      <ToastContainer />
      <ConfirmationModal
        isOpen={resetConfirmOpen}
        onClose={() => setResetConfirmOpen(false)}
        onConfirm={resetDemoData}
        title="Reset Demo State?"
        message="This will reset all clock punches, approvals, and checklist data back to the default dinner shift scenario."
        variant="warning"
        confirmText="Reset All Data"
      />
    </div>
  );
};

export default function App() {
  return <AppContent />;
}

