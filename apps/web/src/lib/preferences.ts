const MAX_AGE = 60 * 60 * 24 * 365;

export function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function writeCookie(name: string, value: string): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=${encodeURIComponent(value)};path=/;max-age=${MAX_AGE};SameSite=Lax`;
}

export function readPreference(name: string): string | null {
  try {
    return readCookie(name) ?? (typeof window !== 'undefined' ? localStorage.getItem(name) : null);
  } catch {
    return null;
  }
}

export function writePreference(name: string, value: string): void {
  try { writeCookie(name, value); } catch {}
  try { if (typeof window !== 'undefined') localStorage.setItem(name, value); } catch {}
}
