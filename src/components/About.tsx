import { motion } from "framer-motion";
import { SignatureScribble } from "@/components/SignatureScribble";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const workStyle = [
  "Conversa direta no WhatsApp — sem comercial, sem proposta de 12 páginas.",
  "Escopo e prazo combinados antes da primeira linha de código.",
  "Preview funcionando a cada etapa, ajustes incluídos no caminho.",
  "Entrega no ar, treinamento e suporte direto pós-lançamento.",
];

const About = () => {
  const { acceptingProjects } = useSiteSettings();

  return (
    <section id="sobre" className="py-24 md:py-32 border-t border-border">
      <div className="container">
        <div className="grid lg:grid-cols-12 gap-x-12 gap-y-14 items-start">
          <div className="lg:col-span-5">
            <p className="eyebrow mb-4">Sobre</p>
            <h2 className="display-huge text-5xl md:text-6xl">
              Um estúdio. <em>Uma pessoa por trás de cada projeto.</em>
            </h2>

            <div className="mt-12 lg:mt-20">
              <div className="grid grid-cols-[auto_1fr] gap-x-6 items-end">
                <div className="w-28 h-28 md:w-36 md:h-36 border border-border bg-card flex items-center justify-center shrink-0">
                  <span className="font-display text-6xl md:text-7xl leading-none">WN</span>
                </div>
                <div className="border-b border-border pb-4 min-w-0">
                  <p className="font-display text-3xl md:text-4xl leading-none">Walmry Netto</p>
                  <p className="num-label mt-2">Fundador · Desenvolvedor</p>
                  <span className="inline-block mt-3">
                    <SignatureScribble className="w-44 h-3 text-primary/70" />
                  </span>
                </div>
              </div>

              <dl className="mt-8 divide-y divide-border text-sm">
                <div className="flex items-baseline justify-between gap-4 py-3.5">
                  <dt className="num-label shrink-0">Localização</dt>
                  <dd className="font-mono text-sm">Rio Grande do Norte — BR</dd>
                </div>
                <div className="flex items-baseline justify-between gap-4 py-3.5">
                  <dt className="num-label shrink-0">Stack</dt>
                  <dd className="font-mono text-sm text-right">
                    React · Node · TypeScript · Supabase
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-4 py-3.5">
                  <dt className="num-label shrink-0">Disponibilidade</dt>
                  <dd className="font-mono text-sm">
                    {acceptingProjects ? "Aceitando novos projetos" : "Fila fechada"}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="lg:col-span-7 lg:pt-8">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="font-display text-2xl md:text-[2.6rem] leading-snug max-w-2xl"
            >
              A WH Studio começou em 2023 no Rio Grande do Norte, fundada pelo
              desenvolvedor Walmry Netto, de um incômodo simples: agência grande
              demora, freelancer sumido atrasa — e quem paga a conta é o cliente.
            </motion.p>
            <p className="text-muted-foreground leading-relaxed mt-6 max-w-2xl">
              Aqui o atendimento, a arquitetura e o código passam pela mesma pessoa.
              Sem repasse, sem ruído. Operando por projeto, com o servidor aberto
              quando você quiser ver o progresso.
            </p>

            <div className="mt-12">
              <p className="eyebrow mb-0">Forma de trabalho</p>
              <ul className="border-t border-border">
                {workStyle.map((t, i) => (
                  <li key={i} className="flex gap-6 py-4 border-b border-border text-sm leading-relaxed">
                    <span className="num-label pt-0.5 w-7 shrink-0 tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="max-w-[55ch]">{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;