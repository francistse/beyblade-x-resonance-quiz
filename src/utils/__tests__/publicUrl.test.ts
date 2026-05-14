import { describe, it, expect } from 'vitest';
import { publicUrl } from '../publicUrl';

describe('publicUrl', () => {
  it('joins BASE_URL with a root-style public path', () => {
    const u = publicUrl('/images/products/CX05_list.png');
    expect(u.endsWith('images/products/CX05_list.png')).toBe(true);
    expect(u.startsWith('/')).toBe(true);
    expect(u).toBe(`${import.meta.env.BASE_URL}images/products/CX05_list.png`);
  });

  it('leaves absolute http(s) URLs unchanged', () => {
    expect(publicUrl('https://example.com/a.png')).toBe('https://example.com/a.png');
  });
});