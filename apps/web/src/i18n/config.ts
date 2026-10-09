import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { readPreference } from '~/lib/preferences';
import { defaultNS, resources, supportedLanguages, type SupportedLanguage } from './resources';

function detectLng(): SupportedLanguage {
  const stored = readPreference('veypost-lang');
  if (stored && (supportedLanguages as readonly string[]).includes(stored)) {
    return stored as SupportedLanguage;
  }
  return 'en';
}

export function initI18n() {
  if (i18n.isInitialized) return i18n;

  i18n.use(initReactI18next).init({
    resources,
    defaultNS,
    lng: detectLng(),
    fallbackLng: 'en',
    supportedLngs: supportedLanguages,
    interpolation: { escapeValue: false },
  });

  return i18n;
}

const localeCheck = supportedLanguages.map((l) => `l==='${l}'`).join('||');
export const localeScript = `(function(){try{var m=document.cookie.match(/(?:^|;\\s*)veypost-lang=([^;]*)/);var l=m?decodeURIComponent(m[1]):null;if(!l)try{l=localStorage.getItem('veypost-lang')}catch(e){}if(${localeCheck})document.documentElement.lang=l}catch(e){}})();`;

export { i18n };
