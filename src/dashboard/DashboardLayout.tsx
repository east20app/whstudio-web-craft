import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Users,
  Briefcase,
  Wrench,
  MessageSquare,
  Star,
  Settings as SettingsIcon,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { signOut, useAuth, useSettings } from "./store";
import { toast } from "sonner";

const items = [
  { to: "/dashboard", label: "Visão Geral", icon: LayoutDashboard, end: true },
  { to: "/dashboard/orcamentos", label: "Orçamentos", icon: FileText },
  { to: "/dashboard/clientes", label: "Clientes", icon: Users },
  { to: "/dashboard/projetos", label: "Projetos", icon: Briefcase },
  { to: "/dashboard/servicos", label: "Serviços", icon: Wrench },
  { to: "/dashboard/mensagens", label: "Mensagens", icon: MessageSquare },
  { to: "/dashboard/feedbacks", label: "Feedbacks", icon: Star },
  { to: "/dashboard/configuracoes", label: "Configurações", icon: SettingsIcon },
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

  const initial = (user?.email ?? "U").charAt(0).toUpperCase();

  return (
    <div className="min-h-screen flex w-full bg-background">
      <aside
        className={`fixed lg:sticky top-0 inset-y-0 left-0 z-40 w-64 bg-card/70 backdrop-blur-xl border-r border-border flex flex-col transition-transform lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-16 flex items-center justify-between px-5 border-b border-border">
          <div className="flex items-center gap-2 font-extrabold tracking-tight">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/15 border border-primary/30 text-primary text-sm">
              WH
            </span>
            <span>{settings.siteName}</span>
          </div>
          <button
            className="lg:hidden p-1 text-muted-foreground"
            onClick={() => setOpen(false)}
            aria-label="Fechar menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 p-3 space-y-1" aria-label="Menu do dashboard">
          {items.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              end={it.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary/15 text-primary border border-primary/30"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`
              }
            >
              <it.icon className="w-4 h-4" />
              {it.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-border">
          <Button variant="outline" size="sm" className="w-full" onClick={onLogout}>
            <LogOut className="w-4 h-4 mr-2" /> Sair
          </Button>
        </div>
      </aside>

      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 sticky top-0 z-20 bg-background/70 backdrop-blur-xl border-b border-border flex items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 -ml-2 text-foreground"
              onClick={() => setOpen(true)}
              aria-label="Abrir menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-sm md:text-base font-semibold text-muted-foreground">
              Painel administrativo
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end leading-tight max-w-[200px]">
              <span className="text-xs text-muted-foreground">Logado como</span>
              <span className="text-sm font-medium truncate">{user?.email ?? "—"}</span>
            </div>
            <div className="w-9 h-9 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center text-primary font-bold text-sm">
              {initial}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
