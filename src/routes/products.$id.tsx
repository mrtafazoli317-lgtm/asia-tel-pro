import * as React from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowLeft,
  Phone,
  MessageCircle,
  Shield,
  Truck,
  Award,
  CheckCircle2,
  XCircle,
  Cpu,
  Camera,
  HardDrive,
  Monitor,
} from "lucide-react";
import { SiteLayout } from "@/components/site-layout";
import { ProductCard } from "@/components/product-card";
import { formatPrice, getProducts, type Product } from "@/lib/products";
import { siteConfig } from "@/lib/site-config";

export const Route = createFileRoute("/products/$id")({
  loader: async ({ params }) => {
    const products = await getProducts();
    const product = products.find((p) => p.id === params.id);

    if (!product) throw notFound();

    const related = products
      .filter((p) => p.series === product.series && p.id !== product.id)
      .slice(0, 4);

    return { product, related };
  },
  head: ({ loaderData }) => {
    const { product } = loaderData;
    return {
      meta: [
        {
          title: `${product.name} ${product.storage} | آسیا تل پرو`,
          description: `خرید ${product.name} با ${product.storage} حافظه، ${product.chip}، ${product.camera} - قیمت: ${formatPrice(product.price)}`,
        },
        {
          property: "og:title",
          content: `${product.name} ${product.storage}`,
        },
        {
          property: "og:description",
          content: `خرید ${product.name} - قیمت: ${formatPrice(product.price)}`,
        },
        { property: "og:type", content: "product" },
        {
          property: "og:url",
          content: `https://asiatel.pro/products/${product.id}`,
        },
      ],
      links: [
        {
          rel: "canonical",
          href: `https://asiatel.pro/products/${product.id}`,
        },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            name: product.name,
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
      <div className="flex min-h-[50vh] flex-col items-center justify-center px-4">
        <h1 className="mb-4 text-2xl font-black">محصول یافت نشد</h1>
        <Link
          to="/products"
          className="text-primary underline-offset-4 hover:underline"
        >
          بازگشت به محصولات
        </Link>
      </div>
    </SiteLayout>
  ),
  component: ProductDetailPage,
});

function ProductDetailPage() {
  const { product, related } = Route.useLoaderData();

  const waLink = `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(
    `سلام، در مورد ${product.name} می‌خواستم راهنمایی بگیرم.`,
  )}`;

  return (
    <SiteLayout>
      <div className="mx-auto max-w-6xl px-4 py-6">
        <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground">
            خانه
          </Link>
          <span>/</span>
          <Link to="/products" className="hover:text-foreground">
            محصولات
          </Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        <section className="mb-12 grid gap-8 lg:grid-cols-2">
          <div
            className={`relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br ${product.color} aspect-square shadow-elevated`}
          >
            <img
              src={product.image}
              alt={product.name}
              width={1024}
              height={1024}
              className="absolute inset-0 h-full w-full object-contain p-8 drop-shadow-2xl"
            />
            {product.featured && (
              <span className="absolute right-4 top-4 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground shadow-lg">
                ویژه
              </span>
            )}
          </div>

          <div className="flex flex-col justify-center space-y-6">
            <div>
              <p className="mb-1 text-sm font-bold text-muted-foreground">
                {product.series} • {product.year}
              </p>
              <h1 className="mb-3 text-3xl font-black leading-tight text-foreground lg:text-4xl">
                {product.name}
              </h1>
              <div className="flex items-center gap-2">
                {product.inStock ? (
                  <>
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-bold text-green-600">
                      موجود در انبار
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-5 w-5 text-red-600" />
                    <span className="text-sm font-bold text-red-600">
                      ناموجود
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-2">
              {product.oldPrice && (
                <p className="text-lg text-muted-foreground line-through">
                  {formatPrice(product.oldPrice)}
                </p>
              )}
              <p className="text-3xl font-black text-foreground">
                {formatPrice(product.price)}
              </p>
            </div>

            <div className="flex gap-3">
              <a
                href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3 font-bold text-primary-foreground shadow-button transition-all hover:scale-105 hover:shadow-button-hover active:scale-95"
              >
                <Phone className="h-5 w-5" />
                تماس تلفنی
              </a>
              <a
                href={waLink}
                target="_blank"
                rel="noopener"
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-green-600 px-6 py-3 font-bold text-white shadow-button transition-all hover:scale-105 hover:shadow-button-hover active:scale-95"
              >
                <MessageCircle className="h-5 w-5" />
                واتساپ
              </a>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <SpecBox
                icon={<HardDrive className="h-4 w-4" />}
                label="حافظه"
                value={product.storage}
              />
              <SpecBox
                icon={<Cpu className="h-4 w-4" />}
                label="پردازنده"
                value={product.chip}
              />
              <SpecBox
                icon={<Monitor className="h-4 w-4" />}
                label="نمایشگر"
                value={product.display}
              />
              <SpecBox
                icon={<Camera className="h-4 w-4" />}
                label="دوربین"
                value={product.camera}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Perk icon={<Shield />} label="گارانتی اصالت" />
              <Perk icon={<Truck />} label="ارسال سریع" />
              <Perk icon={<Award />} label="بهترین قیمت" />
            </div>
          </div>
        </section>

        {related.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-2xl font-black text-foreground">
              محصولات مرتبط
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p: Product) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </SiteLayout>
  );
}

function SpecBox({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-card">
      <div className="flex items-center gap-2 text-primary">
        {icon}
        <span className="text-[11px] font-bold text-muted-foreground">
          {label}
        </span>
      </div>
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
