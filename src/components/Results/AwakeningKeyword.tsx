import { useTranslation } from 'react-i18next';

interface AwakeningKeywordProps {
  keyword: string;
}

export function AwakeningKeyword({ keyword }: AwakeningKeywordProps) {
  const { t } = useTranslation();
  
  return (
    <div className="text-center p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white">
      <p className="text-sm mb-1">{t('result.awakening')}</p>
      <p className="text-2xl font-bold">{keyword}</p>
    </div>
  );
}
