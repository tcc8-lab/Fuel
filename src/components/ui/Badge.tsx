import { cn } from '@/lib/utils';

interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = 'default', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md',
        {
          'bg-white/5 text-zinc-400': variant === 'default',
          'bg-fuel-500/10 text-fuel-400': variant === 'success',
          'bg-amber-500/10 text-amber-400': variant === 'warning',
          'bg-red-500/10 text-red-400': variant === 'error',
          'bg-cyan-500/10 text-cyan-400': variant === 'info',
        },
        className
      )}
    >
      {children}
    </span>
  );
}

export function StatusDot({ status }: { status: 'online' | 'degraded' | 'offline' | 'active' | 'idle' | 'suspended' }) {
  return (
    <span
      className={cn('h-2 w-2 rounded-full', {
        'bg-fuel-500 animate-pulse': status === 'online' || status === 'active',
        'bg-amber-500 animate-pulse': status === 'degraded',
        'bg-red-500': status === 'offline' || status === 'suspended',
        'bg-zinc-500': status === 'idle',
      })}
    />
  );
}
