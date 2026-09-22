// Tipos compartilhados do dashboard WH Studio
export type BudgetStatus = "novo" | "em-analise" | "aprovado" | "recusado";
export type ClientStatus = "ativo" | "inativo" | "lead";
export type ProjectStage = "planejamento" | "desenvolvimento" | "revisao" | "entregue";

export type Budget = {
  id: string;
  client: string;
  service: string;
  contact: string;
  date: string;
  status: BudgetStatus;
  notes?: string;
};

export type Client = {
  id: string;
  name: string;
  whatsapp: string;
  discord?: string;
  service: string;
  status: ClientStatus;
};

export type Project = {
  id: string;
  name: string;
  client: string;
  type: string;
  deadline: string;
  stage: ProjectStage;
};

export type AdminService = {
  id: string;
  name: string;
  description: string;
  price: string;
  active: boolean;
  icon: string;
  sortOrder: number;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  date: string;
  read?: boolean;
};

export type FeedbackStatus = "released" | "received" | "published" | "hidden";

export type Feedback = {
  id: string;
  token: string;
  projectId: string | null;
  projectName: string;
  clientName: string;
  rating: number | null;
  testimonial: string | null;
  allowPublish: boolean;
  status: FeedbackStatus;
  submittedAt: string | null;
  createdAt: string;
};

export type AdminSettings = {
  id: string;
  siteName: string;
  whatsapp: string;
  discordLink: string;
  footerText: string;
  authorName: string;
  acceptingProjects: boolean;
  availabilityNote: string;
  maintenanceMode: boolean;
  maintenanceMessage: string;
  maintenanceEta: string;
};
