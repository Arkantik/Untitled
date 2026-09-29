import { HugeiconsIcon } from '@hugeicons/react';
import {
  AlertCircleIcon,
  CheckmarkCircle01Icon,
  Alert02Icon,
  InformationCircleIcon,
} from '@hugeicons/core-free-icons';
import { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '~/lib/utils';

type ToastTone = 'success' | 'error' | 'warning' | 'info';
type ToastItem = { id: number; tone: ToastTone; message: string; leaving?: boolean };

const TONE = {
  success: {
    box: 'border-success/40 bg-[color-mix(in_oklab,var(--success)_10%,var(--card))] text-success',
    Icon: CheckmarkCircle01Icon,
    label: 'Success',
  },
  error: {
    box: 'border-destructive/40 bg-[color-mix(in_oklab,var(--destructive)_10%,var(--card))] text-destructive',
    Icon: AlertCircleIcon,
    label: 'Error',
  },
  warning: {
    box: 'border-warning/40 bg-[color-mix(in_oklab,var(--warning)_10%,var(--card))] text-warning',
    Icon: Alert02Icon,
    label: 'Warning',
  },
  info: {
    box: 'border-primary/40 bg-[color-mix(in_oklab,var(--primary)_10%,var(--card))] text-primary',
    Icon: InformationCircleIcon,
    label: 'Info',
  },
} as const;

let _dispatch: ((item: Omit<ToastItem, 'id'>) => void) | null = null;

function setDispatch(fn: ((item: Omit<ToastItem, 'id'>) => void) | null) {
  _dispatch = fn;
}

export const toast = {
  error: (message: string) => _dispatch?.({ tone: 'error', message }),
  success: (message: string) => _dispatch?.({ tone: 'success', message }),
  warning: (message: string) => _dispatch?.({ tone: 'warning', message }),
  info: (message: string) => _dispatch?.({ tone: 'info', message }),
};

export function Toaster() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(0);

  const dispatch = useCallback((item: Omit<ToastItem, 'id'>) => {
    const id = nextId.current++;
    setToasts((prev) => [...prev, { ...item, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, leaving: true } : t)));
      setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 200);
    }, 4300);
  }, []);

  useEffect(() => {
    setDispatch(dispatch);
    return () => setDispatch(null);
  }, [dispatch]);

  if (toasts.length === 0) return null;

  return (
    <div
      role="region"
      aria-label="Notifications"
      aria-live="polite"
      className="pointer-events-none fixed right-4 bottom-4 z-50 flex w-80 max-w-[calc(100vw-2rem)] flex-col gap-2"
    >
      {toasts.map((item) => {
        const { box, Icon, label } = TONE[item.tone];
        return (
          <div
            key={item.id}
            role="status"
            className={cn(
              'pointer-events-auto flex items-start gap-2.5 rounded-md border p-3 text-sm shadow-lg',
              item.leaving ? 'animate-toast-out' : 'animate-toast-in',
              box,
            )}
          >
            <HugeiconsIcon icon={Icon} className="mt-0.5 size-4 shrink-0" aria-hidden />
            <div className="min-w-0 flex-1">
              <p className="font-medium leading-none">{label}</p>
              <p className="mt-1 text-xs text-foreground/80">{item.message}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
