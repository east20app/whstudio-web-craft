import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageSquare, Send, X, Loader2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { z } from "zod";
import { siteConfig, whatsappLink } from "@/config/site";
import {
  createTicket,
  fetchTicket,
  fetchTicketMessages,
  getStoredToken,
  postTicketMessage,
  ticketStatusLabel,
  type PublicTicket,
  type TicketMessage,
} from "@/lib/tickets";

type OpenOptions = { subject?: string; prefill?: string };

type Ctx = {
  /** Abre a central de atendimento com o assunto já preenchido. */
  requestQuote: (options?: OpenOptions) => void;
  close: () => void;
  open: boolean;
};

const TicketChatContext = createContext<Ctx | null>(null);

/** Hook único usado por Serviços, Planos e Contato para pedir orçamento. */
export const useOrcamentoAction = (): Ctx => {
  const ctx = useContext(TicketChatContext);
  if (!ctx) throw new Error("useOrcamentoAction precisa estar dentro de <TicketChatProvider>");
  return ctx;
};

const startSchema = z.object({
  name: z.string().trim().min(2, "Informe seu nome").max(120, "Nome muito longo"),
  email: z.string().trim().email("Informe um e-mail válido").max(320, "E-mail muito longo"),
  message: z.string().trim().min(10, "Conte um pouco mais (mínimo 10 caracteres)").max(2000, "Mensagem muito longa"),
});

const timeAgo = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "agora";
  if (mins < 60) return `${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
};

export const TicketChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [ticket, setTicket] = useState<PublicTicket | null>(null);
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [draft, setDraft] = useState("");
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const bottomRef = useRef<HTMLDivElement>(null);

  // Recupera conversa salva no navegador
  useEffect(() => {
    const stored = getStoredToken();
    if (stored) setToken(stored);
  }, []);

  const load = useCallback(async (t: string) => {
    setLoading(true);
    const [tk, msgs] = await Promise.all([fetchTicket(t), fetchTicketMessages(t)]);
    setTicket(tk);
    setMessages(msgs);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (token) load(token);
  }, [token, load]);

  // Atualiza a conversa enquanto o widget está aberto (respostas do admin)
  useEffect(() => {
    if (!open || !token) return;
    const id = window.setInterval(() => load(token), 10000);
    return () => window.clearInterval(id);
  }, [open, token, load]);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages, open]);

  const subjectRef = useRef<string>("Assunto geral");

  const requestQuote = useCallback((options?: OpenOptions) => {
    if (options?.prefill) setForm((f) => ({ ...f, message: f.message || options.prefill! }));
    subjectRef.current = options?.subject ?? subjectRef.current;
    setOpen(true);
  }, []);

  const start = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = startSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (fieldErrors[i.path[0] as string] = i.message));
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setSending(true);
    const newToken = await createTicket({
      name: form.name.trim(),
      email: form.email.trim(),
      message: form.message.trim(),
      subject: subjectRef.current,
    });

    setSending(false);
    if (!newToken) {
      toast.error("Não foi possível abrir o atendimento agora. Tente pelo WhatsApp.");
      return;
    }
    setToken(newToken);
    toast.success("Atendimento aberto! Respondemos em até 24 horas úteis.");
  };

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !draft.trim()) return;
    setSending(true);
    const ok = await postTicketMessage(token, draft.trim());
    setSending(false);
    if (!ok) {
      toast.error("Mensagem não enviada. Esse atendimento pode estar encerrado.");
      return;
    }
    setDraft("");
    await load(token);
  };

  const statusText = ticket ? ticketStatusLabel[ticket.status] : "";

  return (
    <TicketChatContext.Provider value={{ requestQuote, close: () => setOpen(false), open }}>
      {children}

      {/* Ações flutuantes */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        <a
          href={whatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Prefiro falar no WhatsApp"
          className="flex items-center gap-2 rounded-full border border-[#25D366]/30 bg-[#25D366]/10 px-4 py-2 text-xs font-medium text-[#25D366] backdrop-blur-sm transition-colors hover:bg-[#25D366]/20"
        >
          <MessageCircle className="w-4 h-4" aria-hidden="true" /> Prefiro WhatsApp
        </a>

        {!open && (
          <button
            onClick={() => setOpen(true)}
            aria-label="Abrir central de atendimento"
            className="flex items-center gap-2 rounded-full bg-primary px-5 h-12 text-sm font-semibold text-primary-foreground shadow-lg transition-transform hover:scale-[1.02]"
          >
            <MessageSquare className="w-4 h-4" aria-hidden="true" />
            {ticket ? "Minha conversa" : "Solicitar orçamento"}
          </button>
        )}
      </div>

      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            role="dialog"
            aria-label="Central de atendimento"
            className="fixed bottom-6 right-6 z-[60] w-[calc(100vw-3rem)] sm:w-[380px] max-h-[min(70vh,560px)] flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
          >
            <header className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
              <div className="min-w-0">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                  {siteConfig.name} / Atendimento
                </p>
                <p className="text-sm font-semibold mt-1 truncate">
                  {ticket ? ticket.subject : subjectRef.current}
                </p>
                {ticket && (
                  <span className="mt-1 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        ticket.status === "respondido"
                          ? "bg-emerald-400"
                          : ticket.status === "fechado"
                            ? "bg-muted-foreground"
                            : "bg-yellow-400"
                      }`}
                      aria-hidden="true"
                    />
                    {statusText}
                  </span>
                )}
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Fechar atendimento"
                className="p-1 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </header>

            {loading ? (
              <div className="flex-1 grid place-items-center py-12">
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" aria-label="Carregando conversa" />
              </div>
            ) : !ticket ? (
              <form onSubmit={start} className="flex-1 overflow-y-auto px-5 py-4 space-y-3" noValidate>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Abra um atendimento e acompanhe a resposta aqui mesmo. Retorno em até 24 horas úteis.
                </p>
                <div className="space-y-1.5">
                  <Label htmlFor="tk-name" className="font-mono text-[10px] uppercase tracking-[0.14em]">Nome</Label>
                  <Input
                    id="tk-name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    maxLength={120}
                    aria-invalid={!!errors.name}
                  />
                  {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="tk-email" className="font-mono text-[10px] uppercase tracking-[0.14em]">E-mail</Label>
                  <Input
                    id="tk-email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    maxLength={320}
                    aria-invalid={!!errors.email}
                  />
                  {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="tk-msg" className="font-mono text-[10px] uppercase tracking-[0.14em]">
                    O que você precisa
                  </Label>
                  <Textarea
                    id="tk-msg"
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    maxLength={2000}
                    aria-invalid={!!errors.message}
                  />
                  {errors.message && <p className="text-xs text-destructive">{errors.message}</p>}
                </div>
                <Button type="submit" className="w-full h-11 rounded-full" disabled={sending}>
                  {sending ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> : "Abrir atendimento"}
                </Button>
              </form>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                  {messages.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center py-6">Nenhuma mensagem ainda.</p>
                  )}
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={`flex ${m.sender === "cliente" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                          m.sender === "cliente"
                            ? "bg-primary text-primary-foreground rounded-br-md"
                            : "bg-foreground/[0.05] border border-border rounded-bl-md"
                        }`}
                      >
                        <p className="whitespace-pre-wrap break-words">{m.body}</p>
                        <p
                          className={`mt-1 font-mono text-[9px] uppercase tracking-wider ${
                            m.sender === "cliente" ? "text-primary-foreground/70" : "text-muted-foreground"
                          }`}
                        >
                          {m.sender === "cliente" ? "Você" : "WH Studio"} · {timeAgo(m.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={bottomRef} />
                </div>

                {ticket.status === "fechado" ? (
                  <div className="border-t border-border px-5 py-4">
                    <p className="text-xs text-muted-foreground">
                      Este atendimento foi encerrado. Precisa de algo novo?{" "}
                      <a
                        href={whatsappLink()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Fale no WhatsApp
                      </a>
                      .
                    </p>
                  </div>
                ) : (
                  <form onSubmit={send} className="border-t border-border p-3 flex items-end gap-2">
                    <Textarea
                      rows={1}
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      placeholder="Escreva sua mensagem…"
                      aria-label="Sua mensagem"
                      maxLength={2000}
                      className="min-h-[42px] max-h-24 resize-none"
                    />
                    <Button
                      type="submit"
                      size="icon"
                      aria-label="Enviar mensagem"
                      disabled={sending || !draft.trim()}
                      className="h-[42px] w-[42px] shrink-0"
                    >
                      {sending ? (
                        <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                      ) : (
                        <Send className="w-4 h-4" aria-hidden="true" />
                      )}
                    </Button>
                  </form>
                )}
              </>
            )}
          </motion.aside>
        )}
      </AnimatePresence>
    </TicketChatContext.Provider>
  );
};
