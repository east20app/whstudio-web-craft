import { ArrowUpRight, Gauge, Globe2, LayoutDashboard, MessageCircle, SearchCheck, Smartphone } from "lucide-react";
import { Link } from "react-router-dom";

const items = [
  {
    icon: Smartphone,
    title: "Pensado para celular",
    description: "Conteúdo, navegação e ações organizados para funcionar bem em telas pequenas e grandes.",
  },
  {
    icon: SearchCheck,
    title: "Estrutura pronta para busca",
    description: "Hierarquia, títulos e metadados organizados para ajudar buscadores a entender cada página.",
  },
  {
    icon: Gauge,
    title: "Experiência leve",
    description: "Componentes e recursos escolhidos para manter a navegação clara e o carregamento eficiente.",
  },
  {
    icon: MessageCircle,
    title: "Contato fácil de encontrar",
    description: "WhatsApp, formulários e chamadas para ação posicionados conforme o caminho do cliente.",
  },
  {
    icon: LayoutDashboard,
    title: "Painel quando faz sentido",
    description: "Para projetos que precisam de autonomia, incluímos áreas de gestão conforme o escopo aprovado.",
  },
  {
    icon: Globe2,
    title: "Orientação para publicar",
    description: "Domínio, hospedagem e próximos passos explicados de acordo com a solução escolhida.",
  },
];

const Entregas = () => (
  <section id="entregas" className="scroll-mt-28 border-t border-border py-20 md:py-28">
    <div className="container">
      <div className="mb-12 grid items-end gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <p className="eyebrow mb-4">O que seu projeto pode incluir</p>
          <h2 className="display-huge max-w-3xl text-4xl md:text-6xl">Uma presença digital <em>feita para trabalhar.</em></h2>
        </div>
        <p className="max-w-sm text-sm leading-relaxed text-muted-foreground lg:col-span-4">Os recursos são definidos com você antes do desenvolvimento. Cada projeto recebe a estrutura adequada ao seu objetivo.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(({ icon: Icon, title, description }, index) => (
          <article key={title} className="group relative flex min-h-52 flex-col overflow-hidden rounded-2xl border border-border bg-card/65 p-6 transition-all hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-[0_18px_50px_hsl(var(--primary)/.08)] md:p-7">
            <span className="absolute right-5 top-5 font-mono text-[10px] tracking-widest text-muted-foreground/45">0{index + 1}</span>
            <span className="mb-7 grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground"><Icon className="h-5 w-5" strokeWidth={1.7} aria-hidden="true" /></span>
            <h3 className="font-display text-xl tracking-tight">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
          </article>
        ))}
      </div>
      <div className="mt-7 flex flex-col items-start justify-between gap-4 rounded-2xl border border-border bg-secondary/40 p-5 sm:flex-row sm:items-center md:px-7">
        <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">Tem uma necessidade específica? Conversamos sobre o escopo, as integrações e o melhor caminho para sua empresa.</p>
        <Link to="/orcamento" className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">Planejar meu projeto <ArrowUpRight className="h-4 w-4" aria-hidden="true" /></Link>
      </div>
    </div>
  </section>
);

export default Entregas;
