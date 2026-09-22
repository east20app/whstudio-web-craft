import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Portfolio from "@/components/Portfolio";
import CTAFinal from "@/components/CTAFinal";
import Seo, { pageSeo, orgJsonLd } from "@/components/Seo";
import { motion } from "framer-motion";

const PortfolioPage = () => (
  <>
    <Seo {...pageSeo.portfolio} jsonLd={orgJsonLd} />
    <Header />
    <main className="pt-16">
      <section className="py-20 md:py-28 border-b border-border">
        <div className="container max-w-4xl">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="eyebrow mb-6"
          >
            Portfólio
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="display-huge text-5xl md:text-7xl"
          >
            Coisas que a gente <em>já colocou no ar.</em>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-base md:text-lg mt-6 max-w-2xl"
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
