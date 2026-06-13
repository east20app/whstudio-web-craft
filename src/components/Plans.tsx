import { motion } from "framer-motion";
import { Check, Clock, LifeBuoy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { plans, siteConfig, whatsappLink } from "@/config/site";

const Plans = () => (
  <section id="planos" className="py-24 bg-background">
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="eyebrow text-primary mb-3">Planos</span>
        <h2 className="font-display text-3xl md:text-5xl font-bold mt-3">Qual faz sentido para você?</h2>
        <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
          Primeiro eu entendo o problema. Depois passo escopo, prazo e valor sem surpresa no final.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {plans.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className={`relative rounded-lg border p-8 flex flex-col ${
              p.popular ? "bg-card border-primary" : "bg-card border-border"
            }`}
          >
            {p.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full uppercase tracking-wider">
                Mais pedido
              </span>
            )}

            <h3 className="text-xl font-bold font-display">{p.name}</h3>
            <p className="text-sm text-muted-foreground mt-1 min-h-[40px]">{p.tagline}</p>

            <div className="mt-6 mb-6">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Investimento</p>
              <p className="text-3xl font-extrabold text-gradient mt-1">Sob consulta</p>
            </div>

            <div className="grid grid-cols-1 gap-2 mb-6">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="w-3.5 h-3.5 text-primary" /> {p.deliveryTime}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <LifeBuoy className="w-3.5 h-3.5 text-primary" /> {p.support}
              </div>
            </div>

            <ul className="space-y-3 flex-1 mb-6">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{f}</span>
                </li>
              ))}
            </ul>

            <Button className="w-full" variant={p.popular ? "default" : "outline"} asChild>
              <a
                href={whatsappLink(siteConfig.defaultMessages.plan(p.name))}
                target="_blank"
                rel="noopener noreferrer"
              >
                {p.ctaLabel}
              </a>
            </Button>
          </motion.div>
        ))}
      </div>

      <p className="text-center text-xs text-muted-foreground mt-10 max-w-2xl mx-auto">
        O valor depende de escopo, integrações e prazo. Tudo fica combinado antes de começar.
      </p>
    </div>
  </section>
);

export default Plans;
