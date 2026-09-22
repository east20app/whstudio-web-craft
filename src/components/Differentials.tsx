import { motion } from "framer-motion";

const items = [
  {
    title: "Prazo que cabe na realidade",
    desc: "No ar em até 15 dias úteis. Cronograma combinado antes de qualquer linha de código.",
  },
  {
    title: "WhatsApp direto comigo",
    desc: "Sem suporte terceirizado, sem chamado. Quem responde é o mesmo que escreveu o código.",
  },
  {
    title: "Design que não envelhece",
    desc: "Tipografia, cor e espaço alinhados com o que está sendo feito de bom hoje — do zero.",
  },
  {
    title: "Código escrito pro seu caso",
    desc: "Sem tema pronto e sem template. Cada funcionalidade feita pra existir no seu projeto.",
  },
  {
    title: "Pagamento já entra no caminho",
    desc: "PIX, cartão, boleto e Stripe configurados. Você recebe direto, sem intermediário.",
  },
];

const Differentials = () => (
  <section id="diferenciais" className="py-24 md:py-32 border-t border-border">
    <div className="container">
      <div className="grid lg:grid-cols-12 gap-x-12 gap-y-12">
        <div className="lg:col-span-6">
          <p className="eyebrow mb-5">Diferenciais</p>
          <h2 className="display-huge text-5xl md:text-6xl leading-[1.05]">
            Você fala com quem <em>escreve o código.</em>
          </h2>
          <p className="mt-6 text-muted-foreground leading-relaxed max-w-md">
            Sem comercial, sem repasse, sem escopo mudando no meio do caminho.
            Só o essencial pra tirar o projeto do papel e colocar no ar.
          </p>
        </div>

        <div className="lg:col-span-5 lg:col-start-8 self-start">
          <ul className="border-t border-border">
            {items.map((it, i) => (
              <motion.li
                key={it.title}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-8%" }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                className="flex gap-6 border-b border-border py-5"
              >
                <span className="num-label pt-1 w-8 shrink-0 tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-base font-semibold">{it.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed max-w-[46ch]">
                    {it.desc}
                  </p>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </section>
);

export default Differentials;