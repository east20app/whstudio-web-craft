import { motion } from "framer-motion";
import { MessageSquare, Code2, Rocket } from "lucide-react";

const steps = [
  {
    icon: MessageSquare,
    step: "01",
    title: "Conversamos sobre sua ideia",
    desc: "Você nos conta seu projeto pelo WhatsApp. Em poucas horas devolvemos um escopo e um orçamento personalizado.",
  },
  {
    icon: Code2,
    step: "02",
    title: "Desenvolvemos sob medida",
    desc: "Nossa equipe coloca a mão no código com tecnologias modernas, alinhando cada etapa com você.",
  },
  {
    icon: Rocket,
    step: "03",
    title: "Entregamos e damos suporte",
    desc: "Seu projeto vai ao ar pronto para uso, com suporte direto e ajustes inclusos no plano contratado.",
  },
];

const HowItWorks = () => (
  <section className="py-24 bg-secondary">
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="text-sm font-medium text-primary uppercase tracking-widest">Processo</span>
        <h2 className="text-3xl md:text-4xl font-bold mt-2">Como funciona</h2>
        <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
          Um processo simples e transparente, do primeiro contato até a entrega final.
        </p>
      </motion.div>
      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {steps.map((s, i) => (
          <motion.div
            key={s.step}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
              <s.icon className="w-7 h-7 text-primary" aria-hidden="true" />
            </div>
            <span className="text-xs font-bold text-primary uppercase tracking-widest">Passo {s.step}</span>
            <h3 className="text-xl font-bold mt-2 mb-3">{s.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
