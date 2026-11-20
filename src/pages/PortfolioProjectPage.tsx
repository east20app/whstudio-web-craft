import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { ArrowLeft, ArrowUpRight, ExternalLink, Globe2, Loader2, Monitor, RefreshCw, Smartphone } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CTAFinal from "@/components/CTAFinal";
import Seo from "@/components/Seo";
import { statusLabels } from "@/config/site";
import { usePortfolio } from "@/hooks/usePortfolio";
import { portfolioWebUrl, publicPortfolioCover } from "@/lib/portfolio-url";

const PortfolioProjectPage = () => {
  const { projectId } = useParams();
  const { data: projects, loading } = usePortfolio(true);
  const [reloadKey, setReloadKey] = useState(0);
  const [mobile, setMobile] = useState(false);
  const project = projects.find((item) => item.id === projectId);
  const liveUrl = project?.status === "privado" ? null : portfolioWebUrl(project?.url);
  const cover = publicPortfolioCover(project?.coverUrl);
  const galleryProjectId = project?.id;
  const { data: screenshots = [] } = useQuery({
    queryKey: ["portfolio-gallery", project?.id],
    enabled: !!project?.id,
    queryFn: async () => {
      if (!galleryProjectId) return [];
      const result = await supabase.from("portfolio_projects").select("gallery_urls").eq("id", galleryProjectId).eq("published", true).single();
      if (result.error) throw result.error;
      return result.data.gallery_urls.map(publicPortfolioCover).filter((url): url is string => !!url);
    },
  });
  const host = liveUrl ? new URL(liveUrl).host : "";
  const canEmbed = liveUrl && new URL(liveUrl).origin !== window.location.origin;

  return (
    <>
      {project ? (
        <Seo
          title={`${project.title} — Projeto da WH Studio`}
          description={project.desc || `${project.category} desenvolvido pela WH Studio.`}
          path={`/portfolio/${project.id}`}
        />
      ) : (
        <Seo title="Projeto do portfólio — WH Studio" description="Conheça projetos desenvolvidos pela WH Studio." path={`/portfolio/${projectId || ""}`} />
      )}
      <Header />
      <main id="main-content" tabIndex={-1} className="min-h-screen pt-24">
        {loading ? (
          <div className="grid min-h-[55vh] place-items-center"><Loader2 className="h-6 w-6 animate-spin text-primary" aria-label="Carregando projeto" /></div>
        ) : !project ? (
          <section className="container grid min-h-[60vh] content-center py-20">
            <p className="eyebrow mb-4">Portfólio</p>
            <h1 className="display-huge max-w-2xl text-4xl md:text-6xl">Não encontramos esse projeto.</h1>
            <p className="mt-5 max-w-lg text-muted-foreground">Ele pode ter sido removido ou não estar publicado.</p>
            <Link to="/portfolio" className="mt-8 inline-flex min-h-11 w-fit items-center gap-2 text-sm text-primary hover:underline"><ArrowLeft className="h-4 w-4" />Voltar ao portfólio</Link>
          </section>
        ) : (
          <>
            <section className="container pb-8 pt-8 md:pb-12 md:pt-12">
              <Link to="/portfolio" className="mb-8 inline-flex min-h-10 items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-foreground"><ArrowLeft className="h-4 w-4" />Todos os projetos</Link>
              <div className="grid items-end gap-7 lg:grid-cols-12">
                <div className="lg:col-span-8">
                  <p className="eyebrow mb-4">{project.category || "Projeto WH Studio"}</p>
                  <h1 className="display-huge text-4xl md:text-6xl">{project.title}</h1>
                  <p className="mt-5 max-w-3xl text-base leading-relaxed text-muted-foreground">{project.desc}</p>
                </div>
                <div className="flex flex-wrap items-center gap-3 lg:col-span-4 lg:justify-end">
                  <span className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-2 text-xs text-muted-foreground"><span className={`h-2 w-2 rounded-full ${project.status === "online" ? "bg-emerald-500" : project.status === "em-desenvolvimento" ? "bg-amber-400" : project.status === "demo" ? "bg-primary" : "bg-muted-foreground"}`} />{statusLabels[project.status]?.label || "Projeto"}</span>
                  {liveUrl && <a href={liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">Abrir site original <ExternalLink className="h-4 w-4" aria-hidden="true" /></a>}
                </div>
              </div>
              {!!project.tech.length && <ul className="mt-6 flex flex-wrap gap-2" aria-label="Tecnologias do projeto">{project.tech.map((tech) => <li key={tech} className="rounded-full border border-border px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{tech}</li>)}</ul>}
            </section>

            {!!screenshots.length && (
              <section className="container pb-12" aria-label="Capturas do projeto">
                <h2 className="text-2xl font-bold mb-5">Capturas do projeto</h2>
                <ul className="grid gap-4 md:grid-cols-2">
                  {screenshots.map((src, index) => <li key={src}>
                    <a href={src} target="_blank" rel="noreferrer" className="block overflow-hidden border border-border">
                      <img src={src} alt={`Captura ${index + 1} de ${project.title}`} loading="lazy" decoding="async" className="aspect-video w-full object-cover object-top" />
                    </a>
                  </li>)}
                </ul>
              </section>
            )}
            <section className="container pb-16 md:pb-24" aria-label={`Prévia do projeto ${project.title}`}>
              {canEmbed ? (
                <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
                  <div className="flex min-h-12 flex-wrap items-center justify-between gap-3 border-b border-border bg-card px-4 py-2.5">
                    <div className="flex min-w-0 items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex gap-1.5" aria-hidden="true"><i className="h-2 w-2 rounded-full bg-red-400/80" /><i className="h-2 w-2 rounded-full bg-amber-400/80" /><i className="h-2 w-2 rounded-full bg-emerald-400/80" /></span>
                      <span className="inline-flex min-w-0 items-center gap-2 truncate font-mono"><Globe2 className="h-3.5 w-3.5 shrink-0" />{host}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex" role="group" aria-label="Tamanho da prévia">
                        <button type="button" aria-label="Computador" aria-pressed={!mobile} onClick={() => setMobile(false)} className="wh-preview-size"><Monitor size={17} /></button>
                        <button type="button" aria-label="Celular" aria-pressed={mobile} onClick={() => setMobile(true)} className="wh-preview-size"><Smartphone size={17} /></button>
                      </div>
                      <button type="button" onClick={() => setReloadKey((key) => key + 1)} className="inline-flex min-h-8 items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-foreground"><RefreshCw className="h-3.5 w-3.5" />Recarregar prévia</button>
                      <a href={liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-8 items-center gap-2 text-xs text-primary transition-colors hover:text-primary/80">Abrir fora <ArrowUpRight className="h-3.5 w-3.5" /></a>
                    </div>
                  </div>
                  <div className="grid place-items-center bg-black p-2 sm:p-5">
                    <iframe key={reloadKey} src={liveUrl} title={`Site real do projeto ${project.title}`} referrerPolicy="no-referrer" loading="lazy"
                      sandbox="allow-scripts allow-forms" className={`h-[68svh] min-h-[420px] w-full border border-border bg-white ${mobile ? "max-w-[390px]" : ""}`} />
                  </div>
                  <p className="border-t border-border px-4 py-3 text-xs leading-relaxed text-muted-foreground">Esta prévia carrega o site publicado. Se o servidor do projeto bloquear exibição incorporada, use “Abrir fora” para visualizar o site original.</p>
                </div>
              ) : cover ? (
                <figure className="overflow-hidden rounded-2xl border border-border bg-card">
                  <img src={cover} alt={`Imagem do projeto ${project.title}`} className="max-h-[75svh] w-full object-cover object-top" />
                  <figcaption className="border-t border-border px-4 py-3 text-xs text-muted-foreground">Imagem de apresentação. O site original não está publicado publicamente.</figcaption>
                </figure>
              ) : (
                <div className="grid min-h-[380px] place-items-center rounded-2xl border border-border bg-card p-8 text-center">
                  <div><Globe2 className="mx-auto mb-5 h-10 w-10 text-primary" /><p className="font-display text-3xl">Prévia privada</p><p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">Este projeto não tem um endereço público ou imagem de apresentação cadastrados.</p></div>
                </div>
              )}
            </section>
          </>
        )}
        <CTAFinal />
      </main>
      <Footer />
    </>
  );
};

export default PortfolioProjectPage;
