import { motion } from "framer-motion";
import { ExternalLink, Lock } from "lucide-react";
import { portfolio, statusLabels } from "@/config/site";

const Portfolio = () => (
  <section id="portfolio" className="py-24 bg-background">
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="eyebrow text-primary mb-3">Trabalho entregue</span>
        <h2 className="font-display text-3xl md:text-5xl font-bold">Tela real vale mais que promessa</h2>
        <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
          Alguns projetos são públicos. Outros ficam privados por regra do cliente. Quando dá, mostro print e stack.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {portfolio.map((p, i) => {
          const status = statusLabels[p.status];
          const hasUrl = !!p.url;

          return (
            <motion.article
              key={p.title}
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="card-dark-hover overflow-hidden flex flex-col group"
            >
              <div className={`relative aspect-video ${p.screenshot ? "" : `bg-gradient-to-br ${p.color}`} overflow-hidden`}>
                {p.screenshot ? (
                  <>
                    <img
                      src={p.screenshot}
                      alt={`Screenshot de ${p.title}`}
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
                  </>
                ) : (
                  <div className={`absolute inset-0 bg-gradient-to-br ${p.color} opacity-80`} />
                )}

                <div className="absolute top-3 left-3">
                  <span className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border ${status.className}`}>
                    {status.label}
                  </span>
                </div>
                <div className="absolute inset-0 flex items-end p-6">
                  <div>
                    <p className="text-xs font-medium text-white/70">{p.category}</p>
                    <h3 className="text-2xl font-bold font-display text-white">{p.title}</h3>
                  </div>
                </div>
              </div>

              <div className="p-6 flex flex-col flex-1">
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{p.desc}</p>

                <div className="flex flex-wrap gap-1.5 mb-5">
                  {p.tech.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] font-medium px-2 py-1 rounded-md bg-secondary border border-border text-muted-foreground font-mono-label"
                    >
                      {t}
                    </span>
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
                      Abrir projeto <ExternalLink className="w-3.5 h-3.5" />
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
    </div>
  </section>
);

export default Portfolio;
