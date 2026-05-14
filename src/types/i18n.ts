export type SupportedLanguage = 'zh-TW' | 'en-US' | 'ja-JP';

export interface LanguageOption {
  code: SupportedLanguage;
  label: string;
  flag: string;
}
