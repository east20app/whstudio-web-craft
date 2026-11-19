import { useState } from "react";
import { ArrowUpRight, ImageOff } from "lucide-react";
import { Link } from "react-router-dom";
import { usePortfolio } from "@/hooks/usePortfolio";
import { usePortfolioCover } from "@/hooks/usePortfolioCover";

function ProjectCover({ url, title }: { url?: string; title: string }) {
  const cover = usePortfolioCover(url);
  return cover ? <img src={cover} alt={`Capa de ${title}`} loading="lazy" decoding="async" /> : <ImageOff aria-hidden="true" className="text-muted-foreground" />;
}

export default function Portfolio({ preview = false }: { preview?: boolean }) {
  const { data, loading, error } = usePortfolio(true);
  const [category, setCategory] = useState("");
  const categories = Array.from(new Set(data.map((project) => project.category).filter(Boolean)));
  const projects = preview
    ? [...data].sort((a, b) => Number(b.featured) - Number(a.featured)).slice(0, 4)
    : data.filter((project) => !category || project.category === category);

  return (
    <section id="portfolio" className="wh-section wh-gallery">
      <div className="wh-wrap">
        <div className="wh-gallery-head">
          <div>
            <p className="wh-kicker"><span /> Portfólio</p>
            <h2>Projetos publicados.</h2>
          </div>
          {preview && <Link to="/portfolio" className="wh-text-link">Ver galeria <ArrowUpRight size={18} /></Link>}
        </div>
        {!preview && categories.length > 0 && (
          <div className="wh-filters" role="group" aria-label="Categorias">
            {["", ...categories].map((item) => <button type="button" key={item} aria-pressed={category === item} onClick={() => setCategory(item)}>{item || "Todos"}</button>)}
          </div>
        )}
        {loading && <p role="status">Carregando projetos…</p>}
        {error && <p role="status">Não foi possível carregar os projetos agora.</p>}
        {!loading && !error && !projects.length && <p className="text-muted-foreground">Nenhum projeto publicado nesta seleção.</p>}
        <div className="wh-gallery-grid">
          {projects.map((project) => {
            return (
              <Link className="wh-project" key={project.id} to={`/portfolio/${project.id}`}>
                <div className="wh-project-image">
                  <ProjectCover url={project.coverUrl} title={project.title} />
                </div>
                <div className="wh-project-info"><div><h3>{project.title}</h3><small>{project.category}</small></div><ArrowUpRight aria-hidden="true" size={22} /></div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
