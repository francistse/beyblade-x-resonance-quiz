import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { QuizResult } from '../types';
import { BeybladeCard } from '../components/Results/BeybladeCard';
import { RadarChart } from '../components/Results/RadarChart';
import { AwakeningKeyword } from '../components/Results/AwakeningKeyword';
import { TopMatchesList } from '../components/Results/TopMatchesList';
import { ShareCard } from '../components/Share/ShareCard';
import { ShareButtons } from '../components/Share/ShareButtons';
import { generateShareImage, downloadImage } from '../utils/generateShareImage';

interface ResultPageProps {
  result: QuizResult;
  onRetry: () => void;
}

const RESULT_SOUND_PATH = '/sounds/787800__sadiquecat__beyblade-under-arena-result.wav';

export function ResultPage({ result, onRetry }: ResultPageProps) {
  const { t } = useTranslation();
  const shareCardRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
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
  
  const handleDownload = async () => {
    if (!shareCardRef.current || isDownloading) return;
    
    setIsDownloading(true);
    try {
      const blob = await generateShareImage(shareCardRef.current);
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
  
  const shareUrl = window.location.href;
  
  return (
    <div className="min-h-screen bg-gray-50 pb-28 pt-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-800 drop-shadow-sm">
          {t('result.title')}
        </h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <BeybladeCard
              beyblade={result.topMatches[0].beyblade}
              fitPercentage={result.topMatches[0].fitPercentage}
            />
            <div className="mt-6">
              <AwakeningKeyword keyword={result.awakeningKeyword} />
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">{t('result.statsComparison')}</h3>
            <RadarChart
              userStats={result.userVector}
              beybladeStats={result.topMatches[0].beyblade.stats}
            />
          </div>
        </div>
        
        <div className="mt-8">
          <TopMatchesList matches={result.topMatches} />
        </div>
        
        <div className="mt-8 flex justify-center">
          <ShareCard ref={shareCardRef} result={result} />
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-black/90 via-black/80 to-transparent pt-8 pb-4 px-4">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3">
          <ShareButtons onDownload={handleDownload} shareUrl={shareUrl} isDownloading={isDownloading} />
          <button
            onClick={onRetry}
            className="px-5 py-2.5 rounded-lg bg-white/10 border border-white/30 text-white font-bold text-sm hover:bg-white/20 transition-all hover:scale-105 active:scale-95"
          >
            🔄 {t('common.retry')}
          </button>
        </div>
        
        {downloadStatus === 'success' && (
          <div className="mt-4 text-center">
            <span className="px-4 py-2 rounded-lg bg-green-500/90 text-white font-bold text-sm shadow-lg animate-bounce">
              ✅ {t('result.downloadSuccess')}
            </span>
          </div>
        )}
        {downloadStatus === 'error' && (
          <div className="mt-4 text-center">
            <span className="px-4 py-2 rounded-lg bg-red-500/90 text-white font-bold text-sm shadow-lg">
              ❌ {t('result.downloadError')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
