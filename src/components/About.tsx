import { Link } from "react-router-dom";
import { ArrowUpRight, Braces } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
const workStyle = [
  { title: "Entendimento do negócio", desc: "Objetivos, público e operação antes de escolher a tecnologia." },
  { title: "Projeto com escopo claro", desc: "Entregas, prazo e investimento definidos antes do desenvolvimento." },
  { title: "Acompanhamento em cada etapa", desc: "Layouts e versões de teste para validar o projeto com sua empresa." },
  { title: "Entrega e continuidade", desc: "Publicação, orientação de uso e suporte conforme o escopo contratado." },
];
const About = () => {
  const { acceptingProjects } = useSiteSettings();
  return <section id="sobre" className="border-t border-border py-20 md:py-28"><div className="container grid gap-12 lg:grid-cols-12"><div className="lg:col-span-5"><p className="eyebrow mb-5">A empresa / WH Studio</p><h2 className="display-huge text-4xl md:text-6xl">Tecnologia perto<br /><em>do seu negócio.</em></h2><p className="mt-6 max-w-sm text-sm leading-relaxed text-muted-foreground">Somos uma empresa de desenvolvimento de sites e sistemas no Rio Grande do Norte. Conectamos design, programação e processos para criar soluções úteis para sua operação.</p><Link className="mt-8 inline-flex min-h-11 items-center gap-3 border-b border-border text-sm transition-colors hover:text-primary" to="/sobre">Conheça a WH Studio <ArrowUpRight className="h-4 w-4" aria-hidden="true" /></Link><div className="mt-10 flex items-center gap-3 text-xs text-muted-foreground"><Braces className="h-5 w-5 text-primary" aria-hidden="true" />{acceptingProjects ? "Vamos conversar sobre seu próximo projeto." : "Consulte nossa disponibilidade para novos projetos."}</div></div><ol className="border-t border-border lg:col-span-7">{workStyle.map((item, index) => <li key={item.title} className="flex gap-5 border-b border-border py-7"><span className="num-label pt-1">{String(index + 1).padStart(2, "0")}</span><div><h3 className="text-xl">{item.title}</h3><p className="mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">{item.desc}</p></div></li>)}</ol></div></section>;
};
export default About;
