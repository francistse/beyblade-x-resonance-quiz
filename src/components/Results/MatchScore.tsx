import { useTranslation } from 'react-i18next';

interface MatchScoreProps {
  percentage: number;
}

export function MatchScore({ percentage }: MatchScoreProps) {
  const { t } = useTranslation();
  
  const getScoreColor = () => {
    if (percentage >= 80) return 'text-green-500';
    if (percentage >= 60) return 'text-blue-500';
    if (percentage >= 40) return 'text-yellow-500';
    return 'text-red-500';
  };
  
  return (
    <div className="flex flex-col items-center">
      <span className={`text-5xl font-bold ${getScoreColor()}`}>
        {percentage}%
      </span>
      <span className="text-gray-600 mt-2">{t('result.match')}</span>
    </div>
  );
}
