import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export default function BuilderAccess({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (busy) return;
    setBusy(true); setNotice("");
    try {
      if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
        if (error) throw error;
        setNotice("Confira seu e-mail para redefinir a senha.");
      } else if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/ai` } });
        if (error) throw error;
        if (data.session) onOpenChange(false);
        else setNotice("Confira seu e-mail e confirme sua conta antes de entrar.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onOpenChange(false);
      }
      setPassword("");
    } catch (error) { setNotice(error instanceof Error ? error.message : "Não foi possível acessar a conta."); }
    finally { setBusy(false); }
  }
  async function google() {
    setBusy(true); setNotice("");
    try {
      const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: `${window.location.origin}/ai` });
      if (result.error) throw result.error;
      if (!result.redirected) onOpenChange(false);
    } catch { setNotice("Não foi possível entrar com o Google. Tente novamente."); }
    finally { setBusy(false); }
  }
  return <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent closeLabel="Fechar acesso" className="builder-theme max-h-[90dvh] w-[calc(100%-32px)] max-w-md overflow-auto rounded-md">
      <DialogTitle>{mode === "signup" ? "Criar sua conta" : mode === "forgot" ? "Recuperar senha" : "Entrar na WH Studio AI"}</DialogTitle>
      <DialogDescription>Seus projetos, versões e créditos em uma só conta.</DialogDescription>
      {mode !== "forgot" && <>
        <Button variant="outline" className="builder-google w-full" disabled={busy} onClick={google}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"/><path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"/><path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"/><path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"/></svg>
          Continuar com Google
        </Button>
        <p className="text-center text-xs text-muted-foreground">ou com e-mail</p>
      </>}
      <form className="grid gap-4" onSubmit={submit}>
        <label className="grid gap-2 text-sm">E-mail<Input type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} /></label>
        {mode !== "forgot" && <label className="grid gap-2 text-sm">Senha<Input type="password" autoComplete={mode === "signup" ? "new-password" : "current-password"} minLength={8} required value={password} onChange={e => setPassword(e.target.value)} /></label>}
        <Button disabled={busy}>{busy ? "Aguarde…" : mode === "signup" ? "Criar conta" : mode === "forgot" ? "Enviar link de recuperação" : "Entrar"}</Button>
      </form>
      {notice && <p role="status" className="break-words text-sm text-primary">{notice}</p>}
      <div className="flex flex-wrap justify-between gap-2">
        <Button variant="link" size="sm" onClick={() => { setMode(mode === "signup" ? "login" : "signup"); setNotice(""); }}>{mode === "signup" ? "Já tenho conta" : "Criar conta"}</Button>
        <Button variant="ghost" size="sm" onClick={() => { setMode(mode === "forgot" ? "login" : "forgot"); setNotice(""); }}>{mode === "forgot" ? "Voltar ao acesso" : "Esqueci minha senha"}</Button>
      </div>
    </DialogContent>
  </Dialog>;
}