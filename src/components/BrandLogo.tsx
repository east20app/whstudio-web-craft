type BrandLogoProps = { className?: string };

/** WH Studio's responsive vector wordmark, shared by the site header and footer. */
export default function BrandLogo({ className = "" }: BrandLogoProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 184 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 11.5 10.7 31l7.1-16.4L24.4 31l7.1-19.5"
        stroke="currentColor"
        strokeWidth="5.2"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
      <path d="m42 7-9 31" stroke="#3CA2FA" strokeWidth="5.2" />
      <path
        d="M47 13v17m15-17v17M47 21.5h15"
        stroke="currentColor"
        strokeWidth="4.4"
        strokeLinecap="square"
      />
      <text
        x="74"
        y="29"
        fill="currentColor"
        fontFamily="Space Grotesk, Inter, sans-serif"
        fontSize="22"
        fontWeight="600"
        letterSpacing="-1.1"
      >
        studio
      </text>
    </svg>
  );
}
