import { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

type Props = {
  label: string;
  value: ReactNode;
  icon?: LucideIcon;
  trend?: string;
  onClick?: () => void;
};

/** Métrica em bloco técnico: label mono, número tabular e estados discretos. */
const StatCard = ({ label, value, trend, onClick }: Props) => (
  <button
    onClick={onClick}
    type="button"
    className="group relative w-full rounded-2xl border border-border/80 bg-card/80 p-5 text-left shadow-[0_8px_28px_hsl(var(--foreground)/0.035)] transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-[0_16px_36px_hsl(var(--primary)/0.08)]"
  >
    <span className="absolute left-5 top-0 h-px w-8 bg-primary/55 transition-[width] duration-200 group-hover:w-14" aria-hidden="true" />
    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
    <p className="text-3xl md:text-4xl font-bold tabular-nums tracking-tight mt-3 leading-none">{value}</p>
    {trend && <p className="text-[11px] text-muted-foreground mt-2.5">{trend}</p>}
  </button>
);

export default StatCard;
