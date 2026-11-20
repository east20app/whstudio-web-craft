type BrandLogoProps = { className?: string };

export default function BrandLogo({ className = "" }: BrandLogoProps) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 174 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 8h6.5l5.3 20.1L21 13h4.5l6.8 15.1L37.8 8h6.5L35.9 37h-5.7l-7-15.4L16 37h-6L2 8Z" fill="currentColor" />
      <path d="M48 7h5.5l-9 31H39l9-31Z" fill="#0085FF" />
      <path d="M58 8h6v11.6h12V8h6v29h-6V25.3H64V37h-6V8Z" fill="currentColor" />
      <text x="91" y="29" fill="currentColor" fontFamily="Space Grotesk, Inter, sans-serif" fontSize="19" fontWeight="700" letterSpacing="-.9">STUDIO</text>
    </svg>
  );
}
