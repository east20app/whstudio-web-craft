import { motion } from "framer-motion";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { usePublicServices, toPublicService } from "@/hooks/usePublicServices";
import { services as configServices } from "@/config/site";
import { useOrcamentoAction } from "@/components/tickets/TicketChat";

const Services = () => {
  const live = usePublicServices();
  const list = live && live.length > 0 ? live : configServices.map(toPublicService);
  const { requestQuote } = useOrcamentoAction();

  return (
    <section id="servicos" className="section-premium py-24 md:py-32">
      <div className="container relative">
        <div className="grid lg:grid-cols-12 gap-8 items-end mb-16">
          <div className="lg:col-span-8">
            <p className="eyebrow mb-5">Serviços</p>
            <h2 className="display-huge text-5xl md:text-6xl max-w-2xl text-balance">
              O que eu <em>construo.</em>
            </h2>
          </div>
          <p className="lg:col-span-4 text-sm md:text-base text-muted-foreground leading-relaxed max-w-md">
            Cada entrega combina estratégia, interface e código sob medida para a empresa parecer
            mais confiável, vender melhor e operar com menos improviso.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {list.map((s, i) => (
            <motion.article
              key={s.key}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8%" }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
              className="group premium-shell flex min-h-[22rem] flex-col p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/45 hover:shadow-[0_28px_90px_hsl(var(--primary)/0.14)] md:p-7"
            >
              <div className="flex items-start justify-between gap-4">
                <p className="num-label group-hover:text-primary transition-colors">
                  {String(i + 1).padStart(2, "0")} / Serviço
                </p>
                <span className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-primary">
                  <CheckCircle2 className="h-5 w-5" />
                </span>
              </div>

              <h3 className="mt-8 font-display text-3xl leading-tight transition-colors group-hover:text-primary md:text-4xl">
                {s.title}
              </h3>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground transition-colors group-hover:text-foreground/80 md:text-base">
                {s.desc}
              </p>

              <div className="mt-8 border-t border-border pt-5">
                <button
                  type="button"
                  onClick={() =>
                    requestQuote({
                      subject: `Serviço: ${s.title}`,
                      prefill: `Quero um orçamento para: ${s.title}. `,
                    })
                  }
                  className="inline-flex w-full items-center justify-between gap-3 bg-transparent font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
                >
                  Solicitar orçamento
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
