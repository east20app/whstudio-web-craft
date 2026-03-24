import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Básico",
    price: "150",
    desc: "Ideal para quem está começando",
    features: ["Site simples (1-3 páginas)", "Design responsivo", "Entrega em até 7 dias", "1 revisão inclusa"],
    popular: false,
  },
  {
    name: "Pro",
    price: "350",
    desc: "Perfeito para empresas e lojas",
    features: ["Site completo + sistema", "Design premium", "Painel administrativo", "Integração com pagamentos", "3 revisões inclusas", "Suporte por 30 dias"],
    popular: true,
  },
  {
    name: "Premium",
    price: "800",
    suffix: "+",
    desc: "Para projetos complexos e personalizados",
    features: ["Sistema completo sob medida", "Bot Discord personalizado", "Dashboard avançado", "API própria", "Revisões ilimitadas", "Suporte por 90 dias", "Hospedagem inclusa"],
    popular: false,
  },
];

const Plans = () => (
  <section id="planos" className="py-24">
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="text-sm font-medium text-primary uppercase tracking-widest">Preços</span>
        <h2 className="text-3xl md:text-4xl font-bold mt-2">Planos que cabem no seu bolso</h2>
        <p className="text-muted-foreground mt-4 max-w-lg mx-auto">Escolha o plano ideal para o seu projeto. Todos incluem design moderno e código de qualidade.</p>
      </motion.div>
      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {plans.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={`relative rounded-xl border p-8 flex flex-col ${
              p.popular
                ? "bg-card border-primary ring-2 ring-primary glow"
                : "bg-card border-border"
            }`}
          >
            {p.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full uppercase tracking-wider">
                Popular
              </span>
            )}
            <h3 className="text-xl font-bold">{p.name}</h3>
            <p className="text-sm text-muted-foreground mt-1">{p.desc}</p>
            <div className="mt-6 mb-6">
              <span className="text-sm text-muted-foreground">R$</span>
              <span className="text-4xl font-extrabold ml-1">{p.price}</span>
              {p.suffix && <span className="text-2xl font-bold">{p.suffix}</span>}
            </div>
            <ul className="space-y-3 flex-1">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{f}</span>
                </li>
              ))}
            </ul>
            <Button
              className="w-full mt-8"
              variant={p.popular ? "default" : "outline"}
              asChild
            >
              <a
                href="https://wa.me/5584988766134?text=Ol%C3%A1%2C%20tenho%20interesse%20no%20plano%20" 
                target="_blank"
                rel="noopener noreferrer"
              >
                Começar agora
              </a>
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Plans;
