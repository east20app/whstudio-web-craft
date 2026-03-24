import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Plans from "@/components/Plans";
import PriceSimulator from "@/components/PriceSimulator";
import CTAFinal from "@/components/CTAFinal";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

const features = [
  { name: "Design responsivo", basic: true, pro: true, premium: true },
  { name: "Páginas ilimitadas", basic: false, pro: true, premium: true },
  { name: "Painel admin", basic: false, pro: true, premium: true },
  { name: "Sistema personalizado", basic: false, pro: false, premium: true },
  { name: "Bot Discord", basic: false, pro: false, premium: true },
  { name: "Integração pagamentos", basic: false, pro: true, premium: true },
  { name: "Hospedagem inclusa", basic: false, pro: false, premium: true },
  { name: "Suporte pós-entrega", basic: "7 dias", pro: "30 dias", premium: "90 dias" },
  { name: "Revisões", basic: "1", pro: "3", premium: "Ilimitadas" },
];

const Cell = ({ value }: { value: boolean | string }) => {
  if (typeof value === "string") return <span className="text-sm text-foreground">{value}</span>;
  return value ? <Check className="w-5 h-5 text-primary mx-auto" /> : <X className="w-5 h-5 text-muted-foreground/40 mx-auto" />;
};

const PlanosPage = () => (
  <>
    <Header />
    <main className="pt-16">
      <Plans />
      {/* Comparison table */}
      <section className="py-24 bg-secondary">
        <div className="container max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold">Comparação de Planos</h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="overflow-x-auto"
          >
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Recurso</th>
                  <th className="text-center py-4 px-4 text-sm font-medium">Básico</th>
                  <th className="text-center py-4 px-4 text-sm font-medium text-primary">Pro</th>
                  <th className="text-center py-4 px-4 text-sm font-medium">Premium</th>
                </tr>
              </thead>
              <tbody>
                {features.map((f) => (
                  <tr key={f.name} className="border-b border-border">
                    <td className="py-4 px-4 text-sm">{f.name}</td>
                    <td className="py-4 px-4 text-center"><Cell value={f.basic} /></td>
                    <td className="py-4 px-4 text-center bg-primary/5"><Cell value={f.pro} /></td>
                    <td className="py-4 px-4 text-center"><Cell value={f.premium} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>
      <PriceSimulator />
      <CTAFinal />
    </main>
    <Footer />
    <WhatsAppButton />
  </>
);

export default PlanosPage;
