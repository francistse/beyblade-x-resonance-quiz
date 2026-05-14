import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import zhTW from '../locales/zh-TW.json';
import enUS from '../locales/en-US.json';
import jaJP from '../locales/ja-JP.json';

const resources = {
  'zh-TW': { translation: zhTW },
  'en-US': { translation: enUS },
  'ja-JP': { translation: jaJP },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'zh-TW',
  fallbackLng: 'en-US',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
