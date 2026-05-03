import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "./store";
import { toast } from "sonner";
import { Lock } from "lucide-react";

const LoginPage = () => {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const navigate = useNavigate();

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (login(user, pass)) {
      toast.success("Login realizado com sucesso");
      navigate("/dashboard");
    } else {
      toast.error("Credenciais inválidas");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(271_91%_65%/0.15),transparent_50%)] pointer-events-none" />
      <form
        onSubmit={onSubmit}
        className="relative w-full max-w-md card-dark p-8 glow"
      >
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
            <Label htmlFor="user">Usuário</Label>
            <Input id="user" value={user} onChange={(e) => setUser(e.target.value)} placeholder="admin" autoFocus />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pass">Senha</Label>
            <Input id="pass" type="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="••••••••" />
          </div>
        </div>

        <Button type="submit" className="w-full mt-6 glow">
          Entrar no painel
        </Button>

        <p className="text-xs text-muted-foreground text-center mt-6">
          Demo: <span className="font-mono text-foreground/80">admin / whstudio</span>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
