import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { whatsappLink } from "@/config/site";

const Hero = () => (
  <section className="relative pt-40 pb-28 md:pt-52 md:pb-40">
    <div className="container max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-3 eyebrow mb-12"
      >
        <span className="w-6 h-px bg-foreground/40" />
        <span>WH Studio — Desenvolvimento web</span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.05 }}
        className="display-huge text-[12vw] md:text-[8.5vw] lg:text-[7.5rem] leading-[0.95] mb-10 max-w-5xl"
      >
        Construímos produtos digitais{" "}
        <span className="text-foreground/55">com cuidado de quem assina cada linha.</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="text-base md:text-lg text-foreground/70 max-w-xl mb-12 leading-relaxed"
      >
        Estúdio de desenvolvimento no RN. Sites, sistemas e bots feitos do zero —
        sob a direção de um único profissional, do briefing ao deploy.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.22 }}
      >
        <Button size="lg" className="rounded-none h-14 px-7 text-base group" asChild>
          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
            Iniciar um projeto
            <ArrowUpRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </Button>
      </motion.div>
    </div>
  </section>
);

export default Hero;
