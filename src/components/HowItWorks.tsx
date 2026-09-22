import { motion } from "framer-motion";

const steps = [
  {
    n: "01",
    title: "Você explica.",
    desc: "Chama no WhatsApp e conta o que precisa existir — do jeito que vier à cabeça: áudio, print, link.",
  },
  {
    n: "02",
    title: "Eu construo.",
    desc: "Escrevo o código do zero e te mostro funcionando etapa por etapa. Mudou de ideia no caminho? Muda.",
  },
  {
    n: "03",
    title: "Você acompanha.",
    desc: "Preview em cada etapa importante. Você vê o projeto nascendo — sem surpresa no dia da entrega.",
  },
  {
    n: "04",
    title: "Vai para produção.",
    desc: "Publico, configuro domínio, te treino pra mexer sozinho e fico de plantão no período de suporte.",
  },
];

const HowItWorks = () => (
  <section id="processo" className="py-24 md:py-32 border-t border-border">
    <div className="container">
      <div className="grid lg:grid-cols-12 gap-8 items-end mb-16">
        <div className="lg:col-span-8">
          <p className="eyebrow mb-5">Processo</p>
          <h2 className="display-huge text-5xl md:text-7xl max-w-3xl">
            Quatro etapas. <em>Sem ata de reunião.</em>
          </h2>
        </div>
        <p className="lg:col-span-4 text-sm md:text-base text-muted-foreground leading-relaxed max-w-md">
          Curto, direto e com você acompanhando cada etapa. Cada passo pode ocupar
          o tempo que precisar — o que não muda é a conversa de uma pessoa só.
        </p>
      </div>

      <ol className="grid md:grid-cols-2 lg:grid-cols-4 gap-y-10 md:gap-y-0 border-t border-border md:divide-x md:divide-border">
        {steps.map((s, i) => (
          <motion.li
            key={s.n}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-8%" }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="pt-8 lg:pt-10 lg:pr-8"
          >
            <div className="flex items-baseline gap-3">
              <span className="font-display text-6xl md:text-7xl leading-none text-foreground/15">
                {s.n}
              </span>
              <span className="num-label hidden sm:inline">Etapa {s.n}</span>
            </div>
            <h3 className="font-display mt-5 text-2xl md:text-3xl leading-tight">{s.title}</h3>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-xs">{s.desc}</p>
          </motion.li>
        ))}
      </ol>
    </div>
  </section>
);

export default HowItWorks;