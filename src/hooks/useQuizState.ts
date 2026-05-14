import { useQuiz } from '../context/QuizContext';
import { questions } from '../data/questions';

export function useQuizState() {
  const { state, dispatch } = useQuiz();
  
  const currentQuestion = questions[state.currentQuestion];
  const progress = ((state.currentQuestion + 1) / questions.length) * 100;
  const canGoBack = state.currentQuestion > 0;
  const canGoNext = state.answers.some(a => a.questionId === currentQuestion?.id);
  const hasAnsweredCurrent = state.answers.some(a => a.questionId === currentQuestion?.id);
  
  const getCurrentAnswer = () => {
    return state.answers.find(a => a.questionId === currentQuestion?.id);
  };
  
  const selectOption = (optionIndex: number) => {
    if (currentQuestion) {
      dispatch({ type: 'SELECT_OPTION', questionId: currentQuestion.id, optionIndex });
    }
  };
  
  const nextQuestion = () => {
    dispatch({ type: 'NEXT_QUESTION' });
  };
  
  const prevQuestion = () => {
    dispatch({ type: 'PREV_QUESTION' });
  };
  
  const reset = () => {
    dispatch({ type: 'RESET' });
  };
  
  return {
    state,
    dispatch,
    currentQuestion,
    progress,
    canGoBack,
    canGoNext,
    hasAnsweredCurrent,
    getCurrentAnswer,
    selectOption,
    nextQuestion,
    prevQuestion,
    reset,
    totalQuestions: questions.length,
  };
}
