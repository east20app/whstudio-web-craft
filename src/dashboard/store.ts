import { useEffect, useState, useCallback } from "react";
import type {
  Budget,
  Client,
  Project,
  AdminService,
  ContactMessage,
  AdminSettings,
} from "./types";

const KEYS = {
  budgets: "wh:budgets",
  clients: "wh:clients",
  projects: "wh:projects",
  services: "wh:services",
  messages: "wh:messages",
  settings: "wh:settings",
  auth: "wh:auth",
} as const;

// Seed inicial
const seedBudgets: Budget[] = [
  {
    id: "b1",
    client: "Lucas Mendes",
    service: "Sistema personalizado",
    contact: "(84) 99999-1111",
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
    status: "novo",
  },
  {
    id: "b2",
    client: "Ana Beatriz",
    service: "Site institucional",
    contact: "ana@saborarte.com.br",
    date: new Date(Date.now() - 86400000 * 5).toISOString(),
    status: "em-analise",
  },
  {
    id: "b3",
    client: "Rafael Costa",
    service: "Bot Discord",
    contact: "rafael#1234",
    date: new Date(Date.now() - 86400000 * 12).toISOString(),
    status: "aprovado",
  },
  {
    id: "b4",
    client: "Carla Souza",
    service: "Landing page",
    contact: "(84) 98888-2222",
    date: new Date(Date.now() - 86400000 * 20).toISOString(),
    status: "recusado",
  },
];

const seedClients: Client[] = [
  { id: "c1", name: "Lucas Mendes", whatsapp: "5584999991111", discord: "lucasm#0001", service: "Sistema personalizado", status: "ativo" },
  { id: "c2", name: "Ana Beatriz", whatsapp: "5584988882222", discord: "", service: "Site institucional", status: "ativo" },
  { id: "c3", name: "Rafael Costa", whatsapp: "5584977773333", discord: "rafael#1234", service: "Bot Discord", status: "ativo" },
  { id: "c4", name: "Pedro Lima", whatsapp: "5584966664444", discord: "", service: "Landing page", status: "lead" },
];

const seedProjects: Project[] = [
  { id: "p1", name: "TechFlow Dashboard", client: "Lucas Mendes", type: "Sistema", deadline: "2026-05-25", stage: "desenvolvimento" },
  { id: "p2", name: "Sabor & Arte", client: "Ana Beatriz", type: "Site", deadline: "2026-05-12", stage: "revisao" },
  { id: "p3", name: "ModBot v2", client: "Rafael Costa", type: "Bot Discord", deadline: "2026-06-01", stage: "planejamento" },
  { id: "p4", name: "Peixe Store", client: "Pedro Lima", type: "E-commerce", deadline: "2026-04-20", stage: "entregue" },
];

const seedServices: AdminService[] = [
  { id: "s1", name: "Criação de Sites", description: "Sites institucionais, landing pages e lojas virtuais.", price: "Sob consulta", active: true },
  { id: "s2", name: "Bots para Discord", description: "Bots completos sob medida.", price: "Sob consulta", active: true },
  { id: "s3", name: "APIs e Sistemas", description: "Sistemas web e APIs sob medida.", price: "Sob consulta", active: true },
  { id: "s4", name: "Automação", description: "Automatize processos e integrações.", price: "Sob consulta", active: true },
];

const seedMessages: ContactMessage[] = [
  {
    id: "m1",
    name: "Maria Silva",
    email: "maria@email.com",
    message: "Gostaria de um orçamento para um site de delivery.",
    date: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "m2",
    name: "João Santos",
    email: "joao@email.com",
    message: "Tenho interesse em um bot para meu servidor.",
    date: new Date(Date.now() - 86400000 * 3).toISOString(),
    read: true,
  },
];

const seedSettings: AdminSettings = {
  siteName: "WH Studio",
  whatsapp: "5584988766134",
  discordLink: "https://discord.gg/whstudio",
  footerText: "WH STUDIO © 2026",
  authorName: "Walmry Netto",
};

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

function useStore<T>(key: string, seed: T) {
  const [value, setValue] = useState<T>(() => read(key, seed));

  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          setValue(JSON.parse(e.newValue));
        } catch {
          /* noop */
        }
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [key]);

  const update = useCallback(
    (updater: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const next = typeof updater === "function" ? (updater as (p: T) => T)(prev) : updater;
        write(key, next);
        return next;
      });
    },
    [key]
  );

  return [value, update] as const;
}

export const useBudgets = () => useStore<Budget[]>(KEYS.budgets, seedBudgets);
export const useClients = () => useStore<Client[]>(KEYS.clients, seedClients);
export const useProjects = () => useStore<Project[]>(KEYS.projects, seedProjects);
export const useAdminServices = () => useStore<AdminService[]>(KEYS.services, seedServices);
export const useMessages = () => useStore<ContactMessage[]>(KEYS.messages, seedMessages);
export const useSettings = () => useStore<AdminSettings>(KEYS.settings, seedSettings);

// ============== AUTH ==============
export const ADMIN_CREDENTIALS = { user: "admin", pass: "whstudio" };

export function isAuthenticated() {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(KEYS.auth) === "1";
}

export function login(user: string, pass: string) {
  if (user === ADMIN_CREDENTIALS.user && pass === ADMIN_CREDENTIALS.pass) {
    localStorage.setItem(KEYS.auth, "1");
    return true;
  }
  return false;
}

export function logout() {
  localStorage.removeItem(KEYS.auth);
}

// helper de IDs
export const newId = () => Math.random().toString(36).slice(2, 10);
