import { motion } from "framer-motion";

const items = [
  { title: "Prazo que cabe na realidade", desc: "No ar em até 15 dias úteis. Cronograma combinado antes de qualquer linha de código." },
  { title: "WhatsApp direto comigo", desc: "Sem suporte terceirizado, sem chamado. Quem responde é o mesmo que escreveu o código." },
  { title: "Design que não envelhece", desc: "Tipografia, cor e espaçamento alinhados com o que está sendo feito de bom em 2026." },
  { title: "Código escrito pro seu caso", desc: "Sem tema do WordPress, sem template. Cada funcionalidade feita do zero." },
  { title: "Pagamento já vem ligado", desc: "PIX, cartão, boleto e Stripe configurados. Você recebe direto, sem intermediário." },
];

const Differentials = () => (
  <section className="py-32 border-t border-border">
    <div className="container">
      <div className="grid md:grid-cols-12 gap-8 mb-20">
        <div className="md:col-span-3">
          <p className="eyebrow">[ 05 ] Diferenciais</p>
        </div>
        <div className="md:col-span-9">
          <h2 className="display-huge text-5xl md:text-7xl">
            Por que contratar <br />
            <span className="text-foreground/50">a WH Studio.</span>
          </h2>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-x-16 gap-y-12">
        {items.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            className="flex items-start gap-6 pt-6 border-t border-border"
          >
            <span className="display-huge text-4xl text-foreground/30 shrink-0 w-14">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <h3 className="font-display font-extrabold text-xl mb-2">{item.title}</h3>
              <p className="text-sm text-foreground/70 leading-relaxed">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Differentials;
