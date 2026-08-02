import { Link, useNavigate } from "@tanstack/react-router";
import { Phone, MessageCircle, Cpu, Camera, HardDrive, Monitor, CheckCircle2, XCircle, ArrowLeft, ShoppingCart, Loader2 } from "lucide-react";
import { useState } from "react";
import { formatPrice, type Product } from "@/lib/products";
import { siteConfig } from "@/lib/site-config";
import { useCart } from "@/lib/cart-context";

export function ProductCard({ product }: { product: Product }) {
  const navigate = useNavigate();
  const { addToCart, loggedIn } = useCart();
  const [adding, setAdding] = useState(false);
  const waLink = `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(
    `سلام، در مورد ${product.name} می‌خواستم راهنمایی بگیرم.`,
  )}`;
.
  async function handleAddToCart() {
    if (!loggedIn) {
      navigate({ to: "/account" });
      return;
    }
    setAdding(true);
    try {
      await addToCart({ id: product.id, name: product.name, price: product.price, image: product.image });
    } finally {
      setAdding(false);
    }
  }

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card/80 shadow-card backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated">
      {/* Visual */}
      <div className={`relative aspect-[4/3] overflow-hidden bg-gradient-to-br ${product.color}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_65%)]" />
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          width={1024}
          height={1024}
          className="absolute inset-0 h-full w-full object-contain p-4 drop-shadow-2xl transition-transform duration-500 group-hover:scale-105"
        />
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
        <Link
          to="/products/$id"
          params={{ id: product.id }}
          className="text-lg font-extrabold text-foreground transition hover:text-primary"
        >
          {product.name}
        </Link>
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

        <button
          onClick={handleAddToCart}
          disabled={adding}
          className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl border-2 border-primary px-3 py-2.5 text-xs font-bold text-primary transition hover:bg-primary hover:text-white disabled:opacity-60"
        >
          {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShoppingCart className="h-4 w-4" />}
          افزودن به سبد خرید
        </button>

        <Link
          to="/products/$id"
          params={{ id: product.id }}
          className="mt-3 inline-flex items-center justify-center gap-1 text-xs font-bold text-primary hover:underline"
        >
          مشاهده جزئیات <ArrowLeft className="h-3.5 w-3.5" />
        </Link>
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

