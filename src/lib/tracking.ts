export interface VisitData {
  id: string;
  timestamp: string;
  ip_hash: string;
  city: string;
  region: string;
  country: string;
  device: string;
  browser: string;
  os: string;
  screen: string;
  language: string;
  consent: boolean;
}

const OWNER = 'cavalcanteprofissional';
const REPO = 'portfolio-cavalcante';
const EVENT_TYPE = 'track_visit';
const API_BASE = 'https://api.github.com/repos';

function hashString(input: string): Promise<string> {
  return crypto.subtle
    .digest('SHA-256', new TextEncoder().encode(input))
    .then((buf) => Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join(''));
}

function detectDevice(ua: string): string {
  if (/Mobile|Android|iPhone|iPad/i.test(ua)) return 'mobile';
  if (/Tablet|iPad/i.test(ua)) return 'tablet';
  return 'desktop';
}

function detectBrowser(ua: string): string {
  if (/Edg\//i.test(ua)) return 'Edge';
  if (/Chrome\//i.test(ua)) return 'Chrome';
  if (/Firefox\//i.test(ua)) return 'Firefox';
  if (/Safari\//i.test(ua)) return 'Safari';
  if (/Opera|OPR\//i.test(ua)) return 'Opera';
  return 'Outro';
}

function detectOS(ua: string): string {
  if (/Windows/i.test(ua)) return 'Windows';
  if (/Android/i.test(ua)) return 'Android';
  if (/iPhone|iPad|iOS/i.test(ua)) return 'iOS';
  if (/Mac OS X|Macintosh/i.test(ua)) return 'macOS';
  if (/Linux/i.test(ua)) return 'Linux';
  return 'Outro';
}

interface GeoInfo {
  city: string;
  region: string;
  country: string;
}

async function getGeoInfo(): Promise<GeoInfo> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4000);
    const res = await fetch('http://ip-api.com/json/?fields=city,regionName,countryCode', {
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!res.ok) throw new Error('geolocation failed');
    const data = await res.json();
    return {
      city: data.city || '',
      region: data.regionName || '',
      country: data.countryCode || '',
    };
  } catch {
    return { city: '', region: '', country: '' };
  }
}

async function getClientIp(): Promise<string> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4000);
    const res = await fetch('https://api.ipify.org?format=json', { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) throw new Error('ip failed');
    const data = await res.json();
    return typeof data.ip === 'string' ? data.ip : '';
  } catch {
    return '';
  }
}

function buildPayload(geo: GeoInfo, consent: boolean): VisitData {
  const ua = navigator.userAgent;
  const lang = navigator.language || document.documentElement.lang || 'pt';
  return {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    ip_hash: '',
    city: geo.city,
    region: geo.region,
    country: geo.country,
    device: detectDevice(ua),
    browser: detectBrowser(ua),
    os: detectOS(ua),
    screen: `${window.screen.width}x${window.screen.height}`,
    language: lang,
    consent,
  };
}

export async function trackVisit(consent: boolean): Promise<void> {
  const token = import.meta.env.VITE_GH_TOKEN as string | undefined;
  if (!token) {
    return;
  }

  try {
    const [geo, ip] = await Promise.all([getGeoInfo(), getClientIp()]);
    const visit = buildPayload(geo, consent);
    if (ip) {
      visit.ip_hash = await hashString(ip);
    }

    await fetch(`${API_BASE}/${OWNER}/${REPO}/dispatches`, {
      method: 'POST',
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token}`,
        'X-GitHub-Api-Version': '2022-11-28',
      },
      body: JSON.stringify({
        event_type: EVENT_TYPE,
        client_payload: { visit },
      }),
    });
  } catch {
    /* tracking silencioso — jamais deve quebrar a SPA */
  }
}
