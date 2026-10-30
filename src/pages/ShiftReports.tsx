import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatHours } from '../utils/formatters';
import {
  REPORT_HOURS_BY_DAY,
  REPORT_ROLE_DISTRIBUTION,
  REPORT_EXCEPTION_TRENDS
} from '../data/mockData';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import {
  FileBarChart,
  Calendar,
  Download,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Info,
  TrendingUp,
  Users
} from 'lucide-react';

export const ShiftReports: React.FC = () => {
  const { shifts, showToast } = useApp();

  const [dateFilter, setDateFilter] = useState<'today' | 'yesterday' | 'last7' | 'custom'>('today');

  // Aggregated KPIs
  const totalHours = shifts.reduce((acc, s) => acc + s.hoursWorked, 0);
  const completedShifts = shifts.filter(s => s.status === 'completed').length;
  const pendingShifts = shifts.filter(s => s.status !== 'completed').length;
  const overtimeCount = shifts.filter(s => s.hoursWorked > 8.0).length;
  const avgShiftDuration = totalHours / (shifts.length || 1);

  const handleExportCSV = () => {
    const headers = [
      'Shift ID',
      'Employee Name',
      'Role',
      'Date',
      'Scheduled Start',
      'Scheduled End',
      'Actual Clock-In',
      'Actual Clock-Out',
      'Hours Worked',
      'Declared Cash',
      'Expected Cash',
      'Cash Variance',
      'Declared Tips',
      'Status'
    ];

    const rows = shifts.map(s => [
      s.id,
      `"${s.employeeName}"`,
      `"${s.role}"`,
      s.date,
      s.scheduledStart,
      s.scheduledEnd,
      s.actualClockIn || 'N/A',
      s.actualClockOut || 'N/A',
      s.hoursWorked.toFixed(2),
      s.declaredCash.toFixed(2),
      s.expectedCash.toFixed(2),
      s.cashVariance.toFixed(2),
      s.declaredTips.toFixed(2),
      s.status
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `the_copper_room_shift_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Report Exported', 'CSV downloaded with full labor & financial records.', 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-brand-border">
        <div>
          <h2 className="text-2xl font-heading font-extrabold text-brand-text tracking-tight">
            Shift Reports
          </h2>
          <p className="text-xs sm:text-sm text-brand-text-secondary mt-1">
            Labor analytics, shift completion metrics, and exception reporting.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Date Filter selector */}
          <div className="flex items-center gap-1 bg-brand-surface border border-brand-border rounded-xl p-1 text-xs shadow-subtle">
            <button
              onClick={() => setDateFilter('today')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                dateFilter === 'today' ? 'bg-brand-sidebar text-white' : 'text-brand-text-secondary hover:text-brand-text'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setDateFilter('yesterday')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                dateFilter === 'yesterday' ? 'bg-brand-sidebar text-white' : 'text-brand-text-secondary hover:text-brand-text'
              }`}
            >
              Yesterday
            </button>
            <button
              onClick={() => setDateFilter('last7')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                dateFilter === 'last7' ? 'bg-brand-sidebar text-white' : 'text-brand-text-secondary hover:text-brand-text'
              }`}
            >
              Last 7 Days
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-brand-sidebar hover:bg-stone-900 text-white rounded-xl text-xs font-semibold shadow-subtle flex items-center gap-2 transition-all"
          >
            <Download className="w-4 h-4 text-brand-sage-soft" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Demonstration Notice */}
      <div className="p-3 bg-brand-surface-subtle border border-brand-border rounded-xl text-xs text-stone-500 flex items-center gap-2">
        <Info className="w-4 h-4 text-stone-400 flex-shrink-0" />
        <span>Demonstration analytics based on simulated Toast POS shift punch histories and server checkouts.</span>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="p-4 rounded-xl bg-brand-surface border border-brand-border shadow-subtle">
          <div className="text-[11px] font-semibold uppercase text-brand-text-secondary">
            Total Employee Hours
          </div>
          <div className="text-2xl font-heading font-bold text-brand-text mt-1 tabular-nums">
            {formatHours(totalHours)}
          </div>
          <div className="text-[11px] text-brand-sage-dark font-medium mt-1">
            Across 12 scheduled roles
          </div>
        </div>

        <div className="p-4 rounded-xl bg-brand-surface border border-brand-border shadow-subtle">
          <div className="text-[11px] font-semibold uppercase text-brand-text-secondary">
            Completed Shifts
          </div>
          <div className="text-2xl font-heading font-bold text-brand-text mt-1 tabular-nums">
            {completedShifts}
          </div>
          <div className="text-[11px] text-stone-500 font-medium mt-1">
            Fully clocked out & signed
          </div>
        </div>

        <div className="p-4 rounded-xl bg-brand-surface border border-brand-border shadow-subtle">
          <div className="text-[11px] font-semibold uppercase text-brand-text-secondary">
            Pending Shifts
          </div>
          <div className="text-2xl font-heading font-bold text-brand-text mt-1 tabular-nums">
            {pendingShifts}
          </div>
          <div className="text-[11px] text-brand-amber font-medium mt-1">
            Active on floor
          </div>
        </div>

        <div className="p-4 rounded-xl bg-brand-surface border border-brand-border shadow-subtle">
          <div className="text-[11px] font-semibold uppercase text-brand-text-secondary">
            Overtime Reviews
          </div>
          <div className="text-2xl font-heading font-bold text-brand-text mt-1 tabular-nums">
            {overtimeCount}
          </div>
          <div className="text-[11px] text-brand-terracotta font-medium mt-1">
            &gt; 8 hours logged
          </div>
        </div>

        <div className="p-4 rounded-xl bg-brand-surface border border-brand-border shadow-subtle col-span-2 md:col-span-1">
          <div className="text-[11px] font-semibold uppercase text-brand-text-secondary">
            Avg Shift Duration
          </div>
          <div className="text-2xl font-heading font-bold text-brand-text mt-1 tabular-nums">
            {avgShiftDuration.toFixed(1)} hrs
          </div>
          <div className="text-[11px] text-stone-500 font-medium mt-1">
            Target: 5.5 - 6.5 hrs
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Employee Hours by Day */}
        <div className="bg-brand-surface rounded-2xl border border-brand-border p-6 shadow-subtle">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-brand-border">
            <div>
              <h3 className="text-sm font-heading font-bold text-brand-text">
                Employee Hours by Day
              </h3>
              <p className="text-xs text-brand-text-secondary mt-0.5">
                Scheduled vs actual labor hours across current week
              </p>
            </div>
            <span className="text-[11px] font-semibold text-brand-sage-dark bg-brand-sage-soft px-2 py-0.5 rounded-md">
              Weekly Trend
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={REPORT_HOURS_BY_DAY} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="day" stroke="#777970" fontSize={11} tickLine={false} />
                <YAxis stroke="#777970" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    borderColor: '#E8E6DF',
                    boxShadow: '0 4px 12px rgba(37,40,34,0.08)',
                    fontSize: '12px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="scheduled" name="Scheduled Hours" fill="#E8E6DF" radius={[4, 4, 0, 0]} />
                <Bar dataKey="actual" name="Actual Worked" fill="#758775" radius={[4, 4, 0, 0]} />
                <Bar dataKey="overtime" name="Overtime" fill="#B87960" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Employee Distribution by Role */}
        <div className="bg-brand-surface rounded-2xl border border-brand-border p-6 shadow-subtle">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-brand-border">
            <div>
              <h3 className="text-sm font-heading font-bold text-brand-text">
                Labor Hours by Station Role
              </h3>
              <p className="text-xs text-brand-text-secondary mt-0.5">
                Distribution of floor labor budget by operational department
              </p>
            </div>
            <span className="text-[11px] font-semibold text-brand-text bg-brand-surface-subtle px-2 py-0.5 rounded-md">
              Tonight's Mix
            </span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={REPORT_ROLE_DISTRIBUTION}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="hours"
                  nameKey="role"
                >
                  {REPORT_ROLE_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: number) => [`${val} hrs`, 'Labor Hours']}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    borderColor: '#E8E6DF',
                    fontSize: '12px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Exception Breakdown */}
        <div className="bg-brand-surface rounded-2xl border border-brand-border p-6 shadow-subtle lg:col-span-2">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-brand-border">
            <div>
              <h3 className="text-sm font-heading font-bold text-brand-text">
                Operational Exceptions & Audit Flags
              </h3>
              <p className="text-xs text-brand-text-secondary mt-0.5">
                Frequency of manager overrides, missing punches, and cash adjustments
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {REPORT_EXCEPTION_TRENDS.map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-brand-surface-subtle border border-brand-border text-center">
                <div className="text-xl font-heading font-bold text-brand-text tabular-nums">
                  {item.count}
                </div>
                <div className="text-xs font-semibold text-brand-text mt-0.5">{item.category}</div>
                <div className="text-[10px] text-stone-400 mt-1">Logged this week</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

