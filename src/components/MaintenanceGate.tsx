import { Loader2, MessageCircle, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMaintenanceMode } from "@/hooks/useMaintenanceMode";
import { useAuth } from "@/dashboard/store";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import logo from "@/assets/wh-studio-logo.png";

/**
 * Envolve as rotas públicas. Com o modo de manutenção ligado, visitantes não
 * autenticados veem a tela de manutenção; o admin logado continua navegando.
 */
const MaintenanceGate = ({ children }: { children: React.ReactNode }) => {
  const { active, message, eta, loaded } = useMaintenanceMode();
  const { user, loading } = useAuth();
  const settings = useSiteSettings();

  if (!loaded || loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-background">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" aria-label="Carregando" />
      </div>
    );
  }

  if (!active || user) return <>{children}</>;

  return (
    <main className="min-h-screen grid place-items-center bg-background px-6 py-16">
      <div className="w-full max-w-lg text-center">
        <img src={logo} alt={`${settings.siteName} — logo`} className="logo-invert h-14 mx-auto mb-10 object-contain" />

        <div className="card-premium p-8 md:p-10">
          <span className="mx-auto mb-6 flex h-11 w-11 items-center justify-center border border-border bg-foreground/[0.03]">
            <Wrench className="h-5 w-5 text-primary" aria-hidden="true" strokeWidth={1.5} />
          </span>

          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            Sys / Manutenção
          </p>
          <h1 className="font-display text-3xl md:text-4xl tracking-tight mt-3">Estamos em manutenção</h1>

          <p className="text-sm text-foreground/70 mt-4 leading-relaxed">
            {message?.trim()
              ? message
              : "Estamos fazendo ajustes no site. Voltamos em pouco tempo — se for urgente, fale com a gente pelo WhatsApp."}
          </p>

          {eta?.trim() && (
            <div className="mt-6 border border-border bg-foreground/[0.02] px-4 py-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Previsão</p>
              <p className="text-sm font-medium mt-1">{eta}</p>
            </div>
          )}

          <Button asChild className="mt-8 h-11 w-full rounded-none">
            <a
              href={settings.buildWhatsappLink("Olá! O site da WH Studio está em manutenção e eu preciso falar com vocês.")}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="w-4 h-4 mr-2" aria-hidden="true" /> Falar no WhatsApp
            </a>
          </Button>
        </div>

        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground/60 mt-8">
          {settings.siteName} — {settings.email}
        </p>
      </div>
    </main>
  );
};

export default MaintenanceGate;