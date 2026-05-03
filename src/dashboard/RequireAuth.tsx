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
  return children;
};
