import { motion } from "framer-motion";
import { MessageCircle, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { whatsappLink, discordLink } from "@/config/site";

const CTAFinal = () => (
  <section className="py-28 md:py-32 border-t border-border relative overflow-hidden">
    <div
      className="absolute inset-0 -z-10"
      style={{ background: "var(--gradient-radial-primary)" }}
      aria-hidden
    />
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="grid md:grid-cols-12 gap-8 items-end"
      >
        <div className="md:col-span-8">
          <p className="eyebrow mb-6">[ Próximo passo ]</p>
          <h2 className="display-huge text-4xl md:text-7xl">
            Manda <span className="text-accent-blue glow-text">mensagem</span>. <br />
            Eu mesmo respondo.
          </h2>
        </div>
        <div className="md:col-span-4">
          <p className="text-foreground/70 mb-8 max-w-sm">
            Sou o Walmry. Cola no WhatsApp e a gente conversa sobre o seu projeto sem compromisso.
          </p>
          <div className="flex flex-col gap-3">
            <Button size="lg" className="h-14 px-6 justify-between text-base rounded-full glow-strong btn-glow-hover" asChild>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                <span className="flex items-center"><MessageCircle className="w-4 h-4 mr-2" /> WhatsApp</span>
                <ArrowUpRight className="w-5 h-5" />
              </a>
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-6 justify-between text-base rounded-full border-foreground/20 hover:border-accent-2/50 hover:bg-accent-2/5" asChild>
              <a href={discordLink()} target="_blank" rel="noopener noreferrer">
                <span>Discord da comunidade</span>
                <ArrowUpRight className="w-5 h-5" />
              </a>
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

export default CTAFinal;
