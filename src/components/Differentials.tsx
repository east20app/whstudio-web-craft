import { motion } from "framer-motion";
import { CalendarCheck, MessageSquare, PenTool, Code2, CreditCard } from "lucide-react";

const items = [
  { icon: CalendarCheck, title: "Prazo que cabe na realidade", desc: "No ar em até 15 dias úteis. Cronograma combinado antes de qualquer linha de código." },
  { icon: MessageSquare, title: "WhatsApp direto comigo", desc: "Sem suporte terceirizado, sem chamado. Quem responde é o mesmo que escreveu o código." },
  { icon: PenTool, title: "Design que não envelhece", desc: "Tipografia, cor e espaçamento alinhados com o que está sendo feito de bom em 2026." },
  { icon: Code2, title: "Código escrito pro seu caso", desc: "Sem tema do WordPress, sem template. Cada funcionalidade feita do zero." },
  { icon: CreditCard, title: "Pagamento já vem ligado", desc: "PIX, cartão, boleto e Stripe configurados. Você recebe direto, sem intermediário." },
];

const accents = ["text-primary", "text-accent-2", "text-primary", "text-accent-2", "text-primary"];

const Differentials = () => (
  <section className="py-28 md:py-32 border-t border-border">
    <div className="container">
      <div className="grid md:grid-cols-12 gap-8 mb-16">
        <div className="md:col-span-3">
          <p className="eyebrow">[ 05 ] Diferenciais</p>
        </div>
        <div className="md:col-span-9">
          <h2 className="display-huge text-4xl md:text-6xl">
            Por que contratar <br />
            <span className="text-foreground/50">a WH Studio.</span>
          </h2>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((item, i) => {
          const Icon = item.icon;
          const accent = accents[i % accents.length];
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="card-premium p-6 md:p-7 flex flex-col"
            >
              <div className={`w-11 h-11 rounded-xl border border-border bg-background/40 flex items-center justify-center mb-5 ${accent}`}>
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-display font-extrabold text-lg mb-2">{item.title}</h3>
              <p className="text-sm text-foreground/70 leading-relaxed">{item.desc}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);

export default Differentials;
