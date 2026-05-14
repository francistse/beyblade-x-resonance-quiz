import { Suspense } from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface SuspenseWrapperProps {
  children: React.ReactNode;
}

export function SuspenseWrapper({ children }: SuspenseWrapperProps) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner size="lg" />
        </div>
      }
    >
      {children}
    </Suspense>
  );
}
