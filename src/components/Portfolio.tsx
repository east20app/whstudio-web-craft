import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

const projects = [
  { title: "Peixe Store", category: "E-commerce", desc: "Loja virtual completa com catálogo, carrinho e pagamento integrado.", color: "from-blue-600 to-cyan-600", url: "https://peixestore.shop/" },
  { title: "DeliveryPro", category: "Sistema de Delivery", desc: "Sistema completo de pedidos online com painel administrativo.", color: "from-orange-500 to-red-600", url: "#" },
  { title: "ModBot", category: "Bot Discord", desc: "Bot de moderação com sistema de tickets, economia e logs automáticos.", color: "from-violet-500 to-purple-700", url: "#" },
  { title: "AdminPanel", category: "Dashboard", desc: "Painel administrativo com gráficos, relatórios e gestão de usuários.", color: "from-emerald-500 to-teal-700", url: "#" },
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
        <p className="text-muted-foreground mt-4 max-w-lg mx-auto">Alguns dos projetos que já desenvolvemos para nossos clientes.</p>
      </motion.div>
      <div className="grid md:grid-cols-2 gap-6">
        {projects.map((p, i) => (
          <motion.a
            key={p.title}
            href={p.url}
            target={p.url !== "#" ? "_blank" : undefined}
            rel={p.url !== "#" ? "noopener noreferrer" : undefined}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={`relative rounded-xl overflow-hidden aspect-video bg-gradient-to-br ${p.color} group cursor-pointer block border border-border hover:border-primary/50 transition-all`}
          >
            <div className="absolute inset-0 flex flex-col justify-end p-8">
              <span className="text-sm font-medium text-white/70">{p.category}</span>
              <h3 className="text-2xl font-bold text-white">{p.title}</h3>
              <p className="text-sm text-white/60 mt-1">{p.desc}</p>
            </div>
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <ExternalLink className="w-5 h-5 text-white" />
            </div>
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
          </motion.a>
        ))}
      </div>
    </div>
  </section>
);

export default Portfolio;
