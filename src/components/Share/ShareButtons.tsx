import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface ShareButtonsProps {
  onDownload: () => void;
  shareUrl: string;
  isDownloading?: boolean;
}

export function ShareButtons({ onDownload, shareUrl, isDownloading = false }: ShareButtonsProps) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: t('result.shareTitle', 'Beyblade X Resonance Quiz'),
          text: t('result.shareText', 'I found the Beyblade that resonates with my soul!'),
          url: shareUrl,
        });
      } catch (err) {
        console.error('Failed to share:', err);
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 justify-center">
      <button
        onClick={onDownload}
        disabled={isDownloading}
        className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold text-sm shadow-lg hover:from-yellow-300 hover:to-orange-400 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {isDownloading ? `⏳ ${t('common.generating', 'Generating...')}` : `📥 ${t('common.download')}`}
      </button>
      <button
        onClick={handleCopy}
        className="px-5 py-2.5 rounded-lg bg-white/20 border border-white/40 text-white font-bold text-sm shadow-lg hover:bg-white/30 transition-all hover:scale-105 active:scale-95"
      >
        {copied ? `✅ ${t('common.copied', 'Copied')}` : `📋 ${t('common.copy')}`}
      </button>
      <button
        onClick={handleShare}
        className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-sm shadow-lg hover:from-blue-400 hover:to-purple-500 transition-all hover:scale-105 active:scale-95"
      >
        📤 {t('common.share', 'Share')}
      </button>
    </div>
  );
}
