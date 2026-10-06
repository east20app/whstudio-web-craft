import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { usePublicServices, toPublicService } from "@/hooks/usePublicServices";
import { services as configServices } from "@/config/site";
import { useOrcamentoAction } from "@/components/tickets/TicketChat";

const Services = () => {
  const live = usePublicServices();
  const list = live && live.length > 0 ? live : configServices.map(toPublicService);
  const { requestQuote } = useOrcamentoAction();
  return (
    <section id="servicos" className="section-premium py-20 md:py-28">
      <div className="container relative">
        <div className="mb-14 grid items-end gap-8 lg:grid-cols-12"><div className="lg:col-span-8"><p className="eyebrow mb-5">01 / O que desenvolvemos</p><h2 className="display-huge max-w-3xl text-4xl md:text-6xl">Seu negócio.<br /><em>Nossas soluções.</em></h2></div><p className="max-w-sm text-sm leading-relaxed text-muted-foreground lg:col-span-4">Da presença digital à operação da empresa. Design, desenvolvimento e integração em um só lugar.</p></div>
        <div className="border-t border-border">
          {list.map((service, index) => {
            const Icon = service.icon;
            return <motion.article key={service.key} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.35 }} className="service-row group grid items-start gap-5 border-b border-border py-7 md:grid-cols-12 md:items-center md:gap-8 md:py-9">
              <span className="num-label md:col-span-1">{String(index + 1).padStart(2, "0")}</span>
              <div className="flex items-center gap-4 md:col-span-4"><Icon className="h-6 w-6 shrink-0 text-primary" strokeWidth={1.5} aria-hidden="true" /><h3 className="text-2xl font-medium tracking-tight md:text-3xl">{service.title}</h3></div>
              <p className="max-w-lg text-sm leading-relaxed text-muted-foreground md:col-span-5">{service.desc}</p>
              <button type="button" onClick={() => requestQuote({ subject: `Serviço: ${service.title}`, prefill: `Quero um orçamento para: ${service.title}. ` })} className="service-row__action flex min-h-12 items-center gap-3 text-sm text-primary md:col-span-2 md:justify-self-end" aria-label={`Solicitar orçamento para ${service.title}`}><span className="md:sr-only">Solicitar orçamento</span><ArrowUpRight className="h-6 w-6" aria-hidden="true" /></button>
            </motion.article>;
          })}
        </div>
      </div>
    </section>
  );
};
export default Services;
