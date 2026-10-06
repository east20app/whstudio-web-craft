import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Contact from "@/components/Contact";
import Seo, { pageSeo, orgJsonLd } from "@/components/Seo";

const ContatoPage = () => (
  <>
    <Seo {...pageSeo.contato} jsonLd={orgJsonLd} />
    <Header />
    <main id="main-content" tabIndex={-1} className="pt-20">
      <section className="py-20 md:py-28 border-b border-border">
        <div className="container max-w-4xl">
          <p className="eyebrow mb-6">Contato</p>
          <h1 className="display-huge text-5xl md:text-7xl">
            Vamos falar sobre <em>seu projeto.</em>
          </h1>
          <p className="text-muted-foreground text-base md:text-lg mt-6 max-w-2xl">
            Conte o que sua empresa precisa. Nossa equipe retorna para alinhar o escopo e preparar uma proposta.
          </p>
        </div>
      </section>

      <Contact />
    </main>
    <Footer />
  </>
);

export default ContatoPage;
