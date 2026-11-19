import { expect, test } from "../playwright-fixture";

test.beforeEach(async ({ page }) => {
  await page.route("**/*.supabase.co/**", async (route) => {
    if (route.request().url().endsWith("/submit_budget_request")) return route.fallback();
    await route.fulfill({ json: [] });
  });
});

test("página inicial, navegação, serviços e visual responsivo", async ({ page }, testInfo) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/Construímos o\s*próximo nível\s*do digital/);
  await expect.poll(() => page.locator(".wh-hero-art img").evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath("home-desktop.png"), animations: "disabled" });
  await page.getByRole("button", { name: "Concluir: Validar pedido" }).click();
  await expect(page.getByText("1 de 3 concluídas")).toBeVisible();
  await page.getByRole("button", { name: "Reiniciar" }).click();
  await expect(page.getByText("0 de 3 concluídas")).toBeVisible();
  await page.getByRole("navigation", { name: "Navegação principal" }).getByRole("link", { name: "Serviços" }).click();
  await expect(page.getByRole("heading", { name: "Integrações personalizadas", exact: true }).last()).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const menu = page.getByRole("button", { name: "Abrir menu" });
  await menu.click();
  await expect(page.getByRole("navigation", { name: "Navegação principal" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(menu).toBeFocused();
  await expect(menu).toHaveAttribute("aria-expanded", "false");
  await page.screenshot({ path: testInfo.outputPath("home-mobile.png"), animations: "disabled" });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
});

test("orçamento valida etapas e reutiliza protocolo em uma nova tentativa", async ({ page }, testInfo) => {
  const requests: Array<Record<string, string>> = [];
  await page.route("**/rest/v1/rpc/submit_budget_request", async (route) => {
    const payload = route.request().postDataJSON();
    requests.push(payload);
    if (requests.length === 1) {
      await route.fulfill({ status: 503, json: { message: "unavailable" } });
    } else {
      await route.fulfill({ json: payload.request_id });
    }
  });
  await page.goto("/orcamento?servico=lojas-virtuais");
  const next = page.getByRole("button", { name: "Continuar" });
  await expect(page.getByLabel("Qual solução você precisa?")).toHaveValue("Lojas virtuais");
  await next.click();
  await next.click();
  await expect(page.getByRole("heading", { name: "Funcionalidades", exact: true })).toBeVisible();
  await page.getByLabel("O que o projeto precisa fazer?").fill("Catálogo com integração de estoque");
  await next.click();
  await page.getByLabel("Conte o contexto e os requisitos específicos").fill("O estoque é atualizado diariamente.");
  await next.click();
  await page.getByLabel("Quando precisa da primeira entrega?").selectOption("Até 1 mês");
  await next.click();
  await page.getByLabel("Qual faixa está prevista?").selectOption("A definir");
  await next.click();
  await page.getByLabel("Nome", { exact: true }).fill("Pessoa de Teste");
  await page.getByLabel("E-mail", { exact: true }).fill("qa@example.test");
  await next.click();
  await page.screenshot({ path: testInfo.outputPath("orcamento-revisao.png"), animations: "disabled", fullPage: true });
  await page.getByRole("button", { name: "Enviar solicitação" }).click();
  await expect(page.getByRole("alert")).toContainText("Não foi possível enviar");
  await page.getByRole("button", { name: "Enviar solicitação" }).click();
  await expect(page.getByRole("heading", { name: "Solicitação recebida" })).toBeVisible();
  expect(requests).toHaveLength(2);
  expect(requests[0]).toEqual(requests[1]);
  await expect(page.getByText(requests[0].request_id)).toBeVisible();
});

test("painel protegido redireciona visitante", async ({ page }) => {
  await page.goto("/dashboard/orcamentos");
  await expect(page).toHaveURL(/\/dashboard\/login/);
});

test("galeria usa capas cadastradas e mantém categorias e páginas individuais", async ({ page }, testInfo) => {
  const fixture = [
    { id: "test-one", title: "Projeto de teste A", category: "Sites", description: "Descrição técnica de teste", published: true, cover_url: "https://whstudio.site/capa-teste.svg", tech: ["React"] },
    { id: "test-two", title: "Projeto de teste B", category: "Sistemas", description: "Descrição de teste", published: true, tech: [] },
  ];
  await page.route("**/rest/v1/rpc/get_public_portfolio", (route) => route.fulfill({ json: fixture }));
  await page.route("https://whstudio.site/capa-teste.svg", (route) =>
    route.fulfill({ contentType: "image/svg+xml", body: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 10"><path fill="#0085ff" d="M0 0h16v10H0z"/></svg>' })
  );
  await page.goto("/portfolio");
  await expect(page.getByRole("img", { name: "Capa de Projeto de teste A" })).toBeVisible();
  await page.getByRole("button", { name: "Sites", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Projeto de teste B" })).toHaveCount(0);
  await page.getByRole("link", { name: /Projeto de teste A/ }).click();
  await expect(page).toHaveURL(/\/portfolio\/test-one/);
  await expect(page.getByRole("heading", { name: "Projeto de teste A" })).toBeVisible();
  await expect(page.getByText("React", { exact: true })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath("portfolio-projeto.png"), fullPage: true });
});
