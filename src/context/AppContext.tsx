import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Employee,
  Shift,
  ApprovalRequest,
  ChecklistItem,
  ActivityEvent,
  NotificationItem,
  WorkflowSettings,
  ScreenType,
  Role
} from '../types';
import {
  INITIAL_EMPLOYEES,
  INITIAL_SHIFTS,
  INITIAL_APPROVALS,
  INITIAL_CHECKLIST,
  INITIAL_ACTIVITIES,
  INITIAL_NOTIFICATIONS,
  INITIAL_SETTINGS
} from '../data/mockData';

interface ToastState {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning';
}

interface AppContextType {
  // Navigation & UI state
  currentScreen: ScreenType;
  navigateTo: (screen: ScreenType, employeeId?: string) => void;
  selectedEmployeeId: string | null;
  setSelectedEmployeeId: (id: string | null) => void;
  restaurantName: string;
  setRestaurantName: (name: string) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  toast: ToastState | null;
  showToast: (title: string, message: string, type?: 'success' | 'info' | 'warning') => void;
  clearToast: () => void;

  // Data
  employees: Employee[];
  shifts: Shift[];
  approvals: ApprovalRequest[];
  checklist: ChecklistItem[];
  activities: ActivityEvent[];
  notifications: NotificationItem[];
  settings: WorkflowSettings;

  // Shift & Closing state
  closingStage: number;
  setClosingStage: (stage: number) => void;
  isClosingFinalized: boolean;
  completeClosingWorkflow: () => void;

  // Operations Actions
  clockIn: (employeeId: string) => void;
  clockOut: (employeeId: string, cashDeclared?: number, tipsDeclared?: number) => void;
  startBreak: (employeeId: string) => void;
  endBreak: (employeeId: string) => void;
  updateShift: (shiftId: string, updates: Partial<Shift>) => void;
  addEmployee: (employee: Omit<Employee, 'id'>) => void;
  updateEmployee: (employeeId: string, updates: Partial<Employee>) => void;
  toggleChecklistItem: (itemId: string) => void;
  addChecklistItem: (item: Omit<ChecklistItem, 'id' | 'completed'>) => void;
  completeAllChecklist: () => void;
  handleApproval: (approvalId: string, decision: 'approved' | 'rejected', notes?: string) => void;
  updateReconciliation: (shiftId: string, data: Partial<Shift>) => void;
  markNotificationRead: (notificationId: string) => void;
  markAllNotificationsRead: () => void;
  updateSettings: (updates: Partial<WorkflowSettings>) => void;
  resetDemoData: () => void;

  // Calculated KPI aggregates
  metrics: {
    employeesOnShiftCount: number;
    activeShiftsCount: number;
    pendingClockoutsCount: number;
    completedShiftsCount: number;
    closingPercentage: number;
    pendingApprovalsCount: number;
    totalDeclaredCash: number;
    totalExpectedCash: number;
    totalCashVariance: number;
    totalDeclaredTips: number;
    checklistCompletedCount: number;
    checklistTotalCount: number;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'copper_room_pos_demo_v2';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Read initial from localStorage or defaults
  const loadSavedState = () => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading saved state', e);
    }
    return null;
  };

  const savedState = loadSavedState();

  const [currentScreen, setCurrentScreen] = useState<ScreenType>(
    savedState?.currentScreen || 'landing'
  );
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(
    savedState?.selectedEmployeeId || null
  );
  const [restaurantName, setRestaurantName] = useState<string>(
    savedState?.restaurantName || 'The Copper Room – Las Vegas'
  );
  const [selectedDate, setSelectedDate] = useState<string>('Today, Oct 31');
  const [toast, setToast] = useState<ToastState | null>(null);

  const [employees, setEmployees] = useState<Employee[]>(
    savedState?.employees || INITIAL_EMPLOYEES
  );
  const [shifts, setShifts] = useState<Shift[]>(
    savedState?.shifts || INITIAL_SHIFTS
  );
  const [approvals, setApprovals] = useState<ApprovalRequest[]>(
    savedState?.approvals || INITIAL_APPROVALS
  );
  const [checklist, setChecklist] = useState<ChecklistItem[]>(
    savedState?.checklist || INITIAL_CHECKLIST
  );
  const [activities, setActivities] = useState<ActivityEvent[]>(
    savedState?.activities || INITIAL_ACTIVITIES
  );
  const [notifications, setNotifications] = useState<NotificationItem[]>(
    savedState?.notifications || INITIAL_NOTIFICATIONS
  );
  const [settings, setSettings] = useState<WorkflowSettings>(
    savedState?.settings || INITIAL_SETTINGS
  );
  const [closingStage, setClosingStage] = useState<number>(
    savedState?.closingStage || 1
  );
  const [isClosingFinalized, setIsClosingFinalized] = useState<boolean>(
    savedState?.isClosingFinalized || false
  );

  // Sync to localStorage
  useEffect(() => {
    try {
      const stateToSave = {
        currentScreen,
        selectedEmployeeId,
        restaurantName,
        employees,
        shifts,
        approvals,
        checklist,
        activities,
        notifications,
        settings,
        closingStage,
        isClosingFinalized
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.error('Failed to sync to localStorage', e);
    }
  }, [
    currentScreen,
    selectedEmployeeId,
    restaurantName,
    employees,
    shifts,
    approvals,
    checklist,
    activities,
    notifications,
    settings,
    closingStage,
    isClosingFinalized
  ]);

  const showToast = (title: string, message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = Date.now().toString();
    setToast({ id, title, message, type });
    setTimeout(() => {
      setToast(prev => (prev?.id === id ? null : prev));
    }, 4500);
  };

  const clearToast = () => setToast(null);

  const navigateTo = (screen: ScreenType, employeeId?: string) => {
    if (employeeId) {
      setSelectedEmployeeId(employeeId);
    }
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getCurrentTimeString = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  // Clock In
  const clockIn = (employeeId: string) => {
    const emp = employees.find(e => e.id === employeeId);
    if (!emp) return;
    const timeStr = getCurrentTimeString();

    // Update employee status
    setEmployees(prev =>
      prev.map(e => (e.id === employeeId ? { ...e, status: 'active', lastShiftDate: 'Today' } : e))
    );

    // Update or create shift
    setShifts(prev => {
      const existing = prev.find(s => s.employeeId === employeeId);
      if (existing) {
        return prev.map(s =>
          s.id === existing.id
            ? { ...s, actualClockIn: timeStr, status: 'active', breakStatus: 'none' }
            : s
        );
      } else {
        const newShift: Shift = {
          id: `sh-${Date.now()}`,
          employeeId: emp.id,
          employeeName: emp.fullName,
          role: emp.role,
          date: 'Today',
          scheduledStart: 'Now',
          scheduledEnd: 'End of Night',
          actualClockIn: timeStr,
          actualClockOut: null,
          breakStatus: 'none',
          breakDurationMinutes: 0,
          hoursWorked: 0.1,
          status: 'active',
          declaredCash: 0,
          expectedCash: 0,
          declaredTips: 0,
          cashVariance: 0,
          reconciliationStatus: 'pending',
          managerReviewed: false,
          notes: 'Clocked in via Manager Console'
        };
        return [newShift, ...prev];
      }
    });

    // Add activity
    const newAct: ActivityEvent = {
      id: `act-${Date.now()}`,
      employeeId: emp.id,
      employeeName: emp.fullName,
      avatar: emp.avatar,
      action: `Clocked in (${timeStr})`,
      timestamp: timeStr,
      type: 'clock_in',
      badgeColor: 'sage'
    };
    setActivities(prev => [newAct, ...prev]);
    showToast('Employee Clocked In', `${emp.fullName} has begun active shift.`, 'success');
  };

  // Clock Out
  const clockOut = (employeeId: string, cashDeclared?: number, tipsDeclared?: number) => {
    const emp = employees.find(e => e.id === employeeId);
    if (!emp) return;
    const timeStr = getCurrentTimeString();

    setEmployees(prev =>
      prev.map(e => (e.id === employeeId ? { ...e, status: 'off_duty' } : e))
    );

    setShifts(prev =>
      prev.map(s => {
        if (s.employeeId === employeeId) {
          const declaredC = cashDeclared !== undefined ? cashDeclared : s.declaredCash;
          const declaredT = tipsDeclared !== undefined ? tipsDeclared : s.declaredTips;
          const variance = declaredC - s.expectedCash;
          return {
            ...s,
            actualClockOut: timeStr,
            status: 'completed',
            declaredCash: declaredC,
            declaredTips: declaredT,
            cashVariance: variance,
            reconciliationStatus: variance === 0 ? 'reviewed' : 'flagged',
            managerReviewed: true
          };
        }
        return s;
      })
    );

    const newAct: ActivityEvent = {
      id: `act-${Date.now()}`,
      employeeId: emp.id,
      employeeName: emp.fullName,
      avatar: emp.avatar,
      action: `Completed shift & clocked out (${timeStr})`,
      timestamp: timeStr,
      type: 'clock_out',
      badgeColor: 'sage'
    };
    setActivities(prev => [newAct, ...prev]);
    showToast('Clock-Out Recorded', `${emp.fullName} signed off at ${timeStr}.`, 'success');
  };

  // Start Break
  const startBreak = (employeeId: string) => {
    const emp = employees.find(e => e.id === employeeId);
    if (!emp) return;
    const timeStr = getCurrentTimeString();

    setEmployees(prev =>
      prev.map(e => (e.id === employeeId ? { ...e, status: 'break' } : e))
    );

    setShifts(prev =>
      prev.map(s =>
        s.employeeId === employeeId
          ? { ...s, breakStatus: 'on_break', breakStart: timeStr, status: 'break' }
          : s
      )
    );

    const newAct: ActivityEvent = {
      id: `act-${Date.now()}`,
      employeeId: emp.id,
      employeeName: emp.fullName,
      avatar: emp.avatar,
      action: `Started meal/rest break (${timeStr})`,
      timestamp: timeStr,
      type: 'break',
      badgeColor: 'amber'
    };
    setActivities(prev => [newAct, ...prev]);
    showToast('Break Started', `${emp.fullName} is now on break.`, 'info');
  };

  // End Break
  const endBreak = (employeeId: string) => {
    const emp = employees.find(e => e.id === employeeId);
    if (!emp) return;
    const timeStr = getCurrentTimeString();

    setEmployees(prev =>
      prev.map(e => (e.id === employeeId ? { ...e, status: 'active' } : e))
    );

    setShifts(prev =>
      prev.map(s =>
        s.employeeId === employeeId
          ? {
              ...s,
              breakStatus: 'completed',
              breakStart: undefined,
              breakDurationMinutes: (s.breakDurationMinutes || 0) + 30,
              status: 'active'
            }
          : s
      )
    );

    const newAct: ActivityEvent = {
      id: `act-${Date.now()}`,
      employeeId: emp.id,
      employeeName: emp.fullName,
      avatar: emp.avatar,
      action: `Returned from break (${timeStr})`,
      timestamp: timeStr,
      type: 'break',
      badgeColor: 'sage'
    };
    setActivities(prev => [newAct, ...prev]);
    showToast('Break Finished', `${emp.fullName} has resumed floor duties.`, 'success');
  };

  // Update Shift
  const updateShift = (shiftId: string, updates: Partial<Shift>) => {
    setShifts(prev =>
      prev.map(s => {
        if (s.id === shiftId) {
          const updated = { ...s, ...updates };
          if (updates.declaredCash !== undefined || updates.expectedCash !== undefined) {
            updated.cashVariance = updated.declaredCash - updated.expectedCash;
          }
          return updated;
        }
        return s;
      })
    );
    showToast('Shift Updated', 'Shift details saved successfully.', 'success');
  };

  // Add Employee
  const addEmployee = (newEmpData: Omit<Employee, 'id'>) => {
    const id = `emp-${Date.now()}`;
    const newEmp: Employee = {
      id,
      ...newEmpData,
      fullName: `${newEmpData.firstName} ${newEmpData.lastName}`
    };
    setEmployees(prev => [newEmp, ...prev]);
    showToast('Team Member Added', `${newEmp.fullName} is registered in team roster.`, 'success');
  };

  // Update Employee
  const updateEmployee = (employeeId: string, updates: Partial<Employee>) => {
    setEmployees(prev =>
      prev.map(e => {
        if (e.id === employeeId) {
          const updated = { ...e, ...updates };
          if (updates.firstName || updates.lastName) {
            updated.fullName = `${updated.firstName} ${updated.lastName}`;
          }
          return updated;
        }
        return e;
      })
    );
    showToast('Employee Profile Saved', 'Updated profile information stored.', 'success');
  };

  // Checklist Actions
  const toggleChecklistItem = (itemId: string) => {
    const timeStr = getCurrentTimeString();
    setChecklist(prev =>
      prev.map(item => {
        if (item.id === itemId) {
          const nextCompleted = !item.completed;
          return {
            ...item,
            completed: nextCompleted,
            completedAt: nextCompleted ? timeStr : undefined,
            completedBy: nextCompleted ? 'Alex Vance (GM)' : undefined
          };
        }
        return item;
      })
    );
  };

  const addChecklistItem = (item: Omit<ChecklistItem, 'id' | 'completed'>) => {
    const newItem: ChecklistItem = {
      id: `chk-${Date.now()}`,
      ...item,
      completed: false,
      isCustom: true
    };
    setChecklist(prev => [...prev, newItem]);
    showToast('Checklist Item Added', `"${item.title}" added to closing checklist.`, 'success');
  };

  const completeAllChecklist = () => {
    const timeStr = getCurrentTimeString();
    setChecklist(prev =>
      prev.map(item => ({
        ...item,
        completed: true,
        completedAt: item.completedAt || timeStr,
        completedBy: item.completedBy || 'Alex Vance (GM)'
      }))
    );
    showToast('Closing Checklist Complete', 'All 11 operational tasks marked verified.', 'success');
  };

  // Approvals
  const handleApproval = (approvalId: string, decision: 'approved' | 'rejected', notes?: string) => {
    const timeStr = getCurrentTimeString();
    const app = approvals.find(a => a.id === approvalId);
    if (!app) return;

    setApprovals(prev =>
      prev.map(a =>
        a.id === approvalId
          ? {
              ...a,
              status: decision,
              resolvedAt: timeStr,
              reviewNotes: notes || `Manager marked ${decision} on ${timeStr}`
            }
          : a
      )
    );

    // Correlate with shift if applicable
    if (app.type === 'missing_punch' && decision === 'approved') {
      setShifts(prev =>
        prev.map(s =>
          s.employeeId === app.employeeId
            ? { ...s, actualClockOut: '5:00 PM', status: 'completed', managerReviewed: true }
            : s
        )
      );
      setEmployees(prev =>
        prev.map(e => (e.id === app.employeeId ? { ...e, status: 'off_duty' } : e))
      );
    } else if (app.type === 'cash_discrepancy' && decision === 'approved') {
      setShifts(prev =>
        prev.map(s =>
          s.employeeId === app.employeeId
            ? {
                ...s,
                reconciliationStatus: 'reviewed',
                reconciliationNotes: 'Variance -$25.00 approved by GM (gift card adjustment)',
                managerReviewed: true
              }
            : s
        )
      );
    } else if (app.type === 'closing_confirmation' && decision === 'approved') {
      setShifts(prev =>
        prev.map(s =>
          s.employeeId === app.employeeId
            ? { ...s, status: 'completed', actualClockOut: timeStr, managerReviewed: true }
            : s
        )
      );
      setEmployees(prev =>
        prev.map(e => (e.id === app.employeeId ? { ...e, status: 'off_duty' } : e))
      );
    }

    // Add activity
    const newAct: ActivityEvent = {
      id: `act-${Date.now()}`,
      employeeName: 'Alex Vance',
      action: `${decision === 'approved' ? 'Approved' : 'Rejected'} ${app.type.replace('_', ' ')} for ${app.employeeName}`,
      timestamp: timeStr,
      type: 'approval',
      badgeColor: decision === 'approved' ? 'sage' : 'terracotta'
    };
    setActivities(prev => [newAct, ...prev]);

    showToast(
      decision === 'approved' ? 'Request Approved' : 'Request Rejected',
      `${app.description} has been ${decision}.`,
      decision === 'approved' ? 'success' : 'warning'
    );
  };

  // Update Reconciliation
  const updateReconciliation = (shiftId: string, data: Partial<Shift>) => {
    setShifts(prev =>
      prev.map(s => {
        if (s.id === shiftId) {
          const updated = { ...s, ...data };
          if (data.declaredCash !== undefined) {
            updated.cashVariance = updated.declaredCash - updated.expectedCash;
          }
          return updated;
        }
        return s;
      })
    );
    showToast('Reconciliation Saved', 'Drawer and tip counts updated.', 'success');
  };

  // Notifications
  const markNotificationRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === notificationId ? { ...n, unread: false } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    showToast('Notifications Cleared', 'All notices marked as read.', 'info');
  };

  // Settings
  const updateSettings = (updates: Partial<WorkflowSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
    showToast('Settings Updated', 'Demonstration workflow configuration applied.', 'success');
  };

  // Reset Demo
  const resetDemoData = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setEmployees(INITIAL_EMPLOYEES);
    setShifts(INITIAL_SHIFTS);
    setApprovals(INITIAL_APPROVALS);
    setChecklist(INITIAL_CHECKLIST);
    setActivities(INITIAL_ACTIVITIES);
    setNotifications(INITIAL_NOTIFICATIONS);
    setSettings(INITIAL_SETTINGS);
    setClosingStage(1);
    setIsClosingFinalized(false);
    setSelectedEmployeeId(null);
    setCurrentScreen('overview');
    showToast('Demo State Reset', 'Fresh initial mock dataset restored.', 'info');
  };

  // Complete shift closing workflow
  const completeClosingWorkflow = () => {
    setIsClosingFinalized(true);
    const timeStr = getCurrentTimeString();
    const newAct: ActivityEvent = {
      id: `act-${Date.now()}`,
      employeeName: 'Alex Vance',
      action: 'Finalized and locked End-of-Day Shift Closeout',
      timestamp: timeStr,
      type: 'system',
      badgeColor: 'sage'
    };
    setActivities(prev => [newAct, ...prev]);

    // Add success notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Shift Closing Finalized',
      message: 'Daily operational summary and payroll export ready for review.',
      timestamp: 'Just now',
      unread: true,
      type: 'success',
      targetScreen: 'reports',
      actionText: 'View Reports'
    };
    setNotifications(prev => [newNotif, ...prev]);

    showToast('Shift Closing Finalized!', 'Daily business operations successfully closed.', 'success');
  };

  // KPI Calculations
  const employeesOnShiftCount = employees.filter(e => e.status === 'active' || e.status === 'break').length;
  const activeShiftsCount = shifts.filter(s => s.status === 'active' || s.status === 'break').length;
  const pendingClockoutsCount = shifts.filter(s => s.status === 'pending_clockout').length;
  const completedShiftsCount = shifts.filter(s => s.status === 'completed').length;
  const pendingApprovalsCount = approvals.filter(a => a.status === 'pending').length;

  const checklistCompletedCount = checklist.filter(c => c.completed).length;
  const checklistTotalCount = checklist.length;

  // Closing readiness % calculated from (Checklist + Shifts completed + Approvals resolved + Reconciled)
  const shiftsReviewedCount = shifts.filter(s => s.managerReviewed || s.status === 'completed').length;
  const approvalsResolvedCount = approvals.filter(a => a.status !== 'pending').length;

  const closingScore =
    (checklistCompletedCount / (checklistTotalCount || 1)) * 30 +
    (shiftsReviewedCount / (shifts.length || 1)) * 30 +
    (approvalsResolvedCount / (approvals.length || 1)) * 25 +
    (isClosingFinalized ? 15 : 0);

  const closingPercentage = Math.min(100, Math.round(closingScore));

  const totalDeclaredCash = shifts.reduce((acc, s) => acc + s.declaredCash, 0);
  const totalExpectedCash = shifts.reduce((acc, s) => acc + s.expectedCash, 0);
  const totalCashVariance = totalDeclaredCash - totalExpectedCash;
  const totalDeclaredTips = shifts.reduce((acc, s) => acc + s.declaredTips, 0);

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        navigateTo,
        selectedEmployeeId,
        setSelectedEmployeeId,
        restaurantName,
        setRestaurantName,
        selectedDate,
        setSelectedDate,
        toast,
        showToast,
        clearToast,
        employees,
        shifts,
        approvals,
        checklist,
        activities,
        notifications,
        settings,
        closingStage,
        setClosingStage,
        isClosingFinalized,
        completeClosingWorkflow,
        clockIn,
        clockOut,
        startBreak,
        endBreak,
        updateShift,
        addEmployee,
        updateEmployee,
        toggleChecklistItem,
        addChecklistItem,
        completeAllChecklist,
        handleApproval,
        updateReconciliation,
        markNotificationRead,
        markAllNotificationsRead,
        updateSettings,
        resetDemoData,
        metrics: {
          employeesOnShiftCount,
          activeShiftsCount,
          pendingClockoutsCount,
          completedShiftsCount,
          closingPercentage,
          pendingApprovalsCount,
          totalDeclaredCash,
          totalExpectedCash,
          totalCashVariance,
          totalDeclaredTips,
          checklistCompletedCount,
          checklistTotalCount
        }
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

