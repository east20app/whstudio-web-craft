import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DiscordIcon } from "@/components/icons/DiscordIcon";
import { discordLink, whatsappLink } from "@/config/site";

const CTAFinal = () => (
  <section className="py-24 bg-background">
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative max-w-4xl mx-auto rounded-lg border border-border bg-card p-10 md:p-14 overflow-hidden"
      >
        <div className="grid md:grid-cols-[0.9fr_1.1fr] gap-8 items-center">
          <div>
            <span className="eyebrow text-primary mb-3">Próximo passo</span>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">
              Me manda o problema. Eu digo o caminho.
            </h2>
            <p className="text-muted-foreground text-base md:text-lg">
              Pode ser áudio, print da planilha ou um resumo mal escrito no WhatsApp.
              Se fizer sentido, eu devolvo escopo, prazo e preço. Se não fizer, eu falo também.
            </p>
          </div>

          <div>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-full border-2 border-primary/40 overflow-hidden bg-secondary flex items-center justify-center shrink-0">
                <span className="text-2xl font-extrabold font-display text-primary">W</span>
              </div>
              <div className="text-left">
                <p className="font-semibold font-display text-foreground">Walmry Netto</p>
                <p className="text-sm text-muted-foreground">Desenvolvedor · RN, Brasil</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span className="text-xs text-primary">Atendendo novos projetos</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="lg" asChild>
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-5 h-5 mr-2" /> Falar no WhatsApp
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href={discordLink()} target="_blank" rel="noopener noreferrer">
                  <DiscordIcon className="w-5 h-5 mr-2" /> Entrar no Discord
                </a>
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

export default CTAFinal;
