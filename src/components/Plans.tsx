import { motion } from "framer-motion";
import { plans, siteConfig, whatsappLink } from "@/config/site";

const Plans = () => (
  <section id="planos" className="py-28 md:py-36 bg-secondary/40">
    <div className="container-wide">
      <div className="grid md:grid-cols-12 gap-10 mb-16 items-end rule-b pb-10">
        <div className="md:col-span-2">
          <span className="num-mono text-[11px] text-muted-foreground">§ 05</span>
        </div>
        <div className="md:col-span-7">
          <p className="eyebrow text-muted-foreground mb-4">Engajamentos</p>
          <h2 className="display-xl text-[clamp(2.4rem,5vw,4.2rem)]">
            Três formas de <span className="serif-italic">começar juntos.</span>
          </h2>
        </div>
        <p className="md:col-span-3 text-sm text-muted-foreground leading-relaxed">
          Valor depende do escopo. Antes de fechar, conversamos para entender se faz sentido.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-px bg-[hsl(var(--rule))] border-y border-[hsl(var(--rule))]">
        {plans.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className={`relative bg-background p-8 md:p-10 flex flex-col min-h-[560px] ${
              p.popular ? "md:-my-6 md:py-16 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.18)] z-10" : ""
            }`}
          >
            <div className="flex items-baseline justify-between mb-10">
              <span className="num-mono text-[11px] text-muted-foreground">
                Plano {String(i + 1).padStart(2, "0")}
              </span>
              {p.popular && (
                <span className="num-mono text-[10px] uppercase tracking-wider text-[hsl(var(--accent))]">
                  ● Recomendado
                </span>
              )}
            </div>

            <h3 className="font-display text-4xl md:text-5xl leading-none mb-3">{p.name}</h3>
            <p className="text-sm text-muted-foreground mb-10 leading-relaxed min-h-[3.5rem]">
              {p.tagline}
            </p>

            <div className="rule-t rule-b py-5 mb-8 flex items-baseline justify-between">
              <span className="num-mono text-[10px] text-muted-foreground uppercase tracking-wider">
                A partir de
              </span>
              <span className="font-display text-2xl">Sob escopo</span>
            </div>

            <ul className="space-y-3 flex-1 mb-10">
              {p.features.map((f) => (
                <li key={f} className="flex items-baseline gap-3 text-[13px]">
                  <span className="num-mono text-[10px] text-muted-foreground">+</span>
                  <span className="text-foreground/85 leading-relaxed">{f}</span>
                </li>
              ))}
            </ul>

            <div className="rule-t pt-5 flex items-baseline justify-between">
              <div className="text-[11px] text-muted-foreground space-y-1">
                <div>{p.deliveryTime}</div>
                <div>{p.support}</div>
              </div>
              <a
                href={whatsappLink(siteConfig.defaultMessages.plan(p.name))}
                target="_blank"
                rel="noopener noreferrer"
                className="ink-link text-sm font-medium"
              >
                {p.ctaLabel} <span className="num-mono">↗</span>
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Plans;
