import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Contact from "@/components/Contact";
import PageHeader from "@/components/PageHeader";

const ContatoPage = () => (
  <>
    <Header />
    <main className="pt-16">
      <PageHeader
        eyebrow="Contato"
        title={<>Me mande <span className="text-gradient">o problema</span></>}
        description="Não precisa chegar com briefing bonito. Print, áudio e planilha quebrada já ajudam bastante."
      />

      <Contact />
    </main>
    <Footer />
    <WhatsAppButton />
  </>
);

export default ContatoPage;
