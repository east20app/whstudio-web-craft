import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Lock } from "lucide-react";
import { statusLabels, type ProjectStatus } from "@/config/site";
import { usePortfolio, type PortfolioItem } from "@/hooks/usePortfolio";

const STATUS_DOT: Record<ProjectStatus, string> = {
  online: "bg-emerald-500",
  demo: "bg-accent-2",
  "em-desenvolvimento": "bg-warning",
  privado: "bg-muted-foreground",
};

const initialsOf = (title: string) => {
  const words = title.trim().split(/\s+/).filter(Boolean);
  if (words.length >= 2) return `${words[0][0]}${words[1][0]}`.toUpperCase();
  return title.slice(0, 2).toUpperCase();
};

const displayOf = (url?: string) => (url ? url.replace(/^https?:\/\//, "").replace(/\/$/, "") : undefined);

const Status = ({ status }: { status: ProjectStatus }) => (
  <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
    <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[status]}`} aria-hidden="true" />
    {statusLabels[status].label}
  </span>
);

const BrowserFrame = ({ p, aspect }: { p: PortfolioItem; aspect: string }) => {
  const urlShown = (displayOf(p.url) ?? p.category.toLowerCase()) || "projeto";
  return (
    <div className="flex h-full flex-col border border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border px-3.5 py-2.5">
        {[0, 1, 2].map((i) => (
          <span key={i} className="h-2 w-2 rounded-full bg-muted-foreground/30" aria-hidden="true" />
        ))}
        <span className="ml-3 truncate font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {urlShown}
        </span>
      </div>
      <div className={`relative overflow-hidden bg-secondary ${aspect}`}>
        {p.coverUrl ? (
          <img
            src={p.coverUrl}
            alt={`Preview do projeto ${p.title}`}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover object-top"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-4 px-6">
            <span
              className="font-display text-6xl md:text-7xl leading-none text-foreground/25"
              aria-hidden="true"
            >
              {initialsOf(p.title)}
            </span>
            <span className="num-label">Projeto privado</span>
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
      <section id="portfolio" className="border-t border-border py-24 md:py-32">
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
    <section id="portfolio" className="border-t border-border py-24 md:py-32">
      <div className="container">
        <div className="grid lg:grid-cols-12 gap-8 items-end mb-12">
          <div className="lg:col-span-8">
            <p className="eyebrow mb-5">Portfólio</p>
            <h2 className="display-huge text-5xl md:text-6xl max-w-2xl">
              Projetos com <em>história pra contar.</em>
            </h2>
          </div>
          <p className="lg:col-span-4 text-sm md:text-base text-muted-foreground leading-relaxed max-w-md">
            Cada projeto nasce do escopo de um cliente — não de um template.
            E cada um foi escrito por uma pessoa só, do briefing ao deploy.
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
            const hasUrl = !!p.url;

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
                <BrowserFrame p={p} aspect={featured ? "aspect-[16/10] md:aspect-[16/8]" : "aspect-[4/3]"} />

                <div className="mt-6 flex items-start justify-between gap-4">
                  <div>
                    <p className="num-label">{p.category}</p>
                    <h3
                      className={`font-display mt-1.5 leading-none ${
                        featured ? "text-3xl md:text-4xl" : "text-2xl md:text-3xl"
                      }`}
                    >
                      {p.title}
                    </h3>
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
                  {hasUrl ? (
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-primary hover:text-primary/80 transition-colors"
                    >
                      Ver projeto <ArrowUpRight className="w-4 h-4" />
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                      <Lock className="w-3.5 h-3.5" /> Projeto privado
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