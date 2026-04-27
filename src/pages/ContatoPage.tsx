import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Contact from "@/components/Contact";
import { motion } from "framer-motion";

const ContatoPage = () => (
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
            Contato
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-4xl md:text-5xl font-extrabold mt-3 mb-5"
          >
            Vamos tirar sua ideia <span className="text-gradient">do papel</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-base md:text-lg"
          >
            Conte um pouco sobre seu projeto. Devolvemos um orçamento personalizado em até 24 horas úteis.
          </motion.p>
        </div>
      </section>

      <Contact />
    </main>
    <Footer />
    <WhatsAppButton />
  </>
);

export default ContatoPage;
