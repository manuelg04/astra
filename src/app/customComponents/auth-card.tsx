import { cn } from '@/lib/utils';

export function AuthCard({
  children,
  className,
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={cn(
        'w-full max-w-md space-y-6 rounded-3xl bg-[var(--astra-card)] p-10 shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur',
        className,
      )}
    >
      {children}
    </div>
  );
}