import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { testimonials } from "@/config/site";

const SocialProof = () => (
  <section className="py-24 md:py-32 border-t border-border">
    <div className="container">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
        <div>
          <p className="eyebrow mb-4">Quem confiou</p>
          <h2 className="display-huge text-5xl md:text-7xl max-w-3xl">
            Não é review de e-commerce. <em>É cliente que volta.</em>
          </h2>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t, i) => (
          <motion.figure
            key={t.name}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="flex flex-col py-8 pr-6 border-b border-border md:border-r md:last:border-r-0"
          >
            <div className="flex items-center gap-0.5 mb-4" aria-label="5 de 5 estrelas">
              {Array.from({ length: 5 }).map((_, s) => (
                <Star key={s} className="w-3.5 h-3.5 text-warning fill-warning" aria-hidden="true" />
              ))}
            </div>
            <blockquote className="font-display text-xl md:text-2xl leading-snug flex-1">
              "{t.text}"
            </blockquote>
            <figcaption className="mt-6">
              <p className="text-sm font-semibold">{t.name}</p>
              <p className="eyebrow mt-1">{t.role}</p>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </div>
  </section>
);

export default SocialProof;
