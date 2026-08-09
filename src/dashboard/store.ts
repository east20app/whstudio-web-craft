import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type {
  Budget,
  BudgetStatus,
  Client,
  ClientStatus,
  Project,
  ProjectStage,
  AdminService,
  ContactMessage,
  AdminSettings,
  Feedback,
  FeedbackStatus,
} from "./types";

// =====================================================================
// Helpers de mapeamento (DB row -> tipo do app)
// =====================================================================
const mapSettings = (r: any): AdminSettings => ({
  id: r.id,
  siteName: r.site_name,
  whatsapp: r.whatsapp,
  discordLink: r.discord_link,
  footerText: r.footer_text,
  authorName: r.author_name,
  acceptingProjects: r.accepting_projects ?? true,
  availabilityNote: r.availability_note ?? "",
  maintenanceMode: r.maintenance_mode ?? false,
  maintenanceMessage: r.maintenance_message ?? "",
  maintenanceEta: r.maintenance_eta ?? "",
});

const mapProject = (r: any): Project => ({
  id: r.id,
  name: r.name,
  client: r.client ?? "",
  type: r.type ?? "",
  deadline: r.deadline ?? "",
  stage: r.stage as ProjectStage,
});

// =====================================================================
// Genérico: lista com fetch + ações
// =====================================================================
function useTable<TRow, TItem>(
  table: string,
  mapper: (r: TRow) => TItem,
  orderColumn: string = "created_at",
  ascending = false
) {
  const [data, setData] = useState<TItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const { data, error } = await supabase
      .from(table as any)
      .select("*")
      .order(orderColumn, { ascending });
    if (!error && data) setData((data as TRow[]).map(mapper));
    setLoading(false);
  }, [table, orderColumn, ascending, mapper]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, loading, refresh, setData };
}

// =====================================================================
// BUDGETS
// =====================================================================
export const useBudgets = () => {
  const t = useTable<any, Budget>(
    "budgets",
    (r) => ({
      id: r.id,
      client: r.client,
      service: r.service,
      contact: r.contact,
      date: r.date,
      status: r.status as BudgetStatus,
      notes: r.notes ?? undefined,
    }),
    "date"
  );

  const addBudget = async (b: Omit<Budget, "id">) => {
    const { error } = await supabase.from("budgets").insert({
      client: b.client,
      service: b.service,
      contact: b.contact,
      date: b.date,
      status: b.status,
      notes: b.notes ?? null,
    });
    if (!error) await t.refresh();
    return !error;
  };
  const updateBudgetStatus = async (id: string, status: BudgetStatus) => {
    const { error } = await supabase.from("budgets").update({ status }).eq("id", id);
    if (!error) await t.refresh();
    return !error;
  };
  const removeBudget = async (id: string) => {
    const { error } = await supabase.from("budgets").delete().eq("id", id);
    if (!error) await t.refresh();
    return !error;
  };

  return { ...t, addBudget, updateBudgetStatus, removeBudget };
};

// =====================================================================
// CLIENTS
// =====================================================================
export const useClients = () => {
  const t = useTable<any, Client>("clients", (r) => ({
    id: r.id,
    name: r.name,
    whatsapp: r.whatsapp ?? "",
    discord: r.discord ?? "",
    service: r.service ?? "",
    status: r.status as ClientStatus,
  }));

  const addClient = async (c: Omit<Client, "id">) => {
    const { error } = await supabase.from("clients").insert(c);
    if (!error) await t.refresh();
    return !error;
  };
  const removeClient = async (id: string) => {
    const { error } = await supabase.from("clients").delete().eq("id", id);
    if (!error) await t.refresh();
    return !error;
  };

  return { ...t, addClient, removeClient };
};

// =====================================================================
// PROJECTS
// =====================================================================
export const useProjects = () => {
  const t = useTable<any, Project>("projects", mapProject);

  const addProject = async (p: Omit<Project, "id">) => {
    const { error } = await supabase.from("projects").insert({
      name: p.name,
      client: p.client,
      type: p.type,
      deadline: p.deadline || null,
      stage: p.stage,
    });
    if (!error) await t.refresh();
    return !error;
  };
  const updateProjectStage = async (id: string, stage: ProjectStage) => {
    const { error } = await supabase.from("projects").update({ stage }).eq("id", id);
    if (!error) await t.refresh();
    return !error;
  };
  const removeProject = async (id: string) => {
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (!error) await t.refresh();
    return !error;
  };

  return { ...t, addProject, updateProjectStage, removeProject };
};

// =====================================================================
// SERVICES
// =====================================================================
export const useAdminServices = () => {
  const t = useTable<any, AdminService>("services", (r) => ({
    id: r.id,
    name: r.name,
    description: r.description ?? "",
    price: "Sob consulta",
    active: r.active,
  }));

  const addService = async (s: Omit<AdminService, "id">) => {
    const { error } = await supabase.from("services").insert({
      name: s.name,
      description: s.description,
      price: "Sob consulta",
      active: s.active,
    });
    if (!error) await t.refresh();
    return !error;
  };
  const updateService = async (id: string, patch: Partial<AdminService>) => {
    const upd: any = {};
    if (patch.name !== undefined) upd.name = patch.name;
    if (patch.description !== undefined) upd.description = patch.description;
    if (patch.active !== undefined) upd.active = patch.active;
    const { error } = await supabase.from("services").update(upd).eq("id", id);
    if (!error) await t.refresh();
    return !error;
  };
  const removeService = async (id: string) => {
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (!error) await t.refresh();
    return !error;
  };

  return { ...t, addService, updateService, removeService };
};

// =====================================================================
// MESSAGES
// =====================================================================
export const useMessages = () => {
  const t = useTable<any, ContactMessage>("messages", (r) => ({
    id: r.id,
    name: r.name,
    email: r.email,
    message: r.message,
    date: r.created_at,
    read: r.read,
  }));

  const markRead = async (id: string) => {
    const { error } = await supabase.from("messages").update({ read: true }).eq("id", id);
    if (!error) await t.refresh();
  };
  const removeMessage = async (id: string) => {
    const { error } = await supabase.from("messages").delete().eq("id", id);
    if (!error) await t.refresh();
  };

  return { ...t, markRead, removeMessage };
};

// =====================================================================
// SETTINGS (singleton)
// =====================================================================
export const useSettings = () => {
  const [settings, setSettings] = useState<AdminSettings>({
    id: "",
    siteName: "WH Studio",
    whatsapp: "5584988766134",
    discordLink: "https://discord.gg/whstudio",
    footerText: "WH STUDIO © 2026",
    authorName: "Walmry Netto",
    acceptingProjects: true,
    availabilityNote: "",
    maintenanceMode: false,
    maintenanceMessage: "",
    maintenanceEta: "",
  });

  const refresh = useCallback(async () => {
    const { data } = await supabase.from("settings").select("*").limit(1).maybeSingle();
    if (data) setSettings(mapSettings(data));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const saveSettings = async (s: AdminSettings) => {
    const { error } = await supabase
      .from("settings")
      .update({
        site_name: s.siteName,
        whatsapp: s.whatsapp,
        discord_link: s.discordLink,
        footer_text: s.footerText,
        author_name: s.authorName,
        accepting_projects: s.acceptingProjects,
        availability_note: s.availabilityNote,
        maintenance_mode: s.maintenanceMode,
        maintenance_message: s.maintenanceMessage,
        maintenance_eta: s.maintenanceEta,
      })
      .eq("id", s.id);
    if (!error) await refresh();
    return !error;
  };

  return { settings, saveSettings, refresh };
};

// =====================================================================
// FEEDBACKS
// =====================================================================
const mapFeedback = (r: any): Feedback => ({
  id: r.id,
  token: r.token,
  projectId: r.project_id,
  projectName: r.project_name ?? "",
  clientName: r.client_name ?? "",
  rating: r.rating,
  testimonial: r.testimonial,
  allowPublish: !!r.allow_publish,
  status: r.status as FeedbackStatus,
  submittedAt: r.submitted_at,
  createdAt: r.created_at,
});

export const useFeedbacks = () => {
  const t = useTable<any, Feedback>("feedbacks", mapFeedback);

  const releaseFeedback = async (project: { id: string; name: string; client: string }) => {
    const { error } = await supabase.from("feedbacks").insert({
      project_id: project.id,
      project_name: project.name,
      client_name: project.client,
      status: "released",
    });
    if (!error) await t.refresh();
    return !error;
  };
  const updateStatus = async (id: string, status: FeedbackStatus) => {
    const { error } = await supabase.from("feedbacks").update({ status }).eq("id", id);
    if (!error) await t.refresh();
    return !error;
  };
  const removeFeedback = async (id: string) => {
    const { error } = await supabase.from("feedbacks").delete().eq("id", id);
    if (!error) await t.refresh();
    return !error;
  };

  return { ...t, releaseFeedback, updateStatus, removeFeedback };
};
// =====================================================================
export const useAuth = () => {
  const [user, setUser] = useState<{ id: string; email: string | null } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? { id: session.user.id, email: session.user.email ?? null } : null);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ? { id: session.user.id, email: session.user.email ?? null } : null);
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return { user, loading };
};

export const signIn = async (email: string, password: string) => {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  return error?.message ?? null;
};

// Cadastro público removido por segurança: o painel é exclusivo do administrador.

export const signOut = async () => {
  await supabase.auth.signOut();
};
