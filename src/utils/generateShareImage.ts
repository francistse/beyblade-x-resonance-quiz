import html2canvas from 'html2canvas';

/** html2canvas cannot parse modern CSS color spaces; canvas serializes them to rgb/rgba. */
const MODERN_COLOR_PATTERNS = [
  new RegExp('oklch\\([^)]+\\)', 'gi'),
  new RegExp('lab\\([^)]+\\)', 'gi'),
  new RegExp('lch\\([^)]+\\)', 'gi'),
];

function isResolvedCssColor(s: string): boolean {
  return !/\boklch\s*\(|\blab\s*\(|\blch\s*\(/i.test(s);
}

function replaceModernCssColors(cssValue: string, win: Window): string {
  const ctx = win.document.createElement('canvas').getContext('2d');
  if (!ctx) return cssValue;
  let out = cssValue;
  for (const re of MODERN_COLOR_PATTERNS) {
    out = out.replace(re, (match) => {
      try {
        ctx.fillStyle = match;
        const resolved = ctx.fillStyle;
        if (typeof resolved === 'string' && isResolvedCssColor(resolved)) {
          return resolved;
        }
      } catch {
        /* keep token */
      }
      return match;
    });
  }
  return out;
}

/** Tailwind v4 often emits oklch/lab inside gradients and shadows. */
const PROPERTIES_TO_NORMALIZE = [
  'color',
  'background-color',
  'background-image',
  'border-top-color',
  'border-right-color',
  'border-bottom-color',
  'border-left-color',
  'outline-color',
  'text-decoration-color',
  'box-shadow',
  'text-shadow',
  'fill',
  'stroke',
  'caret-color',
];

function convertModernColorsInDocument(doc: Document) {
  const win = doc.defaultView;
  if (!win) return;

  doc.querySelectorAll('*').forEach((el) => {
    const style = win.getComputedStyle(el as Element);
    if (!style) return;

    for (const prop of PROPERTIES_TO_NORMALIZE) {
      const value = style.getPropertyValue(prop).trim();
      if (!value) continue;
      if (!/\boklch\s*\(|\blab\s*\(|\blch\s*\(/i.test(value)) continue;
      const converted = replaceModernCssColors(value, win);
      if (converted !== value && isResolvedCssColor(converted)) {
        (el as HTMLElement).style.setProperty(prop, converted);
      }
    }
  });
}

export async function generateShareImage(
  element: HTMLElement
): Promise<Blob | null> {
  try {
    const bgImagePromises: Promise<void>[] = [];
    element.querySelectorAll('*').forEach((el) => {
      const style = window.getComputedStyle(el);
      const bgImage = style.backgroundImage;
      if (bgImage && bgImage !== 'none' && bgImage.includes('url')) {
        const urlMatch = bgImage.match(/url\(['"]?([^'"]+)['"]?\)/);
        if (urlMatch) {
          const url = urlMatch[1];
          const img = new Image();
          img.crossOrigin = 'anonymous';
          bgImagePromises.push(
            new Promise((resolve) => {
              img.onload = () => resolve();
              img.onerror = () => resolve();
              img.src = url;
            })
          );
        }
      }
    });

    await Promise.all(bgImagePromises);

    const imgPromises = Array.from(element.querySelectorAll('img')).map((img) => {
      if (img.complete) return Promise.resolve();
      return new Promise<void>((resolve) => {
        img.onload = () => resolve();
        img.onerror = () => resolve();
      });
    });
    await Promise.all(imgPromises);

    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }

    await new Promise((resolve) => setTimeout(resolve, 500));

    const canvas = await html2canvas(element, {
      backgroundColor: null,
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      imageTimeout: 15000,
      onclone: (clonedDoc) => {
        const clonedCard = clonedDoc.querySelector('[data-share-card]');
        if (clonedCard) {
          (clonedCard as HTMLElement).style.visibility = 'visible';
          (clonedCard as HTMLElement).style.opacity = '1';
        }
        // Whole clone: Recharts / inherited rules may still use oklch outside the card root.
        convertModernColorsInDocument(clonedDoc);
      },
    });

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/png');
    });
  } catch (error) {
    console.error('Failed to generate image:', error);
    return null;
  }
}

export function downloadImage(blob: Blob, filename: string = 'beyblade-result.png') {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
