import { useState, FormEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { signIn, signUp, useAuth } from "./store";
import { toast } from "sonner";
import { Lock, UserPlus } from "lucide-react";

const LoginPage = () => {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) navigate("/dashboard", { replace: true });
  }, [user, loading, navigate]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Preencha e-mail e senha");
      return;
    }
    if (mode === "signup" && password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    setSubmitting(true);
    const error = mode === "signin" ? await signIn(email, password) : await signUp(email, password);
    setSubmitting(false);

    if (error) {
      const msg = /invalid login/i.test(error)
        ? "E-mail ou senha incorretos"
        : /already registered/i.test(error)
        ? "Este e-mail já está cadastrado"
        : error;
      toast.error(msg);
      return;
    }

    if (mode === "signup") {
      toast.success("Conta criada! Você já está logado.");
    } else {
      toast.success("Login realizado com sucesso");
    }
    navigate("/dashboard", { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(271_91%_65%/0.18),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,hsl(271_91%_65%/0.10),transparent_50%)] pointer-events-none" />

      <form onSubmit={onSubmit} className="relative w-full max-w-md card-dark p-8 glow">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center">
            {mode === "signin" ? (
              <Lock className="w-5 h-5 text-primary" />
            ) : (
              <UserPlus className="w-5 h-5 text-primary" />
            )}
          </div>
          <div>
            <h1 className="text-xl font-bold">
              {mode === "signin" ? "Acesse sua conta" : "Crie sua conta"}
            </h1>
            <p className="text-xs text-muted-foreground">Painel WH Studio</p>
          </div>
        </div>

        <Tabs value={mode} onValueChange={(v) => setMode(v as "signin" | "signup")} className="mb-6">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="signin">Entrar</TabsTrigger>
            <TabsTrigger value="signup">Cadastrar</TabsTrigger>
          </TabsList>
          <TabsContent value="signin" />
          <TabsContent value="signup" />
        </Tabs>

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
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              minLength={6}
              required
            />
            {mode === "signup" && (
              <p className="text-xs text-muted-foreground">Mínimo de 6 caracteres.</p>
            )}
          </div>
        </div>

        <Button type="submit" className="w-full mt-6 glow" disabled={submitting}>
          {submitting
            ? "Aguarde…"
            : mode === "signin"
            ? "Entrar no painel"
            : "Criar conta e entrar"}
        </Button>

        <p className="text-xs text-muted-foreground text-center mt-6">
          {mode === "signin" ? (
            <>
              Ainda não tem conta?{" "}
              <button
                type="button"
                onClick={() => setMode("signup")}
                className="text-primary hover:underline"
              >
                Cadastre-se
              </button>
            </>
          ) : (
            <>
              Já tem conta?{" "}
              <button
                type="button"
                onClick={() => setMode("signin")}
                className="text-primary hover:underline"
              >
                Faça login
              </button>
            </>
          )}
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
