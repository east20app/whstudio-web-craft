import { useState, FormEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn, useAuth } from "./store";
import { toast } from "sonner";
import { Lock } from "lucide-react";

const OWNER_EMAIL = "whgamersc@gmail.com";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user && (user.email ?? "").toLowerCase() === OWNER_EMAIL) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, loading, navigate]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Preencha e-mail e senha");
      return;
    }
    if (email.trim().toLowerCase() !== OWNER_EMAIL) {
      toast.error("Acesso restrito ao administrador");
      return;
    }

    setSubmitting(true);
    const error = await signIn(email.trim(), password);
    setSubmitting(false);

    if (error) {
      toast.error(/invalid login/i.test(error) ? "E-mail ou senha incorretos" : error);
      return;
    }
    toast.success("Login realizado com sucesso");
    navigate("/dashboard", { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background relative overflow-hidden">
      <form onSubmit={onSubmit} className="relative w-full max-w-md card-dark p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center">
            <Lock className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-display">Acesse o painel</h1>
            <p className="text-xs text-muted-foreground">WH Studio · acesso restrito</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              autoComplete="email"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              minLength={6}
              required
            />
          </div>
        </div>

        <Button type="submit" className="w-full mt-6" disabled={submitting}>
          {submitting ? "Aguarde…" : "Entrar no painel"}
        </Button>
      </form>
    </div>
  );
};

export default LoginPage;
