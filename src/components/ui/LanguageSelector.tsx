import { useLanguage } from '../../hooks/useLanguage';
import type { SupportedLanguage } from '../../types';

const languages: { code: SupportedLanguage; label: string }[] = [
  { code: 'zh-TW', label: '繁體中文' },
  { code: 'en-US', label: 'English' },
  { code: 'ja-JP', label: '日本語' },
];

export function LanguageSelector() {
  const { currentLanguage, changeLanguage } = useLanguage();
  
  return (
    <div className="flex gap-2">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => changeLanguage(lang.code)}
          className={`px-2 py-1 rounded text-sm transition-all ${
            currentLanguage === lang.code
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
