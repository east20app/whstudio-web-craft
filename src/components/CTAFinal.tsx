import { motion } from "framer-motion";
import { whatsappLink, discordLink, siteConfig } from "@/config/site";

const CTAFinal = () => (
  <section className="py-32 md:py-44 bg-foreground text-background relative overflow-hidden">
    <div className="container-wide relative">
      <div className="grid md:grid-cols-12 gap-10 items-end">
        <div className="md:col-span-2">
          <span className="num-mono text-[11px] text-background/50">§ 06</span>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="md:col-span-10"
        >
          <p className="eyebrow text-background/60 mb-8">Próximo passo</p>
          <h2 className="display-xl text-background text-[clamp(2.8rem,8vw,7.5rem)] mb-12">
            Conta o que <span className="serif-italic">precisa rodar</span>
            <br />— eu respondo hoje.
          </h2>
        </motion.div>
      </div>

      <div className="grid md:grid-cols-12 gap-10 mt-12 rule-t border-background/15 pt-10">
        <div className="md:col-span-5 md:col-start-3">
          <p className="text-background/70 text-base md:text-lg leading-relaxed">
            Quem responde sou eu, <span className="serif-italic text-background">Walmry</span> — sem assistente, sem formulário automático. Conversa por WhatsApp ou Discord, em horário comercial brasileiro.
          </p>
        </div>

        <div className="md:col-span-4 md:col-start-9 space-y-4">
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-baseline justify-between rule-b border-background/30 pb-3 group"
          >
            <div>
              <div className="num-mono text-[10px] text-background/50 mb-1">WHATSAPP / direto</div>
              <div className="font-display text-2xl">{siteConfig.whatsapp.display}</div>
            </div>
            <span className="num-mono text-sm text-background/70 group-hover:text-background transition-colors">↗</span>
          </a>
          <a
            href={discordLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-baseline justify-between rule-b border-background/30 pb-3 group"
          >
            <div>
              <div className="num-mono text-[10px] text-background/50 mb-1">DISCORD / comunidade</div>
              <div className="font-display text-2xl">discord.gg/whstudio</div>
            </div>
            <span className="num-mono text-sm text-background/70 group-hover:text-background transition-colors">↗</span>
          </a>
          <a
            href={`mailto:${siteConfig.email}`}
            className="flex items-baseline justify-between pb-3 group"
          >
            <div>
              <div className="num-mono text-[10px] text-background/50 mb-1">E-MAIL / formal</div>
              <div className="font-display text-2xl">{siteConfig.email}</div>
            </div>
            <span className="num-mono text-sm text-background/70 group-hover:text-background transition-colors">↗</span>
          </a>
        </div>
      </div>
    </div>
  </section>
);

export default CTAFinal;
