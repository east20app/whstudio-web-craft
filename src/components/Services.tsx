import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { usePublicServices, toPublicService } from "@/hooks/usePublicServices";
import { services as configServices } from "@/config/site";
import { useOrcamentoAction } from "@/components/tickets/TicketChat";

const Services = () => {
  const live = usePublicServices();
  const list = live && live.length > 0 ? live : configServices.map(toPublicService);
  const { requestQuote } = useOrcamentoAction();

  return (
    <section id="servicos" className="border-t border-border py-24 md:py-32">
      <div className="container">
        <div className="grid lg:grid-cols-12 gap-8 items-end mb-16">
          <div className="lg:col-span-8">
            <p className="eyebrow mb-5">Serviços</p>
            <h2 className="display-huge text-5xl md:text-6xl max-w-2xl">
              O que eu <em>construo.</em>
            </h2>
          </div>
          <p className="lg:col-span-4 text-sm md:text-base text-muted-foreground leading-relaxed max-w-md">
            Cada serviço é um escopo, não um template. Primeiro entendemos o que
            precisa existir; depois eu escrevo o código, publico e te entrego.
          </p>
        </div>

        <div className="border-t border-border">
          {list.map((s, i) => (
            <motion.article
              key={s.key}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-8%" }}
              transition={{ duration: 0.4 }}
              className="group grid md:grid-cols-12 items-baseline gap-x-6 gap-y-3 border-b border-border py-8 md:py-10"
            >
              <p className="md:col-span-1 num-label group-hover:text-primary transition-colors">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="md:col-span-4 font-display text-3xl md:text-4xl leading-tight group-hover:text-primary transition-colors">
                {s.title}
              </h3>
              <div className="md:col-span-4">
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-[50ch] group-hover:text-foreground/80 transition-colors">
                  {s.desc}
                </p>
              </div>
              <div className="md:col-span-3 md:flex md:justify-end">
                <button
                  type="button"
                  onClick={() =>
                    requestQuote({
                      subject: `Serviço: ${s.title}`,
                      prefill: `Quero um orçamento para: ${s.title}. `,
                    })
                  }
                  className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground hover:text-foreground transition-colors cursor-pointer bg-transparent"
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