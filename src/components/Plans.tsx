import { motion } from "framer-motion";
import { Check, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { plans, siteConfig, whatsappLink } from "@/config/site";

const Plans = () => (
  <section id="planos" className="py-32 border-t border-border">
    <div className="container">
      <div className="grid md:grid-cols-12 gap-8 mb-20">
        <div className="md:col-span-3">
          <p className="eyebrow">[ 04 ] Planos</p>
        </div>
        <div className="md:col-span-9">
          <h2 className="display-huge text-5xl md:text-7xl mb-6">
            Qual nível faz sentido <br />
            <span className="text-foreground/50">pra onde você está?</span>
          </h2>
          <p className="text-foreground/70 max-w-xl">
            Cada projeto é orçado depois de entender o escopo. O que muda aqui é a profundidade da entrega.
          </p>
        </div>
      </div>

      <div className="border-t border-border">
        {plans.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className={`grid md:grid-cols-12 gap-6 py-12 border-b border-border ${
              p.popular ? "bg-foreground/[0.02]" : ""
            }`}
          >
            <div className="md:col-span-1 eyebrow text-foreground/40">
              {String(i + 1).padStart(2, "0")}
            </div>
            <div className="md:col-span-3">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-display text-2xl md:text-3xl font-extrabold">{p.name}</h3>
                {p.popular && (
                  <span className="eyebrow text-accent-blue">· popular</span>
                )}
              </div>
              <p className="text-sm text-foreground/60 mb-6">{p.tagline}</p>
              <div className="space-y-1">
                <p className="eyebrow">Prazo</p>
                <p className="text-sm">{p.deliveryTime}</p>
                <p className="eyebrow mt-3">Suporte</p>
                <p className="text-sm">{p.support}</p>
              </div>
            </div>
            <div className="md:col-span-6">
              <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2.5">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-foreground/80">
                    <Check className="w-4 h-4 text-accent-blue shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:col-span-2 flex md:justify-end items-start">
              <Button
                variant={p.popular ? "default" : "outline"}
                className={`rounded-none h-11 ${p.popular ? "" : "border-foreground/30 hover:bg-foreground hover:text-background"}`}
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
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Plans;
