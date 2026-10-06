import { describe, it, expect } from "vitest";
import { unzipSync, strFromU8 } from "fflate";
import { validateArtifact } from "../../supabase/functions/_shared/artifact";
import { projectArchive } from "@/lib/builder";
import { validPublicBackend } from "@/lib/builder-backend";
const artifact = {
  title: "Sistema",
  summary: "Aplicação React",
  backend_requirements: [],
  files: [
    {
      path: "package.json",
      content: JSON.stringify({
        scripts: { dev: "vite", build: "vite build" },
        dependencies: { react: "18.3.1", "react-dom": "18.3.1" },
        devDependencies: { vite: "5.4.19" },
      }),
    },
    { path: "index.html", content: '<div id="root"></div>' },
    { path: "src/main.tsx", content: 'import App from "./App"' },
    { path: "vite.config.ts", content: "export default {}" },
    { path: "tsconfig.json", content: "{}" },
    { path: "README.md", content: "npm install && npm run dev" },
    {
      path: "src/App.tsx",
      content: "export default function App(){return <h1>Sistema</h1>}",
    },
  ],
};
describe("multi-file projects", () => {
  it("accepts only public backend keys and rejects secret roles", () => {
    expect(
      validPublicBackend(
        "https://demo.supabase.co",
        "sb_publishable_example-for-test",
      ),
    ).toBe(true);
    expect(
      validPublicBackend(
        "https://demo.supabase.co",
        "sb_secret_example-for-test",
      ),
    ).toBe(false);
    const token = (role: string) =>
      `header.${btoa(JSON.stringify({ role }))}.signature`;
    expect(validPublicBackend("https://demo.supabase.co", token("anon"))).toBe(
      true,
    );
    expect(
      validPublicBackend("https://demo.supabase.co", token("service_role")),
    ).toBe(false);
    expect(validPublicBackend("https://evil.example", token("anon"))).toBe(
      false,
    );
  });
  it("validates React files and exports a real ZIP", () => {
    const valid = validateArtifact(artifact);
    const files = unzipSync(projectArchive(valid));
    expect(strFromU8(files["src/App.tsx"])).toContain("Sistema");
    expect(JSON.parse(strFromU8(files["package.json"])).scripts.build).toBe(
      "vite build",
    );
    expect(strFromU8(files["src/lib/supabase.ts"])).toContain("createClient");
  });
  it("rejects traversal, duplicate files and installation scripts", () => {
    expect(() =>
      validateArtifact({
        ...artifact,
        files: [...artifact.files, { path: "../secret", content: "" }],
      }),
    ).toThrow();
    expect(() =>
      validateArtifact({
        ...artifact,
        files: [...artifact.files, artifact.files[0]],
      }),
    ).toThrow();
    const files = artifact.files.map((f) =>
      f.path === "package.json"
        ? {
            ...f,
            content: JSON.stringify({
              scripts: { dev: "vite", build: "vite build", postinstall: "evil" },
              dependencies: { react: "18", "react-dom": "18" },
              devDependencies: { vite: "5" },
            }),
          }
        : f,
    );
    expect(() => validateArtifact({ ...artifact, files })).toThrow("Scripts de instalação não permitidos");
  });
  it("rejects HTML-only responses and incomplete source trees", () => {
    expect(() =>
      validateArtifact({ title: "HTML", html: "<html></html>" }),
    ).toThrow();
    expect(() =>
      validateArtifact({
        ...artifact,
        files: artifact.files.filter((f) => f.path !== "src/App.tsx"),
      }),
    ).toThrow();
  });
});
