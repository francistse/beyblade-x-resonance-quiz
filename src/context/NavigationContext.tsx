import { createContext, useContext, useCallback, useState, type ReactNode } from 'react';

interface NavigationContextType {
  currentPage: 'home' | 'demographics' | 'quiz' | 'result' | 'about';
  goHome: () => void;
  goToDemographics: () => void;
  goToQuiz: () => void;
  goToResult: () => void;
  goToAbout: () => void;
}

const NavigationContext = createContext<NavigationContextType | null>(null);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [currentPage, setCurrentPage] = useState<'home' | 'demographics' | 'quiz' | 'result' | 'about'>('home');

  const goHome = useCallback(() => setCurrentPage('home'), []);
  const goToDemographics = useCallback(() => setCurrentPage('demographics'), []);
  const goToQuiz = useCallback(() => setCurrentPage('quiz'), []);
  const goToResult = useCallback(() => setCurrentPage('result'), []);
  const goToAbout = useCallback(() => setCurrentPage('about'), []);

  return (
    <NavigationContext.Provider value={{ currentPage, goHome, goToDemographics, goToQuiz, goToResult, goToAbout }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}
