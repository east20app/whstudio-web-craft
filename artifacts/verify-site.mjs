import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { chromium } from "@playwright/test";

const base = process.env.WH_PREVIEW_URL || "http://127.0.0.1:5173";
const captures = "artifacts/wh-studio-qa.local";
const projectId = "4b12de09-c851-4c77-8a80-93fe597229ac";
await mkdir(captures, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.WH_CHROMIUM_EXECUTABLE });
const page = await browser.newPage({ viewport: { width: 1440, height: 960 }, reducedMotion: "reduce" });
const errors = [];
const submissions = [];
const account = { id: projectId, aud: "authenticated", role: "authenticated", email: "admin@example.com", app_metadata: {}, user_metadata: {}, created_at: "2026-01-01T00:00:00Z" };
const expires = Math.floor(Date.now() / 1000) + 3600;
const jwtPart = value => Buffer.from(JSON.stringify(value)).toString("base64url");
const token = `${jwtPart({ alg: "HS256", typ: "JWT" })}.${jwtPart({ sub: account.id, exp: expires, role: account.role })}.dGVzdA`;
let allowAdmin = false;
page.on("pageerror", error => errors.push(error.message));
await page.route(url => url.origin !== new URL(base).origin && /\/(rest|auth|functions|storage)\/v1\//.test(url.pathname), async route => {
  const url = new URL(route.request().url());
  const headers = route.request().headers();
  const object = headers.accept?.includes("vnd.pgrst.object+json");
  const respond = (json, status = 200) => route.fulfill({ status, json });
  if (url.pathname.endsWith("/submit_budget_request")) {
    submissions.push(route.request().postDataJSON());
    return submissions.length === 1 ? respond({ message: "Verificação de erro" }, 500) : respond(null);
  }
  if (url.pathname.endsWith("/get_public_services")) return respond([{ id: projectId, name: "Inteligência artificial", description: "Serviço de teste" }]);
  if (url.pathname.endsWith("/get_public_portfolio")) {
    return respond([{ id: projectId, title: "Projeto de teste", category: "Sistema", description: "Dados da suíte Playwright.", status: "demo", tech: ["React"], published: true }]);
  }
  if (url.pathname.endsWith("/portfolio_projects")) return respond(url.searchParams.get("select") === "gallery_urls" ? { gallery_urls: [] } : []);
  if (url.pathname.endsWith("/admin_signup_available")) return respond(false);
  if (url.pathname.endsWith("/budgets")) {
    return respond([{ id: projectId, client: "Cliente QA", service: "Inteligência artificial", contact: "teste@example.com", status: "novo", notes: "Escopo da suíte Playwright.", date: "2026-01-01T00:00:00Z" }]);
  }
  if (url.pathname.endsWith("/budget_attachments")) {
    const attachment = { id: projectId, filename: "escopo.pdf", payload: Buffer.from("%PDF-1.4").toString("base64") };
    return respond(object ? attachment : [attachment]);
  }
  if (url.pathname.endsWith("/is_admin")) return respond(allowAdmin);
  if (url.pathname.endsWith("/auth/v1/token")) {
    return respond({ access_token: token, refresh_token: "fixture-refresh-token", token_type: "bearer", expires_at: expires, expires_in: 3600, user: account });
  }
  if (url.pathname.endsWith("/auth/v1/user")) return respond(account);
  if (url.pathname.endsWith("/auth/v1/logout")) return route.fulfill({ status: 204 });
  if (url.pathname.includes("/auth/v1/")) return respond({ message: "Sessão indisponível no teste" }, 401);
  return respond(object ? {} : []);
});

async function open(path) {
  await page.goto(base + path, { waitUntil: "domcontentloaded" });
  await page.locator("h1").first().waitFor({ state: "visible" });
}
async function capture(name, fullPage = false) {
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `${captures}/${name}.png`, fullPage });
}

try {
  await open("/");
  assert.match(await page.locator("h1").innerText(), /WH DIGITAL\s+STUDIO/);
  assert.equal(await page.getByRole("button", { name: "Pular introdução" }).count(), 0);
  await capture("home-desktop");
  await page.getByRole("button", { name: "04 Testes" }).click();
  await page.getByText(/Verificamos os fluxos/).waitFor();
  await page.getByRole("button", { name: "Menu", exact: true }).click();
  await page.getByRole("dialog").waitFor();
  await capture("menu");
  await page.keyboard.press("Escape");
  await page.getByRole("dialog").waitFor({ state: "hidden" });
  // Hold the intro animation during the skip assertion to keep browser timing deterministic.
  await page.addInitScript(() => {
    const apply = () => {
      const style = document.createElement("style");
      style.textContent = ".wh-intro { animation-play-state: paused !important; }";
      (document.head ?? document.documentElement).append(style);
    };
    if (document.documentElement) apply();
    else document.addEventListener("DOMContentLoaded", apply, { once: true });
  });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto(base, { waitUntil: "commit" });
  const skip = page.getByRole("button", { name: "Pular introdução" });
  await skip.focus();
  await skip.press("Enter");
  await page.getByRole("button", { name: "Pular introdução" }).waitFor({ state: "detached" });
  await page.emulateMedia({ reducedMotion: "reduce" });

  const routes = ["/servicos", "/sistemas", "/portfolio", `/portfolio/${projectId}`, "/sobre", "/contato",
    "/orcamento", "/feedback/token-invalido", "/ai", `/ai/projetos/${projectId}`, "/dashboard/login"];
  for (const path of routes) {
    await open(path);
    console.log(path, await page.locator("h1").first().innerText());
  }
  for (const suffix of ["", "/orcamentos", "/clientes", "/projetos", "/servicos", "/tickets", "/mensagens", "/feedbacks", "/portfolio", "/configuracoes"]) {
    await page.goto(base + "/dashboard" + suffix);
    await page.waitForURL("**/dashboard/login");
  }

  await open("/portfolio");
  await page.getByRole("button", { name: "Sistema", exact: true }).click();
  await page.getByRole("link", { name: "Projeto de teste", exact: true }).waitFor();

  await open("/orcamento?servico=Intelig%C3%AAncia%20artificial");
  assert(await page.getByRole("checkbox", { name: "Inteligência artificial" }).isChecked());
  await page.getByRole("button", { name: "Continuar" }).click();
  await page.getByLabel("Requisitos do projeto").fill("Precisamos conectar um formulário ao nosso painel de operações.");
  await page.locator('input[type="file"]').setInputFiles({ name: "escopo.pdf", mimeType: "application/pdf", buffer: Buffer.from("%PDF-1.4") });
  await page.getByRole("button", { name: "Continuar" }).click();
  await page.getByLabel("Seu nome ou empresa").fill("Cliente QA");
  await page.getByLabel("E-mail de contato").fill("teste@example.com");
  await capture("orcamento");
  await page.getByRole("button", { name: "Enviar solicitação" }).click();
  await page.getByText(/Não foi possível enviar/).waitFor();
  await page.getByRole("button", { name: "Enviar solicitação" }).click();
  await page.getByRole("heading", { name: "Solicitação recebida" }).waitFor();
  assert.equal(submissions.length, 2);
  assert.equal(submissions[0].request_id, submissions[1].request_id);
  assert.equal(submissions[1].attachments[0].filename, "escopo.pdf");

  await page.setViewportSize({ width: 768, height: 1024 });
  await open("/");
  await capture("home-tablet");
  await page.setViewportSize({ width: 390, height: 844 });
  for (const path of ["/", ...routes]) {
    await open(path);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
    assert(!overflow, `Rolagem horizontal inesperada em ${path}`);
  }
  await capture("dashboard-login-mobile");
  await open("/ai");
  await capture("ai-mobile");
  await open("/");
  await capture("home-mobile");
  await page.locator("footer").scrollIntoViewIfNeeded();
  await capture("footer-mobile");
  await page.setViewportSize({ width: 1440, height: 960 });
  await open("/dashboard/login");
  const login = async () => {
    await page.getByLabel("E-mail", { exact: true }).fill(account.email);
    await page.getByLabel("Senha", { exact: true }).fill("senha-qa");
    await page.getByRole("button", { name: "Entrar no painel" }).click();
  };
  await login();
  await page.getByText("Esta conta não é administradora.").waitFor();
  allowAdmin = true;
  await login();
  await page.waitForURL("**/dashboard");
  await page.reload({ waitUntil: "domcontentloaded" });
  const sidebar = page.getByRole("navigation", { name: "Menu do dashboard" });
  await sidebar.waitFor();
  await page.getByRole("heading", { name: "Visão geral", exact: true }).waitFor();
  const budgetChart = page.getByRole("heading", { name: "Distribuição dos orçamentos" });
  await budgetChart.waitFor();
  await budgetChart.locator("..").locator("..").getByText("Novos", { exact: true }).waitFor();
  await capture("dashboard-desktop");
  for (const label of ["Orçamentos", "Clientes", "Projetos", "Serviços", "Tickets", "Mensagens", "Feedbacks", "Portfólio", "Configurações"]) {
    const link = sidebar.getByRole("link", { name: label, exact: true });
    const destination = await link.getAttribute("href");
    await link.click();
    await page.waitForURL(base + destination);
    console.log("ADMIN", destination);
    if (label === "Orçamentos") {
      await page.getByRole("button", { name: "Cliente QA" }).click();
      const detail = page.getByRole("dialog", { name: "Cliente QA" });
      await detail.getByText("Escopo da suíte Playwright.").waitFor();
      const [download] = await Promise.all([
        page.waitForEvent("download"),
        detail.getByRole("button", { name: "escopo.pdf" }).click(),
      ]);
      assert.equal(download.suggestedFilename(), "escopo.pdf");
      await page.keyboard.press("Escape");
      await detail.waitFor({ state: "hidden" });
    }
  }
  assert.deepEqual(errors, []);
} finally {
  await browser.close();
}
