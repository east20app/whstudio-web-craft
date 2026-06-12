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
        className="grid md:grid-cols-[1fr_2fr] gap-8 mb-16 items-end"
      >
        <div>
          <span className="eyebrow text-primary">Por que nos escolher</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold mt-3">Nossos diferenciais</h2>
        </div>
        <p className="text-muted-foreground md:text-lg">
          A diferença que você sente desde o primeiro WhatsApp — e que continua depois do projeto no ar.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-x-10 gap-y-8 max-w-5xl">
        {items.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="flex items-start gap-5 py-4 border-t border-border"
          >
            <span className="font-display text-4xl font-extrabold text-gradient leading-none shrink-0 w-12">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <h3 className="font-display font-semibold text-lg mb-1.5">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Differentials;
