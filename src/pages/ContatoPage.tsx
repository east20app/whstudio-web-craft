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
      <section className="py-20 border-b border-border bg-secondary/30">
        <div className="container text-center max-w-3xl">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm font-medium text-primary uppercase tracking-widest"
          >
            Contato
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-4xl md:text-5xl font-extrabold mt-3 mb-5"
          >
            Bora tirar sua ideia <span className="text-gradient">do chão</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-base md:text-lg"
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
