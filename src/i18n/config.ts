import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enCommon from './locales/en/common.json';
import enUI from './locales/en/ui.json';
import enBoard from './locales/en/board.json';
import enValidation from './locales/en/validation.json';
import enGames from './locales/en/games.json';
import enDashboard from './locales/en/dashboard.json';
import enSettings from './locales/en/settings.json';
import enChat from './locales/en/chat.json';
import esCommon from './locales/es/common.json';
import esUI from './locales/es/ui.json';
import esBoard from './locales/es/board.json';
import esValidation from './locales/es/validation.json';
import esGames from './locales/es/games.json';
import esDashboard from './locales/es/dashboard.json';
import esSettings from './locales/es/settings.json';
import esChat from './locales/es/chat.json';

const resources = {
  en: {
    common: enCommon,
    ui: enUI,
    board: enBoard,
    validation: enValidation,
    games: enGames,
    dashboard: enDashboard,
    settings: enSettings,
    chat: enChat,
  },
  es: {
    common: esCommon,
    ui: esUI,
    board: esBoard,
    validation: esValidation,
    games: esGames,
    dashboard: esDashboard,
    settings: esSettings,
    chat: esChat,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('language') || navigator.language.split('-')[0] || 'en',
    fallbackLng: 'en',
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
