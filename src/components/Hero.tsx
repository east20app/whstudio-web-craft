import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SignatureScribble } from "@/components/SignatureScribble";
import { useOrcamentoAction } from "@/components/tickets/TicketChat";
import heroBg from "@/assets/hero-bg.jpg";

const facts: Array<{ k: string; v: string }> = [
  { k: "Presença", v: "RN — BR" },
  { k: "Modelo", v: "Estratégia até deploy" },
  { k: "Contato", v: "WhatsApp" },
  { k: "Escopo", v: "Sob medida" },
];

const Hero = () => {
  const { requestQuote } = useOrcamentoAction();
  const start = () => requestQuote({ subject: "Projeto novo", prefill: "Quero iniciar um projeto. " });

  return (
    <section className="relative min-h-[92svh] overflow-hidden bg-[#050816] pt-32 text-white md:pt-40">
      <img
        src={heroBg}
        alt=""
        loading="eager"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover object-center opacity-75"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,8,22,0.96)_0%,rgba(5,8,22,0.78)_42%,rgba(5,8,22,0.24)_100%)]"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-grid-faint opacity-35 pointer-events-none" aria-hidden="true" />

      <div className="container relative flex min-h-[calc(92svh-10rem)] flex-col pb-10 md:pb-14">
        <div className="mb-10 flex items-center justify-between border-b border-white/15 pb-4 md:mb-14">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="eyebrow text-white/70"
          >
            WH Studio — Desenvolvimento web premium
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="num-label hidden text-white/60 md:block"
          >
            Rio Grande do Norte, Brasil
          </motion.p>
        </div>

        <div className="grid flex-1 items-center gap-x-10 gap-y-12 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-medium text-white/82 backdrop-blur-md"
            >
              <span className="h-2 w-2 rounded-full bg-accent-2 shadow-[0_0_24px_hsl(var(--accent-2))]" />
              Projetos digitais para empresas que precisam parecer grandes antes de escalar
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="h1-hero max-w-5xl text-balance"
            >
              Uma presença digital feita para sua empresa ser levada{" "}
              <em className="relative inline-block">
                a sério
                <SignatureScribble className="absolute left-0 top-full mt-1.5 w-36 md:w-44 h-[0.38em] text-primary" />
              </em>
              .
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mt-8 max-w-2xl text-lg leading-relaxed text-white/72 md:text-xl"
            >
              Sites, sistemas e automações com acabamento premium, performance e atendimento direto
              com quem projeta, programa e coloca tudo no ar.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <Button
                onClick={start}
                className="h-12 rounded-full px-6 shadow-[0_18px_50px_hsl(var(--primary)/0.35)]"
              >
                Solicitar orçamento
                <ArrowUpRight className="w-5 h-5 ml-2" />
              </Button>
              <a
                href="#portfolio"
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/18 bg-white/8 px-6 text-sm font-medium text-white/78 backdrop-blur-md transition-colors hover:bg-white/14 hover:text-white"
              >
                Ver portfólio
              </a>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-4"
          >
            <dl className="premium-shell grid grid-cols-2 gap-px overflow-hidden border-white/15 bg-white/10 p-1 text-white backdrop-blur-xl">
              {facts.map((f) => (
                <div key={f.k} className="rounded-[0.35rem] bg-white/8 p-4">
                  <dt className="num-label text-white/52">{f.k}</dt>
                  <dd className="mt-2 text-sm font-semibold text-white">{f.v}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-5 rounded-lg border border-white/15 bg-white/10 p-5 text-sm leading-relaxed text-white/72 backdrop-blur-xl">
              <p className="font-medium text-white">Design com cara de marca estabelecida.</p>
              <p className="mt-2">
                Estrutura, copy, interface e tecnologia alinhadas para vender confiança antes da primeira conversa.
              </p>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 md:mt-14"
        >
          <div className="inline-flex max-w-xl items-center gap-4 rounded-full border border-white/15 bg-white/10 px-5 py-4 text-white backdrop-blur-xl md:px-6 md:py-5">
            <span className="h-2 w-2 shrink-0 rounded-full bg-primary" aria-hidden="true" />
            <div>
              <p className="text-base leading-snug md:text-lg">Uma pessoa do briefing ao deploy.</p>
              <p className="mt-1 text-sm text-white/62">
                Você fala direto com quem decide e programa, sem ruído no meio.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
