import { Link } from "react-router-dom";
import { ArrowUpRight, Check } from "lucide-react";
import { usePortfolio } from "@/hooks/usePortfolio";
const commitments = ['Escopo definido', 'Design responsivo', 'Acompanhamento da entrega', 'Suporte combinado'];
const ProvaConfianca = () => {
  const { data: portfolio } = usePortfolio(true);
  return <section id="confianca" className="border-y border-border bg-card py-8"><div className="container"><ul className="grid grid-cols-2 gap-x-5 gap-y-4 lg:grid-cols-4">{commitments.map(item => <li key={item} className="flex items-start gap-2 text-xs text-muted-foreground md:text-sm"><Check className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />{item}</li>)}</ul>{portfolio.length > 0 && <div className="mt-7 flex flex-wrap items-center justify-between gap-5 border-t border-border pt-6"><p className="eyebrow">Projetos desenvolvidos</p><ul className="flex flex-wrap gap-x-8 gap-y-3">{portfolio.slice(0, 4).map(project => <li key={project.id} className="font-display text-lg tracking-tight">{project.title}</li>)}</ul><Link to="/portfolio" className="inline-flex min-h-11 items-center gap-2 text-xs transition-colors hover:text-primary">Ver projetos <ArrowUpRight className="h-4 w-4" aria-hidden="true" /></Link></div>}</div></section>;
};
export default ProvaConfianca;
