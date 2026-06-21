import { motion } from "framer-motion";
import { MessageSquare, Code2, Rocket } from "lucide-react";

const steps = [
  {
    icon: MessageSquare,
    step: "01",
    title: "Você me manda mensagem",
    desc: "Chama no WhatsApp e me conta o que precisa — pode ser por áudio, com print, com link de site que você gostou. No mesmo dia eu te respondo com escopo e preço fechado, sem enrolação.",
  },
  {
    icon: Code2,
    step: "02",
    title: "Eu codo e te mostro andando",
    desc: "Começo a programar e te mando preview a cada parte importante. Se tiver algo que você quer mudar, muda — ainda dá tempo, e não custa nada porque ninguém aprovou nada antes da hora.",
  },
  {
    icon: Rocket,
    step: "03",
    title: "Coloco no ar e fico de plantão",
    desc: "Publico, configuro domínio, te ensino a mexer e fico disponível pra ajuste. Se aparecer algo no primeiro mês, não te cobro de novo — faz parte.",
  },
];

const HowItWorks = () => (
  <section className="py-24">
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-2xl mb-16"
      >
        <span className="eyebrow text-primary">Processo</span>
        <h2 className="font-display text-3xl md:text-5xl font-bold mt-3">Como funciona</h2>
        <p className="text-muted-foreground mt-4">
          Um processo simples e transparente, do primeiro contato até a entrega final.
        </p>
      </motion.div>

      {/* Timeline horizontal — sem "Passo 01/02/03" */}
      <div className="relative max-w-5xl mx-auto">
        <div className="hidden md:block absolute top-8 left-[12%] right-[12%] h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <div className="grid md:grid-cols-3 gap-10">
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative"
            >
              <div className="relative w-16 h-16 rounded-full bg-background border border-primary/40 flex items-center justify-center mb-6 mx-auto md:mx-0">
                <s.icon className="w-6 h-6 text-primary" aria-hidden="true" />
              </div>
              <h3 className="font-display text-xl font-bold mb-3">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default HowItWorks;
