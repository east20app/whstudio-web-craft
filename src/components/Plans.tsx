import { motion } from "framer-motion";
import { Check, ArrowUpRight, Clock, LifeBuoy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { plans, siteConfig, whatsappLink } from "@/config/site";

const Plans = () => (
  <section id="planos" className="py-28 md:py-32 border-t border-border relative overflow-hidden">
    <div
      className="absolute inset-0 -z-10 opacity-70"
      style={{ background: "var(--gradient-radial-primary)" }}
      aria-hidden
    />

    <div className="container">
      <div className="grid md:grid-cols-12 gap-8 mb-16">
        <div className="md:col-span-3">
          <p className="eyebrow">[ 04 ] Planos</p>
        </div>
        <div className="md:col-span-9">
          <h2 className="display-huge text-4xl md:text-6xl mb-5">
            Qual nível faz sentido <br />
            <span className="text-foreground/50">pra onde você está?</span>
          </h2>
          <p className="text-foreground/70 max-w-xl">
            Cada projeto é orçado depois de entender o escopo. O que muda aqui é a profundidade da entrega.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-5 md:gap-6 items-stretch">
        {plans.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className={`card-premium p-7 md:p-8 flex flex-col relative ${
              p.popular ? "card-premium-featured md:-mt-4 md:mb-0" : ""
            }`}
          >
            {p.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-mono uppercase tracking-widest px-3 py-1 rounded-full bg-primary text-primary-foreground shadow-[0_0_20px_-4px_hsl(var(--primary))]">
                Mais escolhido
              </span>
            )}

            <div className="flex items-baseline justify-between mb-2">
              <h3 className="font-display text-2xl md:text-3xl font-extrabold">{p.name}</h3>
              <span className="eyebrow text-foreground/40">{String(i + 1).padStart(2, "0")}</span>
            </div>
            <p className="text-sm text-foreground/60 mb-6">{p.tagline}</p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="rounded-lg border border-border bg-background/40 p-3">
                <Clock className={`w-3.5 h-3.5 mb-1.5 ${p.popular ? "text-primary" : "text-accent-2"}`} />
                <p className="eyebrow mb-0.5">Prazo</p>
                <p className="text-xs font-medium">{p.deliveryTime}</p>
              </div>
              <div className="rounded-lg border border-border bg-background/40 p-3">
                <LifeBuoy className={`w-3.5 h-3.5 mb-1.5 ${p.popular ? "text-primary" : "text-accent-2"}`} />
                <p className="eyebrow mb-0.5">Suporte</p>
                <p className="text-xs font-medium">{p.support}</p>
              </div>
            </div>

            <ul className="space-y-2.5 mb-8">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-foreground/80">
                  <Check className={`w-4 h-4 shrink-0 mt-0.5 ${p.popular ? "text-primary" : "text-accent-2"}`} />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <Button
              variant={p.popular ? "default" : "outline"}
              className={`h-12 mt-auto rounded-full ${
                p.popular
                  ? "glow btn-glow-hover"
                  : "border-foreground/20 hover:border-primary/50 hover:bg-primary/5"
              }`}
              asChild
            >
              <a
                href={whatsappLink(siteConfig.defaultMessages.plan(p.name))}
                target="_blank"
                rel="noopener noreferrer"
              >
                {p.ctaLabel} <ArrowUpRight className="w-4 h-4 ml-1" />
              </a>
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Plans;
