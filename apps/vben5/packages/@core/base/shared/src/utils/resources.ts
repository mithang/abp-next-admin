/**
 * Tải file js
 * @param src Địa chỉ file js
 */
function loadScript(src: string) {
  return new Promise<void>((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      // Nếu đã tải rồi, resolve trực tiếp
      return resolve();
    }
    const script = document.createElement('script');
    script.src = src;
    script.addEventListener('load', () => resolve());
    script.addEventListener('error', () =>
      reject(new Error(`Failed to load script: ${src}`)),
    );
    document.head.append(script);
  });
}

export { loadScript };
