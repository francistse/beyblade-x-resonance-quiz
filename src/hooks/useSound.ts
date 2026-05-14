import { useCallback, useRef } from 'react';
import { publicUrl } from '../utils/publicUrl';

export function useSound(src: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const resolved = publicUrl(src);

  const play = useCallback(() => {
    console.log('[useSound] Playing sound:', resolved);
    if (!audioRef.current) {
      audioRef.current = new Audio(resolved);
    }
    audioRef.current.volume = 1.0;
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch((error) => {
      console.error('[useSound] Error playing sound:', error);
    });
  }, [resolved]);

  return play;
}