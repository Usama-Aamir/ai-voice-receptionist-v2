export function Logo({ variant = "full" }: { variant?: "icon" | "full" }) {
  const size = variant === "icon" ? 32 : 28;

  const mark = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="text-accent"
    >
      {/* North satellite */}
      <circle cx="16" cy="4" r="2.5" fill="currentColor" />
      {/* East satellite */}
      <circle cx="28" cy="16" r="2.5" fill="currentColor" />
      {/* South satellite */}
      <circle cx="16" cy="28" r="2.5" fill="currentColor" />
      {/* West satellite */}
      <circle cx="4" cy="16" r="2.5" fill="currentColor" />
      {/* Connecting lines */}
      <line x1="16" y1="8" x2="16" y2="12" stroke="currentColor" strokeWidth="1" />
      <line x1="20" y1="16" x2="24" y2="16" stroke="currentColor" strokeWidth="1" />
      <line x1="16" y1="20" x2="16" y2="24" stroke="currentColor" strokeWidth="1" />
      <line x1="8" y1="16" x2="12" y2="16" stroke="currentColor" strokeWidth="1" />
      {/* Central hub */}
      <circle cx="16" cy="16" r="5" fill="currentColor" />
    </svg>
  );

  if (variant === "icon") {
    return mark;
  }

  return (
    <span className="inline-flex items-center gap-2.5">
      {mark}
      <span className="font-sans text-xl font-semibold tracking-tight text-text-primary">
        Solmy
      </span>
    </span>
  );
}
