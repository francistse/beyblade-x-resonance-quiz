import { useState } from 'react';
import { QuizIntro } from '../components/Quiz/QuizIntro';
import { QuizForm } from '../components/Quiz/QuizForm';

interface QuizPageProps {
  onComplete: () => void;
}

export function QuizPage({ onComplete }: QuizPageProps) {
  const [started, setStarted] = useState(false);
  
  return (
    <div className="min-h-screen bg-gray-50">
      {!started ? (
        <QuizIntro onStart={() => setStarted(true)} />
      ) : (
        <QuizForm onComplete={onComplete} />
      )}
    </div>
  );
}
