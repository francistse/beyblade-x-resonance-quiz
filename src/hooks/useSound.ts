import { useCallback, useRef } from 'react';

export function useSound(src: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const play = useCallback(() => {
    console.log('[useSound] Playing sound:', src);
    if (!audioRef.current) {
      audioRef.current = new Audio(src);
    }
    audioRef.current.volume = 1.0;
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch((error) => {
      console.error('[useSound] Error playing sound:', error);
    });
  }, [src]);

  return play;
}