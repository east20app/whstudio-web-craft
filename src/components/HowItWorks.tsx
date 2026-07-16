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
  <section className="py-28 md:py-32 border-t border-border relative overflow-hidden">
    <div
      className="absolute inset-0 -z-10 opacity-60"
      style={{ background: "var(--gradient-radial-accent-2)" }}
      aria-hidden
    />
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

      <div className="relative">
        {/* Linha conectora sutil */}
        <div
          className="hidden md:block absolute top-14 left-[8%] right-[8%] h-px pointer-events-none"
          style={{
            background: "linear-gradient(90deg, transparent, hsl(var(--primary) / 0.35), hsl(var(--accent-2) / 0.35), transparent)",
          }}
          aria-hidden
        />

        <div className="grid md:grid-cols-3 gap-5 md:gap-6 relative">
          {steps.map((s, i) => {
            const Icon = s.icon;
            const isMid = i === 1;
            return (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`card-premium p-7 md:p-8 min-h-[260px] flex flex-col ${isMid ? "md:mt-6" : ""}`}
              >
                <div className={`relative w-12 h-12 rounded-xl border border-primary/30 bg-primary/10 flex items-center justify-center mb-5 ${isMid ? "text-accent-2 border-accent-2/30 bg-accent-2/10" : "text-primary"}`}>
                  <Icon className="w-5 h-5" />
                  <span className="absolute -top-2 -right-2 text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-background border border-border">
                    {s.n}
                  </span>
                </div>
                <h3 className="font-display text-xl md:text-2xl font-extrabold mb-3">{s.title}</h3>
                <p className="text-sm text-foreground/70 leading-relaxed">{s.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  </section>
);

export default HowItWorks;
