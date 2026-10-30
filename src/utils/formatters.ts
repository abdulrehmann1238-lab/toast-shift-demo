export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatHours = (hours: number): string => {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m.toString().padStart(2, '0')}m`;
};

export const formatTime = (timeStr: string | null): string => {
  if (!timeStr) return '—';
  return timeStr;
};

export const getStatusBadgeColor = (status: string): { bg: string; text: string; dot: string; border: string } => {
  switch (status.toLowerCase()) {
    case 'completed':
    case 'approved':
    case 'reviewed':
      return {
        bg: 'bg-brand-sage-soft',
        text: 'text-brand-sage-dark',
        dot: 'bg-brand-sage',
        border: 'border-brand-sage/20'
      };
    case 'pending':
    case 'pending_clockout':
    case 'on_break':
    case 'break':
      return {
        bg: 'bg-brand-amber-soft',
        text: 'text-amber-800',
        dot: 'bg-brand-amber',
        border: 'border-brand-amber/30'
      };
    case 'attention required':
    case 'flagged':
    case 'rejected':
    case 'missing_punch':
    case 'discrepancy':
      return {
        bg: 'bg-brand-terracotta-soft',
        text: 'text-brand-terracotta',
        dot: 'bg-brand-terracotta',
        border: 'border-brand-terracotta/30'
      };
    case 'active':
      return {
        bg: 'bg-brand-sage-soft',
        text: 'text-brand-sage-dark',
        dot: 'bg-brand-sage',
        border: 'border-brand-sage/30'
      };
    case 'scheduled':
    case 'off_duty':
    default:
      return {
        bg: 'bg-brand-surface-subtle',
        text: 'text-brand-text-secondary',
        dot: 'bg-stone-400',
        border: 'border-brand-border'
      };
  }
};

