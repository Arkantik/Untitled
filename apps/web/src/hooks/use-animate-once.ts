import { useRef, useEffect } from 'react';

// Set only in committed effects, never in the render body, so Concurrent
// Mode's discarded renders don't poison the map with early timestamps.
const committedAt = new Map<string, number>();

function isRevisit(key: string): boolean {
  const t = committedAt.get(key);
  return t !== undefined && Date.now() - t > 100;
}

export function useAnimateOnce(key: string): boolean {
  const shouldRef = useRef<boolean | null>(null);

  if (shouldRef.current === null) {
    shouldRef.current = !isRevisit(key);
  }

  useEffect(() => {
    if (!shouldRef.current) return;
    committedAt.set(key, Date.now());
    const frame = requestAnimationFrame(() => {
      shouldRef.current = false;
    });
    return () => cancelAnimationFrame(frame);
  }, [key]);

  return shouldRef.current;
}
