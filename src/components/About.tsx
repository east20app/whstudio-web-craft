import { motion } from "framer-motion";
import { MapPin, Code2, ShieldCheck } from "lucide-react";

const About = () => (
  <section id="sobre" className="py-24 md:py-32 border-t border-border">
    <div className="container">
      <div className="grid lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-5">
          <p className="eyebrow mb-4">Sobre</p>
          <h2 className="display-huge text-5xl md:text-6xl">
            Um estúdio. <em>Uma pessoa por trás de cada projeto.</em>
          </h2>

          <div className="mt-10 border-t border-border pt-6 space-y-4 text-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-none border border-border bg-card flex items-center justify-center font-display text-2xl">
                WN
              </div>
              <div>
                <p className="font-semibold">Walmry Netto</p>
                <p className="eyebrow mt-1">Fundador · Dev</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <MapPin className="w-4 h-4 text-primary shrink-0" />
              <span>Rio Grande do Norte, Brasil</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <Code2 className="w-4 h-4 text-primary shrink-0" />
              <span>React · Node · TypeScript · Supabase</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <ShieldCheck className="w-4 h-4 text-success shrink-0" />
              <span>Disponível para novos projetos</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-display text-2xl md:text-3xl leading-snug max-w-xl"
          >
            A WH Studio começou em 2023 no Rio Grande do Norte, fundada pelo desenvolvedor
            Walmry Netto. Nasceu de um incômodo simples: agência grande demora, freelancer
            sumido entrega tarde — e quem paga a conta é o cliente.
          </motion.p>
          <p className="text-muted-foreground leading-relaxed mt-6 max-w-xl">
            Aqui o atendimento, a arquitetura e o código passam pela mesma pessoa.
            Sem repasse, sem ruído. Fundado em 2023, operando por projetos.
          </p>

          <div className="mt-12">
            <p className="eyebrow mb-0">Forma de trabalho</p>
            <ul className="border-t border-border">
              {[
                "Conversa direta no WhatsApp — sem comercial, sem proposta de 12 páginas.",
                "Escopo e prazo combinados antes da primeira linha de código.",
                "Preview funcionando a cada etapa, ajustes incluídos no caminho.",
                "Entrega no ar, treinamento e suporte direto pós-lançamento.",
              ].map((t, i) => (
                <li key={i} className="flex gap-6 py-4 border-b border-border text-sm leading-relaxed">
                  <span className="font-mono text-xs text-muted-foreground pt-0.5 w-6 shrink-0 tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default About;
