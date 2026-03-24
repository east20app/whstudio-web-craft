import { motion } from "framer-motion";
import { Star, Users } from "lucide-react";

const testimonials = [
  {
    name: "Lucas Mendes",
    role: "CEO, TechFlow",
    text: "A WH Studio entregou nosso sistema completo em apenas 12 dias. Qualidade absurda e suporte incrível.",
  },
  {
    name: "Ana Beatriz",
    role: "Dona, Sabor & Arte",
    text: "Meu site de delivery ficou perfeito! As vendas online aumentaram 300% no primeiro mês.",
  },
  {
    name: "Rafael Costa",
    role: "Admin, Comunidade Discord",
    text: "O bot que criaram para nosso servidor é completo. Moderação, economia, tickets... tudo funcionando perfeitamente.",
  },
];

const SocialProof = () => (
  <section className="py-24">
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
          <Users className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">Mais de 50 clientes atendidos</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold">O que nossos clientes dizem</h2>
      </motion.div>
      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="card-dark-hover p-8"
          >
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, j) => (
                <Star key={j} className="w-4 h-4 fill-primary text-primary" />
              ))}
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">"{t.text}"</p>
            <div>
              <p className="font-semibold text-sm">{t.name}</p>
              <p className="text-xs text-muted-foreground">{t.role}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default SocialProof;
