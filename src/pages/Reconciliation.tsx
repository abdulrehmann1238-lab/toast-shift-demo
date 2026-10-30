import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Shift, Role } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';
import { EmployeeAvatar } from '../components/common/EmployeeAvatar';
import { ConfirmationModal } from '../components/common/ConfirmationModal';
import { formatCurrency } from '../utils/formatters';
import {
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Filter,
  Search,
  Sparkles,
  Info,
  ShieldAlert,
  X,
  CreditCard,
  FileSpreadsheet
} from 'lucide-react';

export const Reconciliation: React.FC = () => {
  const {
    shifts,
    employees,
    updateReconciliation,
    metrics,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'cash' | 'tips'>('cash');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Discrepancy modal state
  const [selectedShiftForDiscrepancy, setSelectedShiftForDiscrepancy] = useState<Shift | null>(null);
  const [discrepancyNote, setDiscrepancyNote] = useState('');

  // Confirmation modal
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    action: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    action: () => {}
  });

  // Filter shifts with cash handling or tips
  const financialShifts = shifts.filter(s => {
    const matchesSearch =
      s.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === 'all' || s.role === selectedRole;
    const matchesStatus =
      statusFilter === 'all' || s.reconciliationStatus === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleOpenDiscrepancyModal = (shift: Shift) => {
    setSelectedShiftForDiscrepancy(shift);
    setDiscrepancyNote(shift.reconciliationNotes || '');
  };

  const handleSaveDiscrepancyResolution = (status: 'reviewed' | 'flagged') => {
    if (!selectedShiftForDiscrepancy) return;

    updateReconciliation(selectedShiftForDiscrepancy.id, {
      reconciliationStatus: status,
      reconciliationNotes: discrepancyNote,
      managerReviewed: true
    });

    setSelectedShiftForDiscrepancy(null);
    showToast(
      status === 'reviewed' ? 'Discrepancy Reconciled' : 'Discrepancy Flagged',
      `Shift drawer review for ${selectedShiftForDiscrepancy.employeeName} marked as ${status}.`,
      status === 'reviewed' ? 'success' : 'warning'
    );
  };

  // Sample tip calculation aggregates for illustration tab
  const totalTips = metrics.totalDeclaredTips;
  const tippedEmployees = shifts.filter(s => s.declaredTips > 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-brand-border">
        <div>
          <h2 className="text-2xl font-heading font-extrabold text-brand-text tracking-tight">
            Cash & Tip Review
          </h2>
          <p className="text-xs sm:text-sm text-brand-text-secondary mt-1">
            Reconcile register drawer counts, audit cash variances, and inspect server tip turn-ins.
          </p>
        </div>

        {/* Disclaimer Pill */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-surface-subtle border border-brand-border rounded-xl text-[11px] text-stone-500">
          <Info className="w-3.5 h-3.5 text-stone-400" />
          <span>Demonstration financial figures</span>
        </div>
      </div>

      {/* Financial Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-brand-surface border border-brand-border shadow-subtle">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-brand-text-secondary">
            Expected Cash Sales
          </div>
          <div className="text-2xl font-heading font-bold text-brand-text mt-1 tabular-nums">
            {formatCurrency(metrics.totalExpectedCash)}
          </div>
          <div className="text-[11px] text-stone-500 font-medium mt-1">
            Toast register audit log
          </div>
        </div>

        <div className="p-4 rounded-xl bg-brand-surface border border-brand-border shadow-subtle">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-brand-text-secondary">
            Declared Cash Turn-In
          </div>
          <div className="text-2xl font-heading font-bold text-brand-text mt-1 tabular-nums">
            {formatCurrency(metrics.totalDeclaredCash)}
          </div>
          <div className="text-[11px] text-stone-500 font-medium mt-1">
            Physical envelope drops
          </div>
        </div>

        <div className="p-4 rounded-xl bg-brand-surface border border-brand-border shadow-subtle">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-brand-text-secondary">
            Net Cash Variance
          </div>
          <div
            className={`text-2xl font-heading font-bold mt-1 tabular-nums ${
              metrics.totalCashVariance < 0
                ? 'text-brand-terracotta'
                : metrics.totalCashVariance > 0
                ? 'text-brand-sage-dark'
                : 'text-brand-text'
            }`}
          >
            {formatCurrency(metrics.totalCashVariance)}
          </div>
          <div className="text-[11px] text-brand-terracotta font-medium mt-1">
            {metrics.totalCashVariance < 0 ? '1 drawer shortage flagged' : 'Drawers in balance'}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-brand-surface border border-brand-border shadow-subtle">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-brand-text-secondary">
            Declared Tips
          </div>
          <div className="text-2xl font-heading font-bold text-brand-text mt-1 tabular-nums">
            {formatCurrency(metrics.totalDeclaredTips)}
          </div>
          <div className="text-[11px] text-brand-sage-dark font-medium mt-1">
            {tippedEmployees.length} service staff declarations
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-brand-border">
        <button
          onClick={() => setActiveTab('cash')}
          className={`px-4 py-2.5 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'cash'
              ? 'border-brand-sidebar text-brand-text'
              : 'border-transparent text-brand-text-secondary hover:text-brand-text'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Cash Drawer Reconciliation</span>
        </button>

        <button
          onClick={() => setActiveTab('tips')}
          className={`px-4 py-2.5 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'tips'
              ? 'border-brand-sidebar text-brand-text'
              : 'border-transparent text-brand-text-secondary hover:text-brand-text'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Tip Declarations & Summary</span>
        </button>
      </div>

      {/* Tab 1: Cash Reconciliation */}
      {activeTab === 'cash' && (
        <div className="space-y-4">
          {/* Search & Filter Bar */}
          <div className="bg-brand-surface rounded-2xl border border-brand-border p-4 shadow-subtle space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search staff or station..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-brand-surface-subtle border border-brand-border rounded-xl text-xs text-brand-text placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-brand-sage"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-brand-surface-subtle border border-brand-border rounded-xl text-xs font-medium text-brand-text focus:outline-none cursor-pointer"
              >
                <option value="all">All Review Statuses</option>
                <option value="reviewed">Reviewed & Verified</option>
                <option value="pending">Pending Review</option>
                <option value="flagged">Flagged Discrepancies</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-brand-surface rounded-2xl border border-brand-border shadow-subtle overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-brand-surface-subtle border-b border-brand-border text-brand-text-secondary text-[11px] font-semibold uppercase tracking-wider">
                    <th className="py-3 px-4">Employee</th>
                    <th className="py-3 px-3">Role</th>
                    <th className="py-3 px-3 text-right">Expected Cash</th>
                    <th className="py-3 px-3 text-right">Declared Cash</th>
                    <th className="py-3 px-3 text-right">Variance</th>
                    <th className="py-3 px-3 text-right">Tip Amount</th>
                    <th className="py-3 px-3">Review Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border">
                  {financialShifts.map(shift => {
                    const hasDiscrepancy = shift.cashVariance !== 0;

                    return (
                      <tr
                        key={shift.id}
                        className={`hover:bg-brand-surface-subtle transition-colors ${
                          hasDiscrepancy ? 'bg-[#FCF9F7]' : ''
                        }`}
                      >
                        <td className="py-3 px-4">
                          <div className="font-semibold text-brand-text">
                            {shift.employeeName}
                          </div>
                          <div className="text-[10px] text-stone-400">
                            {shift.actualClockIn ? `In at ${shift.actualClockIn}` : 'Scheduled'}
                          </div>
                        </td>

                        <td className="py-3 px-3 text-brand-text-secondary font-medium">
                          {shift.role}
                        </td>

                        <td className="py-3 px-3 text-right font-medium tabular-nums text-brand-text">
                          {formatCurrency(shift.expectedCash)}
                        </td>

                        <td className="py-3 px-3 text-right font-medium tabular-nums text-brand-text">
                          {formatCurrency(shift.declaredCash)}
                        </td>

                        <td className="py-3 px-3 text-right tabular-nums">
                          <span
                            className={`font-semibold ${
                              shift.cashVariance < 0
                                ? 'text-brand-terracotta'
                                : shift.cashVariance > 0
                                ? 'text-brand-sage-dark'
                                : 'text-stone-400'
                            }`}
                          >
                            {formatCurrency(shift.cashVariance)}
                          </span>
                        </td>

                        <td className="py-3 px-3 text-right font-medium tabular-nums text-brand-text">
                          {formatCurrency(shift.declaredTips)}
                        </td>

                        <td className="py-3 px-3">
                          <StatusBadge status={shift.reconciliationStatus} size="sm" />
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="inline-flex items-center gap-2">
                            {hasDiscrepancy && (
                              <button
                                onClick={() => handleOpenDiscrepancyModal(shift)}
                                className="px-2.5 py-1 text-[11px] font-semibold bg-brand-terracotta-soft text-brand-terracotta hover:bg-rose-100 rounded-lg border border-brand-terracotta/30 flex items-center gap-1"
                              >
                                <AlertTriangle className="w-3 h-3" />
                                <span>Inspect</span>
                              </button>
                            )}

                            {shift.reconciliationStatus !== 'reviewed' && !hasDiscrepancy && (
                              <button
                                onClick={() => {
                                  updateReconciliation(shift.id, {
                                    reconciliationStatus: 'reviewed',
                                    managerReviewed: true
                                  });
                                  showToast('Drawer Reconciled', `${shift.employeeName} marked verified.`, 'success');
                                }}
                                className="px-2.5 py-1 text-[11px] font-medium bg-brand-sage-soft text-brand-sage-dark hover:bg-emerald-100 rounded-lg border border-brand-sage/30"
                              >
                                Mark Reviewed
                              </button>
                            )}

                            {shift.reconciliationStatus === 'reviewed' && (
                              <span className="text-[11px] text-brand-sage-dark font-medium flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5 text-brand-sage" />
                                <span>OK</span>
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Tip Review */}
      {activeTab === 'tips' && (
        <div className="space-y-6">
          <div className="bg-brand-surface rounded-2xl border border-brand-border p-6 shadow-subtle space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-brand-border">
              <div>
                <h3 className="text-base font-heading font-bold text-brand-text">
                  Individual Server Tip Declarations
                </h3>
                <p className="text-xs text-brand-text-secondary mt-0.5">
                  Illustrative sample credit card gratuities and direct cash declarations
                </p>
              </div>

              <div className="text-right">
                <span className="text-[11px] font-semibold text-brand-text-secondary uppercase">
                  Shift Tip Total
                </span>
                <div className="text-2xl font-heading font-bold text-brand-text tabular-nums">
                  {formatCurrency(totalTips)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tippedEmployees.map(shift => (
                <div
                  key={shift.id}
                  className="p-4 rounded-xl border border-brand-border bg-white space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-xs text-brand-text">{shift.employeeName}</div>
                      <div className="text-[11px] text-brand-text-secondary">{shift.role}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-brand-text tabular-nums">
                        {formatCurrency(shift.declaredTips)}
                      </div>
                      <div className="text-[10px] text-stone-400">Declared tips</div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-brand-border flex items-center justify-between text-[11px]">
                    <span className="text-brand-text-secondary">Audit Status:</span>
                    <span className="font-semibold text-brand-sage-dark">Confirmed</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-brand-surface-subtle border border-brand-border rounded-xl text-xs text-stone-500 leading-relaxed">
              <span className="font-semibold text-brand-text">Client Notice on Tip Pooling Rules:</span>{' '}
              Specific state and venue tip-pooling, tip-credit, or server checkout calculations are highly customized across Nevada hospitality establishments. This interface demonstrates clean individual visibility and summary totals ready to integrate with the client's preferred formula.
            </div>
          </div>
        </div>
      )}

      {/* Discrepancy Inspection Modal */}
      {selectedShiftForDiscrepancy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-brand-surface rounded-2xl max-w-lg w-full p-6 shadow-modal border border-brand-border animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-brand-border mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-brand-terracotta-soft text-brand-terracotta flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-heading font-bold text-brand-text">
                    Inspect Cash Drawer Discrepancy
                  </h3>
                  <p className="text-xs text-brand-text-secondary">
                    {selectedShiftForDiscrepancy.employeeName} ({selectedShiftForDiscrepancy.role})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedShiftForDiscrepancy(null)}
                className="p-1 rounded-lg text-brand-text-secondary hover:text-brand-text"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-3 p-3 rounded-xl bg-brand-surface-subtle border border-brand-border text-center">
                <div>
                  <div className="text-[10px] uppercase font-semibold text-brand-text-secondary">Expected</div>
                  <div className="text-sm font-bold text-brand-text mt-0.5 tabular-nums">
                    {formatCurrency(selectedShiftForDiscrepancy.expectedCash)}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-semibold text-brand-text-secondary">Declared</div>
                  <div className="text-sm font-bold text-brand-text mt-0.5 tabular-nums">
                    {formatCurrency(selectedShiftForDiscrepancy.declaredCash)}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-semibold text-brand-text-secondary">Difference</div>
                  <div className="text-sm font-bold text-brand-terracotta mt-0.5 tabular-nums">
                    {formatCurrency(selectedShiftForDiscrepancy.cashVariance)}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-brand-text-secondary font-medium mb-1">
                  Manager Investigation Notes & Resolution Waiver
                </label>
                <textarea
                  rows={3}
                  value={discrepancyNote}
                  onChange={(e) => setDiscrepancyNote(e.target.value)}
                  placeholder="e.g. Table split with paper voucher; verified by floor supervisor..."
                  className="w-full px-3 py-2 bg-brand-surface-subtle border border-brand-border rounded-xl text-brand-text focus:outline-none focus:ring-1 focus:ring-brand-sage"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/60 text-[11px] text-amber-900 leading-relaxed">
                Hospitality Note: Drawer shortages do not automatically imply misconduct. Common causes include unredeemed loyalty vouchers, drawer change errors, or untracked split bills.
              </div>

              <div className="flex flex-wrap items-center justify-end gap-2 pt-3 border-t border-brand-border">
                <button
                  type="button"
                  onClick={() => setSelectedShiftForDiscrepancy(null)}
                  className="px-3 py-2 text-xs text-brand-text-secondary hover:text-brand-text bg-white border border-brand-border rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveDiscrepancyResolution('flagged')}
                  className="px-4 py-2 text-xs font-semibold text-brand-terracotta bg-brand-terracotta-soft hover:bg-rose-100 border border-brand-terracotta/30 rounded-xl"
                >
                  Flag for Investigation
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveDiscrepancyResolution('reviewed')}
                  className="px-4 py-2 text-xs font-semibold text-white bg-brand-sidebar hover:bg-stone-900 rounded-xl shadow-subtle"
                >
                  Accept & Mark Reviewed
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

