import { useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { BeybladeType, SupportedLanguage } from '../types';

interface AnalyticsData {
  sessionId: string;
  gender?: string;
  ageGroup?: string;
  zodiac?: string;
  language: SupportedLanguage;
  topMatchBlade: string;
  topMatchType: BeybladeType;
  scoreAttack: number;
  scoreDefense: number;
  scoreStamina: number;
  userAgent: string;
  viewportWidth: number;
}

export function useAnalytics() {
  const saveAnalytics = useCallback(async (data: AnalyticsData): Promise<boolean> => {
    if (!isSupabaseConfigured() || !supabase) {
      console.log('[Analytics] Supabase not configured, skipping analytics');
      return false;
    }
    
    try {
      const { error } = await supabase.from('quiz_analytics').insert({
        session_id: data.sessionId,
        gender: data.gender,
        age_group: data.ageGroup,
        zodiac: data.zodiac,
        language: data.language,
        top_match_blade: data.topMatchBlade,
        top_match_type: data.topMatchType,
        score_attack: data.scoreAttack,
        score_defense: data.scoreDefense,
        score_stamina: data.scoreStamina,
        user_agent: data.userAgent,
        viewport_width: data.viewportWidth,
      });
      
      if (error) {
        const hint = 'hint' in error && typeof error.hint === 'string' ? error.hint : '';
        console.error('[Analytics] Failed to save:', error.message, hint ? `\n${hint}` : '', error);
        return false;
      }
      
      console.log('[Analytics] Saved successfully');
      return true;
    } catch (err) {
      console.error('[Analytics] Unexpected error:', err);
      return false;
    }
  }, []);
  
  const generateSessionId = useCallback((): string => {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  }, []);
  
  return {
    saveAnalytics,
    generateSessionId,
    isConfigured: isSupabaseConfigured(),
  };
}
