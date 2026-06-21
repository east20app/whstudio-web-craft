import { motion } from "framer-motion";
import { services, siteConfig, whatsappLink } from "@/config/site";

const Services = () => (
  <section id="servicos" className="py-28 md:py-36 bg-background">
    <div className="container-wide">
      {/* Section masthead — asymmetric */}
      <div className="grid md:grid-cols-12 gap-10 mb-20 items-end rule-b pb-10">
        <div className="md:col-span-2">
          <span className="num-mono text-[11px] text-muted-foreground">§ 02</span>
        </div>
        <div className="md:col-span-6">
          <p className="eyebrow text-muted-foreground mb-4">Capacidades</p>
          <h2 className="display-xl text-[clamp(2.4rem,5vw,4.2rem)]">
            Seis frentes <span className="serif-italic">de trabalho.</span>
          </h2>
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="md:col-span-4 text-sm text-muted-foreground leading-relaxed"
        >
          Cada projeto começa de uma página em branco. Sem template, sem boilerplate vendido como produto. Abaixo, o que tipicamente entra na pauta.
        </motion.p>
      </div>

      <div className="divide-y divide-[hsl(var(--rule))] rule-b">
        {services.map((s, i) => (
          <motion.article
            key={s.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: Math.min(i * 0.04, 0.2) }}
            className="grid md:grid-cols-12 gap-x-10 gap-y-6 py-10 md:py-14 group"
          >
            <div className="md:col-span-2 flex items-baseline gap-3">
              <span className="num-mono text-[11px] text-muted-foreground">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>

            <div className="md:col-span-4">
              <h3 className="font-display text-3xl md:text-4xl leading-[1.05]">
                {s.title}
              </h3>
            </div>

            <div className="md:col-span-4 text-sm text-muted-foreground leading-relaxed">
              {s.short}
            </div>

            <div className="md:col-span-2">
              <ul className="space-y-1.5 mb-4">
                {s.benefits.slice(0, 3).map((b) => (
                  <li key={b} className="text-[11px] num-mono text-muted-foreground">
                    — {b}
                  </li>
                ))}
              </ul>
              <a
                href={whatsappLink(siteConfig.defaultMessages.service(s.title))}
                target="_blank"
                rel="noopener noreferrer"
                className="ink-link text-[12px] font-medium"
              >
                Conversar <span className="num-mono">↗</span>
              </a>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  </section>
);

export default Services;
