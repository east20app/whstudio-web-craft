import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, RotateCcw, Check } from "lucide-react";
import { services, plans } from "@/config/site";
import { useOrcamentoAction } from "@/components/tickets/TicketChat";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type Prazo = "Essa semana" | "Nas próximas semanas" | "Sem pressa";
type Conteudo = "Sim" | "Não" | "Parcial";
type Porte = "Simples" | "Completo" | "Sob medida";

const porteToPlan: Record<Porte, string> = {
  Simples: "inicial",
  Completo: "profissional",
  "Sob medida": "premium",
};

const stepFade = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.3 },
};

const OptionButton = ({
  active,
  onClick,
  label,
  children,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={label}
    aria-pressed={active}
    className={`w-full text-left px-4 py-3 border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
      active
        ? "border-primary text-foreground bg-primary/[0.06]"
        : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
    }`}
  >
    {children}
  </button>
);

const WhAI = () => {
  const { requestQuote } = useOrcamentoAction();
  const [step, setStep] = useState(1);
  const [serviceId, setServiceId] = useState<string | null>(null);
  const [descricao, setDescricao] = useState("");
  const [prazo, setPrazo] = useState<Prazo | null>(null);
  const [conteudo, setConteudo] = useState<Conteudo | null>(null);
  const [porte, setPorte] = useState<Porte | null>(null);

  const service = services.find((s) => s.id === serviceId);
  const serviceName = service ? service.title : descricao.trim() ? "Projeto sob descrição" : "Projeto novo";
  const plan = plans.find((p) => p.id === (porte ? porteToPlan[porte] : "")) ?? plans[1];

  const canGoStep2 = Boolean(serviceId) || descricao.trim().length > 3;
  const canGoStep3 = Boolean(prazo && conteudo && porte);

  const resumo = [
    `Briefing gerado pela whAI`,
    ``,
    `Serviço: ${serviceName}`,
    descricao.trim() ? `Descrição: ${descricao.trim()}` : null,
    `Prazo desejado: ${prazo}`,
    `Conteúdo pronto (textos, logo, referências): ${conteudo}`,
    `Porte: ${porte}`,
    ``,
    `Plano recomendado: ${plan.name} — ${plan.deliveryTime}, ${plan.support}`,
    `Inclui: ${plan.features.join("; ")}`,
    ``,
    `Quero validar esse escopo e receber um orçamento.`,
  ]
    .filter(Boolean)
    .join("\n");

  const reset = () => {
    setStep(1);
    setServiceId(null);
    setDescricao("");
    setPrazo(null);
    setConteudo(null);
    setPorte(null);
  };

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
            Três perguntas rápidas e você sai daqui com um briefing pronto — sem
            precisar saber o nome técnico de nada.
          </p>
        </div>

        <div className="card-dark p-6 md:p-10 max-w-4xl">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-border">
            <span className="font-mono text-xs text-muted-foreground">
              {String(step).padStart(2, "0")} / 03
            </span>
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                aria-label="Voltar para o passo anterior"
                className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Voltar
              </button>
            )}
          </div>

          <div aria-live="polite">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="s1" {...stepFade}>
                  <h3 className="text-xl md:text-2xl mb-6">O que você quer construir?</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {services.map((s) => {
                      const Icon = s.icon;
                      const active = serviceId === s.id;
                      return (
                        <OptionButton
                          key={s.id}
                          active={active}
                          label={`Escolher ${s.title}`}
                          onClick={() => {
                            setServiceId(s.id);
                            setDescricao("");
                          }}
                        >
                          <span className="flex items-center gap-2 text-sm font-medium">
                            <Icon className="w-4 h-4 shrink-0" strokeWidth={1.5} />
                            {s.title}
                          </span>
                        </OptionButton>
                      );
                    })}
                    <OptionButton
                      active={serviceId === null && descricao.length > 0}
                      label="Não sei bem, vou descrever"
                      onClick={() => setServiceId(null)}
                    >
                      <span className="text-sm font-medium">Não sei bem, vou descrever</span>
                    </OptionButton>
                  </div>

                  {serviceId === null && (
                    <div className="mt-4">
                      <label htmlFor="whai-desc" className="eyebrow block mb-2">
                        Conta com suas palavras
                      </label>
                      <Textarea
                        id="whai-desc"
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                        placeholder="Ex: tenho uma pizzaria e quero receber pedido sem pagar taxa de app."
                        className="rounded-none min-h-24"
                      />
                    </div>
                  )}

                  <div className="mt-8 flex">
                    <Button
                      className="rounded-none"
                      disabled={!canGoStep2}
                      onClick={() => setStep(2)}
                      aria-label="Ir para o passo 2"
                    >
                      Continuar <ArrowUpRight className="w-4 h-4 ml-1.5" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="s2" {...stepFade} className="space-y-8">
                  <div>
                    <h3 className="text-xl md:text-2xl mb-1">Pra quando você precisa?</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                      {(["Essa semana", "Nas próximas semanas", "Sem pressa"] as Prazo[]).map((p) => (
                        <OptionButton
                          key={p}
                          active={prazo === p}
                          label={`Prazo: ${p}`}
                          onClick={() => setPrazo(p)}
                        >
                          <span className="text-sm font-medium">{p}</span>
                        </OptionButton>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl md:text-2xl mb-1">
                      Já tem conteúdo pronto (textos, logo, referências)?
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                      {(["Sim", "Não", "Parcial"] as Conteudo[]).map((c) => (
                        <OptionButton
                          key={c}
                          active={conteudo === c}
                          label={`Conteúdo pronto: ${c}`}
                          onClick={() => setConteudo(c)}
                        >
                          <span className="text-sm font-medium">{c}</span>
                        </OptionButton>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl md:text-2xl mb-1">Qual o porte disso?</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                      {(["Simples", "Completo", "Sob medida"] as Porte[]).map((p) => (
                        <OptionButton
                          key={p}
                          active={porte === p}
                          label={`Porte: ${p}`}
                          onClick={() => setPorte(p)}
                        >
                          <span className="text-sm font-medium">{p}</span>
                        </OptionButton>
                      ))}
                    </div>
                  </div>

                  <div className="flex">
                    <Button
                      className="rounded-none"
                      disabled={!canGoStep3}
                      onClick={() => setStep(3)}
                      aria-label="Ver meu briefing"
                    >
                      Ver meu briefing <ArrowUpRight className="w-4 h-4 ml-1.5" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="s3" {...stepFade}>
                  <div className="border border-border p-6 md:p-8">
                    <p className="eyebrow mb-4">Seu briefing</p>
                    <div className="grid md:grid-cols-2 gap-6 pb-6 border-b border-border">
                      <div>
                        <p className="font-mono text-xs text-muted-foreground mb-1">SERVIÇO</p>
                        <p className="font-display text-2xl">{serviceName}</p>
                      </div>
                      <div>
                        <p className="font-mono text-xs text-muted-foreground mb-1">PLANO SUGERIDO</p>
                        <p className="font-display text-2xl">{plan.name}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {plan.deliveryTime} · {plan.support}
                        </p>
                      </div>
                    </div>

                    <ul className="py-6 space-y-2">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <Check className="w-4 h-4 mt-0.5 text-primary shrink-0" strokeWidth={2} />
                          {f}
                        </li>
                      ))}
                    </ul>

                    <p className="text-sm leading-relaxed border-t border-border pt-6">
                      Baseado no que você respondeu: você quer{" "}
                      <span className="text-foreground font-medium">{serviceName.toLowerCase()}</span>, com prazo{" "}
                      <span className="text-foreground font-medium">{prazo?.toLowerCase()}</span>, conteúdo{" "}
                      <span className="text-foreground font-medium">{conteudo?.toLowerCase()}</span> e porte{" "}
                      <span className="text-foreground font-medium">{porte?.toLowerCase()}</span>. O plano que
                      encaixa melhor é o <span className="text-foreground font-medium">{plan.name}</span>.
                      {descricao.trim() && ` Sua descrição: ${descricao.trim()}`}
                    </p>
                  </div>

                  <div className="mt-8 flex flex-col md:flex-row gap-3">
                    <Button
                      className="rounded-none"
                      aria-label="Enviar esse briefing para a WH Studio"
                      onClick={() => requestQuote({ subject: serviceName, prefill: resumo })}
                    >
                      Enviar esse briefing pra WH Studio
                      <ArrowUpRight className="w-4 h-4 ml-1.5" />
                    </Button>
                    <Button
                      variant="outline"
                      className="rounded-none"
                      aria-label="Recomeçar o questionário"
                      onClick={reset}
                    >
                      <RotateCcw className="w-4 h-4 mr-1.5" />
                      Recomeçar
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhAI;
