import { motion } from "framer-motion";
import { Zap, MessageCircle, Palette, Settings, CreditCard } from "lucide-react";

const items = [
  { icon: Zap, title: "Entrega rápida", desc: "Projetos entregues em até 15 dias úteis." },
  { icon: MessageCircle, title: "Suporte via WhatsApp", desc: "Comunicação direta e ágil durante todo o projeto." },
  { icon: Palette, title: "Design premium", desc: "Layouts modernos e profissionais que impressionam." },
  { icon: Settings, title: "Sistemas personalizados", desc: "Soluções sob medida para cada tipo de negócio." },
  { icon: CreditCard, title: "Integração com pagamentos", desc: "Stripe, PIX, boleto e muito mais integrados ao seu sistema." },
];

const Differentials = () => (
  <section className="py-24 bg-secondary">
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="text-sm font-medium text-primary uppercase tracking-widest">Por que nos escolher</span>
        <h2 className="text-3xl md:text-4xl font-bold mt-2">Nossos Diferenciais</h2>
      </motion.div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {items.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="flex items-start gap-4 p-6"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              <item.icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Differentials;
