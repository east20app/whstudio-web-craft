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
    <section id="depoimentos" className="scroll-mt-32 md:scroll-mt-36 py-20 md:py-28 border-t border-border">
      <div className="container">
        <div className="mb-10 md:mb-14 max-w-3xl">
          <p className="eyebrow mb-5">Quem confiou</p>
          <h2 className="display-huge text-4xl md:text-6xl">
            Avaliação de quem recebeu o projeto. <em>Escrita por eles.</em>
          </h2>
        </div>

        <div className="grid max-w-6xl gap-x-10 gap-y-10 md:grid-cols-2">
          {[featured, ...rest].map((item, i) => (
            <motion.figure
              key={item.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8%" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className={`flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card p-6 sm:p-8 ${rest.length === 0 ? "md:col-span-2" : ""}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-4">
                <div>
                  <p className="eyebrow mb-2">Projeto entregue</p>
                  {item.project_name && <p className="font-display text-xl sm:text-2xl">{item.project_name}</p>}
                </div>
                <Stars rating={item.rating ?? 0} />
              </div>
              <blockquote className="my-6 max-w-[55ch] flex-1 font-display text-xl leading-relaxed sm:text-2xl">
                “{item.testimonial}”
              </blockquote>
              <figcaption className="flex items-center justify-between gap-4 border-t border-border pt-4">
                <p className="text-sm font-semibold">{item.client_name || "Cliente WH Studio"}</p>
                <span className="num-label">Feedback publicado</span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
