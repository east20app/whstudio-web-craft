import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { services } from "@/config/site";
import { useOrcamentoAction } from "@/components/tickets/TicketChat";

const accents = ["text-primary", "text-accent-2", "text-primary", "text-accent-2", "text-primary", "text-accent-2"];

const Services = () => {
  const { requestQuote } = useOrcamentoAction();
  return (
    <section id="servicos" className="py-28 md:py-32 border-t border-border">
    <div className="container">
      <div className="grid md:grid-cols-12 gap-8 mb-16">
        <div className="md:col-span-3">
          <p className="eyebrow">[ 01 ] Serviços</p>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="md:col-span-9"
        >
          <h2 className="display-huge text-4xl md:text-6xl mb-5">
            Construímos o que <br />
            <span className="text-foreground/50">você ainda controla</span> na planilha.
          </h2>
          <p className="text-foreground/70 max-w-xl">
            Cada projeto é escrito do zero. Sem WordPress, sem template comprado, sem mensalidade escondida.
          </p>
        </motion.div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {services.map((s, i) => {
          const Icon = s.icon;
          const accent = accents[i % accents.length];
          return (
            <motion.button
              key={s.id}
              type="button"
              onClick={() => requestQuote({ subject: s.title, prefill: `Quero um orçamento de ${s.title}. ` })}
              aria-label={`Solicitar orçamento de ${s.title}`}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: Math.min(i * 0.05, 0.25) }}
              className="card-premium group p-7 md:p-8 flex flex-col relative text-left"
            >
              <div className="flex items-baseline justify-between mb-8">
                <span className="font-mono text-xs text-foreground/35 tracking-widest">
                  S/{String(i + 1).padStart(2, "0")}
                </span>
                <Icon className={`w-5 h-5 ${accent}`} strokeWidth={1.5} />
              </div>

              <h3 className="font-display text-xl md:text-[1.35rem] font-extrabold tracking-tight mb-3 leading-tight">
                {s.title}
              </h3>
              <p className="text-sm text-foreground/65 leading-relaxed mb-6">{s.short}</p>

              <ul className="space-y-2 mt-auto mb-6">
                {s.benefits.slice(0, 3).map((b) => (
                  <li key={b} className="flex items-start gap-2.5 text-xs text-foreground/55">
                    <span className="mt-1.5 w-3 h-px bg-foreground/25 shrink-0" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <span className="eyebrow text-foreground/50 group-hover:text-foreground/80 transition-colors">Solicitar</span>
                <ArrowUpRight className="w-4 h-4 text-foreground/40 group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
    </section>
  );
};

export default Services;
