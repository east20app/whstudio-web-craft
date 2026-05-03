import { Link } from "react-router-dom";
import { FileText, Users, Briefcase, MessageSquare, MessageCircle, Hash, TrendingUp } from "lucide-react";
import StatCard from "./components/StatCard";
import StatusPill from "./components/StatusPill";
import { useBudgets, useClients, useProjects, useMessages } from "./store";

const stageTone = {
  planejamento: "gray" as const,
  desenvolvimento: "blue" as const,
  revisao: "yellow" as const,
  entregue: "green" as const,
};
const stageLabel = {
  planejamento: "Planejamento",
  desenvolvimento: "Desenvolvimento",
  revisao: "Revisão",
  entregue: "Entregue",
};

const Overview = () => {
  const [budgets] = useBudgets();
  const [clients] = useClients();
  const [projects] = useProjects();
  const [messages] = useMessages();

  const activeClients = clients.filter((c) => c.status === "ativo").length;
  const ongoing = projects.filter((p) => p.stage !== "entregue").length;
  const unread = messages.filter((m) => !m.read).length;

  // métricas mock
  const whatsappConversions = budgets.filter((b) => b.status === "aprovado").length * 3 + 12;
  const discordClicks = 84;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold">Visão Geral</h2>
        <p className="text-muted-foreground text-sm mt-1">Resumo do seu negócio em tempo real.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <Link to="/dashboard/orcamentos">
          <StatCard label="Orçamentos" value={budgets.length} icon={FileText} trend="+12% no mês" />
        </Link>
        <Link to="/dashboard/clientes">
          <StatCard label="Clientes ativos" value={activeClients} icon={Users} trend={`${clients.length} no total`} />
        </Link>
        <Link to="/dashboard/projetos">
          <StatCard label="Projetos em andamento" value={ongoing} icon={Briefcase} />
        </Link>
        <Link to="/dashboard/mensagens">
          <StatCard label="Mensagens" value={messages.length} icon={MessageSquare} trend={`${unread} não lidas`} />
        </Link>
        <StatCard label="Conversões WhatsApp" value={whatsappConversions} icon={MessageCircle} trend="+8% no mês" />
        <StatCard label="Cliques no Discord" value={discordClicks} icon={Hash} trend="+22% no mês" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card-dark p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Últimos orçamentos</h3>
            <Link to="/dashboard/orcamentos" className="text-xs text-primary hover:underline">
              Ver todos
            </Link>
          </div>
          <ul className="divide-y divide-border">
            {budgets.slice(0, 5).map((b) => (
              <li key={b.id} className="py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{b.client}</p>
                  <p className="text-xs text-muted-foreground truncate">{b.service}</p>
                </div>
                <StatusPill
                  tone={
                    b.status === "novo"
                      ? "blue"
                      : b.status === "em-analise"
                      ? "yellow"
                      : b.status === "aprovado"
                      ? "green"
                      : "red"
                  }
                >
                  {b.status === "em-analise" ? "Em análise" : b.status[0].toUpperCase() + b.status.slice(1)}
                </StatusPill>
              </li>
            ))}
          </ul>
        </div>

        <div className="card-dark p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Status dos projetos</h3>
            <Link to="/dashboard/projetos" className="text-xs text-primary hover:underline">
              Ver todos
            </Link>
          </div>
          <ul className="divide-y divide-border">
            {projects.slice(0, 5).map((p) => (
              <li key={p.id} className="py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{p.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{p.client}</p>
                </div>
                <StatusPill tone={stageTone[p.stage]}>{stageLabel[p.stage]}</StatusPill>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="card-dark p-6">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-primary" />
          <h3 className="font-semibold">Performance dos últimos 12 períodos</h3>
        </div>
        <div className="flex items-end gap-2 h-40">
          {[40, 60, 50, 70, 55, 80, 65, 90, 75, 88, 82, 95].map((h, i) => (
            <div key={i} className="flex-1 flex flex-col justify-end">
              <div
                className="w-full bg-gradient-to-t from-primary to-primary/40 rounded-t-md"
                style={{ height: `${h}%` }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Overview;
