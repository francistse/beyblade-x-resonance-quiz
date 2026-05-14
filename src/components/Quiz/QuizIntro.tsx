import { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/Button';
import logo from '../../assets/cmn_logo.svg';
import threadsIcon from '../../assets/threads.webp';
import { publicUrl } from '../../utils/publicUrl';

interface QuizIntroProps {
  onStart: () => void;
}

const START_SOUND_PATH = publicUrl('/sounds/794843__sadiquecat__beyblade-x-phoenix-wing-quiz-start.wav');

export function QuizIntro({ onStart }: QuizIntroProps) {
  const { t } = useTranslation();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [shareNotice, setShareNotice] = useState<string | null>(null);

  const handleStart = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(START_SOUND_PATH);
    }
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {});
    onStart();
  }, [onStart]);

  const showShareNotice = (message: string) => {
    setShareNotice(message);
    window.setTimeout(() => setShareNotice(null), 4500);
  };

  const handleFacebookShare = () => {
    const shareUrl = window.location.href;
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      '_blank',
      'width=600,height=400'
    );
  };

  const handleThreadsShare = () => {
    const shareUrl = window.location.href;
    const text = `${t('quiz.title')}\n${shareUrl}`;
    window.open(
      `https://www.threads.net/intent/post?text=${encodeURIComponent(text)}`,
      '_blank',
      'width=600,height=400'
    );
  };

  const handleInstagramShare = async () => {
    const shareUrl = window.location.href;
    try {
      await navigator.clipboard.writeText(shareUrl);
      showShareNotice(t('quiz.instagramLinkCopied'));
    } catch {
      showShareNotice(t('quiz.instagramClipboardFailed'));
    }
    window.open('https://www.instagram.com/', '_blank');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <img src={logo} alt="Logo" className="mb-6 max-w-xs w-full" />
      <h1 className="text-3xl md:text-5xl font-bold text-center mb-4 text-green-500">
        {t('quiz.title')}
      </h1>
      <p className="text-lg md:text-xl text-gray-600 text-center mb-8">
        {t('quiz.subtitle')}
      </p>
      <div className="flex flex-col items-center gap-4">
        <Button size="lg" onClick={handleStart} className="my-3">
          {t('common.start')}
        </Button>
        <p className="text-sm text-gray-500 font-medium">{t('common.shareQuiz', 'Share Quiz')}</p>
        {shareNotice && (
          <p className="text-sm text-center text-gray-600 max-w-sm px-2" role="status">
            {shareNotice}
          </p>
        )}
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            type="button"
            onClick={handleFacebookShare}
            className="w-14 h-14 rounded-lg bg-purple-600 text-white shadow-lg hover:bg-purple-500 transition-all hover:scale-105 active:scale-95 flex items-center justify-center"
            title="Facebook"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </button>
          <button
            type="button"
            onClick={handleThreadsShare}
            className="w-14 h-14 rounded-lg bg-purple-600 text-white shadow-lg hover:bg-purple-500 transition-all hover:scale-105 active:scale-95 flex items-center justify-center"
            title="Threads"
          >
            <img src={threadsIcon} alt="Threads" className="w-6 h-6" />
          </button>
          <button
            type="button"
            onClick={handleInstagramShare}
            className="w-14 h-14 rounded-lg bg-purple-600 text-white shadow-lg hover:bg-purple-500 transition-all hover:scale-105 active:scale-95 flex items-center justify-center"
            title="Instagram"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
