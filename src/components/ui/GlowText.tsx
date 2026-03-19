import { cn } from '@/lib/utils';

interface GlowTextProps {
  children: React.ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'span' | 'p';
}

export function GlowText({ children, className, as: Tag = 'span' }: GlowTextProps) {
  return (
    <Tag className={cn('text-fuel-400 text-glow', className)}>
      {children}
    </Tag>
  );
}

export function GradientText({ children, className, as: Tag = 'span' }: GlowTextProps) {
  return (
    <Tag
      className={cn(
        'bg-gradient-to-r from-fuel-400 via-fuel-300 to-accent-cyan bg-clip-text text-transparent',
        className
      )}
    >
      {children}
    </Tag>
  );
}

export function SectionLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-fuel-500/5 border border-fuel-500/10 mb-6', className)}>
      <span className="h-1.5 w-1.5 rounded-full bg-fuel-500" />
      <span className="text-xs font-medium text-fuel-400 uppercase tracking-wider">{children}</span>
    </div>
  );
}
