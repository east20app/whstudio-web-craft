import { Navigate } from "react-router-dom";
import { useAuth } from "./store";

export const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground text-sm">Carregando…</div>
      </div>
    );
  }
  if (!user) return <Navigate to="/dashboard/login" replace />;
  if ((user.email ?? "").toLowerCase() !== "whgamersc@gmail.com") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="card-dark p-8 max-w-md text-center">
          <h2 className="text-xl font-bold font-display mb-2">Acesso restrito</h2>
          <p className="text-sm text-muted-foreground">
            Apenas o administrador da WH Studio pode acessar este painel.
          </p>
        </div>
      </div>
    );
  }
  return children;
};
