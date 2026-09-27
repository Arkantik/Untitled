import { cn } from '~/lib/utils';
import type { InputHTMLAttributes } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean };

export function Input({ className, invalid = false, ...props }: InputProps) {
  return (
    <input
      aria-invalid={invalid || undefined}
      className={cn(
        'bg-card text-card-foreground flex h-10 w-full rounded-md border px-3 py-2 text-sm transition-colors',
        'placeholder:text-muted-foreground',
        'focus-visible:ring-ring focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
        'disabled:cursor-not-allowed disabled:opacity-50',
        invalid ? 'border-destructive focus-visible:ring-destructive' : 'border-input',
        className,
      )}
      {...props}
    />
  );
}
