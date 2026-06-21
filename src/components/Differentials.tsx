import { motion } from "framer-motion";

const items = [
  {
    title: "Cronograma sem fantasia",
    desc: "Prefiro cortar escopo no início do que entregar bagunça depois. Você sabe o que entra, o que fica para fase 2 e o que não entra.",
  },
  {
    title: "Conversa direta",
    desc: "Sem suporte terceirizado nem chamado perdido. Quem responde no WhatsApp é o mesmo engenheiro que mexe no código.",
  },
  {
    title: "Interface para gente ocupada",
    desc: "Tela feita para quem precisa entender em segundos. Menos enfeite, mais decisão tomada com o botão certo no lugar certo.",
  },
  {
    title: "Código próprio do seu negócio",
    desc: "Não compro tema, não revendo template. A regra do seu negócio entra no código — e fica registrada com quem trabalha nele depois.",
  },
  {
    title: "Pagamento e integração resolvidos",
    desc: "PIX, cartão, boleto, Discord, WhatsApp, planilha ou API legada. Se precisa conversar com outro sistema, a gente conecta.",
  },
];

const Differentials = () => (
  <section className="py-28 md:py-36 bg-background">
    <div className="container-wide">
      <div className="grid md:grid-cols-12 gap-10 mb-16 items-end rule-b pb-10">
        <div className="md:col-span-2">
          <span className="num-mono text-[11px] text-muted-foreground">§ 04</span>
        </div>
        <div className="md:col-span-6">
          <p className="eyebrow text-muted-foreground mb-4">Princípios</p>
          <h2 className="display-xl text-[clamp(2.4rem,5vw,4.2rem)]">
            Como o estúdio <span className="serif-italic">trabalha.</span>
          </h2>
        </div>
        <p className="md:col-span-4 text-sm text-muted-foreground leading-relaxed">
          Cinco compromissos que valem para todo projeto — independente do tamanho.
        </p>
      </div>

      <div className="grid md:grid-cols-12 gap-x-10 gap-y-12">
        {items.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            className="md:col-span-6 lg:col-span-4 flex gap-6 rule-t pt-6"
          >
            <span className="num-mono text-[11px] text-muted-foreground shrink-0 w-8">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <h3 className="font-display text-2xl mb-3 leading-tight">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Differentials;
