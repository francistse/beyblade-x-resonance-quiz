import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { downloadImage } from '../../utils/generateShareImage';
import { tryCopyImageAndCaptionToClipboard, tryShareImageWithNativeSheet } from '../../utils/shareResultImage';

interface ShareButtonsProps {
  onDownload: () => void;
  shareUrl: string;
  isDownloading?: boolean;
  /** Same PNG as download — used for native share / fallback. */
  getShareImageBlob: () => Promise<Blob | null>;
}

export function ShareButtons({ onDownload, shareUrl, isDownloading = false, getShareImageBlob }: ShareButtonsProps) {
  const { t } = useTranslation();
  const [shareBusy, setShareBusy] = useState(false);
  const [hint, setHint] = useState<string | null>(null);

  const showHint = (key: string) => {
    setHint(t(key));
    window.setTimeout(() => setHint(null), 4000);
  };

  const withBlob = async (fn: (blob: Blob) => Promise<void>) => {
    if (shareBusy || isDownloading) return;
    setShareBusy(true);
    try {
      const blob = await getShareImageBlob();
      if (!blob) {
        showHint('result.shareImageError');
        return;
      }
      await fn(blob);
    } catch (e) {
      console.error(e);
      showHint('result.shareImageError');
    } finally {
      setShareBusy(false);
    }
  };

  const shareMeta = () => ({
    title: t('result.shareTitle'),
    text: t('result.shareText'),
    url: shareUrl,
  });

  /** One entry point: native share sheet (iOS/Android) lets the user pick Instagram, Messages, etc. */
  const handleShare = () =>
    withBlob(async (blob) => {
      const native = await tryShareImageWithNativeSheet(blob, shareMeta());
      if (native) return;
      downloadImage(blob);
      const line = `${t('result.shareText')} ${shareUrl}`;
      const combined = await tryCopyImageAndCaptionToClipboard(blob, line);
      if (!combined) {
        try {
          await navigator.clipboard.writeText(line);
        } catch {
          /* ignore */
        }
      }
      showHint('result.shareFallback');
    });

  const disabled = isDownloading || shareBusy;

  return (
    <div className="flex flex-col items-center gap-1.5 w-full max-w-lg mx-auto">
      <div className="flex flex-row flex-wrap gap-2 justify-center items-center">
        <button
          type="button"
          onClick={onDownload}
          disabled={disabled}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold text-xs sm:text-sm shadow-md hover:from-yellow-300 hover:to-orange-400 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDownloading ? `⏳ ${t('common.generating')}` : `📥 ${t('common.download')}`}
        </button>
        <button
          type="button"
          onClick={handleShare}
          disabled={disabled}
          aria-label={t('common.share')}
          className="px-4 py-2 rounded-lg bg-white/20 border border-white/40 text-white font-bold text-xs sm:text-sm shadow-md hover:bg-white/30 transition-all active:scale-[0.98] disabled:opacity-50"
        >
          📤 {t('common.share')}
        </button>
      </div>

      <p className="text-[10px] sm:text-xs leading-tight text-white/65 text-center px-1">
        {t('result.shareResultImageLabel')}
      </p>

      {hint && (
        <p className="text-[10px] sm:text-xs text-center text-white/90 px-2 max-w-md leading-snug" role="status">
          {hint}
        </p>
      )}
    </div>
  );
}
