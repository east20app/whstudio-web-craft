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
  <section className="py-24 md:py-32 border-t border-border">
    <div className="container">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
        <div>
          <p className="eyebrow mb-4">Processo</p>
          <h2 className="display-huge text-5xl md:text-7xl max-w-2xl">
            Três passos. <em>Sem ata de reunião.</em>
          </h2>
        </div>
        <p className="text-muted-foreground max-w-sm md:pb-2">
          Curto, direto e com você acompanhando cada etapa do projeto.
        </p>
      </div>

      <div className="border-t border-border grid md:grid-cols-3">
        {steps.map((s, i) => (
          <motion.div
            key={s.n}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            className="py-8 md:py-10 md:pr-8 md:border-l md:first:border-l-0"
          >
            <p className="font-display text-6xl md:text-7xl leading-none text-foreground/15">{s.n}</p>
            <h3 className="mt-6 text-xl font-semibold">{s.title}</h3>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
