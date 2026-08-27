let loaded = false;

export function enableUmami(): void {
  const websiteId = import.meta.env.VITE_UMAMI_WEBSITE_ID as string | undefined;
  const src = (import.meta.env.VITE_UMAMI_SRC as string | undefined) || 'https://cloud.umami.is/script.js';

  if (!websiteId || loaded) return;

  loaded = true;
  const script = document.createElement('script');
  script.async = true;
  script.defer = true;
  script.src = src;
  script.dataset.websiteId = websiteId;
  document.head.appendChild(script);
}
