import { cn } from '~/lib/utils';
import { HugeiconsIcon } from '@hugeicons/react';
import { ViewIcon, ViewOffIcon } from '@hugeicons/core-free-icons';
import { type InputHTMLAttributes, type Ref, useState } from 'react';

type PasswordInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  invalid?: boolean;
  ref?: Ref<HTMLInputElement>;
};

export function PasswordInput({ className, invalid = false, ref, ...props }: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        ref={ref}
        type={visible ? 'text' : 'password'}
        aria-invalid={invalid || undefined}
        className={cn(
          'bg-card text-card-foreground flex h-10 w-full rounded-md border px-3 py-2 pr-10 text-sm transition-colors',
          'placeholder:text-muted-foreground',
          'focus-visible:ring-ring focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
          'disabled:cursor-not-allowed disabled:opacity-50',
          invalid ? 'border-destructive focus-visible:ring-destructive' : 'border-input',
          className,
        )}
        {...props}
      />
      <button
        type="button"
        tabIndex={-1}
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? 'Hide password' : 'Show password'}
        aria-pressed={visible}
        className="text-muted-foreground hover:text-card-foreground active:text-foreground absolute inset-y-0 right-0 flex w-10 cursor-pointer items-center justify-center focus-visible:outline-none"
      >
        {visible ? (
          <HugeiconsIcon icon={ViewOffIcon} className="size-4" aria-hidden />
        ) : (
          <HugeiconsIcon icon={ViewIcon} className="size-4" aria-hidden />
        )}
      </button>
    </div>
  );
}
