import { motion } from "framer-motion";
import { MapPin, Code2, ShieldCheck } from "lucide-react";

const About = () => (
  <section id="sobre" className="py-28 md:py-32 border-t border-border">
    <div className="container">
      <div className="grid md:grid-cols-12 gap-8 mb-16">
        <div className="md:col-span-3">
          <p className="eyebrow">[ 06 ] Sobre</p>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="md:col-span-9"
        >
          <h2 className="display-huge text-4xl md:text-6xl">
            Um estúdio. <br />
            <span className="text-foreground/50">Uma pessoa por trás de cada projeto.</span>
          </h2>
        </motion.div>
      </div>

      <div className="grid md:grid-cols-12 gap-8 md:gap-10 items-start">
        {/* Card de perfil */}
        <motion.aside
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="md:col-span-4"
        >
          <div className="card-premium card-premium-featured p-7">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-xl border border-border bg-background flex items-center justify-center font-display font-extrabold text-lg tracking-tight">
                WN
              </div>
              <div>
                <p className="font-display text-lg font-extrabold leading-tight">Walmry Netto</p>
                <p className="eyebrow mt-1">Fundador · Dev</p>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-foreground/70">
                <MapPin className="w-4 h-4 text-accent-2 shrink-0" />
                <span>Rio Grande do Norte, Brasil</span>
              </div>
              <div className="flex items-center gap-3 text-foreground/70">
                <Code2 className="w-4 h-4 text-accent-2 shrink-0" />
                <span>React · Node · TypeScript · Supabase</span>
              </div>
              <div className="flex items-center gap-3 text-foreground/70">
                <ShieldCheck className="w-4 h-4 text-success shrink-0" />
                <span>Disponível para novos projetos</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <p className="eyebrow mb-2">Fundado</p>
              <p className="font-display font-extrabold text-3xl">2023</p>
            </div>
          </div>
        </motion.aside>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="md:col-span-4"
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
          className="md:col-span-4"
        >
          <p className="eyebrow mb-4">Forma de trabalho</p>
          <ul className="space-y-4 text-foreground/80 leading-relaxed">
            {[
              "Conversa direta no WhatsApp — sem comercial, sem proposta de 12 páginas.",
              "Escopo e prazo combinados antes da primeira linha de código.",
              "Preview funcionando a cada etapa, ajustes incluídos no caminho.",
              "Entrega no ar, treinamento e suporte direto pós-lançamento.",
            ].map((t, i) => (
              <li key={i} className="flex gap-4">
                <span className="eyebrow text-primary pt-1 w-8 shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  </section>
);

export default About;
