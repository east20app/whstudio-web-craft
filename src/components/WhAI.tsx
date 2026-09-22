import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, ArrowUpRight, Check, RotateCcw } from "lucide-react";
import { services, plans, type Service, type Plan } from "@/config/site";
import { useOrcamentoAction } from "@/components/tickets/TicketChat";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type Msg = { id: string; from: "user" | "ai"; body: string };
type Stage = "servico" | "clarify" | "empresa" | "funcionalidades" | "prazo" | "conteudo" | "orcamento" | "done";

type Briefing = {
  service: Service | null;
  empresa: string | null;
  funcionalidades: string | null;
  prazo: string | null;
  conteudo: string | null;
  orcamento: string | null;
  plan: Plan | null;
  descricao: string;
};

export const EMPRESA_OPTIONS = [
  "Restaurante e delivery",
  "Loja ou e-commerce",
  "Negócio de serviços",
  "Gestão interna (time)",
  "Comunidade e afiliados",
];

export const FUNCIONALIDADES_SUGESTOES = [
  "Cardápio e pedido",
  "Login e painel",
  "Pagamento",
  "Relatórios",
  "Notificação no WhatsApp",
  "Moderação automática",
];

export const ORCAMENTO_OPTIONS = ["Até R$ 1.000", "Até R$ 3.000", "Acima de R$ 3.000", "Prefiro discutir"];

const keywordMap: { id: string; words: string[] }[] = [
  { id: "delivery", words: ["cardapio", "cardápio", "delivery", "pedido", "pizzaria", "hamburgueria", "acai", "açaí", "lanche", "restaurante", "ifood", "mercadinho"] },
  { id: "bots-discord", words: ["discord", "bot", "servidor", "ticket", "moderacao", "moderação", "economia", "rank"] },
  { id: "apis-sistemas", words: ["sistema", "api", "cadastro", "planilha", "financeiro", "estoque", "interno", "crm", "erp", "banco de dados"] },
  { id: "dashboards", words: ["dashboard", "painel", "relatorio", "relatório", "grafico", "gráfico", "metrica", "métrica", "indicador"] },
  { id: "automacao", words: ["automacao", "automação", "automatizar", "integrar", "integracao", "integração", "robo", "robô", "whatsapp automatico", "notificacao", "notificação", "repetitiv"] },
  { id: "criacao-sites", words: ["site", "landing", "pagina", "página", "institucional", "loja", "ecommerce", "e-commerce", "portfolio", "portfólio", "blog"] },
];

const empresaKeywords: { label: string; words: string[] }[] = [
  { label: "Restaurante e delivery", words: ["restaurante", "delivery", "pizzaria", "hamburgueria", "acai", "açaí", "ifood", "lanchonete", "padaria", "bar", "cafeteria", "mercado", "mercadinho", "aliment", "comida"] },
  { label: "Loja ou e-commerce", words: ["loja", "ecommerce", "e-commerce", "comercio", "comércio", "venda", "boutique", "atacado", "varejo", "galeria", "shop"] },
  { label: "Negócio de serviços", words: ["escritorio", "escritório", "advogado", "contador", "consultor", "clinica", "clínica", "barbearia", "salão", "salao", "oficina", "estetica", "estética", "imobiliari", "fotograf", "design", "agencia", "agência", "mecanic", "constru", "engenharia", "professor", "auto"] },
  { label: "Gestão interna (time)", words: ["interno", "time", "equipe", "equipe", "gestao", "gestão", "funcionario", "equipe", "processo", "operacao", "operação", "estoque", "planilha"] },
  { label: "Comunidade e afiliados", words: ["comunidade", "afiliado", "afiliados", "discord", "servidor", "guilda", "clube", "evento", "campeonato", "inscricao", "inscrição", "membros"] },
];

const norm = (s: string) => s.toLowerCase();

const detectService = (text: string): Service | null => {
  const t = norm(text);
  for (const entry of keywordMap) {
    if (entry.words.some((w) => t.includes(w))) {
      return services.find((s) => s.id === entry.id) ?? null;
    }
  }
  return null;
};

const detectEmpresa = (text: string): string | null => {
  const t = norm(text);
  for (const { label, words } of empresaKeywords) {
    if (words.some((w) => t.includes(w))) return label;
  }
  return null;
};

const detectPrazo = (text: string): string => {
  const t = norm(text);
  if (/(urgent|essa semana|hoje|amanh|ontem|corr|rápido|rapido|ja|já)/.test(t)) return "Essa semana";
  if (/(sem pressa|tranquil|calma|qualquer|nao tenho pressa|não tenho pressa)/.test(t)) return "Sem pressa";
  return "Nas próximas semanas";
};

const detectConteudo = (text: string): string => {
  const t = norm(text);
  if (/(parcial|mais ou menos|metade|em parte|algumas|apenas|somente|só o|so o|logo só|logo so)/.test(t)) return "Parcial";
  if (/(nao|não|nada|zero|nenhum)/.test(t)) return "Não";
  return "Sim";
};

const pickPlan = (service: Service | null, prazo: string): Plan => {
  const custom = ["apis-sistemas", "dashboards", "delivery"];
  if (service && custom.includes(service.id)) return plans.find((p) => p.id === "premium")!;
  if (prazo === "Essa semana") return plans.find((p) => p.id === "inicial")!;
  return plans.find((p) => p.id === "profissional")!;
};

const uid = () => Math.random().toString(36).slice(2, 9);

const Typing = () => (
  <div className="flex justify-start" aria-hidden="true">
    <div className="bg-foreground/[0.05] border border-border rounded-none px-4 py-3 flex items-center gap-1.5">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-none bg-muted-foreground"
          animate={{ opacity: [0.25, 1, 0.25], y: [0, -2, 0] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  </div>
);

const Field = ({ children }: { children: React.ReactNode }) => (
  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
    {children}
  </motion.div>
);

const Chip = ({ label, onPick }: { label: string; onPick: () => void }) => (
  <button
    type="button"
    onClick={onPick}
    className="rounded-none border border-border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:border-primary hover:text-foreground transition-colors"
  >
    {label}
  </button>
);

const OPENING =
  "Me conta o que você quer construir — pode escrever com suas palavras, eu monto a base.";

const WhAI = () => {
  const { requestQuote } = useOrcamentoAction();
  const [messages, setMessages] = useState<Msg[]>([{ id: uid(), from: "ai", body: OPENING }]);
  const [typing, setTyping] = useState(false);
  const [draft, setDraft] = useState("");
  const [stage, setStage] = useState<Stage>("servico");
  const [clarifyCount, setClarifyCount] = useState(0);
  const [quick, setQuick] = useState<string[]>([]);
  const [briefing, setBriefing] = useState<Briefing>({
    service: null,
    empresa: null,
    funcionalidades: null,
    prazo: null,
    conteudo: null,
    orcamento: null,
    plan: null,
    descricao: "",
  });
  const bottomRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "nearest" });
  }, [messages, typing, quick]);

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  const pushAI = (body: string, delay = 700) => {
    setTyping(true);
    const t = window.setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [...prev, { id: uid(), from: "ai", body }]);
    }, delay);
    timers.current.push(t);
  };

  const askEmpresa = () => {
    setStage("empresa");
    setQuick(EMPRESA_OPTIONS);
    pushAI("Pra que tipo de empresa ou negócio é esse projeto?");
  };

  const process = (text: string) => {
    if (stage === "servico" || stage === "clarify") {
      const found = detectService(text);
      if (found) {
        setBriefing((b) => ({ ...b, service: found, descricao: b.descricao ? `${b.descricao} ${text}`.trim() : text }));
        askEmpresa();
        return;
      }
      if (stage === "clarify" && clarifyCount >= 1) {
        setBriefing((b) => ({ ...b, descricao: `${b.descricao} ${text}`.trim() }));
        askEmpresa();
        return;
      }
      setBriefing((b) => ({ ...b, descricao: text }));
      setStage("clarify");
      setClarifyCount((c) => c + 1);
      if (clarifyCount === 0) {
        pushAI("Deixa eu entender melhor: isso é mais parecido com um site institucional, uma loja, ou um sistema interno?");
      } else {
        pushAI("Ainda não peguei o tipo. Não tem problema — anotei a descrição. Pra que tipo de negócio é esse projeto? (ex.: delivery, loja, escritório, comunidade)");
      }
      return;
    }

    if (stage === "empresa") {
      const empresa = detectEmpresa(text) ?? text.trim();
      setBriefing((b) => ({ ...b, empresa }));
      setQuick([]);
      setStage("funcionalidades");
      setQuick(FUNCIONALIDADES_SUGESTOES);
      pushAI(`Entendi: ${empresa}. Quais funcionalidades precisam existir? Pode escolher abaixo ou listar por extenso.`);
      return;
    }

    if (stage === "funcionalidades") {
      setBriefing((b) => ({ ...b, funcionalidades: text.trim() }));
      setQuick([]);
      setStage("prazo");
      pushAI("Anotado. E pra quando você precisa disso no ar?");
      return;
    }

    if (stage === "prazo") {
      const prazo = detectPrazo(text);
      setBriefing((b) => ({ ...b, prazo, plan: pickPlan(b.service, prazo) }));
      setStage("conteudo");
      pushAI(`Prazo: ${prazo.toLowerCase()}. Você já tem conteúdo pronto — textos, logo, referências?`);
      return;
    }

    if (stage === "conteudo") {
      const conteudo = detectConteudo(text);
      setBriefing((b) => ({ ...b, conteudo }));
      setStage("orcamento");
      setQuick(ORCAMENTO_OPTIONS);
      pushAI("Beleza. Pra deitar bem o escopo: tem uma faixa de investimento em mente?");
      return;
    }

    if (stage === "orcamento") {
      const orcamento = text.trim() || "Ainda em aberto";
      setBriefing((b) => ({ ...b, orcamento }));
      setQuick([]);
      setStage("done");
      pushAI(
        "Pronto. Montei o briefing aqui do lado com o plano que encaixa melhor. Se estiver certo, manda pra gente — respondo eu mesmo.",
        900,
      );
      return;
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text || typing || stage === "done") return;
    setDraft("");
    setMessages((prev) => [...prev, { id: uid(), from: "user", body: text }]);
    process(text);
  };

  const quickPick = (label: string) => {
    if (typing) return;
    setMessages((prev) => [...prev, { id: uid(), from: "user", body: label }]);
    setQuick([]);
    process(label);
  };

  const reset = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    setTyping(false);
    setMessages([{ id: uid(), from: "ai", body: OPENING }]);
    setDraft("");
    setStage("servico");
    setClarifyCount(0);
    setQuick([]);
    setBriefing({ service: null, empresa: null, funcionalidades: null, prazo: null, conteudo: null, orcamento: null, plan: null, descricao: "" });
  };

  const filled = [briefing.service, briefing.empresa, briefing.funcionalidades, briefing.prazo, briefing.conteudo, briefing.orcamento].filter(Boolean).length;
  const serviceName = briefing.service?.title ?? "Projeto sob medida";
  const Icon = briefing.service?.icon;

  const resumo = [
    "Briefing gerado pela whAI",
    "",
    `Serviço: ${serviceName}`,
    briefing.empresa ? `Tipo de empresa: ${briefing.empresa}` : null,
    briefing.funcionalidades ? `Funcionalidades: ${briefing.funcionalidades}` : null,
    briefing.descricao ? `Nas palavras do cliente: ${briefing.descricao}` : null,
    briefing.prazo ? `Prazo desejado: ${briefing.prazo}` : null,
    briefing.conteudo ? `Conteúdo pronto (textos, logo, referências): ${briefing.conteudo}` : null,
    briefing.orcamento ? `Faixa de investimento: ${briefing.orcamento}` : null,
    briefing.plan
      ? `Plano recomendado: ${briefing.plan.name} — ${briefing.plan.deliveryTime}, ${briefing.plan.support}`
      : null,
    briefing.plan ? `Inclui: ${briefing.plan.features.join("; ")}` : null,
    "",
    "Quero validar esse escopo e receber um orçamento.",
  ]
    .filter((l) => l !== null)
    .join("\n");

  return (
    <section id="whai" className="py-24 md:py-32 border-t border-border">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <p className="eyebrow mb-4">whAI</p>
            <h2 className="display-huge text-5xl md:text-7xl max-w-2xl">
              Monte a base do seu projeto <em>com a gente.</em>
            </h2>
          </div>
          <p className="text-muted-foreground max-w-sm md:pb-2">
            Converse do jeito que você fala. Do lado, o briefing do seu projeto
            vai se montando em tempo real.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-px bg-border border border-border">
          {/* Chat */}
          <div className="bg-card flex flex-col min-h-[26rem] md:min-h-[32rem]">
            <header className="border-b border-border px-5 py-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                whAI / Conversa
              </p>
              <p className="text-sm font-semibold mt-1">Assistente de briefing</p>
            </header>

            <div
              className="flex-1 overflow-y-auto max-h-[22rem] md:max-h-[26rem] px-4 py-4 space-y-3"
              aria-live="polite"
              aria-label="Conversa com a whAI"
            >
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={cn(
                      "max-w-[85%] rounded-none px-4 py-2.5 text-sm leading-relaxed",
                      m.from === "user" ? "bg-primary text-primary-foreground" : "bg-foreground/[0.05] border border-border",
                    )}
                  >
                    <p className="whitespace-pre-wrap break-words">{m.body}</p>
                    <p
                      className={cn(
                        "mt-1 font-mono text-[9px] uppercase tracking-wider",
                        m.from === "user" ? "text-primary-foreground/70" : "text-muted-foreground",
                      )}
                    >
                      {m.from === "user" ? "Você" : "whAI"}
                    </p>
                  </div>
                </motion.div>
              ))}
              {quick.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap gap-2 mt-1">
                  {quick.map((q) => (
                    <Chip key={q} label={q} onPick={() => quickPick(q)} />
                  ))}
                </motion.div>
              )}
              <AnimatePresence>{typing && <Typing />}</AnimatePresence>
              <div ref={bottomRef} />
            </div>

            {stage === "done" ? (
              <div className="border-t border-border p-3 flex items-center justify-between gap-3">
                <p className="text-xs text-muted-foreground">Briefing montado ao lado.</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-none"
                  onClick={reset}
                  aria-label="Recomeçar a conversa com a whAI"
                >
                  <RotateCcw className="w-3.5 h-3.5 mr-1.5" aria-hidden="true" />
                  Recomeçar
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSend} className="border-t border-border p-3 flex items-end gap-2">
                <Textarea
                  rows={1}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend(e);
                    }
                  }}
                  placeholder="Descreva o que você quer criar…"
                  aria-label="Descreva o que você quer criar"
                  maxLength={1000}
                  className="min-h-[42px] max-h-24 resize-none rounded-none"
                />
                <Button
                  type="submit"
                  size="icon"
                  aria-label="Enviar mensagem para a whAI"
                  disabled={typing || !draft.trim()}
                  className="h-[42px] w-[42px] shrink-0 rounded-none"
                >
                  <Send className="w-4 h-4" aria-hidden="true" />
                </Button>
              </form>
            )}
          </div>

          {/* Preview ao vivo */}
          <div
            className={cn("bg-card flex flex-col", filled === 0 ? "hidden md:flex" : "flex")}
            aria-live="polite"
            aria-label="Briefing gerado em tempo real"
          >
            <header className="border-b border-border px-5 py-4">
              <p className="eyebrow">
                Briefing · {filled}/6 campos preenchidos
              </p>
            </header>

            <div className="flex-1 p-5 md:p-6 space-y-6">
              {filled === 0 && (
                <p className="text-sm text-muted-foreground">
                  Seu briefing vai aparecer aqui conforme a conversa avança.
                </p>
              )}

              {briefing.service && (
                <Field>
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground mb-1">
                    Serviço identificado
                  </p>
                  <p className="font-display text-2xl flex items-center gap-2">
                    {Icon && <Icon className="w-5 h-5 text-primary" strokeWidth={1.5} aria-hidden="true" />}
                    {serviceName}
                  </p>
                </Field>
              )}

              {briefing.empresa && (
                <Field>
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground mb-1">
                    Tipo de empresa
                  </p>
                  <p className="text-sm">{briefing.empresa}</p>
                </Field>
              )}

              {briefing.funcionalidades && (
                <Field>
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground mb-1">
                    Funcionalidades
                  </p>
                  <p className="text-sm leading-relaxed">{briefing.funcionalidades}</p>
                </Field>
              )}

              {briefing.prazo && (
                <Field>
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground mb-1">
                    Prazo
                  </p>
                  <p className="text-sm">{briefing.prazo}</p>
                </Field>
              )}

              {briefing.conteudo && (
                <Field>
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground mb-1">
                    Conteúdo pronto
                  </p>
                  <p className="text-sm">{briefing.conteudo}</p>
                </Field>
              )}

              {briefing.orcamento && (
                <Field>
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground mb-1">
                    Faixa de investimento
                  </p>
                  <p className="text-sm">{briefing.orcamento}</p>
                </Field>
              )}

              {briefing.plan && (
                <Field>
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground mb-1">
                    Plano recomendado
                  </p>
                  <p className="font-display text-2xl">{briefing.plan.name}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {briefing.plan.deliveryTime} · {briefing.plan.support}
                  </p>
                </Field>
              )}

              {briefing.plan && (
                <Field>
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground mb-2">
                    Incluso
                  </p>
                  <ul className="space-y-2">
                    {briefing.plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Check className="w-4 h-4 mt-0.5 text-primary shrink-0" strokeWidth={2} aria-hidden="true" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </Field>
              )}
            </div>

            {stage === "done" && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-t border-border p-5"
              >
                <Button
                  className="w-full rounded-none"
                  aria-label="Enviar esse briefing para a WH Studio"
                  onClick={() => requestQuote({ subject: serviceName, prefill: resumo })}
                >
                  Enviar esse briefing pra WH Studio
                  <ArrowUpRight className="w-4 h-4 ml-1.5" aria-hidden="true" />
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhAI;