import { motion } from "framer-motion";
import { ArrowUpRight, BadgeCheck } from "lucide-react";
import { usePortfolio } from "@/hooks/usePortfolio";
import { useOrcamentoAction } from "@/components/tickets/TicketChat";

const commitments = [
  {
    title: "Fala direto com o dev",
    desc: "O atendimento acontece com quem define a solução e escreve o código.",
  },
  {
    title: "Fora do template",
    desc: "A interface nasce do seu negócio, não de um tema pronto adaptado às pressas.",
  },
  {
    title: "Prazo combinado",
    desc: "Cronograma claro, checkpoints reais e entrega acompanhada etapa por etapa.",
  },
  {
    title: "Suporte pós-lançamento",
    desc: "Ajuste, orientação e resposta direta depois que o projeto entra no ar.",
  },
];

const ProvaConfianca = () => {
  const { data: portfolio } = usePortfolio(true);
  const { requestQuote } = useOrcamentoAction();
  const clients = portfolio.slice(0, 4);

  return (
    <section id="confianca" className="py-16 md:py-24">
      <div className="container">
        <div className="premium-shell overflow-hidden">
          <div className="grid gap-10 p-6 md:p-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="eyebrow mb-4">Prova de confiança</p>
              <h2 className="display-huge text-4xl md:text-5xl max-w-xl text-balance">
                Projeto de verdade, <em>do briefing ao deploy.</em>
              </h2>
              <p className="mt-5 text-sm md:text-base text-muted-foreground leading-relaxed max-w-md">
                Nada de promessa bonita sem execução. A entrega combina presença visual,
                tecnologia e acompanhamento direto para sua empresa entrar no ar com segurança.
              </p>

              <button
                type="button"
                onClick={() =>
                  requestQuote({ subject: "Projeto novo", prefill: "Quero conversar sobre um projeto. " })
                }
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-primary-foreground transition-colors hover:bg-primary/90 cursor-pointer"
              >
                Solicitar orçamento
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>

            <div className="lg:col-span-7">
              {clients.length > 0 && (
                <div className="mb-8">
                  <p className="num-label mb-4">Quem já publicou pela WH Studio</p>
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {clients.map((c, i) => (
                      <motion.li
                        key={c.id}
                        initial={{ opacity: 0, y: 8 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-8%" }}
                        transition={{ duration: 0.4, delay: i * 0.05 }}
                        className="rounded-lg border border-border bg-background/70 p-4"
                      >
                        <p className="font-display text-2xl leading-none truncate">{c.title}</p>
                        <p className="num-label mt-2 truncate">{c.category}</p>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}

              <ul className="grid gap-3 sm:grid-cols-2">
                {commitments.map((c, i) => (
                  <motion.li
                    key={c.title}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-8%" }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    className="rounded-lg border border-border bg-card p-5"
                  >
                    <BadgeCheck className="h-5 w-5 text-primary" />
                    <p className="mt-4 text-base font-semibold">{c.title}</p>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProvaConfianca;
