import commonEn from '../locales/en/common.json';
import homeEn from '../locales/en/home.json';
import commonFr from '../locales/fr/common.json';
import homeFr from '../locales/fr/home.json';
import commonDe from '../locales/de/common.json';
import homeDe from '../locales/de/home.json';
import commonEs from '../locales/es/common.json';
import homeEs from '../locales/es/home.json';
import commonIt from '../locales/it/common.json';
import homeIt from '../locales/it/home.json';

export const defaultNS = 'common' as const;

export const resources = {
  en: {
    common: commonEn,
    home: homeEn,
  },
  fr: {
    common: commonFr,
    home: homeFr,
  },
  de: {
    common: commonDe,
    home: homeDe,
  },
  es: {
    common: commonEs,
    home: homeEs,
  },
  it: {
    common: commonIt,
    home: homeIt,
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
