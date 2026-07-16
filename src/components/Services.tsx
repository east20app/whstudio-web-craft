import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { services, siteConfig, whatsappLink } from "@/config/site";

const accents = ["text-primary", "text-accent-2", "text-primary", "text-accent-2", "text-primary", "text-accent-2"];

const Services = () => (
  <section id="servicos" className="py-28 md:py-32 border-t border-border">
    <div className="container">
      <div className="grid md:grid-cols-12 gap-8 mb-16">
        <div className="md:col-span-3">
          <p className="eyebrow">[ 01 ] Serviços</p>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="md:col-span-9"
        >
          <h2 className="display-huge text-4xl md:text-6xl mb-5">
            Construímos o que <br />
            <span className="text-foreground/50">você ainda controla</span> na planilha.
          </h2>
          <p className="text-foreground/70 max-w-xl">
            Cada projeto é escrito do zero. Sem WordPress, sem template comprado, sem mensalidade escondida.
          </p>
        </motion.div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {services.map((s, i) => {
          const Icon = s.icon;
          const accent = accents[i % accents.length];
          return (
            <motion.a
              key={s.id}
              href={whatsappLink(siteConfig.defaultMessages.service(s.title))}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: Math.min(i * 0.05, 0.25) }}
              className="card-premium group p-6 md:p-7 flex flex-col relative"
            >
              <div className="flex items-start justify-between mb-6">
                <div className={`w-12 h-12 rounded-xl border border-border bg-background/40 flex items-center justify-center ${accent}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="eyebrow text-foreground/30">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              <h3 className="font-display text-xl md:text-2xl font-extrabold tracking-tight mb-3">
                {s.title}
              </h3>
              <p className="text-sm text-foreground/70 leading-relaxed mb-5">{s.short}</p>

              <ul className="space-y-1.5 mt-auto mb-5">
                {s.benefits.slice(0, 3).map((b) => (
                  <li key={b} className="flex items-start gap-2 text-xs text-foreground/60">
                    <span className={`mt-1.5 w-1 h-1 rounded-full ${accent === "text-primary" ? "bg-primary" : "bg-accent-2"} shrink-0`} />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <span className="eyebrow text-foreground/50">Solicitar</span>
                <ArrowUpRight className="w-4 h-4 text-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>
            </motion.a>
          );
        })}
      </div>
    </div>
  </section>
);

export default Services;
