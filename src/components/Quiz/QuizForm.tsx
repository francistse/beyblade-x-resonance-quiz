import { useTranslation } from 'react-i18next';
import { useQuizState } from '../../hooks/useQuizState';
import { QuestionCard } from './QuestionCard';
import { QuizNavigation } from './QuizNavigation';
import { ProgressBar } from '../ui/ProgressBar';

interface QuizFormProps {
  onComplete: () => void;
}

export function QuizForm({ onComplete }: QuizFormProps) {
  const { t } = useTranslation();
  const {
    currentQuestion,
    progress,
    canGoBack,
    canGoNext,
    getCurrentAnswer,
    selectOption,
    nextQuestion,
    prevQuestion,
    totalQuestions,
  } = useQuizState();
  
  const handleNext = () => {
    if (currentQuestion.id === totalQuestions) {
      onComplete();
    } else {
      nextQuestion();
    }
  };
  
  const currentAnswer = getCurrentAnswer();
  
  return (
    <div className="flex flex-col min-h-screen py-8">
      <div className="w-full max-w-2xl mx-auto px-4 mb-4">
        <p className="text-center text-gray-600 mb-2">
          {t('quiz.progress', { 
            current: currentQuestion.id, 
            total: totalQuestions 
          })}
        </p>
        <ProgressBar progress={progress} />
      </div>
      <QuestionCard
        question={currentQuestion}
        selectedOption={currentAnswer?.selectedOption}
        onSelect={selectOption}
      />
      <QuizNavigation
        canGoBack={canGoBack}
        canGoNext={canGoNext}
        isLastQuestion={currentQuestion.id === totalQuestions}
        onBack={prevQuestion}
        onNext={handleNext}
      />
    </div>
  );
}
