import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Plans from "@/components/Plans";
import PlansComparison from "@/components/PlansComparison";
import CTAFinal from "@/components/CTAFinal";
import Seo, { pageSeo } from "@/components/Seo";

const PlanosPage = () => (
  <>
    <Seo {...pageSeo.planos} />
    <Header />
    <main className="pt-16">
      <section className="py-20 md:py-28 border-b border-border">
        <div className="container max-w-4xl">
          <p className="eyebrow mb-6">Planos e investimento</p>
          <h1 className="display-huge text-5xl md:text-7xl">
            Valor fechado <em>depois de entender o que você precisa.</em>
          </h1>
          <p className="text-muted-foreground text-base md:text-lg mt-6 max-w-2xl">
            Cada plano mostra o que entrega. O preço a gente define no WhatsApp, depois de entender
            escopo, integrações e prazo. Sem surpresa no final.
          </p>
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
