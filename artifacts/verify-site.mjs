import { chromium } from '@playwright/test';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on('pageerror', e => errors.push(e.message));
await page.goto('http://127.0.0.1:5173/', { waitUntil: 'domcontentloaded' });
await page.locator('h1').waitFor({ timeout: 60000 });
await page.emulateMedia({ reducedMotion: 'reduce' });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(800);
await page.screenshot({ path: 'artifacts/home-desktop.png' });
console.log('HOME', await page.locator('h1').innerText());
for (const route of ['/servicos','/sistemas','/portfolio','/sobre','/contato','/orcamento','/dashboard/login']) {
  await page.goto('http://127.0.0.1:5173' + route, { waitUntil: 'domcontentloaded' });
  await page.locator('h1').waitFor({ timeout: 30000 });
  console.log('ROUTE', route, await page.locator('h1').innerText());
}
await page.goto('http://127.0.0.1:5173/', { waitUntil: 'domcontentloaded' });
await page.setViewportSize({ width: 390, height: 844 });
await page.getByRole('button', { name: 'Abrir menu', exact: true }).click();
await page.getByRole('navigation', { name: 'Navegação mobile' }).getByRole('link', { name: 'Sistemas', exact: true }).click();
await page.waitForURL('**/sistemas');
console.log('MOBILE_NAV', page.url());
for (const route of ['/','/servicos','/sistemas','/portfolio','/sobre','/contato','/orcamento']) {
  await page.goto('http://127.0.0.1:5173' + route, { waitUntil: 'domcontentloaded' });
  await page.locator('h1').waitFor();
  const dimensions = await page.evaluate(() => ({ width: innerWidth, body: document.documentElement.scrollWidth }));
  console.log('MOBILE_OVERFLOW', route, dimensions);
  if (dimensions.body > dimensions.width + 1) throw new Error('Horizontal overflow: ' + route);
}
await page.goto('http://127.0.0.1:5173/', { waitUntil: 'domcontentloaded' });
await page.locator('h1').waitFor();
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(800);
await page.screenshot({ path: 'artifacts/home-mobile.png' });
await page.locator('footer').scrollIntoViewIfNeeded();
await page.screenshot({ path: 'artifacts/footer-mobile.png' });
await page.setViewportSize({ width: 1440, height: 1000 });
await page.locator('footer').scrollIntoViewIfNeeded();
const svg = page.locator('.hover-footer-text');
const box = await svg.boundingBox();
await page.mouse.move(box.x + box.width * .25, box.y + box.height * .5);
console.log('FOOTER_POINTER', await svg.locator('radialGradient').getAttribute('cx'));
await page.screenshot({ path: 'artifacts/footer-desktop.png' });
console.log('PAGE_ERRORS', JSON.stringify(errors));
await browser.close();
if (errors.length) process.exitCode = 1;


