import type { Page } from '@playwright/test';

/**
 * Navega até a raiz do site e dispensa o CookieConsent caso ele apareça
 * (o modal z-54 surge ~800ms após o boot e intercepta cliques nos testes).
 */
export async function loadSite(page: Page) {
  await page.goto('/portfolio-cavalcante/');
  await page
    .locator('button', { hasText: /Aceitar|Accept|Aceptar/ })
    .first()
    .click({ timeout: 25000 })
    .catch(() => {});
}