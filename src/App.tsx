import { useState } from 'react';
import './i18n/config';
import { QuizProvider } from './context/QuizContext';
import { NavigationProvider } from './context/NavigationContext';
import { useQuizState } from './hooks/useQuizState';
import { useLanguage } from './hooks/useLanguage';
import { useAnalytics } from './hooks/useAnalytics';
import { useNavigation } from './context/NavigationContext';
import { QuizIntro } from './components/Quiz/QuizIntro';
import { DemographicForm } from './components/Quiz/DemographicForm';
import { QuizForm } from './components/Quiz/QuizForm';
import { ResultPage } from './pages/ResultPage';
import { AboutSection } from './components/About/AboutSection';
import { NavBar } from './components/ui/NavBar';
import WaveParticleBackground from './components/ui/WaveParticleBackground';
import type { BeybladeData, QuizResult, DemographicData } from './types';
import { findTopMatches, determineUserType } from './utils/matchingAlgorithm';
import { getAwakeningKeyword } from './utils/awakeningKeywords';
import beybladesData from './data/beyblades.json';
import './App.css';

function App() {
  return (
    <QuizProvider>
      <NavigationProvider>
        <AppContent />
      </NavigationProvider>
    </QuizProvider>
  );
}

function AppContent() {
  const { currentPage, goHome, goToDemographics, goToQuiz, goToResult } = useNavigation();
  const [result, setResult] = useState<QuizResult | null>(null);

  const { state, dispatch, reset } = useQuizState();
  const { currentLanguage } = useLanguage();
  const { saveAnalytics, generateSessionId } = useAnalytics();
  
  const handleStart = () => {
    goToDemographics();
    setResult(null);
  };

  const handleDemographicsComplete = (demographics: DemographicData) => {
    dispatch({ type: 'SET_DEMOGRAPHICS', demographics });
    goToQuiz();
  };
  
  const handleComplete = async () => {
    const beyblades = Object.values(beybladesData) as BeybladeData[];
    const topMatches = findTopMatches(state.totalScores, beyblades, 3);
    const userType = determineUserType(state.totalScores);
    const awakeningKeyword = getAwakeningKeyword(userType, currentLanguage);
    
    const quizResult: QuizResult = {
      userVector: state.totalScores,
      topMatches,
      awakeningKeyword,
      type: userType,
    };
    
    setResult(quizResult);
    goToResult();
    
    saveAnalytics({
      sessionId: generateSessionId(),
      gender: state.demographics.gender,
      ageGroup: state.demographics.ageGroup,
      language: currentLanguage,
      topMatchBlade: topMatches[0].beyblade.id,
      topMatchType: userType,
      scoreAttack: state.totalScores.attack,
      scoreDefense: state.totalScores.defense,
      scoreStamina: state.totalScores.stamina,
      userAgent: navigator.userAgent,
      viewportWidth: window.innerWidth,
    }).catch(err => {
      console.error('[Analytics] Failed to save:', err);
    });
  };
  
  const handleRestart = () => {
    reset();
    goHome();
    setResult(null);
  };
  
  return (
    <div className="relative min-h-screen">
      <WaveParticleBackground />
      <div className="relative z-10 pt-14 sm:pt-0">
        <NavBar />
        
        {currentPage === 'home' && (
          <QuizIntro onStart={handleStart} />
        )}

        {currentPage === 'demographics' && (
          <DemographicForm onComplete={handleDemographicsComplete} />
        )}
        
        {currentPage === 'quiz' && (
          <QuizForm onComplete={handleComplete} />
        )}
        
        {currentPage === 'result' && result && (
          <ResultPage result={result} onRetry={handleRestart} />
        )}

        {currentPage === 'about' && (
          <AboutSection />
        )}
      </div>
    </div>
  );
}

export default App;
