import { useEffect, useRef, useState } from "react";
import { Menu, X, MessageCircle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import AvailabilityBanner from "@/components/AvailabilityBanner";
import ThemeToggle from "@/components/ThemeToggle";
import BrandLogo from "@/components/BrandLogo";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const sectionLinks = [
  { label: "Diferenciais", id: "diferenciais" },
  { label: "Entregas", id: "entregas" },
  { label: "Portfólio", id: "portfolio" },
  { label: "Depoimentos", id: "depoimentos" },
  { label: "Perguntas", id: "faq" },
];

const Header = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const toggle = useRef<HTMLButtonElement>(null);
  const settings = useSiteSettings();
  useEffect(() => {
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") { setOpen(false); toggle.current?.focus(); } };
    if (open) window.addEventListener("keydown", escape);
    return () => window.removeEventListener("keydown", escape);
  }, [open]);
  const sectionHref = (id: string) => location.pathname === "/" ? `#${id}` : `/#${id}`;
  const whatsappUrl = settings.buildWhatsappLink("Olá! Quero conversar sobre um site ou sistema para minha empresa.");
  const links = sectionLinks.map(({ label, id }) => (
    <a key={id} href={sectionHref(id)} onClick={() => setOpen(false)} className="studio-nav-link">{label}</a>
  ));
  return (
    <header className="studio-header fixed inset-x-0 top-0 z-50">
      <a href="#main-content" className="studio-skip">Pular para o conteúdo</a>
      <AvailabilityBanner />
      <div className="container px-3 pt-3 sm:px-5">
        <div className="studio-nav-shell mx-auto flex min-h-[60px] max-w-[1180px] items-center justify-between gap-3 rounded-full border border-white/10 bg-[#0b0d12]/90 px-4 shadow-[0_12px_45px_rgba(0,0,0,.25)] backdrop-blur-xl sm:px-5">
          <Link to="/" onClick={() => setOpen(false)} className="studio-brand shrink-0" aria-label="WH Studio — página inicial"><BrandLogo className="h-9 w-[142px]" /></Link>
          <nav className="hidden items-center justify-center gap-4 xl:flex" aria-label="Navegação principal">{links}</nav>
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <span className="hidden lg:inline-flex"><ThemeToggle /></span>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="studio-nav-quote hidden min-h-10 items-center gap-2 rounded-full px-4 text-xs font-semibold sm:inline-flex sm:px-5 sm:text-sm"><MessageCircle className="h-4 w-4" aria-hidden="true" /><span>Orçamento no WhatsApp</span></a>
            <button ref={toggle} type="button" className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white transition-colors hover:border-white/35 hover:bg-white/[.06] xl:hidden" onClick={() => setOpen(!open)} aria-label={open ? "Fechar menu" : "Abrir menu"} aria-expanded={open} aria-controls="mobile-navigation">{open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
          </div>
        </div>
      </div>
      {open && <nav id="mobile-navigation" className="studio-mobile-nav mx-4 mt-2 max-h-[calc(100svh-6rem)] overflow-y-auto rounded-2xl border border-white/10 bg-[#0b0d12]/98 p-3 shadow-2xl backdrop-blur-xl xl:hidden" aria-label="Navegação mobile"><div className="flex flex-col items-stretch gap-1">{links}<a href="/servicos" onClick={() => setOpen(false)} className="studio-nav-link">Serviços</a><a href="/sistemas" onClick={() => setOpen(false)} className="studio-nav-link">Sistemas sob medida</a><a href="/ai" onClick={() => setOpen(false)} className="studio-nav-link">WH Studio AI</a><a href={whatsappUrl} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)} className="studio-nav-quote mt-2 inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold"><MessageCircle className="h-4 w-4" aria-hidden="true" />Orçamento no WhatsApp</a><span className="flex items-center justify-between border-t border-white/10 px-3 pt-3 text-sm text-white/70"><span>Modo de exibição</span><ThemeToggle /></span></div></nav>}
    </header>
  );
};
export default Header;
