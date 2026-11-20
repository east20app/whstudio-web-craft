import { useRef, useState, type FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { services as catalog } from "@/config/site";
import { usePublicServices } from "@/hooks/usePublicServices";

const stages = ["Serviços", "Escopo", "Contato"];
const budgetRanges = ["A definir", "Até R$ 3.000", "R$ 3.000 a R$ 10.000", "R$ 10.000 a R$ 25.000", "Acima de R$ 25.000"];
const deadlines = ["A definir", "Até 30 dias", "Entre 30 e 60 dias", "Mais de 60 dias"];

function encodeFile(file: File): Promise<{ filename: string; payload: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => resolve({ filename: file.name, payload: String(reader.result).split(",")[1] });
    reader.readAsDataURL(file);
  });
}

export default function BudgetRequest() {
  const [params] = useSearchParams();
  const live = usePublicServices();
  const preselected = params.get("servico")?.trim().slice(0, 120);
  const [selected, setSelected] = useState<string[]>(() => preselected ? [preselected] : []);
  const options = [...new Set([...(live ?? catalog).map(({ title }) => title), ...selected])];
  const [step, setStep] = useState(0);
  const [requirements, setRequirements] = useState("");
  const [budget, setBudget] = useState(budgetRanges[0]);
  const [deadline, setDeadline] = useState(deadlines[0]);
  const [files, setFiles] = useState<File[]>([]);
  const [client, setClient] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [complete, setComplete] = useState(false);
  const requestId = useRef<string>();
  const submitting = useRef(false);
  const title = useRef<HTMLHeadingElement>(null);

  function changeStep(next: number) {
    setError("");
    setStep(next);
    requestAnimationFrame(() => title.current?.focus());
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    setError("");
    if (step === 0 && !selected.length) {
      setError("Selecione pelo menos um serviço.");
      return;
    }
    if (step === 1 && requirements.trim().length < 20) {
      setError("Descreva o projeto em pelo menos 20 caracteres.");
      return;
    }
    if (step < 2) {
      changeStep(step + 1);
      return;
    }
    if (client.trim().length < 2) {
      setError("Informe seu nome ou o nome da empresa.");
      return;
    }
    submitting.current = true;
    setPending(true);
    try {
      requestId.current ??= crypto.randomUUID();
      const result = await supabase.rpc("submit_budget_request", {
        request_id: requestId.current,
        client_name: client.trim(),
        contact_email: email.trim(),
        selected_services: selected,
        requirements: requirements.trim(),
        budget_range: budget,
        deadline,
        attachments: await Promise.all(files.map(encodeFile)),
      });
      if (result.error) throw result.error;
      setComplete(true);
      requestAnimationFrame(() => title.current?.focus());
    } catch {
      setError("Não foi possível enviar sua solicitação. Confira os dados e tente novamente.");
    } finally {
      submitting.current = false;
      setPending(false);
    }
  }

  return (
    <section className="wh-section">
      <div className="container max-w-4xl">
        <h2 ref={title} tabIndex={-1} className="mb-6 text-3xl font-bold md:text-5xl">
          {complete ? "Solicitação recebida" : stages[step]}
        </h2>
        {complete ? <p role="status">A WH Studio responderá pelo e-mail informado.</p> : (
          <form onSubmit={submit} className="space-y-6">
            <p className="eyebrow">Etapa {step + 1} de {stages.length}</p>
            {step === 0 && (
              <fieldset className="grid gap-2 sm:grid-cols-2">
                <legend className="mb-3">O que você quer construir?</legend>
                {options.map(service => (
                  <label key={service} className="flex min-h-12 items-center gap-3 border border-border bg-card p-3">
                    <input type="checkbox" className="accent-primary" checked={selected.includes(service)}
                      disabled={selected.length >= 9 && !selected.includes(service)}
                      onChange={event => setSelected(previous => event.target.checked ? [...previous, service] : previous.filter(value => value !== service))} />
                    {service}
                  </label>
                ))}
              </fieldset>
            )}
            {step === 1 && (
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="grid gap-2 sm:col-span-2">Requisitos do projeto
                  <Textarea rows={6} required minLength={20} maxLength={4000} value={requirements} onChange={event => setRequirements(event.target.value)} />
                </label>
                <label className="grid gap-2">Investimento disponível
                  <select className="border border-input bg-card p-3" value={budget} onChange={event => setBudget(event.target.value)}>{budgetRanges.map(range => <option key={range}>{range}</option>)}</select>
                </label>
                <label className="grid gap-2">Prazo desejado
                  <select className="border border-input bg-card p-3" value={deadline} onChange={event => setDeadline(event.target.value)}>{deadlines.map(range => <option key={range}>{range}</option>)}</select>
                </label>
                <label className="grid gap-2 sm:col-span-2">Anexos opcionais (até 3 PDFs, PNGs ou JPGs, 2 MB no total)
                  <input type="file" multiple accept=".pdf,.png,.jpg,.jpeg" className="max-w-full border border-input p-3"
                    onChange={event => {
                      const next = Array.from(event.target.files ?? []);
                      if (next.length > 3 || next.some(file => !/\.(pdf|png|jpe?g)$/i.test(file.name) || file.name.length > 180 || file.size === 0) ||
                          next.reduce((size, file) => size + file.size, 0) > 2 * 1024 * 1024) {
                        event.target.value = "";
                        setError("Escolha até três arquivos válidos com até 2 MB no total.");
                        return;
                      }
                      setError("");
                      setFiles(next);
                    }} />
                </label>
                {files.length > 0 && (
                  <ul className="sm:col-span-2">
                    {files.map((file, index) => <li key={`${file.name}-${index}`}>{file.name}
                      <button type="button" className="ml-3 underline" onClick={() => setFiles(previous => previous.filter((_, position) => position !== index))}>Remover<span className="sr-only"> {file.name}</span></button>
                    </li>)}
                  </ul>
                )}
              </div>
            )}
            {step === 2 && (
              <div className="grid gap-5">
                <label className="grid gap-2">Seu nome ou empresa
                  <Input required minLength={2} maxLength={120} autoComplete="name" value={client} onChange={event => setClient(event.target.value)} />
                </label>
                <label className="grid gap-2">E-mail de contato
                  <Input type="email" required maxLength={254} autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} />
                </label>
              </div>
            )}
            {error && <p role="alert" className="text-red-400">{error}</p>}
            <div className="wh-actions">
              {step > 0 && <button type="button" className="wh-button" disabled={pending} onClick={() => changeStep(step - 1)}>Voltar</button>}
              <button className="wh-button wh-button--primary disabled:opacity-50" disabled={pending}>
                {pending ? "Enviando…" : step === 2 ? "Enviar solicitação" : "Continuar"}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
