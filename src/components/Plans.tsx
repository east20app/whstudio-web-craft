import { motion } from "framer-motion";
import { Check, Clock, LifeBuoy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { plans, siteConfig, whatsappLink } from "@/config/site";

const Plans = () => (
  <section id="planos" className="py-24">
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="text-sm font-medium text-primary uppercase tracking-widest">Planos</span>
        <h2 className="text-3xl md:text-4xl font-bold mt-2">Escolha o plano ideal para o seu projeto</h2>
        <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
          Valores transparentes para cada perfil de negócio. Todos os planos incluem design moderno,
          código limpo e suporte direto pelo WhatsApp.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {plans.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={`relative rounded-xl border p-8 flex flex-col ${
              p.popular
                ? "bg-card border-primary ring-2 ring-primary/60 glow"
                : "bg-card border-border"
            }`}
          >
            {p.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full uppercase tracking-wider">
                Mais escolhido
              </span>
            )}

            <h3 className="text-xl font-bold">{p.name}</h3>
            <p className="text-sm text-muted-foreground mt-1 min-h-[40px]">{p.tagline}</p>

            <div className="mt-6 mb-6">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">A partir de</p>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-sm text-muted-foreground">R$</span>
                <span className="text-4xl font-extrabold">{p.priceFrom.toLocaleString("pt-BR")}</span>
                {p.priceSuffix && <span className="text-2xl font-bold text-primary">{p.priceSuffix}</span>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-6">
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

            <Button
              className={`w-full ${p.popular ? "glow" : ""}`}
              variant={p.popular ? "default" : "outline"}
              asChild
            >
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
        * Valores iniciais. O preço final pode variar de acordo com o escopo, integrações e prazos do projeto.
        Solicite um orçamento personalizado pelo WhatsApp.
      </p>
    </div>
  </section>
);

export default Plans;
