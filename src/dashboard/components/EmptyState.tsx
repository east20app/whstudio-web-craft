import { ReactNode } from "react";

type Props = { icon?: ReactNode; title: string; description?: string; action?: ReactNode };

const EmptyState = ({ title, description, action }: Props) => (
  <div className="border border-dashed border-border px-6 py-12 text-center">
    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">Vazio</p>
    <h3 className="text-base font-semibold mt-3">{title}</h3>
    {description && <p className="text-sm text-muted-foreground mt-1.5 max-w-sm mx-auto leading-relaxed">{description}</p>}
    {action && <div className="mt-6">{action}</div>}
  </div>
);

export default EmptyState;
