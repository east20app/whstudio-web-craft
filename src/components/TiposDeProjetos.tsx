import { motion } from "framer-motion";
import { ArrowUpRight, Bot, Braces, Globe, type LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useOrcamentoAction } from "@/components/tickets/TicketChat";

type ProjectType = {
  icon: LucideIcon;
  value: string;
  title: string;
  desc: string;
  includes: string[];
  href: string;
  prefill: string;
};

const types: ProjectType[] = [
  {
    icon: Globe,
    value: "Tipo 01",
    title: "Site profissional",
    desc: "Para transformar busca, indicação e primeiro contato em uma experiência que passa confiança antes do WhatsApp abrir.",
    includes: ["Institucional", "Landing page", "Loja virtual"],
    href: "/servicos",
    prefill: "Preciso de um site profissional. ",
  },
  {
    icon: Braces,
    value: "Tipo 02",
    title: "Sistema sob medida",
    desc: "Para tirar processos de planilhas, mensagens soltas e retrabalho, colocando a operação dentro de um painel claro.",
    includes: ["Painel com login", "Cadastros e pedidos", "Relatórios"],
    href: "/sistemas",
    prefill: "Preciso de um sistema sob medida. ",
  },
  {
    icon: Bot,
    value: "Tipo 03",
    title: "Bot + automação",
    desc: "Para automatizar tarefas repetidas, atendimento, integrações e rotinas que hoje dependem de alguém fazendo tudo manualmente.",
    includes: ["Bot para Discord", "Automação de processos", "Integrações"],
    href: "/servicos",
    prefill: "Preciso de um bot ou automação. ",
  },
];

const TiposDeProjetos = () => {
  const { requestQuote } = useOrcamentoAction();

  return (
    <section id="tipos" className="py-24 md:py-32">
      <div className="container">
        <div className="grid lg:grid-cols-12 gap-8 items-end mb-16">
          <div className="lg:col-span-8">
            <p className="eyebrow mb-5">Tipos de projeto</p>
            <h2 className="display-huge text-5xl md:text-7xl max-w-3xl text-balance">
              O que a sua empresa <em>precisa?</em>
            </h2>
          </div>
          <p className="lg:col-span-4 text-sm md:text-base text-muted-foreground leading-relaxed max-w-md">
            Três caminhos claros para sair da ideia vaga e chegar em uma entrega com escopo,
            prioridade e próximo passo.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          {types.map((t, i) => (
            <motion.article
              key={t.value}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8%" }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="group premium-shell relative flex min-h-[28rem] flex-col overflow-hidden p-8 md:p-10"
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-accent-2 to-primary opacity-70" />
              <div className="flex items-baseline justify-between">
                <p className="num-label">{t.value}</p>
                <span className="grid h-12 w-12 place-items-center rounded-full bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <t.icon className="w-6 h-6" strokeWidth={1.5} aria-hidden="true" />
                </span>
              </div>

              <h3 className="font-display text-3xl md:text-4xl leading-tight mt-8">{t.title}</h3>
              <p className="mt-4 text-sm md:text-base text-muted-foreground leading-relaxed flex-1">
                {t.desc}
              </p>

              <ul className="mt-8 flex flex-wrap gap-2">
                {t.includes.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full border border-border bg-background/70 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground"
                  >
                    {tag}
                  </li>
                ))}
              </ul>

              <div className="mt-10 pt-5 border-t border-border flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => requestQuote({ subject: t.title, prefill: t.prefill })}
                  className="inline-flex items-center justify-between rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 cursor-pointer"
                >
                  Solicitar orçamento
                  <ArrowUpRight className="w-4 h-4" />
                </button>
                <Link
                  to={t.href}
                  className="inline-flex items-center justify-between px-1 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                >
                  Entender melhor
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TiposDeProjetos;
