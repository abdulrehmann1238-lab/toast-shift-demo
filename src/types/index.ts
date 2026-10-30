export type Role =
  | 'General Manager'
  | 'Assistant Manager'
  | 'Shift Supervisor'
  | 'Bartender'
  | 'Server'
  | 'Host'
  | 'Barback'
  | 'Kitchen Staff';

export type ShiftStatus = 'active' | 'break' | 'pending_clockout' | 'completed' | 'scheduled';

export type BreakStatus = 'none' | 'on_break' | 'completed';

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  role: Role;
  email: string;
  phone: string;
  avatar: string;
  status: 'active' | 'break' | 'off_duty' | 'scheduled';
  lastShiftDate: string;
  hoursThisWeek: number;
  hourlyRate: number;
  notes: string;
  toastEmployeeId: string;
}

export interface Shift {
  id: string;
  employeeId: string;
  employeeName: string;
  role: Role;
  date: string;
  scheduledStart: string;
  scheduledEnd: string;
  actualClockIn: string | null;
  actualClockOut: string | null;
  breakStatus: BreakStatus;
  breakStart?: string;
  breakDurationMinutes: number;
  hoursWorked: number;
  status: ShiftStatus;
  declaredCash: number;
  expectedCash: number;
  declaredTips: number;
  cashVariance: number;
  reconciliationStatus: 'pending' | 'reviewed' | 'flagged';
  reconciliationNotes?: string;
  managerReviewed: boolean;
  notes?: string;
}

export type ApprovalType =
  | 'shift_adjustment'
  | 'missing_punch'
  | 'cash_discrepancy'
  | 'closing_confirmation'
  | 'overtime_exception';

export interface ApprovalRequest {
  id: string;
  type: ApprovalType;
  employeeId: string;
  employeeName: string;
  submissionTime: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  details: string;
  impact: string;
  originalValue?: string;
  requestedValue?: string;
  reviewNotes?: string;
  resolvedAt?: string;
}

export type ChecklistCategory = 'employee_ops' | 'financial' | 'restaurant_closing';

export interface ChecklistItem {
  id: string;
  category: ChecklistCategory;
  title: string;
  description: string;
  responsibleRole: string;
  completed: boolean;
  completedAt?: string;
  completedBy?: string;
  isCustom?: boolean;
}

export interface ActivityEvent {
  id: string;
  employeeId?: string;
  employeeName?: string;
  avatar?: string;
  action: string;
  timestamp: string;
  type: 'clock_in' | 'clock_out' | 'break' | 'review' | 'approval' | 'reconciliation' | 'system';
  badgeColor?: 'sage' | 'amber' | 'terracotta' | 'neutral';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  unread: boolean;
  type: 'alert' | 'warning' | 'info' | 'success';
  targetScreen?: string;
  actionText?: string;
}

export interface WorkflowSettings {
  defaultShiftReviewRequired: boolean;
  requireClockoutConfirmation: boolean;
  missingPunchAlerts: boolean;
  requiredClosingChecklist: boolean;
  managerApprovalRequired: boolean;
  finalClosingConfirmation: boolean;
  pendingClockoutReminders: boolean;
  shiftExceptionNotifications: boolean;
  closingCompletionAlerts: boolean;
  autoReconciliationVarianceTolerance: number;
  roles: Role[];
}

export type ScreenType =
  | 'landing'
  | 'overview'
  | 'live_shifts'
  | 'employees'
  | 'employee_profile'
  | 'shift_closing'
  | 'checklist'
  | 'reconciliation'
  | 'approvals'
  | 'reports'
  | 'settings';

