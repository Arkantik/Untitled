import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowUp02Icon } from '@hugeicons/core-free-icons';
import { cn } from '~/lib/utils';
import { useCallback, useEffect, useState } from 'react';

type ScrollToTopProps = {
  threshold?: number;
  label?: string;
  className?: string;
};

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

export function ScrollToTop({
  threshold = 480,
  label = 'Back to top',
  className,
}: ScrollToTopProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => setVisible(window.scrollY > threshold);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, [threshold]);

  const scrollUp = useCallback(() => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  }, []);

  return (
    <button
      type="button"
      onClick={scrollUp}
      aria-label={label}
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      className={cn(
        'fixed right-4 bottom-4 z-40 inline-flex size-11 cursor-pointer items-center justify-center rounded-full sm:right-6 sm:bottom-6',
        'border-border bg-card text-muted-foreground border shadow-lg',
        'hover:text-foreground active:bg-muted transition duration-100 hover:shadow-xl active:shadow-lg',
        'focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
        'motion-reduce:transition-none',
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-2 opacity-0',
        className,
      )}
    >
      <HugeiconsIcon icon={ArrowUp02Icon} className="size-5 shrink-0" aria-hidden />
    </button>
  );
}
