import { motion } from "framer-motion";
import { Globe, Store, UtensilsCrossed, ShoppingBag, Smartphone, Briefcase } from "lucide-react";

const services = [
  { icon: Briefcase, title: "Empresas", desc: "Sites institucionais que transmitem credibilidade e profissionalismo." },
  { icon: Store, title: "Lojas", desc: "Sites de e-commerce e vitrines digitais que vendem 24 horas por dia." },
  { icon: UtensilsCrossed, title: "Restaurantes", desc: "Cardápios digitais, reservas online e presença marcante na internet." },
  { icon: ShoppingBag, title: "Lanchonetes", desc: "Páginas otimizadas para delivery e pedidos online." },
  { icon: Globe, title: "Sites Institucionais", desc: "Presença online completa para qualquer tipo de negócio." },
  { icon: Smartphone, title: "Landing Pages", desc: "Páginas de alta conversão para campanhas e lançamentos." },
];

const Services = () => (
  <section id="servicos" className="py-24 bg-secondary">
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="text-sm font-medium text-primary uppercase tracking-widest">O que fazemos</span>
        <h2 className="text-3xl md:text-4xl font-bold mt-2">Nossos Serviços</h2>
      </motion.div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="group bg-card rounded-xl p-8 shadow-card hover:shadow-card-hover transition-shadow"
          >
            <div className="w-12 h-12 rounded-lg bg-hero-gradient flex items-center justify-center mb-5">
              <s.icon className="w-6 h-6 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{s.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Services;
