/** Low-opacity, file-themed outline pattern behind the download hero. */
export function FilePattern() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full text-mf-pattern opacity-35"
    >
      <defs>
        <pattern id="mf-files" width="190" height="150" patternUnits="userSpaceOnUse" patternTransform="rotate(-12)">
          <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {/* document */}
            <path d="M10 20h24l10 10v36H10z M34 20v10h10" />
            <path d="M17 42h20 M17 50h20 M17 58h12" />
            {/* folder */}
            <path d="M70 30h18l6 7h28v30H70z" />
            {/* image */}
            <rect x="135" y="22" width="40" height="32" rx="4" />
            <path d="M139 50l10-12 8 9 6-6 8 9" />
            <circle cx="164" cy="31" r="3" />
            {/* cloud */}
            <path d="M22 125a12 12 0 0 1 2-24 16 16 0 0 1 30-2 11 11 0 0 1 4 22z" />
            {/* music */}
            <path d="M92 128V98l22-5v30" />
            <circle cx="86" cy="128" r="6" />
            <circle cx="108" cy="123" r="6" />
            {/* phone */}
            <rect x="140" y="88" width="26" height="46" rx="5" />
            <path d="M149 128h8" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#mf-files)" />
    </svg>
  );
}
