import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { whatsappLink, discordLink } from "@/config/site";

const DiscordIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.317 4.369A19.79 19.79 0 0 0 16.558 3a14.66 14.66 0 0 0-.642 1.318 18.27 18.27 0 0 0-5.487 0A12.6 12.6 0 0 0 9.785 3a19.74 19.74 0 0 0-3.76 1.37C2.318 9.788 1.408 15.07 1.86 20.275a19.94 19.94 0 0 0 6.073 3.062 14.66 14.66 0 0 0 1.298-2.103 12.83 12.83 0 0 1-2.044-.974c.171-.124.339-.255.5-.39a14.27 14.27 0 0 0 12.629 0c.163.135.33.266.501.39-.65.385-1.336.713-2.046.975a14.6 14.6 0 0 0 1.297 2.102 19.85 19.85 0 0 0 6.073-3.062c.532-6.027-.91-11.262-3.824-15.906ZM9.49 17.155c-1.207 0-2.198-1.108-2.198-2.466 0-1.358.974-2.466 2.198-2.466 1.225 0 2.215 1.108 2.198 2.466 0 1.358-.973 2.466-2.198 2.466Zm5.02 0c-1.207 0-2.198-1.108-2.198-2.466 0-1.358.974-2.466 2.198-2.466 1.225 0 2.215 1.108 2.198 2.466 0 1.358-.973 2.466-2.198 2.466Z" />
  </svg>
);

const CTAFinal = () => (
  <section className="py-24">
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative max-w-4xl mx-auto rounded-2xl border border-primary/30 bg-card p-10 md:p-14 text-center overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-transparent to-transparent pointer-events-none" />
        <div className="relative">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Pronto para tirar sua ideia <span className="text-gradient">do papel</span>?
          </h2>
          <p className="text-muted-foreground text-base md:text-lg mb-10 max-w-xl mx-auto">
            Fale agora pelo WhatsApp ou entre na nossa comunidade no Discord.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" className="glow" asChild>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-5 h-5 mr-2" /> Falar no WhatsApp
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href={discordLink()} target="_blank" rel="noopener noreferrer">
                <DiscordIcon className="w-5 h-5" /> Entrar no Discord
              </a>
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

export default CTAFinal;
