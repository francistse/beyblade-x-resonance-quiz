/**
 * Resolve URLs for files in Vite `public/` so they work with a non-root `base`
 * (e.g. GitHub Pages project sites at /repo-name/).
 */
export function publicUrl(path: string): string {
  const p = path.trim();
  if (/^(https?:|data:|blob:)/i.test(p) || p.startsWith('//')) {
    return p;
  }
  const base = import.meta.env.BASE_URL;
  const trimmed = p.replace(/^\/+/, '');
  return `${base}${trimmed}`;
}
