import { motion } from "framer-motion";
import { ArrowUpRight, Globe, Braces, Bot, type LucideIcon } from "lucide-react";
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
    desc: "Se o seu público procura você — e acha só o que os outros publicam — a primeira impressão precisa ser sua.",
    includes: ["Institucional", "Landing page", "Loja virtual"],
    href: "/servicos",
    prefill: "Preciso de um site profissional. ",
  },
  {
    icon: Braces,
    value: "Tipo 02",
    title: "Sistema sob medida",
    desc: "Se o negócio roda em planilha, WhatsApp e caderno, chegou a hora de um sistema que faça o trabalho sozinho.",
    includes: ["Painel com login", "Cadastros e pedidos", "Relatórios"],
    href: "/sistemas",
    prefill: "Preciso de um sistema sob medida. ",
  },
  {
    icon: Bot,
    value: "Tipo 03",
    title: "Bot + automação",
    desc: "Se a comunidade ou o processo depende de alguém repetindo tarefa o dia todo, isso param em código.",
    includes: ["Bot para Discord", "Automação de processos", "Integrações"],
    href: "/servicos",
    prefill: "Preciso de um bot ou automação. ",
  },
];

/**
 * "O que sua empresa precisa?" — três caminhos claros de projeto,
 * cada um com escopo típico e orçamento já preenchido na abertura.
 */
const TiposDeProjetos = () => {
  const { requestQuote } = useOrcamentoAction();

  return (
    <section id="tipos" className="border-t border-border py-24 md:py-32">
      <div className="container">
        <div className="grid lg:grid-cols-12 gap-8 items-end mb-16">
          <div className="lg:col-span-8">
            <p className="eyebrow mb-5">Tipos de projeto</p>
            <h2 className="display-huge text-5xl md:text-7xl max-w-3xl">
              O que a sua empresa <em>precisa?</em>
            </h2>
          </div>
          <p className="lg:col-span-4 text-sm md:text-base text-muted-foreground leading-relaxed max-w-md">
            Escolha o caminho, veja o escopo típico e peça o orçamento com a
            conversa já começando do ponto certo.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-px bg-border border border-border">
          {types.map((t, i) => (
            <motion.article
              key={t.value}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8%" }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="bg-card p-8 md:p-10 flex flex-col"
            >
              <div className="flex items-baseline justify-between">
                <p className="num-label">{t.value}</p>
                <t.icon className="w-6 h-6 text-primary" strokeWidth={1.5} aria-hidden="true" />
              </div>

              <h3 className="font-display text-3xl md:text-4xl leading-tight mt-8">{t.title}</h3>
              <p className="mt-4 text-sm md:text-base text-muted-foreground leading-relaxed flex-1">
                {t.desc}
              </p>

              <ul className="mt-8 flex flex-wrap gap-2">
                {t.includes.map((tag) => (
                  <li key={tag} className="font-mono text-[10px] uppercase tracking-wider px-2 py-1 border border-border text-muted-foreground">
                    {tag}
                  </li>
                ))}
              </ul>

              <div className="mt-10 pt-5 border-t border-border flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => requestQuote({ subject: t.title, prefill: t.prefill })}
                  className="inline-flex items-center justify-between text-sm font-semibold hover:text-primary transition-colors cursor-pointer bg-transparent py-1"
                >
                  Solicitar orçamento deste tipo
                  <ArrowUpRight className="w-4 h-4" />
                </button>
                <Link
                  to={t.href}
                  className="inline-flex items-center justify-between text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
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