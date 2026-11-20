import { useState } from "react";

const steps = [
  ["Planejamento", "Mapeamos seus objetivos, os fluxos do negócio, os requisitos e os critérios de entrega."],
  ["Design", "Desenhamos as interfaces e validamos os fluxos antes de implementar."],
  ["Desenvolvimento", "Implementamos a solução, conectamos os serviços e compartilhamos versões para revisão."],
  ["Testes", "Verificamos os fluxos, a acessibilidade e o comportamento em diferentes dispositivos."],
  ["Publicação", "Configuramos a produção e orientamos sua equipe na operação da solução."],
  ["Suporte", "Acompanhamos a operação e tratamos ajustes conforme o suporte contratado."],
];

export default function HowItWorks() {
  const [active, setActive] = useState(0);

  return (
    <section id="processo" className="wh-section">
      <div className="container">
        <p className="eyebrow mb-5">Processo</p>
        <h2 className="wh-heading">Do plano à operação.</h2>
        <ol className="wh-steps">
          {steps.map(([title], index) => (
            <li key={title}>
              <button type="button" aria-pressed={active === index} aria-controls="process-description" onClick={() => setActive(index)}>
                <span>{String(index + 1).padStart(2, "0")}</span>{title}
              </button>
            </li>
          ))}
        </ol>
        <p id="process-description" className="wh-step-copy" aria-live="polite">{steps[active][1]}</p>
      </div>
    </section>
  );
}
