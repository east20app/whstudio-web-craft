import { ArrowDown, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="wh-hero" aria-labelledby="wh-hero-title">
      <div className="wh-hero-art" aria-hidden="true">
        <picture>
          <source media="(max-width: 780px)" srcSet="/wh-monograma-mobile.webp" />
          <img src="/wh-monograma.webp" alt="" width={1250} height={782} decoding="async" />
        </picture>
      </div>
      <div className="wh-wrap wh-hero-inner">
        <div className="wh-hero-copy">
          <p className="wh-kicker"><span /> Estúdio digital independente</p>
          <h1 id="wh-hero-title">Construímos o<br /> próximo nível<br /> <em>do digital.</em></h1>
          <p className="wh-hero-description">Sites, sistemas e automações sob medida para empresas que querem avançar.</p>
          <div className="wh-actions">
            <Link to="/orcamento" className="wh-button">Iniciar um projeto <ArrowUpRight size={19} /></Link>
            <Link to="/portfolio" className="wh-text-link">Explorar portfólio <ArrowUpRight size={17} /></Link>
          </div>
        </div>
        <a href="#capacidades" className="wh-scroll"><ArrowDown size={15} /> Explorar o estúdio</a>
      </div>
    </section>
  );
}
