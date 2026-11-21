export type ProjectFile = { path: string; content: string };
export type Artifact = {
  title: string;
  summary: string;
  files: ProjectFile[];
  backend_requirements: string[];
};
export function validateArtifact(value: unknown): Artifact {
  if (!value || typeof value !== "object") throw new Error("Projeto inválido");
  const a = value as Artifact;
  if (
    typeof a.title !== "string" ||
    !a.title.trim() ||
    a.title.length > 100 ||
    typeof a.summary !== "string" ||
    !Array.isArray(a.files) ||
    a.files.length < 4 ||
    a.files.length > 60 ||
    !Array.isArray(a.backend_requirements) ||
    !a.backend_requirements.every((r) => typeof r === "string")
  )
    throw new Error("Estrutura de projeto inválida");
  const paths = new Set<string>();
  let size = 0;
  for (const file of a.files) {
    if (
      typeof file.path !== "string" ||
      file.path.length > 240 ||
      typeof file.content !== "string" ||
      !/^([a-zA-Z0-9_.-]+\/)*[a-zA-Z0-9_.-]+$/.test(file.path) ||
      file.path
        .split("/")
        .some(
          (p) =>
            ["..", ".", "node_modules", ".git", ".jj", "dist", "build", ".cache", "tmp"].includes(p),
        ) ||
      (file.path.split("/").some((p) => p === ".env" || (p.startsWith(".env.") && p !== ".env.example"))) ||
      /\.(?:log|tsbuildinfo|tmp|bak)$/.test(file.path) ||
      /(?:sb_secret_[a-zA-Z0-9_-]+|sk_live_[a-zA-Z0-9]+|AIza[a-zA-Z0-9_-]{30,})/.test(file.content) ||
      paths.has(file.path)
    )
      throw new Error("Nome de arquivo inválido ou repetido");
    paths.add(file.path);
    size += file.content.length;
  }
  if (size > 600000) throw new Error("Projeto maior que o limite");
  for (const required of [
    "package.json",
    "index.html",
    "src/main.tsx",
    "src/App.tsx",
    "vite.config.ts",
    "tsconfig.json",
    "README.md",
  ])
    if (!paths.has(required))
      throw new Error(`Arquivo obrigatório ausente: ${required}`);
  const packageFile = a.files.find((f) => f.path === "package.json");
  if (!packageFile) throw new Error("package.json ausente");
  const pkg = JSON.parse(packageFile.content);
  if (
    !pkg.dependencies?.react ||
    !pkg.dependencies?.["react-dom"] ||
    !pkg.devDependencies?.vite ||
    !pkg.scripts?.dev ||
    !pkg.scripts?.build
  )
    throw new Error("Configuração React/Vite incompleta");
  if (
    ["preinstall", "install", "postinstall", "prepare"].some(
      (k) => pkg.scripts[k],
    )
  )
    throw new Error("Scripts de instalação não permitidos");
  const allowed = new Set([
    "react",
    "react-dom",
    "react-router-dom",
    "@supabase/supabase-js",
    "lucide-react",
  ]);
  if (Object.keys(pkg.dependencies).some((name) => !allowed.has(name)))
    throw new Error("Dependência não suportada pela prévia");
  return a;
}
