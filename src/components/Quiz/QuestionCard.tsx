import { useTranslation } from 'react-i18next';
import type { Question } from '../../types';

interface QuestionCardProps {
  question: Question;
  selectedOption?: number;
  onSelect: (optionIndex: number) => void;
}

export function QuestionCard({ question, selectedOption, onSelect }: QuestionCardProps) {
  const { t } = useTranslation();
  
  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <h2 className="text-xl md:text-2xl font-bold text-center mb-6 text-black">
        {t(question.questionKey)}
      </h2>
      <div className="grid gap-4">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => onSelect(index)}
            className={`w-full p-4 md:p-5 rounded-xl border-2 transition-all duration-200 text-left font-medium ${
              selectedOption === index
                ? 'border-green-500 bg-green-500 text-white shadow-lg scale-[1.02]'
                : 'border-gray-300 bg-white text-gray-800 hover:border-gray-500 hover:bg-gray-50 hover:shadow-md'
            }`}
          >
            <span className="text-base md:text-lg">
              {t(option.key)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
