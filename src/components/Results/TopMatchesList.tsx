import { useTranslation } from 'react-i18next';
import type { BeybladeMatch } from '../../types';
import { ImageWithFallback } from '../ui/ImageWithFallback';
import { BeybladeImagePopup } from './BeybladeImagePopup';

const DB_BASE_URL = 'https://beyblade.phstudy.org';

function getDatabaseUrl(bladeId: string | null | undefined): string | null {
  if (!bladeId) return null;
  return `${DB_BASE_URL}/?part=${encodeURIComponent(bladeId)}&cat=Series`;
}

interface TopMatchesListProps {
  matches: BeybladeMatch[];
}

export function TopMatchesList({ matches }: TopMatchesListProps) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as string;
  
  return (
    <div className="w-full max-w-md mx-auto">
      <h3 className="text-lg font-bold mb-4">{t('result.topMatches')}</h3>
      <div className="space-y-3">
        {matches.map((match, index) => {
          const name = match.beyblade.name[lang] || match.beyblade.en_name;
          const dbUrl = getDatabaseUrl(match.beyblade.blade_id);
          return (
            <BeybladeImagePopup key={match.beyblade.id} beyblade={match.beyblade}>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                <span className="text-lg font-bold text-gray-400 w-8">#{index + 1}</span>
                <ImageWithFallback
                  src={match.beyblade.image}
                  alt={name}
                  className="w-20 h-20 object-contain"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{name}</p>
                  <p className="text-sm text-gray-500">{match.beyblade.type}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-blue-500">{match.fitPercentage}%</span>
                  {dbUrl && (
                    <a
                      href={dbUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-1.5 text-gray-400 hover:text-blue-500 transition-colors"
                      title={t('result.viewInDatabase', 'View in Database')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </BeybladeImagePopup>
          );
        })}
      </div>
    </div>
  );
}
