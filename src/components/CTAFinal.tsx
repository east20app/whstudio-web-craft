import { motion } from "framer-motion";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { whatsappLink } from "@/config/site";

const CTAFinal = () => (
  <section className="py-24">
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative max-w-4xl mx-auto rounded-2xl border border-primary/30 bg-card p-10 md:p-14 text-center overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none" />
        <div className="relative">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Pronto para tirar sua ideia <span className="text-gradient">do papel</span>?
          </h2>
          <p className="text-muted-foreground text-base md:text-lg mb-10 max-w-xl mx-auto">
            Fale com a WH Studio agora pelo WhatsApp e receba um orçamento personalizado em poucas horas.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" className="glow" asChild>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-5 h-5 mr-2" />
                Falar no WhatsApp
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/contato">
                Enviar pelo formulário <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

export default CTAFinal;
