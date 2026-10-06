import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUpRight, Loader2 } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useOrcamentoAction } from "@/components/tickets/TicketChat";
import { supabase } from "@/integrations/supabase/client";

const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Informe seu nome (mínimo 2 caracteres)")
    .max(100, "Nome muito longo"),
  email: z
    .string()
    .trim()
    .email("Informe um e-mail válido")
    .max(255, "E-mail muito longo"),
  phone: z
    .string()
    .trim()
    .regex(/^[\d\s()+-]{8,20}$/, "Informe um telefone/WhatsApp válido")
    .optional()
    .or(z.literal("")),
  project: z.string().trim().max(100, "Tipo de projeto muito longo").optional(),
  message: z
    .string()
    .trim()
    .min(10, "A mensagem deve ter pelo menos 10 caracteres")
    .max(1000, "Mensagem muito longa"),
});

type FormData = z.infer<typeof contactSchema>;
type FormErrors = Partial<Record<keyof FormData, string>>;

const initialState: FormData = { name: "", email: "", phone: "", project: "", message: "" };

const Contact = () => {
  const [data, setData] = useState<FormData>(initialState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [sending, setSending] = useState(false);
  const { requestQuote } = useOrcamentoAction();
  const settings = useSiteSettings();

  const update = (field: keyof FormData, value: string) => {
    setData((d) => ({ ...d, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;
    const result = contactSchema.safeParse(data);

    if (!result.success) {
      const fieldErrors: FormErrors = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path[0] as keyof FormData;
        fieldErrors[key] = issue.message;
      });
      setErrors(fieldErrors);
      document.getElementById(result.error.issues[0].path[0] as string)?.focus();
      toast.error("Verifique os campos do formulário.");
      return;
    }

    const contactLine = result.data.phone?.trim()
      ? `\n\nWhatsApp/Telefone: ${result.data.phone.trim()}`
      : "";
    const fullMessage =
      (result.data.project ? `[${result.data.project}] ${result.data.message}` : result.data.message) +
      contactLine;

    setSending(true);
    try {
      const { error } = await supabase.from("messages").insert({
        name: result.data.name,
        email: result.data.email,
        message: fullMessage,
      });
      if (error) throw error;
      requestQuote({
        subject: result.data.project?.trim() ? result.data.project : "Assunto geral",
        prefill: fullMessage,
      });
      toast.success("Mensagem registrada! Continue a conversa na central de atendimento.");
      setData(initialState);
    } catch {
      toast.error("Não foi possível enviar agora. Tente novamente ou entre em contato pelo WhatsApp.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contato" className="border-t border-border py-24 md:py-32">
      <div className="container">
        <div className="grid lg:grid-cols-12 gap-x-12 gap-y-12">
          <div className="lg:col-span-5">
            <p className="eyebrow mb-5">Contato</p>
            <h2 className="display-huge text-4xl md:text-5xl leading-[1.08]">
              Conte o que sua empresa <em>precisa desenvolver.</em>
            </h2>
            <p className="mt-6 text-muted-foreground leading-relaxed max-w-md">
              Preencha o formulário ou converse pelo WhatsApp. Vamos entender sua necessidade e preparar os próximos passos.
            </p>

            <dl className="mt-10 border-t border-border">
              <div className="flex items-baseline justify-between gap-4 border-b border-border py-4">
                <dt className="num-label shrink-0">WhatsApp</dt>
                <dd className="text-right">
                  <a
                    href={settings.buildWhatsappLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-sm text-foreground hover:text-primary transition-colors"
                  >
                    {settings.whatsappFull} <ArrowUpRight className="inline w-3.5 h-3.5" />
                  </a>
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 border-b border-border py-4">
                <dt className="num-label shrink-0">E-mail</dt>
                <dd className="text-right">
                  <a
                    href={`mailto:${settings.email}`}
                    className="font-mono text-sm text-foreground hover:text-primary transition-colors"
                  >
                    {settings.email}
                  </a>
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 py-4">
                <dt className="num-label shrink-0">Resposta</dt>
                <dd className="font-mono text-sm">Em até 24 h úteis</dd>
              </div>
            </dl>
          </div>

          <form
            className="lg:col-span-7 lg:col-start-7 space-y-6"
            onSubmit={onSubmit}
            noValidate
          >
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="field-label">
                  Nome
                </label>
                <Input
                  id="name"
                  name="name"
                  autoComplete="name"
                  placeholder="Seu nome completo"
                  value={data.name}
                  onChange={(e) => update("name", e.target.value)}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "name-error" : undefined}
                  maxLength={100}
                />
                {errors.name && <p id="name-error" className="text-xs text-destructive">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="field-label">
                  E-mail
                </label>
                <Input
                  id="email"
                  name="email"
                  autoComplete="email"
                  spellCheck={false}
                  type="email"
                  placeholder="seu@email.com"
                  value={data.email}
                  onChange={(e) => update("email", e.target.value)}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  maxLength={255}
                />
                {errors.email && <p id="email-error" className="text-xs text-destructive">{errors.email}</p>}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="phone" className="field-label">
                  WhatsApp / Telefone — opcional
                </label>
                <Input
                  id="phone"
                  name="phone"
                  autoComplete="tel"
                  type="tel"
                  inputMode="tel"
                  placeholder="(84) 98876-6134"
                  value={data.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? "phone-error" : undefined}
                  maxLength={20}
                />
                {errors.phone && <p id="phone-error" className="text-xs text-destructive">{errors.phone}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="project" className="field-label">
                  Tipo de projeto — opcional
                </label>
                <Input
                  id="project"
                  name="project"
                  placeholder="Ex.: site, bot Discord, sistema..."
                  value={data.project}
                  onChange={(e) => update("project", e.target.value)}
                  maxLength={100}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="field-label">
                Mensagem
              </label>
              <Textarea
                id="message"
                name="message"
                placeholder="Conte um pouco sobre o que você precisa..."
                className="min-h-[130px]"
                value={data.message}
                onChange={(e) => update("message", e.target.value)}
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? "message-error" : undefined}
                maxLength={1000}
              />
              {errors.message && (
                <p id="message-error" className="text-xs text-destructive">{errors.message}</p>
              )}
            </div>

            <Button type="submit" className="h-12 px-7" disabled={sending} aria-busy={sending}>
              {sending ? "Enviando…" : "Enviar e abrir atendimento"}
              {sending ? <Loader2 className="ml-1.5 h-4 w-4 animate-spin" aria-hidden="true" /> : <ArrowUpRight className="ml-1.5 h-4 w-4" aria-hidden="true" />}
            </Button>
            <p className="text-xs text-muted-foreground">
              Ao enviar, você abre uma conversa na central de atendimento — pode
              continuar de onde paramos.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
