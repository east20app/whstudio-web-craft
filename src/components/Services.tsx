import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { services, siteConfig, whatsappLink } from "@/config/site";

const Services = () => (
  <section id="servicos" className="py-24 bg-secondary">
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="grid lg:grid-cols-[0.75fr_1.25fr] gap-8 mb-14 items-end"
      >
        <div>
          <span className="eyebrow text-primary mb-3">Serviços</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold">O que eu resolvo</h2>
        </div>
        <p className="text-muted-foreground md:text-lg max-w-2xl">
          Se hoje isso está em planilha, grupo de WhatsApp, formulário perdido ou tarefa manual,
          dá para transformar em uma tela simples que sua equipe consegue usar.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border">
        {services.map((s, i) => (
          <motion.article
            key={s.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: Math.min(i * 0.04, 0.22) }}
            className="bg-card p-7 flex flex-col min-h-[310px]"
          >
            <div className="flex items-center justify-between gap-4 mb-8">
              <s.icon className="w-6 h-6 text-primary" aria-hidden="true" />
              <span className="font-mono-label text-[10px] text-muted-foreground">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
            <h3 className="text-lg font-semibold font-display mb-3">{s.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5">{s.short}</p>
            <ul className="space-y-2 mb-6 flex-1">
              {s.benefits.slice(0, 3).map((b) => (
                <li key={b} className="text-xs text-muted-foreground">
                  <span className="text-primary mr-2">/</span>
                  {b}
                </li>
              ))}
            </ul>
            <Button variant="outline" size="sm" className="w-full justify-between" asChild>
              <a
                href={whatsappLink(siteConfig.defaultMessages.service(s.title))}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Solicitar orçamento de ${s.title}`}
              >
                Falar sobre isso <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </Button>
          </motion.article>
        ))}
      </div>
    </div>
  </section>
);

export default Services;
