import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

const ThemeToggle = ({ className = "" }: { className?: string }) => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <span className={`w-9 h-9 border border-border bg-card ${className}`} aria-hidden="true" />;
  }

  const dark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? "light" : "dark")}
      aria-label={dark ? "Mudar para o tema claro" : "Mudar para o tema escuro"}
      title={dark ? "Tema claro" : "Tema escuro"}
      className={`w-9 h-9 inline-flex items-center justify-center border border-border bg-card text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors ${className}`}
    >
      {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
};

export default ThemeToggle;
