import { createClient } from "npm:@supabase/supabase-js@2.105.1";
import Stripe from "npm:stripe@18.5.0";
import { validateArtifact } from "../_shared/artifact.ts";
import { generateProject, modelConfig } from "../_shared/model.ts";

const env = (key: string) => Deno.env.get(key) || "";
const db = createClient(env("SUPABASE_URL"), env("SUPABASE_SERVICE_ROLE_KEY"));
const origin = env("WH_AI_APP_URL");
const headers = {
  "Access-Control-Allow-Origin": origin,
  "Access-Control-Allow-Headers":
    "authorization, apikey, content-type, x-client-info",
  "Content-Type": "application/json",
};
const respond = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers });
const schema = {
  type: "object",
  additionalProperties: false,
  properties: {
    title: { type: "string" },
    summary: { type: "string" },
    files: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: { path: { type: "string" }, content: { type: "string" } },
        required: ["path", "content"],
      },
    },
    backend_requirements: { type: "array", items: { type: "string" } },
  },
  required: ["title", "summary", "files", "backend_requirements"],
};
const instructions = `Você é o engenheiro full-stack da WH Studio AI. Crie um projeto REAL React 18 + TypeScript + Vite com múltiplos arquivos, páginas e componentes. Não entregue um HTML monolítico. Retorne todos os arquivos completos no array files, com caminhos relativos sem barra inicial. Inclua package.json (scripts dev/build/preview, react, react-dom, react-router-dom, @supabase/supabase-js; devDependencies vite, typescript, @vitejs/plugin-react), index.html com root e src/main.tsx, src/App.tsx, vite.config.ts, tsconfig.json, CSS, README.md e .gitignore. Use CSS próprio profissional e importações relativas, sem aliases, Tailwind/CDN ou dependências desnecessárias. Use BrowserRouter com páginas reais e configure fallback SPA de hospedagem em vercel.json. Navegação, formulários, filtros e CRUD devem funcionar.
Para sistemas que precisam persistência, autenticação ou dados compartilhados: use Supabase REAL. Importe supabase e backendConfigured de src/lib/supabase.ts (módulo fornecido pela plataforma, exporta cliente ou null), trate null mostrando como conectar o backend, NUNCA substitua o backend por dados falsos/localStorage. Gere supabase/migrations/001_initial.sql com tabelas, índices, RLS habilitada, policies por auth.uid(), FKs de auth.users e permissões mínimas. Faça login/cadastro/recuperação pelo supabase.auth, tratamento de loading/erro, logout e rotas protegidas quando exigido. CRUD pela API Supabase com validação. Edge Functions para integrações privilegiadas devem ser arquivos separados, com autenticação verificada no servidor; nunca inclua service_role em frontend. Inclua instruções claras de aplicar SQL, configurar auth e deploy em README. Liste em backend_requirements só passos e serviços realmente necessários. Sites simples podem dispensar backend, mas formulários de envio nunca devem fingir sucesso. Nada de segredos ou credenciais inventadas, nem pagamentos falsos. Não escreva scripts de instalação npm. Inclua src/lib/supabase.ts como stub exportando null e backendConfigured=false; a plataforma o substituirá por configuração pública do projeto. Em alterações preserve o projeto e entregue a árvore inteira atualizada. Escreva em português, título com até100 caracteres.`;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers });
  if (req.method !== "POST") return respond({ error: "Método inválido" }, 405);
  if (!origin || req.headers.get("origin") !== origin)
    return respond({ error: "Origem indisponível" }, 403);
  let reserved: string | null = null;
  let checkout = false;
  try {
    const auth = createClient(env("SUPABASE_URL"), env("SUPABASE_ANON_KEY"), {
      global: {
        headers: { Authorization: req.headers.get("authorization") || "" },
      },
    });
    const {
      data: { user },
      error: authError,
    } = await auth.auth.getUser();
    if (authError || !user)
      return respond({ error: "Entre na sua conta para continuar" }, 401);
    if (Number(req.headers.get("content-length") || 0) > 40000)
      return respond({ error: "Pedido muito grande" }, 413);
    const raw = await req.text();
    if (raw.length > 40000)
      return respond({ error: "Pedido muito grande" }, 413);
    const body = JSON.parse(raw);
    if (body.action === "checkout") {
      checkout = true;
      if (!env("STRIPE_SECRET_KEY"))
        return respond(
          { error: "A compra de créditos ainda não foi configurada" },
          503,
        );
      const { count } = await db
        .from("builder_orders")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .gte("created_at", new Date(Date.now() - 86400000).toISOString());
      if ((count || 0) >= 20)
        return respond(
          { error: "Limite diário de tentativas de compra atingido" },
          429,
        );
      const { data: order, error } = await db
        .from("builder_orders")
        .insert({ user_id: user.id })
        .select()
        .single();
      if (error) throw error;
      const stripe = new Stripe(env("STRIPE_SECRET_KEY"));
      const session = await stripe.checkout.sessions.create(
        {
          mode: "payment",
          client_reference_id: user.id,
          metadata: { order_id: order.id },
          line_items: [
            {
              price_data: {
                currency: "brl",
                unit_amount: order.amount,
                product_data: {
                  name: `WH Studio AI — ${order.credits} créditos`,
                },
              },
              quantity: 1,
            },
          ],
          success_url: `${origin}/ai?checkout=success`,
          cancel_url: `${origin}/ai?checkout=cancel`,
        },
        { idempotencyKey: order.id },
      );
      return respond({ url: session.url });
    }
    const config = modelConfig(env);
    if (!config)
      return respond(
        { error: "A geração real ainda precisa ser ativada pela WH Studio" },
        503,
      );
    const uuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (
      typeof body.prompt !== "string" ||
      body.prompt.trim().length < 10 ||
      body.prompt.length > 6000 ||
      !uuid.test(body.projectId) ||
      !uuid.test(body.requestId)
    )
      return respond(
        { error: "Descreva o projeto em 10 a 6.000 caracteres" },
        400,
      );
    const { data: project, error: projectError } = await db
      .from("builder_projects")
      .select("*")
      .eq("id", body.projectId)
      .eq("user_id", user.id)
      .single();
    if (projectError) return respond({ error: "Projeto indisponível" }, 404);
    const { data: job, error } = await db.rpc("builder_reserve", {
      uid: user.id,
      pid: project.id,
      gid: body.requestId,
      brief: body.prompt.trim(),
    });
    if (error) return respond({ error: error.message }, 409);
    // Repeated IDs return their saved state. Never launch another model call.
    if (job.status !== "pending") return respond({ generation: job });
    // Claim once, including simultaneous retries with the same ID.
    const { data: claim, error: claimError } = await db
      .from("builder_generations")
      .update({ model: `${config.provider}/${config.model}` })
      .eq("id", job.id)
      .eq("status", "pending")
      .is("model", null)
      .select("id");
    if (claimError) {
      reserved = job.id;
      throw new Error("Não foi possível iniciar a geração.");
    }
    if (!claim?.length) return respond({ generation: job });
    reserved = job.id;
    const { data: previous } = await db
      .from("builder_generations")
      .select("artifact")
      .eq("project_id", project.id)
      .eq("status", "complete")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    const result = await generateProject(
      config,
      instructions,
      JSON.stringify({
        kind: project.kind,
        request: body.prompt,
        previous: previous?.artifact || null,
      }),
      schema,
    );
    const artifact = validateArtifact(result.artifact);
    if (
      project.kind === "system" &&
      !artifact.files.some((file) =>
        /^supabase\/migrations\/.+\.sql$/.test(file.path),
      )
    )
      throw new Error(
        "O sistema retornado não incluiu a estrutura do banco de dados.",
      );
    const { error: saveError } = await db.rpc("builder_finish", {
      gid: reserved,
      result: artifact,
      failure: null,
      used_model: result.model,
      used_tokens: result.tokens,
    });
    if (saveError) throw new Error("Não foi possível salvar a geração.");
    return respond({ generation: { ...job, status: "complete", artifact } });
  } catch (error) {
    const message = checkout
      ? "Não foi possível abrir o checkout. A WH Studio precisa verificar a configuração de pagamento."
      : error instanceof Error
        ? error.message
        : "Não foi possível concluir o pedido";
    if (reserved)
      await db.rpc("builder_finish", {
        gid: reserved,
        result: null,
        failure: message,
        used_model: null,
        used_tokens: null,
      });
    return respond({ error: message }, 500);
  }
});
