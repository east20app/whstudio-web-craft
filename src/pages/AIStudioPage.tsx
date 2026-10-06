import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowUp,
  Code2,
  Download,
  Loader2,
  Monitor,
  Plus,
  Smartphone,
  Sparkles,
  X,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import {
  builderDb,
  builderRequest,
  downloadProject,
  type Generation,
  type Project,
} from "@/lib/builder";
import BuilderFiles from "@/components/BuilderFiles";
import BuilderBackend from "@/components/BuilderBackend";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { whatsappLink } from "@/config/site";

const suggestions = [
  "Um site para minha cafeteria, com cardápio e contato",
  "Um sistema de tarefas com cadastro, filtros e status",
  "Um painel de estoque com produtos e alertas",
];
const BuilderPreview = lazy(() => import("@/components/BuilderPreview"));
export default function AIStudioPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null),
    [projects, setProjects] = useState<Project[]>([]),
    [versions, setVersions] = useState<Generation[]>([]);
  const [selected, setSelected] = useState<string>(""),
    [prompt, setPrompt] = useState(""),
    [kind, setKind] = useState<"site" | "system">("site");
  const [balance, setBalance] = useState(0),
    [busy, setBusy] = useState(false),
    [notice, setNotice] = useState(""),
    [mobile, setMobile] = useState(false),
    [code, setCode] = useState(false);
  const [backend, setBackend] = useState(false);
  const [login, setLogin] = useState(false),
    [signup, setSignup] = useState(false),
    [email, setEmail] = useState(""),
    [password, setPassword] = useState(""),
    [authBusy, setAuthBusy] = useState(false),
    [recovery, setRecovery] = useState(false);
  const refresh = useCallback(async () => {
    if (!user) return;
    const [p, w] = await Promise.all([
      builderDb
        .from("builder_projects")
        .select("*")
        .order("created_at", { ascending: false }),
      builderDb
        .from("builder_wallets")
        .select("balance")
        .eq("user_id", user.id)
        .maybeSingle(),
    ]);
    if (p.error) {
      setNotice(
        "O serviço ainda precisa da instalação do banco da WH Studio AI.",
      );
      return;
    }
    setProjects(p.data || []);
    setBalance(w.data?.balance || 0);
    if (id) {
      const { data, error } = await builderDb
        .from("builder_generations")
        .select("*")
        .eq("project_id", id)
        .order("created_at", { ascending: false });
      if (error) setNotice("Não foi possível carregar as versões.");
      else setVersions(data || []);
    } else setVersions([]);
  }, [user, id]);
  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data }) => setUser(data.session?.user || null));
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      if (event === "PASSWORD_RECOVERY") {
        setRecovery(true);
        setLogin(true);
      }
    });
    return () => data.subscription.unsubscribe();
  }, []);
  useEffect(() => {
    void refresh();
  }, [refresh]);
  useEffect(() => {
    if (!user) {
      setProjects([]);
      setVersions([]);
      setBalance(0);
    }
  }, [user]);
  useEffect(() => {
    if (!versions.some((v) => v.status === "pending")) return;
    const timer = setInterval(() => void refresh(), 4000);
    return () => clearInterval(timer);
  }, [versions, refresh]);
  const current =
    versions.find((v) => v.id === selected && v.status === "complete") ||
    versions.find((v) => v.status === "complete");
  const activeProject = projects.find((p) => p.id === id);
  const pending =
    busy ||
    versions.some(
      (v) =>
        v.status === "pending" &&
        Date.now() - new Date(v.created_at).getTime() < 900000,
    );
  async function authenticate(event: React.FormEvent) {
    event.preventDefault();
    setAuthBusy(true);
    setNotice("");
    try {
      if (recovery) {
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
        setRecovery(false);
        setLogin(false);
        setNotice("Senha atualizada.");
      } else if (signup) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${location.origin}/ai` },
        });
        if (error) throw error;
        if (data.session) setLogin(false);
        else setNotice("Confira seu e-mail para confirmar a conta.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        setLogin(false);
      }
      setPassword("");
    } catch (error) {
      setNotice(
        error instanceof Error ? error.message : "Não foi possível entrar.",
      );
    } finally {
      setAuthBusy(false);
    }
  }
  async function signInWithGoogle() {
    setAuthBusy(true);
    setNotice("");
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: `${location.origin}/ai`,
    });
    if (result.error) {
      setNotice(result.error.message || "Não foi possível entrar com o Google.");
      setAuthBusy(false);
      return;
    }
    if (!result.redirected) {
      setLogin(false);
      setAuthBusy(false);
    }
  }
  async function generate() {
    if (!user) {
      setLogin(true);
      return;
    }
    if (prompt.trim().length < 10) {
      setNotice(
        "Conte um pouco mais sobre seu projeto (mínimo de 10 caracteres).",
      );
      return;
    }
    setBusy(true);
    setNotice("");
    try {
      let projectId = id;
      if (!projectId) {
        const { data, error } = await builderDb
          .from("builder_projects")
          .insert({ user_id: user.id, kind, title: prompt.slice(0, 60) })
          .select()
          .single();
        if (error)
          throw new Error("O banco da WH Studio AI ainda precisa ser ativado.");
        projectId = data.id;
        navigate(`/ai/projetos/${projectId}`);
      }
      const response = await builderRequest({
        projectId,
        requestId: crypto.randomUUID(),
        prompt,
      });
      if (response.generation?.status === "error")
        throw new Error(response.generation.error || "A geração falhou.");
      if (response.generation) {
        setVersions((v) => [
          response.generation!,
          ...v.filter((x) => x.id !== response.generation!.id),
        ]);
        setSelected(response.generation.id);
      }
      setPrompt("");
      const { data: wallet } = await builderDb
        .from("builder_wallets")
        .select("balance")
        .eq("user_id", user.id)
        .maybeSingle();
      setBalance(wallet?.balance || 0);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "A geração falhou.");
    } finally {
      setBusy(false);
    }
  }
  async function purchase() {
    if (!user) {
      setLogin(true);
      return;
    }
    setBusy(true);
    try {
      const result = await builderRequest({ action: "checkout" });
      if (result.url && new URL(result.url).hostname === "checkout.stripe.com")
        location.assign(result.url);
      else throw new Error("Checkout indisponível.");
    } catch (error) {
      setNotice(
        error instanceof Error ? error.message : "Compra indisponível.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="min-h-screen bg-[#0b0d12] text-slate-100">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
        <Link to="/" className="font-display text-xl font-bold tracking-tight">
          WH<span className="text-blue-400">.</span>{" "}
          <span className="text-sm font-normal text-slate-400">
            STUDIO AI / BETA
          </span>
        </Link>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className="text-slate-400">{balance} créditos</span>
          <Button variant="outline" onClick={purchase} disabled={busy}>
            Comprar créditos
          </Button>
          <Button
            variant="ghost"
            onClick={() => (user ? supabase.auth.signOut() : setLogin(true))}
          >
            {user ? "Sair" : "Entrar"}
          </Button>
        </div>
      </header>
      {notice && (
        <div
          role="status"
          className="flex justify-between gap-4 border-b border-blue-500/30 bg-blue-500/10 p-4 text-sm"
        >
          {notice}
          <button aria-label="Fechar aviso" onClick={() => setNotice("")}>
            <X size={16} />
          </button>
        </div>
      )}
      {new URLSearchParams(location.search).get("checkout") === "success" && (
        <p className="px-5 py-3 text-sm text-blue-300">
          Pagamento recebido pelo checkout. Os créditos aparecem após a
          confirmação do provedor.{" "}
          <button className="underline" onClick={() => void refresh()}>
            Atualizar saldo
          </button>
        </p>
      )}
      <main className="grid min-h-[calc(100vh-81px)] lg:grid-cols-[370px_1fr]">
        <aside className="flex flex-col border-r border-white/10 p-5">
          <div className="flex items-center justify-between">
            <h1 className="font-display text-2xl">
              Da ideia à primeira versão.
            </h1>
            <Button
              size="icon"
              variant="ghost"
              aria-label="Novo projeto"
              onClick={() => {
                navigate("/ai");
                setSelected("");
                setPrompt("");
              }}
            >
              <Plus />
            </Button>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            Descreva seu site ou sistema. Veja o resultado, peça mudanças e
            baixe o código.
          </p>
          {!id && (
            <div className="my-5 flex gap-2">
              {(["site", "system"] as const).map((k) => (
                <Button
                  key={k}
                  variant={kind === k ? "default" : "outline"}
                  onClick={() => setKind(k)}
                >
                  {k === "site" ? "Site" : "Sistema"}
                </Button>
              ))}
            </div>
          )}
          {projects.length > 0 && (
            <label className="my-4 text-xs text-slate-400">
              Seus projetos
              <select
                aria-label="Escolher projeto"
                value={id || ""}
                onChange={(e) =>
                  navigate(
                    e.target.value ? `/ai/projetos/${e.target.value}` : "/ai",
                  )
                }
                className="mt-2 w-full rounded border border-white/10 bg-[#151923] p-2 text-sm text-white"
              >
                <option value="">Novo projeto</option>
                {projects.map((p) => (
                  <option value={p.id} key={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </label>
          )}
          <div className="max-h-[340px] flex-1 space-y-3 overflow-y-auto py-4">
            {versions.length
              ? [...versions].reverse().map((v) => (
                  <div
                    className="rounded-xl border border-white/10 p-3 text-sm"
                    key={v.id}
                  >
                    <p className="text-slate-300">{v.prompt}</p>
                    <p className="mt-2 text-xs text-blue-300">
                      {v.status === "pending"
                        ? "Criando…"
                        : v.status === "error"
                          ? v.error
                          : v.artifact?.summary}
                    </p>
                    {v.status === "complete" && (
                      <button
                        className="mt-2 text-xs underline"
                        onClick={() => setSelected(v.id)}
                      >
                        Ver esta versão
                      </button>
                    )}
                  </div>
                ))
              : suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setPrompt(s);
                      setKind(
                        s.includes("sistema") || s.includes("painel")
                          ? "system"
                          : "site",
                      );
                    }}
                    className="block w-full rounded-xl border border-white/10 p-3 text-left text-sm text-slate-300 transition hover:border-blue-400/50"
                  >
                    {s} <span className="text-blue-400">↗</span>
                  </button>
                ))}
          </div>
          <div className="mt-5 rounded-xl border border-white/15 bg-white/[.03] p-3">
            <Textarea
              aria-label="Descreva seu projeto"
              placeholder={
                current
                  ? "O que vamos melhorar nesta versão?"
                  : "Ex.: sistema de estoque com produtos, filtros e alerta de quantidade…"
              }
              value={prompt}
              maxLength={6000}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[110px] resize-none border-0 bg-transparent shadow-none focus-visible:ring-0"
            />
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>{prompt.length}/6000 · 1 crédito por versão</span>
              <Button
                size="icon"
                aria-label="Gerar projeto"
                disabled={pending}
                onClick={generate}
              >
                {pending ? <Loader2 className="animate-spin" /> : <ArrowUp />}
              </Button>
            </div>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-slate-500">
            Projeto React + TypeScript com arquivos separados. Sistemas podem
            usar banco e login reais pelo Supabase conectado. Sua descrição e
            código são enviados ao provedor de IA e salvos na sua conta; evite
            dados sensíveis.
          </p>
          <a
            href={whatsappLink(
              `Olá! Quero contratar a WH Studio para desenvolver meu projeto: ${projects.find((p) => p.id === id)?.title || prompt}. ${current?.artifact?.backend_requirements.join("; ") || ""}`,
            )}
            target="_blank"
            rel="noreferrer"
            className="mt-5 border-t border-white/10 pt-4 text-sm text-blue-300"
          >
            Precisa de um projeto completo? Contrate a WH Studio ↗
          </a>
        </aside>
        <section className="min-w-0 p-4 lg:p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant={!code && !backend ? "default" : "ghost"}
                onClick={() => {
                  setCode(false);
                  setBackend(false);
                }}
              >
                Prévia
              </Button>
              <Button
                size="sm"
                variant={code ? "default" : "ghost"}
                onClick={() => {
                  setCode(true);
                  setBackend(false);
                }}
              >
                <Code2 size={15} className="mr-2" />
                Arquivos
              </Button>
              <Button
                size="sm"
                variant={backend ? "default" : "ghost"}
                onClick={() => {
                  setBackend(true);
                  setCode(false);
                }}
              >
                Backend
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                size="icon"
                variant={!mobile ? "secondary" : "ghost"}
                aria-label="Prévia computador"
                onClick={() => setMobile(false)}
              >
                <Monitor size={17} />
              </Button>
              <Button
                size="icon"
                variant={mobile ? "secondary" : "ghost"}
                aria-label="Prévia celular"
                onClick={() => setMobile(true)}
              >
                <Smartphone size={17} />
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={!current?.artifact?.files}
                onClick={() =>
                  current?.artifact &&
                  downloadProject(current.artifact, activeProject)
                }
              >
                <Download size={15} className="mr-2" />
                Baixar projeto
              </Button>
            </div>
          </div>
          <div className="grid min-h-[650px] place-items-center overflow-hidden rounded-2xl border border-white/10 bg-[#11151d]">
            {current?.artifact?.files ? (
              backend ? (
                <BuilderBackend
                  project={activeProject}
                  artifact={current.artifact}
                  onSaved={() => void refresh()}
                />
              ) : code ? (
                <BuilderFiles artifact={current.artifact} />
              ) : (
                <Suspense fallback={<Loader2 className="animate-spin" />}>
                  <BuilderPreview
                    artifact={current.artifact}
                    project={activeProject}
                    mobile={mobile}
                  />
                </Suspense>
              )
            ) : (
              <div className="max-w-md p-8 text-center">
                <Sparkles className="mx-auto mb-8 text-blue-400" size={40} />
                <h2 className="font-display text-4xl leading-tight">
                  O próximo projeto
                  <br />
                  começa com você.
                </h2>
                <p className="mt-5 leading-relaxed text-slate-400">
                  Crie sites e sistemas em React, com páginas, componentes e
                  código organizado. Conecte o backend para usar autenticação e
                  dados persistentes.
                </p>
                <p className="mt-6 text-xs text-slate-500">
                  Geração real depende da ativação do serviço. Nenhum resultado
                  é simulado.
                </p>
              </div>
            )}
          </div>
          {current?.artifact?.backend_requirements.length > 0 && (
            <div className="mt-4 rounded-xl border border-amber-400/20 p-4 text-sm text-amber-200">
              <p className="mb-2 font-medium">Para colocar em produção</p>
              <ul className="list-inside list-disc">
                {current.artifact.backend_requirements.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          )}
        </section>
      </main>
      {login && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-black/80 p-4">
          <form
            onSubmit={authenticate}
            className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#11151d] p-7"
          >
            <button
              type="button"
              aria-label="Fechar login"
              onClick={() => setLogin(false)}
              className="absolute right-4 top-4"
            >
              <X size={18} />
            </button>
            <h2 className="font-display text-2xl">
              {recovery
                ? "Nova senha"
                : signup
                  ? "Sua conta WH Studio AI"
                  : "Entre para criar"}
            </h2>
            <p className="my-4 text-sm text-slate-400">
              Projetos e versões ficam vinculados à sua conta.
            </p>
            {!recovery && (
              <label className="mb-4 block text-sm">
                E-mail
                <Input
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2"
                />
              </label>
            )}
            <label className="mb-5 block text-sm">
              Senha
              <Input
                type="password"
                autoComplete={
                  signup || recovery ? "new-password" : "current-password"
                }
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2"
              />
            </label>
            <Button className="w-full" disabled={authBusy}>
              {authBusy
                ? "Aguarde…"
                : recovery
                  ? "Salvar senha"
                  : signup
                    ? "Criar conta"
                    : "Entrar"}
            </Button>
            {notice && (
              <p role="status" className="mt-3 text-sm text-blue-300">
                {notice}
              </p>
            )}
            {!recovery && (
              <>
                <button
                  type="button"
                  className="mt-5 block text-sm text-blue-300"
                  onClick={() => setSignup(!signup)}
                >
                  {signup ? "Já tenho uma conta" : "Criar uma conta"}
                </button>
                <button
                  type="button"
                  className="mt-3 text-xs text-slate-400"
                  onClick={async () => {
                    if (!email) {
                      setNotice("Informe seu e-mail primeiro.");
                      return;
                    }
                    const { error } = await supabase.auth.resetPasswordForEmail(
                      email,
                      { redirectTo: `${location.origin}/ai` },
                    );
                    setNotice(
                      error
                        ? error.message
                        : "Confira seu e-mail para redefinir a senha.",
                    );
                  }}
                >
                  Esqueci minha senha
                </button>
              </>
            )}
          </form>
        </div>
      )}
    </div>
  );
}
