import { motion } from "framer-motion";
import { Code2, MessageSquare, Rocket } from "lucide-react";

const steps = [
  {
    icon: MessageSquare,
    title: "Alinhamento no WhatsApp ou Meet",
    desc: "Você explica o problema do jeito que der: áudio, print, planilha, link de concorrente. Eu devolvo escopo, prazo e o que precisa ficar de fora para não virar bagunça.",
  },
  {
    icon: Code2,
    title: "Desenvolvimento com preview",
    desc: "Eu quebro em partes pequenas e mostro funcionando. Tela, formulário, painel, integração. Você vê antes de virar surpresa no final.",
  },
  {
    icon: Rocket,
    title: "Entrega sem dor de cabeça",
    desc: "Publico, configuro domínio, explico como usar e deixo o projeto pronto para manutenção. Código limpo, acesso organizado e suporte combinado.",
  },
];

const HowItWorks = () => (
  <section className="py-24 bg-background">
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-2xl mb-14"
      >
        <span className="eyebrow text-primary mb-3">Como trabalhamos</span>
        <h2 className="font-display text-3xl md:text-5xl font-bold">Sem teatro. Só processo.</h2>
        <p className="text-muted-foreground mt-4">
          Menos call inútil, mais avanço visível. O combinado fica claro antes de qualquer linha de código.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 border border-border">
        {steps.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="p-7 border-b md:border-b-0 md:border-r border-border last:border-b-0 md:last:border-r-0"
          >
            <div className="flex items-center justify-between mb-8">
              <s.icon className="w-6 h-6 text-primary" aria-hidden="true" />
              <span className="font-mono-label text-xs text-muted-foreground">
                0{i + 1}
              </span>
            </div>
            <h3 className="font-display text-xl font-bold mb-3">{s.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
