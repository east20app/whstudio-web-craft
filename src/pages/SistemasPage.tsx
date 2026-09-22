import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CTAFinal from "@/components/CTAFinal";
import Seo, { pageSeo, orgJsonLd } from "@/components/Seo";
import { motion } from "framer-motion";
import { Check, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useOrcamentoAction } from "@/components/tickets/TicketChat";

const deliverables = [
  "Painel administrativo com login e permissões por cargo",
  "Cadastros, pedidos, estoque e financeiro num lugar só",
  "Relatórios que saem da tela direto pra planilha",
  "API própria e documentada pra crescer sem reescrever",
  "Pagamento configurado — PIX, cartão, boleto, Stripe",
  "Notificação automática no WhatsApp dos eventos que importam",
];

const signs = [
  {
    title: "Você roda o negócio numa planilha",
    desc: "E cada linha nova precisa ser inserida à mão, e cada relatório vira trabalho de meio dia.",
  },
  {
    title: "O time cresceu e ninguém se entende",
    desc: "Cada um anota no seu lugar, e a informação certa mora no grupo de quem não estava lá.",
  },
  {
    title: "As decisões saem atrasadas",
    desc: "Você só descobre o que vendeu no fim do mês — quando já poderia ter agido na semana.",
  },
  {
    title: "Você paga caro em 3 sistemas que não conversam",
    desc: "E ainda copia e cola de um pro outro pra gerar o relatório final.",
  },
];

const processes = [
  { n: "01", title: "Briefing", desc: "A gente entende como o trabalho acontece hoje — do jeito real, não do jeito do organograma." },
  { n: "02", title: "Escopo fechado", desc: "Tela a tela, campo a campo. Você aprova o que será construído e o prazo. Sem surpresa no fim." },
  { n: "03", title: "Desenvolvimento", desc: "Etapas funcionando e visíveis. Você vê o sistema nascendo e corrige o rumo no caminho." },
  { n: "04", title: "Entrega e treino", desc: "Publicado, com suporte incluso e você (e o time) treinado pra operar sozinho." },
];

const SistemasPage = () => {
  const { requestQuote } = useOrcamentoAction();
  const settings = useSiteSettings();
  const waLink = settings.buildWhatsappLink();

  return (
    <>
      <Seo {...pageSeo.sistemas} jsonLd={orgJsonLd} />
      <Header />
      <main className="pt-16">
        <section className="py-20 md:py-28 border-b border-border">
          <div className="container max-w-4xl">
            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="eyebrow mb-6">
              Sistemas sob medida
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="display-huge text-5xl md:text-7xl"
            >
              Seu negócio dentro de um sistema <em>feito pra ele.</em>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground text-base md:text-lg mt-6 max-w-2xl"
            >
              Não é software de prateleira: é o processo da sua empresa escrito em
              código — login, painel, relatório e integração, do jeito que o seu
              time entende sem treinamento.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="mt-10 flex flex-col sm:flex-row gap-4"
            >
              <Button
                className="h-12 rounded-none px-6"
                onClick={() => requestQuote({ subject: "Sistema sob medida", prefill: "Quero um sistema sob medida. " })}
              >
                Solicitar orçamento
                <ArrowUpRight className="w-5 h-5 ml-2" />
              </Button>
              <Button variant="outline" className="h-12 rounded-none px-6" asChild>
                <a href={waLink} target="_blank" rel="noopener noreferrer">
                  Falar no WhatsApp
                  <ArrowUpRight className="w-5 h-5 ml-2" />
                </a>
              </Button>
            </motion.div>
          </div>
        </section>

        <section className="py-24 md:py-32 border-b border-border" aria-labelledby="escopo">
          <div className="container grid lg:grid-cols-12 gap-x-12 gap-y-12">
            <div className="lg:col-span-5">
              <p className="eyebrow mb-5">Escopo típico</p>
              <h2 id="escopo" className="display-huge text-5xl md:text-6xl">
                O que costuma <em>entrar.</em>
              </h2>
              <p className="mt-6 text-muted-foreground leading-relaxed max-w-md">
                Tudo isso começa pequeno e cresce com você. O que importa é que
                cada item existe porque faz parte do seu processo — e não porque
                estava no catálogo.
              </p>
            </div>
            <div className="lg:col-span-7">
              <ul className="border-t border-border">
                {deliverables.map((d, i) => (
                  <motion.li
                    key={d}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-8%" }}
                    transition={{ duration: 0.35, delay: i * 0.04 }}
                    className="flex items-start gap-4 border-b border-border py-5"
                  >
                    <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                    <span className="text-sm md:text-base leading-relaxed">{d}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="py-24 md:py-32 border-b border-border" aria-labelledby="sinais">
          <div className="container">
            <div className="max-w-3xl mb-16">
              <p className="eyebrow mb-5">Vale a pena quando</p>
              <h2 id="sinais" className="display-huge text-5xl md:text-6xl">
                Esses quatro sinais <em>são meu checklist.</em>
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-12">
              {signs.map((s, i) => (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-8%" }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="border-t border-border pt-6"
                >
                  <p className="num-label">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="text-lg font-semibold mt-3">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                </motion.div>
              ))}
            </div>
            <div className="mt-14">
              <Button
                className="h-12 rounded-none px-6"
                onClick={() => requestQuote({ subject: "Sistema sob medida", prefill: "Me identifiquei com os sinais: " })}
              >
                Solicitar orçamento
                <ArrowUpRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </section>

        <section className="py-24 md:py-32" aria-labelledby="processo">
          <div className="container">
            <div className="grid lg:grid-cols-12 gap-8 items-end mb-16">
              <div className="lg:col-span-8">
                <p className="eyebrow mb-5">Como acontece</p>
                <h2 id="processo" className="display-huge text-5xl md:text-7xl max-w-3xl">
                  Quatro etapas até o sistema <em>rodando.</em>
                </h2>
              </div>
              <p className="lg:col-span-4 text-sm md:text-base text-muted-foreground leading-relaxed max-w-md">
                O escopo fechado é a parte mais importante: é ele que garante
                prazo cumprido e orçamento sem surpresa.
              </p>
            </div>
            <ol className="grid md:grid-cols-2 lg:grid-cols-4 gap-y-10 md:gap-y-0 border-t border-border md:divide-x md:divide-border">
              {processes.map((s, i) => (
                <motion.li
                  key={s.n}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-8%" }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="pt-8 lg:pt-10 lg:pr-8"
                >
                  <span className="font-display text-6xl md:text-7xl leading-none text-foreground/15">{s.n}</span>
                  <h3 className="font-display mt-5 text-2xl md:text-3xl leading-tight">{s.title}</h3>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-xs">{s.desc}</p>
                </motion.li>
              ))}
            </ol>
            <div className="mt-16 flex flex-wrap items-center gap-6">
              <Button
                className="h-12 rounded-none px-6"
                onClick={() => requestQuote({ subject: "Sistema sob medida", prefill: "Quero conversar sobre um sistema. " })}
              >
                Solicitar orçamento
                <ArrowUpRight className="w-5 h-5 ml-2" />
              </Button>
              <Link
                to="/planos"
                className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground hover:text-foreground transition-colors"
              >
                Ver o plano Sistema Premium
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        <CTAFinal />
      </main>
      <Footer />
    </>
  );
};

export default SistemasPage;