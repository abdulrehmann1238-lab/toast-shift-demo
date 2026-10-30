import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Shift, Role, ShiftStatus } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';
import { EmployeeAvatar } from '../components/common/EmployeeAvatar';
import { ConfirmationModal } from '../components/common/ConfirmationModal';
import { SlideOverDrawer } from '../components/common/SlideOverDrawer';
import { formatHours, formatTime } from '../utils/formatters';
import {
  Search,
  Filter,
  Play,
  Square,
  Coffee,
  CheckCircle2,
  Clock,
  MoreVertical,
  Edit3,
  User,
  SlidersHorizontal,
  ChevronDown,
  ArrowUpDown
} from 'lucide-react';

export const LiveShiftManagement: React.FC = () => {
  const {
    shifts,
    employees,
    clockIn,
    clockOut,
    startBreak,
    endBreak,
    updateShift,
    navigateTo,
    showToast
  } = useApp();

  // Search, Filters & Sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortField, setSortField] = useState<'name' | 'hours' | 'start'>('start');
  const [sortAsc, setSortAsc] = useState(true);

  // Drawer & Modals state
  const [selectedShiftForDrawer, setSelectedShiftForDrawer] = useState<Shift | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<{
    actualClockIn: string;
    actualClockOut: string;
    notes: string;
    role: Role;
  }>({
    actualClockIn: '',
    actualClockOut: '',
    notes: '',
    role: 'Server'
  });

  // Confirmation modal state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    action: () => void;
    variant: 'primary' | 'warning' | 'danger';
    confirmText: string;
  }>({
    isOpen: false,
    title: '',
    message: '',
    action: () => {},
    variant: 'primary',
    confirmText: 'Confirm'
  });

  // Calculate summary counts
  const currentlyWorkingCount = shifts.filter(s => s.status === 'active').length;
  const onBreakCount = shifts.filter(s => s.status === 'break' || s.breakStatus === 'on_break').length;
  const completedShiftsCount = shifts.filter(s => s.status === 'completed').length;
  const clockoutPendingCount = shifts.filter(s => s.status === 'pending_clockout').length;

  // Filtered and sorted shifts
  const filteredShifts = shifts.filter(shift => {
    const matchesSearch =
      shift.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shift.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === 'all' || shift.role === selectedRole;
    const matchesStatus =
      selectedStatus === 'all' ||
      (selectedStatus === 'break' && (shift.status === 'break' || shift.breakStatus === 'on_break')) ||
      shift.status === selectedStatus;
    return matchesSearch && matchesRole && matchesStatus;
  }).sort((a, b) => {
    if (sortField === 'name') {
      return sortAsc ? a.employeeName.localeCompare(b.employeeName) : b.employeeName.localeCompare(a.employeeName);
    } else if (sortField === 'hours') {
      return sortAsc ? a.hoursWorked - b.hoursWorked : b.hoursWorked - a.hoursWorked;
    } else {
      return sortAsc ? a.scheduledStart.localeCompare(b.scheduledStart) : b.scheduledStart.localeCompare(a.scheduledStart);
    }
  });

  const handleOpenDrawer = (shift: Shift) => {
    setSelectedShiftForDrawer(shift);
    setEditFormData({
      actualClockIn: shift.actualClockIn || '',
      actualClockOut: shift.actualClockOut || '',
      notes: shift.notes || '',
      role: shift.role
    });
  };

  const handleSaveShiftEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShiftForDrawer) return;

    updateShift(selectedShiftForDrawer.id, {
      actualClockIn: editFormData.actualClockIn || null,
      actualClockOut: editFormData.actualClockOut || null,
      notes: editFormData.notes,
      role: editFormData.role
    });

    // Update local drawer state
    setSelectedShiftForDrawer(prev => prev ? {
      ...prev,
      actualClockIn: editFormData.actualClockIn || null,
      actualClockOut: editFormData.actualClockOut || null,
      notes: editFormData.notes,
      role: editFormData.role
    } : null);

    setIsEditModalOpen(false);
    showToast('Shift Record Updated', 'Adjustments applied to Toast shift registry.', 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-brand-border">
        <div>
          <h2 className="text-2xl font-heading font-extrabold text-brand-text tracking-tight">
            Live Shift Management
          </h2>
          <p className="text-xs sm:text-sm text-brand-text-secondary mt-1">
            Monitor floor activity in real time, oversee break intervals, and simulate punch transitions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-brand-sage-dark bg-brand-sage-soft px-3 py-1.5 rounded-xl font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span>Floor Terminals Active</span>
          </span>
        </div>
      </div>

      {/* 7.1 Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-brand-surface border border-brand-border shadow-subtle">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-brand-text-secondary">
            Currently Working
          </div>
          <div className="text-2xl font-heading font-bold text-brand-text mt-1 tabular-nums">
            {currentlyWorkingCount}
          </div>
          <div className="text-[11px] text-brand-sage-dark font-medium mt-1">
            Active on dinner floor
          </div>
        </div>

        <div className="p-4 rounded-xl bg-brand-surface border border-brand-border shadow-subtle">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-brand-text-secondary">
            On Break
          </div>
          <div className="text-2xl font-heading font-bold text-brand-text mt-1 tabular-nums">
            {onBreakCount}
          </div>
          <div className="text-[11px] text-brand-amber font-medium mt-1">
            Mandated rest/meal interval
          </div>
        </div>

        <div className="p-4 rounded-xl bg-brand-surface border border-brand-border shadow-subtle">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-brand-text-secondary">
            Clock-Out Pending
          </div>
          <div className="text-2xl font-heading font-bold text-brand-text mt-1 tabular-nums">
            {clockoutPendingCount}
          </div>
          <div className="text-[11px] text-brand-terracotta font-medium mt-1">
            Awaiting manager sign-off
          </div>
        </div>

        <div className="p-4 rounded-xl bg-brand-surface border border-brand-border shadow-subtle">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-brand-text-secondary">
            Completed Shifts
          </div>
          <div className="text-2xl font-heading font-bold text-brand-text mt-1 tabular-nums">
            {completedShiftsCount}
          </div>
          <div className="text-[11px] text-stone-500 font-medium mt-1">
            Reconciled & locked
          </div>
        </div>
      </div>

      {/* 7.3 Search and Filter Toolbar */}
      <div className="bg-brand-surface rounded-2xl border border-brand-border p-4 shadow-subtle space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by staff name or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-brand-surface-subtle border border-brand-border rounded-xl text-xs text-brand-text placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-brand-sage focus:border-brand-sage"
          />
        </div>

        {/* Filter dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Role Filter */}
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-3 py-2 bg-brand-surface-subtle border border-brand-border rounded-xl text-xs font-medium text-brand-text focus:outline-none cursor-pointer"
          >
            <option value="all">All Roles ({shifts.length})</option>
            <option value="Server">Servers</option>
            <option value="Bartender">Bartenders</option>
            <option value="Kitchen Staff">Kitchen Staff</option>
            <option value="Host">Hosts</option>
            <option value="Barback">Barbacks</option>
            <option value="Shift Supervisor">Supervisors</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-brand-surface-subtle border border-brand-border rounded-xl text-xs font-medium text-brand-text focus:outline-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="break">On Break</option>
            <option value="pending_clockout">Pending Clock-Out</option>
            <option value="completed">Completed</option>
          </select>

          {/* Sort */}
          <button
            onClick={() => {
              if (sortField === 'start') setSortField('name');
              else if (sortField === 'name') setSortField('hours');
              else setSortField('start');
              setSortAsc(!sortAsc);
            }}
            className="px-3 py-2 bg-brand-surface-subtle border border-brand-border rounded-xl text-xs font-medium text-brand-text flex items-center gap-1.5 hover:bg-brand-border transition-colors"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-stone-500" />
            <span>Sort: {sortField}</span>
          </button>
        </div>
      </div>

      {/* 7.2 Employee Shift Table */}
      <div className="bg-brand-surface rounded-2xl border border-brand-border shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-brand-surface-subtle border-b border-brand-border text-brand-text-secondary text-[11px] font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-3">Role</th>
                <th className="py-3 px-3">Scheduled Start</th>
                <th className="py-3 px-3">Actual Clock-in</th>
                <th className="py-3 px-3 text-right">Hours Worked</th>
                <th className="py-3 px-3">Break Status</th>
                <th className="py-3 px-3">Current Status</th>
                <th className="py-3 px-4 text-right">Simulate Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {filteredShifts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-xs text-brand-text-secondary">
                    No shifts found matching your search and filter criteria.
                  </td>
                </tr>
              ) : (
                filteredShifts.map(shift => {
                  const emp = employees.find(e => e.id === shift.employeeId);
                  const isWorking = shift.status === 'active';
                  const isOnBreak = shift.status === 'break' || shift.breakStatus === 'on_break';
                  const isCompleted = shift.status === 'completed';
                  const isPending = shift.status === 'pending_clockout';

                  return (
                    <tr
                      key={shift.id}
                      className="hover:bg-brand-surface-subtle transition-colors group"
                    >
                      {/* Employee Column */}
                      <td className="py-3.5 px-4">
                        <div
                          onClick={() => handleOpenDrawer(shift)}
                          className="flex items-center gap-3 cursor-pointer"
                        >
                          <EmployeeAvatar
                            name={shift.employeeName}
                            avatar={emp?.avatar}
                            size="sm"
                            status={
                              isWorking ? 'active' : isOnBreak ? 'break' : 'off_duty'
                            }
                          />
                          <div>
                            <div className="font-semibold text-brand-text group-hover:text-brand-sage-dark transition-colors">
                              {shift.employeeName}
                            </div>
                            <div className="text-[10px] text-brand-text-secondary">
                              {emp?.toastEmployeeId || 'ID-0000'}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="py-3.5 px-3 text-brand-text-secondary font-medium">
                        {shift.role}
                      </td>

                      {/* Scheduled Start */}
                      <td className="py-3.5 px-3 text-brand-text tabular-nums">
                        {shift.scheduledStart}
                      </td>

                      {/* Actual Clock-In */}
                      <td className="py-3.5 px-3 tabular-nums">
                        {shift.actualClockIn ? (
                          <span className="font-medium text-brand-text">
                            {formatTime(shift.actualClockIn)}
                          </span>
                        ) : (
                          <span className="text-stone-400 italic">Not clocked in</span>
                        )}
                      </td>

                      {/* Hours Worked */}
                      <td className="py-3.5 px-3 text-right font-medium tabular-nums text-brand-text">
                        {formatHours(shift.hoursWorked)}
                      </td>

                      {/* Break Status */}
                      <td className="py-3.5 px-3">
                        {isOnBreak ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-brand-amber-soft px-2 py-0.5 rounded-full border border-brand-amber/30">
                            <Coffee className="w-3 h-3 text-brand-amber" />
                            <span>On Break</span>
                          </span>
                        ) : shift.breakStatus === 'completed' ? (
                          <span className="text-[11px] text-brand-text-secondary">
                            {shift.breakDurationMinutes}m taken
                          </span>
                        ) : (
                          <span className="text-[11px] text-stone-400">None</span>
                        )}
                      </td>

                      {/* Current Status */}
                      <td className="py-3.5 px-3">
                        <StatusBadge status={shift.status} size="sm" />
                      </td>

                      {/* Action buttons */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          {/* Simulate Break */}
                          {isWorking && (
                            <button
                              onClick={() => {
                                setConfirmModal({
                                  isOpen: true,
                                  title: `Start Break for ${shift.employeeName}?`,
                                  message: `This logs a 30-minute rest interval on the floor terminal. Break status will update immediately.`,
                                  variant: 'warning',
                                  confirmText: 'Start Break',
                                  action: () => startBreak(shift.employeeId)
                                });
                              }}
                              className="px-2 py-1 text-[11px] font-medium bg-brand-amber-soft hover:bg-amber-100 text-amber-900 rounded-lg border border-brand-amber/30 flex items-center gap-1 transition-colors"
                              title="Simulate Break Start"
                            >
                              <Coffee className="w-3 h-3" />
                              <span className="hidden xl:inline">Break</span>
                            </button>
                          )}

                          {isOnBreak && (
                            <button
                              onClick={() => {
                                setConfirmModal({
                                  isOpen: true,
                                  title: `End Break for ${shift.employeeName}?`,
                                  message: `Employee will return to active shift on the floor.`,
                                  variant: 'primary',
                                  confirmText: 'End Break',
                                  action: () => endBreak(shift.employeeId)
                                });
                              }}
                              className="px-2 py-1 text-[11px] font-medium bg-brand-sage-soft hover:bg-emerald-100 text-brand-sage-dark rounded-lg border border-brand-sage/30 flex items-center gap-1 transition-colors"
                              title="Simulate End Break"
                            >
                              <Play className="w-3 h-3" />
                              <span className="hidden xl:inline">Resume</span>
                            </button>
                          )}

                          {/* Simulate Clock Out */}
                          {(isWorking || isPending) && (
                            <button
                              onClick={() => {
                                setConfirmModal({
                                  isOpen: true,
                                  title: `Clock out ${shift.employeeName}?`,
                                  message: `Are you sure you want to complete this shift? This will mark the shift as completed and update dashboard totals.`,
                                  variant: 'primary',
                                  confirmText: 'Clock Out Employee',
                                  action: () => clockOut(shift.employeeId)
                                });
                              }}
                              className="px-2.5 py-1 text-[11px] font-semibold bg-stone-100 hover:bg-stone-200 text-brand-text rounded-lg border border-brand-border flex items-center gap-1 transition-colors"
                              title="Simulate Clock-Out"
                            >
                              <Square className="w-3 h-3 text-stone-600" />
                              <span>Clock Out</span>
                            </button>
                          )}

                          {/* Simulate Clock In if completed */}
                          {isCompleted && (
                            <button
                              onClick={() => {
                                setConfirmModal({
                                  isOpen: true,
                                  title: `Re-open / Clock in ${shift.employeeName}?`,
                                  message: `Clock this employee back in for another active floor session.`,
                                  variant: 'primary',
                                  confirmText: 'Clock In',
                                  action: () => clockIn(shift.employeeId)
                                });
                              }}
                              className="px-2 py-1 text-[11px] font-medium text-stone-600 hover:text-brand-text bg-white border border-brand-border rounded-lg hover:bg-brand-surface-subtle"
                            >
                              Clock In
                            </button>
                          )}

                          {/* Shift Details Drawer Trigger */}
                          <button
                            onClick={() => handleOpenDrawer(shift)}
                            className="p-1.5 text-stone-500 hover:text-brand-text hover:bg-white rounded-lg border border-transparent hover:border-brand-border transition-colors"
                            title="View Shift Details"
                          >
                            <SlidersHorizontal className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 7.4 Shift Details Right-Side Drawer */}
      <SlideOverDrawer
        isOpen={!!selectedShiftForDrawer}
        onClose={() => setSelectedShiftForDrawer(null)}
        title={selectedShiftForDrawer ? selectedShiftForDrawer.employeeName : 'Shift Record'}
        subtitle={selectedShiftForDrawer ? `${selectedShiftForDrawer.role} • ${selectedShiftForDrawer.date}` : ''}
        footer={
          selectedShiftForDrawer && (
            <div className="flex items-center justify-between w-full">
              <button
                type="button"
                onClick={() => {
                  navigateTo('employee_profile', selectedShiftForDrawer.employeeId);
                  setSelectedShiftForDrawer(null);
                }}
                className="text-xs font-semibold text-brand-sage-dark hover:underline flex items-center gap-1"
              >
                <User className="w-3.5 h-3.5" />
                <span>Open Employee Profile</span>
              </button>

              <button
                type="button"
                onClick={() => setIsEditModalOpen(true)}
                className="px-4 py-2 bg-brand-sidebar hover:bg-stone-900 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-subtle"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Shift Details</span>
              </button>
            </div>
          )
        }
      >
        {selectedShiftForDrawer && (
          <div className="space-y-6 text-xs text-brand-text">
            {/* Header snapshot */}
            <div className="p-4 rounded-xl bg-brand-surface-subtle border border-brand-border flex items-center justify-between">
              <div>
                <div className="text-[11px] uppercase font-semibold text-brand-text-secondary">
                  Current Status
                </div>
                <div className="mt-1">
                  <StatusBadge status={selectedShiftForDrawer.status} />
                </div>
              </div>
              <div className="text-right">
                <div className="text-[11px] uppercase font-semibold text-brand-text-secondary">
                  Total Elapsed Hours
                </div>
                <div className="text-xl font-heading font-bold text-brand-text tabular-nums mt-0.5">
                  {formatHours(selectedShiftForDrawer.hoursWorked)}
                </div>
              </div>
            </div>

            {/* Shift Times */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-text-secondary">
                Shift Schedule & Terminal Punches
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl border border-brand-border bg-white">
                  <div className="text-stone-400 text-[10px] font-semibold uppercase">Scheduled Start</div>
                  <div className="text-sm font-semibold mt-0.5 text-brand-text tabular-nums">
                    {selectedShiftForDrawer.scheduledStart}
                  </div>
                </div>
                <div className="p-3 rounded-xl border border-brand-border bg-white">
                  <div className="text-stone-400 text-[10px] font-semibold uppercase">Scheduled End</div>
                  <div className="text-sm font-semibold mt-0.5 text-brand-text tabular-nums">
                    {selectedShiftForDrawer.scheduledEnd}
                  </div>
                </div>
                <div className="p-3 rounded-xl border border-brand-border bg-white">
                  <div className="text-stone-400 text-[10px] font-semibold uppercase">Actual Clock-In</div>
                  <div className="text-sm font-semibold mt-0.5 text-brand-sage-dark tabular-nums">
                    {selectedShiftForDrawer.actualClockIn || '—'}
                  </div>
                </div>
                <div className="p-3 rounded-xl border border-brand-border bg-white">
                  <div className="text-stone-400 text-[10px] font-semibold uppercase">Actual Clock-Out</div>
                  <div className="text-sm font-semibold mt-0.5 text-brand-text tabular-nums">
                    {selectedShiftForDrawer.actualClockOut || 'Active on floor'}
                  </div>
                </div>
              </div>
            </div>

            {/* Break History */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-text-secondary">
                Break History
              </h4>
              <div className="p-3.5 rounded-xl border border-brand-border bg-white space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-brand-text">Mandated Rest Interval (30 min)</span>
                  <span className="text-stone-500">
                    {selectedShiftForDrawer.breakStatus === 'completed'
                      ? 'Completed'
                      : selectedShiftForDrawer.breakStatus === 'on_break'
                      ? 'In Progress'
                      : 'Not Taken'}
                  </span>
                </div>
                <div className="text-[11px] text-brand-text-secondary">
                  Recorded duration: {selectedShiftForDrawer.breakDurationMinutes} minutes
                </div>
              </div>
            </div>

            {/* Financial Overview for Shift */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-text-secondary">
                Cash & Tip Summary (Sample)
              </h4>
              <div className="p-3.5 rounded-xl border border-brand-border bg-white space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-brand-text-secondary">Declared Cash:</span>
                  <span className="font-semibold text-brand-text tabular-nums">
                    ${selectedShiftForDrawer.declaredCash.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-brand-text-secondary">Expected Cash:</span>
                  <span className="font-semibold text-brand-text tabular-nums">
                    ${selectedShiftForDrawer.expectedCash.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-brand-border">
                  <span className="text-brand-text-secondary">Drawer Variance:</span>
                  <span
                    className={`font-semibold tabular-nums ${
                      selectedShiftForDrawer.cashVariance < 0
                        ? 'text-brand-terracotta'
                        : selectedShiftForDrawer.cashVariance > 0
                        ? 'text-brand-sage-dark'
                        : 'text-stone-500'
                    }`}
                  >
                    ${selectedShiftForDrawer.cashVariance.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-brand-text-secondary">Declared Tips:</span>
                  <span className="font-semibold text-brand-text tabular-nums">
                    ${selectedShiftForDrawer.declaredTips.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Shift Notes */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-text-secondary">
                Manager & Server Shift Notes
              </h4>
              <div className="p-3.5 rounded-xl border border-brand-border bg-white text-xs leading-relaxed text-brand-text">
                {selectedShiftForDrawer.notes || 'No operational notes attached to this shift record.'}
              </div>
            </div>
          </div>
        )}
      </SlideOverDrawer>

      {/* Edit Shift Modal */}
      {isEditModalOpen && selectedShiftForDrawer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-brand-surface rounded-2xl max-w-md w-full p-6 shadow-modal border border-brand-border animate-in zoom-in-95 duration-150">
            <h3 className="text-base font-heading font-bold text-brand-text mb-1">
              Edit Shift Details
            </h3>
            <p className="text-xs text-brand-text-secondary mb-4">
              Simulated manual adjustment for {selectedShiftForDrawer.employeeName}.
            </p>

            <form onSubmit={handleSaveShiftEdit} className="space-y-4 text-xs">
              <div>
                <label className="block text-brand-text-secondary font-medium mb-1">
                  Assigned Shift Role
                </label>
                <select
                  value={editFormData.role}
                  onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value as Role })}
                  className="w-full px-3 py-2 bg-brand-surface-subtle border border-brand-border rounded-xl text-xs text-brand-text focus:outline-none focus:ring-1 focus:ring-brand-sage"
                >
                  <option value="Server">Server</option>
                  <option value="Bartender">Bartender</option>
                  <option value="Host">Host</option>
                  <option value="Barback">Barback</option>
                  <option value="Kitchen Staff">Kitchen Staff</option>
                  <option value="Shift Supervisor">Shift Supervisor</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-brand-text-secondary font-medium mb-1">
                    Clock-In Punch
                  </label>
                  <input
                    type="text"
                    value={editFormData.actualClockIn}
                    onChange={(e) => setEditFormData({ ...editFormData, actualClockIn: e.target.value })}
                    placeholder="e.g. 4:00 PM"
                    className="w-full px-3 py-2 bg-brand-surface-subtle border border-brand-border rounded-xl text-xs text-brand-text focus:outline-none focus:ring-1 focus:ring-brand-sage"
                  />
                </div>
                <div>
                  <label className="block text-brand-text-secondary font-medium mb-1">
                    Clock-Out Punch
                  </label>
                  <input
                    type="text"
                    value={editFormData.actualClockOut}
                    onChange={(e) => setEditFormData({ ...editFormData, actualClockOut: e.target.value })}
                    placeholder="e.g. 10:30 PM"
                    className="w-full px-3 py-2 bg-brand-surface-subtle border border-brand-border rounded-xl text-xs text-brand-text focus:outline-none focus:ring-1 focus:ring-brand-sage"
                  />
                </div>
              </div>

              <div>
                <label className="block text-brand-text-secondary font-medium mb-1">
                  Manager Shift Notes
                </label>
                <textarea
                  rows={3}
                  value={editFormData.notes}
                  onChange={(e) => setEditFormData({ ...editFormData, notes: e.target.value })}
                  placeholder="Reason for adjustment, section notes, or closing sign-off..."
                  className="w-full px-3 py-2 bg-brand-surface-subtle border border-brand-border rounded-xl text-xs text-brand-text focus:outline-none focus:ring-1 focus:ring-brand-sage"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-brand-border">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-brand-text-secondary hover:text-brand-text bg-white border border-brand-border rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-brand-sidebar hover:bg-stone-900 rounded-xl shadow-subtle"
                >
                  Save Shift Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
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

