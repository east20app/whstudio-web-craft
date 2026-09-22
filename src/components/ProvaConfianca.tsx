import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { usePortfolio } from "@/hooks/usePortfolio";
import { useOrcamentoAction } from "@/components/tickets/TicketChat";

const commitments = [
  {
    title: "Fala direto com o dev",
    desc: "O WhatsApp responde com quem escreveu o código. Sem atendimento terceirizado, sem chamado.",
  },
  {
    title: "Fora do template",
    desc: "Nada de tema pronto. Cada tela existe porque o seu projeto precisou dela — não o contrário.",
  },
  {
    title: "Prazo combinado",
    desc: "Cronograma fechado antes da primeira linha de código, entrega em etapas que você acompanha.",
  },
  {
    title: "Suporte pós-lançamento",
    desc: "Período de suporte incluso depois que entra no ar. Ajuste, treino e plantão direto.",
  },
];

/**
 * Prova de confiança: quem já confiou (projetos publicados de verdade)
 * + os compromissos que sustentam o trabalho. Sem números inventados.
 */
const ProvaConfianca = () => {
  const { data: portfolio } = usePortfolio(true);
  const { requestQuote } = useOrcamentoAction();
  const clients = portfolio.slice(0, 4);

  return (
    <section id="confianca" className="border-t border-border py-16 md:py-20">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div>
            <p className="eyebrow mb-4">Prova de confiança</p>
            <h2 className="display-huge text-4xl md:text-5xl max-w-xl">
              Projeto de verdade, <em>do briefing ao deploy.</em>
            </h2>
          </div>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-sm">
            Nada de mockup vendido como promessa: você vê cada projeto nascer e
            acompanha a entrega etapa por etapa.
          </p>
        </div>

        {clients.length > 0 && (
          <div className="border-t border-border">
            <p className="num-label pt-4 mb-4">Quem já publicou pela WH Studio</p>
            <ul className="grid sm:grid-cols-2 lg:grid-cols-4 border-b border-border">
              {clients.map((c, i) => (
                <motion.li
                  key={c.id}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-8%" }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="border-b lg:border-b-0 sm:border-r border-border last:border-r-0 px-1 py-5"
                >
                  <p className="font-display text-2xl md:text-3xl leading-none truncate">{c.title}</p>
                  <p className="num-label mt-2 truncate">{c.category}</p>
                </motion.li>
              ))}
            </ul>
          </div>
        )}

        <ul className="grid md:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-8 mt-12">
          {commitments.map((c, i) => (
            <motion.li
              key={c.title}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8%" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="border-t border-border pt-6"
            >
              <p className="num-label">{String(i + 1).padStart(2, "0")} — Compromisso</p>
              <h3 className="text-base font-semibold mt-3">{c.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
            </motion.li>
          ))}
        </ul>

        <div className="mt-12 flex items-center gap-6">
          <button
            type="button"
            onClick={() => requestQuote({ subject: "Projeto novo", prefill: "Quero conversar sobre um projeto. " })}
            className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-primary hover:text-primary/80 transition-colors cursor-pointer"
          >
            Solicitar orçamento
            <ArrowUpRight className="w-4 h-4" />
          </button>
          <span className="hairline flex-1" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
};

export default ProvaConfianca;