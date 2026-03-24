import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => (
  <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
    {/* Background glow effects */}
    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
    <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-[100px]" />

    <div className="container relative z-10 py-20">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            🚀 Transformando ideias em sistemas reais
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
            Crie Sites, Bots e Sistemas Profissionais{" "}
            <span className="text-gradient">em até 15 dias</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-lg">
            Transformamos sua ideia em um sistema completo pronto para faturar. Sites, bots para Discord, sistemas personalizados e muito mais.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" className="glow" asChild>
              <a
                href="https://wa.me/5584988766134?text=Ol%C3%A1%2C%20quero%20criar%20meu%20projeto!"
                target="_blank"
                rel="noopener noreferrer"
              >
                Criar meu projeto <ArrowRight className="ml-2 w-4 h-4" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="/portfolio">
                <Play className="w-4 h-4 mr-2" /> Ver demonstração
              </a>
            </Button>
          </div>
        </motion.div>

        {/* Dashboard mockup */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="hidden lg:block"
        >
          <div className="relative">
            <div className="rounded-xl border border-border bg-card p-6 glow">
              {/* Mock dashboard header */}
              <div className="flex items-center gap-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-destructive" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-xs text-muted-foreground ml-2">dashboard.whstudio.com</span>
              </div>
              {/* Mock stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { label: "Projetos", value: "54" },
                  { label: "Clientes", value: "50+" },
                  { label: "Uptime", value: "99.9%" },
                ].map((s) => (
                  <div key={s.label} className="rounded-lg bg-secondary p-4 text-center">
                    <p className="text-2xl font-bold text-primary">{s.value}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </div>
                ))}
              </div>
              {/* Mock chart */}
              <div className="rounded-lg bg-secondary p-4 h-32 flex items-end gap-1">
                {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-primary/60 rounded-t"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>
            {/* Floating badge */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -bottom-4 -left-4 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-bold shadow-lg"
            >
              +300% vendas 📈
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default Hero;
