import React from 'react';

interface EmployeeAvatarProps {
  name: string;
  avatar?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  status?: 'active' | 'break' | 'off_duty' | 'scheduled';
  className?: string;
}

export const EmployeeAvatar: React.FC<EmployeeAvatarProps> = ({
  name,
  avatar,
  size = 'md',
  status,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-xl'
  };

  const statusIndicatorClasses = {
    active: 'bg-emerald-600 ring-white',
    break: 'bg-brand-amber ring-white',
    off_duty: 'bg-stone-400 ring-white',
    scheduled: 'bg-sky-500 ring-white'
  };

  const initials = name
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className={`relative inline-flex flex-shrink-0 items-center justify-center font-medium ${className}`}>
      {avatar ? (
        <img
          src={avatar}
          alt={name}
          className={`${sizeClasses[size]} rounded-full object-cover ring-1 ring-brand-border`}
          onError={(e) => {
            // fallback to initials if image fails
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
      ) : (
        <div
          className={`${sizeClasses[size]} rounded-full bg-brand-surface-subtle text-brand-text flex items-center justify-center border border-brand-border`}
        >
          {initials}
        </div>
      )}

      {status && (
        <span
          className={`absolute bottom-0 right-0 block rounded-full ring-2 ${
            size === 'sm' ? 'w-2 h-2' : size === 'lg' || size === 'xl' ? 'w-3.5 h-3.5' : 'w-2.5 h-2.5'
          } ${statusIndicatorClasses[status]}`}
          title={`Status: ${status}`}
        />
      )}
    </div>
  );
};

