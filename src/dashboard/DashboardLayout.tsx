import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { signOut, useAuth, useSettings } from "./store";
import { toast } from "sonner";

const items = [
  { to: "/dashboard", label: "Visão geral", code: "00", end: true },
  { to: "/dashboard/orcamentos", label: "Orçamentos", code: "01" },
  { to: "/dashboard/clientes", label: "Clientes", code: "02" },
  { to: "/dashboard/projetos", label: "Projetos", code: "03" },
  { to: "/dashboard/servicos", label: "Serviços", code: "04" },
  { to: "/dashboard/mensagens", label: "Mensagens", code: "05" },
  { to: "/dashboard/feedbacks", label: "Feedbacks", code: "06" },
  { to: "/dashboard/configuracoes", label: "Configurações", code: "07" },
];

const DashboardLayout = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { settings } = useSettings();
  const { user } = useAuth();

  const onLogout = async () => {
    await signOut();
    toast.success("Sessão encerrada");
    navigate("/dashboard/login");
  };

  return (
    <div className="min-h-screen flex w-full bg-background">
      <aside
        className={`fixed lg:sticky top-0 inset-y-0 left-0 z-40 w-[248px] h-screen bg-[hsl(240_10%_2.5%)] border-r border-border flex flex-col transition-transform lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-14 flex items-center justify-between px-5 border-b border-border">
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-[13px] font-semibold tracking-[0.14em] uppercase">
              {settings.siteName}
            </span>
            <span className="font-mono text-[10px] text-muted-foreground/60">/adm</span>
          </div>
          <button className="lg:hidden p-1 text-muted-foreground" onClick={() => setOpen(false)} aria-label="Fechar menu">
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto" aria-label="Menu do dashboard">
          {items.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              end={it.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `relative flex items-center gap-3 pl-5 pr-4 py-2.5 text-[13px] transition-colors ${
                  isActive
                    ? "text-foreground bg-foreground/[0.04] before:absolute before:left-0 before:top-0 before:h-full before:w-[2px] before:bg-primary before:content-['']"
                    : "text-muted-foreground hover:text-foreground hover:bg-foreground/[0.02]"
                }`
              }
            >
              <span className="font-mono text-[10px] text-muted-foreground/50 tabular-nums">{it.code}</span>
              <span className="font-medium">{it.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="px-5 py-4 border-t border-border space-y-3">
          <div className="leading-tight">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground/60">Sessão</p>
            <p className="text-xs mt-1 truncate">{user?.email ?? "—"}</p>
          </div>
          <Button variant="ghost" size="sm" className="w-full justify-start px-0 h-auto py-1 text-muted-foreground hover:text-foreground hover:bg-transparent" onClick={onLogout}>
            <LogOut className="w-3.5 h-3.5 mr-2" /> Encerrar sessão
          </Button>
        </div>
      </aside>

      {open && (
        <div className="fixed inset-0 z-30 bg-background/80 lg:hidden" onClick={() => setOpen(false)} aria-hidden="true" />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 sticky top-0 z-20 bg-background/85 backdrop-blur-md border-b border-border flex items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-2 -ml-2 text-foreground" onClick={() => setOpen(true)} aria-label="Abrir menu">
              <Menu className="w-5 h-5" />
            </button>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              Painel interno
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Online</span>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 max-w-[1200px] w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
