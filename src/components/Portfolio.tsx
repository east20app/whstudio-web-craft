import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ExternalLink, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { statusLabels, type ProjectStatus } from "@/config/site";
import { usePortfolio, type PortfolioItem } from "@/hooks/usePortfolio";
import { portfolioWebUrl, publicPortfolioCover } from "@/lib/portfolio-url";

const STATUS_DOT: Record<ProjectStatus, string> = {
  online: "bg-emerald-500",
  demo: "bg-accent-2",
  "em-desenvolvimento": "bg-warning",
  privado: "bg-muted-foreground",
};

const displayOf = (url?: string) => (url ? url.replace(/^https?:\/\//, "").replace(/\/$/, "") : undefined);
const Status = ({ status }: { status: ProjectStatus }) => (
  <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
    <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[status]}`} aria-hidden="true" />
    {statusLabels[status]?.label ?? "Projeto"}
  </span>
);

const BrowserFrame = ({ p, aspect }: { p: PortfolioItem; aspect: string }) => {
  const [failed, setFailed] = useState(false);
  const cover = publicPortfolioCover(p.coverUrl) ?? publicPortfolioCover(p.galleryUrls[0]);
  const urlShown = (displayOf(p.url) ?? p.category.toLowerCase()) || "Projeto";
  return (
    <div className="wh-project-frame">
      <div className="wh-project-frame__bar">{urlShown}</div>
      <div className={`relative overflow-hidden bg-card ${aspect}`}>
        {cover && !failed ? (
          <img key={cover} src={cover} alt={`Captura de ${p.title}`} loading="lazy" decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-top" onError={() => setFailed(true)} />
        ) : (
          <div className="wh-project-frame__title">
            <span>{p.category || "Projeto digital"}</span>
            <strong>{p.title}</strong>
          </div>
        )}
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
