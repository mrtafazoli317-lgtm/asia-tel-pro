import logoDark from "@/assets/asia-logo-transparent.png";
import logoWhite from "@/assets/asia-logo-white.png";

export function Logo({
  className = "",
  variant = "dark",
}: {
  className?: string;
  variant?: "dark" | "white";
}) {
  return (
    <div className={`flex items-center ${className}`}>
      <img
        src={variant === "white" ? logoWhite : logoDark}
        alt="فروشگاه آسیا - Asia Mobile"
        width={160}
        height={48}
        className="h-10 w-auto object-contain sm:h-11"
      />
    </div>
  );
}
