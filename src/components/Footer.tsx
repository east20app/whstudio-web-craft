import { Link } from "react-router-dom";
import { ArrowUpRight, Mail, MapPin, MessageCircle } from "lucide-react";
import { navLinks } from "@/config/site";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { FooterBackgroundGradient, TextHoverEffect } from "@/components/ui/hover-footer";

const Footer = () => {
  const settings = useSiteSettings();
  const waLink = settings.buildWhatsappLink();
  return (
    <footer className="studio-footer relative isolate overflow-hidden text-white">
      <FooterBackgroundGradient />
      <div className="container relative z-10 pt-14 md:pt-20">
        <div className="mb-14 flex flex-col items-start justify-between gap-6 border-b border-white/15 pb-12 md:flex-row md:items-end">
          <div><p className="eyebrow !text-white/60">O próximo projeto pode ser o seu.</p><h2 className="mt-4 max-w-2xl text-4xl md:text-6xl">Uma ideia merece<br />sair do papel.</h2></div>
          <Link to="/orcamento" className="group flex min-h-14 items-center gap-6 rounded-full border border-white/25 px-6 text-sm transition-colors hover:border-[#3ca2fa] hover:bg-white/5">Conte sua ideia <ArrowUpRight className="h-5 w-5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" aria-hidden="true" /></Link>
        </div>
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5"><Link to="/" className="studio-brand !text-white" aria-label="WH Studio — página inicial">wh<span className="text-[#3ca2fa]">/</span><span className="studio-brand__suffix">studio</span></Link><p className="mt-5 max-w-xs text-sm leading-relaxed text-white/60">{settings.footerText}</p></div>
          <nav className="md:col-span-3" aria-label="Navegação do rodapé"><h3 className="mb-5 text-sm">WH Studio</h3><div className="flex flex-col items-start gap-2">{navLinks.map(link => <Link key={link.href} to={link.href} className="inline-flex min-h-8 items-center text-sm text-white/60 transition-colors hover:text-[#3ca2fa]">{link.label}</Link>)}</div></nav>
          <div className="md:col-span-4"><h3 className="mb-5 text-sm">Uma conversa, sem intermediários.</h3><div className="flex flex-col gap-4 text-sm text-white/60"><a className="flex items-center gap-3 transition-colors hover:text-[#3ca2fa]" href={`mailto:${settings.email}`}><Mail className="h-4 w-4 shrink-0 text-[#3ca2fa]" aria-hidden="true" /><span className="break-all">{settings.email}</span></a><a className="flex items-center gap-3 transition-colors hover:text-[#3ca2fa]" href={waLink} target="_blank" rel="noopener noreferrer"><MessageCircle className="h-4 w-4 text-[#3ca2fa]" aria-hidden="true" />{settings.whatsappDisplay}</a><p className="flex items-center gap-3"><MapPin className="h-4 w-4 text-[#3ca2fa]" aria-hidden="true" />Rio Grande do Norte · para todo o Brasil</p></div></div>
        </div>
        <Link to="/" className="mt-12 block rounded-lg" aria-label="WH Studio — voltar ao início"><TextHoverEffect text="WH STUDIO" /></Link>
        <div className="flex flex-wrap justify-between gap-3 border-t border-white/15 py-6 text-xs text-white/50"><p>{settings.siteName} © {new Date().getFullYear()}</p><p>Sites & sistemas feitos pela WH Studio</p><Link className="transition-colors hover:text-white" to="/dashboard/login">Área administrativa ↗</Link></div>
      </div>
    </footer>
  );
};
export default Footer;
