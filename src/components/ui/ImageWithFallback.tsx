import { useState } from 'react';
import { publicUrl } from '../../utils/publicUrl';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  fallback?: string;
  crossOrigin?: 'anonymous' | 'use-credentials';
}

export function ImageWithFallback({ 
  src, 
  alt, 
  className = '', 
  fallback = '/images/placeholder.png',
  crossOrigin
}: ImageWithFallbackProps) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const resolvedSrc = publicUrl(error ? fallback : src);
  
  return (
    <div className={`relative ${className}`}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse">
          <div className="w-8 h-8 rounded-full bg-gray-200" />
        </div>
      )}
      <img
        src={resolvedSrc}
        alt={alt}
        className={`${className} ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onError={() => setError(true)}
        onLoad={() => setLoading(false)}
        crossOrigin={crossOrigin}
      />
    </div>
  );
}
