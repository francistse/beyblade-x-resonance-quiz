import { useTranslation } from 'react-i18next';
import { Button } from '../ui/Button';
import { useSound } from '../../hooks/useSound';

interface QuizNavigationProps {
  canGoBack: boolean;
  canGoNext: boolean;
  isLastQuestion: boolean;
  onBack: () => void;
  onNext: () => void;
}

export function QuizNavigation({
  canGoBack,
  canGoNext,
  isLastQuestion,
  onBack,
  onNext,
}: QuizNavigationProps) {
  const { t } = useTranslation();
  const playClickSound = useSound('/sounds/button-click.wav');
  const playResultSound = useSound('/sounds/787800__sadiquecat__beyblade-under-arena-result.wav');

  const handleNext = () => {
    console.log('[QuizNavigation] handleNext called, isLastQuestion:', isLastQuestion);
    if (isLastQuestion) {
      console.log('[QuizNavigation] Playing result sound');
      playResultSound();
    } else {
      console.log('[QuizNavigation] Playing click sound');
      playClickSound();
    }
    onNext();
  };
  
  return (
    <div className="flex justify-between items-center w-full max-w-2xl mx-auto mt-6 px-4">
      <Button
        variant="outline"
        onClick={onBack}
        disabled={!canGoBack}
      >
        {t('common.prev')}
      </Button>
      <Button
        variant="primary"
        onClick={handleNext}
        disabled={!canGoNext}
      >
        {isLastQuestion ? t('common.result') : t('common.next')}
      </Button>
    </div>
  );
}
