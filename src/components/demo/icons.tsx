/** Small glyphs used by the download page (not brand logos). */
export function ZipFileIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 44" className={className} aria-hidden="true">
      <path d="M2 4a3 3 0 0 1 3-3h17l8 8v32a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z" className="fill-mf-zip" />
      <path d="M22 1l8 8h-6a2 2 0 0 1-2-2z" className="fill-mf-zip-fold" />
      <rect x="2" y="20" width="28" height="23" rx="1.5" className="fill-background" />
      <g className="stroke-mf-social-icon" strokeWidth="1" fill="none">
        <circle cx="16" cy="23.5" r="2.3" />
        <path d="M16 26v14 M14.5 28h3 M14.5 30h3 M14.5 32h3 M14.5 34h3 M14.5 36h3 M14.5 38h3" />
      </g>
    </svg>
  );
}

export function SolidDownloadIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <path d="M9 2h6v8h4.5L12 17.5 4.5 10H9z" />
      <rect x="3" y="20" width="18" height="2.6" />
    </svg>
  );
}

export function FacebookGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <path d="M13.5 22v-8.2h2.8l.4-3.3h-3.2V8.4c0-.9.3-1.6 1.6-1.6h1.7V3.9c-.3 0-1.3-.1-2.5-.1-2.5 0-4.1 1.5-4.1 4.2v2.5H7.4v3.3h2.8V22z" />
    </svg>
  );
}

export function BirdGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <path d="M22 5.9c-.7.3-1.5.5-2.3.6.8-.5 1.5-1.3 1.8-2.2-.8.5-1.7.8-2.6 1a4.1 4.1 0 0 0-7 3.7A11.6 11.6 0 0 1 3.4 4.7a4.1 4.1 0 0 0 1.3 5.5c-.7 0-1.3-.2-1.9-.5 0 2 1.4 3.7 3.3 4.1-.6.2-1.2.2-1.9.1.5 1.6 2 2.8 3.8 2.9A8.2 8.2 0 0 1 2 18.5 11.6 11.6 0 0 0 8.3 20.3c7.5 0 11.7-6.2 11.7-11.7v-.5c.8-.6 1.5-1.3 2-2.2z" />
    </svg>
  );
}
