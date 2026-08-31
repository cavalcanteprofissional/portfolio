import type { Page } from '@playwright/test';

/**
 * Navega até a raiz do site e aguarda a app terminar o boot (#hero).
 * O consentimento já vem pré-aceito via storageState (e2e/auth-storage.json),
 * então o CookieConsent não surge e não intercepta cliques.
 */
export async function loadSite(page: Page) {
  await page.goto('/portfolio-cavalcante/');
  await page.locator('#hero').waitFor({ timeout: 30000 }).catch(() => {});
  const accept = page.locator('button', { hasText: /Aceitar|Accept|Aceptar/ }).first();
  if ((await accept.count()) > 0) {
    await accept.click({ timeout: 15000 }).catch(() => {});
  }
}

/**
 * Aguarda a app re-iniciar o boot após uma navegação dentro do teste.
 */
export async function waitForApp(page: Page) {
  await page.locator('#hero').waitFor({ timeout: 30000 }).catch(() => {});
}