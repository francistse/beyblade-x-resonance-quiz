import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { QuizResult } from '../types';
import { TopMatchesList } from '../components/Results/TopMatchesList';
import { ShareCard } from '../components/Share/ShareCard';
import { ShareButtons } from '../components/Share/ShareButtons';
import { generateShareImage, downloadImage } from '../utils/generateShareImage';
import { publicUrl } from '../utils/publicUrl';

const DB_BASE_URL = 'https://beyblade.phstudy.org';

function getDatabaseUrl(bladeId: string | null | undefined): string | null {
  if (!bladeId) return null;
  return `${DB_BASE_URL}/?part=${encodeURIComponent(bladeId)}&cat=Series`;
}

interface ResultPageProps {
  result: QuizResult;
  onRetry: () => void;
}

const RESULT_SOUND_PATH = publicUrl('/sounds/787800__sadiquecat__beyblade-under-arena-result.wav');

export function ResultPage({ result, onRetry }: ResultPageProps) {
  const { t } = useTranslation();
  const shareCardRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const topBlade = result.topMatches[0].beyblade;
  const dbUrl = getDatabaseUrl(topBlade.blade_id);
  const otherMatches = result.topMatches.slice(1);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(RESULT_SOUND_PATH);
    }
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {});
  }, []);

  useEffect(() => {
    if (downloadStatus !== 'idle') {
      const timer = setTimeout(() => {
        setDownloadStatus('idle');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [downloadStatus]);

  const getShareImageBlob = async () => {
    if (!shareCardRef.current) return null;
    return generateShareImage(shareCardRef.current);
  };

  const handleDownload = async () => {
    if (!shareCardRef.current || isDownloading) return;

    setIsDownloading(true);
    try {
      const blob = await getShareImageBlob();
      if (blob) {
        downloadImage(blob);
        setDownloadStatus('success');
      } else {
        setDownloadStatus('error');
        console.warn('Failed to generate share image');
      }
    } catch (error) {
      setDownloadStatus('error');
      console.error('Download error:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <div className="min-h-screen bg-gray-50 pb-24 pt-6 px-4">
      <div className="max-w-lg mx-auto">
        <ShareCard ref={shareCardRef} result={result} />

        {dbUrl && (
          <a
            href={dbUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 block text-center text-sm font-medium text-blue-600 hover:text-blue-800 underline-offset-2 hover:underline"
          >
            {t('result.viewInDatabase')}
          </a>
        )}

        {otherMatches.length > 0 && (
          <div className="mt-10">
            <TopMatchesList matches={otherMatches} titleKey="result.otherMatches" rankOffset={1} />
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-black/90 via-black/75 to-transparent pt-4 pb-[max(0.5rem,env(safe-area-inset-bottom))] px-3">
        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center gap-2">
          <ShareButtons
            onDownload={handleDownload}
            shareUrl={shareUrl}
            isDownloading={isDownloading}
            getShareImageBlob={getShareImageBlob}
          />
          <button
            type="button"
            onClick={onRetry}
            className="px-4 py-2 rounded-lg bg-white/10 border border-white/30 text-white font-bold text-xs sm:text-sm hover:bg-white/20 transition-all active:scale-[0.98]"
          >
            🔄 {t('common.retry')}
          </button>
        </div>

        {downloadStatus === 'success' && (
          <div className="mt-2 text-center">
            <span className="inline-block px-3 py-1 rounded-md bg-green-500/90 text-white font-semibold text-xs shadow-md animate-bounce">
              ✅ {t('result.downloadSuccess')}
            </span>
          </div>
        )}
        {downloadStatus === 'error' && (
          <div className="mt-2 text-center">
            <span className="inline-block px-3 py-1 rounded-md bg-red-500/90 text-white font-semibold text-xs shadow-md">
              ❌ {t('result.downloadError')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
