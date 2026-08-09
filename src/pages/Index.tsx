import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import Plans from "@/components/Plans";
import Differentials from "@/components/Differentials";
import FAQ, { faqJsonLd } from "@/components/FAQ";
import About from "@/components/About";
import CTAFinal from "@/components/CTAFinal";
import Footer from "@/components/Footer";
import Seo, { pageSeo } from "@/components/Seo";

const Index = () => (
  <>
    <Seo {...pageSeo.home} jsonLd={faqJsonLd} />
    <Header />
    <Hero />
    <Services />
    <HowItWorks />
    <Testimonials />
    <Plans />
    <Differentials />
    <FAQ />
    <About />
    <CTAFinal />
    <Footer />
  </>
);

export default Index;
