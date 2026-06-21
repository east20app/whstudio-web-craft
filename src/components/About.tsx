import { motion } from "framer-motion";

const About = () => (
  <section id="sobre" className="py-32 border-t border-border">
    <div className="container">
      <div className="grid md:grid-cols-12 gap-8 mb-20">
        <div className="md:col-span-3">
          <p className="eyebrow">[ 06 ] Sobre</p>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="md:col-span-9"
        >
          <h2 className="display-huge text-5xl md:text-7xl">
            Um estúdio. <br />
            <span className="text-foreground/50">Uma pessoa por trás de cada projeto.</span>
          </h2>
        </motion.div>
      </div>

      <div className="grid md:grid-cols-12 gap-12 md:gap-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="md:col-span-5 md:col-start-2"
        >
          <p className="eyebrow mb-4">História</p>
          <p className="text-foreground/80 leading-relaxed">
            A WH Studio começou em 2023 no Rio Grande do Norte, fundada pelo desenvolvedor
            Walmry Netto. Nasceu de um incômodo simples: agência grande demora, freelancer
            sumido entrega tarde — e quem paga a conta é o cliente.
          </p>
          <p className="text-foreground/80 leading-relaxed mt-4">
            Aqui o atendimento, a arquitetura e o código passam pela mesma pessoa.
            Sem repasse, sem ruído.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="md:col-span-5"
        >
          <p className="eyebrow mb-4">Forma de trabalho</p>
          <ul className="space-y-4 text-foreground/80 leading-relaxed">
            <li className="flex gap-4">
              <span className="eyebrow text-foreground/40 pt-1 w-8 shrink-0">01</span>
              <span>Conversa direta no WhatsApp — sem comercial, sem proposta de 12 páginas.</span>
            </li>
            <li className="flex gap-4">
              <span className="eyebrow text-foreground/40 pt-1 w-8 shrink-0">02</span>
              <span>Escopo e prazo combinados antes da primeira linha de código.</span>
            </li>
            <li className="flex gap-4">
              <span className="eyebrow text-foreground/40 pt-1 w-8 shrink-0">03</span>
              <span>Preview funcionando a cada etapa, ajustes incluídos no caminho.</span>
            </li>
            <li className="flex gap-4">
              <span className="eyebrow text-foreground/40 pt-1 w-8 shrink-0">04</span>
              <span>Entrega no ar, treinamento e suporte direto pós-lançamento.</span>
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  </section>
);

export default About;
