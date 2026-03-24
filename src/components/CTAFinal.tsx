import { motion } from "framer-motion";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const CTAFinal = () => (
  <section className="py-24">
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-3xl mx-auto text-center"
      >
        <h2 className="text-3xl md:text-5xl font-bold mb-6">
          Pronto para transformar sua ideia em um{" "}
          <span className="text-gradient">sistema real</span>?
        </h2>
        <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
          Entre em contato agora e receba um orçamento personalizado. Seu projeto pode estar no ar em até 15 dias.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="glow" asChild>
            <a
              href="https://wa.me/5584988766134?text=Ol%C3%A1%2C%20quero%20criar%20meu%20projeto!"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Falar no WhatsApp
            </a>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <a href="/contato">
              Criar projeto agora <ArrowRight className="w-4 h-4 ml-2" />
            </a>
          </Button>
        </div>
      </motion.div>
    </div>
  </section>
);

export default CTAFinal;
