import { motion } from "framer-motion";

const stack = [
  "React",
  "TypeScript",
  "Node.js",
  "Python",
  "PostgreSQL",
  "Supabase",
  "Discord API",
  "WhatsApp API",
  "Tailwind CSS",
  "Prisma",
  "Redis",
  "Vercel",
  "MercadoPago",
  "MongoDB",
  "Express",
];

const TechStack = () => (
  <section className="py-16 border-y border-border overflow-hidden">
    <div className="container">
      <div className="grid lg:grid-cols-[0.6fr_1.4fr] gap-8 items-start">
        <div>
          <p className="eyebrow text-primary mb-3">Stack real</p>
          <h2 className="font-display text-2xl md:text-3xl font-bold">Ferramentas que entram no código</h2>
          <p className="text-sm text-muted-foreground mt-3">
            Nada de mascote 3D. Essas são as peças que costumo usar para colocar projeto no ar e manter funcionando.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 border border-border">
          {stack.map((t, i) => (
            <motion.span
              key={t}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.025 }}
              className="px-4 py-3 border-b border-r border-border last:border-r-0 bg-card text-sm text-muted-foreground hover:text-foreground transition-colors cursor-default font-mono-label"
            >
              {t}
            </motion.span>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default TechStack;
