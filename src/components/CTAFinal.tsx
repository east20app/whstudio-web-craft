import { motion } from "framer-motion";
import { ArrowUpRight, MessageCircle, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SignatureUnderline } from "@/components/SignatureScribble";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useOrcamentoAction } from "@/components/tickets/TicketChat";

const CTAFinal = () => {
  const { requestQuote } = useOrcamentoAction();
  const settings = useSiteSettings();
  const waLink = settings.buildWhatsappLink();

  return (
    <section className="py-24 md:py-32">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-lg bg-[#050816] p-6 text-white shadow-[0_35px_120px_rgba(5,8,22,0.35)] md:p-10 lg:p-14"
        >
          <div
            className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(37,99,235,0.42),transparent_28rem),radial-gradient(circle_at_82%_68%,rgba(20,184,166,0.28),transparent_24rem)]"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-grid-faint opacity-30" aria-hidden="true" />

          <div className="relative grid lg:grid-cols-12 gap-10 items-end">
            <div className="lg:col-span-8">
              <p className="eyebrow mb-6 text-white/62">Próximo passo</p>
              <h2 className="display-huge text-5xl md:text-8xl leading-[1.02] text-balance">
                Vamos colocar sua empresa em outro nível. <br />
                <em className="relative inline-block">
                  Eu mesmo respondo.
                  <SignatureUnderline className="absolute left-0 top-full mt-1 w-48 md:w-64 h-[0.38em] text-primary" />
                </em>
              </h2>
            </div>
            <div className="lg:col-span-4">
              <p className="text-white/68 mb-8 max-w-sm leading-relaxed">
                Abra um atendimento pelo chat ou chame no WhatsApp. A conversa já começa com
                contexto e vai direto para escopo, prazo e prioridade.
              </p>
              <div className="flex flex-col gap-3">
                <Button
                  size="lg"
                  className="h-14 rounded-full px-6 justify-between text-base"
                  onClick={() =>
                    requestQuote({ subject: "Projeto novo", prefill: "Quero iniciar um projeto. " })
                  }
                >
                  <span className="flex items-center">
                    <MessageSquare className="w-4 h-4 mr-2" /> Solicitar orçamento
                  </span>
                  <ArrowUpRight className="w-5 h-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 rounded-full border-white/20 bg-white/8 px-6 justify-between text-base text-white hover:bg-white/14 hover:text-white"
                  asChild
                >
                  <a href={waLink} target="_blank" rel="noopener noreferrer">
                    <span className="flex items-center">
                      <MessageCircle className="w-4 h-4 mr-2" /> WhatsApp
                    </span>
                    <span className="font-mono text-xs">{settings.whatsappDisplay}</span>
                  </a>
                </Button>
                <a
                  href={`mailto:${settings.email}`}
                  className="text-xs text-white/55 hover:text-white underline underline-offset-4 transition-colors text-center"
                >
                  {settings.email}
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
