import { Link } from "react-router-dom";
import { Mail, MapPin, MessageCircle } from "lucide-react";
import { navLinks } from "@/config/site";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import BrandLogo from "@/components/BrandLogo";

const Footer = () => {
  const settings = useSiteSettings();
  const waLink = settings.buildWhatsappLink();
  return (
    <footer className="studio-footer relative isolate overflow-hidden border-t border-white/15 !bg-[#050507] text-white">
      <div className="container relative z-10 pt-14 md:pt-20">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5"><Link to="/" className="studio-brand !text-white" aria-label="WH Studio — página inicial"><BrandLogo className="h-10 w-[156px]" /></Link><p className="mt-5 max-w-xs text-sm leading-relaxed text-white/60">{settings.footerText}</p></div>
          <nav className="md:col-span-3" aria-label="Navegação do rodapé"><h3 className="mb-5 text-sm">WH Studio</h3><div className="flex flex-col items-start gap-2">{navLinks.map(link => <Link key={link.href} to={link.href} className="inline-flex min-h-8 items-center text-sm text-white/60 transition-colors hover:text-[#3ca2fa]">{link.label}</Link>)}</div></nav>
          <div className="md:col-span-4"><h3 className="mb-5 text-sm">Contato</h3><div className="flex flex-col gap-4 text-sm text-white/60"><a className="flex items-center gap-3 transition-colors hover:text-[#3ca2fa]" href={`mailto:${settings.email}`}><Mail className="h-4 w-4 shrink-0 text-[#3ca2fa]" aria-hidden="true" /><span className="break-all">{settings.email}</span></a><a className="flex items-center gap-3 transition-colors hover:text-[#3ca2fa]" href={waLink} target="_blank" rel="noopener noreferrer"><MessageCircle className="h-4 w-4 text-[#3ca2fa]" aria-hidden="true" />{settings.whatsappDisplay}</a><p className="flex items-center gap-3"><MapPin className="h-4 w-4 text-[#3ca2fa]" aria-hidden="true" />Rio Grande do Norte · para todo o Brasil</p></div></div>
        </div>
        <div className="flex flex-wrap justify-between gap-3 mt-12 border-t border-white/15 py-6 text-xs text-white/50"><p>{settings.siteName} © {new Date().getFullYear()}</p><Link className="transition-colors hover:text-white" to="/dashboard/login">Área administrativa ↗</Link></div>
      </div>
    </footer>
  );
};
export default Footer;
