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
  <section id="faq" className="py-24 md:py-32 border-t border-border">
    <div className="container">
      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4">
          <p className="eyebrow mb-5">Perguntas</p>
          <h2 className="display-huge text-4xl md:text-6xl">
            Antes de <em>você perguntar.</em>
          </h2>
          <p className="text-muted-foreground text-sm mt-6 max-w-sm leading-relaxed">
            As dúvidas que mais chegam por aqui, respondidas de forma direta —
            pra você não perder tempo.
          </p>
        </div>

        <div className="lg:col-span-8">
          <Accordion type="single" collapsible className="w-full border-t border-border">
            {faqs.map((f, i) => (
              <AccordionItem key={f.q} value={`faq-${i}`} className="border-b border-border">
                <AccordionTrigger className="py-5 font-display text-xl md:text-2xl text-left text-foreground hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
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