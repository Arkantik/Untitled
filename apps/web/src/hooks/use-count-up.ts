import { useState, useEffect, useRef } from 'react';

// Module-level: persists across component unmount/remount (navigation).
// Timestamp lets us distinguish a StrictMode double-invoke (< 100ms gap)
// from a real re-mount after navigation (seconds later).
const playedAt = new Map<string, number>();

function isFirstPlay(key: string): boolean {
  const t = playedAt.get(key);
  return t === undefined || Date.now() - t < 100;
}

export function useCountUp(target: number, key: string, duration = 700): number {
  const frameRef = useRef(0);
  const [value, setValue] = useState(0);

  useEffect(() => {
    cancelAnimationFrame(frameRef.current);

    if (!isFirstPlay(key)) {
      setValue(target);
      return;
    }

    playedAt.set(key, Date.now());
    const start = performance.now();
    function tick(now: number) {
      const t = Math.min((now - start) / duration, 1);
      setValue(Math.round(target * (1 - (1 - t) ** 3)));
      if (t < 1) frameRef.current = requestAnimationFrame(tick);
    }
    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [target, key]); // duration excluded intentionally

  return value;
}
