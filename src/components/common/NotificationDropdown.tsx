import React, { useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, Check, CheckCheck, ExternalLink, AlertTriangle, AlertCircle, Info, CheckCircle2 } from 'lucide-react';
import { ScreenType } from '../../types';

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ isOpen, onClose }) => {
  const { notifications, markNotificationRead, markAllNotificationsRead, navigateTo } = useApp();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return <AlertCircle className="w-4 h-4 text-brand-terracotta" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-brand-amber" />;
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-brand-sage" />;
      case 'info':
      default:
        return <Info className="w-4 h-4 text-stone-500" />;
    }
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-80 sm:w-96 bg-brand-surface rounded-2xl shadow-modal border border-brand-border z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
    >
      <div className="p-4 border-b border-brand-border flex items-center justify-between bg-brand-bg/60">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-brand-text" />
          <span className="text-sm font-semibold text-brand-text">Notifications</span>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 text-xs font-semibold bg-brand-terracotta-soft text-brand-terracotta rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={() => markAllNotificationsRead()}
            className="text-xs text-brand-sage-dark hover:underline flex items-center gap-1 font-medium"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            Mark all read
          </button>
        )}
      </div>

      <div className="max-h-96 overflow-y-auto divide-y divide-brand-border">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-xs text-brand-text-secondary">
            No active notifications
          </div>
        ) : (
          notifications.map(notif => (
            <div
              key={notif.id}
              className={`p-4 transition-colors hover:bg-brand-surface-subtle flex items-start gap-3 ${
                notif.unread ? 'bg-[#FAFAF7]' : ''
              }`}
            >
              <div className="mt-0.5 p-1 rounded-md bg-brand-surface border border-brand-border">
                {getIcon(notif.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className={`text-xs font-semibold truncate ${notif.unread ? 'text-brand-text' : 'text-brand-text-secondary'}`}>
                    {notif.title}
                  </h4>
                  <span className="text-[10px] text-stone-400 whitespace-nowrap">
                    {notif.timestamp}
                  </span>
                </div>
                <p className="text-xs text-brand-text-secondary mt-1 leading-snug">
                  {notif.message}
                </p>

                <div className="flex items-center justify-between mt-2.5 pt-1">
                  {notif.targetScreen ? (
                    <button
                      onClick={() => {
                        markNotificationRead(notif.id);
                        onClose();
                        navigateTo(notif.targetScreen as ScreenType);
                      }}
                      className="text-xs text-brand-text font-medium hover:text-brand-sage-dark flex items-center gap-1 hover:underline"
                    >
                      {notif.actionText || 'View details'}
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  ) : <span />}

                  {notif.unread && (
                    <button
                      onClick={() => markNotificationRead(notif.id)}
                      className="text-[11px] text-stone-400 hover:text-brand-text flex items-center gap-1"
                      title="Mark as read"
                    >
                      <Check className="w-3 h-3" />
                      Read
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-2.5 bg-brand-surface-subtle text-center border-t border-brand-border">
        <span className="text-[11px] text-brand-text-secondary">
          Synced with Toast POS shift alert engine
        </span>
      </div>
    </div>
  );
};

