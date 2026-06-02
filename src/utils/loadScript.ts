export function loadScript(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const normalized = String(url ?? '').trim();
    if (!normalized) {
      reject(new Error('script url is empty'));
      return;
    }
    const existing = document.querySelector(`script[data-dynamic-src="${normalized}"]`);
    if (existing) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = normalized;
    script.async = true;
    script.dataset.dynamicSrc = normalized;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`load script failed: ${normalized}`));
    document.head.appendChild(script);
  });
}
