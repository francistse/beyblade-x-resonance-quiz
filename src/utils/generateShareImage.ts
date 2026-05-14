import html2canvas from 'html2canvas';

/** html2canvas cannot parse oklch(); the canvas API resolves it to rgb/rgba. */
function replaceOklchWithRgbInCssValue(cssValue: string, win: Window): string {
  const ctx = win.document.createElement('canvas').getContext('2d');
  if (!ctx) return cssValue;
  // Fresh RegExp each call — a shared /g regex would advance lastIndex across elements.
  return cssValue.replace(new RegExp('oklch\\([^)]+\\)', 'gi'), (match) => {
    try {
      ctx.fillStyle = match;
      const resolved = ctx.fillStyle;
      if (typeof resolved === 'string' && !/oklch\s*\(/i.test(resolved)) {
        return resolved;
      }
    } catch {
      /* keep original */
    }
    return match;
  });
}

/** Computed styles Tailwind v4 often emits as oklch inside gradients and shadows. */
const PROPERTIES_TO_DE_OKLCH = [
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

function convertOklchToRgbInDocument(doc: Document) {
  const win = doc.defaultView;
  if (!win) return;

  const allElements = doc.querySelectorAll('*');
  allElements.forEach((el) => {
    const style = win.getComputedStyle(el as Element);
    if (!style) return;

    for (const prop of PROPERTIES_TO_DE_OKLCH) {
      const value = style.getPropertyValue(prop).trim();
      if (!value || !value.toLowerCase().includes('oklch')) continue;
      const converted = replaceOklchWithRgbInCssValue(value, win);
      if (converted !== value && !converted.toLowerCase().includes('oklch')) {
        (el as HTMLElement).style.setProperty(prop, converted);
      }
    }
  });
}

export async function generateShareImage(
  element: HTMLElement
): Promise<Blob | null> {
  try {
    // Preload background images from CSS
    const bgImagePromises: Promise<void>[] = [];
    const elementsWithBg = element.querySelectorAll('*');
    elementsWithBg.forEach((el) => {
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

    // Wait for all background images to load
    await Promise.all(bgImagePromises);

    // Ensure all <img> elements are loaded before capturing
    const imgPromises = Array.from(element.querySelectorAll('img')).map((img) => {
      if (img.complete) return Promise.resolve();
      return new Promise<void>((resolve) => {
        img.onload = () => resolve();
        img.onerror = () => resolve();
      });
    });
    await Promise.all(imgPromises);

    // Wait for fonts to load
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }

    // Small delay to ensure everything is fully rendered
    await new Promise(resolve => setTimeout(resolve, 500));

    // Convert oklch colors to rgb in the cloned document (html2canvas doesn't support oklch)
    const canvas = await html2canvas(element, {
      backgroundColor: null,
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      imageTimeout: 15000,
      onclone: (clonedDoc) => {
        // Ensure the cloned element is visible and properly sized
        const clonedElement = clonedDoc.querySelector('[data-share-card]');
        if (clonedElement) {
          (clonedElement as HTMLElement).style.visibility = 'visible';
          (clonedElement as HTMLElement).style.opacity = '1';
          
          // Convert oklch colors to rgb in the cloned document
          convertOklchToRgbInDocument(clonedDoc);
        }
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
