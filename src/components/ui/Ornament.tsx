/** Five-point star from the crest's ribbon, used sparingly as a section terminator. */
export function Star({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M12 2.5l2.79 6.06 6.63.72-4.95 4.47 1.38 6.53L12 16.95l-5.85 3.33 1.38-6.53L2.58 9.28l6.63-.72L12 2.5z" />
    </svg>
  );
}

/** Gold hairline with a centred star. */
export function StarRule({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`flex items-center gap-4 text-ornament ${className}`}>
      <span className="h-px flex-1 bg-current opacity-60" />
      <Star className="size-3.5" />
      <span className="h-px flex-1 bg-current opacity-60" />
    </div>
  );
}
