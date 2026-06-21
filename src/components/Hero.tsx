import { motion } from "framer-motion";
import { MessageCircle, Zap, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { whatsappLink, discordLink } from "@/config/site";

const DiscordIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.317 4.369A19.79 19.79 0 0 0 16.558 3a14.66 14.66 0 0 0-.642 1.318 18.27 18.27 0 0 0-5.487 0A12.6 12.6 0 0 0 9.785 3a19.74 19.74 0 0 0-3.76 1.37C2.318 9.788 1.408 15.07 1.86 20.275a19.94 19.94 0 0 0 6.073 3.062 14.66 14.66 0 0 0 1.298-2.103 12.83 12.83 0 0 1-2.044-.974c.171-.124.339-.255.5-.39a14.27 14.27 0 0 0 12.629 0c.163.135.33.266.501.39-.65.385-1.336.713-2.046.975a14.6 14.6 0 0 0 1.297 2.102 19.85 19.85 0 0 0 6.073-3.062c.532-6.027-.91-11.262-3.824-15.906ZM9.49 17.155c-1.207 0-2.198-1.108-2.198-2.466 0-1.358.974-2.466 2.198-2.466 1.225 0 2.215 1.108 2.198 2.466 0 1.358-.973 2.466-2.198 2.466Zm5.02 0c-1.207 0-2.198-1.108-2.198-2.466 0-1.358.974-2.466 2.198-2.466 1.225 0 2.215 1.108 2.198 2.466 0 1.358-.973 2.466-2.198 2.466Z" />
  </svg>
);

const Hero = () => (
  <section className="relative min-h-screen flex items-center overflow-hidden pt-24 pb-16">
    {/* Grid background sutil — substitui os "orbs" genéricos */}
    <div
      className="absolute inset-0 pointer-events-none opacity-[0.04]"
      style={{
        backgroundImage:
          "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)",
        backgroundSize: "56px 56px",
        maskImage: "radial-gradient(ellipse 80% 60% at 50% 30%, black 40%, transparent 100%)",
        WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 30%, black 40%, transparent 100%)",
      }}
    />

    <div className="container relative z-10">
      <div className="grid lg:grid-cols-[1.05fr_1fr] gap-12 lg:gap-16 items-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          {/* Linha fina com localidade — sem pill, sem ícone Sparkles */}
          <div className="flex items-center gap-3 mb-8 eyebrow text-muted-foreground">
            <span className="w-8 h-px bg-primary" />
            <span>Walmry Netto · RN, Brasil</span>
          </div>

          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.05] mb-6">
            Seu negócio no ar em 15 dias.{" "}
            <span className="text-gradient">Código escrito à mão.</span>
          </h1>

          <p className="text-base md:text-lg text-muted-foreground mb-8 max-w-xl">
            Site, bot de Discord, sistema interno, API, dashboard — o que estiver na sua cabeça, a gente coloca no ar. Direto com quem desenvolve, sem repassar pra ninguém.
          </p>

          <div className="flex flex-wrap gap-3">
            <Button size="lg" className="glow" asChild>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-4 h-4 mr-1" /> Falar no WhatsApp
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href={discordLink()} target="_blank" rel="noopener noreferrer">
                <DiscordIcon className="w-4 h-4" /> Entrar no Discord
              </a>
            </Button>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-10 text-sm text-muted-foreground">
            {["15 dias úteis", "WhatsApp direto", "Código do zero"].map((b) => (
              <div key={b} className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                <span>{b}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Terminal com código real — substitui o dashboard fictício */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="hidden lg:block"
        >
          <div className="relative">
            <div className="rounded-xl border border-border bg-[hsl(270_25%_7%)] shadow-2xl overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-[hsl(270_25%_5%)]">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                <div className="ml-3 font-mono text-[11px] text-muted-foreground">
                  ~/projetos/copa-ativa — main
                </div>
              </div>

              <pre className="font-mono text-[13px] leading-relaxed p-5 overflow-x-auto">
{`// torneio.ts — chaveamento ao vivo
import { supabase } from "@/db";

`}<span className="text-primary">export async function</span>{` `}<span className="text-emerald-300">listarClassificacao</span>{`() {
  `}<span className="text-primary">const</span>{` { data } = `}<span className="text-primary">await</span>{` supabase
    .from(`}<span className="text-amber-300">"equipes"</span>{`)
    .select(`}<span className="text-amber-300">"nome, pontos, jogos"</span>{`)
    .order(`}<span className="text-amber-300">"pontos"</span>{`, { ascending: `}<span className="text-rose-300">false</span>{` });

  `}<span className="text-primary">return</span>{` data;
}`}
              </pre>

              <div className="border-t border-border px-5 py-3 flex items-center justify-between bg-[hsl(270_25%_6%)]">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <span className="font-mono text-[11px] text-muted-foreground">deploy ok · 12s</span>
                </div>
                <span className="font-mono text-[11px] text-muted-foreground">vercel.app</span>
              </div>
            </div>

            {/* Badge de projeto real — não promessa fictícia */}
            <div className="absolute -bottom-5 -left-4 right-8 rounded-lg border border-border bg-card px-4 py-3 shadow-xl flex items-center gap-3">
              <div className="w-9 h-9 rounded-md bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="eyebrow text-muted-foreground mb-0.5">Último projeto</p>
                <p className="text-sm font-semibold truncate">Copa Ativa Telecom · entregue em 12 dias</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default Hero;
