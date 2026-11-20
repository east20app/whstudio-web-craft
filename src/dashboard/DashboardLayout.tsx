import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { BriefcaseBusiness, CircleHelp, FolderKanban, Image, LayoutDashboard, LogOut, Mail, Menu, Receipt, Settings, Star, Users, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { signOut, useAuth, useSettings } from "./store";
import { useTickets } from "./ticketsStore";
import { toast } from "sonner";
import BrandLogo from "@/components/BrandLogo";

const items = [
  { to: "/dashboard", label: "Visão geral", icon: LayoutDashboard, end: true },
  { to: "/dashboard/orcamentos", label: "Orçamentos", icon: Receipt },
  { to: "/dashboard/clientes", label: "Clientes", icon: Users },
  { to: "/dashboard/projetos", label: "Projetos", icon: FolderKanban },
  { to: "/dashboard/servicos", label: "Serviços", icon: BriefcaseBusiness },
  { to: "/dashboard/tickets", label: "Tickets", icon: CircleHelp, badge: "tickets" as const },
  { to: "/dashboard/mensagens", label: "Mensagens", icon: Mail },
  { to: "/dashboard/feedbacks", label: "Feedbacks", icon: Star },
  { to: "/dashboard/portfolio", label: "Portfólio", icon: Image },
  { to: "/dashboard/configuracoes", label: "Configurações", icon: Settings },
];

const DashboardLayout = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { settings } = useSettings();
  const { user } = useAuth();
  const { unread } = useTickets();

  const onLogout = async () => {
    await signOut();
    toast.success("Sessão encerrada");
    navigate("/dashboard/login");
  };

  return (
    <div className="dashboard-shell min-h-screen flex w-full bg-background">
      <aside
        className={`fixed lg:sticky top-0 inset-y-0 left-0 z-40 w-[248px] h-screen bg-card border-r border-border flex flex-col transition-transform lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-20 flex items-center justify-between px-5 border-b border-border">
          <div className="flex items-center gap-2">
            <BrandLogo className="h-8 w-32" />
            <span className="border-l border-border pl-2 font-mono text-xs text-muted-foreground">Gestão</span>
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
                `relative mx-3 flex items-center gap-3 border border-transparent px-3 py-2.5 text-sm transition-[background-color,color] duration-200 ${
                  isActive
                    ? "border-[#0047ff] bg-[#0047ff] text-white"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/70"
                }`
              }
            >
              <it.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="font-medium tracking-tight">{it.label}</span>
              {"badge" in it && it.badge === "tickets" && unread > 0 && (
                <span className="ml-auto font-mono text-[9px] px-1.5 py-0.5 border bg-primary/15 text-primary border-primary/30 tabular-nums">
                  {unread}
                </span>
              )}
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
        <header className="h-20 sticky top-0 z-20 bg-background/85 backdrop-blur-xl border-b border-border/80 flex items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-2 -ml-2 text-foreground" onClick={() => setOpen(true)} aria-label="Abrir menu">
              <Menu className="w-5 h-5" />
            </button>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              WH Studio / Gestão
            </p>
            {settings.maintenanceMode && (
              <span className="hidden sm:inline-flex items-center gap-2 border border-yellow-600/40 bg-yellow-500/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-yellow-700">
                <span className="h-1.5 w-1.5 rounded-full bg-yellow-600" aria-hidden="true" />
                Site em manutenção para visitantes
              </span>
            )}
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
