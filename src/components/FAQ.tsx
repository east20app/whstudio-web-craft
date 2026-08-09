import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Quanto tempo leva pra ficar pronto?",
    a: "Landing page simples costuma sair em até 7 dias. Site completo com painel, até 15 dias. Sistema sob medida depende do escopo — eu te dou o prazo por escrito antes de começar, e ele não muda no meio do caminho.",
  },
  {
    q: "Como funciona o pagamento?",
    a: "Metade pra começar e metade na entrega. Aceito Pix, cartão e boleto. Nada de mensalidade escondida: o que combinamos no orçamento é o valor final.",
  },
  {
    q: "Depois de pronto, eu consigo editar sozinho?",
    a: "Sim. Projetos com painel administrativo vêm com login pra você trocar textos, preços, fotos e produtos sem depender de mim. Na entrega eu te mostro tudo funcionando, na prática.",
  },
  {
    q: "E se eu não gostar do resultado?",
    a: "Você aprova o layout antes de eu programar, e cada plano já vem com revisões inclusas. Se algo saiu diferente do combinado, eu ajusto — não tem custo extra pra corrigir o que era escopo.",
  },
  {
    q: "Preciso pagar hospedagem e domínio à parte?",
    a: "Sim, hospedagem e domínio são cobrados pelos provedores e ficam no seu nome — você é o dono. Eu configuro tudo e te oriento no plano mais barato que aguenta o seu projeto.",
  },
  {
    q: "Você dá suporte depois da entrega?",
    a: "Dou. São 15, 30 ou 90 dias de suporte incluídos, dependendo do plano — e o contato é direto comigo, sem abrir chamado em fila de call center.",
  },
];

const FAQ = () => (
  <section id="faq" className="py-28 md:py-32 border-t border-border">
    <div className="container">
      <div className="grid md:grid-cols-12 gap-8">
        <div className="md:col-span-4">
          <p className="eyebrow">[ 06 ] Perguntas</p>
          <h2 className="display-huge text-4xl md:text-5xl mt-5">
            Antes de <br />
            <span className="text-foreground/50">você perguntar.</span>
          </h2>
          <p className="text-foreground/60 text-sm mt-5 max-w-sm">
            As dúvidas que mais chegam na central de atendimento — respondidas aqui pra você não
            perder tempo.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="md:col-span-8"
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((f, i) => (
              <AccordionItem key={f.q} value={`faq-${i}`} className="border-border">
                <AccordionTrigger className="text-left text-base md:text-lg font-semibold hover:no-underline">
                  <span className="flex gap-4">
                    <span className="font-mono text-[11px] text-foreground/35 pt-1.5 tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {f.q}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-sm text-foreground/70 leading-relaxed pl-9">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </div>
  </section>
);

export const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default FAQ;
