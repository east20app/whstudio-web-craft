import { motion } from "framer-motion";
import { Zap, MessageCircle, Palette, Settings, CreditCard } from "lucide-react";

const items = [
  { icon: Zap, title: "Prazo que cabe na realidade", desc: "Projeto entra no ar em até 15 dias úteis. Antes de começar, te mando um cronograma com cada etapa pra você acompanhar e não ficar no escuro." },
  { icon: MessageCircle, title: "WhatsApp direto comigo", desc: "Sem suporte terceirizado, sem chamado, sem fila. Quem responde é o Walmry — o mesmo que escreveu o código. Dúvida resolvida no mesmo dia, geralmente em minutos." },
  { icon: Palette, title: "Design que não envelhece em 6 meses", desc: "Layout pensado pro seu cliente entender o que você faz em 3 segundos. Tipografia, cor e espaçamento alinhados com o que está sendo feito de bom em 2026." },
  { icon: Settings, title: "Código escrito pro seu caso", desc: "Nada de tema do WordPress nem template comprado. Cada funcionalidade é feita do zero, então o sistema cresce junto com o seu negócio sem virar gambiarra." },
  { icon: CreditCard, title: "Pagamento já vem ligado", desc: "PIX, cartão, boleto e Stripe configurados no projeto. Você recebe na sua conta direto, sem intermediário cobrando taxa de gateway escondida." },
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
