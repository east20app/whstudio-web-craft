export default function BrandLogo({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 154 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 8h6l5 14 6-12h5l5 12 5-14h6L31 29h-5l-5-12-6 12h-5L2 8Z" fill="currentColor" />
      <path d="M42 8h6v8h10V8h6v21h-6v-8H48v8h-6V8Z" fill="currentColor" />
      <path d="M71 8h4v21h-4z" fill="#0085FF" />
      <text x="83" y="25" fill="currentColor" fontFamily="Space Grotesk, sans-serif" fontSize="20" fontWeight="600" letterSpacing="-1">Studio</text>
    </svg>
  );
}
