import {
  Bot,
  Braces,
  Globe,
  Mail,
  MessageSquare,
  MonitorSmartphone,
  ShoppingCart,
  Timer,
  Workflow,
  type LucideIcon,
} from "lucide-react";

/** Ícones disponíveis para serviços (painel admin + exibição pública). */
export const SERVICE_ICONS: Record<string, LucideIcon> = {
  MonitorSmartphone,
  Globe,
  ShoppingCart,
  Bot,
  Braces,
  Workflow,
  MessageSquare,
  Mail,
  Timer,
};

export const SERVICE_ICON_NAMES = Object.keys(SERVICE_ICONS);

export const resolveServiceIcon = (name: string | undefined | null): LucideIcon =>
  (name && SERVICE_ICONS[name]) || MonitorSmartphone;