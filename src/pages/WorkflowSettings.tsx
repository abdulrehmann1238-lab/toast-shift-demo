import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ConfirmationModal } from '../components/common/ConfirmationModal';
import {
  Settings,
  Shield,
  Bell,
  Sliders,
  CheckCircle2,
  RotateCcw,
  Info,
  Users,
  Lock,
  Layers
} from 'lucide-react';

export const WorkflowSettings: React.FC = () => {
  const {
    settings,
    updateSettings,
    resetDemoData,
    showToast
  } = useApp();

  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const handleToggle = (key: keyof typeof settings) => {
    if (typeof settings[key] === 'boolean') {
      updateSettings({ [key]: !settings[key] });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-brand-border">
        <div>
          <h2 className="text-2xl font-heading font-extrabold text-brand-text tracking-tight">
            Workflow & POS Settings
          </h2>
          <p className="text-xs sm:text-sm text-brand-text-secondary mt-1">
            Configure shift verification rules, automated closing triggers, and demonstration tolerances.
          </p>
        </div>

        <button
          onClick={() => setIsResetConfirmOpen(true)}
          className="px-3.5 py-2 bg-brand-terracotta-soft text-brand-terracotta hover:bg-rose-100 border border-brand-terracotta/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo Data</span>
        </button>
      </div>

      <div className="p-3 bg-brand-surface-subtle border border-brand-border rounded-xl text-xs text-stone-500 flex items-center gap-2">
        <Info className="w-4 h-4 text-stone-400 flex-shrink-0" />
        <span>Settings apply to this local prototype session. In production, these rules sync with Toast Management API parameters.</span>
      </div>

      {/* Section 1: Shift Settings */}
      <div className="bg-brand-surface rounded-2xl border border-brand-border p-6 shadow-subtle space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-brand-border">
          <Sliders className="w-4 h-4 text-brand-sage" />
          <h3 className="text-sm font-heading font-bold text-brand-text">
            Shift Review & Clock Rules
          </h3>
        </div>

        <div className="space-y-4 text-xs divide-y divide-brand-border">
          <div className="flex items-center justify-between pt-2">
            <div className="pr-4">
              <div className="font-semibold text-brand-text">Default Shift Review Requirement</div>
              <p className="text-brand-text-secondary mt-0.5">
                Require manager review and sign-off before any completed shift is moved to payroll staging.
              </p>
            </div>
            <button
              onClick={() => handleToggle('defaultShiftReviewRequired')}
              className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${
                settings.defaultShiftReviewRequired ? 'bg-brand-sage' : 'bg-stone-300'
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  settings.defaultShiftReviewRequired ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between pt-4">
            <div className="pr-4">
              <div className="font-semibold text-brand-text">Clock-Out Confirmation Dialog</div>
              <p className="text-brand-text-secondary mt-0.5">
                Prompt managers for confirmation when manually signing off or ending an employee's floor shift.
              </p>
            </div>
            <button
              onClick={() => handleToggle('requireClockoutConfirmation')}
              className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${
                settings.requireClockoutConfirmation ? 'bg-brand-sage' : 'bg-stone-300'
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  settings.requireClockoutConfirmation ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between pt-4">
            <div className="pr-4">
              <div className="font-semibold text-brand-text">Missing Punch Real-Time Alerts</div>
              <p className="text-brand-text-secondary mt-0.5">
                Automatically flag shifts where an employee exceeded scheduled hours without an out-punch.
              </p>
            </div>
            <button
              onClick={() => handleToggle('missingPunchAlerts')}
              className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${
                settings.missingPunchAlerts ? 'bg-brand-sage' : 'bg-stone-300'
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  settings.missingPunchAlerts ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Section 2: Closing Workflow */}
      <div className="bg-brand-surface rounded-2xl border border-brand-border p-6 shadow-subtle space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-brand-border">
          <Shield className="w-4 h-4 text-brand-sage" />
          <h3 className="text-sm font-heading font-bold text-brand-text">
            Shift-Closing Operational Enforcements
          </h3>
        </div>

        <div className="space-y-4 text-xs divide-y divide-brand-border">
          <div className="flex items-center justify-between pt-2">
            <div className="pr-4">
              <div className="font-semibold text-brand-text">Mandatory Closing Checklist Completion</div>
              <p className="text-brand-text-secondary mt-0.5">
                Block final shift closeout until 100% of required closing tasks are verified.
              </p>
            </div>
            <button
              onClick={() => handleToggle('requiredClosingChecklist')}
              className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${
                settings.requiredClosingChecklist ? 'bg-brand-sage' : 'bg-stone-300'
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  settings.requiredClosingChecklist ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between pt-4">
            <div className="pr-4">
              <div className="font-semibold text-brand-text">Mandatory Manager Exception Sign-Off</div>
              <p className="text-brand-text-secondary mt-0.5">
                Requires GM or Assistant Manager signature on all drawer variances &gt; $5.00 before closing lock.
              </p>
            </div>
            <button
              onClick={() => handleToggle('managerApprovalRequired')}
              className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${
                settings.managerApprovalRequired ? 'bg-brand-sage' : 'bg-stone-300'
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  settings.managerApprovalRequired ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Section 3: Notification Alerts */}
      <div className="bg-brand-surface rounded-2xl border border-brand-border p-6 shadow-subtle space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-brand-border">
          <Bell className="w-4 h-4 text-brand-sage" />
          <h3 className="text-sm font-heading font-bold text-brand-text">
            Notification & Reminder Rules
          </h3>
        </div>

        <div className="space-y-4 text-xs divide-y divide-brand-border">
          <div className="flex items-center justify-between pt-2">
            <div className="pr-4">
              <div className="font-semibold text-brand-text">Pending Clock-Out Reminders</div>
              <p className="text-brand-text-secondary mt-0.5">
                Dispatch manager notification banner when staff reach end-of-scheduled shift window.
              </p>
            </div>
            <button
              onClick={() => handleToggle('pendingClockoutReminders')}
              className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${
                settings.pendingClockoutReminders ? 'bg-brand-sage' : 'bg-stone-300'
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  settings.pendingClockoutReminders ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between pt-4">
            <div className="pr-4">
              <div className="font-semibold text-brand-text">Shift Exception Notifications</div>
              <p className="text-brand-text-secondary mt-0.5">
                Alert manager on duty whenever a drawer variance or overtime punch request is logged.
              </p>
            </div>
            <button
              onClick={() => handleToggle('shiftExceptionNotifications')}
              className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${
                settings.shiftExceptionNotifications ? 'bg-brand-sage' : 'bg-stone-300'
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  settings.shiftExceptionNotifications ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Section 4: Employee Roles & Demonstration Permissions */}
      <div className="bg-brand-surface rounded-2xl border border-brand-border p-6 shadow-subtle space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-brand-border">
          <Users className="w-4 h-4 text-brand-sage" />
          <h3 className="text-sm font-heading font-bold text-brand-text">
            Available Role Labels in Toast Master Roster
          </h3>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {settings.roles.map(role => (
            <span
              key={role}
              className="px-3 py-1.5 rounded-xl bg-brand-surface-subtle border border-brand-border text-xs font-medium text-brand-text flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-brand-sage" />
              <span>{role}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      <ConfirmationModal
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={resetDemoData}
        title="Reset Demo Data to Initial State?"
        message="This will clear all simulated punches, created checklist items, and approvals, restoring the original dinner shift scenario."
        variant="warning"
        confirmText="Reset All Data"
      />
    </div>
  );
};

