import { Check, FileCheck2, MessagesSquare, Shapes, Workflow } from "lucide-react";

const differentiators = [
  {
    icon: FileCheck2,
    title: "Escopo alinhado",
    description: "Entregas, prioridades e próximos passos definidos antes do desenvolvimento.",
  },
  {
    icon: Shapes,
    title: "Feito para sua marca",
    description: "Estrutura visual e conteúdo pensados para a identidade do seu negócio.",
  },
  {
    icon: MessagesSquare,
    title: "Conversa direta",
    description: "Você acompanha o projeto e fala com quem está construindo a solução.",
  },
  {
    icon: Workflow,
    title: "Validação por etapas",
    description: "Revisamos o que foi combinado ao longo do processo, sem surpresas na entrega.",
  },
];

const ProvaConfianca = () => (
  <section id="diferenciais" className="scroll-mt-28 border-y border-border bg-card py-16 md:py-20">
    <div className="container">
      <div className="mb-9 flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="eyebrow mb-3">Por que WH Studio</p>
          <h2 className="font-display text-3xl tracking-tight md:text-4xl">Um processo claro, do começo ao fim.</h2>
        </div>
        <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">Seu projeto é construído com decisões alinhadas, participação próxima e atenção ao que a empresa realmente precisa.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {differentiators.map(({ icon: Icon, title, description }) => (
          <article key={title} className="group rounded-2xl border border-border bg-background/60 p-5 transition-colors hover:border-primary/35 hover:bg-primary/[.025] md:p-6">
            <span className="mb-6 grid h-10 w-10 place-items-center rounded-xl border border-primary/20 bg-primary/10 text-primary"><Icon className="h-5 w-5" aria-hidden="true" /></span>
            <h3 className="font-display text-lg">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
            <Check className="mt-5 h-4 w-4 text-primary/70" aria-hidden="true" />
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default ProvaConfianca;
