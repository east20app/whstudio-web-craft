import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
const errors = [];
page.on('pageerror', error => errors.push(error.message));
await page.goto('http://127.0.0.1:5173/');
await page.getByRole('button', { name: 'Vamos criar juntos', exact: true }).click();
await page.getByRole('dialog', { name: 'Central de atendimento' }).waitFor();
assert.equal(await page.locator('#tk-msg').inputValue(), 'Quero iniciar um projeto. ');
await page.getByRole('button', { name: 'Fechar atendimento' }).click();
await page.getByRole('dialog', { name: 'Central de atendimento' }).waitFor({ state: 'detached' });
assert.equal(await page.getByRole('dialog', { name: 'Central de atendimento' }).count(), 0);
console.log('PASS quote opens with context and closes');
const themeToggle = page.getByRole('button', { name: 'Mudar para o tema claro' });
await themeToggle.click();
assert.equal(await page.locator('html').evaluate(el => el.classList.contains('dark')), false);
await page.reload();
await page.getByRole('button', { name: 'Mudar para o tema escuro' }).click();
assert.equal(await page.locator('html').evaluate(el => el.classList.contains('dark')), true);
console.log('PASS theme toggle and persistence');
await page.getByRole('button', { name: 'Quanto tempo leva pra ficar pronto?' }).click();
assert.equal(await page.getByRole('button', { name: 'Quanto tempo leva pra ficar pronto?' }).getAttribute('aria-expanded'), 'true');
console.log('PASS FAQ expands');
await page.goto('http://127.0.0.1:5173/servicos');
const serviceQuote = page.getByRole('button', { name: /^Solicitar orçamento para / }).first();
await serviceQuote.click();
assert.match(await page.locator('#tk-msg').inputValue(), /^Quero um orçamento para:/);
console.log('PASS service quote carries selected service');
await page.goto('http://127.0.0.1:5173/contato');
await page.getByRole('button', { name: 'Enviar e abrir atendimento' }).click();
assert.equal(await page.locator('#name').getAttribute('aria-invalid'), 'true');
assert.equal(await page.locator('#name').evaluate(el => el === document.activeElement), true);
console.log('PASS contact validates and focuses first invalid field');
let messages = 0;
await page.route('**/rest/v1/messages', async route => {
  messages++;
  await new Promise(resolve => setTimeout(resolve, 500));
  await route.fulfill({ status: 201, contentType: 'application/json', body: '' });
});
await page.getByLabel('Nome', { exact: true }).fill('Validação local');
await page.getByLabel('E-mail', { exact: true }).fill('teste@example.com');
await page.getByLabel('Mensagem', { exact: true }).fill('Precisamos de um site institucional para nossa empresa.');
await page.getByRole('button', { name: 'Enviar e abrir atendimento' }).click();
await page.getByRole('button', { name: 'Enviando…', exact: true }).waitFor();
assert.equal(await page.getByRole('button', { name: 'Enviando…', exact: true }).isDisabled(), true);
await page.getByRole('dialog', { name: 'Central de atendimento' }).waitFor();
assert.equal(messages, 1);
assert.match(await page.locator('#tk-msg').inputValue(), /site institucional/);
console.log('PASS mocked contact submission: busy state, single request, opens chat with context');
await page.goto('http://127.0.0.1:5173/dashboard/clientes');
await page.waitForURL('**/dashboard/login');
console.log('PASS administrative route requires authentication');
await page.route('**/rest/v1/rpc/get_public_portfolio', route => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([
  { id: 'local-1', title: 'Site de teste local', category: 'Sites', description: 'Somente no teste', published: true, sort_order: 0, status: 'demo', tech: ['React'], featured: false, url: null, cover_url: null },
  { id: 'local-2', title: 'Sistema de teste local', category: 'Sistemas', description: 'Somente no teste', published: true, sort_order: 1, status: 'demo', tech: ['TypeScript'], featured: false, url: null, cover_url: null }
]) }));
await page.goto('http://127.0.0.1:5173/portfolio');
await page.locator('#portfolio button[aria-pressed]').first().waitFor({ timeout: 30000 });
const filters = page.locator('#portfolio button[aria-pressed]');
if (await filters.count() > 1) {
  const category = filters.nth(1);
  await category.click();
  assert.equal(await page.locator('#portfolio article').count(), 1);
  assert.equal(await category.getAttribute('aria-pressed'), 'true');
  await filters.first().click();
  assert.equal(await filters.first().getAttribute('aria-pressed'), 'true');
  console.log('PASS portfolio category filtering');
}
assert.deepEqual(errors, []);
console.log('PASS no page exceptions');
await browser.close();


