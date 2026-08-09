import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOrcamentoAction } from "@/components/tickets/TicketChat";

const stats = [
  { k: "70+", v: "Projetos entregues" },
  { k: "12d", v: "Prazo médio" },
  { k: "5.0", v: "Avaliação média" },
];

const Hero = () => {
  const { requestQuote } = useOrcamentoAction();
  return (
    <section className="relative pt-36 pb-20 md:pt-44 md:pb-28">
    <div className="container">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="eyebrow mb-10 md:mb-12"
      >
        Estúdio de desenvolvimento — Rio Grande do Norte
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.05 }}
        className="h1-hero max-w-5xl"
      >
        Sites, sistemas e bots <em>feitos do zero.</em>{" "}
        Do briefing ao deploy, uma pessoa só.
      </motion.h1>

      <div className="grid lg:grid-cols-12 gap-10 mt-14 md:mt-20 items-end">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="lg:col-span-5"
        >
          <p className="text-lg text-muted-foreground leading-relaxed">
            A WH Studio projeta, programa e publica. Sem template, sem agência que
            repassa o projeto, sem promessa que não vira. O mesmo profissional que
            responde no WhatsApp é o que assina o código.
          </p>
          <div className="flex flex-wrap items-center gap-6 mt-8">
            <Button
              size="lg"
              className="h-14 px-7 text-base rounded-none"
              onClick={() => requestQuote({ subject: "Projeto novo", prefill: "Quero iniciar um projeto. " })}
            >
              Iniciar um projeto
              <ArrowUpRight className="w-5 h-5 ml-2" />
            </Button>
            <a
              href="#servicos"
              className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground transition-colors"
            >
              Ver serviços
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.22 }}
          className="lg:col-span-7"
        >
          <div className="border-t border-border">
            <div className="grid grid-cols-3">
              {stats.map((s, i) => (
                <div
                  key={s.v}
                  className={`pt-5 ${i > 0 ? "pl-6" : "pr-6"} ${i > 0 ? "border-l border-border" : ""}`}
                >
                  <p className="font-display text-4xl md:text-5xl leading-none">{s.k}</p>
                  <p className="eyebrow mt-3">{s.v}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
  );
};

export default Hero;
