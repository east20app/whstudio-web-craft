import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Plans from "@/components/Plans";
import PriceSimulator from "@/components/PriceSimulator";
import CTAFinal from "@/components/CTAFinal";
import { motion } from "framer-motion";

const PlanosPage = () => (
  <>
    <Header />
    <main className="pt-16">
      <section className="py-20 border-b border-border bg-secondary/30">
        <div className="container text-center max-w-3xl">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm font-medium text-primary uppercase tracking-widest"
          >
            Planos e investimento
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-4xl md:text-5xl font-extrabold mt-3 mb-5"
          >
            Preços transparentes, <span className="text-gradient">sem surpresas</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-base md:text-lg"
          >
            Comece pelo plano que faz sentido hoje e evolua conforme seu projeto cresce. Cada plano
            inclui suporte direto pelo WhatsApp.
          </motion.p>
        </div>
      </section>

      <Plans />
      <PriceSimulator />
      <CTAFinal />
    </main>
    <Footer />
    <WhatsAppButton />
  </>
);

export default PlanosPage;
