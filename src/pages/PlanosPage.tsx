import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Plans from "@/components/Plans";
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
            Valor fechado <span className="text-gradient">depois de entender o que você precisa</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-base md:text-lg"
          >
            Cada plano mostra o que entrega. O preço a gente define no WhatsApp, depois de entender
            escopo, integrações e prazo. Sem surpresa no final.
          </motion.p>
        </div>
      </section>

      <Plans />
      <CTAFinal />
    </main>
    <Footer />
  </>
);

export default PlanosPage;
