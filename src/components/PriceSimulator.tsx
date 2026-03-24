import { useState } from "react";
import { motion } from "framer-motion";
import { Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

const options = [
  { id: "site", label: "Site institucional", price: 150 },
  { id: "ecommerce", label: "E-commerce / Loja virtual", price: 300 },
  { id: "bot", label: "Bot para Discord", price: 200 },
  { id: "sistema", label: "Sistema personalizado", price: 500 },
  { id: "hospedagem", label: "Hospedagem (mensal)", price: 30 },
  { id: "automacao", label: "Automações", price: 150 },
];

const PriceSimulator = () => {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const total = options
    .filter((o) => selected.includes(o.id))
    .reduce((sum, o) => sum + o.price, 0);

  return (
    <section className="py-24">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Calculator className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Simulador</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">Simule seu orçamento</h2>
            <p className="text-muted-foreground mt-4">Selecione os serviços desejados para ter uma estimativa de valor.</p>
          </div>
          <div className="card-dark-hover p-8">
            <div className="space-y-4 mb-8">
              {options.map((o) => (
                <label
                  key={o.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/30 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={selected.includes(o.id)}
                      onCheckedChange={() => toggle(o.id)}
                    />
                    <span className="text-sm font-medium">{o.label}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    R$ {o.price}
                  </span>
                </label>
              ))}
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-primary/10 border border-primary/20">
              <span className="font-semibold">Estimativa total:</span>
              <span className="text-2xl font-extrabold text-primary">
                R$ {total}
              </span>
            </div>
            <Button className="w-full mt-6 glow" size="lg" asChild>
              <a
                href={`https://wa.me/5584988766134?text=Ol%C3%A1%2C%20gostaria%20de%20um%20or%C3%A7amento.%20Servi%C3%A7os%3A%20${selected.join(", ")}%20-%20Estimativa%3A%20R$${total}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Solicitar orçamento via WhatsApp
              </a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PriceSimulator;
