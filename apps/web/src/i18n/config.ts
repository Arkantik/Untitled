import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { defaultNS, resources, supportedLanguages } from './resources';

export function initI18n() {
  if (i18n.isInitialized) return i18n;

  i18n.use(initReactI18next).init({
    resources,
    defaultNS,
    lng: 'en',
    fallbackLng: 'en',
    supportedLngs: supportedLanguages,
    interpolation: { escapeValue: false },
  });

  // Apply stored language preference after hydration, not during SSR
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('pulsarr-lang');
      if (stored && supportedLanguages.includes(stored as never)) {
        i18n.changeLanguage(stored);
      }
    } catch {
      // localStorage unavailable
    }
  }

  return i18n;
}

export { i18n };
