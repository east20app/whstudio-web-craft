import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Calculator, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { siteConfig, whatsappLink } from "@/config/site";

const options = [
  { id: "site", label: "Site institucional", price: 350 },
  { id: "landing", label: "Landing page de conversão", price: 450 },
  { id: "ecommerce", label: "Loja virtual / E-commerce", price: 900 },
  { id: "bot", label: "Bot para Discord", price: 400 },
  { id: "sistema", label: "Sistema personalizado", price: 1500 },
  { id: "dashboard", label: "Dashboard administrativo", price: 700 },
  { id: "delivery", label: "Sistema de delivery", price: 800 },
  { id: "automacao", label: "Automações e integrações", price: 300 },
  { id: "hospedagem", label: "Hospedagem (mensal)", price: 49 },
];

const PriceSimulator = () => {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const selectedItems = useMemo(
    () => options.filter((o) => selected.includes(o.id)),
    [selected]
  );

  const total = selectedItems.reduce((sum, o) => sum + o.price, 0);
  const empty = selectedItems.length === 0;

  const message = empty
    ? siteConfig.defaultMessages.generic
    : siteConfig.defaultMessages.simulator(
        selectedItems.map((o) => o.label),
        total
      );

  return (
    <section className="py-24 bg-secondary">
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
              <span className="text-sm font-medium text-primary">Simulador de orçamento</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">Monte seu projeto</h2>
            <p className="text-muted-foreground mt-4">
              Selecione os serviços que você precisa para receber uma estimativa inicial.
            </p>
          </div>

          <div className="card-dark p-6 md:p-8">
            <div className="space-y-3 mb-6">
              {options.map((o) => {
                const isSelected = selected.includes(o.id);
                return (
                  <label
                    key={o.id}
                    className={`flex items-center justify-between p-4 rounded-lg border transition-colors cursor-pointer ${
                      isSelected
                        ? "border-primary/60 bg-primary/5"
                        : "border-border hover:border-primary/30"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggle(o.id)}
                        aria-label={o.label}
                      />
                      <span className="text-sm font-medium">{o.label}</span>
                    </div>
                    <span className="text-sm font-semibold text-muted-foreground">
                      R$ {o.price.toLocaleString("pt-BR")}
                    </span>
                  </label>
                );
              })}
            </div>

            {selectedItems.length > 0 && (
              <div className="mb-4 p-4 rounded-lg bg-secondary/60 border border-border">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                  Serviços selecionados
                </p>
                <ul className="space-y-1">
                  {selectedItems.map((it) => (
                    <li key={it.id} className="flex justify-between text-sm">
                      <span>{it.label}</span>
                      <span className="text-muted-foreground">R$ {it.price.toLocaleString("pt-BR")}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex items-center justify-between p-5 rounded-lg bg-primary/10 border border-primary/30">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Estimativa inicial</p>
                <p className="text-3xl font-extrabold text-primary mt-1">
                  R$ {total.toLocaleString("pt-BR")}
                </p>
              </div>
              <Calculator className="w-10 h-10 text-primary/40" />
            </div>

            <div className="flex items-start gap-2 mt-4 text-xs text-muted-foreground">
              <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <p>
                Esta é uma estimativa inicial. O valor final é definido após análise do escopo,
                integrações e prazos do seu projeto.
              </p>
            </div>

            <Button
              className="w-full mt-6 glow"
              size="lg"
              disabled={empty}
              asChild={!empty}
            >
              {empty ? (
                <span>Selecione ao menos um serviço</span>
              ) : (
                <a href={whatsappLink(message)} target="_blank" rel="noopener noreferrer">
                  Solicitar orçamento via WhatsApp
                </a>
              )}
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PriceSimulator;
