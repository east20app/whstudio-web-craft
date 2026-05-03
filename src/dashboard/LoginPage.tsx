import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "./store";
import { toast } from "sonner";
import { Lock } from "lucide-react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (login(email, pass)) {
      toast.success("Login realizado com sucesso");
      navigate("/dashboard");
    } else {
      setError("Acesso restrito");
      toast.error("Acesso restrito");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(271_91%_65%/0.15),transparent_50%)] pointer-events-none" />
      <form onSubmit={onSubmit} className="relative w-full max-w-md card-dark p-8 glow">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center">
            <Lock className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Acesso administrativo</h1>
            <p className="text-xs text-muted-foreground">Painel WH Studio</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(null); }}
              placeholder="seu@email.com"
              autoFocus
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pass">Senha</Label>
            <Input
              id="pass"
              type="password"
              value={pass}
              onChange={(e) => { setPass(e.target.value); setError(null); }}
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        {error && (
          <p className="mt-4 text-sm text-red-400 text-center" role="alert">
            {error}
          </p>
        )}

        <Button type="submit" className="w-full mt-6 glow">
          Entrar no painel
        </Button>

        <p className="text-xs text-muted-foreground text-center mt-6">
          Área restrita — apenas administradores autorizados.
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
