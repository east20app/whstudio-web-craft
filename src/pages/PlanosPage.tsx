import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Plans from "@/components/Plans";
import CTAFinal from "@/components/CTAFinal";
import PageHeader from "@/components/PageHeader";

const PlanosPage = () => (
  <>
    <Header />
    <main className="pt-16">
      <PageHeader
        eyebrow="Planos e investimento"
        title={<>Preço fechado <span className="text-gradient">depois de entender o trabalho</span></>}
        description="Nada de tabela mágica. Eu olho o escopo, integrações e prazo. Aí passo um valor fechado para você decidir sem pressão."
      />

      <Plans />
      <CTAFinal />
    </main>
    <Footer />
    <WhatsAppButton />
  </>
);

export default PlanosPage;
