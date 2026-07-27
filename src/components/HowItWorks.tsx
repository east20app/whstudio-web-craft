import { motion } from "framer-motion";
import { MessageCircle, Code2, Rocket } from "lucide-react";

const steps = [
  {
    icon: MessageCircle,
    n: "01",
    title: "Você manda mensagem",
    desc: "Chama no WhatsApp, manda áudio, print, link. No mesmo dia te respondo com escopo e preço fechado, sem enrolação.",
  },
  {
    icon: Code2,
    n: "02",
    title: "Eu codo e te mostro andando",
    desc: "Programo e te mando preview a cada parte importante. Se quiser mudar algo, muda — ainda dá tempo.",
  },
  {
    icon: Rocket,
    n: "03",
    title: "No ar e de plantão",
    desc: "Publico, configuro domínio, te ensino a mexer. Se aparecer algo no primeiro mês, não cobro de novo.",
  },
];

const HowItWorks = () => (
  <section className="py-28 md:py-32 border-t border-border">
    <div className="container">
      <div className="grid md:grid-cols-12 gap-8 mb-16">
        <div className="md:col-span-3">
          <p className="eyebrow">[ 02 ] Processo</p>
        </div>
        <div className="md:col-span-9">
          <h2 className="display-huge text-4xl md:text-6xl">
            Três passos. <span className="text-foreground/50">Sem ata de reunião.</span>
          </h2>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-px bg-border rounded-xl overflow-hidden border border-border">
        {steps.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-background p-8 md:p-10 flex flex-col min-h-[280px]"
            >
              <div className="flex items-baseline justify-between mb-10">
                <span className="font-display font-extrabold text-5xl md:text-6xl text-foreground/10 leading-none">
                  {s.n}
                </span>
                <Icon className="w-5 h-5 text-foreground/60" strokeWidth={1.5} />
              </div>
              <h3 className="font-display text-xl md:text-2xl font-extrabold mb-3 tracking-tight">{s.title}</h3>
              <p className="text-sm text-foreground/65 leading-relaxed">{s.desc}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);

export default HowItWorks;
