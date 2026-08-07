import { useMemo, useState } from "react";
import { MessageSquare, Send, Trash2, Loader2, ArrowLeft, FilePlus2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import EmptyState from "./components/EmptyState";
import { useTickets, useTicketMessages } from "./ticketsStore";
import { useBudgets } from "./store";
import { ticketStatusLabel, type TicketStatus } from "@/lib/tickets";
import { toast } from "sonner";

const statusDot: Record<TicketStatus, string> = {
  aberto: "bg-yellow-400",
  "em-andamento": "bg-primary",
  respondido: "bg-emerald-400",
  fechado: "bg-muted-foreground",
};

const timeAgo = (iso: string) => {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return "agora";
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
};

const TicketsPage = () => {
  const { tickets, loading, setStatus, markRead, reply, removeTicket, unread } = useTickets();
  const [selected, setSelected] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [search, setSearch] = useState("");
  const { addBudget } = useBudgets();

  const ticket = tickets.find((t) => t.id === selected) ?? null;
  const { messages, loading: loadingMsgs } = useTicketMessages(selected);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return tickets;
    return tickets.filter((t) =>
      [t.name, t.email, t.subject].some((v) => v.toLowerCase().includes(q))
    );
  }, [tickets, search]);

  const openTicket = (id: string) => {
    setSelected(id);
    setDraft("");
    markRead(id);
  };

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticket || !draft.trim()) return;
    setSending(true);
    const ok = await reply(ticket.id, draft);
    setSending(false);
    if (ok) setDraft("");
    else toast.error("Não foi possível enviar a resposta");
  };

  const close = async () => {
    if (!ticket) return;
    const ok = await setStatus(ticket.id, "fechado");
    if (!ok) return;
    toast.success("Ticket encerrado", {
      description: "Quer registrar um orçamento com esses dados?",
      action: {
        label: "Criar orçamento",
        onClick: async () => {
          const done = await addBudget({
            client: ticket.name,
            service: ticket.subject,
            contact: ticket.email,
            date: new Date().toISOString(),
            status: "novo",
            notes: `Gerado a partir do ticket de atendimento (${ticket.email}).`,
          });
          if (done) toast.success("Orçamento criado em Orçamentos");
          else toast.error("Erro ao criar orçamento");
        },
      },
    });
  };

  if (ticket) {
    return (
      <div className="space-y-6 max-w-3xl">
        <button
          onClick={() => setSelected(null)}
          className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground hover:text-foreground"
          aria-label="Voltar para a lista de tickets"
        >
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" /> Todos os tickets
        </button>

        <header className="border-b border-border pb-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            Atendimento / Ticket
          </p>
          <h2 className="text-2xl font-bold tracking-tight mt-2">{ticket.subject}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {ticket.name} ·{" "}
            <a href={`mailto:${ticket.email}`} className="hover:text-foreground">
              {ticket.email}
            </a>
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground mr-2">
              <span className={`h-1.5 w-1.5 rounded-full ${statusDot[ticket.status]}`} aria-hidden="true" />
              {ticketStatusLabel[ticket.status]}
            </span>
            <Button size="sm" variant="outline" onClick={() => setStatus(ticket.id, "em-andamento")}>
              Em andamento
            </Button>
            <Button size="sm" variant="outline" onClick={close}>
              <FilePlus2 className="w-3.5 h-3.5 mr-1.5" aria-hidden="true" /> Encerrar
            </Button>
            <Button
              size="sm"
              variant="ghost"
              aria-label="Excluir ticket"
              onClick={async () => {
                await removeTicket(ticket.id);
                setSelected(null);
                toast.success("Ticket removido");
              }}
            >
              <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
            </Button>
          </div>
        </header>

        <div className="space-y-3 min-h-[200px]">
          {loadingMsgs ? (
            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" aria-label="Carregando mensagens" />
          ) : (
            messages.map((m) => (
              <div key={m.id} className={`flex ${m.sender === "admin" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    m.sender === "admin"
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-card border border-border rounded-bl-md"
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{m.body}</p>
                  <p
                    className={`mt-1.5 font-mono text-[9px] uppercase tracking-wider ${
                      m.sender === "admin" ? "text-primary-foreground/70" : "text-muted-foreground"
                    }`}
                  >
                    {m.sender === "admin" ? "Você" : ticket.name} · {timeAgo(m.createdAt)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        <form onSubmit={send} className="flex items-end gap-2 border-t border-border pt-4">
          <Textarea
            rows={2}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Responder como WH Studio…"
            aria-label="Resposta do admin"
            className="resize-none"
          />
          <Button type="submit" size="icon" aria-label="Enviar resposta" disabled={sending || !draft.trim()}>
            {sending ? (
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
            ) : (
              <Send className="w-4 h-4" aria-hidden="true" />
            )}
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Atendimento / Tickets</p>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight mt-2">
          Tickets{" "}
          {unread > 0 && (
            <span className="align-middle ml-1 font-mono text-xs px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/30">
              {unread} novo{unread > 1 ? "s" : ""}
            </span>
          )}
        </h2>
        <p className="text-muted-foreground text-sm mt-1">Conversas abertas pelo site, com histórico completo.</p>
      </header>

      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar por nome, e-mail ou assunto"
        aria-label="Buscar tickets"
        className="max-w-sm"
      />

      {loading ? (
        <p className="text-sm text-muted-foreground">Carregando…</p>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<MessageSquare className="w-5 h-5" />}
          title="Nenhum ticket ainda"
          description="Quando alguém solicitar orçamento pelo site, a conversa aparece aqui."
        />
      ) : (
        <div className="border border-border rounded-xl divide-y divide-border overflow-hidden">
          {filtered.map((t) => (
            <button
              key={t.id}
              onClick={() => openTicket(t.id)}
              className="w-full text-left px-5 py-4 hover:bg-foreground/[0.02] transition-colors flex items-center gap-4"
            >
              <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${statusDot[t.status]}`} aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold truncate">{t.name || "Sem nome"}</p>
                  {t.adminUnread > 0 && t.status !== "fechado" && (
                    <span className="font-mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/30">
                      novo
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate mt-0.5">{t.subject}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                  {ticketStatusLabel[t.status]}
                </p>
                <p className="text-xs text-muted-foreground/70 mt-0.5 tabular-nums">{timeAgo(t.lastMessageAt)}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TicketsPage;
