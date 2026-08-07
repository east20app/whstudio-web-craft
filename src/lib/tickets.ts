import { supabase } from "@/integrations/supabase/client";

export type TicketStatus = "aberto" | "em-andamento" | "respondido" | "fechado";
export type TicketSender = "cliente" | "admin";

export type PublicTicket = {
  id: string;
  name: string;
  email: string;
  subject: string;
  status: TicketStatus;
  lastMessageAt: string;
  createdAt: string;
};

export type TicketMessage = {
  id: string;
  sender: TicketSender;
  body: string;
  createdAt: string;
};

const TOKEN_KEY = "wh_ticket_token";

export const getStoredToken = (): string | null => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const storeToken = (token: string) => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    /* ignore */
  }
};

export const clearStoredToken = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignore */
  }
};

/** Cria um ticket e devolve o token do cliente (guardado no localStorage). */
export const createTicket = async (input: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<string | null> => {
  const { data, error } = await supabase.rpc("create_ticket", {
    _name: input.name,
    _email: input.email,
    _subject: input.subject,
    _message: input.message,
  });
  if (error || !data) return null;
  const token = data as unknown as string;
  storeToken(token);
  return token;
};

export const fetchTicket = async (token: string): Promise<PublicTicket | null> => {
  const { data, error } = await supabase.rpc("get_ticket_by_token", { _token: token });
  if (error || !data) return null;
  const row = (Array.isArray(data) ? data[0] : data) as any;
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    subject: row.subject,
    status: row.status as TicketStatus,
    lastMessageAt: row.last_message_at,
    createdAt: row.created_at,
  };
};

export const fetchTicketMessages = async (token: string): Promise<TicketMessage[]> => {
  const { data, error } = await supabase.rpc("get_ticket_messages", { _token: token });
  if (error || !data) return [];
  return (data as any[]).map((r) => ({
    id: r.id,
    sender: r.sender as TicketSender,
    body: r.body,
    createdAt: r.created_at,
  }));
};

export const postTicketMessage = async (token: string, body: string): Promise<boolean> => {
  const { data, error } = await supabase.rpc("post_ticket_message", { _token: token, _body: body });
  return !error && data === true;
};

export const ticketStatusLabel: Record<TicketStatus, string> = {
  aberto: "Aguardando resposta",
  "em-andamento": "Em andamento",
  respondido: "Respondido",
  fechado: "Encerrado",
};
