import BrandLogo from "@/components/BrandLogo";
import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowUp, ArrowUpRight, Check, ChevronDown, Code2, Coins, Database, Download, Globe2, History, Loader2, MessageSquare, Monitor, MoreHorizontal, Pencil, Plus, RefreshCw, Smartphone, Sparkles, Trash2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { builderDb, builderRequest, downloadProject, type Artifact, type Generation, type Project } from "@/lib/builder";
import { canGenerate, CREDIT_PACKAGES } from "../../supabase/functions/_shared/builder-rules";
import BuilderAccess from "@/components/BuilderAccess";
import BuilderFiles from "@/components/BuilderFiles";
import BuilderBackend from "@/components/BuilderBackend";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { whatsappLink } from "@/config/site";

const BuilderPreview = lazy(() => import("@/components/BuilderPreview"));
const suggestions = [
  { title: "Site para cafeteria", detail: "Cardápio e contato", kind: "site" as const, prompt: "Crie um site responsivo para uma cafeteria com cardápio, endereço, horário de funcionamento e contato. Indique os dados que preciso fornecer, sem inventar informações reais." },
  { title: "Gestão de tarefas", detail: "Equipe e acompanhamento", kind: "system" as const, prompt: "Crie um sistema de gestão de tarefas com login, cadastro, responsáveis, filtros por status e acompanhamento. Use banco real e políticas para cada usuário acessar apenas seus dados." },
  { title: "Controle de estoque", detail: "Produtos e quantidades", kind: "system" as const, prompt: "Crie um sistema de controle de estoque com login, cadastro de produtos, busca, quantidades e alertas de reposição. Use persistência real e acesso protegido por usuário." },
];
const dateLabel = (value: string) => new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(value));
type Transaction = { id: string; kind: string; delta: number; balance_after: number; created_at: string };
export default function AIStudioPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [versions, setVersions] = useState<Generation[]>([]);
  const [selected, setSelected] = useState("");
  const [prompt, setPrompt] = useState("");
  const [kind, setKind] = useState<"site" | "system">("site");
  const [balance, setBalance] = useState(0);
  const [walletAvailable, setWalletAvailable] = useState(false);
  const [walletLoading, setWalletLoading] = useState(false);
  const [paymentsAvailable, setPaymentsAvailable] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [mobile, setMobile] = useState(false);
  const [tab, setTab] = useState<"preview" | "files" | "backend">("preview");
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [previewKey, setPreviewKey] = useState(0);
  const [login, setLogin] = useState(false);
  const [conversationOpen, setConversationOpen] = useState(false);
  const [creditsOpen, setCreditsOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [renameOpen, setRenameOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [publishOpen, setPublishOpen] = useState(false);
  const [fixOpen, setFixOpen] = useState(false);
  const [operationBusy, setOperationBusy] = useState(false);
  const submitting = useRef(false);
  const requestRef = useRef<{ id: string; prompt: string; projectId: string } | null>(null);
  const latestUser = useRef<string | null>(null);
  const current = versions.find(v => v.id === selected && v.status === "complete") || versions.find(v => v.status === "complete");
  const activeProject = projects.find(p => p.id === id);
  const pending = busy || versions.some(v => v.status === "pending");
  const refresh = useCallback(async () => {
    if (!user) return;
    try {
      const [p, v, w] = await Promise.all([
        builderDb.from("builder_projects").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
        id ? builderDb.from("builder_generations").select("*").eq("project_id", id).eq("user_id", user.id).order("created_at", { ascending: false }) : Promise.resolve({ data: [], error: null }),
        builderDb.from("builder_wallets").select("balance").eq("user_id", user.id).maybeSingle(),
      ]);
      if (latestUser.current !== user.id) return;
      if (p.error || v.error || w.error) throw new Error("Impossible de carregar");
      setProjects(p.data || []); setVersions(v.data || []); setBalance(w.data?.balance || 0); setWalletAvailable(Boolean(w.data));
      if (id && !p.data?.some(project => project.id === id)) setNotice("Este projeto não está disponível para sua conta.");
    } catch { setNotice("Não foi possível carregar seus projetos e créditos. Tente atualizar."); }
  }, [user, id]);
  const syncWallet = useCallback(async () => {
    if (!user) return;
    setWalletLoading(true);
    try {
      const status = await builderRequest({ action: "status" });
      if (latestUser.current !== user.id) return;
      setBalance(status.balance || 0); setWalletAvailable(true); setPaymentsAvailable(Boolean(status.paymentsAvailable));
      await refresh();
    } catch (error) { setWalletAvailable(false); setNotice(error instanceof Error ? error.message : "Não foi possível conferir o saldo."); }
    finally { setWalletLoading(false); }
  }, [user, refresh]);
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      latestUser.current = session?.user.id || null;
      setUser(session?.user || null);
      if (session?.user) setLogin(false);
      if (event === "SIGNED_OUT") { setProjects([]); setVersions([]); setBalance(0); setWalletAvailable(false); requestRef.current = null; }
    });
    void supabase.auth.getUser().then(({ data }) => { latestUser.current = data.user?.id || null; setUser(data.user); });
    return () => data.subscription.unsubscribe();
  }, []);
  useEffect(() => { void syncWallet(); }, [syncWallet]);
  useEffect(() => { setVersions([]); setSelected(""); setPreviewError(null); setTab("preview"); }, [id]);
  useEffect(() => {
    if (!user) return;
    const timer = setInterval(() => {
      if (document.visibilityState === "visible") {
        if (versions.some(v => v.status === "pending" && Date.now() - new Date(v.created_at).getTime() > 900000)) void syncWallet();
        else void refresh();
      }
    }, pending ? 4000 : 20000);
    const focus = () => void syncWallet();
    window.addEventListener("focus", focus);
    return () => { clearInterval(timer); window.removeEventListener("focus", focus); };
  }, [user, pending, refresh, syncWallet, versions]);
  useEffect(() => {
    if (!creditsOpen || !user) return;
    setTransactions([]);
    void supabase.from("builder_wallet_transactions").select("id,kind,delta,balance_after,created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(30).then(({ data, error }) => {
      if (error) setNotice("Não foi possível consultar as movimentações."); else setTransactions(data || []);
    });
  }, [creditsOpen, user, balance]);
  function chooseSuggestion(suggestion: typeof suggestions[number]) {
    setPrompt(suggestion.prompt); setKind(suggestion.kind); setConversationOpen(false);
    requestAnimationFrame(() => document.getElementById("builder-prompt")?.focus());
  }
  async function generate(override?: string) {
    const text = override || prompt;
    if (!user) { setLogin(true); return; }
    if (submitting.current || !canGenerate(text, pending, true, walletAvailable, balance)) return;
    submitting.current = true; setBusy(true); setNotice("");
    let projectId = id;
    try {
      const { data: identity } = await supabase.auth.getUser();
      if (!identity.user) { setLogin(true); throw new Error("Sua sessão expirou. Entre novamente."); }
      if (!projectId) {
        const { data, error } = await builderDb.from("builder_projects").insert({ user_id: identity.user.id, kind, title: text.trim().slice(0, 60) }).select().single();
        if (error || !data) throw new Error("Não foi possível criar o projeto.");
        projectId = data.id; setProjects(items => [data, ...items]); navigate(`/ai/projetos/${data.id}`);
      }
      const previousRequest = requestRef.current;
      const requestId = previousRequest?.projectId === projectId && previousRequest.prompt === text ? previousRequest.id : crypto.randomUUID();
      requestRef.current = { id: requestId, prompt: text, projectId };
      const response = await builderRequest({ projectId, requestId, prompt: text, ...(current ? { baseGenerationId: current.id } : {}) });
      if (!response.generation) throw new Error("A geração não foi confirmada. Atualize o histórico antes de repetir.");
      if (response.generation.status === "error") { requestRef.current = null; throw new Error(response.generation.error || "A geração não foi concluída."); }
      const generation = response.generation;
      setVersions(items => [generation, ...items.filter(item => item.id !== generation.id)]);
      setSelected(generation.id); setPreviewError(null); setPrompt(""); setConversationOpen(false);
      if (generation.status === "complete") requestRef.current = null;
      if (generation.artifact?.title) setProjects(items => items.map(project => project.id === projectId ? { ...project, title: generation.artifact?.title || project.title } : project));
      await syncWallet();
    } catch (error) {
      // Confirmed failures allow a fresh request; ambiguous network errors retain the same id.
      if (projectId) {
        const requestId = requestRef.current?.id;
        if (requestId) {
          const { data } = await builderDb.from("builder_generations").select("status").eq("id", requestId).maybeSingle();
          if (data?.status === "error" || data?.status === "complete") requestRef.current = null;
        }
      }
      setNotice(error instanceof Error ? error.message : "Não foi possível gerar esta versão."); void syncWallet();
    } finally { submitting.current = false; setBusy(false); }
  }
  async function saveFiles(artifact: Artifact) {
    if (!id) throw new Error("Selecione um projeto.");
    const response = await builderRequest({ action: "save", projectId: id, artifact });
    if (!response.generation) throw new Error("O salvamento não foi confirmado.");
    const generation = response.generation;
    setVersions(items => [generation, ...items]); setSelected(generation.id); setPreviewError(null);
  }
  function hireStudio(requestId?: string) {
    const lines = ["Olá! Quero solicitar a publicação ou continuação do meu projeto com a WH Studio.", `Projeto: ${activeProject?.title || "Novo projeto"}`, `Tipo: ${activeProject?.kind === "system" ? "Sistema" : "Site"}`, current?.artifact ? `Resumo: ${current.artifact.summary}\nArquivos: ${current.artifact.files.length}\nPendências: ${current.artifact.backend_requirements.join("; ") || "Revisão para publicação"}` : prompt, id ? `Referência do projeto: ${id}` : "", requestId ? `Solicitação: ${requestId}` : ""].filter(Boolean);
    window.open(whatsappLink(lines.join("\n").slice(0, 3500)), "_blank", "noopener,noreferrer");
  }
  async function projectOperation(action: "rename" | "delete" | "publish") {
    if (!id || operationBusy) return;
    setOperationBusy(true);
    try {
      const response = await builderRequest({ action, projectId: id, title, generationId: current?.id });
      if (action === "delete") { navigate("/ai"); setPrompt(""); setDeleteOpen(false); }
      else if (action === "rename") { setProjects(items => items.map(project => project.id === id ? { ...project, title: title.trim() } : project)); setRenameOpen(false); }
      else { setPublishOpen(false); setNotice(`Solicitação registrada: ${response.requestId}. Nenhuma publicação automática foi realizada.`); }
      void refresh();
    } catch (error) { setNotice(error instanceof Error ? error.message : "Não foi possível concluir a ação."); }
    finally { setOperationBusy(false); }
  }
  async function purchase(pack: string) {
    if (!user) { setCreditsOpen(false); setLogin(true); return; }
    if (!paymentsAvailable || operationBusy) return;
    setOperationBusy(true);
    try {
      const result = await builderRequest({ action: "checkout", package: pack });
      if (!result.url || new URL(result.url).hostname !== "checkout.stripe.com") throw new Error("Checkout indisponível.");
      location.assign(result.url);
    } catch (error) { setNotice(error instanceof Error ? error.message : "Compra indisponível."); }
    finally { setOperationBusy(false); }
  }
  function composer(central = false) {
    return <form className={`builder-composer ${central ? "w-full" : "shrink-0"}`} onSubmit={event => { event.preventDefault(); void generate(); }}>
      <Textarea id="builder-prompt" aria-label="Descreva seu projeto" placeholder={current ? "O que vamos ajustar nesta versão?" : "Descreva sua ideia, as páginas e o que as pessoas precisam fazer…"} value={prompt} maxLength={6000} onChange={event => setPrompt(event.target.value)} onKeyDown={event => { if ((event.ctrlKey || event.metaKey) && event.key === "Enter") { event.preventDefault(); void generate(); } }} className={`resize-none border-0 bg-transparent p-3 text-sm shadow-none focus-visible:ring-0 ${central ? "min-h-32" : "min-h-24"}`} />
      <div className="flex items-center justify-between gap-2 px-3 pb-3">
        <span className="text-[11px] text-muted-foreground">{prompt.length}/6000 · 1 crédito</span>
        <Button type="submit" size="sm" disabled={!canGenerate(prompt, pending, Boolean(user), walletAvailable, balance)} aria-label="Gerar versão"><span>{pending ? "Criando" : "Gerar"}</span>{pending ? <Loader2 className="animate-spin"/> : <ArrowUp/>}</Button>
      </div>
      {user && walletAvailable && balance < 1 && <p role="status" className="border-t border-border px-3 py-2 text-xs text-warning">Sem créditos disponíveis.</p>}
      <p className="border-t border-border px-3 py-2 text-[10px] text-muted-foreground">Não envie senhas ou dados sensíveis.</p>
    </form>;
  }
  function sidebar() {
    return <div className="flex h-full min-h-0 flex-col gap-4 p-4">
      <div className="flex items-center justify-between"><span className="text-sm font-medium">Seus projetos</span><Button variant="ghost" size="icon" title="Novo projeto" aria-label="Novo projeto" onClick={() => { navigate("/ai"); setPrompt(""); setConversationOpen(false); }}><Plus/></Button></div>
      {projects.length ? <DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline" className="w-full justify-between"><span className="truncate">{activeProject?.title || "Escolher projeto"}</span><ChevronDown/></Button></DropdownMenuTrigger><DropdownMenuContent className="builder-theme w-64 max-w-[90vw]" align="start">{projects.map(project => <DropdownMenuItem key={project.id} onSelect={() => { navigate(`/ai/projetos/${project.id}`); setConversationOpen(false); }} className="gap-2"><Code2/><span className="truncate">{project.title}</span>{project.id === id && <Check className="ml-auto"/>}</DropdownMenuItem>)}</DropdownMenuContent></DropdownMenu> : <p className="text-xs leading-relaxed text-muted-foreground">{user ? "Seus projetos aparecerão aqui após a primeira solicitação." : "Entre para acessar seus projetos."}</p>}
      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-auto pr-1">
        {versions.length > 0 ? <><p className="flex items-center gap-2 text-[11px] text-muted-foreground"><History size={14}/>Conversa e versões</p>{[...versions].reverse().map((version, index) => <article key={version.id} className={`border-l-2 py-2 pl-3 ${current?.id === version.id ? "border-primary" : "border-border"}`}>
          <div className="mb-2 flex items-center justify-between gap-2 text-[10px] text-muted-foreground"><span>VERSÃO {index+1}</span><time dateTime={version.created_at}>{dateLabel(version.created_at)}</time></div>
          <p className="whitespace-pre-wrap break-words text-xs leading-relaxed">{version.prompt}</p>
          <p role="status" className={`mt-3 flex items-center gap-2 text-[11px] ${version.status === "error" ? "text-destructive" : "text-primary"}`}>{version.status === "pending" ? <Loader2 size={13} className="animate-spin"/> : <Sparkles size={13}/>} {version.status === "pending" ? "Criando" : version.status === "error" ? "Não concluída" : "Concluída"}</p>
          <p className="mt-2 break-words text-xs leading-relaxed text-muted-foreground">{version.status === "error" ? version.error : version.artifact?.summary}</p>
          {version.status === "complete" && <Button variant="link" size="sm" className="mt-1 h-8 p-0 text-xs" onClick={() => { setSelected(version.id); setPreviewError(null); setConversationOpen(false); }}>{current?.id === version.id ? "Versão aberta" : "Abrir versão"}</Button>}
          {version.status === "error" && <Button variant="link" size="sm" className="mt-1 h-8 p-0 text-xs" disabled={pending || balance < 1} onClick={() => { setPrompt(version.prompt); requestRef.current = null; }}>Retomar pedido</Button>}
          {version.status === "pending" && <Button variant="link" size="sm" className="mt-1 h-8 p-0 text-xs" onClick={() => void syncWallet()}>Verificar andamento</Button>}
        </article>)}</> : <div className="mt-3 space-y-2"><p className="mb-3 text-[11px] text-muted-foreground">PONTO DE PARTIDA</p>{suggestions.map(suggestion => <Button variant="ghost" key={suggestion.title} className="h-auto w-full justify-start gap-3 whitespace-normal py-3 text-left" onClick={() => chooseSuggestion(suggestion)}><Plus/><span><span className="block text-xs">{suggestion.title}</span><span className="mt-1 block text-[11px] text-muted-foreground">{suggestion.detail}</span></span></Button>)}</div>}
      </div>
      {id && composer()}
      <Button variant="ghost" size="sm" className="shrink-0 justify-start text-xs text-muted-foreground" onClick={() => hireStudio()}><ArrowUpRight/>Contratar a WH Studio</Button>
    </div>;
  }
  return <div className="builder-theme builder-workspace bg-background text-foreground">
    <Helmet><title>WH Studio AI — Seu projeto por conversa</title><meta name="description" content="Crie sites e sistemas React com a WH Studio AI. Converse, revise arquivos e acompanhe versões dos seus projetos."/></Helmet>
    <header className="builder-header flex flex-wrap items-center justify-between gap-2 border-b border-border px-3 py-3 sm:px-5">
      <div className="flex min-w-0 items-center gap-3"><Link to="/" aria-label="WH Studio, início"><BrandLogo className="h-7 w-24 sm:w-28"/></Link><span className="hidden h-5 w-px bg-border sm:block"/><div className="min-w-0"><p className="text-[10px] text-muted-foreground">WH Studio AI</p><p className="max-w-[150px] truncate text-xs font-medium sm:max-w-64">{activeProject?.title || "Novo projeto"}</p></div>
        {activeProject && <DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon" aria-label="Opções do projeto"><MoreHorizontal/></Button></DropdownMenuTrigger><DropdownMenuContent className="builder-theme"><DropdownMenuItem onSelect={() => { setTitle(activeProject.title); setRenameOpen(true); }}><Pencil className="mr-2"/>Renomear</DropdownMenuItem><DropdownMenuItem disabled={pending} onSelect={() => setDeleteOpen(true)} className="text-destructive"><Trash2 className="mr-2"/>Excluir projeto</DropdownMenuItem></DropdownMenuContent></DropdownMenu>}
      </div>
      <div className="flex items-center gap-1 sm:gap-2">
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Abrir conversa e projetos" title="Conversa e projetos" onClick={() => setConversationOpen(true)}><MessageSquare/></Button>
        <Button variant="outline" size="sm" onClick={() => setCreditsOpen(true)} className="gap-2"><Coins/><span className="hidden sm:inline">Créditos</span><span className="font-mono text-xs" aria-live="polite">{user ? walletLoading ? "…" : walletAvailable ? balance : "—" : "—"}</span></Button>
        <Button size="sm" disabled={!current} onClick={() => setPublishOpen(true)} className="hidden sm:inline-flex"><Globe2/>Publicar</Button>
        <Button variant="ghost" size="sm" onClick={async () => { if (!user) setLogin(true); else { const { error } = await supabase.auth.signOut(); if (error) setNotice("Não foi possível sair. Tente novamente."); } }}>{user ? "Sair" : "Entrar"}</Button>
      </div>
    </header>
    {notice && <div role="status" className="flex items-start justify-between gap-2 border-b border-border bg-accent px-4 py-2 text-xs"><p className="break-words">{notice}</p><Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" aria-label="Fechar aviso" onClick={() => setNotice("")}><X/></Button></div>}
    {new URLSearchParams(location.search).has("checkout") && <div role="status" className="flex flex-wrap items-center gap-2 border-b border-border px-4 py-2 text-xs text-muted-foreground">{new URLSearchParams(location.search).get("checkout") === "success" ? "Pagamento aguardando confirmação segura. Os créditos não são liberados pelo retorno do checkout." : "Compra cancelada. Nenhum crédito foi concedido."}<Button variant="link" size="sm" onClick={() => void syncWallet()}>Atualizar saldo</Button></div>}
    <div className="builder-body grid min-h-0 lg:grid-cols-[300px_minmax(0,1fr)]">
      <aside className="hidden min-h-0 border-r border-border bg-card lg:block">{sidebar()}</aside>
      <main className="flex min-h-0 min-w-0 flex-col overflow-auto">
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-border px-3 py-2 sm:px-4">
          <div className="flex gap-1" role="tablist" aria-label="Áreas do projeto">{([{ value: "preview", label: "Prévia", icon: Monitor }, { value: "files", label: "Arquivos", icon: Code2 }, { value: "backend", label: "Backend", icon: Database }] as const).map(item => <Button key={item.value} role="tab" aria-selected={tab === item.value} variant="ghost" size="sm" className={`px-2 text-xs ${tab === item.value ? "bg-secondary text-foreground" : "text-muted-foreground"}`} onClick={() => setTab(item.value)}><item.icon/><span>{item.label}</span></Button>)}</div>
          <div className="flex items-center gap-1"><Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Prévia computador" title="Computador" aria-pressed={!mobile} onClick={() => setMobile(false)}><Monitor/></Button><Button variant="ghost" size="icon" className={`h-8 w-8 ${mobile ? "bg-accent text-primary" : ""}`} aria-label="Prévia celular" title="Celular" aria-pressed={mobile} onClick={() => setMobile(true)}><Smartphone/></Button><span className="mx-1 h-4 w-px bg-border"/><Button variant="ghost" size="icon" className="h-8 w-8" title="Reiniciar prévia" aria-label="Reiniciar prévia" disabled={!current} onClick={() => { setPreviewKey(key => key+1); setPreviewError(null); }}><RefreshCw/></Button><Button variant="outline" size="sm" className="h-8 px-2 text-xs" aria-label="Baixar projeto" title="Baixar projeto ZIP" disabled={!current?.artifact} onClick={() => { if (!current?.artifact) return; try { downloadProject(current.artifact, activeProject); } catch (error) { setNotice(error instanceof Error ? error.message : "Projeto incompleto para exportação."); } }}><Download/><span className="hidden xl:inline">Baixar projeto</span></Button></div>
        </div>
        {pending && <p role="status" className="flex shrink-0 items-center gap-2 border-b border-border px-4 py-3 text-xs text-primary"><Loader2 className="h-4 w-4 animate-spin"/>Criando a próxima versão. As anteriores continuam disponíveis.</p>}
        {current?.artifact ? <>
          <div role="tabpanel" className={`min-h-0 flex-1 ${tab === "preview" ? "builder-preview-stage" : ""}`}>
            {tab === "files" ? <BuilderFiles artifact={current.artifact} onSave={saveFiles}/> : tab === "backend" ? <BuilderBackend artifact={current.artifact} project={activeProject} onSaved={() => void refresh()}/> : <Suspense fallback={<div className="grid h-full place-items-center"><Loader2 className="animate-spin" aria-label="Carregando prévia"/></div>}><BuilderPreview key={previewKey} artifact={current.artifact} project={activeProject} mobile={mobile} onError={setPreviewError}/></Suspense>}
          </div>
          {previewError && tab === "preview" && <div role="alert" className="shrink-0 border-t border-destructive/40 p-4"><p className="text-sm font-medium text-destructive">A prévia encontrou um erro</p><pre className="mt-2 max-h-24 overflow-auto whitespace-pre-wrap break-words font-mono text-[11px] text-muted-foreground">{previewError}</pre><Button size="sm" className="mt-3" disabled={pending || !walletAvailable || balance < 1} onClick={() => setFixOpen(true)}><Sparkles/>Corrigir com IA (1 crédito)</Button></div>}
          <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-t border-border px-4 py-2 text-[11px] text-muted-foreground"><span>{current.artifact.files.length} arquivos · {dateLabel(current.created_at)}</span><Button variant="link" size="sm" className="h-7 text-xs" onClick={() => setTab("backend")}>{current.artifact.backend_requirements.length ? `${current.artifact.backend_requirements.length} pendências para produção` : "Revisar para publicação"}<ArrowUpRight/></Button><Button size="sm" className="sm:hidden" onClick={() => setPublishOpen(true)}>Publicar</Button></div>
        </> : <div className="flex min-h-0 flex-1 items-center justify-center overflow-auto px-5 py-10 sm:px-10">
          <div className="my-auto w-full max-w-2xl"><p className="mb-5 flex items-center gap-2 text-xs font-medium text-primary"><Sparkles size={16}/>WH STUDIO AI</p><h1 className="text-3xl font-medium leading-tight sm:text-4xl">O que você quer construir?</h1><p className="mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground">Descreva sua ideia e receba um projeto React. Continue a conversa para transformar a primeira versão no que você precisa.</p>
            <div className="my-6 flex gap-1" role="group" aria-label="Tipo de projeto">{(["site", "system"] as const).map(value => <Button key={value} variant={kind === value ? "secondary" : "ghost"} size="sm" aria-pressed={kind === value} onClick={() => setKind(value)}>{value === "site" ? <Globe2/> : <Database/>}{value === "site" ? "Site" : "Sistema"}</Button>)}</div>
            {!id && composer(true)}
            {id && <Button className="lg:hidden" onClick={() => setConversationOpen(true)}><MessageSquare/>Continuar conversa</Button>}
            {!id && <div className="mt-4 flex flex-wrap gap-2">{suggestions.map(suggestion => <Button key={suggestion.title} variant="outline" size="sm" className="h-auto whitespace-normal py-2 text-xs" onClick={() => chooseSuggestion(suggestion)}><Plus/>{suggestion.title}</Button>)}</div>}
            <p className="mt-6 text-[11px] text-muted-foreground">{user ? "Cada geração cria uma versão. Edições manuais não gastam créditos." : "Entre para salvar projetos e acompanhar suas versões."}</p>
          </div>
        </div>}
      </main>
    </div>
    <BuilderAccess open={login} onOpenChange={setLogin}/>
    <Dialog open={conversationOpen} onOpenChange={setConversationOpen}><DialogContent closeLabel="Fechar conversa" className="builder-theme flex h-[90dvh] w-[calc(100%-24px)] max-w-sm flex-col gap-0 p-0"><DialogTitle className="px-4 pt-5 text-base">Conversa e projetos</DialogTitle><DialogDescription className="sr-only">Histórico e solicitações do projeto</DialogDescription><div className="min-h-0 flex-1">{sidebar()}</div></DialogContent></Dialog>
    <Dialog open={creditsOpen} onOpenChange={setCreditsOpen}><DialogContent closeLabel="Fechar créditos" className="builder-theme max-h-[90dvh] w-[calc(100%-24px)] max-w-xl overflow-auto"><DialogTitle>Seus créditos</DialogTitle><DialogDescription>{user && walletAvailable ? `${balance} créditos disponíveis` : "Entre para consultar seu saldo."} · Cada geração utiliza 1 crédito.</DialogDescription>
      {!paymentsAvailable && <p className="border-l-2 border-warning pl-3 text-xs leading-relaxed text-muted-foreground">A compra via Stripe está indisponível enquanto a WH Studio conclui a ativação do pagamento. Nenhuma cobrança será feita aqui.</p>}
      <div className="divide-y divide-border border-y border-border">{Object.entries(CREDIT_PACKAGES).map(([key, pack]) => <div key={key} className="flex items-center justify-between gap-3 py-4"><div><p className="text-sm font-medium">{pack.name}</p><p className="mt-1 text-xs text-muted-foreground">{pack.credits} créditos</p></div><span className="ml-auto text-sm">{new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(pack.amount/100)}</span><Button size="sm" disabled={!paymentsAvailable || operationBusy} onClick={() => void purchase(key)}>Comprar</Button></div>)}</div>
      <Button variant="outline" disabled={!user || walletLoading} onClick={() => void syncWallet()}><RefreshCw/>Atualizar saldo</Button>
      {notice && <p role="status" className="text-xs text-primary">{notice}</p>}
      <h2 className="mt-2 text-sm font-medium">Movimentações recentes</h2>{transactions.length ? <ul className="max-h-52 overflow-auto divide-y divide-border">{transactions.map(transaction => <li key={transaction.id} className="flex items-center justify-between gap-3 py-3 text-xs"><div><p>{{ opening: "Saldo inicial", generation: "Geração", refund: "Crédito devolvido", purchase: "Compra confirmada" }[transaction.kind] || transaction.kind}</p><time className="mt-1 block text-[10px] text-muted-foreground">{dateLabel(transaction.created_at)}</time></div><span className="font-mono">{transaction.delta > 0 ? "+" : ""}{transaction.delta} · saldo {transaction.balance_after}</span></li>)}</ul> : <p className="text-xs text-muted-foreground">Nenhuma movimentação disponível.</p>}
    </DialogContent></Dialog>
    <Dialog open={renameOpen} onOpenChange={setRenameOpen}><DialogContent closeLabel="Fechar renomeação" className="builder-theme w-[calc(100%-24px)] max-w-sm"><DialogTitle>Renomear projeto</DialogTitle><DialogDescription>Atualize o nome deste projeto.</DialogDescription><form className="grid gap-4" onSubmit={event => { event.preventDefault(); void projectOperation("rename"); }}><Input aria-label="Nome do projeto" value={title} maxLength={100} required onChange={event => setTitle(event.target.value)}/><Button disabled={operationBusy || !title.trim()}>Salvar nome</Button></form>{notice && <p role="status" className="text-xs">{notice}</p>}</DialogContent></Dialog>
    <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}><DialogContent closeLabel="Cancelar exclusão" className="builder-theme w-[calc(100%-24px)] max-w-sm"><DialogTitle>Excluir este projeto?</DialogTitle><DialogDescription>O projeto e todas as versões serão removidos. Esta ação não pode ser desfeita.</DialogDescription><Button variant="destructive" disabled={operationBusy || pending} onClick={() => void projectOperation("delete")}><Trash2/>Excluir projeto</Button>{notice && <p role="status" className="text-xs">{notice}</p>}</DialogContent></Dialog>
    <Dialog open={publishOpen} onOpenChange={setPublishOpen}><DialogContent closeLabel="Fechar publicação" className="builder-theme max-h-[90dvh] w-[calc(100%-24px)] max-w-lg overflow-auto"><DialogTitle>Solicitar publicação</DialogTitle><DialogDescription>A WH Studio revisará o projeto antes de publicar. Não há publicação automática.</DialogDescription><p className="text-sm font-medium">{activeProject?.title}</p><p className="text-xs leading-relaxed text-muted-foreground">{current?.artifact?.summary}</p><p className="font-mono text-[10px] break-all text-muted-foreground">Referência: {id}</p>{current?.artifact?.backend_requirements.map(requirement => <p key={requirement} className="border-l-2 border-warning pl-3 text-xs">{requirement}</p>)}<Button disabled={operationBusy} onClick={() => void projectOperation("publish")}><Globe2/>Registrar solicitação</Button><Button variant="outline" onClick={() => hireStudio()}><ArrowUpRight/>Enviar resumo no WhatsApp</Button>{notice && <p role="status" className="text-xs">{notice}</p>}</DialogContent></Dialog>
    <Dialog open={fixOpen} onOpenChange={setFixOpen}><DialogContent closeLabel="Cancelar correção" className="builder-theme w-[calc(100%-24px)] max-w-sm"><DialogTitle>Corrigir com IA?</DialogTitle><DialogDescription>Esta correção utiliza 1 crédito. Saldo atual: {balance}. Se a geração falhar, o crédito será devolvido.</DialogDescription><Button disabled={pending || balance < 1} onClick={() => { setFixOpen(false); void generate(`Corrija o erro abaixo sem alterar o restante do projeto:\n${previewError?.slice(0, 5000)}`); }}><Sparkles/>Confirmar correção</Button></DialogContent></Dialog>
  </div>;
}
