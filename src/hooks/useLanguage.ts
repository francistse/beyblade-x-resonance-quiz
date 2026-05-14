import { useTranslation } from 'react-i18next';
import type { SupportedLanguage } from '../types';

export function useLanguage() {
  const { i18n, t } = useTranslation();
  
  const changeLanguage = (lang: SupportedLanguage) => {
    i18n.changeLanguage(lang);
  };
  
  const detectBrowserLanguage = (): SupportedLanguage => {
    const browserLang = navigator.language;
    if (browserLang.startsWith('zh')) return 'zh-TW';
    if (browserLang.startsWith('ja')) return 'ja-JP';
    return 'en-US';
  };
  
  const currentLanguage = i18n.language as SupportedLanguage;
  
  return {
    t,
    currentLanguage,
    changeLanguage,
    detectBrowserLanguage,
  };
}
