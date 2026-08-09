import { motion } from "framer-motion";
import { CalendarCheck, MessageSquare, PenTool, Code2, CreditCard } from "lucide-react";

const items = [
  { icon: CalendarCheck, title: "Prazo que cabe na realidade", desc: "No ar em até 15 dias úteis. Cronograma combinado antes de qualquer linha de código." },
  { icon: MessageSquare, title: "WhatsApp direto comigo", desc: "Sem suporte terceirizado, sem chamado. Quem responde é o mesmo que escreveu o código." },
  { icon: PenTool, title: "Design que não envelhece", desc: "Tipografia, cor e espaçamento alinhados com o que está sendo feito de bom hoje." },
  { icon: Code2, title: "Código escrito pro seu caso", desc: "Sem tema do WordPress, sem template. Cada funcionalidade feita do zero." },
  { icon: CreditCard, title: "Pagamento já vem ligado", desc: "PIX, cartão, boleto e Stripe configurados. Você recebe direto, sem intermediário." },
];

const Differentials = () => (
  <section className="py-24 md:py-32 border-t border-border">
    <div className="container">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
        <div>
          <p className="eyebrow mb-4">Diferenciais</p>
          <h2 className="display-huge text-5xl md:text-7xl max-w-2xl">
            Por que contratar <em>a WH Studio.</em>
          </h2>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-x-10">
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
              className="border-t border-border py-7"
            >
              <h3 className="text-lg font-semibold flex items-center gap-3">
                <Icon className="w-4 h-4 text-primary shrink-0" strokeWidth={1.5} />
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mt-2 max-w-md">{item.desc}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);

export default Differentials;
