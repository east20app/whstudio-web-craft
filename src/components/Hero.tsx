import { motion } from "framer-motion";
import { ArrowDown, ArrowUpRight, Check, MonitorSmartphone, SearchCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const Hero = () => {
  const settings = useSiteSettings();
  const whatsapp = settings.buildWhatsappLink("Olá! Quero conversar sobre um site profissional para minha empresa.");

  return (
    <section className="studio-hero relative isolate overflow-hidden">
      <div className="studio-hero__photo" aria-hidden="true">
        <img
          src="https://images.unsplash.com/photo-1520333789090-1afc82db536a?auto=format&fit=crop&w=1900&q=85"
          alt=""
          fetchPriority="high"
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="container relative z-10 pt-36 md:pt-40">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[10px] font-mono uppercase tracking-[.18em] text-white/65 md:text-xs">
          <span className="h-2 w-2 rounded-full bg-[#a8f05a]" />
          <span>Estúdio digital · Rio Grande do Norte</span>
          <span className="hidden text-white/30 sm:inline">/</span>
          <span className="hidden sm:inline">Atendimento em todo o Brasil</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          className="relative grid min-h-[590px] items-center gap-10 pb-20 pt-9 md:min-h-[620px] md:pt-12 lg:grid-cols-12"
        >
          <div className="relative z-10 max-w-3xl lg:col-span-8">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[.16em] text-[#b8f879]">Sites, sistemas e automações sob medida</p>
            <h1 className="max-w-[850px] font-display text-[clamp(3rem,7.2vw,6.4rem)] font-semibold leading-[.96] tracking-[-.065em] text-white">
              Site profissional para apresentar sua empresa <span className="text-[#a8f05a]">com clareza.</span>
            </h1>
            <p className="mt-7 max-w-xl text-base leading-relaxed text-white/75 md:text-lg">
              Design feito para sua marca, conteúdo organizado e experiência pensada para celular. Planejamos cada entrega junto com você.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#b3f46c] px-6 text-sm font-semibold text-[#10140b] shadow-[0_10px_40px_rgba(179,244,108,.18)] transition-all hover:-translate-y-0.5 hover:bg-[#c3ff7e]">
                Pedir orçamento no WhatsApp <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <Link to="/portfolio" className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/25 px-6 text-sm font-medium text-white transition-colors hover:border-white/50 hover:bg-white/[.06]">
                Explorar portfólio <ArrowDown className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-xs text-white/70" aria-label="Diferenciais da WH Studio">
              {["Design sob medida", "Estrutura responsiva", "Acompanhamento direto"].map((item) => (
                <li key={item} className="inline-flex items-center gap-2"><Check className="h-3.5 w-3.5 text-[#b8f879]" aria-hidden="true" />{item}</li>
              ))}
            </ul>
          </div>

          <div className="studio-hero__float studio-hero__float--top hidden lg:flex">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#b3f46c]/15 text-[#c4ff83]"><SearchCheck className="h-5 w-5" aria-hidden="true" /></span>
            <span><strong>SEO técnico</strong><small>estrutura definida no projeto</small></span>
          </div>
          <div className="studio-hero__float studio-hero__float--bottom hidden lg:flex">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-white"><MonitorSmartphone className="h-5 w-5" aria-hidden="true" /></span>
            <span><strong>Em cada tela</strong><small>celular · tablet · computador</small></span>
          </div>
        </motion.div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/15 py-5 text-xs text-white/65">
          <span className="font-mono uppercase tracking-[.15em]">Estratégia · design · desenvolvimento</span>
          <a href="#diferenciais" className="inline-flex min-h-10 items-center gap-2 transition-colors hover:text-white">Veja nossos diferenciais <ArrowDown className="h-4 w-4" aria-hidden="true" /></a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
