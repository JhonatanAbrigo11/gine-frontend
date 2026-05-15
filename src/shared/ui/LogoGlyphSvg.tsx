export function LogoGlyphSvg({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" aria-hidden>
      <path
        strokeWidth="1.75"
        strokeLinecap="round"
        d="M12 4.5c-2 2.2-3.5 4.4-3.5 7.3a3.5 3.5 0 1 0 7 0c0-2.9-1.5-5.1-3.5-7.3Z"
      />
      <path strokeWidth="1.75" strokeLinecap="round" d="M12 11.8v7.2m-2.6-4.2h5.2" />
    </svg>
  )
}
