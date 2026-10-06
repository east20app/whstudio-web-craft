import { defineConfig, type PluginOption } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(async ({ mode }) => {
  const plugins: PluginOption[] = [react()];
  if (mode === "development") {
    try {
      const mod = (await import(/* @vite-ignore */ "lovable-tagger" as string)) as {
        componentTagger: () => PluginOption;
      };
      plugins.push(mod.componentTagger());
    } catch {
      // lovable-tagger indisponível fora do ambiente Lovable — segue sem ele.
    }
  }
  return {
    server: {
      host: "::",
      port: 8080,
      hmr: {
        overlay: false,
      },
    },
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
      dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
    },
  };
});
