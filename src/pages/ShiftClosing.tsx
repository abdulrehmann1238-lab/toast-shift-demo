import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { EmployeeAvatar } from '../components/common/EmployeeAvatar';
import { ConfirmationModal } from '../components/common/ConfirmationModal';
import { formatHours, formatCurrency, formatTime } from '../utils/formatters';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  CheckCircle2,
  Clock,
  DollarSign,
  ShieldCheck,
  AlertCircle,
  FileCheck,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  Lock,
  Download,
  RotateCcw,
  Users,
  Award,
  AlertTriangle
} from 'lucide-react';

export const ShiftClosing: React.FC = () => {
  const {
    shifts,
    employees,
    approvals,
    checklist,
    metrics,
    clockOut,
    handleApproval,
    completeAllChecklist,
    closingStage,
    setClosingStage,
    isClosingFinalized,
    completeClosingWorkflow,
    navigateTo,
    showToast
  } = useApp();

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    action: () => void;
    variant: 'primary' | 'warning';
    confirmText: string;
  }>({
    isOpen: false,
    title: '',
    message: '',
    action: () => {},
    variant: 'primary',
    confirmText: 'Confirm'
  });

  // Stages configuration
  const stages = [
    {
      num: 1,
      title: 'Review Attendance',
      desc: 'Verify scheduled team roster and floor check-ins',
      icon: <Users className="w-4 h-4" />
    },
    {
      num: 2,
      title: 'Confirm Clock-Outs',
      desc: 'Clear open shifts and sign off finished stations',
      icon: <Clock className="w-4 h-4" />
    },
    {
      num: 3,
      title: 'Review Shift Hours',
      desc: 'Audit overtime extensions and meal break records',
      icon: <FileCheck className="w-4 h-4" />
    },
    {
      num: 4,
      title: 'Cash & Tip Review',
      desc: 'Reconcile drawer balances and tip declarations',
      icon: <DollarSign className="w-4 h-4" />
    },
    {
      num: 5,
      title: 'Manager Approvals',
      desc: 'Resolve pending exceptions and discrepancy notes',
      icon: <ShieldCheck className="w-4 h-4" />
    },
    {
      num: 6,
      title: 'Finalize Closeout',
      desc: 'Sign off operational summary and lock shift records',
      icon: <Lock className="w-4 h-4" />
    }
  ];

  // Specific state filters
  const pendingClockouts = shifts.filter(s => s.status === 'pending_clockout' || s.status === 'active' || s.status === 'break');
  const pendingApprovals = approvals.filter(a => a.status === 'pending');
  const incompleteChecklist = checklist.filter(c => !c.completed);
  const totalEmployeesScheduled = shifts.length;
  const employeesClockedOut = shifts.filter(s => s.status === 'completed').length;
  const employeesStillActive = shifts.filter(s => s.status === 'active' || s.status === 'break').length;
  const shiftsRequiringReview = shifts.filter(s => !s.managerReviewed || s.cashVariance !== 0).length;

  const handleTriggerFinalCloseout = () => {
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 }
    });
    completeClosingWorkflow();
  };

  const handleExportClosingSummary = () => {
    const csvContent = [
      ['The Copper Room - Daily Shift Closing Summary'],
      ['Date', 'Shift Date: Today'],
      ['Manager', 'Alex Vance (General Manager)'],
      [''],
      ['Employee', 'Role', 'Clock-In', 'Clock-Out', 'Hours Worked', 'Declared Cash', 'Expected Cash', 'Variance', 'Declared Tips', 'Status'],
      ...shifts.map(s => [
        s.employeeName,
        s.role,
        s.actualClockIn || s.scheduledStart,
        s.actualClockOut || 'Active',
        s.hoursWorked.toString(),
        s.declaredCash.toString(),
        s.expectedCash.toString(),
        s.cashVariance.toString(),
        s.declaredTips.toString(),
        s.status
      ])
    ]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `copper_room_shift_closing_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Summary Exported', 'Shift closing CSV downloaded to your device.', 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-brand-border">
        <div>
          <div className="flex items-center gap-2 text-xs text-brand-sage-dark font-semibold tracking-wide uppercase mb-1">
            <Sparkles className="w-3.5 h-3.5 text-brand-sage" />
            <span>Central Operational Workflow</span>
          </div>
          <h2 className="text-2xl font-heading font-extrabold text-brand-text tracking-tight">
            Shift Closing
          </h2>
          <p className="text-xs sm:text-sm text-brand-text-secondary mt-1">
            Review employee shifts, resolve outstanding items, and complete your closing workflow.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-[11px] font-semibold text-brand-text-secondary uppercase">
              Closing Readiness
            </div>
            <div className="text-lg font-heading font-bold text-brand-text tabular-nums">
              {metrics.closingPercentage}%
            </div>
          </div>
          <div className="w-16 h-2 bg-brand-surface-subtle rounded-full overflow-hidden border border-brand-border">
            <div
              className="bg-brand-sage h-full rounded-full transition-all duration-300"
              style={{ width: `${metrics.closingPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* 9.1 Closing Overview KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
        <div className="p-3.5 rounded-xl bg-brand-surface border border-brand-border shadow-subtle">
          <div className="text-[11px] font-semibold uppercase text-brand-text-secondary">
            Scheduled
          </div>
          <div className="text-xl font-heading font-bold text-brand-text mt-1 tabular-nums">
            {totalEmployeesScheduled}
          </div>
          <div className="text-[10px] text-brand-text-secondary mt-0.5">Master roster count</div>
        </div>

        <div className="p-3.5 rounded-xl bg-brand-surface border border-brand-border shadow-subtle">
          <div className="text-[11px] font-semibold uppercase text-brand-text-secondary">
            Clocked Out
          </div>
          <div className="text-xl font-heading font-bold text-brand-sage-dark mt-1 tabular-nums">
            {employeesClockedOut}
          </div>
          <div className="text-[10px] text-brand-sage-dark mt-0.5">Shifts completed</div>
        </div>

        <div className="p-3.5 rounded-xl bg-brand-surface border border-brand-border shadow-subtle">
          <div className="text-[11px] font-semibold uppercase text-brand-text-secondary">
            Still Active
          </div>
          <div className="text-xl font-heading font-bold text-brand-text mt-1 tabular-nums">
            {employeesStillActive}
          </div>
          <div className="text-[10px] text-stone-500 mt-0.5">Floor / Break</div>
        </div>

        <div className="p-3.5 rounded-xl bg-brand-surface border border-brand-border shadow-subtle">
          <div className="text-[11px] font-semibold uppercase text-brand-text-secondary">
            Requiring Review
          </div>
          <div className="text-xl font-heading font-bold text-brand-terracotta mt-1 tabular-nums">
            {shiftsRequiringReview}
          </div>
          <div className="text-[10px] text-brand-terracotta mt-0.5">Variance or punch alert</div>
        </div>

        <div className="p-3.5 rounded-xl bg-brand-surface border border-brand-border shadow-subtle col-span-2 md:col-span-1">
          <div className="text-[11px] font-semibold uppercase text-brand-text-secondary">
            Closing Progress
          </div>
          <div className="text-xl font-heading font-bold text-brand-text mt-1 tabular-nums">
            {metrics.closingPercentage}%
          </div>
          <div className="text-[10px] text-brand-sage-dark mt-0.5">Ready for sign-off</div>
        </div>
      </div>

      {/* Guided 6-Stage Progress Stepper */}
      <div className="bg-brand-surface rounded-2xl border border-brand-border p-4 shadow-subtle">
        <div className="flex items-center justify-between pb-3 border-b border-brand-border mb-3">
          <div className="text-xs font-bold uppercase tracking-wider text-brand-text">
            End-of-Shift Staged Workflow
          </div>
          <span className="text-xs text-brand-text-secondary font-medium">
            Stage {closingStage} of 6
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
          {stages.map(st => {
            const isCompletedStage = closingStage > st.num || isClosingFinalized;
            const isCurrent = closingStage === st.num && !isClosingFinalized;

            return (
              <button
                key={st.num}
                onClick={() => setClosingStage(st.num)}
                className={`text-left p-3 rounded-xl border transition-all ${
                  isCurrent
                    ? 'bg-brand-sage-soft border-brand-sage text-brand-sage-dark shadow-sm ring-1 ring-brand-sage/40'
                    : isCompletedStage
                    ? 'bg-white border-brand-border hover:bg-brand-surface-subtle text-brand-text'
                    : 'bg-brand-surface-subtle border-brand-border/60 text-stone-400 hover:text-brand-text'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider">
                    0{st.num}
                  </span>
                  {isCompletedStage ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-sage" />
                  ) : (
                    st.icon
                  )}
                </div>
                <div className="text-xs font-semibold truncate">{st.title}</div>
                <div className="text-[10px] text-stone-500 truncate hidden lg:block mt-0.5">
                  {st.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* If Closing is Finalized: Celebratory Success View */}
      {isClosingFinalized ? (
        <div className="bg-white rounded-2xl border border-brand-sage/30 p-8 sm:p-12 text-center shadow-elevated space-y-6 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-2xl bg-brand-sage-soft text-brand-sage-dark mx-auto flex items-center justify-center shadow-subtle">
            <Award className="w-8 h-8" />
          </div>

          <div className="max-w-lg mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-sage-dark">
              Closing Successfully Finalized
            </span>
            <h3 className="text-2xl sm:text-3xl font-heading font-extrabold text-brand-text mt-2 mb-3">
              Tonight's Service is Fully Reconciled
            </h3>
            <p className="text-xs sm:text-sm text-brand-text-secondary leading-relaxed">
              All 12 employee attendance records, drawer cash totals, credit tip declarations, and manager approvals have been digitally signed and archived for payroll processing.
            </p>
          </div>

          <div className="max-w-md mx-auto p-4 rounded-xl bg-brand-surface-subtle border border-brand-border text-xs text-left space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-brand-text-secondary">Closing Manager:</span>
              <span className="font-semibold text-brand-text">Alex Vance (GM)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-brand-text-secondary">Venue:</span>
              <span className="font-semibold text-brand-text">The Copper Room – Las Vegas</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-brand-text-secondary">Total Labor Hours:</span>
              <span className="font-semibold text-brand-text tabular-nums">
                {shifts.reduce((acc, s) => acc + s.hoursWorked, 0).toFixed(1)} hrs
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-brand-text-secondary">Declared Tips:</span>
              <span className="font-semibold text-brand-text tabular-nums">
                {formatCurrency(metrics.totalDeclaredTips)}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={handleExportClosingSummary}
              className="px-5 py-2.5 bg-brand-sidebar hover:bg-stone-900 text-white rounded-xl text-xs font-semibold shadow-subtle flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download Closing CSV Summary</span>
            </button>

            <button
              onClick={() => navigateTo('reports')}
              className="px-5 py-2.5 bg-brand-surface hover:bg-brand-surface-subtle border border-brand-border text-brand-text rounded-xl text-xs font-semibold shadow-subtle flex items-center gap-2"
            >
              <span>View Reporting Analytics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        /* Guided Stage Content Container */
        <div className="space-y-6">
          {/* Stage 1: Attendance Review */}
          {closingStage === 1 && (
            <div className="bg-brand-surface rounded-2xl border border-brand-border p-6 shadow-subtle space-y-6">
              <div className="flex items-start justify-between pb-4 border-b border-brand-border">
                <div>
                  <h3 className="text-base font-heading font-bold text-brand-text">
                    Stage 1: Review Employee Attendance
                  </h3>
                  <p className="text-xs text-brand-text-secondary mt-0.5">
                    Confirm all 12 rostered team members arrived and were logged at their assigned service stations.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setClosingStage(2);
                    showToast('Stage 1 Confirmed', 'Attendance verified against Toast master roster.', 'info');
                  }}
                  className="px-4 py-2 bg-brand-sidebar hover:bg-stone-900 text-white rounded-xl text-xs font-semibold shadow-subtle flex items-center gap-2"
                >
                  <span>Proceed to Clock-Outs (Stage 2)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Roster attendance status check */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {shifts.map(shift => {
                  const emp = employees.find(e => e.id === shift.employeeId);
                  return (
                    <div
                      key={shift.id}
                      className="p-3.5 rounded-xl border border-brand-border bg-white flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <EmployeeAvatar name={shift.employeeName} avatar={emp?.avatar} size="sm" />
                        <div>
                          <div className="font-semibold text-xs text-brand-text">{shift.employeeName}</div>
                          <div className="text-[11px] text-brand-text-secondary">{shift.role}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-semibold text-brand-sage-dark">
                          {shift.actualClockIn || shift.scheduledStart}
                        </div>
                        <div className="text-[10px] text-stone-400">Scheduled {shift.scheduledStart}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Stage 2: Confirm Clock-Outs */}
          {closingStage === 2 && (
            <div className="bg-brand-surface rounded-2xl border border-brand-border p-6 shadow-subtle space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-brand-border gap-4">
                <div>
                  <h3 className="text-base font-heading font-bold text-brand-text">
                    Stage 2: Confirm Employee Clock-Outs
                  </h3>
                  <p className="text-xs text-brand-text-secondary mt-0.5">
                    Resolve remaining open shifts to prevent unauthorized overnight labor hours.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {pendingClockouts.length > 0 && (
                    <button
                      onClick={() => {
                        setConfirmModal({
                          isOpen: true,
                          title: 'Batch Clock Out Remaining Staff?',
                          message: `This will mark all ${pendingClockouts.length} active/pending staff members as clocked out for end-of-night.`,
                          variant: 'primary',
                          confirmText: 'Batch Clock Out',
                          action: () => {
                            pendingClockouts.forEach(s => clockOut(s.employeeId));
                            showToast('Batch Sign-Off Complete', 'All pending team members clocked out.', 'success');
                          }
                        });
                      }}
                      className="px-3 py-2 bg-brand-surface hover:bg-brand-surface-subtle text-brand-text border border-brand-border rounded-xl text-xs font-semibold transition-colors"
                    >
                      Batch Clock-Out All ({pendingClockouts.length})
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setClosingStage(3);
                      showToast('Stage 2 Complete', 'Employee clock-outs finalized.', 'info');
                    }}
                    className="px-4 py-2 bg-brand-sidebar hover:bg-stone-900 text-white rounded-xl text-xs font-semibold shadow-subtle flex items-center gap-2"
                  >
                    <span>Proceed to Hours Review (Stage 3)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Outstanding clock-outs table */}
              <div className="space-y-3">
                <div className="text-xs font-semibold text-brand-text">
                  Shifts Pending Sign-Off ({pendingClockouts.length})
                </div>

                {pendingClockouts.length === 0 ? (
                  <div className="p-6 text-center rounded-xl bg-brand-sage-soft border border-brand-sage/20 text-brand-sage-dark text-xs font-medium flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-sage" />
                    <span>All floor staff members have completed their clock-outs!</span>
                  </div>
                ) : (
                  <div className="divide-y divide-brand-border border border-brand-border rounded-xl overflow-hidden bg-white">
                    {pendingClockouts.map(shift => (
                      <div key={shift.id} className="p-4 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <EmployeeAvatar name={shift.employeeName} size="sm" status={shift.status as any} />
                          <div>
                            <div className="font-semibold text-brand-text">{shift.employeeName}</div>
                            <div className="text-[11px] text-brand-text-secondary">{shift.role} • Clock-in: {shift.actualClockIn}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <span className="font-semibold text-brand-text tabular-nums">{formatHours(shift.hoursWorked)}</span>
                            <div className="text-[10px] text-stone-400">Total hours</div>
                          </div>

                          <button
                            onClick={() => clockOut(shift.employeeId)}
                            className="px-3 py-1.5 bg-brand-sidebar hover:bg-stone-900 text-white rounded-lg text-xs font-medium"
                          >
                            Clock Out Now
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Stage 3: Review Shift Hours */}
          {closingStage === 3 && (
            <div className="bg-brand-surface rounded-2xl border border-brand-border p-6 shadow-subtle space-y-6">
              <div className="flex items-start justify-between pb-4 border-b border-brand-border">
                <div>
                  <h3 className="text-base font-heading font-bold text-brand-text">
                    Stage 3: Review Shift Hours & Overtime Exceptions
                  </h3>
                  <p className="text-xs text-brand-text-secondary mt-0.5">
                    Examine elapsed durations, verify meal break compliance, and authorize overtime.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setClosingStage(4);
                    showToast('Stage 3 Confirmed', 'Hours and meal break audit verified.', 'info');
                  }}
                  className="px-4 py-2 bg-brand-sidebar hover:bg-stone-900 text-white rounded-xl text-xs font-semibold shadow-subtle flex items-center gap-2"
                >
                  <span>Proceed to Cash & Tips (Stage 4)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Overtime card alert */}
              <div className="p-4 rounded-xl bg-brand-amber-soft border border-brand-amber/30 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-brand-amber flex-shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-semibold text-amber-900">
                    Kitchen Overtime Exception Logged: Daniel Foster (+0.75h)
                  </div>
                  <p className="text-amber-800 mt-0.5 leading-relaxed">
                    Authorized for late dinner banquet prep. Ready for manager sign-off in the Approvals stage.
                  </p>
                </div>
              </div>

              {/* Hours Breakdown Table */}
              <div className="overflow-x-auto border border-brand-border rounded-xl">
                <table className="w-full text-left text-xs bg-white">
                  <thead>
                    <tr className="bg-brand-surface-subtle border-b border-brand-border text-brand-text-secondary font-semibold uppercase text-[10px]">
                      <th className="py-2.5 px-4">Employee</th>
                      <th className="py-2.5 px-3">Role</th>
                      <th className="py-2.5 px-3">Scheduled</th>
                      <th className="py-2.5 px-3">Actual Hours</th>
                      <th className="py-2.5 px-3">Break Log</th>
                      <th className="py-2.5 px-4 text-right">Variance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-border">
                    {shifts.map(s => {
                      const varianceHours = s.hoursWorked - 6.0;
                      return (
                        <tr key={s.id} className="hover:bg-brand-surface-subtle">
                          <td className="py-2.5 px-4 font-semibold text-brand-text">{s.employeeName}</td>
                          <td className="py-2.5 px-3 text-brand-text-secondary">{s.role}</td>
                          <td className="py-2.5 px-3 tabular-nums">{s.scheduledStart} - {s.scheduledEnd}</td>
                          <td className="py-2.5 px-3 font-semibold text-brand-text tabular-nums">{formatHours(s.hoursWorked)}</td>
                          <td className="py-2.5 px-3 text-stone-500">
                            {s.breakDurationMinutes > 0 ? `${s.breakDurationMinutes}m meal break` : 'None'}
                          </td>
                          <td className="py-2.5 px-4 text-right tabular-nums">
                            {s.hoursWorked > 8 ? (
                              <span className="text-brand-terracotta font-semibold">Overtime</span>
                            ) : (
                              <span className="text-stone-400">Regular</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Stage 4: Cash & Tip Review */}
          {closingStage === 4 && (
            <div className="bg-brand-surface rounded-2xl border border-brand-border p-6 shadow-subtle space-y-6">
              <div className="flex items-start justify-between pb-4 border-b border-brand-border">
                <div>
                  <h3 className="text-base font-heading font-bold text-brand-text">
                    Stage 4: Review Cash and Tip Declarations
                  </h3>
                  <p className="text-xs text-brand-text-secondary mt-0.5">
                    Compare declared server drawer turn-ins against Toast expected sales.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setClosingStage(5);
                    showToast('Stage 4 Complete', 'Drawer count summaries confirmed.', 'info');
                  }}
                  className="px-4 py-2 bg-brand-sidebar hover:bg-stone-900 text-white rounded-xl text-xs font-semibold shadow-subtle flex items-center gap-2"
                >
                  <span>Proceed to Approvals (Stage 5)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Financial summary strips */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-3.5 bg-brand-surface-subtle rounded-xl border border-brand-border">
                  <div className="text-[10px] font-semibold uppercase text-brand-text-secondary">Expected Cash</div>
                  <div className="text-xl font-bold text-brand-text tabular-nums mt-1">
                    {formatCurrency(metrics.totalExpectedCash)}
                  </div>
                </div>

                <div className="p-3.5 bg-brand-surface-subtle rounded-xl border border-brand-border">
                  <div className="text-[10px] font-semibold uppercase text-brand-text-secondary">Declared Cash</div>
                  <div className="text-xl font-bold text-brand-text tabular-nums mt-1">
                    {formatCurrency(metrics.totalDeclaredCash)}
                  </div>
                </div>

                <div className="p-3.5 bg-brand-surface-subtle rounded-xl border border-brand-border">
                  <div className="text-[10px] font-semibold uppercase text-brand-text-secondary">Net Variance</div>
                  <div className={`text-xl font-bold tabular-nums mt-1 ${metrics.totalCashVariance < 0 ? 'text-brand-terracotta' : 'text-brand-sage-dark'}`}>
                    {formatCurrency(metrics.totalCashVariance)}
                  </div>
                </div>

                <div className="p-3.5 bg-brand-surface-subtle rounded-xl border border-brand-border">
                  <div className="text-[10px] font-semibold uppercase text-brand-text-secondary">Total Declared Tips</div>
                  <div className="text-xl font-bold text-brand-text tabular-nums mt-1">
                    {formatCurrency(metrics.totalDeclaredTips)}
                  </div>
                </div>
              </div>

              {/* Flagged Item Highlight */}
              <div className="p-4 rounded-xl border border-brand-terracotta/30 bg-brand-terracotta-soft text-xs space-y-1">
                <div className="font-semibold text-brand-terracotta flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Drawer Variance Requiring Manager Attention: Lucas Ramirez (-$25.00)</span>
                </div>
                <p className="text-stone-700 leading-relaxed">
                  Lucas declared $100.00 cash vs expected $125.00 due to a paper promotional voucher. You can approve this adjustment in the next stage.
                </p>
              </div>
            </div>
          )}

          {/* Stage 5: Manager Approvals */}
          {closingStage === 5 && (
            <div className="bg-brand-surface rounded-2xl border border-brand-border p-6 shadow-subtle space-y-6">
              <div className="flex items-start justify-between pb-4 border-b border-brand-border">
                <div>
                  <h3 className="text-base font-heading font-bold text-brand-text">
                    Stage 5: Complete Required Manager Approvals
                  </h3>
                  <p className="text-xs text-brand-text-secondary mt-0.5">
                    Resolve operational exceptions (missing punches, cash discrepancies, overtime).
                  </p>
                </div>

                <button
                  onClick={() => {
                    setClosingStage(6);
                    showToast('Stage 5 Confirmed', 'Manager sign-off completed.', 'info');
                  }}
                  className="px-4 py-2 bg-brand-sidebar hover:bg-stone-900 text-white rounded-xl text-xs font-semibold shadow-subtle flex items-center gap-2"
                >
                  <span>Proceed to Final Closeout (Stage 6)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3">
                {approvals.map(app => (
                  <div
                    key={app.id}
                    className="p-4 rounded-xl border border-brand-border bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-brand-text">{app.employeeName}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-surface-subtle font-mono text-stone-500">
                          {app.type.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-brand-text-secondary mt-1">{app.description}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      {app.status === 'pending' ? (
                        <>
                          <button
                            onClick={() => handleApproval(app.id, 'rejected')}
                            className="px-3 py-1.5 text-xs text-brand-terracotta hover:bg-brand-terracotta-soft border border-brand-border rounded-lg"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => handleApproval(app.id, 'approved')}
                            className="px-3 py-1.5 text-xs font-semibold bg-brand-sidebar hover:bg-stone-900 text-white rounded-lg shadow-subtle"
                          >
                            Approve
                          </button>
                        </>
                      ) : (
                        <StatusBadge status={app.status} size="sm" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stage 6: Finalize Closeout */}
          {closingStage === 6 && (
            <div className="bg-brand-surface rounded-2xl border border-brand-border p-6 shadow-subtle space-y-6">
              <div className="flex items-start justify-between pb-4 border-b border-brand-border">
                <div>
                  <h3 className="text-base font-heading font-bold text-brand-text">
                    Stage 6: Finalize Closing Summary
                  </h3>
                  <p className="text-xs text-brand-text-secondary mt-0.5">
                    Confirm all checklist items and digitally lock the shift operations.
                  </p>
                </div>
              </div>

              {/* Pre-flight checklist status */}
              <div className="p-4 rounded-xl bg-brand-surface-subtle border border-brand-border space-y-3 text-xs">
                <div className="font-semibold text-brand-text flex items-center justify-between">
                  <span>Closing Checklist Status:</span>
                  <span className="font-bold text-brand-sage-dark">
                    {metrics.checklistCompletedCount} of {metrics.checklistTotalCount} Tasks Complete
                  </span>
                </div>

                {metrics.checklistCompletedCount < metrics.checklistTotalCount && (
                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-brand-text-secondary">
                      You can auto-verify remaining operational tasks for the demo:
                    </span>
                    <button
                      onClick={completeAllChecklist}
                      className="px-3 py-1.5 bg-brand-sage-soft hover:bg-emerald-100 text-brand-sage-dark rounded-lg font-semibold text-xs border border-brand-sage/30"
                    >
                      Complete All Checklist Items
                    </button>
                  </div>
                )}
              </div>

              <div className="p-6 rounded-2xl border border-brand-border bg-white text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-brand-sage-soft text-brand-sage-dark mx-auto flex items-center justify-center">
                  <Lock className="w-6 h-6" />
                </div>
                <div className="max-w-md mx-auto">
                  <h4 className="text-base font-heading font-bold text-brand-text">
                    Ready to Complete Shift Closing
                  </h4>
                  <p className="text-xs text-brand-text-secondary mt-1">
                    Clicking the button below will lock tonight's business day, freeze terminal punch edits, and generate the final operational summary.
                  </p>
                </div>

                <button
                  onClick={handleTriggerFinalCloseout}
                  className="px-8 py-3.5 bg-brand-sidebar hover:bg-stone-900 text-white rounded-xl text-xs font-semibold shadow-elevated transition-all inline-flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-brand-sage-soft" />
                  <span>Finalize & Lock Shift Closeout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 9.2 Complete Employee Closing Table */}
      <div className="bg-brand-surface rounded-2xl border border-brand-border shadow-subtle p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-brand-border">
          <div>
            <h3 className="text-base font-heading font-bold text-brand-text">
              Employee Shift Closing Roster
            </h3>
            <p className="text-xs text-brand-text-secondary mt-0.5">
              Comprehensive closing status across all floor and kitchen stations
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-brand-border text-brand-text-secondary text-[11px] font-semibold uppercase tracking-wider">
                <th className="pb-3 px-2">Employee</th>
                <th className="pb-3 px-2">Position</th>
                <th className="pb-3 px-2">Clock-In</th>
                <th className="pb-3 px-2">Clock-Out</th>
                <th className="pb-3 px-2 text-right">Total Hours</th>
                <th className="pb-3 px-2">Cash & Tips</th>
                <th className="pb-3 px-2">Manager Review</th>
                <th className="pb-3 px-2 text-right">Closing Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {shifts.map(shift => {
                const emp = employees.find(e => e.id === shift.employeeId);
                const isCompleted = shift.status === 'completed';

                return (
                  <tr key={shift.id} className="hover:bg-brand-surface-subtle transition-colors">
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2.5">
                        <EmployeeAvatar name={shift.employeeName} avatar={emp?.avatar} size="sm" />
                        <span className="font-semibold text-brand-text">{shift.employeeName}</span>
                      </div>
                    </td>

                    <td className="py-3 px-2 text-brand-text-secondary">{shift.role}</td>

                    <td className="py-3 px-2 tabular-nums text-brand-text">
                      {shift.actualClockIn || shift.scheduledStart}
                    </td>

                    <td className="py-3 px-2 tabular-nums">
                      {shift.actualClockOut || (
                        <span className="text-amber-800 font-medium">Pending out</span>
                      )}
                    </td>

                    <td className="py-3 px-2 text-right font-semibold tabular-nums text-brand-text">
                      {formatHours(shift.hoursWorked)}
                    </td>

                    <td className="py-3 px-2">
                      {shift.cashVariance !== 0 ? (
                        <span className="text-brand-terracotta font-semibold">
                          Var: {formatCurrency(shift.cashVariance)}
                        </span>
                      ) : (
                        <span className="text-stone-500">
                          Tips: {formatCurrency(shift.declaredTips)}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-2">
                      {shift.managerReviewed ? (
                        <span className="text-brand-sage-dark font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-brand-sage" />
                          <span>Reviewed</span>
                        </span>
                      ) : (
                        <span className="text-brand-amber font-medium">Awaiting review</span>
                      )}
                    </td>

                    <td className="py-3 px-2 text-right">
                      <StatusBadge
                        status={isCompleted ? 'completed' : shift.status}
                        label={isCompleted ? 'Completed' : 'In Progress'}
                        size="sm"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={confirmModal.action}
        title={confirmModal.title}
        message={confirmModal.message}
        variant={confirmModal.variant}
        confirmText={confirmModal.confirmText}
      />
    </div>
  );
};

