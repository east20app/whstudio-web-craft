import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import HowItWorks from "@/components/HowItWorks";
import Differentials from "@/components/Differentials";
import Plans from "@/components/Plans";
import Testimonials from "@/components/Testimonials";
import CTAFinal from "@/components/CTAFinal";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const Index = () => (
  <>
    <Header />
    <main>
      <Hero />
      <Services />
      <HowItWorks />
      <Differentials />
      <Plans />
      <Testimonials />
      <CTAFinal />
    </main>
    <Footer />
    <WhatsAppButton />
  </>
);

export default Index;
