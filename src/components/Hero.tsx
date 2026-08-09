import { motion } from "framer-motion";
import { ArrowUpRight, Activity, Clock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { whatsappLink } from "@/config/site";

const Hero = () => (
  <section className="relative pt-36 pb-24 md:pt-44 md:pb-32 overflow-hidden">
    {/* Grid sutil de fundo */}
    <div className="absolute inset-0 -z-10 bg-grid" aria-hidden />

    <div className="container">
      <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <span className="pill-eyebrow">
              <span className="pill-dot" />
              WH Studio · Desenvolvimento web
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="h1-hero mb-8 max-w-3xl"
          >
            Construímos produtos digitais{" "}
            <span className="text-muted-foreground">com cuidado de quem assina cada linha.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-base md:text-lg text-muted-foreground max-w-xl mb-10 leading-relaxed"
          >
            Estúdio de desenvolvimento no RN. Sites, sistemas e bots feitos do zero —
            sob a direção de um único profissional, do briefing ao deploy.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.22 }}
            className="flex flex-wrap items-center gap-4"
          >
            <Button size="lg" className="h-14 px-7 text-base rounded-lg group" asChild>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                Iniciar um projeto
                <ArrowUpRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </Button>
            <a href="#servicos" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Ver serviços →
            </a>
          </motion.div>
        </div>

        {/* Card lateral com métricas */}
        <motion.aside
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="lg:col-span-5"
        >
          <div className="card-premium card-premium-featured p-6 md:p-7">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm font-semibold">WH Studio</p>
              <span className="eyebrow">Disponível para projetos</span>
            </div>

            <p className="eyebrow mb-4">Em números</p>

            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { icon: Activity, k: "70+", v: "Projetos" },
                { icon: Clock, k: "12d", v: "Prazo médio" },
                { icon: Star, k: "5.0", v: "Avaliação" },
              ].map(({ icon: Icon, k, v }) => (
                <div key={v} className="rounded-md border border-border bg-foreground/[0.02] p-3">
                  <Icon className="w-3.5 h-3.5 text-muted-foreground mb-2" strokeWidth={1.5} />
                  <p className="font-display font-extrabold text-xl leading-none">{k}</p>
                  <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">{v}</p>
                </div>
              ))}
            </div>

            <div className="rounded-md border border-border bg-foreground/[0.02] p-4 space-y-2 text-sm">
              {[
                ["Atendimento", "WhatsApp direto"],
                ["Resposta", "Até 24h úteis"],
                ["Prazo médio", "12 dias"],
              ].map(([k, v]) => (
                <p key={k} className="flex items-baseline justify-between gap-4">
                  <span className="text-muted-foreground">{k}</span>
                  <span className="text-foreground font-medium text-right">{v}</span>
                </p>
              ))}
            </div>
          </div>
        </motion.aside>
      </div>
    </div>
  </section>
);

export default Hero;
