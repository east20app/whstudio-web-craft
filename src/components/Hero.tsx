import { motion } from "framer-motion";
import { whatsappLink } from "@/config/site";

const Hero = () => {
  return (
    <section className="relative pt-32 md:pt-40 pb-24 md:pb-32 overflow-hidden">
      {/* Top meta row — editorial masthead */}
      <div className="container-wide rule-b pb-6 mb-16 md:mb-24 flex items-center justify-between text-[11px] eyebrow text-muted-foreground">
        <span>Vol. 04 · Estúdio independente</span>
        <span className="hidden sm:inline">Natal — Rio Grande do Norte</span>
        <span>
          <span className="text-foreground">Walmry Netto</span> / Engenheiro de software
        </span>
      </div>

      <div className="container-wide grid md:grid-cols-12 gap-y-12 md:gap-x-10 items-end">
        {/* Left column — number + small caption (asymmetric editorial) */}
        <motion.aside
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="md:col-span-2 md:pt-4"
        >
          <div className="num-mono text-[11px] text-muted-foreground mb-3">— 01 / Manifesto</div>
          <p className="text-[13px] text-muted-foreground leading-relaxed max-w-[14rem]">
            Software medido em problemas resolvidos, não em telas entregues.
          </p>
        </motion.aside>

        {/* Headline — magazine-scale serif */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85 }}
          className="md:col-span-10"
        >
          <h1 className="display-xl text-[clamp(3.2rem,10vw,9.5rem)]">
            Engenharia de
            <br />
            software <span className="serif-italic">sob medida,</span>
            <br />
            entregue à mão.
          </h1>
        </motion.div>
      </div>

      {/* Bottom band — three editorial columns */}
      <div className="container-wide mt-20 md:mt-28 grid md:grid-cols-12 gap-y-12 md:gap-x-10 rule-t pt-10">
        <div className="md:col-span-5">
          <p className="text-lg md:text-xl leading-snug text-foreground max-w-xl">
            Construo sistemas, sites e automações para empresas que cresceram além da planilha — com{" "}
            <span className="serif-italic">tempo, código e cabeça</span> de um único engenheiro responsável.
          </p>
        </div>

        <div className="md:col-span-4 md:col-start-7 space-y-5">
          <div className="flex items-baseline gap-4">
            <span className="num-mono text-[11px] text-muted-foreground w-10">→ 01</span>
            <span className="text-sm">Conversa direta, sem comercial intermediário.</span>
          </div>
          <div className="flex items-baseline gap-4">
            <span className="num-mono text-[11px] text-muted-foreground w-10">→ 02</span>
            <span className="text-sm">Escopo fechado e prazo real antes de começar.</span>
          </div>
          <div className="flex items-baseline gap-4">
            <span className="num-mono text-[11px] text-muted-foreground w-10">→ 03</span>
            <span className="text-sm">Código próprio do projeto, mantido por quem escreveu.</span>
          </div>
        </div>

        <div className="md:col-span-2 md:col-start-11 flex md:justify-end">
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-baseline gap-2 text-sm font-medium"
          >
            <span className="ink-link">Iniciar projeto</span>
            <span className="num-mono text-[10px] text-muted-foreground">↗</span>
          </a>
        </div>
      </div>

      {/* Selected work strip */}
      <div className="container-wide mt-24 md:mt-32 rule-t pt-6">
        <div className="flex items-baseline justify-between mb-6">
          <span className="eyebrow text-muted-foreground">Trabalho recente — 2026</span>
          <span className="num-mono text-[10px] text-muted-foreground">04 projetos · 12 dias / em média</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[hsl(var(--rule))] border border-[hsl(var(--rule))]">
          {[
            { name: "Copa Ativa", kind: "Plataforma esportiva", year: "2026" },
            { name: "Peixe Store", kind: "Loja digital", year: "2025" },
            { name: "DroxBot", kind: "Bot Discord + painel", year: "2025" },
            { name: "Serra Delivery", kind: "Sistema de delivery", year: "2026" },
          ].map((p) => (
            <div key={p.name} className="bg-card p-6 group cursor-default">
              <div className="num-mono text-[10px] text-muted-foreground mb-8">{p.year}</div>
              <div className="font-display text-2xl mb-1 leading-none">{p.name}</div>
              <div className="text-xs text-muted-foreground">{p.kind}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
