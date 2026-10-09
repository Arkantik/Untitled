import { useState, useEffect } from 'react';
import { readPreference, writePreference, removePreference } from '~/lib/preferences';

type Theme = 'light' | 'dark';
export type ThemePref = 'light' | 'dark' | 'system';

const KEY = 'veypost-theme';
const SYNC_EVENT = 'veypost-theme-change';

function getSystemTheme(): Theme {
  return typeof window !== 'undefined' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

function storedTheme(): Theme {
  if (typeof document !== 'undefined') {
    const attr = document.documentElement.dataset.theme;
    if (attr === 'light' || attr === 'dark') return attr;
  }
  const stored = readPreference(KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  return getSystemTheme();
}

function storedPref(): ThemePref {
  const stored = readPreference(KEY);
  return stored === 'light' ? 'light' : stored === 'dark' ? 'dark' : 'system';
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(storedTheme);
  const [pref, setPrefState] = useState<ThemePref>(storedPref);

  useEffect(() => {
    function onSync() {
      setThemeState(storedTheme());
      setPrefState(storedPref());
    }
    window.addEventListener(SYNC_EVENT, onSync);
    return () => window.removeEventListener(SYNC_EVENT, onSync);
  }, []);

  function setTheme(next: Theme) {
    document.documentElement.setAttribute('data-theme', next);
    writePreference(KEY, next);
    setThemeState(next);
    setPrefState(next);
    window.dispatchEvent(new Event(SYNC_EVENT));
  }

  function clearTheme() {
    document.documentElement.removeAttribute('data-theme');
    removePreference(KEY);
    setThemeState(getSystemTheme());
    setPrefState('system');
    window.dispatchEvent(new Event(SYNC_EVENT));
  }

  function toggle() {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }

  return { theme, pref, toggle, setTheme, clearTheme };
}

export const themeScript = `(function(){try{var m=document.cookie.match(/(?:^|;\\s*)veypost-theme=([^;]*)/);var t=m?decodeURIComponent(m[1]):null;if(!t)try{t=localStorage.getItem('veypost-theme')}catch(e){}if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t)}catch(e){}})();`;
