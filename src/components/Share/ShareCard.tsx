import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import type { QuizResult } from '../../types';
import { ImageWithFallback } from '../ui/ImageWithFallback';
import { RadarChart } from '../Results/RadarChart';

interface ShareCardProps {
  result: QuizResult;
}

/** Inline hex/rgba only (no Tailwind color tokens) so html2canvas avoids oklch/color-mix. */
export const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(({ result }, ref) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as string;
  const topMatch = result.topMatches[0];
  const name = topMatch.beyblade.name[lang] || topMatch.beyblade.en_name;

  return (
    <div
      ref={ref}
      data-share-card
      className="w-full max-w-[420px] mx-auto rounded-2xl p-6"
      style={{
        background: 'linear-gradient(145deg, #2563eb 0%, #4f46e5 45%, #6d28d9 100%)',
        color: '#ffffff',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.45)',
      }}
    >
      <h2
        className="text-center text-xl font-bold mb-5"
        style={{ textShadow: '0 1px 3px rgba(0,0,0,0.35)' }}
      >
        {t('result.shareTitle')}
      </h2>

      <div
        className="rounded-xl p-4 mb-5"
        style={{
          background: 'rgba(255,255,255,0.12)',
          border: '1px solid rgba(255,255,255,0.25)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12)',
        }}
      >
        <div
          className="mx-auto mb-3 flex items-center justify-center"
          style={{
            width: 168,
            height: 168,
            background: '#ffffff',
            borderRadius: 12,
            padding: 8,
          }}
        >
          <ImageWithFallback
            src={topMatch.beyblade.image}
            alt={name}
            className="max-h-full max-w-full object-contain"
            crossOrigin="anonymous"
          />
        </div>
        <p className="text-center font-bold text-lg" style={{ color: '#ffffff' }}>
          {name}
        </p>
        <p className="text-center font-bold mt-2 text-4xl tracking-tight" style={{ color: '#ffffff' }}>
          {topMatch.fitPercentage}%
        </p>
      </div>

      <div className="text-center mb-5">
        <p className="text-sm mb-1" style={{ color: 'rgba(255,255,255,0.88)' }}>
          {t('result.awakening')}
        </p>
        <p className="text-2xl font-bold" style={{ color: '#ffffff' }}>
          {result.awakeningKeyword}
        </p>
      </div>

      <div>
        <p
          className="text-center text-xs font-semibold uppercase tracking-wider mb-2"
          style={{ color: 'rgba(255,255,255,0.8)' }}
        >
          {t('result.statsComparison')}
        </p>
        <div className="h-[200px] w-full" style={{ minHeight: 200 }}>
          <RadarChart
            userStats={result.userVector}
            beybladeStats={topMatch.beyblade.stats}
            variant="onDark"
          />
        </div>
      </div>
    </div>
  );
});

ShareCard.displayName = 'ShareCard';
