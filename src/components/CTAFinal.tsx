import { motion } from "framer-motion";
import { MessageCircle, MessageSquare, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { whatsappLink, siteConfig } from "@/config/site";
import { useOrcamentoAction } from "@/components/tickets/TicketChat";

const CTAFinal = () => {
  const { requestQuote } = useOrcamentoAction();
  return (
    <section className="py-24 md:py-32 border-t border-border">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="border-t border-border pt-16 md:pt-20"
        >
          <p className="eyebrow mb-6">Próximo passo</p>
          <div className="grid lg:grid-cols-12 gap-10 items-end">
            <div className="lg:col-span-8">
              <h2 className="display-huge text-5xl md:text-8xl leading-[1.02]">
                Bora começar. <br />
                <em>Eu mesmo respondo.</em>
              </h2>
            </div>
            <div className="lg:col-span-4">
              <p className="text-muted-foreground mb-8 max-w-sm">
                Abre um atendimento e acompanha a resposta aqui mesmo — ou, se preferir, chama no
                WhatsApp, que é direto com quem programa.
              </p>
              <div className="flex flex-col gap-3">
                <Button
                  size="lg"
                  className="h-14 px-6 justify-between text-base rounded-none"
                  onClick={() => requestQuote({ subject: "Projeto novo", prefill: "Quero iniciar um projeto. " })}
                >
                  <span className="flex items-center">
                    <MessageSquare className="w-4 h-4 mr-2" /> Iniciar projeto por chat
                  </span>
                  <ArrowUpRight className="w-5 h-5" />
                </Button>
                <Button size="lg" variant="outline" className="h-14 px-6 justify-between text-base rounded-none" asChild>
                  <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                    <span className="flex items-center"><MessageCircle className="w-4 h-4 mr-2" /> Prefiro WhatsApp</span>
                    <ArrowUpRight className="w-5 h-5" />
                  </a>
                </Button>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors text-center"
                >
                  {siteConfig.email}
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTAFinal;
