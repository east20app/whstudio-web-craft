import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { TicketStatus, TicketSender } from "@/lib/tickets";

export type AdminTicket = {
  id: string;
  name: string;
  email: string;
  subject: string;
  status: TicketStatus;
  createdAt: string;
  lastMessageAt: string;
  adminUnread: number;
};

export type AdminTicketMessage = {
  id: string;
  ticketId: string;
  sender: TicketSender;
  body: string;
  createdAt: string;
};

/**
 * Nomes de canal únicos por instância. `useTickets` roda em mais de um componente
 * ao mesmo tempo (badge da sidebar + página de tickets); o Supabase deduplica canais
 * pelo nome e quebra o `.on()` depois do `.subscribe()`.
 */
let channelSeq = 0;
const channelName = (base: string) => `${base}-${Date.now().toString(36)}-${channelSeq++}`;

const mapTicket = (r: any): AdminTicket => ({
  id: r.id,
  name: r.name ?? "",
  email: r.email ?? "",
  subject: r.subject ?? "",
  status: (r.status ?? "aberto") as TicketStatus,
  createdAt: r.created_at,
  lastMessageAt: r.last_message_at ?? r.created_at,
  adminUnread: r.admin_unread ?? 0,
});

/** Tickets + conversa, para o painel admin. */
export const useTickets = () => {
  const [tickets, setTickets] = useState<AdminTicket[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const { data, error } = await supabase
      .from("tickets")
      .select("*")
      .order("last_message_at", { ascending: false });
    if (error) console.error("useTickets.refresh", error);
    if (data) setTickets((data as any[]).map(mapTicket));
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const channel = supabase
      .channel(channelName("admin-tickets"))
      .on("postgres_changes", { event: "*", schema: "public", table: "tickets" }, () => refresh())
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [refresh]);

  const setStatus = async (id: string, status: TicketStatus) => {
    const { error } = await supabase.from("tickets").update({ status }).eq("id", id);
    if (!error) await refresh();
    return !error;
  };

  const markRead = async (id: string) => {
    await supabase.from("tickets").update({ admin_unread: 0 }).eq("id", id);
    await refresh();
  };

  const reply = async (id: string, body: string) => {
    const { error } = await supabase.from("ticket_messages").insert({
      ticket_id: id,
      sender: "admin",
      body: body.trim(),
    });
    if (error) {
      console.error("useTickets.reply insert", error);
      return false;
    }
    await supabase
      .from("tickets")
      .update({ status: "respondido", last_message_at: new Date().toISOString(), admin_unread: 0 })
      .eq("id", id);
    await refresh();
    return true;
  };

  const removeTicket = async (id: string) => {
    const { error } = await supabase.from("tickets").delete().eq("id", id);
    if (!error) await refresh();
    return !error;
  };

  const unread = tickets.filter((t) => t.adminUnread > 0 && t.status !== "fechado").length;
  const openCount = tickets.filter((t) => t.status !== "fechado").length;

  return { tickets, loading, refresh, setStatus, markRead, reply, removeTicket, unread, openCount };
};

/** Mensagens de um ticket específico (admin), com realtime. */
export const useTicketMessages = (ticketId: string | null) => {
  const [messages, setMessages] = useState<AdminTicketMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!ticketId) {
      setMessages([]);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from("ticket_messages")
      .select("*")
      .eq("ticket_id", ticketId)
      .order("created_at", { ascending: true });
    if (error) console.error("useTicketMessages.refresh", error);
    setMessages(
      ((data as any[]) ?? []).map((r) => ({
        id: r.id,
        ticketId: r.ticket_id,
        sender: r.sender as TicketSender,
        body: r.body,
        createdAt: r.created_at,
      }))
    );
    setLoading(false);
  }, [ticketId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (!ticketId) return;
    const channel = supabase
      .channel(channelName(`admin-ticket-${ticketId}`))
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "ticket_messages", filter: `ticket_id=eq.${ticketId}` },
        () => refresh()
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [ticketId, refresh]);

  return { messages, loading, refresh };
};
