import { useState, FormEvent, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn, useAuth } from "./store";
import { toast } from "sonner";
import { Lock } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAccess } from "./useAdminAccess";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [signupAvailable, setSignupAvailable] = useState(false);
  const [creating, setCreating] = useState(false);
  const [confirmation, setConfirmation] = useState(false);
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { isAdmin, checking } = useAdminAccess(user?.id);

  useEffect(() => {
    supabase.rpc("admin_signup_available").then(({ data, error }) => {
      setSignupAvailable(!error && data === true);
    });
  }, []);

  useEffect(() => {
    if (!loading && !checking && user && isAdmin) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, loading, checking, isAdmin, navigate]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Preencha e-mail e senha");
      return;
    }
    setSubmitting(true);
    if (creating) {
      const { data: available, error: availabilityError } = await supabase.rpc("admin_signup_available");
      if (availabilityError || available !== true) {
        setSignupAvailable(false);
        setCreating(false);
        setSubmitting(false);
        toast.error("A conta administradora já foi criada. Entre com sua conta.");
        return;
      }
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(), password,
        options: { emailRedirectTo: `${window.location.origin}/dashboard/login` },
      });
      setSubmitting(false);
      if (error) { toast.error(error.message); return; }
      setSignupAvailable(false);
      setCreating(false);
      setConfirmation(!data.session);
      if (!data.session) toast.success("Confira seu e-mail para confirmar a conta.");
      return;
    }
    const error = await signIn(email.trim(), password);
    setSubmitting(false);

    if (error) {
      toast.error(/invalid login/i.test(error) ? "E-mail ou senha incorretos" : error);
      return;
    }
    const { data: admin, error: roleError } = await supabase.rpc("is_admin");
    if (roleError || admin !== true) {
      await supabase.auth.signOut();
      toast.error("Esta conta não é administradora.");
      return;
    }
    navigate("/dashboard", { replace: true });
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-8 px-4 py-12 bg-background">
      <Link to="/" className="studio-brand" aria-label="WH Studio — página inicial"><BrandLogo className="h-10 w-[156px]" /></Link>
      <form onSubmit={onSubmit} className="w-full max-w-md card-dark p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full border border-primary/30 bg-primary/10 flex items-center justify-center">
            <Lock className="w-5 h-5 text-primary" aria-hidden="true" />
          </div>
          <div>
            <h1 className="font-display text-2xl">{creating ? "Criar conta administradora" : "Acesse o painel"}</h1>
            <p className="text-xs text-muted-foreground">WH Studio · acesso restrito</p>
          </div>
        </div>

        {confirmation && <p role="status" className="text-sm text-muted-foreground mb-4">Confirme sua conta pelo link enviado ao seu e-mail antes de entrar.</p>}

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              name="email"
              spellCheck={false}
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
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete={creating ? "new-password" : "current-password"}
              minLength={creating ? 8 : 6}
              required
            />
          </div>
        </div>

        <Button type="submit" className="w-full mt-6" disabled={submitting}>
          {submitting ? "Aguarde…" : creating ? "Criar conta administradora" : "Entrar no painel"}
        </Button>
        {signupAvailable && <Button type="button" variant="outline" className="w-full mt-3" disabled={submitting} onClick={() => setCreating(!creating)}>{creating ? "Já tenho conta" : "Criar primeira conta admin"}</Button>}
      </form>
      <Link to="/" className="text-sm text-muted-foreground transition-colors hover:text-primary">← Voltar para o site</Link>
    </main>
  );
};

export default LoginPage;
