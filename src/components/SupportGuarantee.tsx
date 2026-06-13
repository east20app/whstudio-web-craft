import { FileText, LifeBuoy, ShieldCheck } from "lucide-react";

const items = [
  {
    icon: FileText,
    title: "Documentação clara",
    desc: "Você recebe o básico bem escrito: como acessar, onde mexer, o que não apagar e como pedir ajuste sem depender de adivinhação.",
  },
  {
    icon: LifeBuoy,
    title: "30 dias de suporte técnico",
    desc: "Se algo quebrar no uso normal ou surgir dúvida de operação, eu olho. Não é entrega fantasma.",
  },
  {
    icon: ShieldCheck,
    title: "Código limpo para manutenção",
    desc: "Nada de gambiarra escondida em plugin obscuro. O projeto fica organizado para continuar evoluindo depois.",
  },
];

const SupportGuarantee = () => (
  <section className="py-20 bg-secondary border-y border-border">
    <div className="container">
      <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-10 items-start">
        <div>
          <span className="eyebrow text-primary mb-3">Garantia e suporte</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold">
            O projeto não acaba no botão “publicar”.
          </h2>
          <p className="text-muted-foreground mt-4 max-w-lg">
            Código entregue com documentação clara e suporte técnico incluso para você não ficar na mão depois que o site entra no ar.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item.title} className="card-dark p-5">
              <item.icon className="w-5 h-5 text-primary mb-4" aria-hidden="true" />
              <h3 className="font-display font-semibold text-sm mb-2">{item.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default SupportGuarantee;
