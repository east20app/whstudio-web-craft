import { motion } from "framer-motion";
import { testimonials } from "@/config/site";

/**
 * Fallback fixo usado apenas quando ainda não há feedbacks publicados.
 * Visualmente distinto da seção de avaliações: sem estrelas, tipografia menor,
 * com marcas mono — para não parecer avaliação verificada.
 */
const SocialProof = () => (
  <section id="depoimentos" className="py-24 md:py-32 border-t border-border">
    <div className="container">
      <div className="grid lg:grid-cols-12 gap-8 items-end mb-14">
        <div className="lg:col-span-8">
          <p className="eyebrow mb-5">Notas de clientes</p>
          <h2 className="display-huge text-4xl md:text-5xl max-w-2xl">
            Alguns relatos de quem já passou por aqui.
          </h2>
        </div>
        <p className="lg:col-span-4 text-sm text-muted-foreground leading-relaxed max-w-md">
          Histórias reais, contadas do jeito de quem recebeu a entrega. Em breve,
          avaliações verificadas publicadas aqui direto dos clientes.
        </p>
      </div>

      <div className="border-t border-border">
        {testimonials.map((t, i) => (
          <motion.figure
            key={t.name}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-8%" }}
            transition={{ duration: 0.4, delay: i * 0.04 }}
            className="border-b border-border py-8 md:py-9"
          >
            <blockquote className="font-display text-lg md:text-xl leading-snug max-w-2xl">
              “{t.text}”
            </blockquote>
            <figcaption className="mt-4 num-label">
              — {t.name} · {t.role}
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </div>
  </section>
);

export default SocialProof;