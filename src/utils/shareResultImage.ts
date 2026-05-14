/** Share helpers for the generated result card PNG (same asset as download). */

function resultImageFile(blob: Blob): File {
  return new File([blob], 'beyblade-result.png', { type: 'image/png', lastModified: Date.now() });
}

/**
 * Opens the system share sheet with the result image when the browser allows it.
 * @returns true if share succeeded or user cancelled after sheet opened
 */
export async function tryShareImageWithNativeSheet(
  blob: Blob,
  share: { title: string; text: string; url: string }
): Promise<boolean> {
  if (!navigator.share) return false;

  const file = resultImageFile(blob);
  const withUrl: ShareData = { files: [file], title: share.title, text: share.text, url: share.url };
  const withoutUrl: ShareData = { files: [file], title: share.title, text: share.text };

  const pickPayload = (): ShareData | null => {
    if (typeof navigator.canShare !== 'function') return withoutUrl;
    if (navigator.canShare(withUrl)) return withUrl;
    if (navigator.canShare(withoutUrl)) return withoutUrl;
    return null;
  };

  const payload = pickPayload();
  const toShare = payload ?? withoutUrl;

  try {
    await navigator.share(toShare);
    return true;
  } catch (err: unknown) {
    const name = err && typeof err === 'object' && 'name' in err ? String((err as { name: string }).name) : '';
    if (name === 'AbortError') return true;
    return false;
  }
}

export async function tryCopyImageToClipboard(blob: Blob): Promise<boolean> {
  try {
    if (!navigator.clipboard || typeof ClipboardItem === 'undefined') return false;
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': Promise.resolve(blob) })]);
    return true;
  } catch {
    return false;
  }
}

/** Image + plain text in one clipboard item (supported in Chromium; avoids overwriting). */
export async function tryCopyImageAndCaptionToClipboard(blob: Blob, caption: string): Promise<boolean> {
  try {
    if (!navigator.clipboard || typeof ClipboardItem === 'undefined') return false;
    const textBlob = new Blob([caption], { type: 'text/plain' });
    const item = new ClipboardItem({
      'image/png': Promise.resolve(blob),
      'text/plain': Promise.resolve(textBlob),
    });
    await navigator.clipboard.write([item]);
    return true;
  } catch {
    return false;
  }
}
