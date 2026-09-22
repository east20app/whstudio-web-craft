import { motion } from "framer-motion";
import { Check, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { plans } from "@/config/site";
import { useOrcamentoAction } from "@/components/tickets/TicketChat";

const Plans = () => {
  const { requestQuote } = useOrcamentoAction();
  return (
    <section id="planos" className="py-24 md:py-32 border-t border-border">
      <div className="container">
        <div className="grid lg:grid-cols-12 gap-8 items-end mb-16">
          <div className="lg:col-span-8">
            <p className="eyebrow mb-5">Planos</p>
            <h2 className="display-huge text-5xl md:text-7xl max-w-3xl">
              Qual nível faz sentido <em>pra onde você está?</em>
            </h2>
          </div>
          <p className="lg:col-span-4 text-sm md:text-base text-muted-foreground leading-relaxed max-w-md">
            Cada projeto é orçado depois de entender o escopo. O que muda aqui é a
            profundidade da entrega — o preço, só depois da conversa.
          </p>
        </div>

        <div className="border-t border-border">
          {plans.map((p, i) => (
            <motion.article
              key={p.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-8%" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="grid md:grid-cols-12 gap-x-8 items-start border-b border-border py-10 md:py-14"
            >
              <div className="md:col-span-3 min-w-0">
                {p.popular && (
                  <p className="num-label text-primary mb-2">// Mais escolhido</p>
                )}
                <h3 className="font-display text-4xl md:text-5xl leading-none">{p.name}</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-[30ch]">
                  {p.tagline}
                </p>
              </div>

              <div className="md:col-span-4 mt-8 md:mt-0">
                <p className="num-label mb-3">O que inclui</p>
                <ul className="space-y-2.5">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-foreground/85">
                      <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" strokeWidth={2} />
                      <span className="max-w-[46ch]">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="md:col-span-3 mt-8 md:mt-0">
                <p className="num-label mb-3">Prazo e suporte</p>
                <dl className="space-y-2.5 text-sm">
                  <div className="flex items-baseline justify-between gap-3">
                    <dt className="text-muted-foreground">Prazo</dt>
                    <dd className="text-right font-medium">{p.deliveryTime}</dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-3">
                    <dt className="text-muted-foreground">Suporte</dt>
                    <dd className="text-right font-medium">{p.support}</dd>
                  </div>
                </dl>
              </div>

              <div className="md:col-span-2 mt-8 md:mt-0 md:flex md:justify-end">
                <Button
                  variant={p.popular ? "default" : "outline"}
                  className="w-full md:w-auto rounded-none px-6"
                  onClick={() =>
                    requestQuote({
                      subject: `Plano ${p.name}`,
                      prefill: `Tenho interesse no plano ${p.name}. `,
                    })
                  }
                >
                  {p.ctaLabel} <ArrowUpRight className="w-4 h-4 ml-1" aria-hidden="true" />
                </Button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Plans;