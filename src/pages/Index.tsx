import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProvaConfianca from "@/components/ProvaConfianca";
import Services from "@/components/Services";
import TiposDeProjetos from "@/components/TiposDeProjetos";
import Portfolio from "@/components/Portfolio";
import HowItWorks from "@/components/HowItWorks";
import SolucoesEmpresas from "@/components/SolucoesEmpresas";
import WhAI from "@/components/WhAI";
import Plans from "@/components/Plans";
import Testimonials from "@/components/Testimonials";
import FAQ, { faqJsonLd } from "@/components/FAQ";
import About from "@/components/About";
import CTAFinal from "@/components/CTAFinal";
import Footer from "@/components/Footer";
import Seo, { pageSeo, orgJsonLd } from "@/components/Seo";

const Index = () => (
  <>
    <Seo {...pageSeo.home} jsonLd={{ ...faqJsonLd, ...orgJsonLd }} />
    <Header />
    <main>
      <Hero />
      <ProvaConfianca />
      <Services />
      <TiposDeProjetos />
      <Portfolio />
      <HowItWorks />
      <SolucoesEmpresas />
      <WhAI />
      <Plans />
      <Testimonials />
      <About />
      <FAQ />
      <CTAFinal />
    </main>
    <Footer />
  </>
);

export default Index;