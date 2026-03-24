import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Contact from "@/components/Contact";

const ContatoPage = () => (
  <>
    <Header />
    <main className="pt-16">
      <Contact />
    </main>
    <Footer />
    <WhatsAppButton />
  </>
);

export default ContatoPage;
