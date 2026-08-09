import { useEffect, useState } from "react";
import { Star, Quote } from "lucide-react";
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
      const { data } = await supabase
        .from("feedbacks")
        .select("id, client_name, project_name, rating, testimonial")
        .eq("status", "published")
        .eq("allow_publish", true)
        .order("submitted_at", { ascending: false })
        .limit(9);
      setItems((data ?? []) as Item[]);
      setLoading(false);
    })();
  }, []);

  if (loading) return null;
  if (items.length === 0) return <SocialProof />;

  return (
    <section id="depoimentos" className="py-28 md:py-32 border-t border-border">
      <div className="container">
        <div className="grid md:grid-cols-12 gap-8 mb-14">
          <div className="md:col-span-3">
            <p className="eyebrow">[ 03 ] Quem confiou</p>
          </div>
          <div className="md:col-span-9">
            <h2 className="display-huge text-4xl md:text-6xl">
              Avaliação de quem recebeu o projeto.{" "}
              <span className="text-foreground/50">Escrita por eles.</span>
            </h2>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((t, i) => (
            <motion.article
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="card-premium p-7 flex flex-col gap-4"
            >
              <Quote className="w-5 h-5 text-foreground/25" strokeWidth={1.5} aria-hidden="true" />
              <p className="text-sm text-foreground/85 leading-relaxed">{t.testimonial}</p>
              <div className="flex items-center gap-1 mt-auto">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star
                    key={s}
                    className={`w-4 h-4 ${
                      (t.rating ?? 0) > s ? "text-warning fill-warning" : "text-muted-foreground/30"
                    }`}
                    aria-hidden="true"
                  />
                ))}
                <span className="sr-only">{t.rating ?? 0} de 5 estrelas</span>
              </div>
              <div className="border-t border-border pt-4">
                <p className="text-sm font-semibold">{t.client_name || "Cliente WH Studio"}</p>
                {t.project_name && <p className="eyebrow mt-1">{t.project_name}</p>}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
