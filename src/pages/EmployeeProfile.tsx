import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { EmployeeAvatar } from '../components/common/EmployeeAvatar';
import { StatusBadge } from '../components/common/StatusBadge';
import { formatHours, formatCurrency } from '../utils/formatters';
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Clock,
  Shield,
  FileText,
  DollarSign,
  Save,
  CheckCircle2,
  Edit2
} from 'lucide-react';

export const EmployeeProfile: React.FC = () => {
  const {
    selectedEmployeeId,
    employees,
    shifts,
    activities,
    updateEmployee,
    navigateTo,
    showToast
  } = useApp();

  // Find employee or fallback
  const employee = employees.find(e => e.id === selectedEmployeeId) || employees[0];

  // Editable state
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [managerNotes, setManagerNotes] = useState(employee?.notes || '');
  const [hourlyRate, setHourlyRate] = useState(employee?.hourlyRate?.toString() || '15.00');

  // Employee's shifts & activities
  const employeeShifts = shifts.filter(s => s.employeeId === employee.id);
  const employeeActivities = activities.filter(a => a.employeeId === employee.id);

  const handleSaveNotes = () => {
    updateEmployee(employee.id, {
      notes: managerNotes,
      hourlyRate: parseFloat(hourlyRate) || employee.hourlyRate
    });
    setIsEditingNotes(false);
    showToast('Profile Updated', 'Manager notes and rate saved to employee record.', 'success');
  };

  const isActive = employee.status === 'active' || employee.status === 'break';

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigateTo('employees')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-brand-text-secondary hover:text-brand-text transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Employee Directory</span>
        </button>
      </div>

      {/* Profile Header Card */}
      <div className="bg-brand-surface rounded-2xl border border-brand-border p-6 shadow-subtle">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-brand-border">
          <div className="flex items-center gap-5">
            <EmployeeAvatar
              name={employee.fullName}
              avatar={employee.avatar}
              size="xl"
              status={employee.status}
            />
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-brand-text">
                  {employee.fullName}
                </h2>
                <StatusBadge
                  status={isActive ? 'active' : 'scheduled'}
                  label={isActive ? 'On Floor Shift' : 'Off Duty'}
                />
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-brand-text-secondary mt-1">
                <span className="font-semibold text-brand-text">{employee.role}</span>
                <span>•</span>
                <span className="font-mono text-stone-500">{employee.toastEmployeeId}</span>
                <span>•</span>
                <span>Rate: {formatCurrency(employee.hourlyRate)}/hr</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateTo('live_shifts')}
              className="px-4 py-2 bg-brand-surface hover:bg-brand-surface-subtle text-brand-text border border-brand-border rounded-xl text-xs font-semibold shadow-subtle transition-colors"
            >
              Floor Management
            </button>
          </div>
        </div>

        {/* Contact Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs">
          <div className="flex items-center gap-2.5 text-brand-text">
            <Mail className="w-4 h-4 text-stone-400" />
            <span className="truncate">{employee.email}</span>
          </div>

          <div className="flex items-center gap-2.5 text-brand-text">
            <Phone className="w-4 h-4 text-stone-400" />
            <span>{employee.phone}</span>
          </div>

          <div className="flex items-center gap-2.5 text-brand-text">
            <Clock className="w-4 h-4 text-stone-400" />
            <span>Last shift logged: {employee.lastShiftDate}</span>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-brand-surface border border-brand-border shadow-subtle">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-brand-text-secondary">
            Hours Logged This Week
          </div>
          <div className="text-2xl font-heading font-bold text-brand-text mt-1 tabular-nums">
            {employee.hoursThisWeek} hrs
          </div>
          <div className="text-[11px] text-brand-sage-dark font-medium mt-1">
            Standard schedule compliance
          </div>
        </div>

        <div className="p-4 rounded-xl bg-brand-surface border border-brand-border shadow-subtle">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-brand-text-secondary">
            Total Shifts Recorded
          </div>
          <div className="text-2xl font-heading font-bold text-brand-text mt-1 tabular-nums">
            {employeeShifts.length || 1}
          </div>
          <div className="text-[11px] text-brand-text-secondary font-medium mt-1">
            Current pay cycle
          </div>
        </div>

        <div className="p-4 rounded-xl bg-brand-surface border border-brand-border shadow-subtle">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-brand-text-secondary">
            Toast Audit Status
          </div>
          <div className="text-lg font-heading font-bold text-brand-sage-dark mt-1">
            Verified Active
          </div>
          <div className="text-[11px] text-brand-text-secondary font-medium mt-1">
            Terminal PIN & Card Swipe mapped
          </div>
        </div>
      </div>

      {/* Main split: Shift History & Editable Manager Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Shifts & Punches */}
        <div className="lg:col-span-2 bg-brand-surface rounded-2xl border border-brand-border p-6 shadow-subtle">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-brand-border">
            <div>
              <h3 className="text-base font-heading font-bold text-brand-text">
                Recent Shifts & Punch Record
              </h3>
              <p className="text-xs text-brand-text-secondary mt-0.5">
                Audit trail of terminal punches and reported hours
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-brand-border text-brand-text-secondary text-[11px] font-semibold uppercase tracking-wider">
                  <th className="pb-3">Shift Date</th>
                  <th className="pb-3">Scheduled</th>
                  <th className="pb-3">Clock-In</th>
                  <th className="pb-3">Clock-Out</th>
                  <th className="pb-3 text-right">Hours</th>
                  <th className="pb-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {employeeShifts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-stone-400">
                      No shift records logged today for this employee.
                    </td>
                  </tr>
                ) : (
                  employeeShifts.map(s => (
                    <tr key={s.id} className="hover:bg-brand-surface-subtle transition-colors">
                      <td className="py-3 font-semibold text-brand-text">{s.date}</td>
                      <td className="py-3 text-brand-text-secondary tabular-nums">
                        {s.scheduledStart} - {s.scheduledEnd}
                      </td>
                      <td className="py-3 text-brand-sage-dark font-medium tabular-nums">
                        {s.actualClockIn || '—'}
                      </td>
                      <td className="py-3 text-brand-text tabular-nums">
                        {s.actualClockOut || 'Active'}
                      </td>
                      <td className="py-3 text-right font-semibold tabular-nums text-brand-text">
                        {formatHours(s.hoursWorked)}
                      </td>
                      <td className="py-3 text-right">
                        <StatusBadge status={s.status} size="sm" />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Activity timeline */}
          <div className="mt-8 pt-6 border-t border-brand-border">
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-text-secondary mb-4">
              Terminal Punch & Break Timeline
            </h4>
            <div className="space-y-3">
              {employeeActivities.length === 0 ? (
                <div className="text-xs text-brand-text-secondary italic">
                  No terminal activity events logged yet for this shift.
                </div>
              ) : (
                employeeActivities.map(act => (
                  <div key={act.id} className="flex items-start gap-3 text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-sage mt-1.5 flex-shrink-0" />
                    <div className="flex-1">
                      <span className="font-semibold text-brand-text">{act.action}</span>
                      <span className="text-stone-400 text-[11px] ml-2 tabular-nums">{act.timestamp}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Manager Notes & Configuration (Editable!) */}
        <div className="bg-brand-surface rounded-2xl border border-brand-border p-6 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-brand-border">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-brand-sage" />
                <h3 className="text-base font-heading font-bold text-brand-text">
                  Manager Notes
                </h3>
              </div>
              {!isEditingNotes ? (
                <button
                  onClick={() => setIsEditingNotes(true)}
                  className="text-xs font-semibold text-brand-sage-dark hover:underline flex items-center gap-1"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              ) : (
                <button
                  onClick={handleSaveNotes}
                  className="text-xs font-semibold text-brand-sage-dark hover:underline flex items-center gap-1"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save</span>
                </button>
              )}
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-brand-text-secondary font-medium mb-1">
                  Base Hourly Wage ($/hr)
                </label>
                {isEditingNotes ? (
                  <input
                    type="number"
                    step="0.50"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(e.target.value)}
                    className="w-full px-3 py-2 bg-brand-surface-subtle border border-brand-border rounded-xl text-brand-text focus:outline-none focus:ring-1 focus:ring-brand-sage font-medium"
                  />
                ) : (
                  <div className="p-3 bg-brand-surface-subtle border border-brand-border rounded-xl font-semibold text-brand-text tabular-nums">
                    {formatCurrency(parseFloat(hourlyRate) || employee.hourlyRate)} / hour
                  </div>
                )}
              </div>

              <div>
                <label className="block text-brand-text-secondary font-medium mb-1">
                  Confidential Operational Notes
                </label>
                {isEditingNotes ? (
                  <textarea
                    rows={6}
                    value={managerNotes}
                    onChange={(e) => setManagerNotes(e.target.value)}
                    className="w-full px-3 py-2 bg-brand-surface-subtle border border-brand-border rounded-xl text-brand-text focus:outline-none focus:ring-1 focus:ring-brand-sage text-xs leading-relaxed"
                  />
                ) : (
                  <div className="p-4 bg-brand-surface-subtle border border-brand-border rounded-xl leading-relaxed text-brand-text">
                    {employee.notes || 'No manager notes entered yet.'}
                  </div>
                )}
              </div>
            </div>
          </div>

          {isEditingNotes && (
            <div className="pt-4 border-t border-brand-border mt-4 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setManagerNotes(employee.notes);
                  setIsEditingNotes(false);
                }}
                className="px-3 py-1.5 text-xs text-brand-text-secondary hover:text-brand-text"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveNotes}
                className="px-4 py-2 bg-brand-sidebar hover:bg-stone-900 text-white rounded-xl text-xs font-semibold shadow-subtle flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

