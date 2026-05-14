import html2canvas from 'html2canvas';

function convertOklchToRgbInDocument(doc: Document) {
  const allElements = doc.querySelectorAll('*');
  allElements.forEach((el) => {
    const style = doc.defaultView?.getComputedStyle(el as Element);
    if (!style) return;
    
    const properties = ['color', 'backgroundColor', 'borderColor', 'borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor'];
    properties.forEach((prop) => {
      const value = style.getPropertyValue(prop);
      if (value && value.includes('oklch')) {
        try {
          const tempDiv = doc.createElement('div');
          tempDiv.style.display = 'none';
          tempDiv.style.position = 'absolute';
          tempDiv.style.left = '-9999px';
          (tempDiv as any).style[prop] = value;
          doc.body.appendChild(tempDiv);
          const computed = doc.defaultView!.getComputedStyle(tempDiv).getPropertyValue(prop);
          doc.body.removeChild(tempDiv);
          if (computed && !computed.includes('oklch')) {
            (el as HTMLElement).style.setProperty(prop, computed);
          }
        } catch (e) {
          console.warn(`Failed to convert ${prop} color:`, e);
        }
      }
    });
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
