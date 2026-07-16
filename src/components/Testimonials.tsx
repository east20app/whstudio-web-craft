import { useEffect, useState } from "react";
import { Star, Quote } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Item = {
  id: string;
  client_name: string;
  project_name: string;
  rating: number | null;
  testimonial: string | null;
};

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

  if (loading || items.length === 0) return null;

  return (
    <section id="depoimentos" className="py-20 md:py-28 px-4 relative border-t border-border">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="eyebrow text-primary mb-3">Depoimentos</p>
          <h2 className="display-huge text-3xl md:text-5xl">
            O que nossos <span className="text-accent-blue">clientes</span> dizem
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Avaliações reais de projetos entregues pela WH Studio.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((t) => (
            <article
              key={t.id}
              className="card-premium p-6 flex flex-col gap-4"
            >
              <Quote className="w-6 h-6 text-primary/70" />
              <p className="text-sm text-foreground/90 leading-relaxed line-clamp-6">
                {t.testimonial}
              </p>
              <div className="flex items-center gap-1 mt-auto">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      (t.rating ?? 0) > i
                        ? "text-warning fill-warning"
                        : "text-muted-foreground/40"
                    }`}
                  />
                ))}
              </div>
              <div className="border-t border-border pt-3">
                <p className="text-sm font-semibold">{t.client_name || "Cliente WH Studio"}</p>
                {t.project_name && (
                  <p className="text-xs text-muted-foreground">{t.project_name}</p>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
