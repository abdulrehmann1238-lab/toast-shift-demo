import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  trend?: {
    text: string;
    positive?: boolean;
    neutral?: boolean;
  };
  progress?: number;
  highlight?: boolean;
  onClick?: () => void;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  progress,
  highlight = false,
  onClick,
  className = ''
}) => {
  return (
    <div
      onClick={onClick}
      className={`group relative bg-brand-surface rounded-xl p-5 border border-brand-border shadow-subtle transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:-translate-y-0.5 hover:shadow-elevated hover:border-brand-border-strong' : ''
      } ${highlight ? 'ring-1 ring-brand-sage/30 bg-gradient-to-b from-brand-surface to-[#FAFAF7]' : ''} ${className}`}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-brand-text-secondary">
          {title}
        </span>
        <div className="w-8 h-8 rounded-lg bg-brand-surface-subtle text-brand-text flex items-center justify-center transition-colors group-hover:bg-brand-sage-soft group-hover:text-brand-sage-dark">
          {icon}
        </div>
      </div>

      <div className="flex items-baseline gap-2 mb-1.5">
        <span className="text-3xl font-heading font-bold text-brand-text tabular-nums tracking-tight">
          {value}
        </span>
        {trend && (
          <span
            className={`text-xs font-medium px-1.5 py-0.5 rounded ${
              trend.neutral
                ? 'bg-brand-surface-subtle text-brand-text-secondary'
                : trend.positive
                ? 'bg-brand-sage-soft text-brand-sage-dark'
                : 'bg-brand-terracotta-soft text-brand-terracotta'
            }`}
          >
            {trend.text}
          </span>
        )}
      </div>

      <p className="text-xs text-brand-text-secondary leading-relaxed">
        {subtitle}
      </p>

      {progress !== undefined && (
        <div className="mt-4 pt-3 border-t border-brand-border/60">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-brand-text-secondary">Progress</span>
            <span className="font-semibold text-brand-text tabular-nums">{progress}%</span>
          </div>
          <div className="h-1.5 w-full bg-brand-surface-subtle rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-sage rounded-full transition-all duration-500 ease-out"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

