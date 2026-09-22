import { motion } from "framer-motion";
import { ArrowUpRight, Utensils, Store, ClipboardList, Users } from "lucide-react";
import { useOrcamentoAction } from "@/components/tickets/TicketChat";

const scenarios = [
  {
    icon: Utensils,
    tag: "Restaurante e delivery",
    problem: "Paga comissão pra cada pedido e o cliente nunca vira seu. iFood anuncia, mas quem fica com a base é a plataforma.",
    solution: "Cardápio digital próprio, pedido direto no WhatsApp e o cliente cadastrado no SEU domínio.",
  },
  {
    icon: Store,
    tag: "Comércio e serviços",
    problem: "Seu nome nem aparece quando alguém procura. Sem site, o cliente decide pela concorrência que tem.",
    solution: "Site que carrega rápido, mostra o serviço e leva pro WhatsApp — de graça no seu domínio.",
  },
  {
    icon: ClipboardList,
    tag: "Gestão interna",
    problem: "Tudo na planilha, nada se encontra, e cada ajuste vira reunião de 40 minutos.",
    solution: "Sistema com login, permissões e painel que centraliza cadastro, pedido e relatório num lugar só.",
  },
  {
    icon: Users,
    tag: "Comunidade e afiliados",
    problem: "Pessoal cresce, backup manual não acompanha, e a moderação depende de alguém acordado.",
    solution: "Bot com painel: ticket, economia, ranking e moderação automática rodando sozinhos.",
  },
];

/**
 * "Soluções para empresas" — cenários reais de negócio com problema → solução.
 */
const SolucoesEmpresas = () => {
  const { requestQuote } = useOrcamentoAction();

  return (
    <section id="solucoes" className="border-t border-border py-24 md:py-32">
      <div className="container">
        <div className="grid lg:grid-cols-12 gap-8 items-end mb-16">
          <div className="lg:col-span-8">
            <p className="eyebrow mb-5">Soluções para empresas</p>
            <h2 className="display-huge text-5xl md:text-7xl max-w-3xl">
              Pra quem depende <em>dele existir.</em>
            </h2>
          </div>
          <p className="lg:col-span-4 text-sm md:text-base text-muted-foreground leading-relaxed max-w-md">
            Cada negócio tem um padrão. Reconhecemos o seu e desenhamos a
            solução em cima do problema real — não de uma lista de features.
          </p>
        </div>

        <div className="border-t border-border">
          {scenarios.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.article
                key={s.tag}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-8%" }}
                transition={{ duration: 0.45, delay: i * 0.04 }}
                className="grid lg:grid-cols-12 gap-x-8 gap-y-6 border-b border-border py-10 md:py-14 group"
              >
                <div className="lg:col-span-3 flex items-start gap-4">
                  <div className="w-12 h-12 border border-border bg-card flex items-center justify-center shrink-0 group-hover:border-primary transition-colors">
                    <Icon className="w-5 h-5 text-primary" strokeWidth={1.5} aria-hidden="true" />
                  </div>
                  <div>
                    <p className="num-label">{String(i + 1).padStart(2, "0")}</p>
                    <h3 className="font-display text-2xl md:text-3xl leading-tight mt-1">{s.tag}</h3>
                  </div>
                </div>

                <div className="lg:col-span-4">
                  <p className="num-label mb-2">O problema</p>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{s.problem}</p>
                </div>

                <div className="lg:col-span-4">
                  <p className="num-label mb-2">A solução</p>
                  <p className="text-sm md:text-base leading-relaxed">{s.solution}</p>
                </div>

                <div className="lg:col-span-1 lg:flex lg:justify-end">
                  <button
                    type="button"
                    onClick={() =>
                      requestQuote({
                        subject: `Solução: ${s.tag}`,
                        prefill: `Sou do segmento ${s.tag.toLowerCase()} e quero resolver isso: ${s.solution} `,
                      })
                    }
                    className="inline-flex items-center justify-center w-11 h-11 border border-border hover:border-primary transition-colors cursor-pointer bg-transparent"
                    aria-label={`Solicitar orçamento para ${s.tag}`}
                  >
                    <ArrowUpRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SolucoesEmpresas;