import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Contact from "@/components/Contact";
import Seo, { pageSeo } from "@/components/Seo";

const ContatoPage = () => (
  <>
    <Seo {...pageSeo.contato} />
    <Header />
    <main className="pt-16">
      <section className="py-20 md:py-28 border-b border-border">
        <div className="container max-w-4xl">
          <p className="eyebrow mb-6">Contato</p>
          <h1 className="display-huge text-5xl md:text-7xl">
            Bora tirar sua ideia <em>do chão.</em>
          </h1>
          <p className="text-muted-foreground text-base md:text-lg mt-6 max-w-2xl">
            Me conta o que você precisa. Eu devolvo um orçamento fechado em até 24 horas úteis.
          </p>
        </div>
      </section>

      <Contact />
    </main>
    <Footer />
  </>
);

export default ContatoPage;
