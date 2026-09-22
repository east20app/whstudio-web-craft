import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useSettings } from "./store";
import { toast } from "sonner";
import { Save, Wrench } from "lucide-react";

const Field = ({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) => (
  <div className="grid md:grid-cols-[200px_1fr] gap-2 md:gap-6 py-5 border-t border-border first:border-t-0">
    <div>
      <Label className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{label}</Label>
      {hint && <p className="text-xs text-muted-foreground/70 mt-1.5 leading-relaxed">{hint}</p>}
    </div>
    <div className="space-y-2">{children}</div>
  </div>
);

const SettingsPage = () => {
  const { settings, saveSettings } = useSettings();
  const [form, setForm] = useState(settings);

  useEffect(() => setForm(settings), [settings]);

  const save = async () => {
    const ok = await saveSettings(form);
    if (ok) toast.success("Configurações salvas");
    else toast.error("Erro ao salvar");
  };

  return (
    <div className="max-w-3xl space-y-8">
      <header>
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Sys / Config</p>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight mt-2">Configurações</h2>
      </header>

      <section className="border border-border bg-card/40 px-5 md:px-6">
        <div className="pt-5 flex items-center gap-2">
          <Wrench className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Manutenção</p>
        </div>

        <Field
          label="Modo manutenção"
          hint="Ligado, visitantes veem apenas uma tela de manutenção. O painel admin continua acessível."
        >
          <div className="flex items-center gap-3">
            <Switch
              checked={form.maintenanceMode}
              onCheckedChange={(v) => setForm({ ...form, maintenanceMode: v })}
              aria-label="Ativar modo manutenção"
            />
            <span className="text-sm font-medium">
              {form.maintenanceMode ? "Site em manutenção para visitantes" : "Site normal, no ar"}
            </span>
          </div>
        </Field>

        <Field label="Mensagem exibida" hint="Texto mostrado na tela de manutenção.">
          <Textarea
            rows={3}
            value={form.maintenanceMessage}
            onChange={(e) => setForm({ ...form, maintenanceMessage: e.target.value })}
            placeholder="Ex: Estamos atualizando o site. Voltamos logo."
          />
        </Field>

        <Field label="Previsão de retorno" hint="Texto livre, aparece como 'Previsão'.">
          <Input
            value={form.maintenanceEta}
            onChange={(e) => setForm({ ...form, maintenanceEta: e.target.value })}
            placeholder="Ex: Voltamos em breve"
          />
        </Field>
      </section>

      <section className="border border-border bg-card/40 px-5 md:px-6">
        <div className="pt-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Site</p>
        </div>

        <Field label="Disponibilidade" hint="Desligue quando não estiver pegando projetos novos. Um aviso aparece no topo do site.">
          <div className="flex items-center gap-3">
            <Switch
              checked={form.acceptingProjects}
              onCheckedChange={(v) => setForm({ ...form, acceptingProjects: v })}
              aria-label="Aceitando novos projetos"
            />
            <span className="text-sm font-medium">
              {form.acceptingProjects ? "Aceitando novos projetos" : "Fila fechada — não estamos pegando projetos"}
            </span>
          </div>
          {!form.acceptingProjects && (
            <Textarea
              rows={3}
              value={form.availabilityNote}
              onChange={(e) => setForm({ ...form, availabilityNote: e.target.value })}
              placeholder="Ex: Agenda cheia até setembro. Manda mensagem que eu te aviso quando abrir vaga."
            />
          )}
        </Field>

        <Field label="Nome do site">
          <Input value={form.siteName} onChange={(e) => setForm({ ...form, siteName: e.target.value })} />
        </Field>
        <Field label="WhatsApp" hint="Formato internacional, sem espaços.">
          <Input
            value={form.whatsapp}
            onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
            placeholder="5584988766134"
            className="font-mono"
          />
        </Field>
        <Field label="Link do Discord">
          <Input value={form.discordLink} onChange={(e) => setForm({ ...form, discordLink: e.target.value })} />
        </Field>
        <Field label="Texto do footer">
          <Input value={form.footerText} onChange={(e) => setForm({ ...form, footerText: e.target.value })} />
        </Field>
        <Field label="Autor">
          <Input value={form.authorName} onChange={(e) => setForm({ ...form, authorName: e.target.value })} />
        </Field>

        <div className="py-5 border-t border-border">
          <Button onClick={save}>
            <Save className="w-4 h-4 mr-2" aria-hidden="true" /> Salvar
          </Button>
        </div>
      </section>
    </div>
  );
};

export default SettingsPage;
