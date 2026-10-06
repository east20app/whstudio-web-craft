import { ArrowUpRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useOrcamentoAction } from "@/components/tickets/TicketChat";
const CTAFinal = () => {
  const settings = useSiteSettings();
  const { requestQuote } = useOrcamentoAction();
  return <section className="py-20 md:py-28"><div className="container"><div className="studio-cta grid items-end gap-10 border-y border-border py-12 lg:grid-cols-12"><div className="lg:col-span-8"><p className="eyebrow mb-6">Vamos desenvolver seu próximo passo.</p><h2 className="display-huge max-w-3xl text-4xl md:text-6xl">Seu projeto começa<br />com <em>uma conversa.</em></h2></div><div className="lg:col-span-4"><p className="mb-6 max-w-sm text-sm leading-relaxed text-muted-foreground">Conte o que sua empresa precisa. Vamos definir a solução, o escopo e o caminho até a entrega.</p><div className="flex flex-col gap-3"><Button className="h-12 justify-between px-5" onClick={() => requestQuote({ subject: "Projeto novo", prefill: "Quero iniciar um projeto. " })}>Solicitar orçamento <ArrowUpRight className="h-5 w-5" aria-hidden="true" /></Button><Button asChild variant="outline" className="h-12 justify-between px-5"><a href={settings.buildWhatsappLink()} target="_blank" rel="noopener noreferrer">Conversar pelo WhatsApp <MessageCircle className="h-4 w-4" aria-hidden="true" /></a></Button></div></div></div></div></section>;
};
export default CTAFinal;
