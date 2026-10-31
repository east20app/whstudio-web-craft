import { motion } from "framer-motion";
import { ArrowDown, ArrowUpRight, Check, Code2, LayoutTemplate } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useOrcamentoAction } from "@/components/tickets/TicketChat";

const Hero = () => {
  const { requestQuote } = useOrcamentoAction();
  return (
    <section className="studio-hero relative overflow-hidden pt-36 md:pt-44">
      <div className="container relative">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5">
          <p className="eyebrow flex items-center gap-3"><span className="h-2 w-2 rounded-full bg-primary" />Sites, sistemas e automações</p>
          <p className="num-label">Rio Grande do Norte · Brasil</p>
        </div>
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }} className="relative grid items-center gap-10 py-14 md:py-20 lg:grid-cols-12 lg:gap-8">
          <div className="relative z-10 lg:col-span-8">
            <h1 className="studio-headline">Sites marcantes.<br />Sistemas<br /><span className="text-primary">sob medida.</span></h1>
            <div className="mt-9 grid gap-7 md:max-w-3xl md:grid-cols-2 md:items-end">
              <p className="max-w-sm text-base leading-relaxed text-muted-foreground">Da primeira conversa à publicação: criamos experiências digitais e ferramentas que deixam a rotina da sua empresa mais simples.</p>
              <div className="flex flex-wrap gap-4">
                <Button className="h-12 px-6" onClick={() => requestQuote({ subject: "Projeto novo", prefill: "Quero iniciar um projeto. " })}>Começar meu projeto <ArrowUpRight className="ml-3 h-4 w-4" aria-hidden="true" /></Button>
                <Link to="/portfolio" className="inline-flex min-h-12 items-center gap-2 border-b border-border text-sm transition-colors hover:text-primary">Ver projetos <ArrowUpRight className="h-4 w-4" aria-hidden="true" /></Link>
              </div>
            </div>
            <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-xs text-muted-foreground" aria-label="Como trabalhamos">
              {["Escopo bem definido", "Acompanhamento direto", "Entrega responsiva"].map((item) => <li key={item} className="inline-flex items-center gap-2"><Check className="h-3.5 w-3.5 text-primary" aria-hidden="true" />{item}</li>)}
            </ul>
          </div>
          <div className="hero-object lg:col-span-4" aria-hidden="true">
            <div className="hero-object__glow" />
            <div className="hero-project-card">
              <div className="hero-project-card__bar"><span className="hero-project-card__dots"><i /><i /><i /></span><span>prévia do projeto</span><span className="hero-project-card__ready"><span /> online</span></div>
              <div className="hero-project-card__body">
                <div className="hero-project-card__brand"><span>WH</span><span> / STUDIO</span><Code2 className="ml-auto h-4 w-4 text-primary" /></div>
                <div className="hero-project-card__headline"><span /> <span /> <span /></div>
                <div className="hero-project-card__copy"><span /><span /></div>
                <div className="hero-project-card__button"><LayoutTemplate className="h-3.5 w-3.5" /> site responsivo</div>
                <div className="hero-project-card__tiles"><span /><span /><span /></div>
              </div>
            </div>
            <span className="hero-object__caption">IDEIA → DESIGN → DESENVOLVIMENTO</span>
          </div>
        </motion.div>
        <div className="flex flex-wrap items-center justify-between gap-5 border-t border-border py-6">
          <p className="num-label">ESTRATÉGIA · DESIGN · TECNOLOGIA</p><p className="text-xs text-muted-foreground">Atendimento direto para empresas em todo o Brasil.</p>
          <a href="#servicos" className="flex min-h-11 items-center gap-3 text-xs text-muted-foreground transition-colors hover:text-primary">Conheça nossas soluções <ArrowDown className="h-4 w-4" aria-hidden="true" /></a>
        </div>
      </div>
    </section>
  );
};
export default Hero;
