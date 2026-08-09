import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Portfolio from "@/components/Portfolio";
import CTAFinal from "@/components/CTAFinal";
import Seo, { pageSeo } from "@/components/Seo";
import { motion } from "framer-motion";

const PortfolioPage = () => (
  <>
    <Seo {...pageSeo.portfolio} />
    <Header />
    <main className="pt-16">
      <section className="py-20 border-b border-border bg-secondary/30">
        <div className="container text-center max-w-3xl">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm font-medium text-primary uppercase tracking-widest"
          >
            Portfólio
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-4xl md:text-5xl font-extrabold mt-3 mb-5"
          >
            Coisas que a gente <span className="text-gradient">já colocou no ar</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-base md:text-lg"
          >
            Sites, sistemas e bots que entregamos pra clientes de delivery, comunidade, evento e loja virtual.
          </motion.p>
        </div>
      </section>

      <Portfolio />
      <CTAFinal />
    </main>
    <Footer />
  </>
);

export default PortfolioPage;
