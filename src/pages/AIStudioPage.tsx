import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Code2,
  Coins,
  ChevronDown,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { whatsappLink } from "@/config/site";

const suggestions = [
  {
    title: "Site para cafeteria",
    detail: "Cardápio, localização e contato",
    prompt: "Crie um site responsivo para uma cafeteria, com cardápio, endereço, horário de funcionamento e botão de contato.",
    kind: "site" as const,
  },
  {
    title: "Gestão de tarefas",
    detail: "Cadastro, filtros e status",
    prompt: "Crie um sistema de tarefas com cadastro, responsáveis, filtros por status e uma tela de acompanhamento.",
    kind: "system" as const,
  },
  {
    title: "Controle de estoque",
    detail: "Produtos, quantidades e alertas",
    prompt: "Crie um painel de estoque com cadastro de produtos, busca, quantidade disponível e alertas de reposição.",
    kind: "system" as const,
  },
];
const dateLabel = (value: string) =>
  new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
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
    [walletLoading, setWalletLoading] = useState(true),
    [walletAvailable, setWalletAvailable] = useState(false),
    [busy, setBusy] = useState(false),
    [notice, setNotice] = useState(""),
    [mobile, setMobile] = useState(false),
    [code, setCode] = useState(false);
  const [backend, setBackend] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [login, setLogin] = useState(false),
    [signup, setSignup] = useState(false),
    [email, setEmail] = useState(""),
    [password, setPassword] = useState(""),
    [authBusy, setAuthBusy] = useState(false),
    [recovery, setRecovery] = useState(false);
  const walletOwner = useRef<string | null>(null);
  const refresh = useCallback(async () => {
    if (!user) {
      walletOwner.current = null;
      setWalletAvailable(false);
      setWalletLoading(false);
      return;
    }
    const firstLoadForUser = walletOwner.current !== user.id;
    if (firstLoadForUser) {
      setWalletAvailable(false);
      setWalletLoading(true);
    }
    try {
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
        setWalletAvailable(false);
        setNotice("O serviço ainda precisa da instalação do banco da WH Studio AI.");
        return;
      }
      if (w.error) {
        setWalletAvailable(false);
        setNotice("Não foi possível consultar seu saldo de créditos.");
        return;
      }
      setProjects(p.data || []);
      setBalance(w.data?.balance || 0);
      walletOwner.current = user.id;
      setWalletAvailable(true);
      if (id) {
        const { data, error } = await builderDb
          .from("builder_generations")
          .select("*")
          .eq("project_id", id)
          .order("created_at", { ascending: false });
        if (error) setNotice("Não foi possível carregar as versões.");
        else setVersions(data || []);
      } else setVersions([]);
    } catch {
      setWalletAvailable(false);
      setNotice("Não foi possível carregar seus projetos agora. Tente novamente.");
    } finally {
      if (firstLoadForUser) setWalletLoading(false);
    }
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
      setWalletAvailable(false);
      setWalletLoading(false);
    }
  }, [user]);
  useEffect(() => {
    setSelected("");
    setPreviewError(null);
    setCode(false);
    setBackend(false);
  }, [id]);
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
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: `${location.origin}/ai`,
      });
      if (result.error) {
        setNotice(result.error.message || "Não foi possível entrar com o Google.");
      } else if (!result.redirected) {
        setLogin(false);
      }
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Não foi possível entrar com o Google.");
    } finally {
      setAuthBusy(false);
    }
  }
  async function generate(override?: string) {
    const text = override ?? prompt;
    if (!user) {
      setLogin(true);
      return;
    }
    if (text.trim().length < 10) {
      setNotice(
        "Conte um pouco mais sobre seu projeto (mínimo de 10 caracteres).",
      );
      return;
    }
    if (!walletAvailable) {
      setNotice("Não foi possível consultar seu saldo. Atualize a página e tente novamente.");
      return;
    }
    if (balance < 1) {
      setNotice("Você está sem créditos. Escolha um pacote no topo para continuar.");
      return;
    }
    setBusy(true);
    setNotice("");
    try {
      let projectId = id;
      if (!projectId) {
        const { data, error } = await builderDb
          .from("builder_projects")
          .insert({ user_id: user.id, kind, title: text.slice(0, 60) })
          .select()
          .single();
        if (error)
          throw new Error("O banco da WH Studio AI ainda precisa ser ativado.");
        projectId = data.id;
        setProjects((items) => [data, ...items.filter((project) => project.id !== data.id)]);
        navigate(`/ai/projetos/${projectId}`);
      }
      const response = await builderRequest({
        projectId,
        requestId: crypto.randomUUID(),
        prompt: text,
        ...(current ? { baseGenerationId: current.id } : {}),
      });
      if (response.generation?.status === "error")
        throw new Error(response.generation.error || "A geração falhou.");
      if (response.generation) {
        const generatedTitle = response.generation.artifact?.title;
        if (generatedTitle) {
          setProjects((items) => items.map((project) =>
            project.id === projectId ? { ...project, title: generatedTitle } : project,
          ));
        }
        setVersions((v) => [
          response.generation!,
          ...v.filter((x) => x.id !== response.generation!.id),
        ]);
        setSelected(response.generation.id);
        setPreviewError(null);
      }
      setPrompt("");
      const { data: wallet, error: walletError } = await builderDb
        .from("builder_wallets")
        .select("balance")
        .eq("user_id", user.id)
        .maybeSingle();
      if (walletError) {
        setWalletAvailable(false);
        setNotice("Versão criada, mas não foi possível atualizar seu saldo. Atualize para conferir.");
      } else {
        setBalance(wallet?.balance || 0);
        setWalletAvailable(true);
      }
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "A geração falhou.");
      void refresh();
    } finally {
      setBusy(false);
    }
  }
  async function saveFiles(artifact: NonNullable<Generation["artifact"]>) {
    if (!id) return;
    const response = await builderRequest({ action: "save", projectId: id, artifact });
    if (response.generation?.status === "error") {
      throw new Error(response.generation.error || "Não foi possível salvar esta versão.");
    }
    if (!response.generation) throw new Error("O servidor não confirmou o salvamento.");
    if (response.generation) {
      setVersions((v) => [response.generation!, ...v]);
      setSelected(response.generation.id);
      setPreviewError(null);
    }
  }
  function fixWithAI() {
    if (!previewError) return;
    if (
      !window.confirm(
        `Corrigir com a IA gasta 1 crédito (saldo atual: ${balance}). Se a correção falhar, o crédito volta. Continuar?`,
      )
    )
      return;
    void generate(
      `Corrija este erro de compilação/execução da prévia sem mudar o restante do projeto:\n${previewError.slice(0, 3000)}`,
    );
  }
  function hireStudio() {
    const lines = [
      "Olá! Quero contratar a WH Studio para continuar este projeto criado na WH Studio AI.",
      `Projeto: ${activeProject?.title || prompt || "novo projeto"}`,
      `Tipo: ${activeProject?.kind === "system" ? "Sistema" : "Site"}`,
      current?.artifact?.summary ? `Resumo: ${current.artifact.summary}` : "",
      current?.artifact ? `Arquivos: ${current.artifact.files.length}` : "",
      current?.artifact?.backend_requirements.length
        ? `Pendências: ${current.artifact.backend_requirements.join("; ")}`
        : "",
      id ? `Referência: ${id}` : "",
    ].filter(Boolean);
    window.open(whatsappLink(lines.join("\n").slice(0, 1500)), "_blank", "noopener");
  }
  async function purchase(pack: string) {
    if (!pack) return;
    if (!user) {
      setLogin(true);
      return;
    }
    setBusy(true);
    try {
      const result = await builderRequest({ action: "checkout", package: pack });
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
      <header className="sticky top-0 z-40 flex min-h-[68px] flex-wrap items-center justify-between gap-3 border-b border-white/[.08] bg-[#0b0d12]/95 px-4 py-3 backdrop-blur-xl sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <Link to="/" className="font-display text-xl font-bold tracking-tight">
            WH<span className="text-blue-400">/</span><span className="text-base font-medium text-slate-300">studio</span>
          </Link>
          <span className="h-5 w-px bg-white/10" aria-hidden="true" />
          <span className="text-sm font-medium text-slate-200">AI Studio</span>
          <span className="hidden rounded-full border border-blue-400/20 bg-blue-400/[.08] px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-blue-200 sm:inline-flex">Beta</span>
        </div>
        <div className="flex min-w-0 flex-wrap items-center justify-end gap-2 text-sm sm:gap-3">
          <span className="rounded-full border border-white/10 bg-white/[.04] px-3 py-2 text-xs text-slate-300" aria-live="polite">
            {!user ? "Entre para salvar" : walletLoading && !walletAvailable ? "Carregando saldo…" : walletAvailable ? `${balance} créditos` : "Saldo indisponível"}
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" disabled={busy} className="h-10 gap-2 rounded-xl border-white/10 bg-[#11151d] px-3 text-xs text-slate-200 hover:bg-white/[.06] sm:text-sm">
                <Coins className="h-4 w-4 text-blue-300" aria-hidden="true" />
                <span>Créditos</span>
                <ChevronDown className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 rounded-xl border-white/10 bg-[#11151d] p-2 text-slate-100 shadow-2xl">
              <DropdownMenuLabel className="px-3 py-2 text-xs font-normal text-slate-400">1 crédito por versão gerada</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem className="cursor-pointer rounded-lg px-3 py-3 focus:bg-white/[.07]" onSelect={() => void purchase("inicial")}>
                <span>Inicial <span className="ml-1 text-xs text-slate-500">5 créditos</span></span>
                <span className="ml-auto font-medium">R$ 10</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer rounded-lg px-3 py-3 focus:bg-white/[.07]" onSelect={() => void purchase("criador")}>
                <span>Criador <span className="ml-1 text-xs text-slate-500">15 créditos</span></span>
                <span className="ml-auto font-medium">R$ 25</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer rounded-lg px-3 py-3 focus:bg-white/[.07]" onSelect={() => void purchase("pro")}>
                <span>Pro <span className="ml-1 text-xs text-slate-500">40 créditos</span></span>
                <span className="ml-auto font-medium">R$ 59</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="outline"
            className="h-10 rounded-xl border-white/10 px-4"
            onClick={() => (user ? supabase.auth.signOut() : setLogin(true))}
          >
            {user ? "Sair" : "Entrar"}
          </Button>
        </div>
      </header>
      {notice && !login && (
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
      <main className="grid min-h-[calc(100dvh-68px)] grid-cols-1 min-[640px]:grid-cols-[minmax(250px,0.38fr)_minmax(0,0.62fr)] lg:grid-cols-[370px_minmax(0,1fr)]">
        <aside className="flex min-h-[620px] flex-col border-b border-white/[.08] bg-[#0d1017] p-4 sm:p-5 min-[640px]:h-[calc(100dvh-68px)] min-[640px]:min-h-0 min-[640px]:max-h-[calc(100dvh-68px)] min-[640px]:overflow-hidden lg:border-b-0 lg:border-r">
          <div className="flex shrink-0 items-center justify-between gap-3">
            <div>
              <p className="eyebrow mb-1.5 text-blue-300">WH Studio AI <span className="text-slate-600">/</span> novo projeto</p>
              <h1 className="font-display text-[1.65rem] tracking-tight">Vamos criar juntos?</h1>
            </div>
            <Button
              size="icon"
              variant="ghost"
              aria-label="Novo projeto"
              title="Começar um projeto novo"
              className="rounded-xl border border-white/10 bg-white/[.03] hover:bg-white/[.08]"
              onClick={() => {
                navigate("/ai");
                setSelected("");
                setPrompt("");
              }}
            >
              <Plus />
            </Button>
          </div>
          <p className="mt-2 max-w-sm shrink-0 text-[13px] leading-relaxed text-slate-400">
            Descreva o que você precisa. A IA cria a primeira versão e você continua pedindo ajustes por aqui.
          </p>
          {!id && (
            <div className="my-3 flex shrink-0 gap-1.5 rounded-xl border border-white/[.08] bg-[#090c12] p-1" role="group" aria-label="Tipo de projeto">
              {(["site", "system"] as const).map((k) => (
                <Button
                  key={k}
                  variant={kind === k ? "default" : "outline"}
                  aria-pressed={kind === k}
                  className={`h-9 flex-1 rounded-lg ${kind === k ? "shadow-[0_3px_14px_rgba(59,130,246,.22)]" : "border-transparent bg-transparent text-slate-400 hover:bg-white/[.05] hover:text-white"}`}
                  onClick={() => setKind(k)}
                >
                  {k === "site" ? "Site" : "Sistema"}
                </Button>
              ))}
            </div>
          )}
          {projects.length > 0 && (
            <label className="my-1 shrink-0 text-xs text-slate-400">
              Seus projetos
              <select
                aria-label="Escolher projeto"
                value={id || ""}
                onChange={(e) =>
                  navigate(
                    e.target.value ? `/ai/projetos/${e.target.value}` : "/ai",
                  )
                }
                className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-[#151923] px-3 text-sm text-white outline-none transition-colors hover:border-white/20 focus-visible:ring-2 focus-visible:ring-blue-400"
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
          <div className="min-h-0 flex-1 space-y-2 overflow-y-auto py-3 [scrollbar-color:rgba(148,163,184,.25)_transparent] [scrollbar-width:thin]" aria-label="Histórico e sugestões">
            {versions.length ? (
              <>
                <p className="eyebrow sticky top-0 z-10 rounded-lg bg-[#0d1017]/95 px-2 py-2 backdrop-blur">Conversa do projeto</p>
                {[...versions].reverse().map((v) => {
                  const viewing = current?.id === v.id;
                  return (
                    <article
                      className={`rounded-xl border p-3 text-sm ${viewing ? "border-blue-400/40 bg-blue-400/[.06]" : "border-white/10 bg-white/[.015]"}`}
                      key={v.id}
                    >
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500">Você</span>
                        <time className="text-[10px] text-slate-500" dateTime={v.created_at}>{dateLabel(v.created_at)}</time>
                      </div>
                      <p className="break-words text-slate-200">{v.prompt}</p>
                      <div className="mt-3 flex items-center gap-2 border-t border-white/10 pt-3">
                        <Sparkles className="h-3.5 w-3.5 shrink-0 text-blue-300" aria-hidden="true" />
                        <span className="font-mono text-[10px] uppercase tracking-wider text-blue-200">WH Studio AI</span>
                        <span className={`ml-auto text-[10px] ${v.status === "error" ? "text-red-300" : v.status === "pending" ? "text-amber-200" : "text-emerald-300"}`} role="status">
                          {v.status === "pending" ? "Criando…" : v.status === "error" ? "Não concluída" : viewing ? "Versão aberta" : "Concluída"}
                        </span>
                      </div>
                      <p className={`mt-2 break-words text-xs leading-relaxed ${v.status === "error" ? "text-red-200" : "text-slate-400"}`}>
                        {v.status === "pending" ? "A IA está trabalhando nesta versão." : v.status === "error" ? v.error : v.artifact?.summary}
                      </p>
                      {v.status === "complete" && !viewing && (
                        <button
                          className="mt-2 rounded text-xs text-blue-300 underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                          onClick={() => {
                            setSelected(v.id);
                            setPreviewError(null);
                          }}
                        >
                          Abrir esta versão
                        </button>
                      )}
                    </article>
                  );
                })}
              </>
            ) : (
              <>
                <div className="flex items-end justify-between gap-3 px-1 pb-1">
                  <div>
                    <p className="eyebrow">Comece por uma ideia</p>
                    <p className="mt-1 text-[11px] text-slate-500">Você pode editar antes de enviar.</p>
                  </div>
                  <Sparkles className="mb-1 h-4 w-4 text-blue-300" aria-hidden="true" />
                </div>
                {suggestions.map((s) => (
                  <button
                    key={s.title}
                    onClick={() => {
                      setPrompt(s.prompt);
                      setKind(s.kind);
                    }}
                    className="group flex w-full items-center gap-3 rounded-xl border border-white/[.08] bg-white/[.02] px-3 py-2.5 text-left transition-colors hover:border-blue-400/40 hover:bg-blue-400/[.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[.08] bg-white/[.035] text-blue-300"><Sparkles className="h-4 w-4" aria-hidden="true" /></span>
                    <span className="min-w-0 flex-1"><span className="block text-[13px] font-medium text-slate-200">{s.title}</span><span className="mt-0.5 block truncate text-[11px] text-slate-500">{s.detail}</span></span>
                    <Plus className="h-4 w-4 shrink-0 text-slate-600 transition-colors group-hover:text-blue-300" aria-hidden="true" />
                  </button>
                ))}
              </>
            )}
          </div>
          <form
            className="relative z-20 mt-auto shrink-0 rounded-2xl border border-white/[.12] bg-[#11151d] p-3 shadow-[0_12px_35px_rgba(0,0,0,.24)]"
            onSubmit={(event) => {
              event.preventDefault();
              void generate();
            }}
          >
            {user && walletAvailable && balance < 1 && (
              <div role="status" className="mb-2 flex items-center justify-between gap-2 rounded-lg border border-amber-300/20 bg-amber-300/[.06] px-2.5 py-2 text-[11px] text-amber-100">
                <span>Sem créditos disponíveis</span>
                <button type="button" disabled={busy} onClick={() => void purchase("inicial")} className="shrink-0 font-medium text-amber-200 underline underline-offset-2 hover:text-white disabled:opacity-50">Comprar créditos</button>
              </div>
            )}
            <Textarea
              id="ai-project-prompt"
              aria-label="Descreva seu projeto"
              placeholder={
                current
                  ? "Ex.: adicione uma página de preços com três planos…"
                  : kind === "system"
                    ? "Descreva o sistema, os dados que ele precisa guardar e as ações principais…"
                    : "Descreva o site, as seções e o que as pessoas devem fazer nele…"
              }
              value={prompt}
              maxLength={6000}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(event) => {
                if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
                  event.preventDefault();
                  void generate();
                }
              }}
              className="min-h-[82px] max-h-[30dvh] resize-y border-0 bg-transparent px-1 py-2 text-sm leading-relaxed shadow-none placeholder:text-slate-500 focus-visible:ring-0"
            />
            <div className="flex items-center justify-between gap-2 border-t border-white/[.07] pt-2 text-xs text-slate-500">
              <span className="truncate" title="Sua descrição e o código gerado serão enviados ao serviço de IA. Evite incluir dados sensíveis.">{prompt.length}/6000 <span className="px-1 text-slate-700">·</span> 1 crédito · evite dados sensíveis</span>
              <Button
                type="submit"
                size="sm"
                className="h-9 shrink-0 rounded-lg px-3"
                disabled={pending || prompt.trim().length < 10 || (Boolean(user) && !walletAvailable)}
                aria-label={pending ? "Criando versão" : "Enviar solicitação para gerar versão"}
              >
                {pending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Criando</> : <><Sparkles className="mr-1.5 h-4 w-4" />Gerar</>}
              </Button>
            </div>
            <div className="mt-2 flex items-center justify-between gap-2 text-[10px] text-slate-500">
              <button type="button" onClick={hireStudio} className="truncate text-left transition-colors hover:text-blue-300">Prefere um projeto feito com a gente?</button>
              <span className="shrink-0">Ctrl + Enter</span>
            </div>
          </form>
        </aside>
        <section className="min-w-0 p-4 lg:p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant={!code && !backend ? "default" : "ghost"}
                aria-pressed={!code && !backend}
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
                aria-pressed={code}
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
                aria-pressed={backend}
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
                aria-pressed={!mobile}
                onClick={() => setMobile(false)}
              >
                <Monitor size={17} />
              </Button>
              <Button
                size="icon"
                variant={mobile ? "secondary" : "ghost"}
                aria-label="Prévia celular"
                aria-pressed={mobile}
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
          {pending && (
            <div className="mb-3 flex items-center gap-3 rounded-xl border border-blue-400/20 bg-blue-400/[.07] px-4 py-3 text-sm text-blue-100" role="status">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              <span>Preparando sua versão. Você pode acompanhar o progresso no histórico.</span>
            </div>
          )}
          <div className="grid min-h-[420px] place-items-center overflow-hidden rounded-2xl border border-white/10 bg-[#11151d] sm:min-h-[650px]">
            {current?.artifact?.files ? (
              backend ? (
                <BuilderBackend
                  project={activeProject}
                  artifact={current.artifact}
                  onSaved={() => void refresh()}
                />
              ) : code ? (
                <BuilderFiles artifact={current.artifact} onSave={saveFiles} />
              ) : (
                <Suspense fallback={<Loader2 className="animate-spin" />}>
                  <BuilderPreview
                    artifact={current.artifact}
                    project={activeProject}
                    mobile={mobile}
                    onError={setPreviewError}
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
                  {!user ? (
                    <Button className="mt-6" onClick={() => setLogin(true)}>Entrar para começar</Button>
                  ) : !current ? (
                    <p className="mt-6 text-xs text-slate-500">Escreva sua ideia à esquerda para gerar uma prévia real. Nenhum resultado é simulado.</p>
                  ) : null}
              </div>
            )}
          </div>
          {previewError && current && !code && !backend && (
            <div role="alert" className="mt-4 rounded-xl border border-red-400/30 p-4 text-sm text-red-200">
              <p className="mb-2 font-medium">A prévia encontrou um erro</p>
              <pre className="max-h-40 overflow-auto whitespace-pre-wrap font-mono text-xs">{previewError}</pre>
              <Button size="sm" className="mt-3" disabled={pending || (Boolean(user) && (!walletAvailable || balance < 1))} onClick={fixWithAI}>
                Corrigir com IA (1 crédito)
              </Button>
            </div>
          )}
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
        <Dialog open={login} onOpenChange={setLogin}>
          <DialogContent closeLabel="Fechar janela" className="max-h-[90dvh] max-w-md overflow-y-auto border-white/10 bg-[#11151d] p-7 text-slate-100 sm:rounded-2xl">
            <form onSubmit={authenticate} className="space-y-1">
              <DialogTitle className="pr-8 font-display text-2xl text-slate-100">
                {recovery
                  ? "Nova senha"
                  : signup
                    ? "Sua conta WH Studio AI"
                    : "Entre para criar"}
              </DialogTitle>
              <DialogDescription className="my-4 text-sm text-slate-400">
                Projetos e versões ficam vinculados à sua conta.
              </DialogDescription>
            {!recovery && (
              <>
                <Button
                  type="button"
                  variant="outline"
                  className="mb-5 w-full"
                  disabled={authBusy}
                  onClick={signInWithGoogle}
                >
                  <svg viewBox="0 0 24 24" className="mr-2 h-4 w-4" aria-hidden="true">
                    <path
                      fill="currentColor"
                      d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81Z"
                    />
                  </svg>
                  Continuar com Google
                </Button>
                <div className="mb-5 flex items-center gap-3 text-xs text-slate-500">
                  <span className="h-px flex-1 bg-white/10" />
                  ou com e-mail
                  <span className="h-px flex-1 bg-white/10" />
                </div>
              </>
            )}
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
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
