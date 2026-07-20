import { Phone, MessageCircle, Cpu, Camera, HardDrive, Monitor, CheckCircle2, XCircle } from "lucide-react";
import { formatPrice, type Product } from "@/lib/products";
import { siteConfig } from "@/lib/site-config";

export function ProductCard({ product }: { product: Product }) {
  const waLink = `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(
    `سلام، در مورد ${product.name} می‌خواستم راهنمایی بگیرم.`,
  )}`;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated">
      {/* Visual */}
      <div className={`relative aspect-[4/3] overflow-hidden bg-gradient-to-br ${product.color}`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <PhoneShape />
        </div>
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {product.oldPrice && (
            <span className="rounded-full bg-destructive px-2.5 py-1 text-[10px] font-bold text-white">
              تخفیف ویژه
            </span>
          )}
          {product.featured && (
            <span className="rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold text-primary">
              پرفروش
            </span>
          )}
        </div>
        <div className="absolute top-3 left-3">
          {product.inStock ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/95 px-2.5 py-1 text-[10px] font-bold text-white">
              <CheckCircle2 className="h-3 w-3" /> موجود
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-500/95 px-2.5 py-1 text-[10px] font-bold text-white">
              <XCircle className="h-3 w-3" /> ناموجود
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-extrabold text-foreground">{product.name}</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">{product.series} · {product.year}</p>

        <ul className="mt-4 grid grid-cols-2 gap-2 text-[11px] text-muted-foreground">
          <Spec icon={<HardDrive className="h-3.5 w-3.5" />} text={product.storage} />
          <Spec icon={<Cpu className="h-3.5 w-3.5" />} text={product.chip} />
          <Spec icon={<Monitor className="h-3.5 w-3.5" />} text={product.display} />
          <Spec icon={<Camera className="h-3.5 w-3.5" />} text={product.camera} />
        </ul>

        <div className="mt-5 flex items-end justify-between">
          <div>
            {product.oldPrice && (
              <p className="text-xs text-muted-foreground line-through">
                {formatPrice(product.oldPrice)}
              </p>
            )}
            <p className="text-lg font-extrabold text-gradient">{formatPrice(product.price)}</p>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <a
            href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl gradient-brand px-3 py-2.5 text-xs font-bold text-white transition-transform hover:scale-[1.02]"
          >
            <Phone className="h-4 w-4" /> تماس
          </a>
          <a
            href={waLink}
            target="_blank"
            rel="noopener"
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#25D366] px-3 py-2.5 text-xs font-bold text-white transition-transform hover:scale-[1.02]"
          >
            <MessageCircle className="h-4 w-4" /> واتساپ
          </a>
        </div>
      </div>
    </article>
  );
}

function Spec({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <li className="flex items-center gap-1.5 rounded-lg bg-muted/60 px-2 py-1.5">
      <span className="text-primary">{icon}</span>
      <span className="truncate">{text}</span>
    </li>
  );
}

function PhoneShape() {
  return (
    <div className="relative h-[75%] w-[42%] rounded-[2rem] bg-black/25 backdrop-blur-sm ring-1 ring-white/20 shadow-2xl">
      <div className="absolute inset-1.5 rounded-[1.7rem] bg-gradient-to-br from-white/10 to-transparent" />
      <div className="absolute left-1/2 top-2 h-1.5 w-14 -translate-x-1/2 rounded-full bg-black/50" />
      <div className="absolute right-3 top-3 h-10 w-10 rounded-2xl bg-black/40 ring-1 ring-white/10" />
    </div>
  );
}
