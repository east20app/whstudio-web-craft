import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSettings } from "./store";
import { toast } from "sonner";
import { Save } from "lucide-react";

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
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold font-display">Configurações</h2>
        <p className="text-muted-foreground text-sm mt-1">Ajuste as informações principais do site.</p>
      </div>

      <div className="card-dark p-6 space-y-4">
        <div className="space-y-1.5">
          <Label>Nome do site</Label>
          <Input value={form.siteName} onChange={(e) => setForm({ ...form, siteName: e.target.value })} />
        </div>
        <div className="space-y-1.5">
          <Label>Número do WhatsApp</Label>
          <Input
            value={form.whatsapp}
            onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
            placeholder="5584988766134"
          />
          <p className="text-xs text-muted-foreground">Formato internacional sem espaços.</p>
        </div>
        <div className="space-y-1.5">
          <Label>Link do Discord</Label>
          <Input value={form.discordLink} onChange={(e) => setForm({ ...form, discordLink: e.target.value })} />
        </div>
        <div className="space-y-1.5">
          <Label>Texto do footer</Label>
          <Input value={form.footerText} onChange={(e) => setForm({ ...form, footerText: e.target.value })} />
        </div>
        <div className="space-y-1.5">
          <Label>Nome do autor</Label>
          <Input value={form.authorName} onChange={(e) => setForm({ ...form, authorName: e.target.value })} />
        </div>

        <div className="pt-2">
          <Button onClick={save}>
            <Save className="w-4 h-4 mr-1" /> Salvar configurações
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
