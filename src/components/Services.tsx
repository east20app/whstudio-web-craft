import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { usePublicServices, toPublicService } from "@/hooks/usePublicServices";
import { services as configServices } from "@/config/site";

export default function Services() {
  const live = usePublicServices();
  const list = live ?? configServices.map(toPublicService);

  return (
    <section id="servicos" className="wh-section">
      <div className="container">
        <p className="eyebrow mb-5">Serviços</p>
        <h2 className="wh-heading max-w-5xl">SOLUÇÕES DIGITAIS COM IMPACTO REAL.</h2>
        <div className="wh-service-grid">
          {list.map(({ key, title, desc, icon: Icon }, index) => (
            <motion.article key={key} className="wh-service" initial={{ y: 12 }} whileInView={{ y: 0 }}
              viewport={{ once: true }} transition={{ duration: .35, delay: index % 3 * .06 }}>
              <Icon className="text-primary" size={30} strokeWidth={1.4} aria-hidden="true" />
              <h3>{title}</h3>
              <p className="text-muted-foreground">{desc}</p>
              <Link className="wh-button" to={`/orcamento?servico=${encodeURIComponent(title)}`}>Solicitar orçamento<span className="sr-only"> para {title}</span></Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
