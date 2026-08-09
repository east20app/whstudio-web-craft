import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Lock } from "lucide-react";
import { portfolio, statusLabels } from "@/config/site";

const Portfolio = () => {
  const [filter, setFilter] = useState("all");

  // Filtros derivados do próprio array (categorias + tecnologias) — sem banco.
  const filters = useMemo(() => {
    const categories = Array.from(new Set(portfolio.map((p) => p.category)));
    const techs = Array.from(new Set(portfolio.flatMap((p) => p.tech)));
    return { categories, techs };
  }, []);

  const filtered = useMemo(
    () =>
      filter === "all"
        ? portfolio
        : portfolio.filter((p) => p.category === filter || p.tech.includes(filter)),
    [filter]
  );

  const chip = (value: string, label: string) => (
    <button
      key={value}
      type="button"
      onClick={() => setFilter(value)}
      aria-pressed={filter === value}
      className={`font-mono text-[10px] uppercase tracking-[0.14em] px-3 py-1.5 rounded-full border transition-colors ${
        filter === value
          ? "border-primary/50 bg-primary/10 text-primary"
          : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
      }`}
    >
      {label}
    </button>
  );

  return (
    <section id="portfolio" className="py-24">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span className="text-sm font-medium text-primary uppercase tracking-widest">Nosso trabalho</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2">Portfólio</h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            Alguns dos projetos que já desenvolvemos para clientes em diferentes segmentos.
          </p>
        </motion.div>

        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
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
                initial={{ opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="card-dark-hover overflow-hidden flex flex-col scroll-mt-24"
              >
                <div className={`relative aspect-video bg-gradient-to-br ${p.color}`}>
                  <div className="absolute top-3 left-3">
                    <span
                      className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border backdrop-blur-sm ${status.className}`}
                    >
                      {status.label}
                    </span>
                  </div>
                  <div className="absolute inset-0 flex items-end p-6">
                    <div>
                      <p className="text-xs font-medium text-white/70">{p.category}</p>
                      <h3 className="text-2xl font-bold text-white">{p.title}</h3>
                    </div>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{p.desc}</p>

                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {p.tech.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setFilter(t)}
                        className="text-[10px] font-medium px-2 py-1 rounded-md bg-secondary border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
                      >
                        {t}
                      </button>
                    ))}
                  </div>

                  <div className="mt-auto">
                    {hasUrl ? (
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
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
