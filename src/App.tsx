import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate, Outlet } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { MotionConfig } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import ServicosPage from "./pages/ServicosPage.tsx";
import SistemasPage from "./pages/SistemasPage.tsx";
import PlanosPage from "./pages/PlanosPage.tsx";
import PortfolioPage from "./pages/PortfolioPage.tsx";
import ContatoPage from "./pages/ContatoPage.tsx";
import SobrePage from "./pages/SobrePage.tsx";
import NotFound from "./pages/NotFound.tsx";
import FeedbackPublicPage from "./pages/FeedbackPublicPage.tsx";
import MaintenanceGate from "./components/MaintenanceGate";
import { TicketChatProvider } from "./components/tickets/TicketChat";

// Dashboard e páginas pesadas só carregam quando a rota abre —
// mantém o bundle do site público enxuto.
const DashboardLayout = lazy(() => import("./dashboard/DashboardLayout"));
const RequireAuth = lazy(() =>
  import("./dashboard/RequireAuth").then((m) => ({ default: m.RequireAuth }))
);
const LoginPage = lazy(() => import("./dashboard/LoginPage"));
const Overview = lazy(() => import("./dashboard/Overview"));
const BudgetsPage = lazy(() => import("./dashboard/BudgetsPage"));
const ClientsPage = lazy(() => import("./dashboard/ClientsPage"));
const ProjectsPage = lazy(() => import("./dashboard/ProjectsPage"));
const ServicesPage = lazy(() => import("./dashboard/ServicesPage"));
const MessagesPage = lazy(() => import("./dashboard/MessagesPage"));
const SettingsPage = lazy(() => import("./dashboard/SettingsPage"));
const FeedbacksPage = lazy(() => import("./dashboard/FeedbacksPage"));
const TicketsPage = lazy(() => import("./dashboard/TicketsPage"));
const PortfolioAdminPage = lazy(() => import("./dashboard/PortfolioAdminPage"));

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="min-h-[50vh] grid place-items-center bg-background">
    <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" aria-label="Carregando página" />
  </div>
);

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <MotionConfig reducedMotion="user">
            <Routes>
              <Route
                element={
                  <MaintenanceGate>
                    <TicketChatProvider>
                      <Outlet />
                    </TicketChatProvider>
                  </MaintenanceGate>
                }
              >
                <Route path="/" element={<Index />} />
                <Route path="/servicos" element={<ServicosPage />} />
                <Route path="/sistemas" element={<SistemasPage />} />
                <Route path="/planos" element={<PlanosPage />} />
                <Route path="/portfolio" element={<PortfolioPage />} />
                <Route path="/contato" element={<ContatoPage />} />
                <Route path="/sobre" element={<SobrePage />} />
                <Route path="/feedback/:token" element={<FeedbackPublicPage />} />
              </Route>

              <Route path="/dashboard/login" element={<Suspense fallback={<PageLoader />}><LoginPage /></Suspense>} />
              <Route
                path="/dashboard"
                element={
                  <Suspense fallback={<PageLoader />}>
                    <RequireAuth>
                      <DashboardLayout />
                    </RequireAuth>
                  </Suspense>
                }
              >
                <Route index element={<Overview />} />
                <Route path="orcamentos" element={<BudgetsPage />} />
                <Route path="clientes" element={<ClientsPage />} />
                <Route path="projetos" element={<ProjectsPage />} />
                <Route path="servicos" element={<ServicesPage />} />
                <Route path="mensagens" element={<MessagesPage />} />
                <Route path="tickets" element={<TicketsPage />} />
                <Route path="portfolio" element={<PortfolioAdminPage />} />
                <Route path="feedbacks" element={<FeedbacksPage />} />
                <Route path="configuracoes" element={<SettingsPage />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </MotionConfig>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;