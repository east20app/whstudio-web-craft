import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ExternalLink, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { statusLabels, type ProjectStatus } from "@/config/site";
import { usePortfolio, type PortfolioItem } from "@/hooks/usePortfolio";
import { portfolioWebUrl } from "@/lib/portfolio-url";

const STATUS_DOT: Record<ProjectStatus, string> = {
  online: "bg-emerald-500",
  demo: "bg-accent-2",
  "em-desenvolvimento": "bg-warning",
  privado: "bg-muted-foreground",
};

const displayOf = (url?: string) => (url ? url.replace(/^https?:\/\//, "").replace(/\/$/, "") : undefined);
const artworkPalettes = [
  "from-[#102c48] via-[#0d1828] to-[#080c13]",
  "from-[#173b35] via-[#10211f] to-[#080c13]",
  "from-[#3a2445] via-[#25182e] to-[#080c13]",
  "from-[#3d3320] via-[#262015] to-[#080c13]",
];

const previewPalette = (title: string) =>
  title.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0) % artworkPalettes.length;

const Status = ({ status }: { status: ProjectStatus }) => (
  <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
    <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[status]}`} aria-hidden="true" />
    {statusLabels[status].label}
  </span>
);

const BrowserFrame = ({ p, aspect }: { p: PortfolioItem; aspect: string }) => {
  const urlShown = (displayOf(p.url) ?? p.category.toLowerCase()) || "projeto";
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border px-3.5 py-2.5">
        {[0, 1, 2].map((i) => (
          <span key={i} className="h-2 w-2 rounded-full bg-muted-foreground/30" aria-hidden="true" />
        ))}
        <span className="ml-3 truncate font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {urlShown}
        </span>
      </div>
      <div className={`relative overflow-hidden bg-secondary ${aspect}`}>
        <div className={`group/artwork relative h-full w-full overflow-hidden bg-gradient-to-br ${artworkPalettes[previewPalette(p.title)]}`}>
            <div className="absolute -right-10 -top-28 h-72 w-72 rounded-full bg-primary/20 blur-[90px] transition-transform duration-700 group-hover/artwork:scale-125" />
            <div className="absolute inset-0 opacity-[.12] [background-image:linear-gradient(rgba(255,255,255,.2)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.2)_1px,transparent_1px)] [background-size:34px_34px] [mask-image:linear-gradient(to_bottom,black,transparent)]" />
            <div className="relative grid h-full grid-cols-12 items-center gap-3 p-4 sm:gap-6 sm:p-8 md:p-10">
              <div className="col-span-7 min-w-0 sm:col-span-6">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/20 px-2.5 py-1 font-mono text-[8px] uppercase tracking-[.16em] text-white/70 sm:mb-5 sm:text-[10px]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#b3f46c]" />Prévia visual · {p.category || "Projeto digital"}
                </div>
                <h2 className="max-w-[12ch] text-balance font-display text-[clamp(1.35rem,3vw,3.8rem)] font-semibold leading-[.98] tracking-[-.055em] text-white">{p.title}</h2>
                <p className="mt-2 max-w-sm line-clamp-2 text-[10px] leading-relaxed text-white/65 sm:mt-4 sm:text-sm">{p.desc || "Projeto digital desenvolvido de acordo com a necessidade do cliente."}</p>
                <span className="mt-3 inline-flex items-center gap-2 text-[9px] font-medium text-[#c3ff7e] sm:mt-6 sm:text-xs">Abrir página do projeto <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" /></span>
              </div>
              <div className="col-span-5 sm:col-span-6">
                <div className="ml-auto w-full max-w-[430px] -rotate-2 overflow-hidden rounded-lg border border-white/30 bg-[#f6f8fb] shadow-[0_22px_65px_rgba(0,0,0,.4)] transition-transform duration-500 group-hover/artwork:rotate-0 sm:rounded-xl">
                  <div className="flex h-5 items-center gap-1 border-b border-slate-200 bg-white px-2 sm:h-8 sm:gap-1.5 sm:px-3">
                    <i className="h-1 w-1 rounded-full bg-slate-300 sm:h-1.5 sm:w-1.5" /><i className="h-1 w-1 rounded-full bg-slate-300 sm:h-1.5 sm:w-1.5" /><i className="h-1 w-1 rounded-full bg-slate-300 sm:h-1.5 sm:w-1.5" />
                    <span className="ml-2 truncate font-mono text-[6px] text-slate-400 sm:text-[8px]">{urlShown}</span>
                  </div>
                  <div className="min-h-[110px] bg-[radial-gradient(ellipse_at_85%_12%,#3ca2fa28,transparent_45%),linear-gradient(135deg,#f8fafc,#e8eef7)] p-2.5 sm:min-h-[210px] sm:p-5 md:min-h-[260px]">
                    <div className="flex items-center justify-between text-[6px] font-semibold text-slate-500 sm:text-[9px]"><span>{p.title.toUpperCase()}</span><span className="flex gap-2"><i className="h-1 w-5 rounded bg-slate-300 sm:w-8"/><i className="h-1 w-5 rounded bg-slate-300 sm:w-8"/></span></div>
                    <div className="mt-4 sm:mt-8">
                      <span className="block h-1 w-7 rounded bg-primary/70 sm:h-1.5 sm:w-12" />
                      <span className="mt-2 block h-2.5 w-[82%] rounded-sm bg-slate-800/90 sm:mt-3 sm:h-4" />
                      <span className="mt-1.5 block h-2.5 w-[56%] rounded-sm bg-primary/80 sm:mt-2 sm:h-4" />
                      <span className="mt-2 block h-1 w-[75%] rounded bg-slate-400/50 sm:mt-4 sm:h-1.5" />
                      <span className="mt-1 block h-1 w-[61%] rounded bg-slate-400/40 sm:mt-2 sm:h-1.5" />
                      <span className="mt-3 inline-block h-4 w-12 rounded-full bg-primary sm:mt-5 sm:h-7 sm:w-20" />
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-1 sm:mt-6 sm:gap-2"><i className="h-6 rounded-sm border border-slate-200 bg-white/80 sm:h-12"/><i className="h-6 rounded-sm border border-slate-200 bg-white/80 sm:h-12"/><i className="h-6 rounded-sm border border-slate-200 bg-white/80 sm:h-12"/></div>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

const Portfolio = () => {
  const [filter, setFilter] = useState("all");
  const { data: portfolio, loading } = usePortfolio(true);

  const filters = useMemo(() => {
    const categories = Array.from(new Set(portfolio.map((p) => p.category).filter(Boolean)));
    return { categories };
  }, [portfolio]);

  const filtered = useMemo(
    () => (filter === "all" ? portfolio : portfolio.filter((p) => p.category === filter)),
    [filter, portfolio]
  );

  const chip = (value: string, label: string) => (
    <button
      key={value}
      type="button"
      onClick={() => setFilter(value)}
      aria-pressed={filter === value}
      className={`pb-2 text-xs uppercase tracking-[0.14em] border-b-2 transition-colors ${
        filter === value
          ? "border-primary text-foreground"
          : "border-transparent text-muted-foreground hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );

  if (!loading && portfolio.length === 0) {
    return (
      <section id="portfolio" className="scroll-mt-28 border-t border-border py-24 md:py-32">
        <div className="container">
          <p className="eyebrow mb-5">Portfólio</p>
          <h2 className="display-huge text-4xl md:text-5xl max-w-xl">
            Projetos entrando no ar em breve.
          </h2>
          <p className="mt-4 text-muted-foreground max-w-md">
            Os cases publicados aparecem aqui assim que entram em produção.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="portfolio" className="scroll-mt-28 border-t border-border py-24 md:py-32">
      <div className="container">
        <div className="grid lg:grid-cols-12 gap-8 items-end mb-12">
          <div className="lg:col-span-8">
            <p className="eyebrow mb-5">Portfólio</p>
            <h2 className="display-huge text-5xl md:text-6xl max-w-2xl">
              Projetos que <em>saíram do papel.</em>
            </h2>
          </div>
          <p className="lg:col-span-4 text-sm md:text-base text-muted-foreground leading-relaxed max-w-md">
            Sites e sistemas desenvolvidos para necessidades reais de cada negócio.
            Design e desenvolvimento acompanhados do planejamento à publicação.
          </p>
        </div>

        <div className="flex flex-wrap gap-5 mb-12 border-b border-border">
          {chip("all", `Todos (${portfolio.length})`)}
          {filters.categories.map((c) => chip(c, c))}
        </div>

        <div className="grid md:grid-cols-2 gap-x-10 gap-y-14 max-w-6xl">
          {filtered.map((p, i) => {
            const anyFeatured = filtered.some((x) => x.featured);
            const featured = anyFeatured ? !!p.featured : i === 0;
            const status = statusLabels[p.status];
            const liveUrl = p.status === "privado" ? null : portfolioWebUrl(p.url);
            const hasUrl = !!liveUrl;

            return (
              <motion.article
                key={p.id}
                id={`projeto-${p.title.toLowerCase().replace(/\s+/g, "-")}`}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-8%" }}
                transition={{ duration: 0.45, delay: i * 0.06 }}
                className={`scroll-mt-28 ${featured ? "md:col-span-2" : ""}`}
              >
                <Link to={`/portfolio/${p.id}`} aria-label={`Abrir página do projeto ${p.title}`} className="block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4">
                  <BrowserFrame p={p} aspect={featured ? "aspect-[16/10] md:aspect-[16/8]" : "aspect-[4/3]"} />
                </Link>

                <div className="mt-6 flex items-start justify-between gap-4">
                  <div>
                    <p className="num-label">{p.category}</p>
                    <Link to={`/portfolio/${p.id}`} className={`mt-1.5 inline-block font-display leading-none transition-colors hover:text-primary ${
                        featured ? "text-3xl md:text-4xl" : "text-2xl md:text-3xl"
                      }`}>
                      {p.title}
                    </Link>
                  </div>
                  <Status status={p.status} />
                </div>

                <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-[52ch]">{p.desc}</p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {p.tech.map((t) => (
                    <span
                      key={t}
                      className="font-mono text-[10px] uppercase tracking-wider px-2 py-1 border border-border text-muted-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-border flex items-center justify-between gap-4">
                  <Link to={`/portfolio/${p.id}`} className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-primary transition-colors hover:text-primary/80">
                    Ver página do projeto <ArrowUpRight className="h-4 w-4" />
                  </Link>
                  {hasUrl ? (
                    <a href={liveUrl!} target="_blank" rel="noopener noreferrer" aria-label={`Abrir o site original de ${p.title} em uma nova aba`} className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-foreground">
                      <ExternalLink className="h-3.5 w-3.5" /><span className="hidden sm:inline">Site original</span>
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                      <Lock className="h-3.5 w-3.5" /> Sem site público
                    </span>
                  )}
                  <span className="num-label hidden sm:inline">// {status.label.toUpperCase()}</span>
                </div>
              </motion.article>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-10">
            Nenhum projeto desse tipo por enquanto.{" "}
            <button className="text-primary hover:underline" onClick={() => setFilter("all")}>
              Ver todos
            </button>
          </p>
        )}
      </div>
    </section>
  );
};

export default Portfolio;
