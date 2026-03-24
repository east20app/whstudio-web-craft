import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";

const Hero = () => (
  <section id="inicio" className="relative min-h-screen flex items-center overflow-hidden">
    <img src={heroBg} alt="" className="absolute inset-0 w-full h-full object-cover" width={1920} height={1080} />
    <div className="absolute inset-0 bg-foreground/70" />
    <div className="container relative z-10 py-32">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-2xl"
      >
        <span className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-primary-foreground text-sm font-medium mb-6">
          Desenvolvimento Web Profissional
        </span>
        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 text-primary-foreground">
          Sites que <span className="text-gradient">transformam</span> seu negócio
        </h1>
        <p className="text-lg text-primary-foreground/80 mb-8 max-w-lg">
          Criamos sites modernos e responsivos para empresas, lojas, restaurantes, lanchonetes e muito mais.
        </p>
        <div className="flex flex-wrap gap-4">
          <Button size="lg" asChild>
            <a href="#contato">
              Solicitar Orçamento <ArrowRight className="ml-2 w-4 h-4" />
            </a>
          </Button>
          <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" asChild>
            <a href="#portfolio">Ver Portfólio</a>
          </Button>
        </div>
      </motion.div>
    </div>
  </section>
);

export default Hero;
