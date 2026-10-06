import { motion } from "framer-motion";
import { ArrowUpRight, Globe2, PanelsTopLeft, Sparkles, Workflow, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOrcamentoAction } from "@/components/tickets/TicketChat";

const projectOptions: Array<{
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description: string;
  subject: string;
  prefill: string;
}> = [
  {
    icon: Globe2,
    eyebrow: "Presença digital",
    title: "Site ou loja virtual",
    description: "Apresente sua empresa, divulgue seus serviços ou comece a vender online.",
    subject: "Criação de site ou loja virtual",
    prefill: "Quero conversar sobre a criação de um site ou loja virtual. Minha ideia é: ",
  },
  {
    icon: PanelsTopLeft,
    eyebrow: "Operação sob medida",
    title: "Sistema ou painel",
    description: "Organize cadastros, pedidos, usuários e relatórios no fluxo real do seu negócio.",
    subject: "Sistema ou painel sob medida",
    prefill: "Quero conversar sobre um sistema ou painel sob medida. Preciso resolver: ",
  },
  {
    icon: Workflow,
    eyebrow: "Processos conectados",
    title: "Automação e integrações",
    description: "Automatize tarefas e conecte WhatsApp, planilhas, APIs, bots e outras ferramentas.",
    subject: "Automação ou integração",
    prefill: "Quero conversar sobre uma automação ou integração. Hoje eu preciso: ",
  },
  {
    icon: Sparkles,
    eyebrow: "Ideia aberta",
    title: "Outra solução digital",
    description: "Tem outra ideia? Vamos entender o problema e decidir juntos o que vale construir.",
    subject: "Outro projeto digital",
    prefill: "Tenho outra ideia de projeto digital. O que eu preciso é: ",
  },
];

const ProjectInquiry = () => {
  const { requestQuote } = useOrcamentoAction();

  return (
    <section id="contratar" className="section-premium py-24 md:py-32">
      <div className="container relative">
        <div className="grid items-end gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <p className="eyebrow mb-5">Projeto sob medida</p>
            <h2 className="display-huge max-w-4xl text-5xl text-balance md:text-7xl">
              O que você precisa <em>colocar em funcionamento?</em>
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground md:text-base lg:col-span-4">
            Site, sistema, automação ou uma ideia diferente. Escolha por onde começar e vamos
            definir juntos o escopo, o prazo e o orçamento do seu projeto.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {projectOptions.map((option, index) => (
            <motion.button
              key={option.title}
              type="button"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8%" }}
              transition={{ duration: 0.35, delay: index * 0.04 }}
              onClick={() =>
                requestQuote({ subject: option.subject, prefill: option.prefill })
              }
              className="group premium-shell flex min-h-64 w-full flex-col p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:border-primary/45 hover:shadow-[0_24px_64px_hsl(var(--primary)/0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:p-7"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="eyebrow pt-2">{option.eyebrow}</span>
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <option.icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
                </span>
              </div>
              <h3 className="mt-8 font-display text-2xl leading-tight transition-colors group-hover:text-primary md:text-3xl">
                {option.title}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                {option.description}
              </p>
              <span className="mt-6 inline-flex items-center gap-2 border-t border-border pt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-foreground/75 transition-colors group-hover:text-primary">
                Conversar sobre o projeto
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </motion.button>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-2xl border border-border/80 bg-card/65 p-5 backdrop-blur md:flex-row md:items-center md:p-6">
          <div>
            <p className="font-medium">Ainda não sabe por onde começar?</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Conte sua ideia com suas palavras. A gente organiza o próximo passo junto.
            </p>
          </div>
          <Button
            variant="outline"
            className="shrink-0 rounded-full"
            onClick={() =>
              requestQuote({
                subject: "Quero conversar sobre um projeto",
                prefill: "Quero tirar uma ideia do papel. Ainda estou definindo o que preciso: ",
              })
            }
          >
            Contar minha ideia
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProjectInquiry;


