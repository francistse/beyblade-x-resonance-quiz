import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAnalytics } from '../useAnalytics';

const { insertMock, fromMock } = vi.hoisted(() => {
  const insertMock = vi.fn();
  const fromMock = vi.fn(() => ({ insert: insertMock }));
  return { insertMock, fromMock };
});

vi.mock('../../lib/supabase', () => ({
  supabase: { from: fromMock },
  isSupabaseConfigured: () => true,
}));

describe('useAnalytics', () => {
  beforeEach(() => {
    insertMock.mockReset();
    fromMock.mockReset();
    fromMock.mockImplementation(() => ({ insert: insertMock }));
    insertMock.mockResolvedValue({ error: null });
  });

  it('inserts into quiz_analytics with snake_case columns matching the spec schema', async () => {
    const { result } = renderHook(() => useAnalytics());

    await act(async () => {
      const ok = await result.current.saveAnalytics({
        sessionId: 'sess-1',
        gender: 'other',
        ageGroup: '18_24',
        zodiac: 'fire',
        language: 'en-US',
        topMatchBlade: 'BX-01',
        topMatchType: 'attack',
        scoreAttack: 10,
        scoreDefense: 20,
        scoreStamina: 30,
        userAgent: 'vitest',
        viewportWidth: 1024,
      });
      expect(ok).toBe(true);
    });

    expect(fromMock).toHaveBeenCalledWith('quiz_analytics');
    expect(insertMock).toHaveBeenCalledTimes(1);
    expect(insertMock).toHaveBeenCalledWith({
      session_id: 'sess-1',
      gender: 'other',
      age_group: '18_24',
      zodiac: 'fire',
      language: 'en-US',
      top_match_blade: 'BX-01',
      top_match_type: 'attack',
      score_attack: 10,
      score_defense: 20,
      score_stamina: 30,
      user_agent: 'vitest',
      viewport_width: 1024,
    });
  });

  it('returns false when Supabase returns an error', async () => {
    insertMock.mockResolvedValue({
      error: { message: 'permission denied' },
    });

    const { result } = renderHook(() => useAnalytics());

    await act(async () => {
      const ok = await result.current.saveAnalytics({
        sessionId: 'sess-2',
        language: 'en-US',
        topMatchBlade: 'BX-02',
        topMatchType: 'balance',
        scoreAttack: 1,
        scoreDefense: 2,
        scoreStamina: 3,
        userAgent: 'ua',
        viewportWidth: 800,
      });
      expect(ok).toBe(false);
    });
  });
});
