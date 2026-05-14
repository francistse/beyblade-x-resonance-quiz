import type { BeybladeType } from '../types';
import enUS from '../locales/en-US.json';
import zhTW from '../locales/zh-TW.json';
import jaJP from '../locales/ja-JP.json';

const localeMap: Record<string, typeof enUS> = {
  'en-US': enUS,
  'en': enUS,
  'zh-TW': zhTW,
  'zh': zhTW,
  'ja-JP': jaJP,
  'ja': jaJP,
};

export function getAwakeningKeyword(type: BeybladeType, language: string = 'zh-TW'): string {
  const locale = localeMap[language] || localeMap['zh-TW'];
  const keywords = locale.result.awakeningKeywords[type];
  const index = Math.floor(Math.random() * keywords.length);
  return keywords[index];
}
