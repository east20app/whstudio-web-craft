import { motion } from "framer-motion";

const steps = [
  {
    n: "01",
    title: "Conversa",
    desc: "Você manda mensagem com o problema. No mesmo dia respondo com escopo, prazo e valor fechado — por escrito, sem comercial entre nós.",
    meta: "1 a 3 dias",
  },
  {
    n: "02",
    title: "Construção",
    desc: "Programo em ciclos curtos, com preview real a cada etapa. Você acompanha, ajusta o que importa e nada é aprovado às escuras.",
    meta: "7 a 15 dias",
  },
  {
    n: "03",
    title: "Operação",
    desc: "Publico, configuro domínio, ensino a equipe e fico disponível. Ajustes do primeiro mês fazem parte da entrega — não vão para nova fatura.",
    meta: "+30 dias",
  },
];

const HowItWorks = () => (
  <section className="py-28 md:py-36 bg-secondary/40">
    <div className="container-wide">
      <div className="grid md:grid-cols-12 gap-10 mb-20 items-end rule-b pb-10">
        <div className="md:col-span-2">
          <span className="num-mono text-[11px] text-muted-foreground">§ 03</span>
        </div>
        <div className="md:col-span-7">
          <p className="eyebrow text-muted-foreground mb-4">Método</p>
          <h2 className="display-xl text-[clamp(2.4rem,5vw,4.2rem)]">
            Três fases. Sem <span className="serif-italic">teatro.</span>
          </h2>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-px bg-[hsl(var(--rule))] border-y border-[hsl(var(--rule))]">
        {steps.map((s, i) => (
          <motion.div
            key={s.n}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.55 }}
            className="bg-background p-8 md:p-12 flex flex-col min-h-[340px]"
          >
            <div className="flex items-baseline justify-between mb-12">
              <span className="font-display text-6xl md:text-7xl leading-none text-foreground">
                {s.n}
              </span>
              <span className="num-mono text-[10px] text-muted-foreground">{s.meta}</span>
            </div>
            <h3 className="font-display text-3xl mb-4">{s.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
