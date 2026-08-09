import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { services } from "@/config/site";
import { useOrcamentoAction } from "@/components/tickets/TicketChat";

const Services = () => {
  const { requestQuote } = useOrcamentoAction();
  return (
    <section id="servicos" className="py-24 md:py-32 border-t border-border">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <p className="eyebrow mb-4">Serviços</p>
            <h2 className="display-huge text-5xl md:text-7xl max-w-2xl">
              O que a gente <em>constrói.</em>
            </h2>
          </div>
          <p className="text-muted-foreground max-w-sm md:pb-2">
            Cada projeto é escrito do zero. Sem WordPress, sem template comprado,
            sem mensalidade escondida.
          </p>
        </div>

        <div className="border-t border-border">
          {services.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.button
                key={s.id}
                type="button"
                onClick={() => requestQuote({ subject: s.title, prefill: `Quero um orçamento de ${s.title}. ` })}
                aria-label={`Solicitar orçamento de ${s.title}`}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: Math.min(i * 0.04, 0.2) }}
                className="group w-full grid md:grid-cols-12 gap-x-4 gap-y-2 items-baseline py-8 md:py-10 border-b border-border text-left transition-colors hover:bg-foreground/[0.02]"
              >
                <span className="md:col-span-1 flex items-center gap-3 font-mono text-xs text-muted-foreground">
                  <Icon className="w-4 h-4" strokeWidth={1.5} />
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="md:col-span-4 font-display text-3xl md:text-4xl leading-tight group-hover:text-primary transition-colors">
                  {s.title}
                </h3>
                <p className="md:col-span-5 text-sm text-muted-foreground leading-relaxed">{s.short}</p>
                <span className="md:col-span-2 flex items-center justify-end gap-2 text-sm font-medium">
                  Solicitar
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
