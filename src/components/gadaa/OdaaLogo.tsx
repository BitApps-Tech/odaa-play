export function OdaaLogo({ className = "h-14 w-14" }: { className?: string }) {
  return (
    <img
      src="/odaa-play-logo.png"
      alt="Odaa Play"
      className={`object-contain ${className}`}
    />
  );
}
