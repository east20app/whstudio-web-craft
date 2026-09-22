import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Services from "@/components/Services";
import CTAFinal from "@/components/CTAFinal";
import Seo, { pageSeo, orgJsonLd } from "@/components/Seo";
import { motion } from "framer-motion";
import { Check, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { services as configServices } from "@/config/site";
import { usePublicServices, toPublicService } from "@/hooks/usePublicServices";
import { usePortfolio } from "@/hooks/usePortfolio";

const normalize = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

/** Serviço -> projeto real correspondente no portfólio. */
const EXAMPLE_BY_TITLE: Record<string, string> = {
  "criacao de sites": "Peixe Store",
  "criacao de site": "Peixe Store",
  "bots para discord": "DroxBot",
  "bots discord": "DroxBot",
  "apis e sistemas": "Copa Ativa",
  "dashboards": "DroxBot",
  "sistemas de delivery": "Serra Delivery",
  "sistema de delivery": "Serra Delivery",
};

const anchorFor = (title: string) => `/portfolio#projeto-${title.toLowerCase().replace(/\s+/g, "-")}`;

const ServicosPage = () => {
  const { data: portfolio } = usePortfolio(true);
  const live = usePublicServices();
  const servicesToShow = live && live.length > 0 ? live : configServices.map(toPublicService);

  return (
  <>
    <Seo {...pageSeo.servicos} jsonLd={orgJsonLd} />
    <Header />
    <main className="pt-16">
      <section className="py-20 md:py-28 border-b border-border">
        <div className="container max-w-4xl">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="eyebrow mb-6"
          >
            O que a gente faz
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="display-huge text-5xl md:text-7xl"
          >
            Site, bot, sistema — <em>o que você precisar.</em>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-base md:text-lg mt-6 max-w-2xl"
          >
            Da landing page à plataforma completa: cada serviço é desenvolvido do zero, com foco em
            funcionar bem, carregar rápido e atendimento direto pelo WhatsApp.
          </motion.p>
        </div>
      </section>

      <Services />

      {/* Detalhes de cada serviço */}
      <section className="py-24 md:py-32 border-t border-border">
        <div className="container max-w-5xl">
          <div className="mb-12">
            <p className="eyebrow mb-4">Por dentro</p>
            <h2 className="display-huge text-5xl md:text-6xl">
              Detalhes de <em>cada serviço.</em>
            </h2>
          </div>

          <div className="border-t border-border">
            {servicesToShow.map((s, i) => {
              const Icon = s.icon;
              const exampleTitle = EXAMPLE_BY_TITLE[normalize(s.title)];
              const example = portfolio.find((p) => p.title === exampleTitle);

              return (
                <motion.article
                  key={s.key}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                  className="py-10 border-b border-border"
                >
                  <div className="flex items-start gap-6 md:gap-8">
                    <div className="w-12 h-12 md:w-14 md:h-14 border border-border bg-card flex items-center justify-center shrink-0">
                      <Icon className="w-6 h-6 md:w-7 md:h-7 text-primary" strokeWidth={1.5} aria-hidden="true" />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2 mb-3">
                        <h3 className="font-display text-2xl md:text-3xl">{s.title}</h3>
                        {example && (
                          <Link
                            to={anchorFor(example.title)}
                            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-primary hover:underline shrink-0"
                          >
                            Exemplo real: {example.title}
                            <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                          </Link>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-5 max-w-[55ch]">{s.short}</p>
                      {s.benefits.length > 0 && (
                        <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2.5">
                          {s.benefits.map((b) => (
                            <li key={b} className="flex items-start gap-2.5 text-sm text-foreground/80">
                              <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <CTAFinal />
    </main>
    <Footer />
  </>
  );
};


export default ServicosPage;