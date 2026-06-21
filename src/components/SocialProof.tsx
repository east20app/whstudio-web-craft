import { motion } from "framer-motion";
import { testimonials } from "@/config/site";

const SocialProof = () => (
  <section className="py-32 border-t border-border">
    <div className="container">
      <div className="grid md:grid-cols-12 gap-8 mb-16">
        <div className="md:col-span-3">
          <p className="eyebrow">[ 03 ] Quem confiou</p>
        </div>
        <div className="md:col-span-9">
          <h2 className="display-huge text-5xl md:text-7xl">
            Não é review de e-commerce. <span className="text-foreground/50">É cliente que volta.</span>
          </h2>
        </div>
      </div>

      {/* Grid assimétrico: 1 grande + 2 pequenos */}
      <div className="grid md:grid-cols-12 gap-6">
        {testimonials.map((t, i) => {
          const big = i === 0;
          return (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`border border-border p-8 md:p-10 flex flex-col ${
                big ? "md:col-span-7 md:row-span-2 bg-foreground/[0.02]" : "md:col-span-5"
              }`}
            >
              <blockquote
                className={`font-display font-extrabold tracking-tight ${
                  big ? "text-2xl md:text-4xl leading-tight" : "text-lg md:text-xl leading-snug"
                }`}
              >
                "{t.text}"
              </blockquote>
              <figcaption className="mt-auto pt-8 flex items-center justify-between border-t border-border">
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="eyebrow mt-1">{t.role}</p>
                </div>
                <span className="eyebrow text-accent-blue">★ ★ ★ ★ ★</span>
              </figcaption>
            </motion.figure>
          );
        })}
      </div>
    </div>
  </section>
);

export default SocialProof;
