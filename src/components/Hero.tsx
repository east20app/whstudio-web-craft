import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SignatureScribble } from "@/components/SignatureScribble";
import { useOrcamentoAction } from "@/components/tickets/TicketChat";

const facts: Array<{ k: string; v: string }> = [
  { k: "Localização", v: "RN — BR" },
  { k: "Modelo", v: "1 dev até o deploy" },
  { k: "Contato", v: "WhatsApp" },
  { k: "Escopo", v: "Do zero" },
];

const Hero = () => {
  const { requestQuote } = useOrcamentoAction();
  const start = () => requestQuote({ subject: "Projeto novo", prefill: "Quero iniciar um projeto. " });

  return (
    <section className="relative overflow-hidden pt-32 pb-16 md:pt-40 md:pb-24">
      <div className="absolute inset-0 bg-grid-faint pointer-events-none" aria-hidden="true" />
      <div className="container relative">
        <div className="flex items-center justify-between border-b border-border pb-4 mb-10 md:mb-14">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="eyebrow"
          >
            WH Studio — Desenvolvimento web
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="num-label hidden md:block"
          >
            Rio Grande do Norte, Brasil
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-12 gap-x-10 gap-y-12 items-end">
          <div className="lg:col-span-8">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="h1-hero max-w-4xl"
            >
              Eu projeto, programo e{" "}
              <em className="relative inline-block">
                publico
                <SignatureScribble className="absolute left-0 top-full mt-1.5 w-36 md:w-44 h-[0.38em] text-primary" />
              </em>
              .
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mt-8 max-w-xl text-lg md:text-xl text-muted-foreground leading-relaxed"
            >
              Sites, sistemas e produtos digitais feitos do zero — e entregues
              do briefing ao deploy por uma pessoa só.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-4"
          >
            <dl className="grid grid-cols-2 gap-x-6 gap-y-5 border-t border-border pt-6">
              {facts.map((f) => (
                <div key={f.k}>
                  <dt className="num-label">{f.k}</dt>
                  <dd className="mt-1.5 font-mono text-sm text-foreground">{f.v}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4">
              <Button onClick={start} className="h-12 rounded-none px-6">
                Solicitar orçamento
                <ArrowUpRight className="w-5 h-5 ml-2" />
              </Button>
              <a
                href="#portfolio"
                className="text-sm text-muted-foreground border-b border-transparent hover:border-foreground hover:text-foreground transition-colors self-start"
              >
                Ver portfólio
              </a>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-14 md:mt-20"
        >
          <div className="inline-flex items-center gap-4 border border-border bg-card px-5 py-4 md:px-6 md:py-5">
            <span className="h-2 w-2 shrink-0 bg-primary" aria-hidden="true" />
            <div>
              <p className="text-lg md:text-xl leading-snug">Uma pessoa do briefing ao deploy.</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Você fala direto com quem programa — sem agência no meio.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;