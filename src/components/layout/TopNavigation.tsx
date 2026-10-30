import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ScreenType } from '../../types';
import {
  Menu,
  Bell,
  ChevronDown,
  Building2,
  Calendar,
  Clock,
  RotateCcw,
  User,
  Settings,
  Sparkles
} from 'lucide-react';
import { NotificationDropdown } from '../common/NotificationDropdown';
import { EmployeeAvatar } from '../common/EmployeeAvatar';

interface TopNavigationProps {
  onToggleSidebar: () => void;
  onOpenResetConfirm: () => void;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({
  onToggleSidebar,
  onOpenResetConfirm
}) => {
  const {
    currentScreen,
    navigateTo,
    restaurantName,
    setRestaurantName,
    notifications
  } = useApp();

  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLocationMenu, setShowLocationMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })
      );
      setCurrentDate(
        now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const unreadCount = notifications.filter(n => n.unread).length;

  const getBreadcrumb = (screen: ScreenType): { section: string; title: string } => {
    switch (screen) {
      case 'overview':
        return { section: 'Operations', title: 'Operational Dashboard' };
      case 'live_shifts':
        return { section: 'Operations', title: 'Live Shift Management' };
      case 'employees':
        return { section: 'Operations', title: 'Employee Directory' };
      case 'employee_profile':
        return { section: 'Employees', title: 'Staff Profile & History' };
      case 'shift_closing':
        return { section: 'Operations', title: 'Shift Closing & Reconciliation' };
      case 'reconciliation':
        return { section: 'Financial', title: 'Cash & Tip Review' };
      case 'reports':
        return { section: 'Financial', title: 'Shift & Labor Reports' };
      case 'approvals':
        return { section: 'Management', title: 'Manager Approvals Center' };
      case 'checklist':
        return { section: 'Management', title: 'Closing Checklist' };
      case 'settings':
        return { section: 'Management', title: 'Workflow & POS Settings' };
      case 'landing':
      default:
        return { section: 'Presentation', title: 'Operations Overview' };
    }
  };

  const breadcrumb = getBreadcrumb(currentScreen);

  const locations = [
    'The Copper Room – Las Vegas',
    'The Copper Room – Summerlin Lounge',
    'The Copper Room – Strip Patio'
  ];

  return (
    <header className="sticky top-0 z-30 bg-brand-surface/95 backdrop-blur-md border-b border-brand-border px-4 lg:px-8 py-3 transition-colors">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile trigger & Page title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 text-brand-text-secondary hover:text-brand-text hover:bg-brand-surface-subtle rounded-xl"
            aria-label="Open navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-1.5 text-xs text-brand-text-secondary">
              <span>{breadcrumb.section}</span>
              <span>/</span>
              <span className="text-brand-text font-medium">{breadcrumb.title}</span>
            </div>
            <h1 className="text-lg lg:text-xl font-heading font-bold text-brand-text tracking-tight hidden sm:block">
              {breadcrumb.title}
            </h1>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Restaurant Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowLocationMenu(!showLocationMenu);
                setShowNotifications(false);
                setShowProfileMenu(false);
              }}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-brand-text bg-brand-surface-subtle hover:bg-brand-border rounded-xl border border-brand-border transition-colors"
            >
              <Building2 className="w-3.5 h-3.5 text-brand-sage-dark flex-shrink-0" />
              <span className="hidden md:inline truncate max-w-[170px]">{restaurantName}</span>
              <span className="md:hidden">Copper Room</span>
              <ChevronDown className="w-3 h-3 text-brand-text-secondary" />
            </button>

            {showLocationMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-brand-surface rounded-xl shadow-modal border border-brand-border p-1 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-brand-text-secondary">
                  Active Toast Location
                </div>
                {locations.map(loc => (
                  <button
                    key={loc}
                    onClick={() => {
                      setRestaurantName(loc);
                      setShowLocationMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs rounded-lg flex items-center justify-between ${
                      restaurantName === loc
                        ? 'bg-brand-sage-soft text-brand-sage-dark font-semibold'
                        : 'text-brand-text hover:bg-brand-surface-subtle'
                    }`}
                  >
                    <span>{loc}</span>
                    {restaurantName === loc && <span className="text-xs">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Current Date & Live Clock */}
          <div className="hidden xl:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-brand-surface-subtle border border-brand-border text-xs text-brand-text">
            <div className="flex items-center gap-1.5 text-brand-text-secondary">
              <Calendar className="w-3.5 h-3.5" />
              <span>{currentDate}</span>
            </div>
            <span className="text-brand-border">|</span>
            <div className="flex items-center gap-1.5 font-medium tabular-nums text-brand-text">
              <Clock className="w-3.5 h-3.5 text-brand-sage" />
              <span>{currentTime}</span>
            </div>
          </div>

          {/* Fast Shift Closing CTA */}
          {currentScreen !== 'shift_closing' && (
            <button
              onClick={() => navigateTo('shift_closing')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-brand-sidebar hover:bg-stone-900 text-white transition-all shadow-subtle hover:shadow-elevated"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-sage-soft" />
              <span>Shift Closing</span>
            </button>
          )}

          {/* Notification Button */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowLocationMenu(false);
                setShowProfileMenu(false);
              }}
              className="p-2 rounded-xl text-brand-text hover:bg-brand-surface-subtle border border-transparent hover:border-brand-border relative transition-colors"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-terracotta ring-2 ring-white" />
              )}
            </button>

            <NotificationDropdown
              isOpen={showNotifications}
              onClose={() => setShowNotifications(false)}
            />
          </div>

          {/* Manager Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
                setShowLocationMenu(false);
              }}
              className="flex items-center gap-2 p-1 pl-2 rounded-xl hover:bg-brand-surface-subtle border border-transparent hover:border-brand-border transition-colors"
            >
              <span className="text-xs font-medium text-brand-text hidden sm:inline">Alex V.</span>
              <EmployeeAvatar
                name="Alex Vance"
                avatar="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
                size="sm"
                status="active"
              />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-brand-surface rounded-2xl shadow-modal border border-brand-border p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="p-3 border-b border-brand-border">
                  <div className="text-xs font-semibold text-brand-text">Alex Vance</div>
                  <div className="text-[11px] text-brand-text-secondary">General Manager (Admin)</div>
                  <div className="text-[10px] text-brand-sage-dark font-medium mt-1">Toast Terminal ID: GM-0891</div>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      navigateTo('employee_profile', 'emp-101');
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-brand-text hover:bg-brand-surface-subtle rounded-lg flex items-center gap-2"
                  >
                    <User className="w-3.5 h-3.5 text-stone-500" />
                    <span>View GM Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      navigateTo('settings');
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-brand-text hover:bg-brand-surface-subtle rounded-lg flex items-center gap-2"
                  >
                    <Settings className="w-3.5 h-3.5 text-stone-500" />
                    <span>Workflow Settings</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onOpenResetConfirm();
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-brand-terracotta hover:bg-brand-terracotta-soft rounded-lg flex items-center gap-2"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-brand-terracotta" />
                    <span>Reset Demo Data</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

