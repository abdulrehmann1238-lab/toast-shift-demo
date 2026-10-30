import React from 'react';
import { X, CheckCircle, Shield, Sparkles, Terminal, Info } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-brand-surface rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-modal border border-brand-border animate-in zoom-in-95 duration-150">
        <div className="px-6 py-5 border-b border-brand-border flex items-center justify-between bg-brand-bg/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-sage-soft text-brand-sage-dark flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-heading font-semibold text-brand-text">
                Toast POS Reconfiguration Overview
              </h3>
              <p className="text-xs text-brand-text-secondary">
                Restaurant & Bar Operations — Las Vegas Demo
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-brand-text-secondary hover:text-brand-text hover:bg-brand-surface-subtle"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-brand-text">
          <div className="bg-brand-surface-subtle p-4 rounded-xl border border-brand-border flex items-start gap-3">
            <Info className="w-4 h-4 text-brand-sage flex-shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <span className="font-semibold text-brand-text">Independent Operational Prototype:</span>{' '}
              This interactive application demonstrates how a busy Las Vegas hospitality venue's Toast POS shift-end and employee workflows can be streamlined, organized, and visualized with clarity for floor managers and ownership.
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-brand-text flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-brand-sage" />
              Key Interactive Test Workflows
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl border border-brand-border bg-white space-y-1">
                <div className="font-semibold text-brand-text">1. Live Punch Simulation</div>
                <p className="text-brand-text-secondary leading-relaxed">
                  Go to <strong>Live Shifts</strong> to simulate clock-in, clock-out, or break transitions. Notice how real-time metrics and the activity feed update synchronously across all views.
                </p>
              </div>

              <div className="p-3 rounded-xl border border-brand-border bg-white space-y-1">
                <div className="font-semibold text-brand-text">2. Guided 6-Stage Shift Closing</div>
                <p className="text-brand-text-secondary leading-relaxed">
                  Go to <strong>Shift Closing</strong> to walk step-by-step through Attendance, Clock-outs, Hours Review, Cash/Tip Reconciliation, and Final Sign-Off.
                </p>
              </div>

              <div className="p-3 rounded-xl border border-brand-border bg-white space-y-1">
                <div className="font-semibold text-brand-text">3. Cash & Tip Discrepancies</div>
                <p className="text-brand-text-secondary leading-relaxed">
                  Review <strong>Cash & Tips</strong> to inspect the -$25.00 variance on Server Lucas Ramirez. Resolve discrepancies with audit notes or manager waivers.
                </p>
              </div>

              <div className="p-3 rounded-xl border border-brand-border bg-white space-y-1">
                <div className="font-semibold text-brand-text">4. Dynamic Reports & CSV Export</div>
                <p className="text-brand-text-secondary leading-relaxed">
                  Under <strong>Reports</strong>, view interactive labor breakdowns, hourly trends, and click <strong>Export CSV</strong> to generate a real spreadsheet.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-brand-text flex items-center gap-2">
              <Shield className="w-4 h-4 text-brand-sage" />
              Disclaimer & Production Deployment
            </h4>
            <p className="text-brand-text-secondary leading-relaxed">
              All employee names, hourly rates, drawer totals, and tip numbers shown in this demo are simulated sample records. In a production environment, this UI connects securely to the Toast Partner API (V1/V2 Shift & Time Entry endpoints) and Toast Labor Management Webhooks.
            </p>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-brand-border bg-brand-bg/50 flex items-center justify-between">
          <span className="text-[11px] text-brand-text-secondary">
            Built with React, TypeScript & Tailwind CSS
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-brand-sidebar hover:bg-stone-900 text-white rounded-xl text-xs font-semibold shadow-subtle transition-colors"
          >
            Got it, Let's Explore
          </button>
        </div>
      </div>
    </div>
  );
};

