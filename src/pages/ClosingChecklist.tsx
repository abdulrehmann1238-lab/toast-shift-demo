import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ChecklistCategory } from '../types';
import {
  CheckSquare,
  Square,
  Plus,
  Filter,
  CheckCircle2,
  Sparkles,
  Users,
  DollarSign,
  UtensilsCrossed,
  X
} from 'lucide-react';

export const ClosingChecklist: React.FC = () => {
  const {
    checklist,
    toggleChecklistItem,
    addChecklistItem,
    completeAllChecklist,
    metrics,
    showToast
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'pending'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [customItemForm, setCustomItemForm] = useState<{
    category: ChecklistCategory;
    title: string;
    description: string;
    responsibleRole: string;
  }>({
    category: 'employee_ops',
    title: '',
    description: '',
    responsibleRole: 'Manager'
  });

  const categories = [
    { id: 'all', label: 'All Tasks', icon: <CheckSquare className="w-4 h-4" /> },
    { id: 'employee_ops', label: 'Employee Operations', icon: <Users className="w-4 h-4" /> },
    { id: 'financial', label: 'Financial Review', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'restaurant_closing', label: 'Restaurant Closing', icon: <UtensilsCrossed className="w-4 h-4" /> }
  ];

  const filteredTasks = checklist.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'completed' && item.completed) ||
      (statusFilter === 'pending' && !item.completed);
    return matchesCategory && matchesStatus;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customItemForm.title.trim()) return;

    addChecklistItem({
      category: customItemForm.category,
      title: customItemForm.title.trim(),
      description: customItemForm.description.trim() || 'Custom operational task.',
      responsibleRole: customItemForm.responsibleRole.trim() || 'Manager'
    });

    setIsAddModalOpen(false);
    setCustomItemForm({
      category: 'employee_ops',
      title: '',
      description: '',
      responsibleRole: 'Manager'
    });
  };

  const pendingCount = checklist.filter(c => !c.completed).length;
  const completedCount = checklist.filter(c => c.completed).length;
  const completionPct = Math.round((completedCount / (checklist.length || 1)) * 100);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-brand-border">
        <div>
          <h2 className="text-2xl font-heading font-extrabold text-brand-text tracking-tight">
            Closing Checklist
          </h2>
          <p className="text-xs sm:text-sm text-brand-text-secondary mt-1">
            Make sure every closing task has been reviewed before ending the business day.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-2 bg-brand-surface hover:bg-brand-surface-subtle text-brand-text border border-brand-border rounded-xl text-xs font-semibold shadow-subtle flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Task</span>
          </button>

          {pendingCount > 0 && (
            <button
              onClick={completeAllChecklist}
              className="px-4 py-2 bg-brand-sidebar hover:bg-stone-900 text-white rounded-xl text-xs font-semibold shadow-subtle flex items-center gap-2 transition-all"
            >
              <CheckCircle2 className="w-4 h-4 text-brand-sage-soft" />
              <span>Mark All Completed</span>
            </button>
          )}
        </div>
      </div>

      {/* Progress Widget Card */}
      <div className="bg-brand-surface rounded-2xl border border-brand-border p-6 shadow-subtle">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-brand-text-secondary">
              Closing Verification Progress
            </div>
            <div className="text-2xl font-heading font-bold text-brand-text mt-0.5 tabular-nums">
              {completionPct}% Complete
            </div>
            <p className="text-xs text-brand-text-secondary mt-0.5">
              {completedCount} of {checklist.length} operational steps verified • {pendingCount} pending
            </p>
          </div>

          <div className="w-full sm:w-64">
            <div className="w-full bg-brand-surface-subtle h-3 rounded-full overflow-hidden border border-brand-border">
              <div
                className="bg-brand-sage h-full rounded-full transition-all duration-300"
                style={{ width: `${completionPct}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Categories and Filters Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-brand-surface p-3 rounded-2xl border border-brand-border shadow-subtle">
        {/* Categories Tab Strip */}
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all ${
                activeCategory === cat.id
                  ? 'bg-brand-sidebar text-white shadow-subtle'
                  : 'text-brand-text-secondary hover:text-brand-text hover:bg-brand-surface-subtle'
              }`}
            >
              {cat.icon}
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto text-xs">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-2.5 py-1 rounded-lg ${statusFilter === 'all' ? 'font-semibold text-brand-text bg-brand-surface-subtle' : 'text-brand-text-secondary'}`}
          >
            All ({checklist.length})
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-2.5 py-1 rounded-lg ${statusFilter === 'pending' ? 'font-semibold text-brand-amber bg-brand-amber-soft' : 'text-brand-text-secondary'}`}
          >
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setStatusFilter('completed')}
            className={`px-2.5 py-1 rounded-lg ${statusFilter === 'completed' ? 'font-semibold text-brand-sage-dark bg-brand-sage-soft' : 'text-brand-text-secondary'}`}
          >
            Completed ({completedCount})
          </button>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.map(item => (
          <div
            key={item.id}
            onClick={() => toggleChecklistItem(item.id)}
            className={`group p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
              item.completed
                ? 'bg-brand-surface/70 border-brand-border text-stone-500'
                : 'bg-brand-surface border-brand-border shadow-subtle hover:border-brand-border-strong hover:shadow-elevated'
            }`}
          >
            <div className="mt-0.5">
              {item.completed ? (
                <div className="w-5 h-5 rounded-md bg-brand-sage text-white flex items-center justify-center">
                  <CheckSquare className="w-3.5 h-3.5" />
                </div>
              ) : (
                <div className="w-5 h-5 rounded-md border border-stone-300 group-hover:border-stone-500 bg-white flex items-center justify-center transition-colors">
                  <Square className="w-3.5 h-3.5 text-transparent" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4
                  className={`text-sm font-semibold transition-colors ${
                    item.completed ? 'line-through text-stone-400' : 'text-brand-text group-hover:text-brand-sage-dark'
                  }`}
                >
                  {item.title}
                </h4>

                <span className="text-[11px] px-2 py-0.5 rounded-full bg-brand-surface-subtle text-stone-500 font-medium">
                  Assigned: {item.responsibleRole}
                </span>
              </div>

              <p className="text-xs text-brand-text-secondary mt-1 leading-relaxed">
                {item.description}
              </p>

              {item.completed && item.completedAt && (
                <div className="mt-2 text-[11px] text-brand-sage-dark flex items-center gap-1 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified at {item.completedAt} by {item.completedBy || 'Alex Vance'}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Custom Task Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-brand-surface rounded-2xl max-w-md w-full p-6 shadow-modal border border-brand-border animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-brand-border mb-4">
              <h3 className="text-base font-heading font-bold text-brand-text">
                Add Custom Checklist Task
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-brand-text-secondary hover:text-brand-text"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-brand-text-secondary font-medium mb-1">
                  Category
                </label>
                <select
                  value={customItemForm.category}
                  onChange={(e) => setCustomItemForm({ ...customItemForm, category: e.target.value as ChecklistCategory })}
                  className="w-full px-3 py-2 bg-brand-surface-subtle border border-brand-border rounded-xl text-brand-text focus:outline-none"
                >
                  <option value="employee_ops">Employee Operations</option>
                  <option value="financial">Financial Review</option>
                  <option value="restaurant_closing">Restaurant Closing</option>
                </select>
              </div>

              <div>
                <label className="block text-brand-text-secondary font-medium mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Inspect beer cooler pressure gauges"
                  value={customItemForm.title}
                  onChange={(e) => setCustomItemForm({ ...customItemForm, title: e.target.value })}
                  className="w-full px-3 py-2 bg-brand-surface-subtle border border-brand-border rounded-xl text-brand-text focus:outline-none focus:ring-1 focus:ring-brand-sage"
                />
              </div>

              <div>
                <label className="block text-brand-text-secondary font-medium mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Specific instructions or verification standard..."
                  value={customItemForm.description}
                  onChange={(e) => setCustomItemForm({ ...customItemForm, description: e.target.value })}
                  className="w-full px-3 py-2 bg-brand-surface-subtle border border-brand-border rounded-xl text-brand-text focus:outline-none focus:ring-1 focus:ring-brand-sage"
                />
              </div>

              <div>
                <label className="block text-brand-text-secondary font-medium mb-1">
                  Responsible Role
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bartender Lead, Kitchen Supervisor"
                  value={customItemForm.responsibleRole}
                  onChange={(e) => setCustomItemForm({ ...customItemForm, responsibleRole: e.target.value })}
                  className="w-full px-3 py-2 bg-brand-surface-subtle border border-brand-border rounded-xl text-brand-text focus:outline-none focus:ring-1 focus:ring-brand-sage"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-brand-border">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs text-brand-text-secondary hover:text-brand-text bg-white border border-brand-border rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-brand-sidebar hover:bg-stone-900 rounded-xl"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

