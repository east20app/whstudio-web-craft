import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Portfolio from "@/components/Portfolio";
import CTAFinal from "@/components/CTAFinal";
import PageHeader from "@/components/PageHeader";

const PortfolioPage = () => (
  <>
    <Header />
    <main className="pt-16">
      <PageHeader
        eyebrow="Portfólio"
        title={<>Projetos que <span className="text-gradient">saíram do papel</span></>}
        description="Sistemas, sites e bots com tela, regra de negócio e gente usando. Sem mockup inventado para parecer maior."
      />

      <Portfolio />
      <CTAFinal />
    </main>
    <Footer />
    <WhatsAppButton />
  </>
);

export default PortfolioPage;
