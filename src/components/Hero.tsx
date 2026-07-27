import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles, Activity, Clock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { whatsappLink } from "@/config/site";

const Hero = () => (
  <section className="relative pt-36 pb-24 md:pt-44 md:pb-32 overflow-hidden">
    {/* Spotlight radial + grid sutil */}
    <div className="absolute inset-0 -z-10 bg-grid" aria-hidden />
    <div
      className="absolute inset-0 -z-10 opacity-90"
      style={{ background: "var(--gradient-radial-primary)" }}
      aria-hidden
    />

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
            <span className="text-foreground/55">com cuidado de quem assina cada linha.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-base md:text-lg text-foreground/70 max-w-xl mb-10 leading-relaxed"
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
            <Button size="lg" className="h-14 px-7 text-base rounded-full group" asChild>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                Iniciar um projeto
                <ArrowUpRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </Button>
            <a href="#servicos" className="eyebrow text-muted-foreground hover:text-foreground transition-colors">
              Ver serviços →
            </a>
          </motion.div>
        </div>

        {/* Card lateral com métricas — densidade visual de SaaS */}
        <motion.aside
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="lg:col-span-5"
        >
          <div className="card-premium card-premium-featured p-6 md:p-7">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-primary" />
                </div>
                <p className="text-sm font-semibold">WH Studio</p>
              </div>
              <span className="text-[10px] font-mono px-2 py-1 rounded-full bg-success/10 text-success border border-success/30">
                ● online
              </span>
            </div>

            <p className="eyebrow mb-4">Números do estúdio</p>

            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { icon: Activity, k: "70+", v: "Projetos" },
                { icon: Clock, k: "12d", v: "Prazo médio" },
                { icon: Star, k: "5.0", v: "Avaliação" },
              ].map(({ icon: Icon, k, v }) => (
                <div key={v} className="rounded-lg border border-border bg-background/40 p-3">
                  <Icon className="w-3.5 h-3.5 text-accent-2 mb-2" />
                  <p className="font-display font-extrabold text-xl leading-none">{k}</p>
                  <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">{v}</p>
                </div>
              ))}
            </div>

            <div className="rounded-lg border border-border bg-background/40 p-4 font-mono text-xs leading-relaxed">
              <p className="text-muted-foreground">$ status</p>
              <p className="text-foreground">
                <span className="text-accent-2">→</span> Disponível para novos projetos
              </p>
              <p className="text-foreground">
                <span className="text-accent-2">→</span> Resposta em até 24h úteis
              </p>
              <p className="text-foreground">
                <span className="text-accent-2">→</span> Entrega em até 15 dias
              </p>
            </div>
          </div>
        </motion.aside>
      </div>
    </div>
  </section>
);

export default Hero;
