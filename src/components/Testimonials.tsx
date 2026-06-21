import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

type Item = {
  id: string;
  client_name: string;
  project_name: string | null;
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
        .limit(6);
      setItems((data ?? []) as Item[]);
      setLoading(false);
    })();
  }, []);

  if (loading || items.length === 0) return null;

  return (
    <section id="depoimentos" className="py-28 md:py-36 bg-background">
      <div className="container-wide">
        <div className="grid md:grid-cols-12 gap-10 mb-16 items-end rule-b pb-10">
          <div className="md:col-span-2">
            <span className="num-mono text-[11px] text-muted-foreground">§ 07</span>
          </div>
          <div className="md:col-span-7">
            <p className="eyebrow text-muted-foreground mb-4">Em produção</p>
            <h2 className="display-xl text-[clamp(2.4rem,5vw,4.2rem)]">
              O que dizem <span className="serif-italic">depois da entrega.</span>
            </h2>
          </div>
        </div>

        <div className="divide-y divide-[hsl(var(--rule))] rule-b">
          {items.map((t, i) => (
            <motion.figure
              key={t.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="grid md:grid-cols-12 gap-x-10 gap-y-6 py-12 md:py-16"
            >
              <div className="md:col-span-2 num-mono text-[11px] text-muted-foreground">
                — {String(i + 1).padStart(2, "0")}
              </div>
              <blockquote className="md:col-span-7 font-display text-2xl md:text-3xl leading-snug text-foreground">
                <span className="serif-italic text-[hsl(var(--accent))]">“</span>
                {t.testimonial}
                <span className="serif-italic text-[hsl(var(--accent))]">”</span>
              </blockquote>
              <figcaption className="md:col-span-3 text-sm">
                <div className="font-medium">{t.client_name}</div>
                {t.project_name && (
                  <div className="text-muted-foreground text-xs mt-1 num-mono">{t.project_name}</div>
                )}
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
