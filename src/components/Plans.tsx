import { motion } from "framer-motion";
import { Check, ArrowUpRight, Clock, LifeBuoy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { plans } from "@/config/site";
import { useOrcamentoAction } from "@/components/tickets/TicketChat";

const Plans = () => {
  const { requestQuote } = useOrcamentoAction();
  return (
    <section id="planos" className="py-24 md:py-32 border-t border-border">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <p className="eyebrow mb-4">Planos</p>
            <h2 className="display-huge text-5xl md:text-7xl max-w-2xl">
              Qual nível faz sentido <em>pra onde você está?</em>
            </h2>
          </div>
          <p className="text-muted-foreground max-w-sm md:pb-2">
            Cada projeto é orçado depois de entender o escopo. O que muda aqui é a profundidade da entrega.
          </p>
        </div>

        <div className="border-t border-border grid md:grid-cols-3">
          {plans.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className={`py-8 md:py-10 md:px-8 ${i > 0 ? "md:border-l border-border" : ""} md:first:pl-0 flex flex-col`}
            >
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-display text-3xl md:text-4xl">{p.name}</h3>
                {p.popular && <span className="eyebrow text-primary whitespace-nowrap">Mais escolhido</span>}
              </div>
              <p className="text-sm text-muted-foreground mt-2">{p.tagline}</p>

              <div className="mt-6 space-y-2 text-sm">
                <p className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-muted-foreground shrink-0" strokeWidth={1.5} />
                  <span className="text-muted-foreground">Prazo</span>
                  <span className="ml-auto font-medium text-right">{p.deliveryTime}</span>
                </p>
                <p className="flex items-center gap-2.5">
                  <LifeBuoy className="w-4 h-4 text-muted-foreground shrink-0" strokeWidth={1.5} />
                  <span className="text-muted-foreground">Suporte</span>
                  <span className="ml-auto font-medium text-right">{p.support}</span>
                </p>
              </div>

              <ul className="mt-6 border-t border-border pt-6 space-y-3 flex-1">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-foreground/85">
                    <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" strokeWidth={2} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant={p.popular ? "default" : "outline"}
                className="w-full mt-8 rounded-none"
                onClick={() =>
                  requestQuote({
                    subject: `Plano ${p.name}`,
                    prefill: `Tenho interesse no plano ${p.name}. `,
                  })
                }
              >
                {p.ctaLabel} <ArrowUpRight className="w-4 h-4 ml-1" aria-hidden="true" />
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Plans;
