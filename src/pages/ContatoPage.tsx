import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Contact from "@/components/Contact";
import Seo, { pageSeo } from "@/components/Seo";
import { motion } from "framer-motion";

const ContatoPage = () => (
  <>
    <Seo {...pageSeo.contato} />
    <Header />
    <main className="pt-16">
      <section className="py-20 md:py-28 border-b border-border">
        <div className="container max-w-4xl">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="eyebrow mb-6"
          >
            Contato
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="display-huge text-5xl md:text-7xl"
          >
            Bora tirar sua ideia <em>do chão.</em>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-base md:text-lg mt-6 max-w-2xl"
          >
            Me conta o que você precisa. Eu devolvo um orçamento fechado em até 24 horas úteis.
          </motion.p>
        </div>
      </section>

      <Contact />
    </main>
    <Footer />
  </>
);

export default ContatoPage;
