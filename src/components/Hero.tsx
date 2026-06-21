import { motion } from "framer-motion";
import { MessageCircle, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { whatsappLink } from "@/config/site";

const fade = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

const Hero = () => (
  <section className="relative pt-36 pb-24 md:pt-44 md:pb-32 overflow-hidden">
    <div className="container">
      {/* Linha topo: meta editorial */}
      <motion.div
        {...fade}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between mb-14 md:mb-20"
      >
        <div className="flex items-center gap-3 eyebrow">
          <span className="w-6 h-px bg-foreground/40" />
          <span>Estúdio de desenvolvimento</span>
        </div>
        <div className="hidden md:flex items-center gap-3 eyebrow">
          <span>RN · BR</span>
          <span className="w-6 h-px bg-foreground/40" />
          <span>EST. 2023</span>
        </div>
      </motion.div>

      {/* Headline gigante editorial */}
      <motion.h1
        {...fade}
        transition={{ duration: 0.6, delay: 0.05 }}
        className="display-huge text-[14vw] md:text-[10.5vw] lg:text-[9.5rem] leading-[0.9] mb-10"
      >
        Código que <br className="hidden md:block" />
        <span className="italic font-light text-foreground/70">resolve</span> —{" "}
        <span className="text-accent-blue">no ar em 15 dias.</span>
      </motion.h1>

      {/* Linha CTA + descrição assimétrica */}
      <motion.div
        {...fade}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="grid md:grid-cols-12 gap-8 md:gap-12 items-end border-t border-border pt-10"
      >
        <div className="md:col-span-5">
          <p className="eyebrow mb-3">O que fazemos</p>
          <p className="text-base md:text-lg text-foreground/80 leading-relaxed max-w-md">
            Sites, bots de Discord, sistemas internos, APIs e dashboards.
            Direto com quem escreve o código — sem comercial, sem proposta de 12 páginas.
          </p>
        </div>

        <div className="md:col-span-4 md:col-start-7 flex flex-wrap gap-3">
          <Button size="lg" className="rounded-none h-12 px-6" asChild>
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="w-4 h-4 mr-2" /> Iniciar projeto
            </a>
          </Button>
          <Button size="lg" variant="outline" className="rounded-none h-12 px-6 border-foreground/30 hover:bg-foreground hover:text-background" asChild>
            <a href="/portfolio">
              Ver trabalhos <ArrowUpRight className="w-4 h-4 ml-1" />
            </a>
          </Button>
        </div>

        <div className="md:col-span-2 md:col-start-11 text-right">
          <p className="eyebrow mb-1">Resposta</p>
          <p className="text-sm font-medium">em até 24h</p>
        </div>
      </motion.div>

      {/* Métricas reais — linha editorial */}
      <motion.div
        {...fade}
        transition={{ duration: 0.6, delay: 0.25 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 mt-24 md:mt-32 border-t border-border pt-10"
      >
        {[
          { v: "70+", l: "Projetos entregues" },
          { v: "15 dias", l: "Prazo médio" },
          { v: "99.9%", l: "Uptime médio" },
          { v: "1:1", l: "Atendimento direto" },
        ].map((s) => (
          <div key={s.l}>
            <p className="display-huge text-4xl md:text-6xl">{s.v}</p>
            <p className="eyebrow mt-3">{s.l}</p>
          </div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default Hero;
