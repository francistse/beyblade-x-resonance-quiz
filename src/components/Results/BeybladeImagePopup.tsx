import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { BeybladeData } from '../../types';
import { ImageWithFallback } from '../ui/ImageWithFallback';
import { BeybladeStatRadar } from './BeybladeStatRadar';

const DB_BASE_URL = 'https://beyblade.phstudy.org';

function getDatabaseUrl(bladeId: string | null | undefined): string | null {
  if (!bladeId) return null;
  return `${DB_BASE_URL}/?part=${encodeURIComponent(bladeId)}&cat=Series`;
}

interface BeybladeImagePopupProps {
  beyblade: BeybladeData;
  children: React.ReactNode;
}

export function BeybladeImagePopup({ beyblade, children }: BeybladeImagePopupProps) {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const lang = i18n.language as string;
  const name = beyblade.name[lang] || beyblade.en_name;
  const description = beyblade.description[lang] || beyblade.description['en-US'] || '';
  const dbUrl = getDatabaseUrl(beyblade.blade_id);

  const openPopup = () => setIsOpen(true);
  const closePopup = () => setIsOpen(false);

  return (
    <>
      <div onClick={openPopup} className="cursor-pointer hover:opacity-80 transition-opacity">
        {children}
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={closePopup}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-auto animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <button
                onClick={closePopup}
                className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white/90 hover:bg-white rounded-full shadow-md transition-colors z-10"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="p-6">
                <div className="flex justify-center mb-6">
                  <ImageWithFallback
                    src={beyblade.image}
                    alt={name}
                    className="w-72 h-72 object-contain"
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <h2 className="text-2xl font-bold text-center text-gray-900">{name}</h2>
                    <p className="text-center text-gray-500 mt-1">{beyblade.en_name}</p>
                  </div>

                  <div className="flex justify-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      beyblade.type === 'attack' ? 'bg-red-100 text-red-600' :
                      beyblade.type === 'defense' ? 'bg-blue-100 text-blue-600' :
                      beyblade.type === 'stamina' ? 'bg-green-100 text-green-600' :
                      'bg-purple-100 text-purple-600'
                    }`}>
                      {beyblade.type.toUpperCase()}
                    </span>
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600">
                      {beyblade.rotation === 'left' ? t('result.popup.leftRotation') : t('result.popup.rightRotation')}
                    </span>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm font-semibold text-gray-700">{t('result.popup.productId')}</span>
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-sm font-mono">{beyblade.id}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="text-center p-2 bg-red-50 rounded-lg">
                        <div className="text-xs text-red-600 font-medium">{t('result.popup.attack')}</div>
                        <div className="text-lg font-bold text-red-700">{beyblade.stats.attack}</div>
                      </div>
                      <div className="text-center p-2 bg-blue-50 rounded-lg">
                        <div className="text-xs text-blue-600 font-medium">{t('result.popup.defense')}</div>
                        <div className="text-lg font-bold text-blue-700">{beyblade.stats.defense}</div>
                      </div>
                      <div className="text-center p-2 bg-green-50 rounded-lg">
                        <div className="text-xs text-green-600 font-medium">{t('result.popup.stamina')}</div>
                        <div className="text-lg font-bold text-green-700">{beyblade.stats.stamina}</div>
                      </div>
                    </div>

                    <BeybladeStatRadar stats={beyblade.stats} />

                    {description && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">{t('result.popup.description')}</h4>
                        <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{description}</p>
                      </div>
                    )}

                    {dbUrl && (
                      <a
                        href={dbUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        {t('result.viewInDatabase', 'View in Database')}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
