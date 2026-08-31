import { test, expect } from '@playwright/test';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadSite } from './consent';

const BASE = '/portfolio-cavalcante';
const SITE_URL = 'https://cavalcanteprofissional.github.io/portfolio-cavalcante';
const WA_NUMBER = '5585996859051';
const MSG_ES = '¡Hola Lucas! Vine desde tu portafolio y me gustaría conversar.';

function root(...p: string[]) {
  return resolve(process.cwd(), ...p);
}

function pngSize(buf: Buffer) {
  expect(buf.subarray(12, 16).toString('ascii')).toBe('IHDR');
  return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
}

async function waitForApp(page: import('@playwright/test').Page) {
  await page.goto(`${BASE}/`);
  await page.locator('#hero').waitFor({ state: 'visible', timeout: 30000 }).catch(() => {});
}

test.describe('Artefatos de build (v1.15.0)', () => {
  test('404.html gerado e idêntico ao index.html', () => {
    const distIndex = root('dist/index.html');
    test.skip(!existsSync(distIndex), 'rode `npm run build` antes da suíte de artefatos');
    const indexHtml = readFileSync(distIndex, 'utf-8');
    const notFoundPath = root('dist/404.html');
    expect(existsSync(notFoundPath)).toBe(true);
    expect(readFileSync(notFoundPath, 'utf-8')).toBe(indexHtml);
    expect(indexHtml).toContain('id="root"');
    expect(indexHtml).toContain('type="module"');
  });

  test('admin (MPA): admin.html + /admin/index.html + assets prefixados (v1.20.0)', () => {
    const distAdminHtml = root('dist/admin.html');
    test.skip(!existsSync(distAdminHtml), 'rode `npm run build` antes da suíte de artefatos');
    const adminHtml = readFileSync(distAdminHtml, 'utf-8');
    expect(adminHtml).toContain('id="root"');
    expect(adminHtml).toContain('noindex');
    // Fonte ainda referencia o entry do admin (o build troca pelo bundle)
    expect(readFileSync(root('admin.html'), 'utf-8')).toContain('/src/admin/main.tsx');

    const pretty = root('dist/admin/index.html');
    expect(existsSync(pretty)).toBe(true);
    expect(readFileSync(pretty, 'utf-8')).toBe(adminHtml);
    expect(existsSync(root('dist/admin/404.html'))).toBe(true);

    // Assets do admin usam o base do projeto
    const adminAssets = [...adminHtml.matchAll(/(?:src|href)="([^"]{10,})"/g)].map((m) => m[1]);
    expect(adminAssets.length).toBeGreaterThan(0);
    for (const asset of adminAssets) expect(asset.startsWith(`${BASE}/`)).toBe(true);
  });

  test('index.html redireciona #/admin para o admin.html (v1.20.0)', () => {
    const distIndex = root('dist/index.html');
    test.skip(!existsSync(distIndex), 'rode `npm run build` antes da suíte de artefatos');
    const indexHtml = readFileSync(distIndex, 'utf-8');
    expect(indexHtml).toContain("location.hash === '#/admin'");
    expect(indexHtml).toContain("'admin.html'");
  });

  test('sitemap.xml com URL canônica e schema correto', () => {
    const xml = readFileSync(root('public/sitemap.xml'), 'utf-8');
    expect(xml).toContain('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
    expect(xml).toContain(`<loc>${SITE_URL}/</loc>`);
    expect(xml).toMatch(/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/);
  });

  test('robots.txt referencia o sitemap', () => {
    const txt = readFileSync(root('public/robots.txt'), 'utf-8');
    expect(txt).toContain(`Sitemap: ${SITE_URL}/sitemap.xml`);
    expect(txt).toContain('User-agent: *');
    expect(txt).toContain('Allow: /');
  });

  test('site.webmanifest válido com ícones existentes', () => {
    const manifest = JSON.parse(readFileSync(root('public/site.webmanifest'), 'utf-8'));
    expect(manifest.name).toContain('Lucas Cavalcante');
    expect(manifest.theme_color).toBe('#0ea5e9');
    expect(manifest.background_color).toBe('#0F172A');
    expect(manifest.start_url).toBe(`${BASE}/`);
    expect(manifest.scope).toBe(`${BASE}/`);
    const purposes = manifest.icons.map((i: { purpose?: string }) => i.purpose ?? 'any');
    expect(purposes).toContain('any');
    expect(purposes).toContain('maskable');
    for (const icon of manifest.icons) {
      const filePath = root('public', icon.src.replace(`${BASE}/`, ''));
      expect(existsSync(filePath), icon.src).toBe(true);
      expect(icon.sizes).toMatch(/^\d+x\d+$/);
      expect(icon.type).toBe('image/png');
    }
  });

  test('ícones PNG com dimensões corretas', () => {
    for (const size of [180, 192, 512]) {
      const buf = readFileSync(root('public/icons', `icon-${size}.png`));
      const { w, h } = pngSize(buf);
      expect(w).toBe(size);
      expect(h).toBe(size);
    }
    for (const size of [192, 512]) {
      const buf = readFileSync(root('public/icons', `maskable-${size}.png`));
      const { w, h } = pngSize(buf);
      expect(w).toBe(size);
      expect(h).toBe(size);
    }
  });

  test('favicon.ico é ICONDIR real com 3 entradas PNG embutidas (16/32/48)', () => {
    const buf = readFileSync(root('public/favicon.ico'));
    expect(buf.readUInt16LE(0)).toBe(0);
    expect(buf.readUInt16LE(2)).toBe(1);
    const count = buf.readUInt16LE(4);
    expect(count).toBeGreaterThanOrEqual(3);
    const sizesSeen: number[] = [];
    for (let i = 0; i < count; i++) {
      const o = 6 + 16 * i;
      const wByte = buf[o];
      const hByte = buf[o + 1];
      expect(hByte).toBe(wByte);
      sizesSeen.push(wByte === 0 ? 256 : wByte);
      const dataOffset = buf.readUInt32LE(o + 12);
      const dataLength = buf.readUInt32LE(o + 8);
      expect(buf.subarray(dataOffset, dataOffset + 4).toString('hex')).toBe('89504e47');
      expect(pngSize(buf.subarray(dataOffset, dataOffset + dataLength))).toBeTruthy();
    }
    expect(sizesSeen).toEqual(expect.arrayContaining([16, 32, 48]));
  });

  test('icon-180 (apple-touch) e variantes maskable são totalmente opacos', async () => {
    const sharp = (await import('sharp')).default;
    for (const file of ['icon-180.png', 'maskable-192.png', 'maskable-512.png']) {
      const filePath = root('public/icons', file);
      const meta = await sharp(filePath).metadata();
      if (!meta.hasAlpha) continue;
      const st = await sharp(filePath).stats();
      expect(st.channels[3].min, file).toBe(255);
    }
  });
});

test.describe('Artefatos servidos no app', () => {
  test.beforeEach(async ({ page }) => {
    await loadSite(page);
  });

  test('head declara manifest e ícones, todos acessíveis', async ({ page, request }) => {
    await waitForApp(page);
    const manifestHref = await page.locator('link[rel="manifest"]').getAttribute('href');
    const appleHref = await page.locator('link[rel="apple-touch-icon"]').getAttribute('href');
    const pngHref = await page.locator('link[rel="icon"][sizes="192x192"]').getAttribute('href');
    expect(manifestHref).toBe(`${BASE}/site.webmanifest`);

    const responses = await Promise.all(
      [manifestHref, appleHref, pngHref].map((h) => request.get(h as string))
    );
    for (const res of responses) {
      expect(res.ok()).toBeTruthy();
    }
    expect((await responses[0].json()).theme_color).toBe('#0ea5e9');
    expect(responses[1].headers()['content-type']).toContain('image/png');
    expect(responses[2].headers()['content-type']).toContain('image/png');
  });

  test('robots.txt e sitemap.xml acessíveis via HTTP', async ({ request }) => {
    const robots = await request.get(`${BASE}/robots.txt`);
    expect(robots.ok()).toBeTruthy();
    expect(await robots.text()).toContain(`Sitemap: ${SITE_URL}/sitemap.xml`);

    const sitemap = await request.get(`${BASE}/sitemap.xml`);
    expect(sitemap.ok()).toBeTruthy();
    expect(sitemap.headers()['content-type']).toContain('xml');
    expect(await sitemap.text()).toContain(`<loc>${SITE_URL}/</loc>`);
  });

  test('links WhatsApp têm mensagem pré-preenchida decodificável', async ({ page }) => {
    await waitForApp(page);

    const heroHref = await page.locator('a[aria-label="WhatsApp"]').first().getAttribute('href');
    expect(heroHref).toMatch(new RegExp(`^https://wa\\.me/${WA_NUMBER}\\?text=`));
    const heroMsg = decodeURIComponent(heroHref!.split('?text=')[1]);
    expect(heroMsg.length).toBeGreaterThan(0);

    const footerHref = await page.locator('footer a[title="WhatsApp"]').getAttribute('href');
    expect(footerHref).toMatch(new RegExp(`^https://wa\\.me/${WA_NUMBER}\\?text=`));
    expect(decodeURIComponent(footerHref!.split('?text=')[1]).length).toBeGreaterThan(0);
  });

  test('idioma espanhol altera mensagem pré-preenchida', async ({ page }) => {
    await waitForApp(page);
    await page.locator('button[aria-label="Selecionar idioma"]').click();
    await page.locator('text=Español').click();

    const href = await page
      .locator('footer a[title="WhatsApp"]')
      .getAttribute('href');
    expect(decodeURIComponent(href!.split('?text=')[1])).toBe(MSG_ES);
  });

  test('rodapé com Lattes https e slug LinkedIn padronizado', async ({ page }) => {
    await waitForApp(page);

    const lattesHref = await page.locator('footer a[title="Lattes"]').getAttribute('href');
    expect(lattesHref).toBe('https://lattes.cnpq.br/7686247677030579');

    const linkedinHrefs = await page.locator('a[href*="linkedin.com/in/"]').all();
    expect(linkedinHrefs.length).toBeGreaterThan(0);
    for (const link of linkedinHrefs) {
      expect(await link.getAttribute('href')).toContain('/in/cavalcante-Lucas');
    }
  });
});
