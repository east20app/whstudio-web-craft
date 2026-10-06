import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProjectInquiry from "@/components/ProjectInquiry";
import CTAFinal from "@/components/CTAFinal";
import Seo, { pageSeo, orgJsonLd } from "@/components/Seo";

const OrcamentoPage = () => (
  <>
    <Seo {...pageSeo.orcamento} jsonLd={orgJsonLd} />
    <Header />
    <main id="main-content" tabIndex={-1} className="pt-20">
      <section className="py-20 md:py-28 border-b border-border">
        <div className="container max-w-4xl">
          <p className="eyebrow mb-6">Orçamento sob medida</p>
          <h1 className="display-huge text-5xl md:text-7xl">
            Vamos construir <em>o que seu negócio precisa.</em>
          </h1>
          <p className="text-muted-foreground text-base md:text-lg mt-6 max-w-2xl">
            Sites, sistemas, automações e integrações feitos a partir do seu objetivo. Conte o
            que precisa funcionar e vamos definir juntos o escopo do projeto.
          </p>
        </div>
      </section>

      <ProjectInquiry />
      <CTAFinal />
    </main>
    <Footer />
  </>
);

export default OrcamentoPage;


