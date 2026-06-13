import { Trash2, MessageCircle, Mail, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import EmptyState from "./components/EmptyState";
import { useMessages } from "./store";
import { toast } from "sonner";

const MessagesPage = () => {
  const { data: messages, loading, markRead, removeMessage } = useMessages();

  const remove = async (id: string) => {
    await removeMessage(id);
    toast.success("Mensagem removida");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold font-display">Mensagens</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Mensagens recebidas pelo formulário do site.
        </p>
      </div>

      {loading ? (
        <div className="card-dark p-8 text-center text-sm text-muted-foreground">Carregando…</div>
      ) : messages.length === 0 ? (
        <EmptyState
          icon={<Mail className="w-5 h-5" />}
          title="Nenhuma mensagem ainda"
          description="As mensagens enviadas pelo formulário de contato aparecerão aqui."
        />
      ) : (
        <div className="space-y-4">
          {messages.map((m) => (
            <div key={m.id} className={`card-dark p-5 ${!m.read ? "border-primary/40" : ""}`}>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold">{m.name}</p>
                    {!m.read && (
                      <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/30">
                        Nova
                      </span>
                    )}
                  </div>
                  <a
                    href={`mailto:${m.email}`}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    {m.email}
                  </a>
                </div>
                <span className="text-xs text-muted-foreground shrink-0">
                  {new Date(m.date).toLocaleDateString("pt-BR")}
                </span>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed mb-4 whitespace-pre-wrap">
                {m.message}
              </p>

              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" asChild>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(
                      `Olá ${m.name}, recebemos sua mensagem...`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="w-3.5 h-3.5 mr-1" /> Responder no WhatsApp
                  </a>
                </Button>
                <Button size="sm" variant="ghost" asChild>
                  <a href={`mailto:${m.email}`}>
                    <Mail className="w-3.5 h-3.5 mr-1" /> E-mail
                  </a>
                </Button>
                {!m.read && (
                  <Button size="sm" variant="ghost" onClick={() => markRead(m.id)}>
                    <Check className="w-3.5 h-3.5 mr-1" /> Marcar como lida
                  </Button>
                )}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="ghost" className="text-red-400 ml-auto">
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Excluir mensagem?</AlertDialogTitle>
                      <AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => remove(m.id)}>Excluir</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MessagesPage;
