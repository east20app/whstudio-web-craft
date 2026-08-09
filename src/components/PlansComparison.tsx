import { motion } from "framer-motion";
import { Check, Minus } from "lucide-react";
import { plans } from "@/config/site";

/** Linhas comparativas dos 3 planos (client-side, sem banco). */
const rows: { label: string; values: [string | boolean, string | boolean, string | boolean] }[] = [
  { label: "Páginas", values: ["Até 3", "Ilimitadas", "Sob medida"] },
  { label: "Design responsivo", values: [true, true, true] },
  { label: "WhatsApp integrado", values: [true, true, true] },
  { label: "Painel administrativo", values: [false, "Simples", "Completo"] },
  { label: "Login e permissões", values: [false, false, true] },
  { label: "Integração com pagamentos", values: [false, true, true] },
  { label: "API própria", values: [false, false, true] },
  { label: "Banco de dados dedicado", values: [false, false, true] },
  { label: "Integração com bot Discord", values: [false, false, true] },
  { label: "SEO", values: ["Básico", "Avançado + Analytics", "Avançado + Analytics"] },
  { label: "Revisões inclusas", values: ["1", "3", "Até aprovar"] },
  { label: "Prazo", values: [plans[0].deliveryTime, plans[1].deliveryTime, plans[2].deliveryTime] },
  {
    label: "Suporte após entrega",
    values: [
      "15 dias — correções de bug e dúvidas de uso",
      "30 dias — correções, dúvidas e ajustes pequenos de conteúdo",
      "90 dias prioritário — correções, ajustes e acompanhamento das integrações",
    ],
  },
];

const Cell = ({ value }: { value: string | boolean }) => {
  if (value === true) return <Check className="w-4 h-4 text-primary mx-auto" aria-label="Incluído" />;
  if (value === false)
    return <Minus className="w-4 h-4 text-muted-foreground/40 mx-auto" aria-label="Não incluído" />;
  return <span className="text-xs text-foreground/75 leading-snug">{value}</span>;
};

const PlansComparison = () => (
  <section className="py-24 border-t border-border">
    <div className="container">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
        <div>
          <p className="eyebrow mb-4">Comparativo</p>
          <h2 className="display-huge text-5xl md:text-6xl max-w-xl">
            Lado a lado, <em>sem letra miúda.</em>
          </h2>
        </div>
        <p className="text-muted-foreground max-w-sm text-sm md:pb-2">
          O que muda de verdade entre um plano e outro — inclusive o que significa cada tempo de
          suporte na prática.
        </p>
      </div>

      {/* Desktop: tabela lado a lado */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="hidden md:block"
      >
        <table className="w-full text-sm">
          <caption className="sr-only">Comparativo entre os planos da WH Studio</caption>
          <thead>
            <tr className="border-b border-border">
              <th scope="col" className="text-left px-0 py-4 eyebrow font-normal">
                Recurso
              </th>
              {plans.map((p) => (
                <th
                  key={p.id}
                  scope="col"
                  className="px-5 py-4 text-center font-display text-2xl font-normal"
                >
                  {p.name}
                  {p.popular && <span className="block eyebrow text-primary mt-1 font-normal">Mais escolhido</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((r) => (
              <tr key={r.label} className="hover:bg-foreground/[0.02]">
                <th scope="row" className="text-left px-0 py-3.5 font-medium text-foreground/80">
                  {r.label}
                </th>
                {r.values.map((v, i) => (
                  <td key={i} className="px-5 py-3.5 text-center align-middle">
                    <Cell value={v} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* Mobile: um bloco por plano */}
      <div className="md:hidden space-y-8">
        {plans.map((p, planIndex) => (
          <div key={p.id} className="border-t border-border pt-5">
            <h3 className="font-display text-2xl">
              {p.name}
              {p.popular && <span className="ml-3 eyebrow text-primary">Mais escolhido</span>}
            </h3>
            <ul className="divide-y divide-border mt-3">
              {rows.map((r) => (
                <li key={r.label} className="flex items-start justify-between gap-4 py-2.5">
                  <span className="text-xs text-muted-foreground">{r.label}</span>
                  <span className="text-right max-w-[60%]">
                    <Cell value={r.values[planIndex]} />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default PlansComparison;
