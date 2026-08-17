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

/**
 * Depoimentos reais aprovados no painel (feedbacks publicados).
 * Se ainda não houver nenhum publicado, cai no conteúdo fixo do SocialProof.
 */
const Testimonials = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.rpc("get_published_feedbacks" as any, { _limit: 9 });
      setItems(((data ?? []) as unknown) as Item[]);

      setLoading(false);
    })();
  }, []);

  if (loading) return null;
  if (items.length === 0) return <SocialProof />;

  return (
    <section id="depoimentos" className="py-24 md:py-32 border-t border-border">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <p className="eyebrow mb-4">Quem confiou</p>
            <h2 className="display-huge text-5xl md:text-7xl max-w-3xl">
              Avaliação de quem recebeu o projeto. <em>Escrita por eles.</em>
            </h2>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3">
          {items.map((t, i) => (
            <motion.article
              key={t.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="flex flex-col py-8 pr-6 border-b border-border md:border-r md:last:border-r-0"
            >
              <div className="flex items-center gap-0.5 mb-4" aria-label={`${t.rating ?? 0} de 5 estrelas`}>
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star
                    key={s}
                    className={`w-3.5 h-3.5 ${(t.rating ?? 0) > s ? "text-warning fill-warning" : "text-muted-foreground/25"}`}
                    aria-hidden="true"
                  />
                ))}
              </div>
              <p className="font-display text-xl md:text-2xl leading-snug flex-1">"{t.testimonial}"</p>
              <footer className="mt-6">
                <p className="text-sm font-semibold">{t.client_name || "Cliente WH Studio"}</p>
                {t.project_name && <p className="eyebrow mt-1">{t.project_name}</p>}
              </footer>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
