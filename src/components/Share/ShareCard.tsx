import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import type { QuizResult } from '../../types';
import { ImageWithFallback } from '../ui/ImageWithFallback';

interface ShareCardProps {
  result: QuizResult;
}

export const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(
  ({ result }, ref) => {
    const { t, i18n } = useTranslation();
    const lang = i18n.language as string;
    const topMatch = result.topMatches[0];
    const name = topMatch.beyblade.name[lang] || topMatch.beyblade.en_name;

    return (
      <div
        ref={ref}
        data-share-card
        className="w-[400px] p-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl text-white"
      >
        <h2 className="text-xl font-bold text-center mb-4">
          {t('result.shareTitle', 'Beyblade X Resonance Quiz')}
        </h2>
        <div className="bg-white/10 rounded-lg p-4 mb-4">
          <ImageWithFallback
            src={topMatch.beyblade.image}
            alt={name}
            className="w-32 h-32 mx-auto object-contain mb-2"
            crossOrigin="anonymous"
          />
          <p className="text-center font-bold text-lg">{name}</p>
          <p className="text-center text-3xl font-bold mt-2">
            {topMatch.fitPercentage}%
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm opacity-80">{t('result.awakening', 'Awakening Keyword')}</p>
          <p className="text-xl font-bold">{result.awakeningKeyword}</p>
        </div>
        <p className="text-xs text-center mt-4 opacity-60">
          radar graph
        </p>
      </div>
    );
  }
);
