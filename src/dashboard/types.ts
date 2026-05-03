// Tipos compartilhados do dashboard WH Studio
export type BudgetStatus = "novo" | "em-analise" | "aprovado" | "recusado";
export type ClientStatus = "ativo" | "inativo" | "lead";
export type ProjectStage = "planejamento" | "desenvolvimento" | "revisao" | "entregue";

export type Budget = {
  id: string;
  client: string;
  service: string;
  contact: string;
  date: string; // ISO
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
  price: "Sob consulta";
  active: boolean;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  date: string; // ISO
  read?: boolean;
};

export type AdminSettings = {
  siteName: string;
  whatsapp: string;
  discordLink: string;
  footerText: string;
  authorName: string;
};
