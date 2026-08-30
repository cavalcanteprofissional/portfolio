import { test, expect } from '@playwright/test';
import { loadSite } from './consent';

test.beforeEach(async ({ page }) => {
  await loadSite(page);
});

async function ensureNavVisible(page: import('@playwright/test').Page) {
  const isDesktop = await page.evaluate(() => window.innerWidth >= 768);
  if (!isDesktop) {
    await page.locator('button[aria-label="Toggle menu"]').click();
    await page.waitForTimeout(400);
  }
}

test.describe('Portfolio - Navegação e Layout', () => {

  test('deve carregar a página com título correto', async ({ page }) => {
    await page.goto('/portfolio-cavalcante/');
    await expect(page).toHaveTitle(/Lucas Cavalcante/);
  });

  test('deve exibir o nome no Hero', async ({ page }) => {
    await page.goto('/portfolio-cavalcante/');
    await expect(page.locator('text=Lucas Cavalcante').first()).toBeVisible();
  });

  test('deve ter navegação com todos os links', async ({ page }) => {
    await page.goto('/portfolio-cavalcante/');
    await ensureNavVisible(page);
    const nav = page.locator('nav');
    await expect(nav.locator('text=Projetos').last()).toBeVisible();
    await expect(nav.locator('text=Habilidades').last()).toBeVisible();
    await expect(nav.locator('text=Certificações').last()).toBeVisible();
  });

  test('deve alternar tema ao clicar no botão', async ({ page }) => {
    await page.goto('/portfolio-cavalcante/');
    const html = page.locator('html');
    const initial = await html.getAttribute('class');
    await page.locator('button[aria-label="Toggle theme"]').click();
    const after = await html.getAttribute('class');
    expect(after).not.toBe(initial);
  });

  test('deve trocar idioma para inglês', async ({ page }) => {
    await page.goto('/portfolio-cavalcante/');
    await page.locator('button[aria-label="Select language"]').click();
    await page.locator('text=English').click();
    await ensureNavVisible(page);
    await expect(page.getByRole('link', { name: 'Projects' }).last()).toBeVisible();
  });

  test('deve trocar idioma para espanhol', async ({ page }) => {
    await page.goto('/portfolio-cavalcante/');
    await page.locator('button[aria-label="Select language"]').click();
    await page.locator('text=Español').click();
    await ensureNavVisible(page);
    await expect(page.getByRole('link', { name: 'Proyectos' }).last()).toBeVisible();
  });

  test('seções principais devem estar visíveis', async ({ page }) => {
    await page.goto('/portfolio-cavalcante/');
    await expect(page.locator('#hero')).toBeVisible();
    await expect(page.locator('#experience')).toBeVisible();
    await expect(page.locator('#projects')).toBeVisible();
    await expect(page.locator('#skills')).toBeVisible();
    await expect(page.locator('#certifications')).toBeVisible();
    await expect(page.locator('#languages')).toBeVisible();
    await expect(page.locator('#faq')).toBeVisible();
    await expect(page.locator('#contact')).toBeVisible();
  });

  test('projetos devem ter links de demo e código', async ({ page }) => {
    await page.goto('/portfolio-cavalcante/');
    await page.locator('#projects').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    const section = page.locator('#projects');
    const demoLinks = section.locator('a[target="_blank"]');
    const count = await demoLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test('footer deve ter links sociais', async ({ page }) => {
    await page.goto('/portfolio-cavalcante/');
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    const links = footer.locator('a');
    const count = await links.count();
    expect(count).toBeGreaterThanOrEqual(4);
  });

  test('FAQ deve abrir e fechar itens', async ({ page }) => {
    await page.goto('/portfolio-cavalcante/');
    await page.locator('#faq').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    const firstButton = page.locator('#faq button').first();
    await firstButton.click();
    await expect(firstButton).toHaveAttribute('aria-expanded', 'false');
    await firstButton.click();
    await expect(firstButton).toHaveAttribute('aria-expanded', 'true');
  });
});

test.describe('Portfolio - Responsividade', () => {

  test('menu mobile deve abrir e fechar', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/portfolio-cavalcante/');
    await page.locator('button[aria-label="Toggle menu"]').click();
    await expect(page.getByRole('link', { name: 'Experiência' })).toBeVisible();
    await page.locator('button[aria-label="Toggle menu"]').click();
    await expect(page.getByRole('link', { name: 'Experiência' })).not.toBeVisible();
  });

  test('botão scroll-to-top deve aparecer após rolar', async ({ page }) => {
    await page.goto('/portfolio-cavalcante/');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    // O logo da nav também tem aria-label "Voltar ao topo" — mira o botão fixo flutuante
    await expect(page.locator('button[aria-label="Voltar ao topo"]').last()).toBeVisible();
  });
});
