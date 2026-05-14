import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { downloadImage } from '../../utils/generateShareImage';
import { tryCopyImageAndCaptionToClipboard, tryShareImageWithNativeSheet } from '../../utils/shareResultImage';
import threadsIcon from '../../assets/threads.webp';

interface ShareButtonsProps {
  onDownload: () => void;
  shareUrl: string;
  isDownloading?: boolean;
  /** Same PNG as download — used for Instagram / Threads / Facebook flows. */
  getShareImageBlob: () => Promise<Blob | null>;
}

export function ShareButtons({ onDownload, shareUrl, isDownloading = false, getShareImageBlob }: ShareButtonsProps) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const [shareBusy, setShareBusy] = useState(false);
  const [hint, setHint] = useState<string | null>(null);

  const showHint = (key: string) => {
    setHint(t(key));
    window.setTimeout(() => setHint(null), 4000);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
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

  const handleFacebook = () =>
    withBlob(async (blob) => {
      const native = await tryShareImageWithNativeSheet(blob, shareMeta());
      if (native) return;
      downloadImage(blob);
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
        '_blank',
        'width=600,height=400'
      );
      showHint('result.shareFacebookFallback');
    });

  const handleThreads = () =>
    withBlob(async (blob) => {
      const native = await tryShareImageWithNativeSheet(blob, shareMeta());
      if (native) return;
      downloadImage(blob);
      const text = `${t('result.shareText')}\n${shareUrl}`;
      window.open(
        `https://www.threads.net/intent/post?text=${encodeURIComponent(text)}`,
        '_blank',
        'width=600,height=400'
      );
      showHint('result.shareThreadsFallback');
    });

  const handleInstagram = () =>
    withBlob(async (blob) => {
      const native = await tryShareImageWithNativeSheet(blob, shareMeta());
      if (native) return;
      const line = `${t('result.shareText')} ${shareUrl}`;
      const combined = await tryCopyImageAndCaptionToClipboard(blob, line);
      if (!combined) {
        downloadImage(blob);
        try {
          await navigator.clipboard.writeText(line);
        } catch {
          /* ignore */
        }
      }
      window.open('https://www.instagram.com/', '_blank');
      showHint(combined ? 'result.shareInstagramClipboard' : 'result.shareInstagramAfterDownload');
    });

  const disabled = isDownloading || shareBusy;

  return (
    <div className="flex flex-col items-center gap-3 w-full max-w-lg mx-auto">
      <div className="flex flex-col sm:flex-row flex-wrap gap-3 justify-center items-center">
        <button
          type="button"
          onClick={onDownload}
          disabled={disabled}
          className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold text-sm shadow-lg hover:from-yellow-300 hover:to-orange-400 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isDownloading ? `⏳ ${t('common.generating')}` : `📥 ${t('common.download')}`}
        </button>
        <button
          type="button"
          onClick={handleCopy}
          className="px-5 py-2.5 rounded-lg bg-white/20 border border-white/40 text-white font-bold text-sm shadow-lg hover:bg-white/30 transition-all hover:scale-105 active:scale-95"
        >
          {copied ? `✅ ${t('common.copied')}` : `📋 ${t('common.copy')}`}
        </button>
      </div>

      <p className="text-xs text-white/70 text-center">{t('result.shareResultImageLabel')}</p>

      <div className="flex flex-wrap gap-3 justify-center">
        <button
          type="button"
          title="Facebook"
          aria-label="Facebook"
          disabled={disabled}
          onClick={handleFacebook}
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-[#1877F2] text-white shadow-lg hover:brightness-110 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center justify-center"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        </button>
        <button
          type="button"
          title="Threads"
          aria-label="Threads"
          disabled={disabled}
          onClick={handleThreads}
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-black text-white shadow-lg hover:bg-neutral-800 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center justify-center"
        >
          <img src={threadsIcon} alt="" className="w-6 h-6" />
        </button>
        <button
          type="button"
          title="Instagram"
          aria-label="Instagram"
          disabled={disabled}
          onClick={handleInstagram}
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af] text-white shadow-lg hover:brightness-110 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center justify-center"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
          </svg>
        </button>
      </div>

      {hint && (
        <p className="text-xs text-center text-white/90 px-2 max-w-md" role="status">
          {hint}
        </p>
      )}
    </div>
  );
}
