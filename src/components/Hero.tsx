import { motion } from "framer-motion";
import { ArrowDown, ArrowUpRight, Asterisk } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useOrcamentoAction } from "@/components/tickets/TicketChat";

const Hero = () => {
  const { requestQuote } = useOrcamentoAction();
  return (
    <section className="studio-hero relative overflow-hidden pt-36 md:pt-44">
      <div className="container relative">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5">
          <p className="eyebrow flex items-center gap-3"><span className="h-2 w-2 rounded-full bg-primary" />Desenvolvimento de sites & sistemas</p>
          <p className="num-label hidden sm:block">Rio Grande do Norte · Brasil</p>
        </div>
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }} className="relative grid gap-10 py-14 md:py-20 lg:grid-cols-12">
          <div className="relative z-10 lg:col-span-9">
            <h1 className="studio-headline">Sites marcantes.<br />Sistemas<br /><span className="text-primary">sob medida.</span></h1>
            <div className="mt-9 grid gap-7 md:max-w-3xl md:grid-cols-2 md:items-end">
              <p className="max-w-sm text-base leading-relaxed text-muted-foreground">Sites, sistemas e automações. Desenvolvemos a presença digital e as ferramentas que sua empresa precisa para trabalhar melhor.</p>
              <div className="flex flex-wrap gap-4">
                <Button className="h-12 px-6" onClick={() => requestQuote({ subject: "Projeto novo", prefill: "Quero iniciar um projeto. " })}>Vamos criar juntos <ArrowUpRight className="ml-3 h-4 w-4" aria-hidden="true" /></Button>
                <Link to="/portfolio" className="inline-flex min-h-12 items-center gap-2 border-b border-border text-sm transition-colors hover:text-primary">Explorar projetos <ArrowUpRight className="h-4 w-4" aria-hidden="true" /></Link>
              </div>
            </div>
          </div>
          <div className="hero-object lg:col-span-3" aria-hidden="true">
            <div className="hero-object__ring hero-object__ring--one" /><div className="hero-object__ring hero-object__ring--two" /><div className="hero-object__ring hero-object__ring--three" />
            <Asterisk className="hero-object__star" strokeWidth={0.8} /><span className="hero-object__caption">IDEIA → INTERFACE → CÓDIGO</span>
          </div>
        </motion.div>
        <div className="flex flex-wrap items-center justify-between gap-5 border-t border-border py-6">
          <p className="num-label">WH STUDIO / DESIGN COM INTENÇÃO</p><p className="text-xs text-muted-foreground">Do primeiro rascunho ao próximo lançamento.</p>
          <a href="#servicos" className="flex min-h-11 items-center gap-3 text-xs text-muted-foreground transition-colors hover:text-primary">Conheça nossas soluções <ArrowDown className="h-4 w-4" aria-hidden="true" /></a>
        </div>
      </div>
    </section>
  );
};
export default Hero;
