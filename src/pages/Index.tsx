import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Portfolio from "@/components/Portfolio";
import SystemDemo from "@/components/SystemDemo";
import Testimonials from "@/components/Testimonials";
import FAQ, { faqJsonLd } from "@/components/FAQ";
import Footer from "@/components/Footer";
import Seo, { pageSeo, orgJsonLd } from "@/components/Seo";

const capabilities = [
  ["Sites e lojas", "Experiências digitais para apresentar sua marca e vender online.", "/servicos#criacao-sites"],
  ["Sistemas empresariais", "Painéis, permissões e fluxos para organizar sua operação.", "/sistemas"],
  ["Automações e APIs", "Integrações que conectam ferramentas e reduzem tarefas manuais.", "/servicos#automacao"],
  ["Inteligência artificial", "Ferramentas para transformar ideias em software, com código editável.", "/ai"],
];

const process = [
  ["Diagnóstico", "Mapeamos o processo, os usuários e o que precisa funcionar depois da entrega."],
  ["Projeto", "Definimos escopo, arquitetura e interface antes de construir."],
  ["Desenvolvimento", "Entregamos em etapas para validar os fluxos com quem vai usar."],
  ["Entrega", "Testamos, documentamos e alinhamos a operação com sua equipe."],
];

export default function Index() {
  return (
    <>
      <Seo {...pageSeo.home} jsonLd={{ "@context": "https://schema.org", "@graph": [orgJsonLd, faqJsonLd] }} />
      <Header />
      <main id="main-content" tabIndex={-1} className="wh-home">
        <Hero />
        <section id="capacidades" className="wh-section">
          <div className="wh-wrap wh-editorial">
            <div>
              <p className="wh-kicker"><span /> Serviços</p>
              <h2>Design e código.<br />Do começo ao fim.</h2>
              <Link to="/servicos" className="wh-text-link wh-section-link">Todos os serviços <ArrowUpRight size={18} /></Link>
            </div>
            <ul className="wh-capabilities">
              {capabilities.map(([title, description, to]) => (
                <li key={title}><Link to={to}><div><h3>{title}</h3><p>{description}</p></div><ArrowUpRight size={22} /></Link></li>
              ))}
            </ul>
          </div>
        </section>
        <Portfolio preview />
        <section className="wh-section">
          <div className="wh-wrap wh-editorial">
            <div>
              <p className="wh-kicker"><span /> Sistemas para empresas</p>
              <h2>O trabalho<br />em andamento.</h2>
              <p className="wh-body mt-5">Experimente um fluxo de operação. Alterne o status das tarefas e acompanhe a fila.</p>
              <Link to="/sistemas" className="wh-text-link wh-section-link">Ver soluções empresariais <ArrowUpRight size={18} /></Link>
            </div>
            <SystemDemo />
          </div>
        </section>
        <section className="wh-section wh-process">
          <div className="wh-wrap wh-editorial">
            <div><p className="wh-kicker"><span /> Metodologia</p><h2>Da conversa<br />à operação.</h2></div>
            <ol>
              {process.map(([title, description], index) => (
                <motion.li key={title} initial={{ y: 10 }} whileInView={{ y: 0 }} viewport={{ once: true }}>
                  <span>0{index + 1}</span><div><h3>{title}</h3><p>{description}</p></div>
                </motion.li>
              ))}
            </ol>
          </div>
        </section>
        <section className="wh-section">
          <div className="wh-wrap wh-editorial">
            <div><p className="wh-kicker"><span /> WH Studio AI</p><h2>Da ideia<br />ao código.</h2></div>
            <div><p className="wh-body">Descreva o que quer construir. Revise arquivos, visualize a interface e exporte seu projeto no estúdio.</p><Link to="/ai" className="wh-button wh-section-link">Abrir WH Studio AI <ArrowUpRight size={19} /></Link></div>
          </div>
        </section>
        <Testimonials />
        <FAQ />
        <section className="wh-section wh-contact-band">
          <div className="wh-wrap wh-editorial"><h2>Vamos construir<br />seu próximo projeto?</h2><Link to="/orcamento" className="wh-button">Solicitar orçamento <ArrowUpRight size={19} /></Link></div>
        </section>
      </main>
      <Footer />
    </>
  );
}
