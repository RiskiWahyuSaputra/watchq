type LogoProps = { className?: string; title?: string };

/** The Q: a watch face whose hand becomes the tail of the letter. */
export function QMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" fill="none">
      <circle cx="47" cy="47" r="37" stroke="currentColor" strokeWidth="6" />
      <line x1="47" y1="16" x2="47" y2="24" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <line x1="47" y1="47" x2="94" y2="94" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
      <circle cx="47" cy="47" r="5" fill="currentColor" />
    </svg>
  );
}

export default function Logo({ className = "", title = "WatchQ" }: LogoProps) {
  return (
    <span className={`inline-flex items-baseline font-serif leading-none ${className}`} aria-label={title} role="img">
      <span aria-hidden="true" className="tracking-[0.01em]">Watch</span>
      <QMark className="ml-[0.06em] h-[0.74em] w-[0.74em] translate-y-[0.1em] text-silver" />
    </span>
  );
}
