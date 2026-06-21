import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { services, siteConfig, whatsappLink } from "@/config/site";

const Services = () => (
  <section id="servicos" className="py-24 bg-secondary">
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="eyebrow text-primary">O que a gente faz</span>
        <h2 className="font-display text-3xl md:text-5xl font-bold mt-3">Serviços</h2>
        <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
          Site, bot, sistema, automação — o que você precisa pra rodar o negócio online.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((s, i) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: Math.min(i * 0.05, 0.3) }}
            className="card-dark-hover p-7 flex flex-col"
          >
            <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-5">
              <s.icon className="w-6 h-6 text-primary" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-semibold mb-2">{s.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">{s.short}</p>
            <ul className="space-y-2 mb-6 flex-1">
              {s.benefits.slice(0, 3).map((b) => (
                <li key={b} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <Check className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <Button variant="outline" size="sm" className="w-full" asChild>
              <a
                href={whatsappLink(siteConfig.defaultMessages.service(s.title))}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Solicitar orçamento de ${s.title}`}
              >
                Solicitar orçamento
              </a>
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Services;
