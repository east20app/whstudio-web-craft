import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface PageHeaderProps {
  eyebrow: string;
  title: ReactNode;
  description: string;
}

const PageHeader = ({ eyebrow, title, description }: PageHeaderProps) => (
  <section className="py-20 border-b border-border">
    <div className="container text-center max-w-3xl">
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="eyebrow text-primary mb-4 block"
      >
        {eyebrow}
      </motion.span>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="heading-display text-4xl md:text-5xl mt-3 mb-5"
      >
        {title}
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-muted-foreground text-base md:text-lg"
      >
        {description}
      </motion.p>
    </div>
  </section>
);

export default PageHeader;
