import { motion } from "framer-motion";

const projects = [
  { title: "Portal Municipal", category: "Prefeitura", color: "from-blue-600 to-blue-800", url: "#" },
  { title: "Sabor & Arte", category: "Restaurante", color: "from-orange-500 to-red-600", url: "#" },
  { title: "Peixe Store", category: "E-commerce", color: "from-emerald-500 to-teal-700", url: "https://peixestore.shop/" },
  { title: "Tech Solutions", category: "Empresa", color: "from-violet-500 to-indigo-700", url: "#" },
];

const Portfolio = () => (
  <section id="portfolio" className="py-24">
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="text-sm font-medium text-primary uppercase tracking-widest">Nosso trabalho</span>
        <h2 className="text-3xl md:text-4xl font-bold mt-2">Portfólio</h2>
      </motion.div>
      <div className="grid md:grid-cols-2 gap-6">
        {projects.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={`relative rounded-xl overflow-hidden aspect-video bg-gradient-to-br ${p.color} group cursor-pointer`}
          >
            <div className="absolute inset-0 flex flex-col justify-end p-8">
              <span className="text-sm font-medium text-primary-foreground/70">{p.category}</span>
              <h3 className="text-2xl font-bold text-primary-foreground">{p.title}</h3>
            </div>
            <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-colors" />
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Portfolio;
