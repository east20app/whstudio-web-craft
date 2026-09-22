import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import SocialProof from "@/components/SocialProof";

type Item = {
  id: string;
  client_name: string;
  project_name: string;
  rating: number | null;
  testimonial: string | null;
};

function Stars({ rating }: { rating: number }) {
  return (
    <div
      className="flex items-center gap-1"
      aria-label={`${rating} de 5 estrelas`}
      role="img"
    >
      {Array.from({ length: 5 }).map((_, s) => (
        <Star
          key={s}
          className={`w-3 h-3 ${rating > s ? "text-warning fill-warning" : "text-muted-foreground/25"}`}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

/**
 * Depoimentos reais aprovados no painel (feedbacks publicados).
 * Se ainda não houver nenhum publicado, cai no conteúdo fixo do SocialProof
 * — visualmente distinto, pra não fingir que é avaliação verificada.
 */
const Testimonials = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.rpc("get_published_feedbacks", { _limit: 9 });
      setItems(((data ?? []) as unknown) as Item[]);
      setLoading(false);
    })();
  }, []);

  if (loading) return null;
  if (items.length === 0) return <SocialProof />;

  const [featured, ...rest] = items;

  return (
    <section id="depoimentos" className="py-24 md:py-32 border-t border-border">
      <div className="container">
        <div className="mb-16 max-w-3xl">
          <p className="eyebrow mb-5">Quem confiou</p>
          <h2 className="display-huge text-5xl md:text-7xl">
            Avaliação de quem recebeu o projeto. <em>Escrita por eles.</em>
          </h2>
        </div>

        <div className="grid lg:grid-cols-12 gap-x-12">
          <motion.figure
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-8%" }}
            transition={{ duration: 0.45 }}
            className="lg:col-span-7 pb-10 lg:pb-0 lg:border-r lg:border-border lg:pr-12 self-start"
          >
            <Stars rating={featured.rating ?? 0} />
            <blockquote className="mt-6 font-display text-3xl md:text-4xl leading-snug">
              “{featured.testimonial}”
            </blockquote>
            <figcaption className="mt-8">
              <p className="text-base font-semibold">{featured.client_name || "Cliente WH Studio"}</p>
              {featured.project_name && <p className="num-label mt-1.5">{featured.project_name}</p>}
            </figcaption>
          </motion.figure>

          <div className="lg:col-span-5 divide-y divide-border">
            {rest.map((t, i) => (
              <motion.figure
                key={t.id}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-8%" }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="py-8 lg:py-9"
              >
                <blockquote className="font-display text-lg md:text-xl leading-snug">
                  “{t.testimonial}”
                </blockquote>
                <figcaption className="mt-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold">{t.client_name || "Cliente WH Studio"}</p>
                    {t.project_name && <p className="num-label mt-1">{t.project_name}</p>}
                  </div>
                  <Stars rating={t.rating ?? 0} />
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;