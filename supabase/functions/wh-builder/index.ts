import { createClient } from "npm:@supabase/supabase-js@2.105.1";
import Stripe from "npm:stripe@18.5.0";
import { validateArtifact } from "../_shared/artifact.ts";
import { generateProject, modelConfig } from "../_shared/model.ts";
import { validPublicBackend } from "../_shared/backend.ts";

const env = (key: string) => Deno.env.get(key) || "";
const db = createClient(env("SUPABASE_URL"), env("SUPABASE_SERVICE_ROLE_KEY"));
const allowed = (o: string) =>
  [env("WH_AI_APP_URL"), "https://whstudio.site", "https://www.whstudio.site", "https://whstudio-web-craft.lovable.app"].includes(o) ||
  /^https:\/\/[a-z0-9-]+\.lovable\.app$/.test(o) ||
  /^https:\/\/[a-z0-9-]+\.lovableproject\.com$/.test(o) ||
  /^http:\/\/localhost:\d+$/.test(o);
const PACKAGES: Record<string, { credits: number; amount: number; name: string }> = {
  inicial: { credits: 5, amount: 1000, name: "Inicial" },
  criador: { credits: 15, amount: 2500, name: "Criador" },
  pro: { credits: 40, amount: 5900, name: "Pro" },
};
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
  const reqOrigin = req.headers.get("origin") || "";
  const origin = allowed(reqOrigin) ? reqOrigin : "";
  const headers: Record<string, string> = {
    "Access-Control-Allow-Origin": origin || "null",
    "Access-Control-Allow-Headers":
      "authorization, apikey, content-type, x-client-info, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
    "Content-Type": "application/json",
  };
  const respond = (data: unknown, status = 200) =>
    new Response(JSON.stringify(data), { status, headers });
  if (req.method === "OPTIONS") return new Response(null, { headers });
  if (req.method !== "POST") return respond({ error: "Método inválido" }, 405);
  if (!origin) return respond({ error: "Origem indisponível" }, 403);
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
    if (Number(req.headers.get("content-length") || 0) > 750000)
      return respond({ error: "Pedido muito grande" }, 413);
    const raw = await req.text();
    if (raw.length > 750000)
      return respond({ error: "Pedido muito grande" }, 413);
    const body = JSON.parse(raw);
    if (body.action === "status") {
      const { error: recoverError } = await db.rpc("builder_recover", { uid: user.id });
      if (recoverError) throw new Error("Não foi possível conferir os créditos.");
      const { data: wallet, error: walletError } = await db.from("builder_wallets").select("balance").eq("user_id", user.id).single();
      if (walletError) throw new Error("Saldo indisponível.");
      return respond({ balance: wallet.balance, paymentsAvailable: Boolean(env("STRIPE_SECRET_KEY") && env("STRIPE_WEBHOOK_SECRET")), generationAvailable: Boolean(modelConfig(env)) });
    }
    if (["rename", "delete", "backend", "publish"].includes(body.action)) {
      const { data: project } = await db.from("builder_projects").select("*").eq("id", body.projectId).eq("user_id", user.id).maybeSingle();
      if (!project) return respond({ error: "Projeto indisponível" }, 404);
      if (body.action === "delete") {
        const { count } = await db.from("builder_generations").select("id", { count: "exact", head: true }).eq("project_id", project.id).eq("status", "pending");
        if (count) return respond({ error: "Aguarde a geração terminar antes de excluir." }, 409);
        const { error } = await db.from("builder_projects").delete().eq("id", project.id).eq("user_id", user.id);
        if (error) throw new Error("Não foi possível excluir o projeto.");
        return respond({ deleted: true });
      }
      if (body.action === "rename") {
        if (typeof body.title !== "string" || !body.title.trim() || body.title.length > 100) return respond({ error: "Use um nome de até 100 caracteres." }, 400);
        const { error } = await db.from("builder_projects").update({ title: body.title.trim() }).eq("id", project.id).eq("user_id", user.id);
        if (error) throw new Error("Não foi possível renomear o projeto.");
        return respond({ saved: true });
      }
      if (body.action === "backend") {
        if (typeof body.url !== "string" || typeof body.key !== "string" || !validPublicBackend(body.url, body.key)) return respond({ error: "Use apenas uma URL válida e uma chave pública do backend." }, 400);
        let valid = false;
        try {
          const check = await fetch(`${body.url.replace(/\/$/, "")}/auth/v1/settings`, { headers: { apikey: body.key }, redirect: "error", signal: AbortSignal.timeout(10000) });
          valid = check.ok;
          await check.body?.cancel();
        } catch { /* Do not expose credentials or remote responses. */ }
        if (!valid) return respond({ error: "O backend não confirmou essa chave pública. Confira a conexão." }, 400);
        const { error } = await db.from("builder_projects").update({ backend_url: body.url.replace(/\/$/, ""), backend_key: body.key }).eq("id", project.id).eq("user_id", user.id);
        if (error) throw new Error("Não foi possível salvar a conexão.");
        return respond({ saved: true });
      }
      const { data: version } = await db.from("builder_generations").select("artifact,id").eq("id", body.generationId).eq("project_id", project.id).eq("user_id", user.id).eq("status", "complete").maybeSingle();
      if (!version) return respond({ error: "Escolha uma versão concluída." }, 400);
      const artifact = validateArtifact(version.artifact);
      const { data: request, error } = await db.from("builder_publication_requests").upsert({ user_id: user.id, project_id: project.id, generation_id: version.id, summary: { title: project.title, kind: project.kind, summary: artifact.summary, file_count: artifact.files.length, requirements: artifact.backend_requirements } }, { onConflict: "user_id,project_id,generation_id" }).select("id").single();
      if (error) throw new Error("Não foi possível registrar a solicitação.");
      return respond({ requestId: request.id });
    }
    if (body.action === "save") {
      const uuid = /^[0-9a-f-]{36}$/i;
      if (!uuid.test(body.projectId))
        return respond({ error: "Projeto inválido" }, 400);
      const { data: project } = await db
        .from("builder_projects")
        .select("id")
        .eq("id", body.projectId)
        .eq("user_id", user.id)
        .maybeSingle();
      if (!project) return respond({ error: "Projeto indisponível" }, 404);
      let artifact;
      try {
        artifact = validateArtifact(body.artifact);
      } catch (e) {
        return respond({ error: e instanceof Error ? e.message : "Projeto inválido" }, 400);
      }
      const { count } = await db.from("builder_generations").select("id", { head: true, count: "exact" }).eq("user_id", user.id).eq("model", "manual").gte("created_at", new Date(Date.now()-60000).toISOString());
      if ((count || 0) >= 10) return respond({ error: "Aguarde um minuto antes de salvar novamente." }, 429);
      const { data: saved, error } = await db
        .from("builder_generations")
        .insert({
          id: crypto.randomUUID(),
          project_id: project.id,
          user_id: user.id,
          prompt: "Edição manual de arquivos",
          status: "complete",
          artifact,
          model: "manual",
          tokens: 0,
        })
        .select()
        .single();
      if (error) throw new Error("Não foi possível salvar os arquivos.");
      return respond({ generation: saved });
    }
    if (body.action === "checkout") {
      checkout = true;
      if (!env("STRIPE_SECRET_KEY") || !env("STRIPE_WEBHOOK_SECRET"))
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
      const pack = PACKAGES[String(body.package || "inicial")];
      if (!pack) return respond({ error: "Pacote inválido" }, 400);
      const { data: order, error } = await db
        .from("builder_orders")
        .insert({ user_id: user.id, credits: pack.credits, amount: pack.amount })
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
                  name: `WH Studio AI — ${pack.name} (${order.credits} créditos)`,
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
      const { error: sessionError } = await db.from("builder_checkout_sessions").insert({ user_id: user.id, order_id: order.id, provider_session_id: session.id });
      if (sessionError) throw new Error("Não foi possível registrar o checkout.");
      return respond({ url: session.url });
    }
    if (raw.length > 40000) return respond({ error: "Pedido muito grande" }, 413);
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
      !uuid.test(body.requestId) ||
      (body.baseGenerationId !== undefined && !uuid.test(body.baseGenerationId))
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
    let previousArtifact: unknown = null;
    if (body.baseGenerationId) {
      const { data: base, error: baseError } = await db
        .from("builder_generations")
        .select("artifact")
        .eq("id", body.baseGenerationId)
        .eq("project_id", project.id)
        .eq("status", "complete")
        .maybeSingle();
      if (baseError || !base)
        return respond({ error: "A versão escolhida não está disponível neste projeto." }, 404);
      previousArtifact = base.artifact;
    } else {
      const { data: previous } = await db
        .from("builder_generations")
        .select("artifact")
        .eq("project_id", project.id)
        .eq("status", "complete")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      previousArtifact = previous?.artifact || null;
    }
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
    const result = await generateProject(
      config,
      instructions,
      JSON.stringify({
        kind: project.kind,
        request: body.prompt,
        previous: previousArtifact,
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
    await db
      .from("builder_projects")
      .update({ title: artifact.title })
      .eq("id", project.id)
      .eq("user_id", user.id);
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
