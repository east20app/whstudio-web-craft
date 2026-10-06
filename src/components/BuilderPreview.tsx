import { useMemo } from "react";
import { SandpackProvider, SandpackPreview } from "@codesandbox/sandpack-react";
import type { Artifact, Project } from "@/lib/builder";
import { backendModule } from "@/lib/builder";
export default function BuilderPreview({
  artifact,
  project,
  mobile,
}: {
  artifact: Artifact;
  project?: Project;
  mobile: boolean;
}) {
  const files = useMemo(() => {
    const result = Object.fromEntries(
      artifact.files
        .filter((f) => f.path.startsWith("src/") || f.path === "index.html")
        .map((f) => ["/" + f.path, f.content]),
    );
    result["/src/lib/supabase.ts"] = backendModule(
      project?.backend_url || "",
      project?.backend_key || "",
    );
    // The browser bundler uses this entry. Exported projects keep their Vite entry/config.
    result["/index.tsx"] = 'import "./src/main.tsx";';
    result["/public/index.html"] =
      '<!doctype html><html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body><div id="root"></div></body></html>';
    delete result["/index.html"];
    return result;
  }, [artifact, project?.backend_url, project?.backend_key]);
  return (
    <div className={`mx-auto w-full ${mobile ? "max-w-[390px]" : ""}`}>
      <SandpackProvider
        key={JSON.stringify(files)}
        template="react-ts"
        theme="dark"
        files={files}
        customSetup={{
          dependencies: {
            "react-router-dom": "6.30.1",
            "@supabase/supabase-js": "2.105.1",
            "lucide-react": "0.462.0",
          },
        }}
        options={{ externalResources: [], autorun: true }}
      >
        <SandpackPreview
          style={{ height: 650 }}
          showOpenInCodeSandbox={false}
          showRefreshButton
          showNavigator
        />
      </SandpackProvider>
    </div>
  );
}
