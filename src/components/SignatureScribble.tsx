import { cn } from "@/lib/utils";

type SignatureScribbleProps = {
  className?: string;
};

/**
 * Assinatura desenhada à mão (SVG). Usada sob destaques serifados
 * para dar o toque autoral do estúdio. `currentColor` para herdar a cor.
 */
export function SignatureScribble({ className }: SignatureScribbleProps) {
  return (
    <svg
      viewBox="0 0 260 28"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      className={cn("h-4 w-full", className)}
    >
      <path
        d="M6 20 C 34 10, 58 22, 84 14 S 134 8, 158 14 S 214 20, 236 11 S 252 12, 256 15"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.85"
      />
      <path
        d="M12 23 C 42 16, 66 25, 92 19 S 148 14, 178 20 S 224 24, 244 17"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  );
}

/** Nome editorial aliased: a "assinatura" desenhada sob palavras em destaque. */
export { SignatureScribble as SignatureUnderline };