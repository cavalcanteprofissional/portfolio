import { test, expect } from '@playwright/test';
import { loadSite, waitForApp } from './consent';

const IGNORED_CONSOLE_ERRORS =
  /ProfileLight init failed|The AudioContext|NotAllowedError|WebGPU|GPU|typegpu|OffscreenCanvas|net::|Failed to load resource|Model|download/i;

test.describe('Qualidade - runtime e persistência', () => {
  test('sem pageerror nem console.error inesperado ao carregar', async ({ page }) => {
    const pageErrors: string[] = [];
    const consoleErrors: string[] = [];
    page.on('pageerror', (e) => pageErrors.push(e.message));
    page.on('console', (m) => {
      if (m.type() === 'error') consoleErrors.push(m.text());
    });

    await loadSite(page);

    expect(pageErrors).toEqual([]);
    const unexpected = consoleErrors.filter((e) => !IGNORED_CONSOLE_ERRORS.test(e));
    expect(unexpected).toEqual([]);
  });

  test('idioma persiste após recarregar', async ({ page }) => {
    await loadSite(page);
    await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
    await page.locator('button[aria-label="Selecionar idioma"]').click();
    await page.locator('text=English').click();
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');

    await page.reload();
    await waitForApp(page);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });

  test('tema persiste após recarregar', async ({ page }) => {
    await loadSite(page);
    const html = page.locator('html');
    const before = (await html.getAttribute('class')) ?? '';
    const next = before.includes('dark') ? /light/ : /dark/;
    await page.locator('button[aria-label="Alternar tema"]').click();
    await expect(html).toHaveClass(next);

    await page.reload();
    await waitForApp(page);
    await expect(html).toHaveClass(next);
  });

  test('admin.html carrega sem pageerror (smoke)', async ({ page }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (e) => pageErrors.push(e.message));
    await page.goto('/portfolio-cavalcante/admin.html');
    await page.locator('#root').waitFor({ timeout: 30000 });
    await expect(page.locator('#root')).not.toBeEmpty();
    expect(pageErrors).toEqual([]);
  });
});