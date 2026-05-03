import { ReactNode } from "react";

type Props = { icon?: ReactNode; title: string; description?: string; action?: ReactNode };

const EmptyState = ({ icon, title, description, action }: Props) => (
  <div className="card-dark p-10 text-center">
    {icon && <div className="mx-auto mb-4 w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">{icon}</div>}
    <h3 className="text-base font-semibold">{title}</h3>
    {description && <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">{description}</p>}
    {action && <div className="mt-5">{action}</div>}
  </div>
);

export default EmptyState;
