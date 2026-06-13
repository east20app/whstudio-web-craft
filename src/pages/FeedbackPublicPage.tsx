import { useEffect, useState, FormEvent } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Star, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type State =
  | { kind: "loading" }
  | { kind: "invalid" }
  | { kind: "submitted" }
  | {
      kind: "ready";
      id: string;
      projectName: string;
      clientName: string;
    };

const FeedbackPublicPage = () => {
  const { token } = useParams<{ token: string }>();
  const [state, setState] = useState<State>({ kind: "loading" });
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [testimonial, setTestimonial] = useState("");
  const [allow, setAllow] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      if (!token) return setState({ kind: "invalid" });
      const { data, error } = await supabase
        .from("feedbacks")
        .select("id, project_name, client_name, status")
        .eq("token", token)
        .maybeSingle();
      if (error || !data) return setState({ kind: "invalid" });
      if (data.status !== "released") return setState({ kind: "invalid" });
      setState({
        kind: "ready",
        id: data.id,
        projectName: data.project_name,
        clientName: data.client_name,
      });
      setName(data.client_name ?? "");
    })();
  }, [token]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (state.kind !== "ready") return;
    if (!name.trim()) return toast.error("Informe seu nome");
    if (!rating) return toast.error("Escolha uma nota de 1 a 5 estrelas");
    if (!testimonial.trim() || testimonial.trim().length < 10)
      return toast.error("Escreva um depoimento (mínimo 10 caracteres)");

    setSubmitting(true);
    const { error } = await supabase
      .from("feedbacks")
      .update({
        client_name: name.trim().slice(0, 120),
        rating,
        testimonial: testimonial.trim().slice(0, 1000),
        allow_publish: allow,
        status: "received",
        submitted_at: new Date().toISOString(),
      })
      .eq("id", state.id)
      .eq("status", "released");
    setSubmitting(false);

    if (error) return toast.error("Não foi possível enviar. Tente novamente.");
    setState({ kind: "submitted" });
    toast.success("Feedback enviado. Obrigado!");
  };

  return (
    <>
      <Header />
      <main className="min-h-screen pt-28 pb-20 px-4 bg-background relative overflow-hidden">
        <div className="relative max-w-xl mx-auto">
          {state.kind === "loading" && (
            <div className="card-dark p-8 text-center text-sm text-muted-foreground">
              Carregando…
            </div>
          )}

          {state.kind === "invalid" && (
            <div className="card-dark p-8 text-center">
              <h1 className="text-2xl font-bold font-display mb-2">Link inválido</h1>
              <p className="text-sm text-muted-foreground">
                Este link de feedback não está disponível ou já foi utilizado.
              </p>
            </div>
          )}

          {state.kind === "submitted" && (
            <div className="card-dark p-8 text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-7 h-7 text-emerald-300" />
              </div>
              <h1 className="text-2xl font-bold font-display mb-2">Obrigado pelo feedback!</h1>
              <p className="text-sm text-muted-foreground">
                Sua avaliação foi recebida com sucesso pela WH Studio.
              </p>
            </div>
          )}

          {state.kind === "ready" && (
            <form onSubmit={onSubmit} className="card-dark p-8 space-y-5">
              <div>
                <p className="eyebrow text-primary mb-3">
                  Avaliação de projeto
                </p>
                <h1 className="text-2xl font-bold font-display">{state.projectName || "Seu projeto"}</h1>
                <p className="text-sm text-muted-foreground">
                  Conte como foi sua experiência com a WH Studio.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Seu nome</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} maxLength={120} required />
              </div>

              <div className="space-y-2">
                <Label>Nota</Label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => {
                    const filled = (hover || rating) >= n;
                    return (
                      <button
                        type="button"
                        key={n}
                        onMouseEnter={() => setHover(n)}
                        onMouseLeave={() => setHover(0)}
                        onClick={() => setRating(n)}
                        className="p-1"
                        aria-label={`${n} estrelas`}
                      >
                        <Star
                          className={`w-7 h-7 transition-colors ${
                            filled ? "text-yellow-300 fill-yellow-300" : "text-muted-foreground"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="testimonial">Depoimento</Label>
                <Textarea
                  id="testimonial"
                  rows={5}
                  value={testimonial}
                  onChange={(e) => setTestimonial(e.target.value)}
                  maxLength={1000}
                  placeholder="Como foi trabalhar com a WH Studio? O que você mais gostou?"
                  required
                />
              </div>

              <label className="flex items-start gap-3 text-sm text-muted-foreground cursor-pointer">
                <Checkbox
                  checked={allow}
                  onCheckedChange={(v) => setAllow(v === true)}
                  className="mt-0.5"
                />
                <span>Autorizo a WH Studio a exibir este depoimento no site.</span>
              </label>

              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? "Enviando…" : "Enviar feedback"}
              </Button>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default FeedbackPublicPage;
