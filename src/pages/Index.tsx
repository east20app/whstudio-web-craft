import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Portfolio from "@/components/Portfolio";
import HowItWorks from "@/components/HowItWorks";
import WhAI from "@/components/WhAI";
import Footer from "@/components/Footer";
import Seo, { pageSeo, orgJsonLd } from "@/components/Seo";

const stack = [
  ["Interface", "React", "TypeScript", "Vite"],
  ["Dados e autenticação", "Supabase", "PostgreSQL"],
  ["Inteligência artificial", "OpenAI", "Google Gemini", "Anthropic Claude"],
  ["Pagamentos", "Stripe"],
];

export default function Index() {
  return (
    <>
      <Seo {...pageSeo.home} jsonLd={orgJsonLd} />
      <Header />
      <main id="main-content" tabIndex={-1}>
        <Hero />
        <Services />
        <Portfolio />
        <section className="wh-section">
          <div className="container">
            <p className="eyebrow mb-5">Tecnologia</p>
            <h2 className="wh-heading">O que usamos.</h2>
            <div className="wh-service-grid">
              {stack.map(([area, ...tools]) => (
                <details key={area} className="wh-service">
                  <summary className="cursor-pointer font-medium">{area}</summary>
                  <ul className="mt-4 space-y-2 text-muted-foreground">
                    {tools.map(tool => <li key={tool}>{tool}</li>)}
                  </ul>
                </details>
              ))}
            </div>
          </div>
        </section>
        <HowItWorks />
        <WhAI />
      </main>
      <Footer />
    </>
  );
}
