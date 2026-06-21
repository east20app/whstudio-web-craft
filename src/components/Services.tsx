import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { services, siteConfig, whatsappLink } from "@/config/site";

const Services = () => (
  <section id="servicos" className="py-32 border-t border-border">
    <div className="container">
      {/* Header editorial em 12 colunas */}
      <div className="grid md:grid-cols-12 gap-8 mb-20">
        <div className="md:col-span-3">
          <p className="eyebrow">[ 01 ] Serviços</p>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="md:col-span-9"
        >
          <h2 className="display-huge text-5xl md:text-7xl mb-6">
            Construímos o que <br />
            <span className="text-foreground/50">você ainda controla</span> na planilha.
          </h2>
          <p className="text-foreground/70 max-w-xl">
            Cada projeto é escrito do zero. Sem WordPress, sem template comprado, sem mensalidade escondida.
          </p>
        </motion.div>
      </div>

      {/* Lista editorial — não cards repetidos */}
      <div className="border-t border-border">
        {services.map((s, i) => (
          <motion.a
            key={s.id}
            href={whatsappLink(siteConfig.defaultMessages.service(s.title))}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: Math.min(i * 0.04, 0.2) }}
            className="group grid md:grid-cols-12 gap-6 py-8 md:py-10 border-b border-border items-start hover:bg-foreground/[0.02] px-2 -mx-2 transition-colors"
          >
            <div className="md:col-span-1 eyebrow text-foreground/40 pt-2">
              {String(i + 1).padStart(2, "0")}
            </div>
            <div className="md:col-span-3">
              <h3 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight">
                {s.title}
              </h3>
            </div>
            <div className="md:col-span-6">
              <p className="text-foreground/70 leading-relaxed text-sm md:text-base">{s.short}</p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-4">
                {s.benefits.slice(0, 3).map((b) => (
                  <span key={b} className="eyebrow text-foreground/50">· {b}</span>
                ))}
              </div>
            </div>
            <div className="md:col-span-2 flex md:justify-end pt-2">
              <ArrowUpRight className="w-6 h-6 text-foreground/40 group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  </section>
);

export default Services;
