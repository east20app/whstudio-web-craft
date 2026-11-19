import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { services } from "@/config/site";

const stages = ["Tipo de projeto", "Funcionalidades", "Requisitos", "Prazo", "Investimento", "Contato", "Revisão"];
const deadlines = ["Até 1 mês", "Entre 1 e 3 meses", "Mais de 3 meses", "A definir"];
const investments = ["Até R$ 3 mil", "Entre R$ 3 mil e R$ 10 mil", "Entre R$ 10 mil e R$ 30 mil", "Acima de R$ 30 mil", "A definir"];

export default function QuoteWizard() {
  const [params] = useSearchParams();
  const [form, setForm] = useState({
    project_type: services.find((service) => service.id === params.get("servico"))?.title ?? "",
    features: "", requirements: "", deadline: "", investment: "", client_name: "", contact_email: "",
  });
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [receipt, setReceipt] = useState("");
  const [pending, setPending] = useState(false);
  const request = useRef<string>();
  const sending = useRef(false);
  const title = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (step > 0 || receipt) title.current?.focus();
  }, [step, receipt]);

  function update(key: keyof typeof form, value: string) {
    request.current = undefined;
    setForm((previous) => ({ ...previous, [key]: value }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (step < stages.length - 1) {
      setStep(step + 1);
      return;
    }
    if (sending.current) return;
    sending.current = true;
    setPending(true);
    try {
      request.current ??= crypto.randomUUID();
      const { data, error: failure } = await supabase.rpc("submit_budget_request", { request_id: request.current, ...form });
      if (failure || !data) {
        setError(failure?.message === "request limit reached"
          ? "Este e-mail atingiu o limite de envios. Tente novamente em uma hora."
          : "Não foi possível enviar. Seus dados continuam no formulário. Tente novamente.");
        return;
      }
      setReceipt(data);
    } catch {
      setError("A conexão falhou. Tente novamente para confirmar o envio.");
    } finally {
      sending.current = false;
      setPending(false);
    }
  }

  const select = (key: "project_type" | "deadline" | "investment", label: string, options: string[]) => (
    <label className="grid gap-2">{label}
      <select className="wh-quote-field" value={form[key]} onChange={(event) => update(key, event.target.value)} required>
        <option value="">Selecione uma opção</option>
        {options.map((option) => <option value={option} key={option}>{option}</option>)}
      </select>
    </label>
  );

  if (receipt) return (
    <section className="wh-wrap max-w-2xl py-16" aria-labelledby="quote-title">
      <h2 id="quote-title" ref={title} tabIndex={-1} className="text-4xl font-display">Solicitação recebida</h2>
      <p className="mt-4">Guarde o protocolo para acompanhar seu pedido com a equipe.</p>
      <p className="mt-3 break-all font-mono text-primary">{receipt}</p>
    </section>
  );

  return (
    <section className="wh-wrap max-w-2xl py-16" aria-labelledby="quote-title">
      <p className="wh-kicker"><span /> Etapa {step + 1} de {stages.length}</p>
      <progress className="mt-3 h-1 w-full accent-[#0085ff]" value={step + 1} max={stages.length} aria-label="Progresso do orçamento" />
      <h2 id="quote-title" ref={title} tabIndex={-1} className="my-6 text-4xl font-display">{stages[step]}</h2>
      <form onSubmit={submit} className="grid gap-5">
        {step === 0 && select("project_type", "Qual solução você precisa?", [...services.map(({ title }) => title), "Outro projeto"])}
        {step === 1 && <label className="grid gap-2">O que o projeto precisa fazer?<textarea className="wh-quote-field min-h-32" required minLength={2} maxLength={1200} value={form.features} onChange={(event) => update("features", event.target.value)} /></label>}
        {step === 2 && <label className="grid gap-2">Conte o contexto e os requisitos específicos<textarea className="wh-quote-field min-h-36" required minLength={10} maxLength={2400} value={form.requirements} onChange={(event) => update("requirements", event.target.value)} /></label>}
        {step === 3 && select("deadline", "Quando precisa da primeira entrega?", deadlines)}
        {step === 4 && select("investment", "Qual faixa está prevista?", investments)}
        {step === 5 && (
          <>
            <label className="grid gap-2">Nome<input className="wh-quote-field" required minLength={2} maxLength={120} autoComplete="name" value={form.client_name} onChange={(event) => update("client_name", event.target.value)} /></label>
            <label className="grid gap-2">E-mail<input className="wh-quote-field" required type="email" maxLength={254} autoComplete="email" value={form.contact_email} onChange={(event) => update("contact_email", event.target.value)} /></label>
          </>
        )}
        {step === 6 && (
          <dl className="divide-y divide-border border-y border-border">
            {[form.project_type, form.features, form.requirements, form.deadline, form.investment, `${form.client_name} · ${form.contact_email}`].map((value, index) => (
              <div className="grid grid-cols-[1fr_auto] gap-2 py-3" key={stages[index]}>
                <dt className="font-medium">{stages[index]}</dt>
                <dd className="col-start-1 row-start-2 whitespace-pre-wrap break-words text-muted-foreground">{value}</dd>
                <dd className="col-start-2 row-start-1"><button type="button" disabled={pending} className="text-primary" aria-label={`Editar ${stages[index]}`} onClick={() => setStep(index)}>Editar</button></dd>
              </div>
            ))}
          </dl>
        )}
        {error && <p role="alert" className="text-destructive">{error}</p>}
        <div className="flex flex-wrap items-center justify-between gap-4">
          {step > 0 && <button className="wh-text-link" type="button" disabled={pending} onClick={() => { setError(""); setStep(step - 1); }}><ArrowLeft size={17} /> Voltar</button>}
          <button className="wh-button ml-auto" type="submit" disabled={pending}>{pending ? "Enviando…" : step === 6 ? "Enviar solicitação" : "Continuar"}{step === 6 ? <ArrowUpRight size={17} /> : <ArrowRight size={17} />}</button>
        </div>
      </form>
    </section>
  );
}
