import React from 'react';
import { useApp } from '../../context/AppContext';
import { ScreenType } from '../../types';
import {
  LayoutDashboard,
  Clock,
  Users,
  CheckSquare,
  DollarSign,
  FileBarChart,
  ShieldCheck,
  Settings,
  HelpCircle,
  Building2,
  ChevronRight,
  LogOut,
  Sparkles
} from 'lucide-react';
import { EmployeeAvatar } from '../common/EmployeeAvatar';

interface AppSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenHelp: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({ isOpen, onClose, onOpenHelp }) => {
  const {
    currentScreen,
    navigateTo,
    restaurantName,
    metrics,
    approvals,
    checklist
  } = useApp();

  const pendingApprovalsCount = approvals.filter(a => a.status === 'pending').length;
  const pendingChecklistCount = checklist.filter(c => !c.completed).length;

  const navItems: {
    category: string;
    items: {
      id: ScreenType;
      label: string;
      icon: React.ReactNode;
      badge?: string | number;
      badgeType?: 'sage' | 'amber' | 'terracotta';
    }[];
  }[] = [
    {
      category: 'OPERATIONS',
      items: [
        {
          id: 'overview',
          label: 'Overview',
          icon: <LayoutDashboard className="w-4 h-4" />
        },
        {
          id: 'live_shifts',
          label: 'Live Shifts',
          icon: <Clock className="w-4 h-4" />,
          badge: metrics.activeShiftsCount > 0 ? `${metrics.activeShiftsCount} Active` : undefined,
          badgeType: 'sage'
        },
        {
          id: 'employees',
          label: 'Employees',
          icon: <Users className="w-4 h-4" />
        },
        {
          id: 'shift_closing',
          label: 'Shift Closing',
          icon: <Sparkles className="w-4 h-4" />,
          badge: `${metrics.closingPercentage}%`,
          badgeType: metrics.closingPercentage >= 80 ? 'sage' : 'amber'
        }
      ]
    },
    {
      category: 'FINANCIAL',
      items: [
        {
          id: 'reconciliation',
          label: 'Cash & Tips',
          icon: <DollarSign className="w-4 h-4" />,
          badge: metrics.totalCashVariance !== 0 ? 'Var' : undefined,
          badgeType: 'terracotta'
        },
        {
          id: 'reports',
          label: 'Reports',
          icon: <FileBarChart className="w-4 h-4" />
        }
      ]
    },
    {
      category: 'MANAGEMENT',
      items: [
        {
          id: 'approvals',
          label: 'Approvals',
          icon: <ShieldCheck className="w-4 h-4" />,
          badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : undefined,
          badgeType: 'terracotta'
        },
        {
          id: 'checklist',
          label: 'Closing Checklist',
          icon: <CheckSquare className="w-4 h-4" />,
          badge: pendingChecklistCount > 0 ? `${pendingChecklistCount} left` : 'Done',
          badgeType: pendingChecklistCount > 0 ? 'amber' : 'sage'
        },
        {
          id: 'settings',
          label: 'Workflow Settings',
          icon: <Settings className="w-4 h-4" />
        }
      ]
    }
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-stone-900/50 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-brand-sidebar text-white flex flex-col transition-transform duration-200 ease-in-out border-r border-[#383C36] lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-[#383C36] flex items-center justify-between">
          <div
            onClick={() => navigateTo('overview')}
            className="cursor-pointer group flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-xl bg-stone-800 flex items-center justify-center border border-stone-700 group-hover:border-brand-sage transition-colors">
              <span className="font-heading font-black text-sm text-brand-sage-soft">SD</span>
            </div>
            <div>
              <div className="text-sm font-heading font-bold tracking-[0.16em] text-white">
                SERVICE DESK
              </div>
              <div className="text-[10px] tracking-wider uppercase text-brand-sidebar-secondary font-medium">
                Restaurant Operations
              </div>
            </div>
          </div>
        </div>

        {/* Restaurant Badge / Context */}
        <div className="px-5 py-3 bg-[#222521] border-b border-[#353833] flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <Building2 className="w-3.5 h-3.5 text-brand-sidebar-secondary flex-shrink-0" />
            <span className="text-xs text-stone-300 font-medium truncate" title={restaurantName}>
              {restaurantName}
            </span>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse flex-shrink-0" title="Shift active" />
        </div>

        {/* Navigation Groups */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navItems.map(group => (
            <div key={group.category} className="space-y-1">
              <div className="px-3 text-[10px] font-semibold tracking-wider text-brand-sidebar-secondary uppercase">
                {group.category}
              </div>
              {group.items.map(item => {
                const isActive = currentScreen === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      navigateTo(item.id);
                      onClose();
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-brand-sage text-white font-semibold shadow-sm'
                        : 'text-stone-300 hover:text-white hover:bg-brand-sidebar-hover'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={isActive ? 'text-white' : 'text-stone-400'}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </div>

                    {item.badge !== undefined && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : item.badgeType === 'sage'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : item.badgeType === 'terracotta'
                            ? 'bg-rose-950 text-rose-300 border border-rose-800'
                            : 'bg-amber-950 text-amber-300 border border-amber-800'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}

          {/* Quick Landing Page link */}
          <div className="pt-2">
            <button
              onClick={() => {
                navigateTo('landing');
                onClose();
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-stone-400 hover:text-white hover:bg-brand-sidebar-hover transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <LogOut className="w-4 h-4" />
                <span>Client Presentation</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-stone-500" />
            </button>
          </div>
        </div>

        {/* Footer info & Manager Profile */}
        <div className="p-3 border-t border-[#383C36] bg-[#222521] space-y-2">
          <button
            onClick={onOpenHelp}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-stone-400 hover:text-stone-200 rounded-lg hover:bg-brand-sidebar-hover transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5 text-stone-400" />
            <span>Operational Help & Specs</span>
          </button>

          <div
            onClick={() => {
              navigateTo('employee_profile', 'emp-101');
              onClose();
            }}
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-brand-sidebar-hover cursor-pointer transition-colors"
          >
            <EmployeeAvatar
              name="Alex Vance"
              avatar="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
              size="sm"
              status="active"
            />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-white truncate">Alex Vance</div>
              <div className="text-[10px] text-brand-sidebar-secondary truncate">General Manager</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

