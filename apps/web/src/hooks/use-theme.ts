import { useState } from 'react';
import { readPreference, writePreference } from '~/lib/preferences';

type Theme = 'light' | 'dark';

const KEY = 'pulsarr-theme';

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

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(storedTheme);

  function setTheme(next: Theme) {
    document.documentElement.setAttribute('data-theme', next);
    writePreference(KEY, next);
    setThemeState(next);
  }

  function toggle() {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }

  return { theme, toggle };
}

export const themeScript = `(function(){try{var m=document.cookie.match(/(?:^|;\\s*)pulsarr-theme=([^;]*)/);var t=m?decodeURIComponent(m[1]):null;if(!t)try{t=localStorage.getItem('pulsarr-theme')}catch(e){}if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t)}catch(e){}})();`;
