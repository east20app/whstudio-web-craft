import { chromium, expect } from "@playwright/test";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await page.goto("http://127.0.0.1:5173/ai");
await expect(
  page.getByRole("heading", { name: "Da ideia à primeira versão." }),
).toBeVisible();
await page
  .getByRole("button", { name: "Um sistema de tarefas", exact: false })
  .click();
await expect(page.getByLabel("Descreva seu projeto")).toHaveValue(/tarefas/);
await page.getByRole("button", { name: "Gerar projeto", exact: true }).click();
await expect(
  page.getByRole("heading", { name: "Entre para criar" }),
).toBeVisible();
await page.getByRole("button", { name: "Fechar login" }).click();
await page.screenshot({ path: "artifacts/ai-desktop.png" });
await page.setViewportSize({ width: 390, height: 844 });
if (
  await page.evaluate(
    () => document.documentElement.scrollWidth > innerWidth + 1,
  )
)
  throw new Error("Mobile overflow");
await page.screenshot({ path: "artifacts/ai-mobile.png" });
// Local fixtures verify the editor contract, not live provider/payment integration.
const user = {
  id: "11111111-1111-4111-8111-111111111111",
  aud: "authenticated",
  role: "authenticated",
  email: "builder-test@example.com",
  created_at: new Date().toISOString(),
  app_metadata: { provider: "email" },
  user_metadata: {},
};
const project = {
  id: "22222222-2222-4222-8222-222222222222",
  user_id: user.id,
  title: "Tarefas",
  kind: "system",
  created_at: new Date().toISOString(),
  backend_url: null,
  backend_key: null,
};
const generations = [];
let balance = 5;
const token = [
  btoa(JSON.stringify({ alg: "HS256", typ: "JWT" })),
  btoa(
    JSON.stringify({
      sub: user.id,
      exp: Math.floor(Date.now() / 1000) + 3600,
      role: "authenticated",
    }),
  ),
  "fixture",
].join(".");
await page.route("**/auth/v1/**", (route) =>
  route.fulfill({
    json: route.request().url().includes("/token")
      ? {
          access_token: token,
          refresh_token: "fixture-refresh",
          expires_in: 3600,
          token_type: "bearer",
          user,
        }
      : user,
  }),
);
await page.route("**/rest/v1/builder_*", async (route) => {
  const url = new URL(route.request().url());
  let data = [];
  if (url.pathname.endsWith("builder_projects")) {
    if (route.request().method() === "PATCH")
      Object.assign(project, route.request().postDataJSON());
    data = route.request().method() === "POST" ? project : [project];
  }
  if (url.pathname.endsWith("builder_wallets"))
    data = { user_id: user.id, balance };
  if (url.pathname.endsWith("builder_generations")) data = generations;
  await route.fulfill({ json: data });
});
await page.route("**/functions/v1/wh-builder", async (route) => {
  const body = route.request().postDataJSON();
  const files = [
    {path: "vite.config.ts", content: "export default {}"},
    {path: "tsconfig.json", content: "{}"},
    {
      path: "package.json",
      content: JSON.stringify({
        scripts: { dev: "vite", build: "vite build" },
        dependencies: {
          react: "18.3.1",
          "react-dom": "18.3.1",
          "@supabase/supabase-js": "2.105.1",
        },
        devDependencies: { vite: "5.4.19", typescript: "5.8.3" },
      }),
    },
    { path: "index.html", content: '<div id="root"></div>' },
    {
      path: "src/main.tsx",
      content:
        'import React from "react";import {createRoot} from "react-dom/client";import App from "./App";createRoot(document.getElementById("root")!).render(<App/>);',
    },
    {
      path: "src/App.tsx",
      content:
        'import React,{useState,useEffect} from "react";export default function App(){const [added,setAdded]=useState(false);useEffect(()=>{try{parent.document.body.dataset.compromised="true"}catch{}},[]);return <button onClick={()=>setAdded(true)}>{added?"Adicionado":"Adicionar tarefa"}</button>} ',
    },
    {
      path: "supabase/migrations/001_initial.sql",
      content:
        "-- Fixture SQL, never applied to live database\ncreate table tasks(id uuid primary key);",
    },
    {
      path: "README.md",
      content: "Projeto de teste React. Configure o backend.",
    },
  ];
  const generation = {
    id: body.requestId,
    project_id: project.id,
    user_id: user.id,
    prompt: body.prompt,
    status: "complete",
    error: null,
    created_at: new Date().toISOString(),
    artifact: {
      title: "Tarefas",
      summary: "Projeto React com arquivos separados",
      backend_requirements: ["Aplicar a migração no Supabase"],
      files,
    },
  };
  generations.unshift(generation);
  balance--;
  await route.fulfill({ json: { generation } });
});
await page.getByRole("button", { name: "Entrar", exact: true }).click();
await page.getByLabel("E-mail", { exact: true }).fill(user.email);
await page.getByLabel("Senha", { exact: true }).fill("fixture-password");
await page
  .locator("form")
  .getByRole("button", { name: "Entrar", exact: true })
  .click();
await expect(
  page.getByRole("button", { name: "Sair", exact: true }),
).toBeVisible();
await page.getByRole("button", { name: "Gerar projeto", exact: true }).click();
await expect(page.locator("iframe").first()).toBeVisible({ timeout: 60000 });
await page
  .frameLocator("iframe")
  .first()
  .getByRole("button", { name: "Adicionar tarefa" })
  .click({ timeout: 90000 });
await expect(
  page
    .frameLocator("iframe")
    .first()
    .getByRole("button", { name: "Adicionado" }),
).toBeVisible();
if (await page.evaluate(() => document.body.dataset.compromised))
  throw new Error("Sandbox escape");
const downloadPromise = page.waitForEvent("download");
await page.getByRole("button", { name: "Baixar projeto" }).click();
const download = await downloadPromise;
if (!download.suggestedFilename().endsWith(".zip"))
  throw new Error("Wrong download");
await page.getByRole("button", { name: "Backend", exact: true }).click();
await page.getByLabel("URL do Supabase").fill("https://test.supabase.co");
await page
  .getByLabel("Chave pública (publishable ou anon)")
  .fill("sb_secret_not-allowed");
await page.getByRole("button", { name: "Salvar conexão" }).click();
await expect(
  page.getByText("Chaves secretas não são aceitas.", { exact: false }),
).toBeVisible();
await page
  .getByLabel("Chave pública (publishable ou anon)")
  .fill("sb_publishable_fixture-key-for-ui-test");
await page.getByRole("button", { name: "Salvar conexão" }).click();
await expect(page.getByText("Conexão salva.", { exact: false })).toBeVisible();
await page
  .getByLabel("Descreva seu projeto")
  .fill("Melhore as cores e mantenha as tarefas");
await page.getByRole("button", { name: "Gerar projeto", exact: true }).click();
await expect(page.getByRole("button", { name: "Ver esta versão" })).toHaveCount(
  2,
);
await page.reload();
await expect(page.getByRole("button", { name: "Ver esta versão" })).toHaveCount(
  2,
);
await page.getByRole("button", { name: "Arquivos", exact: true }).click();
await expect(page.locator("pre")).toContainText("Adicionar tarefa");
await browser.close();
console.log(
  JSON.stringify({
    anonymous: true,
    mobile: true,
    fixtureGeneration: true,
    fixtureRevision: true,
    fixturePersistence: true,
    sandbox: true,
    download: true,
    pageErrors: errors,
  }),
);
if (errors.length) process.exitCode = 1;
