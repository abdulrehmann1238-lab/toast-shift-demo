import React from 'react';
import { getStatusBadgeColor } from '../../utils/formatters';

interface StatusBadgeProps {
  status: string;
  label?: string;
  size?: 'sm' | 'md';
  showDot?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  size = 'md',
  showDot = true,
  className = ''
}) => {
  const colors = getStatusBadgeColor(status);
  const displayLabel = label || status.replace('_', ' ');

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border capitalize tracking-tight transition-colors ${colors.bg} ${colors.text} ${colors.border} ${sizeClasses} ${className}`}
    >
      {showDot && (
        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${colors.dot}`} />
      )}
      <span>{displayLabel}</span>
    </span>
  );
};

