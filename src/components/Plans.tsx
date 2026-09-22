import { motion } from "framer-motion";
import { ArrowUpRight, Check, Clock3, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { plans } from "@/config/site";
import { useOrcamentoAction } from "@/components/tickets/TicketChat";

const Plans = () => {
  const { requestQuote } = useOrcamentoAction();

  return (
    <section id="planos" className="section-premium py-24 md:py-32">
      <div className="container relative">
        <div className="grid lg:grid-cols-12 gap-8 items-end mb-16">
          <div className="lg:col-span-8">
            <p className="eyebrow mb-5">Planos</p>
            <h2 className="display-huge text-5xl md:text-7xl max-w-3xl text-balance">
              Qual nível faz sentido <em>pra onde você está?</em>
            </h2>
          </div>
          <p className="lg:col-span-4 text-sm md:text-base text-muted-foreground leading-relaxed max-w-md">
            Sem preço inventado antes de entender o escopo. Os níveis mostram profundidade,
            prazo e suporte para orientar a conversa.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {plans.map((p, i) => (
            <motion.article
              key={p.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8%" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className={`premium-shell relative flex min-h-[34rem] flex-col p-6 md:p-7 ${
                p.popular ? "border-primary/60 shadow-[0_30px_100px_hsl(var(--primary)/0.18)]" : ""
              }`}
            >
              {p.popular && (
                <div className="absolute right-5 top-5 rounded-full bg-primary px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-primary-foreground">
                  Mais escolhido
                </div>
              )}

              <div className="pr-24">
                <p className="num-label">Plano {String(i + 1).padStart(2, "0")}</p>
                <h3 className="font-display mt-4 text-4xl leading-none md:text-5xl">{p.name}</h3>
                <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{p.tagline}</p>
              </div>

              <div className="mt-8 grid gap-3 rounded-lg border border-border bg-secondary/55 p-4">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="inline-flex items-center gap-2 text-muted-foreground">
                    <Clock3 className="h-4 w-4 text-primary" />
                    Prazo
                  </span>
                  <strong className="text-right font-medium">{p.deliveryTime}</strong>
                </div>
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="inline-flex items-center gap-2 text-muted-foreground">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    Suporte
                  </span>
                  <strong className="text-right font-medium">{p.support}</strong>
                </div>
              </div>

              <div className="mt-8 flex-1">
                <p className="num-label mb-4">O que inclui</p>
                <ul className="space-y-3">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-foreground/85">
                      <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" strokeWidth={2} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                variant={p.popular ? "default" : "outline"}
                className="mt-8 h-12 w-full rounded-full px-6"
                onClick={() =>
                  requestQuote({
                    subject: `Plano ${p.name}`,
                    prefill: `Tenho interesse no plano ${p.name}. `,
                  })
                }
              >
                {p.ctaLabel} <ArrowUpRight className="w-4 h-4 ml-1" aria-hidden="true" />
              </Button>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Plans;
