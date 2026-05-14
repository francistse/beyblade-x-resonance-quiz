import { useCallback, useRef } from 'react';
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

  const handleStart = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(START_SOUND_PATH);
    }
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {});
    onStart();
  }, [onStart]);

  const handleFacebookShare = async () => {
    const shareUrl = window.location.href;
    const sharePayload = {
      title: t('quiz.title'),
      text: `${t('quiz.title')} — ${t('quiz.subtitle')}`,
      url: shareUrl,
    };

    if (typeof navigator.share === 'function') {
      try {
        await navigator.share(sharePayload);
        return;
      } catch (err: unknown) {
        const name = err && typeof err === 'object' && 'name' in err ? String((err as { name: string }).name) : '';
        if (name === 'AbortError') return;
      }
    }

    // Popups with window features are unreliable on iOS Safari; same-tab mobile sharer works.
    const mobileSharer = `https://m.facebook.com/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.location.assign(mobileSharer);
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
        </div>
      </div>
    </div>
  );
}
