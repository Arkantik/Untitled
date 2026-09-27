import commonEn from '../locales/en/common.json';
import homeEn from '../locales/en/home.json';
import authEn from '../locales/en/auth.json';
import commonFr from '../locales/fr/common.json';
import homeFr from '../locales/fr/home.json';
import authFr from '../locales/fr/auth.json';
import commonDe from '../locales/de/common.json';
import homeDe from '../locales/de/home.json';
import authDe from '../locales/de/auth.json';
import commonEs from '../locales/es/common.json';
import homeEs from '../locales/es/home.json';
import authEs from '../locales/es/auth.json';
import commonIt from '../locales/it/common.json';
import homeIt from '../locales/it/home.json';
import authIt from '../locales/it/auth.json';

export const defaultNS = 'common' as const;

export const resources = {
  en: {
    common: commonEn,
    home: homeEn,
    auth: authEn,
  },
  fr: {
    common: commonFr,
    home: homeFr,
    auth: authFr,
  },
  de: {
    common: commonDe,
    home: homeDe,
    auth: authDe,
  },
  es: {
    common: commonEs,
    home: homeEs,
    auth: authEs,
  },
  it: {
    common: commonIt,
    home: homeIt,
    auth: authIt,
  },
} as const;

export type SupportedLanguage = keyof typeof resources;

export const supportedLanguages: SupportedLanguage[] = ['en', 'fr', 'de', 'es', 'it'];

export const languageNames: Record<SupportedLanguage, string> = {
  en: 'English',
  fr: 'Français',
  de: 'Deutsch',
  es: 'Español',
  it: 'Italiano',
};
