import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, MessageCircle, Send } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { siteConfig, whatsappLink } from "@/config/site";
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
  project: z.string().trim().max(100, "Tipo de projeto muito longo").optional(),
  message: z
    .string()
    .trim()
    .min(10, "A mensagem deve ter pelo menos 10 caracteres")
    .max(1000, "Mensagem muito longa"),
});

type FormData = z.infer<typeof contactSchema>;
type FormErrors = Partial<Record<keyof FormData, string>>;

const initialState: FormData = { name: "", email: "", project: "", message: "" };

const Contact = () => {
  const [data, setData] = useState<FormData>(initialState);
  const [errors, setErrors] = useState<FormErrors>({});
  const { requestQuote } = useOrcamentoAction();

  const update = (field: keyof FormData, value: string) => {
    setData((d) => ({ ...d, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = contactSchema.safeParse(data);

    if (!result.success) {
      const fieldErrors: FormErrors = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path[0] as keyof FormData;
        fieldErrors[key] = issue.message;
      });
      setErrors(fieldErrors);
      toast.error("Verifique os campos do formulário.");
      return;
    }

    const fullMessage = result.data.project
      ? `[${result.data.project}] ${result.data.message}`
      : result.data.message;

    const { error } = await supabase.from("messages").insert({
      name: result.data.name,
      email: result.data.email,
      message: fullMessage,
    });

    if (error) {
      toast.error("Não foi possível enviar agora. Tente novamente.");
      return;
    }

    requestQuote({
      subject: result.data.project?.trim() ? result.data.project : "Assunto geral",
      prefill: fullMessage,
    });
    toast.success("Mensagem registrada! Continue a conversa na central de atendimento.");
    setData(initialState);
  };

  return (
    <section id="contato" className="py-24 bg-secondary">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-primary uppercase tracking-widest">Fale comigo</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2">Bora trocar uma ideia sobre o seu projeto</h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            Preencha o formulário ou chama no WhatsApp. Eu respondo em até 24 horas úteis — e geralmente é bem antes.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
          <motion.form
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-5 card-dark p-7"
            onSubmit={onSubmit}
            noValidate
          >
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                placeholder="Seu nome completo"
                value={data.name}
                onChange={(e) => update("name", e.target.value)}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "name-error" : undefined}
                maxLength={100}
              />
              {errors.name && (
                <p id="name-error" className="text-xs text-destructive">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={data.email}
                onChange={(e) => update("email", e.target.value)}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                maxLength={255}
              />
              {errors.email && (
                <p id="email-error" className="text-xs text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="project">Tipo de projeto (opcional)</Label>
              <Input
                id="project"
                placeholder="Ex.: site, bot Discord, sistema..."
                value={data.project}
                onChange={(e) => update("project", e.target.value)}
                maxLength={100}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Mensagem</Label>
              <Textarea
                id="message"
                placeholder="Conte um pouco sobre o que você precisa..."
                className="min-h-[120px]"
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

            <Button type="submit" size="lg" className="w-full">
              <Send className="w-4 h-4 mr-2" aria-hidden="true" /> Enviar e abrir atendimento
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Resposta em até 24 horas úteis — acompanhe pela central de atendimento.
            </p>
          </motion.form>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-xl font-semibold mb-3">Prefere falar direto?</h3>
              <p className="text-muted-foreground text-sm">
                Estamos disponíveis pelo WhatsApp e por e-mail para tirar dúvidas e enviar
                orçamentos personalizados.
              </p>
            </div>

            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start gap-3 h-16" asChild>
                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Abrir conversa no WhatsApp"
                >
                  <span className="w-10 h-10 rounded-lg bg-[#25D366]/15 border border-[#25D366]/30 flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-[#25D366]" />
                  </span>
                  <div className="text-left">
                    <p className="text-sm font-semibold">WhatsApp</p>
                    <p className="text-xs text-muted-foreground">{siteConfig.whatsapp.display}</p>
                  </div>
                </a>
              </Button>

              <Button variant="outline" className="w-full justify-start gap-3 h-16" asChild>
                <a href={`mailto:${siteConfig.email}`} aria-label="Enviar e-mail">
                  <span className="w-10 h-10 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-primary" />
                  </span>
                  <div className="text-left">
                    <p className="text-sm font-semibold">E-mail</p>
                    <p className="text-xs text-muted-foreground">{siteConfig.email}</p>
                  </div>
                </a>
              </Button>
            </div>

            <div className="card-dark p-5">
              <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                Tempo de resposta
              </p>
              <p className="text-sm text-muted-foreground">
                Respondemos em até <span className="text-foreground font-semibold">24 horas úteis</span>.
                Para projetos urgentes, fale pelo WhatsApp.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
