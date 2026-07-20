export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl gradient-brand shadow-glow">
        <svg viewBox="0 0 32 32" className="h-6 w-6 text-white" fill="currentColor" aria-hidden>
          <path d="M22 4c-2.4 0-4.3 1.2-5.5 3-.2.3-.7.3-.9 0C14.3 5.2 12.4 4 10 4 6.1 4 3 7.4 3 11.5c0 6.8 8 12.5 12.4 15.9.4.3.9.3 1.3 0C21 24 29 18.3 29 11.5 29 7.4 25.9 4 22 4z" opacity="0.3"/>
          <path d="M16 6l2.5 5 5.5.8-4 3.9.9 5.5L16 18.5 11.1 21l.9-5.5-4-3.9 5.5-.8L16 6z"/>
        </svg>
      </div>
      <div className="flex flex-col leading-none">
        <span className="text-lg font-extrabold text-foreground">فروشگاه آسیا</span>
        <span className="mt-0.5 text-[10px] font-medium tracking-widest text-primary">
          ASIA MOBILE
        </span>
      </div>
    </div>
  );
}
