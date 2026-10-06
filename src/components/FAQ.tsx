import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Quanto tempo leva pra ficar pronto?",
    a: "Landing page simples costuma sair em até 7 dias. Site completo com painel, até 15 dias. Sistema sob medida depende do escopo — o prazo é definido na proposta, conforme as funcionalidades e as etapas aprovadas.",
  },
  {
    q: "Como funciona o pagamento?",
    a: "Metade pra começar e metade na entrega. Aceitamos Pix, cartão e boleto. Nada de mensalidade escondida: o que combinamos no orçamento é o valor final.",
  },
  {
    q: "Depois de pronto, eu consigo editar sozinho?",
    a: "Sim. Projetos com painel administrativo vêm com login pra você trocar textos, preços, fotos e produtos com autonomia. Na entrega, apresentamos o painel e orientamos o uso.",
  },
  {
    q: "E se eu não gostar do resultado?",
    a: "Você aprova o layout antes do desenvolvimento e as revisões são combinadas no escopo. Se algo sair diferente do combinado, ajustamos — não tem custo extra pra corrigir o que já fazia parte do projeto.",
  },
  {
    q: "Preciso pagar hospedagem e domínio à parte?",
    a: "Sim, hospedagem e domínio são cobrados pelos provedores e ficam no seu nome — você é o dono. Configuramos a publicação e orientamos a escolha dos serviços conforme o projeto.",
  },
  {
    q: "Vocês oferecem suporte depois da entrega?",
    a: "Sim. O período e o formato do suporte são combinados de acordo com o escopo do projeto — e o atendimento é feito pela WH Studio, pelos canais definidos na proposta.",
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
