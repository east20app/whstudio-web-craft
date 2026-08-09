import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Plans from "@/components/Plans";
import PlansComparison from "@/components/PlansComparison";
import CTAFinal from "@/components/CTAFinal";
import Seo, { pageSeo } from "@/components/Seo";
import { motion } from "framer-motion";

const PlanosPage = () => (
  <>
    <Seo {...pageSeo.planos} />
    <Header />
    <main className="pt-16">
      <section className="py-20 md:py-28 border-b border-border">
        <div className="container max-w-4xl">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="eyebrow mb-6"
          >
            Planos e investimento
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="display-huge text-5xl md:text-7xl"
          >
            Valor fechado <em>depois de entender o que você precisa.</em>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-base md:text-lg mt-6 max-w-2xl"
          >
            Cada plano mostra o que entrega. O preço a gente define no WhatsApp, depois de entender
            escopo, integrações e prazo. Sem surpresa no final.
          </motion.p>
        </div>
      </section>

      <Plans />
      <PlansComparison />
      <CTAFinal />
    </main>
    <Footer />
  </>
);

export default PlanosPage;
