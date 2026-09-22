import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Portfolio from "@/components/Portfolio";
import Services from "@/components/Services";
import WhAI from "@/components/WhAI";
import HowItWorks from "@/components/HowItWorks";
import Differentials from "@/components/Differentials";
import Plans from "@/components/Plans";
import Testimonials from "@/components/Testimonials";
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
    <Portfolio />
    <Services />
    <WhAI />
    <HowItWorks />
    <Differentials />
    <Plans />
    <Testimonials />
    <FAQ />
    <About />
    <CTAFinal />
    <Footer />
  </>
);

export default Index;