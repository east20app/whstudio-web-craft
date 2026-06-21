import { motion } from "framer-motion";

const steps = [
  {
    n: "01",
    title: "Você manda mensagem",
    desc: "Chama no WhatsApp, manda áudio, print, link. No mesmo dia te respondo com escopo e preço fechado, sem enrolação.",
  },
  {
    n: "02",
    title: "Eu codo e te mostro andando",
    desc: "Programo e te mando preview a cada parte importante. Se quiser mudar algo, muda — ainda dá tempo.",
  },
  {
    n: "03",
    title: "No ar e de plantão",
    desc: "Publico, configuro domínio, te ensino a mexer. Se aparecer algo no primeiro mês, não cobro de novo.",
  },
];

const HowItWorks = () => (
  <section className="py-32 border-t border-border">
    <div className="container">
      <div className="grid md:grid-cols-12 gap-8 mb-20">
        <div className="md:col-span-3">
          <p className="eyebrow">[ 02 ] Processo</p>
        </div>
        <div className="md:col-span-9">
          <h2 className="display-huge text-5xl md:text-7xl">
            Três passos. <span className="text-foreground/50">Sem ata de reunião.</span>
          </h2>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-px bg-border border border-border">
        {steps.map((s, i) => (
          <motion.div
            key={s.n}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-background p-8 md:p-10 min-h-[260px] flex flex-col"
          >
            <p className="display-huge text-7xl md:text-8xl text-foreground/15 mb-6">{s.n}</p>
            <h3 className="font-display text-xl md:text-2xl font-extrabold mb-3">{s.title}</h3>
            <p className="text-sm text-foreground/70 leading-relaxed">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
