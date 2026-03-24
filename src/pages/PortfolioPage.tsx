import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Portfolio from "@/components/Portfolio";
import CTAFinal from "@/components/CTAFinal";

const PortfolioPage = () => (
  <>
    <Header />
    <main className="pt-16">
      <Portfolio />
      <CTAFinal />
    </main>
    <Footer />
    <WhatsAppButton />
  </>
);

export default PortfolioPage;
