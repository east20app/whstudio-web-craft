import { motion } from "framer-motion";

const items = [
  {
    title: "Cronograma sem fantasia",
    desc: "Eu digo o que dá para fazer no prazo e o que não dá. Melhor cortar escopo agora do que entregar bagunça depois.",
  },
  {
    title: "WhatsApp direto comigo",
    desc: "Sem suporte terceirizado, sem chamado perdido. Quem responde é o mesmo dev que mexe no projeto.",
  },
  {
    title: "Interface para gente ocupada",
    desc: "Tela feita para o usuário entender rápido. Menos enfeite, mais botão no lugar certo.",
  },
  {
    title: "Código específico para o seu caso",
    desc: "Nada de tema comprado tentando parecer sistema. A regra do seu negócio entra no código.",
  },
  {
    title: "Pagamento e integração ligados",
    desc: "PIX, cartão, boleto, Discord, WhatsApp, planilha ou API. O que precisar conversar, a gente conecta.",
  },
];

const Differentials = () => (
  <section className="py-24 bg-secondary">
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="grid md:grid-cols-[1fr_2fr] gap-8 mb-16 items-end"
      >
        <div>
          <span className="eyebrow text-primary mb-3">Por que funciona</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold">Menos promessa. Mais entrega.</h2>
        </div>
        <p className="text-muted-foreground md:text-lg">
          Projeto bom não depende de frase bonita. Depende de escopo claro, código organizado e suporte quando aparece problema.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-x-10 gap-y-4 max-w-5xl">
        {items.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            className="flex items-start gap-5 p-6 group"
          >
            <div className="shrink-0 w-10 text-right">
              <span className="text-3xl font-extrabold text-primary/20 group-hover:text-primary/40 transition-colors leading-none font-display">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
            <div>
              <h3 className="font-semibold font-display mb-1 text-foreground">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Differentials;
