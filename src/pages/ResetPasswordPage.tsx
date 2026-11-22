import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
export default function ResetPasswordPage() {
  const [recovery, setRecovery] = useState(new URLSearchParams(window.location.hash.slice(1)).get("type") === "recovery");
  const [password, setPassword] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange(event => { if (event === "PASSWORD_RECOVERY") setRecovery(true); });
    return () => data.subscription.unsubscribe();
  }, []);
  return <main className="builder-theme grid min-h-dvh place-items-center bg-background px-5 text-foreground">
    <form className="w-full max-w-sm space-y-5" onSubmit={async event => {
      event.preventDefault(); if (!recovery || busy) return;
      setBusy(true);
      const { error } = await supabase.auth.updateUser({ password });
      setBusy(false); setNotice(error ? error.message : "Senha atualizada."); setDone(!error);
    }}>
      <p className="text-sm text-primary">WH Studio AI</p><h1 className="text-3xl">Nova senha</h1>
      {!recovery && <p role="alert" className="text-sm text-muted-foreground">Abra o link recebido por e-mail para redefinir sua senha.</p>}
      {recovery && !done && <><label className="grid gap-2 text-sm">Senha nova<Input required minLength={8} type="password" autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)} /></label><Button className="w-full" disabled={busy}>{busy ? "Salvando…" : "Salvar senha"}</Button></>}
      {notice && <p role="status">{notice}</p>}
      <Button variant="link" asChild><Link to="/ai">Voltar à WH Studio AI</Link></Button>
    </form>
  </main>;
}