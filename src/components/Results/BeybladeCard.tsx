import { useTranslation } from 'react-i18next';
import type { BeybladeData } from '../../types';
import { ImageWithFallback } from '../ui/ImageWithFallback';
import { BeybladeImagePopup } from './BeybladeImagePopup';

const DB_BASE_URL = 'https://beyblade.phstudy.org';

function getDatabaseUrl(bladeId: string | null | undefined): string | null {
  if (!bladeId) return null;
  return `${DB_BASE_URL}/?part=${encodeURIComponent(bladeId)}&cat=Series`;
}

interface BeybladeCardProps {
  beyblade: BeybladeData;
  fitPercentage: number;
}

export function BeybladeCard({ beyblade, fitPercentage }: BeybladeCardProps) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as string;
  const name = beyblade.name[lang] || beyblade.en_name;
  const dbUrl = getDatabaseUrl(beyblade.blade_id);
  
  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-lg">
      <BeybladeImagePopup beyblade={beyblade}>
        <ImageWithFallback
          src={beyblade.image}
          alt={name}
          className="w-64 h-64 object-contain mb-4 cursor-pointer hover:scale-105 transition-transform"
        />
      </BeybladeImagePopup>
      <h2 className="text-2xl font-bold text-center mb-2">{name}</h2>
      <p className="text-sm text-gray-500 mb-2">{beyblade.en_name}</p>
      <div className="flex items-center gap-2">
        <span className="text-3xl font-bold text-blue-500">{fitPercentage}%</span>
        <span className="text-gray-600">{t('result.match')}</span>
      </div>
      <div className="mt-4 flex gap-2">
        <span className={`px-3 py-1 rounded-full text-sm ${
          beyblade.type === 'attack' ? 'bg-red-100 text-red-600' :
          beyblade.type === 'defense' ? 'bg-blue-100 text-blue-600' :
          beyblade.type === 'stamina' ? 'bg-green-100 text-green-600' :
          'bg-purple-100 text-purple-600'
        }`}>
          {beyblade.type.toUpperCase()}
        </span>
        <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-600">
          {beyblade.rotation === 'left' ? t('result.rotation.left') : t('result.rotation.right')}
        </span>
      </div>
      {dbUrl && (
        <a
          href={dbUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          {t('result.viewInDatabase', 'View in Database')}
        </a>
      )}
    </div>
  );
}
