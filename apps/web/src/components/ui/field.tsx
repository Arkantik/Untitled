import { cn } from '~/lib/utils';
import { type ReactNode, useId } from 'react';
import { Label } from './label';

type FieldRenderProps = {
  id: string;
  'aria-describedby': string | undefined;
  invalid: boolean;
};

type FieldProps = {
  label: string;
  hint?: ReactNode;
  error?: string | null;
  className?: string;
  children: (props: FieldRenderProps) => ReactNode;
};

export function Field({ label, hint, error, className, children }: FieldProps) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ');

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <Label htmlFor={id}>{label}</Label>
      {children({
        id,
        'aria-describedby': describedBy || undefined,
        invalid: Boolean(error),
      })}
      {hint && !error ? (
        <p id={hintId} className="text-muted-foreground text-xs">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="text-destructive text-xs">
          {error}
        </p>
      ) : null}
    </div>
  );
}
