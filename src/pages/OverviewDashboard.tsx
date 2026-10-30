import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { MetricCard } from '../components/common/MetricCard';
import { StatusBadge } from '../components/common/StatusBadge';
import { EmployeeAvatar } from '../components/common/EmployeeAvatar';
import { formatHours, formatTime } from '../utils/formatters';
import {
  Users,
  Clock,
  AlertCircle,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Calendar,
  Filter,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  DollarSign
} from 'lucide-react';

export const OverviewDashboard: React.FC = () => {
  const {
    navigateTo,
    employees,
    shifts,
    activities,
    checklist,
    approvals,
    metrics,
    selectedDate,
    setSelectedDate,
    showToast
  } = useApp();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [greeting, setGreeting] = useState('Good evening');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      showToast('Dashboard Refreshed', 'Synced latest Toast shift events and register drops.', 'info');
    }, 600);
  };

  // Top floor team members to highlight
  const floorTeam = shifts.slice(0, 6);

  // Summary counts for End-of-Day readiness
  const completedClockouts = shifts.filter(s => s.status === 'completed').length;
  const totalScheduled = shifts.length;
  const reconciledDrawers = shifts.filter(s => s.reconciliationStatus === 'reviewed').length;
  const totalDrawersWithCash = shifts.filter(s => s.declaredCash > 0 || s.expectedCash > 0).length || 2;
  const approvedCount = approvals.filter(a => a.status === 'approved').length;
  const totalApprovals = approvals.length;
  const checklistChecked = checklist.filter(c => c.completed).length;
  const checklistTotal = checklist.length;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Welcome Banner & Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-brand-border">
        <div>
          <div className="flex items-center gap-2 text-xs text-brand-sage-dark font-semibold tracking-wide uppercase mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span>Operational Console — Live Shift</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-brand-text tracking-tight">
            {greeting}, Alex.
          </h2>
          <p className="text-xs sm:text-sm text-brand-text-secondary mt-1">
            Here's what's happening across your restaurant and bar floor today.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Date Selector Filter */}
          <div className="flex items-center gap-1.5 px-3 py-2 bg-brand-surface border border-brand-border rounded-xl text-xs font-medium text-brand-text shadow-subtle">
            <Calendar className="w-3.5 h-3.5 text-stone-500" />
            <select
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                showToast('Filter Applied', `Viewing shift data for ${e.target.value}`, 'info');
              }}
              className="bg-transparent border-none text-xs font-medium text-brand-text focus:outline-none cursor-pointer"
            >
              <option value="Today, Oct 31">Today (Dinner Shift)</option>
              <option value="Yesterday, Oct 30">Yesterday (Closed)</option>
              <option value="Thu, Oct 29">Thursday (Closed)</option>
            </select>
          </div>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2.5 bg-brand-surface hover:bg-brand-surface-subtle text-brand-text border border-brand-border rounded-xl shadow-subtle transition-all disabled:opacity-60"
            title="Refresh shift data"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-brand-sage' : ''}`} />
          </button>

          {/* Continue Closing CTA */}
          <button
            onClick={() => navigateTo('shift_closing')}
            className="px-4 py-2 bg-brand-sidebar hover:bg-stone-900 text-white rounded-xl text-xs font-semibold shadow-subtle hover:shadow-elevated transition-all flex items-center gap-2 group"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-sage-soft" />
            <span>Continue Closing</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* 6.1 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <MetricCard
          title="Employees on Shift"
          value={metrics.employeesOnShiftCount}
          subtitle="+2 compared with the previous shift"
          icon={<Users className="w-4 h-4" />}
          trend={{ text: '+2 shift change', positive: true }}
          onClick={() => navigateTo('live_shifts')}
        />

        <MetricCard
          title="Active Shifts"
          value={`${metrics.activeShiftsCount} active`}
          subtitle={`${metrics.completedShiftsCount} shifts completed today`}
          icon={<Clock className="w-4 h-4" />}
          onClick={() => navigateTo('live_shifts')}
        />

        <MetricCard
          title="Pending Clock-Outs"
          value={metrics.pendingClockoutsCount}
          subtitle="Employees ready for checkout review"
          icon={<AlertCircle className="w-4 h-4" />}
          highlight={metrics.pendingClockoutsCount > 0}
          trend={metrics.pendingClockoutsCount > 0 ? { text: 'Action required', positive: false } : { text: 'All signed off', positive: true }}
          onClick={() => navigateTo('shift_closing')}
        />

        <MetricCard
          title="Closing Progress"
          value={`${metrics.closingPercentage}%`}
          subtitle={`${metrics.checklistCompletedCount} of ${metrics.checklistTotalCount} closing steps completed`}
          icon={<Sparkles className="w-4 h-4" />}
          progress={metrics.closingPercentage}
          onClick={() => navigateTo('shift_closing')}
        />
      </div>

      {/* Main Grid: Team on Floor & Closing Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 6.3 Employee Status Panel: Team on the Floor */}
        <div className="lg:col-span-2 bg-brand-surface rounded-2xl border border-brand-border p-6 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-brand-border">
              <div>
                <h3 className="text-base font-heading font-bold text-brand-text">
                  Team on the Floor
                </h3>
                <p className="text-xs text-brand-text-secondary mt-0.5">
                  Current staff status, assigned roles, and elapsed hours
                </p>
              </div>

              <button
                onClick={() => navigateTo('live_shifts')}
                className="text-xs font-semibold text-brand-sage-dark hover:text-stone-900 flex items-center gap-1 hover:underline"
              >
                <span>View all ({shifts.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Employee Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-brand-border text-brand-text-secondary text-[11px] font-semibold uppercase tracking-wider">
                    <th className="pb-3 font-semibold">Employee</th>
                    <th className="pb-3 font-semibold">Role</th>
                    <th className="pb-3 font-semibold">Shift Start</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold text-right">Elapsed Time</th>
                    <th className="pb-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border">
                  {floorTeam.map(shift => {
                    const emp = employees.find(e => e.id === shift.employeeId);
                    return (
                      <tr
                        key={shift.id}
                        className="hover:bg-brand-surface-subtle transition-colors group"
                      >
                        <td className="py-3 pr-3">
                          <div
                            onClick={() => navigateTo('employee_profile', shift.employeeId)}
                            className="flex items-center gap-3 cursor-pointer"
                          >
                            <EmployeeAvatar
                              name={shift.employeeName}
                              avatar={emp?.avatar}
                              size="sm"
                              status={
                                shift.status === 'active'
                                  ? 'active'
                                  : shift.status === 'break'
                                  ? 'break'
                                  : 'off_duty'
                              }
                            />
                            <div>
                              <div className="font-semibold text-brand-text group-hover:text-brand-sage-dark transition-colors">
                                {shift.employeeName}
                              </div>
                              <div className="text-[10px] text-brand-text-secondary">
                                {emp?.toastEmployeeId || 'TOAST-POS'}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 text-brand-text-secondary font-medium">
                          {shift.role}
                        </td>

                        <td className="py-3 tabular-nums text-brand-text">
                          {shift.actualClockIn ? formatTime(shift.actualClockIn) : shift.scheduledStart}
                        </td>

                        <td className="py-3">
                          <StatusBadge status={shift.status} size="sm" />
                        </td>

                        <td className="py-3 text-right font-medium tabular-nums text-brand-text">
                          {formatHours(shift.hoursWorked)}
                        </td>

                        <td className="py-3 text-right">
                          <button
                            onClick={() => navigateTo('employee_profile', shift.employeeId)}
                            className="text-xs text-brand-sage-dark hover:text-stone-900 font-medium px-2 py-1 rounded hover:bg-white transition-colors"
                          >
                            Profile
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-brand-border flex items-center justify-between text-xs text-brand-text-secondary">
            <span>Showing {floorTeam.length} active hospitality staff members</span>
            <button
              onClick={() => navigateTo('employees')}
              className="font-medium text-brand-text hover:text-brand-sage-dark flex items-center gap-1"
            >
              <span>Manage Roster</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 6.4 Closing Progress Panel: End-of-Day Readiness */}
        <div className="bg-brand-surface rounded-2xl border border-brand-border p-6 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-brand-border">
              <div>
                <h3 className="text-base font-heading font-bold text-brand-text">
                  End-of-Day Readiness
                </h3>
                <p className="text-xs text-brand-text-secondary mt-0.5">
                  Pre-closing audit completion
                </p>
              </div>
              <span className="text-xl font-heading font-bold text-brand-text tabular-nums">
                {metrics.closingPercentage}%
              </span>
            </div>

            {/* Overall Progress Bar */}
            <div className="w-full bg-brand-surface-subtle h-2.5 rounded-full overflow-hidden mb-6">
              <div
                className="bg-brand-sage h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${metrics.closingPercentage}%` }}
              />
            </div>

            {/* Checklist items summary */}
            <div className="space-y-3.5 text-xs">
              <div
                onClick={() => navigateTo('shift_closing')}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-brand-surface-subtle transition-colors cursor-pointer border border-brand-border/60"
              >
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-brand-sage" />
                  <span className="font-medium text-brand-text">Employee Clock-Outs</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="tabular-nums font-semibold text-brand-text">
                    {completedClockouts}/{totalScheduled}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                </div>
              </div>

              <div
                onClick={() => navigateTo('reconciliation')}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-brand-surface-subtle transition-colors cursor-pointer border border-brand-border/60"
              >
                <div className="flex items-center gap-2.5">
                  <DollarSign className="w-4 h-4 text-brand-terracotta" />
                  <span className="font-medium text-brand-text">Cash Reconciliation</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="tabular-nums font-semibold text-brand-text">
                    {reconciledDrawers}/{totalDrawersWithCash} drawers
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                </div>
              </div>

              <div
                onClick={() => navigateTo('reconciliation')}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-brand-surface-subtle transition-colors cursor-pointer border border-brand-border/60"
              >
                <div className="flex items-center gap-2.5">
                  <DollarSign className="w-4 h-4 text-brand-amber" />
                  <span className="font-medium text-brand-text">Tip Declarations Review</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="tabular-nums font-semibold text-brand-text">1/1 verified</span>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                </div>
              </div>

              <div
                onClick={() => navigateTo('approvals')}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-brand-surface-subtle transition-colors cursor-pointer border border-brand-border/60"
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-brand-sage" />
                  <span className="font-medium text-brand-text">Manager Approvals</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="tabular-nums font-semibold text-brand-text">
                    {approvedCount}/{totalApprovals}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                </div>
              </div>

              <div
                onClick={() => navigateTo('checklist')}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-brand-surface-subtle transition-colors cursor-pointer border border-brand-border/60"
              >
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-sage" />
                  <span className="font-medium text-brand-text">Closing Checklist</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="tabular-nums font-semibold text-brand-text">
                    {checklistChecked}/{checklistTotal}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-brand-border">
            <button
              onClick={() => navigateTo('shift_closing')}
              className="w-full py-3 bg-brand-sidebar hover:bg-stone-900 text-white rounded-xl text-xs font-semibold shadow-subtle hover:shadow-elevated transition-all flex items-center justify-center gap-2"
            >
              <span>Continue Closing Workflow</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 6.2 Live Operations Panel: Today's Shift Activity */}
      <div className="bg-brand-surface rounded-2xl border border-brand-border p-6 shadow-subtle">
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-brand-border">
          <div>
            <h3 className="text-base font-heading font-bold text-brand-text">
              Today's Shift Activity
            </h3>
            <p className="text-xs text-brand-text-secondary mt-0.5">
              Chronological operational feed of punches, meal breaks, and approvals
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-brand-text-secondary font-medium">Live Terminal Stream</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activities.slice(0, 6).map(act => (
            <div
              key={act.id}
              className="p-4 rounded-xl bg-brand-surface-subtle border border-brand-border flex items-start gap-3 hover:border-brand-border-strong transition-colors"
            >
              <EmployeeAvatar
                name={act.employeeName || 'System'}
                avatar={act.avatar}
                size="sm"
                className="mt-0.5"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="font-semibold text-xs text-brand-text truncate">
                    {act.employeeName || 'Management'}
                  </span>
                  <span className="text-[10px] text-brand-text-secondary tabular-nums whitespace-nowrap">
                    {act.timestamp}
                  </span>
                </div>
                <p className="text-xs text-brand-text-secondary mt-1 leading-relaxed">
                  {act.action}
                </p>
                <div className="mt-2 flex items-center gap-1.5">
                  <span
                    className={`inline-block w-1.5 h-1.5 rounded-full ${
                      act.badgeColor === 'terracotta'
                        ? 'bg-brand-terracotta'
                        : act.badgeColor === 'amber'
                        ? 'bg-brand-amber'
                        : 'bg-brand-sage'
                    }`}
                  />
                  <span className="text-[10px] uppercase font-semibold tracking-wider text-brand-text-secondary">
                    {act.type.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

