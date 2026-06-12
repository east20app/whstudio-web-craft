import { motion } from "framer-motion";
import { Star, Users } from "lucide-react";
import { stats, testimonials } from "@/config/site";

const SocialProof = () => (
  <section className="py-24">
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <span className="eyebrow text-primary inline-flex items-center gap-2"><Users className="w-3.5 h-3.5" /> Quem já contratou</span>
        <h2 className="font-display text-3xl md:text-5xl font-bold mt-3">O que o pessoal fala</h2>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 max-w-4xl mx-auto">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            className="card-dark p-5 text-center"
          >
            <p className="text-2xl md:text-3xl font-extrabold text-gradient">{s.value}</p>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Testimonials */}
      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="card-dark-hover p-7"
          >
            <div className="flex gap-1 mb-4" aria-label="5 estrelas">
              {[...Array(5)].map((_, j) => (
                <Star key={j} className="w-4 h-4 fill-primary text-primary" />
              ))}
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">"{t.text}"</p>
            <div>
              <p className="font-semibold text-sm">{t.name}</p>
              <p className="text-xs text-muted-foreground">{t.role}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default SocialProof;
