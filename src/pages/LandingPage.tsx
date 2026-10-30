import React from 'react';
import { useApp } from '../context/AppContext';
import {
  ArrowRight,
  Clock,
  CheckCircle2,
  Users,
  ShieldCheck,
  DollarSign,
  TrendingUp,
  Sparkles,
  ChevronRight,
  Award,
  Calendar,
  UtensilsCrossed,
  Layers,
  Activity
} from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';
import { EmployeeAvatar } from '../components/common/EmployeeAvatar';

interface LandingPageProps {
  onEnterApp: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp }) => {
  const { navigateTo, metrics } = useApp();

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text flex flex-col selection:bg-brand-sage-soft selection:text-brand-sage-dark">
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-40 bg-brand-bg/90 backdrop-blur-md border-b border-brand-border px-6 lg:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-sidebar text-white flex items-center justify-center font-heading font-black text-xs">
            SD
          </div>
          <div>
            <div className="text-sm font-heading font-bold tracking-[0.18em] text-brand-text">
              SERVICE DESK
            </div>
            <div className="text-[10px] tracking-wider uppercase text-brand-text-secondary font-medium">
              Restaurant Operations
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8 text-xs font-medium text-brand-text-secondary">
          <a href="#how-it-works" className="hover:text-brand-text transition-colors">
            How It Works
          </a>
          <a href="#operational-visibility" className="hover:text-brand-text transition-colors">
            Operational Visibility
          </a>
          <a href="#capabilities" className="hover:text-brand-text transition-colors">
            Capabilities
          </a>
          <span className="text-brand-border">|</span>
          <span className="text-xs text-brand-sage-dark font-semibold">The Copper Room – Las Vegas</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onEnterApp}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-brand-sidebar hover:bg-stone-900 text-white shadow-subtle hover:shadow-elevated transition-all flex items-center gap-2"
          >
            <span>Enter Operations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-6 lg:px-12 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-sage-soft border border-brand-sage/20 text-brand-sage-dark text-xs font-medium mb-6">
            <Sparkles className="w-3.5 h-3.5 text-brand-sage" />
            <span>Toast POS Shift Management & Operations Reconfiguration</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight text-brand-text mb-6 leading-[1.12]">
            Every Shift. Every Detail.{' '}
            <span className="text-brand-sage-dark block sm:inline">Under Control.</span>
          </h1>

          <p className="text-base sm:text-lg text-brand-text-secondary max-w-2xl mx-auto leading-relaxed mb-8">
            Bring clarity to employee management, shift operations, and end-of-day workflows. Designed specifically for high-volume restaurant and bar management.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onEnterApp}
              className="w-full sm:w-auto px-7 py-3.5 text-sm font-semibold rounded-xl bg-brand-sidebar hover:bg-stone-900 text-white shadow-elevated hover:shadow-2xl transition-all flex items-center justify-center gap-2.5 group"
            >
              <span>Explore Operations</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <a
              href="#how-it-works"
              className="w-full sm:w-auto px-7 py-3.5 text-sm font-medium rounded-xl bg-brand-surface hover:bg-brand-surface-subtle border border-brand-border text-brand-text shadow-subtle transition-colors text-center"
            >
              See How It Works
            </a>
          </div>
        </div>

        {/* Hero Interactive Component Mockup */}
        <div className="relative mx-auto max-w-5xl rounded-2xl p-2 bg-gradient-to-b from-[#E8E6DF] to-transparent shadow-2xl">
          <div className="bg-brand-surface rounded-xl border border-brand-border overflow-hidden p-6 lg:p-8 space-y-6">
            {/* Top mini toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-brand-border">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-600 animate-pulse" />
                <span className="text-sm font-semibold text-brand-text">Live Dinner Service — Floor Overview</span>
                <span className="text-xs px-2.5 py-0.5 bg-brand-surface-subtle text-brand-text-secondary rounded-full font-medium">
                  Friday Peak Rush
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-brand-text-secondary">Simulated Toast Sync:</span>
                <span className="text-xs font-semibold text-brand-sage-dark bg-brand-sage-soft px-2 py-0.5 rounded-full">
                  Real-time Active
                </span>
              </div>
            </div>

            {/* Mini Dashboard Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-brand-surface-subtle border border-brand-border">
                <div className="text-[11px] font-semibold uppercase text-brand-text-secondary mb-1">
                  Employees on Shift
                </div>
                <div className="text-2xl font-heading font-bold text-brand-text tabular-nums">
                  {metrics.employeesOnShiftCount}
                </div>
                <div className="text-[11px] text-brand-sage-dark font-medium mt-1">
                  +2 vs afternoon shift
                </div>
              </div>

              <div className="p-4 rounded-xl bg-brand-surface-subtle border border-brand-border">
                <div className="text-[11px] font-semibold uppercase text-brand-text-secondary mb-1">
                  Active Shifts
                </div>
                <div className="text-2xl font-heading font-bold text-brand-text tabular-nums">
                  {metrics.activeShiftsCount}
                </div>
                <div className="text-[11px] text-brand-text-secondary font-medium mt-1">
                  4 completed shifts
                </div>
              </div>

              <div className="p-4 rounded-xl bg-brand-surface-subtle border border-brand-border">
                <div className="text-[11px] font-semibold uppercase text-brand-text-secondary mb-1">
                  Pending Clock-Outs
                </div>
                <div className="text-2xl font-heading font-bold text-brand-text tabular-nums">
                  {metrics.pendingClockoutsCount}
                </div>
                <div className="text-[11px] text-brand-amber font-medium mt-1">
                  Awaiting manager sign-off
                </div>
              </div>

              <div className="p-4 rounded-xl bg-brand-surface-subtle border border-brand-border">
                <div className="text-[11px] font-semibold uppercase text-brand-text-secondary mb-1">
                  Closing Progress
                </div>
                <div className="text-2xl font-heading font-bold text-brand-text tabular-nums">
                  {metrics.closingPercentage}%
                </div>
                <div className="text-[11px] text-brand-sage-dark font-medium mt-1">
                  {metrics.checklistCompletedCount} of {metrics.checklistTotalCount} tasks verified
                </div>
              </div>
            </div>

            {/* Split row preview: Live table & closing widget */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
              <div className="lg:col-span-2 border border-brand-border rounded-xl p-4 bg-brand-bg/40">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-brand-text uppercase tracking-wider">
                    Recent Shift Activity
                  </span>
                  <span className="text-xs text-brand-sage-dark font-medium">Synchronized</span>
                </div>
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-white border border-brand-border">
                    <div className="flex items-center gap-2.5">
                      <EmployeeAvatar name="Sarah Mitchell" size="sm" status="active" />
                      <div>
                        <div className="font-semibold text-brand-text">Sarah Mitchell (Server)</div>
                        <div className="text-[11px] text-brand-text-secondary">Section 1 — Dining Patio</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="tabular-nums font-medium text-brand-text">5h 24m</span>
                      <StatusBadge status="active" size="sm" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-white border border-brand-border">
                    <div className="flex items-center gap-2.5">
                      <EmployeeAvatar name="James Carter" size="sm" status="active" />
                      <div>
                        <div className="font-semibold text-brand-text">James Carter (Bartender)</div>
                        <div className="text-[11px] text-brand-text-secondary">Main Cocktail Well</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="tabular-nums font-medium text-brand-text">5h 08m</span>
                      <StatusBadge status="active" size="sm" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-white border border-brand-border">
                    <div className="flex items-center gap-2.5">
                      <EmployeeAvatar name="Michael Brooks" size="sm" status="break" />
                      <div>
                        <div className="font-semibold text-brand-text">Michael Brooks (Barback)</div>
                        <div className="text-[11px] text-brand-text-secondary">Keg Restock Inspection</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="tabular-nums font-medium text-brand-text">4h 30m</span>
                      <StatusBadge status="pending" label="Pending Sign-off" size="sm" />
                    </div>
                  </div>
                </div>
              </div>

              {/* End of day readiness mini panel */}
              <div className="border border-brand-border rounded-xl p-4 bg-white flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-brand-text uppercase tracking-wider">
                      Shift-End Readiness
                    </span>
                    <span className="text-xs font-bold text-brand-text tabular-nums">{metrics.closingPercentage}%</span>
                  </div>

                  <div className="w-full bg-brand-surface-subtle h-2 rounded-full overflow-hidden mb-4">
                    <div
                      className="bg-brand-sage h-full rounded-full transition-all duration-300"
                      style={{ width: `${metrics.closingPercentage}%` }}
                    />
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between text-brand-text-secondary">
                      <span>Attendance & Clock-outs</span>
                      <span className="text-brand-text font-medium">9 of 12 complete</span>
                    </div>
                    <div className="flex items-center justify-between text-brand-text-secondary">
                      <span>Cash Turn-in Balances</span>
                      <span className="text-brand-amber font-medium">1 review flagged</span>
                    </div>
                    <div className="flex items-center justify-between text-brand-text-secondary">
                      <span>Closing Checklist</span>
                      <span className="text-brand-sage-dark font-medium">{metrics.checklistCompletedCount}/{metrics.checklistTotalCount} checked</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={onEnterApp}
                  className="mt-5 w-full py-2.5 bg-brand-sidebar hover:bg-stone-900 text-white rounded-xl text-xs font-semibold shadow-subtle flex items-center justify-center gap-2"
                >
                  <span>Launch Shift Closing Workflow</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section: How It Works */}
      <section id="how-it-works" className="py-20 px-6 lg:px-12 bg-white border-y border-brand-border">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-sage-dark">
              Structured Operations
            </span>
            <h2 className="text-3xl font-heading font-bold text-brand-text mt-2 mb-4">
              How the Reconfigured Workflow Works
            </h2>
            <p className="text-sm text-brand-text-secondary leading-relaxed">
              Eliminate end-of-night chaos with a calm, methodical 3-phase management structure built around real restaurant shifts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-brand-bg border border-brand-border space-y-4 relative">
              <div className="w-10 h-10 rounded-xl bg-brand-sidebar text-white flex items-center justify-center font-bold text-sm">
                01
              </div>
              <h3 className="text-lg font-heading font-semibold text-brand-text">
                Monitor Your Team in Real-Time
              </h3>
              <p className="text-xs text-brand-text-secondary leading-relaxed">
                Observe live floor attendance, break schedules, and elapsed shift durations without digging through cluttered POS menus.
              </p>
              <ul className="text-xs text-brand-text space-y-2 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-sage" />
                  <span>Instant active/break/off status</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-sage" />
                  <span>Scheduled vs. actual clock punch visibility</span>
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-brand-bg border border-brand-border space-y-4 relative">
              <div className="w-10 h-10 rounded-xl bg-brand-sidebar text-white flex items-center justify-center font-bold text-sm">
                02
              </div>
              <h3 className="text-lg font-heading font-semibold text-brand-text">
                Review Activity & Exceptions
              </h3>
              <p className="text-xs text-brand-text-secondary leading-relaxed">
                Approve missing punches, authorize overtime, and inspect drawer variances as they happen rather than discovering them days later.
              </p>
              <ul className="text-xs text-brand-text space-y-2 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-sage" />
                  <span>One-click manager approvals</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-sage" />
                  <span>Audit-ready cash drawer tracking</span>
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-brand-bg border border-brand-border space-y-4 relative">
              <div className="w-10 h-10 rounded-xl bg-brand-sidebar text-white flex items-center justify-center font-bold text-sm">
                03
              </div>
              <h3 className="text-lg font-heading font-semibold text-brand-text">
                Complete Closing Operations
              </h3>
              <p className="text-xs text-brand-text-secondary leading-relaxed">
                Follow an intuitive 6-stage guided closing flow that ensures every register, tip declaration, and closing checklist item is locked.
              </p>
              <ul className="text-xs text-brand-text space-y-2 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-sage" />
                  <span>Step-by-step verified sign-off</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-sage" />
                  <span>Automated end-of-day summary & export</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Operational Visibility */}
      <section id="operational-visibility" className="py-20 px-6 lg:px-12 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-sage-dark">
              Hospitality Focused
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-brand-text mt-2 mb-5">
              Built for the Reality of a Busy Las Vegas Floor
            </h2>
            <p className="text-sm text-brand-text-secondary leading-relaxed mb-6">
              When the kitchen is wrapping up dinner service and the bar is turning over late-night tables, managers do not have 45 minutes to troubleshoot confusing POS backoffice software.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-sage-soft text-brand-sage-dark flex items-center justify-center flex-shrink-0 mt-0.5">
                  <DollarSign className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-brand-text">Clear Cash & Tip Reconciliation</h4>
                  <p className="text-xs text-brand-text-secondary mt-0.5">
                    Clear variance flags identify register shortages or tip pool adjustments without assuming misconduct.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-sage-soft text-brand-sage-dark flex items-center justify-center flex-shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-brand-text">Enforced Closing Integrity</h4>
                  <p className="text-xs text-brand-text-secondary mt-0.5">
                    Prevent unresolved clock-outs from spilling into tomorrow morning's payroll audit log.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-sage-soft text-brand-sage-dark flex items-center justify-center flex-shrink-0 mt-0.5">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-brand-text">Executive Visibility & Labor Control</h4>
                  <p className="text-xs text-brand-text-secondary mt-0.5">
                    Instant breakdown of labor hours, scheduled variance, and overtime trends by role and day.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={onEnterApp}
                className="px-6 py-3 rounded-xl bg-brand-sidebar hover:bg-stone-900 text-white text-xs font-semibold shadow-subtle flex items-center gap-2"
              >
                <span>Test Live Interactive Demo</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-brand-border shadow-elevated space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-brand-border">
              <div className="text-xs font-bold uppercase tracking-wider text-brand-text">
                Live Prototype Features
              </div>
              <span className="text-[11px] font-semibold text-brand-sage-dark bg-brand-sage-soft px-2.5 py-0.5 rounded-full">
                Interactive State Engine
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-brand-surface-subtle border border-brand-border flex items-center justify-between">
                <div>
                  <div className="font-semibold text-brand-text">Simulate Clock In & Out</div>
                  <div className="text-brand-text-secondary text-[11px]">Real-time punch updates synced across all tabs</div>
                </div>
                <span className="text-xs font-semibold text-brand-sage-dark">Live</span>
              </div>

              <div className="p-3 rounded-xl bg-brand-surface-subtle border border-brand-border flex items-center justify-between">
                <div>
                  <div className="font-semibold text-brand-text">Guided 6-Stage Shift Close</div>
                  <div className="text-brand-text-secondary text-[11px]">Walkthrough from attendance to final lock</div>
                </div>
                <span className="text-xs font-semibold text-brand-sage-dark">Live</span>
              </div>

              <div className="p-3 rounded-xl bg-brand-surface-subtle border border-brand-border flex items-center justify-between">
                <div>
                  <div className="font-semibold text-brand-text">Manager Approval Center</div>
                  <div className="text-brand-text-secondary text-[11px]">Resolve missing punches & drawer variances</div>
                </div>
                <span className="text-xs font-semibold text-brand-sage-dark">Live</span>
              </div>

              <div className="p-3 rounded-xl bg-brand-surface-subtle border border-brand-border flex items-center justify-between">
                <div>
                  <div className="font-semibold text-brand-text">Export CSV Shift Report</div>
                  <div className="text-brand-text-secondary text-[11px]">Generates actual spreadsheet for payroll & accounting</div>
                </div>
                <span className="text-xs font-semibold text-brand-sage-dark">Live</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-20 px-6 lg:px-12 bg-brand-sidebar text-white text-center">
        <div className="max-w-3xl mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-stone-800 border border-stone-700 mx-auto flex items-center justify-center mb-6">
            <Sparkles className="w-6 h-6 text-brand-sage-soft" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-heading font-bold mb-4 tracking-tight">
            Bring More Clarity to Every Shift.
          </h2>

          <p className="text-sm sm:text-base text-stone-300 max-w-xl mx-auto mb-8 leading-relaxed">
            Ready to experience how your restaurant operations could flow? Explore the interactive interface now.
          </p>

          <button
            onClick={onEnterApp}
            className="px-8 py-4 bg-brand-sage hover:bg-brand-sage-dark text-white rounded-xl text-sm font-semibold shadow-2xl transition-all inline-flex items-center gap-2 group"
          >
            <span>Enter Operations Dashboard</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* Footer (PRD Section 17) */}
      <footer className="bg-[#222521] text-stone-400 text-xs py-12 px-6 lg:px-12 border-t border-[#383C36]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-stone-800 text-white flex items-center justify-center font-bold text-xs">
                SD
              </div>
              <span className="font-heading font-bold text-white tracking-widest text-xs">
                SERVICE DESK
              </span>
            </div>
            <p className="text-stone-400 text-[11px] leading-relaxed">
              Premium restaurant shift management & operations reconfiguration prototype for hospitality venues.
            </p>
          </div>

          <div>
            <h4 className="text-stone-200 font-semibold mb-3">Operations</h4>
            <ul className="space-y-2 text-[11px]">
              <li><button onClick={() => navigateTo('overview')} className="hover:text-white">Operational Dashboard</button></li>
              <li><button onClick={() => navigateTo('live_shifts')} className="hover:text-white">Live Shifts Management</button></li>
              <li><button onClick={() => navigateTo('employees')} className="hover:text-white">Employee Roster</button></li>
              <li><button onClick={() => navigateTo('shift_closing')} className="hover:text-white">Shift Closing Workflow</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-stone-200 font-semibold mb-3">Financial & Control</h4>
            <ul className="space-y-2 text-[11px]">
              <li><button onClick={() => navigateTo('reconciliation')} className="hover:text-white">Cash & Tip Review</button></li>
              <li><button onClick={() => navigateTo('approvals')} className="hover:text-white">Manager Approvals</button></li>
              <li><button onClick={() => navigateTo('checklist')} className="hover:text-white">Closing Checklist</button></li>
              <li><button onClick={() => navigateTo('reports')} className="hover:text-white">Shift Reports & CSV</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-stone-200 font-semibold mb-3">Client Demonstration</h4>
            <p className="text-[11px] text-stone-400 leading-relaxed">
              Prepared for restaurant & bar ownership in Las Vegas, Nevada.
            </p>
            <div className="mt-2 text-[10px] text-stone-500">
              Venue: The Copper Room – Las Vegas
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto pt-6 border-t border-[#333630] flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-stone-500">
          <div>
            Independent concept prototype. Not an official Toast Inc. product. Toast is a registered trademark of Toast, Inc.
          </div>
          <div>
            &copy; {new Date().getFullYear()} SERVICE DESK Hospitality Tech. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

