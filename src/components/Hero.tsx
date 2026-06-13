import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DiscordIcon } from "@/components/icons/DiscordIcon";
import { discordLink, whatsappLink } from "@/config/site";

const trustBadges = [
  { label: "Sem vendedor no meio", desc: "Você fala com quem abre o editor e mexe no banco." },
  { label: "Escopo fechado", desc: "Antes de começar, você sabe o que entra e o que fica fora." },
  { label: "Suporte depois da entrega", desc: "Publicou e deu dúvida? Eu não sumo." },
];

const commits = [
  { hash: "a3f2c1d", msg: "feat: tabela de classificação ao vivo" },
  { hash: "9e81ba2", msg: "feat: inscrição de equipes com Supabase" },
  { hash: "3c47d9f", msg: "fix: ranking por saldo de gols" },
  { hash: "d12e8a1", msg: "feat: painel admin com resultados" },
  { hash: "7b903cc", msg: "init: projeto Copa Ativa Telecom" },
];

const Hero = () => (
  <section className="relative min-h-screen flex items-center overflow-hidden pt-24 pb-16">
    <div className="container relative z-10">
      <div className="grid lg:grid-cols-[1.08fr_0.92fr] gap-12 lg:gap-16 items-center">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
          <p className="eyebrow text-primary mb-5">Walmry Netto · RN, Brasil</p>

          <h1 className="heading-display text-4xl md:text-5xl lg:text-6xl mb-6">
            Seu sistema parou de ser planilha.
            <br />
            <span className="text-gradient">Agora ele trabalha.</span>
          </h1>

          <p className="text-base md:text-lg text-muted-foreground mb-8 max-w-xl">
            Eu crio site, sistema, bot e automação para tirar tarefa chata da sua mão.
            Sem reunião infinita. Sem promessa bonita. Código funcionando e alguém responsável por ele.
          </p>

          <div className="flex flex-wrap gap-3">
            <Button size="lg" asChild>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-4 h-4 mr-1" /> Falar no WhatsApp
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href={discordLink()} target="_blank" rel="noopener noreferrer">
                <DiscordIcon className="w-4 h-4 mr-1" /> Entrar no Discord
              </a>
            </Button>
          </div>

          <div className="grid sm:grid-cols-3 gap-5 mt-10">
            {trustBadges.map((b) => (
              <div key={b.label} className="pl-4 border-l border-primary/40">
                <p className="text-xs font-semibold text-foreground">{b.label}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{b.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="hidden lg:block relative"
        >
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 bg-secondary border-b border-border">
              <div className="w-2.5 h-2.5 rounded-full bg-destructive/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-accent2/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-primary/70" />
              <span className="ml-3 text-[11px] font-mono-label text-muted-foreground">
                ~/projetos/copa-ativa - zsh
              </span>
            </div>

            <div className="p-5 font-mono-label text-[12px] leading-relaxed space-y-1">
              <p className="text-muted-foreground">
                <span className="text-primary">walmry@wh-studio</span>
                <span className="text-muted-foreground/60">:</span>
                <span className="text-accent2">~/projetos/copa-ativa</span>
                <span className="text-foreground/60"> $</span>
              </p>
              <p className="text-foreground/80">git log --oneline -5</p>

              <div className="space-y-1 mt-2 text-[11px]">
                {commits.map((c) => (
                  <p key={c.hash}>
                    <span className="text-primary/70">{c.hash}</span>{" "}
                    <span className="text-muted-foreground">{c.msg}</span>
                  </p>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-muted-foreground/60 text-[10px] mb-1">// código real, prazo real, suporte real</p>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold text-foreground">Copa Ativa Telecom</p>
                    <p className="text-[10px] text-muted-foreground">Campeonato de Futsal · Serra Caiada, RN</p>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary/10 border border-primary/20">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span className="text-[10px] font-medium text-primary">Online</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute -bottom-4 -left-4 px-3 py-2 rounded-md bg-background border border-border text-xs font-semibold flex items-center gap-2">
            <span className="text-primary">OK</span>
            <span className="text-foreground/80 font-display">70+ projetos entregues</span>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default Hero;
