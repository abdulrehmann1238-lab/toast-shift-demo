import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Employee, Role } from '../types';
import { EmployeeAvatar } from '../components/common/EmployeeAvatar';
import { StatusBadge } from '../components/common/StatusBadge';
import {
  Search,
  Plus,
  Filter,
  ArrowUpDown,
  Mail,
  Phone,
  Clock,
  MoreVertical,
  UserCheck,
  ChevronRight,
  UserPlus,
  X
} from 'lucide-react';

export const EmployeeManagement: React.FC = () => {
  const { employees, addEmployee, navigateTo, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortOption, setSortOption] = useState<'name' | 'hours' | 'role'>('name');

  // Add Employee Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newEmployeeForm, setNewEmployeeForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'Server' as Role,
    toastEmployeeId: '',
    hourlyRate: 15.00,
    notes: ''
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Filter and sort
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch =
      emp.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.toastEmployeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === 'all' || emp.role === selectedRole;
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && (emp.status === 'active' || emp.status === 'break')) ||
      (statusFilter === 'off_duty' && emp.status === 'off_duty');
    return matchesSearch && matchesRole && matchesStatus;
  }).sort((a, b) => {
    if (sortOption === 'name') {
      return a.fullName.localeCompare(b.fullName);
    } else if (sortOption === 'hours') {
      return b.hoursThisWeek - a.hoursThisWeek;
    } else {
      return a.role.localeCompare(b.role);
    }
  });

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!newEmployeeForm.firstName.trim()) errors.firstName = 'First name is required';
    if (!newEmployeeForm.lastName.trim()) errors.lastName = 'Last name is required';
    if (!newEmployeeForm.email.trim() || !newEmployeeForm.email.includes('@')) {
      errors.email = 'Valid email is required';
    }
    if (!newEmployeeForm.phone.trim()) errors.phone = 'Phone number is required';
    if (!newEmployeeForm.toastEmployeeId.trim()) errors.toastEmployeeId = 'Employee ID is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    addEmployee({
      firstName: newEmployeeForm.firstName.trim(),
      lastName: newEmployeeForm.lastName.trim(),
      fullName: `${newEmployeeForm.firstName.trim()} ${newEmployeeForm.lastName.trim()}`,
      role: newEmployeeForm.role,
      email: newEmployeeForm.email.trim(),
      phone: newEmployeeForm.phone.trim(),
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
      status: 'off_duty',
      lastShiftDate: 'Not started',
      hoursThisWeek: 0,
      hourlyRate: Number(newEmployeeForm.hourlyRate) || 15.00,
      notes: newEmployeeForm.notes.trim() || 'New team hire registered in staff roster.',
      toastEmployeeId: newEmployeeForm.toastEmployeeId.trim().toUpperCase()
    });

    setIsAddModalOpen(false);
    setNewEmployeeForm({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      role: 'Server',
      toastEmployeeId: '',
      hourlyRate: 15.00,
      notes: ''
    });
    setFormErrors({});
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-brand-border">
        <div>
          <h2 className="text-2xl font-heading font-extrabold text-brand-text tracking-tight">
            Your Team
          </h2>
          <p className="text-xs sm:text-sm text-brand-text-secondary mt-1">
            Manage employee contact records, Toast POS IDs, and shift role assignments.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-brand-sidebar hover:bg-stone-900 text-white rounded-xl text-xs font-semibold shadow-subtle hover:shadow-elevated transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4 text-brand-sage-soft" />
          <span>Add Employee</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-brand-surface rounded-2xl border border-brand-border p-4 shadow-subtle space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, employee ID, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-brand-surface-subtle border border-brand-border rounded-xl text-xs text-brand-text placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-brand-sage"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Role Filter */}
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-3 py-2 bg-brand-surface-subtle border border-brand-border rounded-xl text-xs font-medium text-brand-text focus:outline-none cursor-pointer"
          >
            <option value="all">All Roles ({employees.length})</option>
            <option value="General Manager">General Manager</option>
            <option value="Assistant Manager">Assistant Manager</option>
            <option value="Shift Supervisor">Shift Supervisor</option>
            <option value="Bartender">Bartenders</option>
            <option value="Server">Servers</option>
            <option value="Host">Hosts</option>
            <option value="Barback">Barbacks</option>
            <option value="Kitchen Staff">Kitchen Staff</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-brand-surface-subtle border border-brand-border rounded-xl text-xs font-medium text-brand-text focus:outline-none cursor-pointer"
          >
            <option value="all">All Employment Status</option>
            <option value="active">Active On Shift</option>
            <option value="off_duty">Off Duty</option>
          </select>

          {/* Sort */}
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as any)}
            className="px-3 py-2 bg-brand-surface-subtle border border-brand-border rounded-xl text-xs font-medium text-brand-text focus:outline-none cursor-pointer"
          >
            <option value="name">Sort: Alphabetical (A-Z)</option>
            <option value="hours">Sort: Hours This Week</option>
            <option value="role">Sort: By Role</option>
          </select>
        </div>
      </div>

      {/* 8.1 Employee Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEmployees.map(emp => {
          const isActive = emp.status === 'active' || emp.status === 'break';
          return (
            <div
              key={emp.id}
              onClick={() => navigateTo('employee_profile', emp.id)}
              className="group bg-brand-surface rounded-2xl border border-brand-border p-5 shadow-subtle hover:shadow-elevated hover:border-brand-border-strong transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <EmployeeAvatar
                      name={emp.fullName}
                      avatar={emp.avatar}
                      size="lg"
                      status={emp.status}
                    />
                    <div>
                      <h3 className="text-sm font-semibold text-brand-text group-hover:text-brand-sage-dark transition-colors">
                        {emp.fullName}
                      </h3>
                      <div className="text-xs text-brand-text-secondary font-medium">
                        {emp.role}
                      </div>
                      <span className="text-[10px] text-stone-400 font-mono tracking-tight">
                        {emp.toastEmployeeId}
                      </span>
                    </div>
                  </div>

                  <StatusBadge
                    status={isActive ? 'active' : 'scheduled'}
                    label={isActive ? 'On Floor' : 'Off Duty'}
                    size="sm"
                  />
                </div>

                <div className="space-y-1.5 text-xs text-brand-text-secondary pt-2 border-t border-brand-border">
                  <div className="flex items-center gap-2 truncate">
                    <Mail className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
                    <span className="truncate">{emp.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
                    <span>{emp.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
                    <span>Last shift: {emp.lastShiftDate}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-brand-border flex items-center justify-between text-xs">
                <div>
                  <span className="text-stone-400 text-[11px]">This week: </span>
                  <span className="font-semibold text-brand-text tabular-nums">{emp.hoursThisWeek} hrs</span>
                </div>

                <div className="text-brand-sage-dark group-hover:text-stone-900 font-semibold flex items-center gap-1">
                  <span>View Profile</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 8.3 Add Employee Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-brand-surface rounded-2xl max-w-lg w-full p-6 shadow-modal border border-brand-border animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-brand-border mb-4">
              <div>
                <h3 className="text-base font-heading font-bold text-brand-text">
                  Add New Team Member
                </h3>
                <p className="text-xs text-brand-text-secondary mt-0.5">
                  Register staff member to Toast POS employee directory
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-brand-text-secondary hover:text-brand-text rounded-lg hover:bg-brand-surface-subtle"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-brand-text-secondary font-medium mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={newEmployeeForm.firstName}
                    onChange={(e) => setNewEmployeeForm({ ...newEmployeeForm, firstName: e.target.value })}
                    placeholder="e.g. Maria"
                    className="w-full px-3 py-2 bg-brand-surface-subtle border border-brand-border rounded-xl text-brand-text focus:outline-none focus:ring-1 focus:ring-brand-sage"
                  />
                  {formErrors.firstName && (
                    <span className="text-[11px] text-brand-terracotta mt-0.5 block">{formErrors.firstName}</span>
                  )}
                </div>

                <div>
                  <label className="block text-brand-text-secondary font-medium mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={newEmployeeForm.lastName}
                    onChange={(e) => setNewEmployeeForm({ ...newEmployeeForm, lastName: e.target.value })}
                    placeholder="e.g. Morales"
                    className="w-full px-3 py-2 bg-brand-surface-subtle border border-brand-border rounded-xl text-brand-text focus:outline-none focus:ring-1 focus:ring-brand-sage"
                  />
                  {formErrors.lastName && (
                    <span className="text-[11px] text-brand-terracotta mt-0.5 block">{formErrors.lastName}</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-brand-text-secondary font-medium mb-1">
                    Hospitality Role *
                  </label>
                  <select
                    value={newEmployeeForm.role}
                    onChange={(e) => setNewEmployeeForm({ ...newEmployeeForm, role: e.target.value as Role })}
                    className="w-full px-3 py-2 bg-brand-surface-subtle border border-brand-border rounded-xl text-brand-text focus:outline-none focus:ring-1 focus:ring-brand-sage cursor-pointer"
                  >
                    <option value="Server">Server</option>
                    <option value="Bartender">Bartender</option>
                    <option value="Host">Host</option>
                    <option value="Barback">Barback</option>
                    <option value="Kitchen Staff">Kitchen Staff</option>
                    <option value="Shift Supervisor">Shift Supervisor</option>
                    <option value="Assistant Manager">Assistant Manager</option>
                  </select>
                </div>

                <div>
                  <label className="block text-brand-text-secondary font-medium mb-1">
                    Toast Employee ID *
                  </label>
                  <input
                    type="text"
                    value={newEmployeeForm.toastEmployeeId}
                    onChange={(e) => setNewEmployeeForm({ ...newEmployeeForm, toastEmployeeId: e.target.value })}
                    placeholder="e.g. TOAST-0955"
                    className="w-full px-3 py-2 bg-brand-surface-subtle border border-brand-border rounded-xl text-brand-text focus:outline-none focus:ring-1 focus:ring-brand-sage"
                  />
                  {formErrors.toastEmployeeId && (
                    <span className="text-[11px] text-brand-terracotta mt-0.5 block">{formErrors.toastEmployeeId}</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-brand-text-secondary font-medium mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={newEmployeeForm.email}
                    onChange={(e) => setNewEmployeeForm({ ...newEmployeeForm, email: e.target.value })}
                    placeholder="maria.m@copperroomlv.com"
                    className="w-full px-3 py-2 bg-brand-surface-subtle border border-brand-border rounded-xl text-brand-text focus:outline-none focus:ring-1 focus:ring-brand-sage"
                  />
                  {formErrors.email && (
                    <span className="text-[11px] text-brand-terracotta mt-0.5 block">{formErrors.email}</span>
                  )}
                </div>

                <div>
                  <label className="block text-brand-text-secondary font-medium mb-1">
                    Mobile Phone *
                  </label>
                  <input
                    type="text"
                    value={newEmployeeForm.phone}
                    onChange={(e) => setNewEmployeeForm({ ...newEmployeeForm, phone: e.target.value })}
                    placeholder="(702) 555-0199"
                    className="w-full px-3 py-2 bg-brand-surface-subtle border border-brand-border rounded-xl text-brand-text focus:outline-none focus:ring-1 focus:ring-brand-sage"
                  />
                  {formErrors.phone && (
                    <span className="text-[11px] text-brand-terracotta mt-0.5 block">{formErrors.phone}</span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-brand-text-secondary font-medium mb-1">
                  Manager Notes & Station Qualifications
                </label>
                <textarea
                  rows={2}
                  value={newEmployeeForm.notes}
                  onChange={(e) => setNewEmployeeForm({ ...newEmployeeForm, notes: e.target.value })}
                  placeholder="e.g. Certified on main dining room section, alcohol server training completed..."
                  className="w-full px-3 py-2 bg-brand-surface-subtle border border-brand-border rounded-xl text-brand-text focus:outline-none focus:ring-1 focus:ring-brand-sage"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-brand-border">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-brand-text-secondary hover:text-brand-text bg-white border border-brand-border rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-brand-sidebar hover:bg-stone-900 rounded-xl shadow-subtle"
                >
                  Save Team Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

