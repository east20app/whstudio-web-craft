import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import ServicosPage from "./pages/ServicosPage.tsx";
import PlanosPage from "./pages/PlanosPage.tsx";
import PortfolioPage from "./pages/PortfolioPage.tsx";
import ContatoPage from "./pages/ContatoPage.tsx";
import NotFound from "./pages/NotFound.tsx";

import DashboardLayout from "./dashboard/DashboardLayout";
import { RequireAuth } from "./dashboard/RequireAuth";
import LoginPage from "./dashboard/LoginPage";
import Overview from "./dashboard/Overview";
import BudgetsPage from "./dashboard/BudgetsPage";
import ClientsPage from "./dashboard/ClientsPage";
import ProjectsPage from "./dashboard/ProjectsPage";
import ServicesPage from "./dashboard/ServicesPage";
import MessagesPage from "./dashboard/MessagesPage";
import SettingsPage from "./dashboard/SettingsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/servicos" element={<ServicosPage />} />
          <Route path="/planos" element={<PlanosPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/contato" element={<ContatoPage />} />

          <Route path="/dashboard/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <DashboardLayout />
              </RequireAuth>
            }
          >
            <Route index element={<Overview />} />
            <Route path="orcamentos" element={<BudgetsPage />} />
            <Route path="clientes" element={<ClientsPage />} />
            <Route path="projetos" element={<ProjectsPage />} />
            <Route path="servicos" element={<ServicesPage />} />
            <Route path="mensagens" element={<MessagesPage />} />
            <Route path="configuracoes" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
