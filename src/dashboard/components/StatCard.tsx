import { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

type Props = {
  label: string;
  value: ReactNode;
  icon?: LucideIcon;
  trend?: string;
  onClick?: () => void;
};

/** Métrica em bloco técnico: label mono, número tabular, hairline. Sem glow. */
const StatCard = ({ label, value, trend, onClick }: Props) => (
  <button
    onClick={onClick}
    type="button"
    className="group relative w-full text-left px-5 py-5 bg-card/30 hover:bg-card/60 transition-colors"
  >
    <span className="absolute left-0 top-0 h-full w-px bg-border group-hover:bg-primary transition-colors" aria-hidden="true" />
    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
    <p className="text-3xl md:text-4xl font-bold tabular-nums tracking-tight mt-3 leading-none">{value}</p>
    {trend && <p className="text-[11px] text-muted-foreground mt-2.5">{trend}</p>}
  </button>
);

export default StatCard;
