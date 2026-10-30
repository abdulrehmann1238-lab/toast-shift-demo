import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ApprovalRequest, ApprovalType } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';
import { ConfirmationModal } from '../components/common/ConfirmationModal';
import {
  ShieldCheck,
  AlertCircle,
  Clock,
  DollarSign,
  UserCheck,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Filter,
  Check,
  X,
  FileText
} from 'lucide-react';

export const ManagerApprovals: React.FC = () => {
  const { approvals, handleApproval, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'pending' | 'resolved' | 'all'>('pending');
  const [selectedType, setSelectedType] = useState<string>('all');

  // Confirmation dialog
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    action: () => void;
    variant: 'primary' | 'danger' | 'warning';
    confirmText: string;
  }>({
    isOpen: false,
    title: '',
    message: '',
    action: () => {},
    variant: 'primary',
    confirmText: 'Confirm'
  });

  // Clarification modal
  const [clarificationModal, setClarificationModal] = useState<{
    isOpen: boolean;
    approval: ApprovalRequest | null;
  }>({
    isOpen: false,
    approval: null
  });

  const filteredApprovals = approvals.filter(req => {
    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'pending' && req.status === 'pending') ||
      (activeTab === 'resolved' && (req.status === 'approved' || req.status === 'rejected'));
    const matchesType = selectedType === 'all' || req.type === selectedType;
    return matchesTab && matchesType;
  });

  const pendingCount = approvals.filter(a => a.status === 'pending').length;
  const approvedCount = approvals.filter(a => a.status === 'approved').length;
  const rejectedCount = approvals.filter(a => a.status === 'rejected').length;

  const getTypeIcon = (type: ApprovalType) => {
    switch (type) {
      case 'missing_punch':
        return <Clock className="w-4 h-4 text-brand-amber" />;
      case 'cash_discrepancy':
        return <DollarSign className="w-4 h-4 text-brand-terracotta" />;
      case 'closing_confirmation':
        return <UserCheck className="w-4 h-4 text-brand-sage" />;
      case 'overtime_exception':
        return <AlertCircle className="w-4 h-4 text-brand-amber" />;
      case 'shift_adjustment':
      default:
        return <FileText className="w-4 h-4 text-stone-500" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-brand-border">
        <div>
          <h2 className="text-2xl font-heading font-extrabold text-brand-text tracking-tight">
            Manager Approvals
          </h2>
          <p className="text-xs sm:text-sm text-brand-text-secondary mt-1">
            Review and resolve shift exceptions, terminal missing punches, and cash variance authorizations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {pendingCount > 0 ? (
            <span className="px-3 py-1.5 rounded-xl bg-brand-terracotta-soft text-brand-terracotta text-xs font-semibold flex items-center gap-1.5 border border-brand-terracotta/30">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{pendingCount} Actions Required</span>
            </span>
          ) : (
            <span className="px-3 py-1.5 rounded-xl bg-brand-sage-soft text-brand-sage-dark text-xs font-semibold flex items-center gap-1.5 border border-brand-sage/30">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>All Requests Resolved</span>
            </span>
          )}
        </div>
      </div>

      {/* Filter and Tab Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-brand-surface p-3 rounded-2xl border border-brand-border shadow-subtle">
        {/* Status tabs */}
        <div className="flex items-center gap-1 text-xs">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
              activeTab === 'pending'
                ? 'bg-brand-sidebar text-white font-semibold shadow-subtle'
                : 'text-brand-text-secondary hover:text-brand-text hover:bg-brand-surface-subtle'
            }`}
          >
            Pending Review ({pendingCount})
          </button>

          <button
            onClick={() => setActiveTab('resolved')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
              activeTab === 'resolved'
                ? 'bg-brand-sidebar text-white font-semibold shadow-subtle'
                : 'text-brand-text-secondary hover:text-brand-text hover:bg-brand-surface-subtle'
            }`}
          >
            Resolved ({approvedCount + rejectedCount})
          </button>

          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
              activeTab === 'all'
                ? 'bg-brand-sidebar text-white font-semibold shadow-subtle'
                : 'text-brand-text-secondary hover:text-brand-text hover:bg-brand-surface-subtle'
            }`}
          >
            All Requests ({approvals.length})
          </button>
        </div>

        {/* Type Filter */}
        <div className="flex items-center gap-2">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-1.5 bg-brand-surface-subtle border border-brand-border rounded-xl text-xs font-medium text-brand-text focus:outline-none cursor-pointer"
          >
            <option value="all">All Request Types</option>
            <option value="missing_punch">Missing Punches</option>
            <option value="cash_discrepancy">Cash Discrepancies</option>
            <option value="overtime_exception">Overtime Exceptions</option>
            <option value="closing_confirmation">Closing Confirmations</option>
            <option value="shift_adjustment">Shift Adjustments</option>
          </select>
        </div>
      </div>

      {/* Cards List */}
      <div className="space-y-4">
        {filteredApprovals.length === 0 ? (
          <div className="bg-brand-surface rounded-2xl border border-brand-border p-12 text-center text-xs text-brand-text-secondary">
            No approval requests found in this view.
          </div>
        ) : (
          filteredApprovals.map(req => {
            const isPending = req.status === 'pending';

            return (
              <div
                key={req.id}
                className={`p-5 rounded-2xl border transition-all ${
                  isPending
                    ? 'bg-brand-surface border-brand-border shadow-subtle hover:border-brand-border-strong hover:shadow-elevated'
                    : 'bg-brand-surface/70 border-brand-border/60 text-stone-500'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="p-2.5 rounded-xl bg-brand-surface-subtle border border-brand-border flex-shrink-0 mt-0.5">
                      {getTypeIcon(req.type)}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-heading font-bold text-sm text-brand-text">
                          {req.employeeName}
                        </span>
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-500 bg-brand-surface-subtle px-2 py-0.5 rounded-md">
                          {req.type.replace('_', ' ')}
                        </span>
                        <span className="text-[11px] text-stone-400 tabular-nums">
                          Submitted at {req.submissionTime}
                        </span>
                      </div>

                      <h4 className="text-xs font-semibold text-brand-text leading-snug">
                        {req.description}
                      </h4>

                      <p className="text-xs text-brand-text-secondary leading-relaxed">
                        {req.details}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 pt-1 text-[11px]">
                        {req.originalValue && (
                          <span className="text-stone-500">
                            Logged: <span className="text-stone-700 font-medium">{req.originalValue}</span>
                          </span>
                        )}
                        {req.requestedValue && (
                          <span className="text-stone-500">
                            Requested: <span className="text-brand-sage-dark font-medium">{req.requestedValue}</span>
                          </span>
                        )}
                        <span className="text-stone-500">
                          Impact: <span className="font-medium text-brand-text">{req.impact}</span>
                        </span>
                      </div>

                      {req.resolvedAt && (
                        <div className="text-[11px] text-brand-sage-dark font-medium pt-1">
                          Resolved at {req.resolvedAt} • {req.reviewNotes}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end lg:self-center">
                    {isPending ? (
                      <>
                        <button
                          onClick={() => setClarificationModal({ isOpen: true, approval: req })}
                          className="px-3 py-1.5 text-xs text-brand-text-secondary hover:text-brand-text bg-brand-surface-subtle hover:bg-brand-border rounded-xl font-medium transition-colors"
                        >
                          Clarification
                        </button>

                        <button
                          onClick={() => {
                            setConfirmModal({
                              isOpen: true,
                              title: `Reject Request for ${req.employeeName}?`,
                              message: `Are you sure you want to reject this ${req.type.replace('_', ' ')}? The shift record will retain its current unadjusted state.`,
                              variant: 'danger',
                              confirmText: 'Reject Request',
                              action: () => handleApproval(req.id, 'rejected')
                            });
                          }}
                          className="px-3.5 py-1.5 text-xs font-semibold text-brand-terracotta hover:bg-brand-terracotta-soft border border-brand-terracotta/30 rounded-xl transition-colors flex items-center gap-1"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>

                        <button
                          onClick={() => {
                            setConfirmModal({
                              isOpen: true,
                              title: `Approve Request for ${req.employeeName}?`,
                              message: `Confirm manager approval for "${req.description}". The shift log and payroll totals will update immediately.`,
                              variant: 'primary',
                              confirmText: 'Approve & Apply',
                              action: () => handleApproval(req.id, 'approved')
                            });
                          }}
                          className="px-4 py-1.5 text-xs font-semibold text-white bg-brand-sidebar hover:bg-stone-900 rounded-xl shadow-subtle transition-all flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5 text-brand-sage-soft" />
                          <span>Approve</span>
                        </button>
                      </>
                    ) : (
                      <StatusBadge status={req.status} />
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Clarification Modal */}
      {clarificationModal.isOpen && clarificationModal.approval && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-brand-surface rounded-2xl max-w-md w-full p-6 shadow-modal border border-brand-border animate-in zoom-in-95 duration-150">
            <h3 className="text-base font-heading font-bold text-brand-text mb-2">
              Request Staff Clarification
            </h3>
            <p className="text-xs text-brand-text-secondary mb-4 leading-relaxed">
              Send a terminal or text notification to {clarificationModal.approval.employeeName} requesting additional notes for this exception.
            </p>

            <textarea
              rows={3}
              placeholder="e.g. Please bring the merchant copy of the split voucher to the manager office..."
              className="w-full p-3 bg-brand-surface-subtle border border-brand-border rounded-xl text-xs text-brand-text focus:outline-none focus:ring-1 focus:ring-brand-sage mb-4"
            />

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setClarificationModal({ isOpen: false, approval: null })}
                className="px-4 py-2 text-xs text-brand-text-secondary hover:text-brand-text bg-white border border-brand-border rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setClarificationModal({ isOpen: false, approval: null });
                  showToast('Clarification Sent', `Message routed to staff terminal.`, 'info');
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-brand-sidebar hover:bg-stone-900 rounded-xl"
              >
                Send Notice
              </button>
            </div>
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

