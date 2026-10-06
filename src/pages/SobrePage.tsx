import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { SignatureScribble } from "@/components/SignatureScribble";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import CTAFinal from "@/components/CTAFinal";
import Seo, { pageSeo, orgJsonLd } from "@/components/Seo";

const principles = [
  {
    title: "Responsabilidade em cada etapa",
    desc: "Escopo, responsáveis e pontos de acompanhamento definidos para sua empresa saber como o projeto avança.",
  },
  {
    title: "Código do zero, sempre",
    desc: "Interfaces e funcionalidades escolhidas de acordo com os objetivos e processos do seu negócio.",
  },
  {
    title: "Escopo antes do código",
    desc: "Nada de começar 'pra já' e descobrir o escopo no meio do caminho. Primeiro o que, depois o como.",
  },
  {
    title: "Transparência total",
    desc: "Preview funcionando em cada etapa. Você vê erros cedo, aprova mudanças cedo e nunca descobre nada na entrega.",
  },
];

const commitments = [
  "Objetivos, entregas e prazos definidos na proposta",
  "Validação do layout e acompanhamento do desenvolvimento",
  "Domínio e acessos organizados para sua empresa",
  "Custos de serviços externos apresentados com transparência",
];

const AboutPage = () => {
  const { acceptingProjects, authorName } = useSiteSettings();

  return (
    <>
      <Seo {...pageSeo.sobre} jsonLd={orgJsonLd} />
      <Header />
      <main id="main-content" tabIndex={-1} className="pt-20">
        <section className="py-20 md:py-28 border-b border-border">
          <div className="container max-w-4xl">
            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="eyebrow mb-6">
              Sobre a WH Studio
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="display-huge text-5xl md:text-7xl"
            >
              Uma empresa. Tecnologia a serviço <em>do seu negócio.</em>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground text-base md:text-lg mt-6 max-w-2xl leading-relaxed"
            >
              A WH Studio é uma empresa de desenvolvimento de sites e sistemas no Rio Grande do Norte, fundada por {authorName}. Trabalhamos com presença digital, plataformas de gestão e integrações para empresas de diferentes setores.
            </motion.p>
          </div>
        </section>

        <section className="py-24 md:py-32 border-b border-border" aria-labelledby="principios">
          <div className="container grid lg:grid-cols-12 gap-x-12 gap-y-12">
            <div className="lg:col-span-5">
              <p className="eyebrow mb-5">Princípios de trabalho</p>
              <h2 id="principios" className="display-huge text-5xl md:text-6xl">
                Do que a WH Studio <em>não abre mão.</em>
              </h2>
              <dl className="mt-10 divide-y divide-border text-sm">
                <div className="flex items-baseline justify-between gap-4 py-3.5">
                  <dt className="num-label shrink-0">Localização</dt>
                  <dd className="font-mono text-sm">Rio Grande do Norte — BR</dd>
                </div>
                <div className="flex items-baseline justify-between gap-4 py-3.5">
                  <dt className="num-label shrink-0">Stack</dt>
                  <dd className="font-mono text-sm text-right">React · Node · TypeScript · Supabase</dd>
                </div>
                <div className="flex items-baseline justify-between gap-4 py-3.5">
                  <dt className="num-label shrink-0">Disponibilidade</dt>
                  <dd className="font-mono text-sm">
                    {acceptingProjects ? "Aceitando novos projetos" : "Fila fechada"}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="lg:col-span-7">
              <div className="border-t border-border">
                {principles.map((p, i) => (
                  <motion.div
                    key={p.title}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-8%" }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    className="border-b border-border py-6"
                  >
                    <div className="flex gap-6">
                      <span className="num-label pt-1 w-8 shrink-0 tabular-nums">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <h3 className="text-base font-semibold">{p.title}</h3>
                        <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed max-w-[52ch]">{p.desc}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 md:py-32 border-b border-border" aria-labelledby="limites">
          <div className="container grid lg:grid-cols-12 gap-x-12 gap-y-10">
            <div className="lg:col-span-5">
              <p className="eyebrow mb-5">Compromissos com sua empresa</p>
              <h2 id="limites" className="display-huge text-5xl md:text-6xl">
                Uma parceria <em>bem definida.</em>
              </h2>
              <p className="mt-6 text-muted-foreground leading-relaxed max-w-md">
                Alinhamos expectativas antes de iniciar. Sua empresa sabe o que está contratando, como acompanha o projeto e o que acontece depois da entrega.
              </p>
            </div>
            <div className="lg:col-span-7">
              <ul className="border-t border-border">
                {commitments.map((item, i) => (
                  <li key={item} className="flex gap-6 border-b border-border py-5 text-sm md:text-base leading-relaxed">
                    <span className="num-label pt-0.5 w-8 shrink-0 tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="max-w-[55ch]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="py-24 md:py-32" aria-labelledby="autor">
          <div className="container max-w-4xl">
            <div className="grid grid-cols-[auto_1fr] gap-x-6 items-end border-b border-border pb-10">
              <div className="w-28 h-28 md:w-36 md:h-36 border border-border bg-card flex items-center justify-center shrink-0">
                <span className="font-display text-6xl md:text-7xl leading-none">WN</span>
              </div>
              <div className="min-w-0">
                <p className="font-display text-3xl md:text-5xl leading-none">{authorName}</p>
                <p className="num-label mt-3">Fundador · Desenvolvedor</p>
                <span className="inline-block mt-4">
                  <SignatureScribble className="w-44 h-3 text-primary/70" />
                </span>
              </div>
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="font-display text-2xl md:text-[2.6rem] leading-snug mt-10 max-w-2xl"
            >
              Na WH Studio, cada projeto reúne planejamento, design e desenvolvimento. Sua empresa acompanha as entregas com versões de teste e validações antes da publicação.
            </motion.p>
          </div>
        </section>

        <CTAFinal />
      </main>
      <Footer />
    </>
  );
};

export default AboutPage;
