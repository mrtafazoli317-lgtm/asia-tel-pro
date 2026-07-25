import logoAsset from "@/assets/asia-logo.png.asset.json";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center ${className}`}>
      <img
        src={logoAsset.url}
        alt="فروشگاه آسیا - Asia Mobile"
        width={160}
        height={48}
        className="h-10 w-auto object-contain sm:h-11"
      />
    </div>
  );
}
