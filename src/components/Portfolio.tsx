import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Lock } from "lucide-react";
import { statusLabels } from "@/config/site";
import { usePortfolio } from "@/hooks/usePortfolio";

const Portfolio = () => {
  const [filter, setFilter] = useState("all");
  const { data: portfolio, loading } = usePortfolio(true);

  // Filtros derivados dos projetos cadastrados no painel.
  const filters = useMemo(() => {
    const categories = Array.from(new Set(portfolio.map((p) => p.category).filter(Boolean)));
    const techs = Array.from(new Set(portfolio.flatMap((p) => p.tech)));
    return { categories, techs };
  }, [portfolio]);

  const filtered = useMemo(
    () =>
      filter === "all"
        ? portfolio
        : portfolio.filter((p) => p.category === filter || p.tech.includes(filter)),
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

  return (
    <section id="portfolio" className="py-24 md:py-32 border-t border-border">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <p className="eyebrow mb-4">Portfólio</p>
            <h2 className="display-huge text-5xl md:text-6xl max-w-xl">
              Projetos com <em>história pra contar.</em>
            </h2>
          </div>
          <p className="text-muted-foreground max-w-sm text-sm md:pb-2">
            Trabalhos que já saíram daqui — para diferentes segmentos. Cada um nasce do escopo, não de um template.
          </p>
        </div>

        <div className="flex flex-wrap gap-5 mb-12 border-b border-border">
          {chip("all", `Todos (${portfolio.length})`)}
          {filters.categories.map((c) => chip(c, c))}
          {filters.techs.map((t) => chip(t, t))}
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {filtered.map((p, i) => {
            const status = statusLabels[p.status];
            const hasUrl = !!p.url;

            return (
              <motion.article
                key={p.title}
                id={`projeto-${p.title.toLowerCase().replace(/\s+/g, "-")}`}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="flex flex-col border border-border bg-card hover:border-foreground/25 transition-colors scroll-mt-24"
              >
                <div className={`relative aspect-video bg-gradient-to-br ${p.color}`}>
                  <div className="absolute top-3 left-3">
                    <span
                      className={`font-mono text-[10px] uppercase tracking-widest px-2.5 py-1 bg-background/80 backdrop-blur-sm border ${status.className}`}
                    >
                      {status.label}
                    </span>
                  </div>
                  <div className="absolute inset-0 flex items-end p-6">
                    <div>
                      <p className="font-mono text-[11px] uppercase tracking-widest text-white/60">{p.category}</p>
                      <h3 className="font-display text-3xl text-white mt-1">{p.title}</h3>
                    </div>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <p className="text-sm text-muted-foreground leading-relaxed mb-5">{p.desc}</p>

                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {p.tech.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setFilter(t)}
                        className="font-mono text-[10px] uppercase tracking-wider px-2 py-1 border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
                      >
                        {t}
                      </button>
                    ))}
                  </div>

                  <div className="mt-auto border-t border-border pt-4">
                    {hasUrl ? (
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                      >
                        Ver projeto <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                        <Lock className="w-3.5 h-3.5" /> Projeto privado
                      </span>
                    )}
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-10">
            Nenhum projeto com esse filtro. <button className="text-primary hover:underline" onClick={() => setFilter("all")}>Ver todos</button>
          </p>
        )}
      </div>
    </section>
  );
};

export default Portfolio;
