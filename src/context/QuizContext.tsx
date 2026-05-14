import { createContext, useContext, useReducer } from 'react';
import type { ReactNode } from 'react';
import type { QuizState, QuizAnswer, DemographicData } from '../types';
import { questions } from '../data/questions';

type QuizAction =
  | { type: 'SELECT_OPTION'; questionId: number; optionIndex: number }
  | { type: 'NEXT_QUESTION' }
  | { type: 'PREV_QUESTION' }
  | { type: 'SET_DEMOGRAPHICS'; demographics: DemographicData }
  | { type: 'RESET' };

const initialState: QuizState = {
  currentQuestion: 0,
  answers: [],
  totalScores: { attack: 0, defense: 0, stamina: 0 },
  isComplete: false,
  demographics: {},
  demographicsComplete: false,
};

function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case 'SELECT_OPTION': {
      const question = questions.find(q => q.id === action.questionId);
      if (!question) return state;
      
      const option = question.options[action.optionIndex];
      const newAnswer: QuizAnswer = {
        questionId: action.questionId,
        selectedOption: action.optionIndex,
        scores: option.scores,
      };
      
      const existingIndex = state.answers.findIndex(a => a.questionId === action.questionId);
      let newAnswers: QuizAnswer[];
      
      if (existingIndex >= 0) {
        newAnswers = [...state.answers];
        newAnswers[existingIndex] = newAnswer;
      } else {
        newAnswers = [...state.answers, newAnswer];
      }
      
      const totalScores = newAnswers.reduce(
        (acc, ans) => ({
          attack: acc.attack + ans.scores.attack,
          defense: acc.defense + ans.scores.defense,
          stamina: acc.stamina + ans.scores.stamina,
        }),
        { attack: 0, defense: 0, stamina: 0 }
      );
      
      return { ...state, answers: newAnswers, totalScores };
    }
    
    case 'NEXT_QUESTION':
      if (state.currentQuestion >= questions.length - 1) {
        return { ...state, isComplete: true };
      }
      return { ...state, currentQuestion: state.currentQuestion + 1 };
    
    case 'PREV_QUESTION':
      if (state.currentQuestion <= 0) return state;
      return { ...state, currentQuestion: state.currentQuestion - 1 };
    
    case 'SET_DEMOGRAPHICS':
      return { 
        ...state, 
        demographics: action.demographics,
        demographicsComplete: !!(action.demographics.gender && action.demographics.ageGroup)
      };
    
    case 'RESET':
      return initialState;
    
    default:
      return state;
  }
}

const QuizContext = createContext<{
  state: QuizState;
  dispatch: React.Dispatch<QuizAction>;
} | null>(null);

export function QuizProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(quizReducer, initialState);
  return (
    <QuizContext.Provider value={{ state, dispatch }}>
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within QuizProvider');
  }
  return context;
}
