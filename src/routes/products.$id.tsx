import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Phone, MessageCircle, Shield, Truck, Award, CheckCircle2, XCircle, Cpu, Camera, HardDrive, Monitor } from "lucide-react";
import { SiteLayout } from "@/components/site-layout";
import { ProductCard } from "@/components/product-card";
import { formatPrice, getProducts, type Product } from "@/lib/products";
import { useLiveProducts } from "@/lib/use-live-products";
import { siteConfig } from "@/lib/site-config";

export const Route = createFileRoute("/products/$id")({
  loader: ({ params }) => {
    const product = getProducts().find((p) => p.id === params.id);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "محصول یافت نشد | فروشگاه آسیا" }, { name: "robots", content: "noindex" }] };
    }
    const { product } = loaderData;
    const title = `${product.name} | خرید با قیمت روز از فروشگاه آسیا`;
    const desc = `خرید ${product.name} با ${product.storage}، تراشه ${product.chip}، دوربین ${product.camera} و ضمانت اصالت از فروشگاه آسیا اراک.`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "product" },
        { property: "og:url", content: `https://asia-tel-pro.lovable.app/products/${product.id}` },
      ],
      links: [{ rel: "canonical", href: `https://asia-tel-pro.lovable.app/products/${product.id}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            description: desc,
            brand: { "@type": "Brand", name: "Apple" },
            offers: {
              "@type": "Offer",
              price: product.price,
              priceCurrency: "IRT",
              availability: product.inStock
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
            },
          }),
        },
      ],
    };
  },
  notFoundComponent: () => (
    <SiteLayout>
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="text-3xl font-black text-foreground">محصول یافت نشد</h1>
        <p className="mt-3 text-muted-foreground">لطفاً از لیست محصولات، مدل مورد نظر خود را انتخاب کنید.</p>
        <Link to="/products" className="mt-6 inline-flex items-center gap-2 rounded-full gradient-brand px-6 py-3 text-sm font-bold text-white shadow-glow">
          بازگشت به محصولات <ArrowLeft className="h-4 w-4" />
        </Link>
      </div>
    </SiteLayout>
  ),
  component: ProductDetailPage,
});

function ProductDetailPage() {
  const { product: staticProduct } = Route.useLoaderData();
  const all = useLiveProducts();
  const product = all.find((p) => p.id === staticProduct.id) ?? staticProduct;
  const related = all.filter((p) => p.series === product.series && p.id !== product.id).slice(0, 4);

  const waLink = `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(
    `سلام، در مورد ${product.name} می‌خواستم راهنمایی بگیرم.`
  )}`;

  return (
    <SiteLayout>
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-primary">خانه</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-primary">محصولات</Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>
      </div>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Visual */}
          <div className={`relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br ${product.color} aspect-square shadow-elevated`}>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_65%)]" />
            <img
              src={product.image}
              alt={product.name}
              width={1024}
              height={1024}
              className="absolute inset-0 h-full w-full object-contain p-8 drop-shadow-2xl"
            />

            <div className="absolute top-5 right-5 flex flex-col gap-2">
              {product.featured && (
                <span className="rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold text-primary">پرفروش</span>
              )}
              {product.oldPrice && (
                <span className="rounded-full bg-destructive px-3 py-1 text-[11px] font-bold text-white">تخفیف ویژه</span>
              )}
            </div>
          </div>

          {/* Info */}
          <div>
            <p className="text-sm font-semibold text-primary">{product.series} · {product.year}</p>
            <h1 className="mt-2 text-3xl font-black text-foreground sm:text-4xl">{product.name}</h1>

            <div className="mt-4 flex items-center gap-2">
              {product.inStock ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                  <CheckCircle2 className="h-3.5 w-3.5" /> موجود در انبار
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-200 px-3 py-1 text-xs font-bold text-slate-700">
                  <XCircle className="h-3.5 w-3.5" /> ناموجود
                </span>
              )}
              <span className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">
                <Shield className="h-3.5 w-3.5" /> ضمانت اصالت
              </span>
            </div>

            <div className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-card">
              {product.oldPrice && (
                <p className="text-sm text-muted-foreground line-through">{formatPrice(product.oldPrice)}</p>
              )}
              <p className="text-3xl font-black text-gradient sm:text-4xl">{formatPrice(product.price)}</p>
              <p className="mt-2 text-xs text-muted-foreground">قیمت به‌روز بازار — برای مشاوره و ثبت سفارش تماس بگیرید.</p>

              <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                <a
                  href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl gradient-brand px-5 py-3 text-sm font-bold text-white shadow-glow transition-transform hover:scale-[1.02]"
                >
                  <Phone className="h-4 w-4" /> تماس فوری
                </a>
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-3 text-sm font-bold text-white transition-transform hover:scale-[1.02]"
                >
                  <MessageCircle className="h-4 w-4" /> استعلام در واتساپ
                </a>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <SpecBox icon={<HardDrive className="h-4 w-4" />} label="حافظه" value={product.storage} />
              <SpecBox icon={<Cpu className="h-4 w-4" />} label="پردازنده" value={product.chip} />
              <SpecBox icon={<Monitor className="h-4 w-4" />} label="نمایشگر" value={product.display} />
              <SpecBox icon={<Camera className="h-4 w-4" />} label="دوربین" value={product.camera} />
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3 text-xs">
              <Perk icon={<Shield className="h-4 w-4" />} label="اصالت کالا" />
              <Perk icon={<Truck className="h-4 w-4" />} label="ارسال سریع" />
              <Perk icon={<Award className="h-4 w-4" />} label="بهترین قیمت" />
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <h2 className="mb-6 text-2xl font-black text-foreground">محصولات مرتبط</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p: Product) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </SiteLayout>
  );
}

function SpecBox({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-card">
      <div className="flex items-center gap-2 text-primary">{icon}<span className="text-[11px] font-bold text-muted-foreground">{label}</span></div>
      <p className="mt-1 text-sm font-bold text-foreground">{value}</p>
    </div>
  );
}

function Perk({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center justify-center gap-1.5 rounded-xl bg-muted px-3 py-2 font-bold text-foreground">
      <span className="text-primary">{icon}</span>
      {label}
    </div>
  );
}
