import { motion } from "framer-motion";
import { ArrowRight, Zap, MessageCircle, Sparkles, TrendingUp, Activity } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { whatsappLink, siteConfig } from "@/config/site";

const trustBadges = [
  { icon: Zap, label: "Entrega rápida", desc: "A partir de 7 dias" },
  { icon: MessageCircle, label: "Suporte direto", desc: "WhatsApp incluído" },
  { icon: Sparkles, label: "Sob medida", desc: "Projetos personalizados" },
];

const Hero = () => (
  <section className="relative min-h-screen flex items-center overflow-hidden pt-24 pb-16">
    <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />
    <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

    <div className="container relative z-10">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs md:text-sm font-medium mb-6">
            <Sparkles className="w-3.5 h-3.5" /> {siteConfig.slogan}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.1] mb-6">
            Sites, sistemas e bots que{" "}
            <span className="text-gradient">vendem por você</span>
          </h1>
          <p className="text-base md:text-lg text-muted-foreground mb-8 max-w-xl">
            A WH Studio cria soluções digitais sob medida — sites profissionais, lojas virtuais,
            bots para Discord, dashboards e automações — com entrega rápida e suporte direto pelo WhatsApp.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button size="lg" className="glow" asChild>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                Solicitar orçamento <ArrowRight className="ml-2 w-4 h-4" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/planos">Ver planos</Link>
            </Button>
          </div>

          {/* Mini trust cards */}
          <div className="grid grid-cols-3 gap-3 mt-10 max-w-lg">
            {trustBadges.map((b) => (
              <div
                key={b.label}
                className="card-dark p-3 md:p-4 text-center"
              >
                <b.icon className="w-5 h-5 text-primary mx-auto mb-2" aria-hidden="true" />
                <p className="text-xs md:text-sm font-semibold leading-tight">{b.label}</p>
                <p className="text-[10px] md:text-xs text-muted-foreground mt-0.5">{b.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Dashboard mockup */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="hidden lg:block"
        >
          <div className="relative">
            <div className="rounded-2xl border border-border bg-card p-5 glow shadow-2xl">
              {/* Browser bar */}
              <div className="flex items-center gap-2 mb-5 pb-3 border-b border-border">
                <div className="w-3 h-3 rounded-full bg-destructive" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <div className="ml-3 flex-1 px-3 py-1 rounded bg-secondary text-[11px] text-muted-foreground">
                  dashboard.whstudio.com.br
                </div>
              </div>

              {/* Header bar */}
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-xs text-muted-foreground">Visão geral</p>
                  <p className="text-sm font-bold">Últimos 30 dias</p>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-medium text-emerald-400">Ao vivo</span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  { label: "Visitantes", value: "12.4k", trend: "+24%", icon: Activity },
                  { label: "Conversão", value: "8.2%", trend: "+3.1%", icon: TrendingUp },
                  { label: "Receita", value: "R$ 38k", trend: "+18%", icon: TrendingUp },
                ].map((s) => (
                  <div key={s.label} className="rounded-lg bg-secondary p-3 border border-border">
                    <s.icon className="w-3.5 h-3.5 text-primary mb-1.5" />
                    <p className="text-base font-bold">{s.value}</p>
                    <p className="text-[10px] text-muted-foreground">{s.label}</p>
                    <p className="text-[10px] font-semibold text-emerald-400 mt-1">{s.trend}</p>
                  </div>
                ))}
              </div>

              {/* Chart */}
              <div className="rounded-lg bg-secondary p-4 border border-border">
                <div className="flex items-end gap-1.5 h-28">
                  {[40, 60, 45, 75, 55, 80, 65, 90, 70, 95, 80, 88].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col justify-end">
                      <div
                        className="w-full bg-gradient-to-t from-primary to-primary/40 rounded-t-sm"
                        style={{ height: `${h}%` }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-4 -left-4 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-bold shadow-xl flex items-center gap-2"
            >
              <TrendingUp className="w-3.5 h-3.5" /> +300% conversão
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default Hero;
