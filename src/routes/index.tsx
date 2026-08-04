import { ClientOnly, createFileRoute, Link } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

const ElasticMesh = lazy(() => import("@/components/effects/ElasticMesh.jsx"));

import { ArrowLeft, Shield, Truck, Headphones, Award, Sparkles, TrendingUp } from "lucide-react";
import heroImg from "@/assets/hero-iphone.jpg";
import { SiteLayout } from "@/components/site-layout";
import { ProductCard } from "@/components/product-card";
import { ReviewsSection } from "@/components/reviews-section";
import { useLiveProducts } from "@/lib/use-live-products";
import { siteConfig } from "@/lib/site-config";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "فروشگاه آسیا | مرجع تخصصی خرید آیفون در اراک" },
      {
        name: "description",
        content:
          "خرید آنلاین انواع آیفون ۱۱ تا ۱۷ پرو مکس با قیمت روز، ضمانت اصالت و ارسال سریع از فروشگاه آسیا اراک.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const allProducts = useLiveProducts();
  const featured = allProducts.filter((p) => p.featured);

  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative overflow-hidden gradient-hero text-white">
        <div className="absolute inset-0 opacity-70">
          <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-primary/30 blur-3xl" />
          <div className="absolute -bottom-40 -left-20 h-[400px] w-[400px] rounded-full bg-primary-glow/20 blur-3xl" />
        </div>

        <div className="pointer-events-none absolute inset-0 opacity-30">
          <ClientOnly fallback={null}>
            <Suspense fallback={null}>
              <ElasticMesh
                color1="#FF6B00"
                color2="#1a1a1a"
                highlight="#ffffff"
                gridOpacity={0.18}
                gridDensity={16}
                borderRadius={0}
                shading={0.6}
                resolution={18}
                className="pointer-events-auto"
              />
            </Suspense>
          </ClientOnly>
        </div>


        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-6 lg:px-8 lg:py-24">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/90 backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              معرفی آیفون ۱۷ پرو مکس در فروشگاه آسیا
            </span>

            <h1 className="mt-6 text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
              تجربه‌ای <span className="text-gradient">لوکس</span> از دنیای
              <br />
              گوشی‌های اپل
            </h1>

            <p className="mt-6 max-w-lg text-base leading-8 text-white/75 sm:text-lg">
              فروشگاه آسیا، مرجع تخصصی فروش آیفون در اراک با تضمین اصالت کالا،
              قیمت روز و ارسال سریع به سراسر ایران.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 rounded-full gradient-brand px-7 py-3.5 text-sm font-bold text-white shadow-glow transition-transform hover:scale-105"
              >
                مشاهده محصولات
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <Link
                to="/prices"
                className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-7 py-3.5 text-sm font-bold text-white backdrop-blur transition hover:bg-white/10"
              >
                <TrendingUp className="h-4 w-4" />
                قیمت روز
              </Link>
            </div>

            <div className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-white/10 pt-6">
              <Stat value="۵۰۰+" label="مشتری راضی" />
              <Stat value="۱۰+" label="سال تجربه" />
              <Stat value="۱۰۰٪" label="اصالت کالا" />
            </div>
          </div>

          <div className="relative animate-fade-up [animation-delay:150ms]">
            <div className="absolute inset-0 rounded-[3rem] bg-primary/20 blur-3xl" />
            <img
              src={heroImg}
              alt="آیفون ۱۷ پرو مکس"
              width={1600}
              height={1200}
              className="relative mx-auto max-h-[560px] w-auto animate-float object-contain drop-shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Feature icon={<Shield />} title="ضمانت اصالت" desc="۱۰۰٪ کالای اصل با گارانتی معتبر" />
          <Feature icon={<Truck />} title="ارسال سریع" desc="ارسال به سراسر ایران در کوتاه‌ترین زمان" />
          <Feature icon={<Headphones />} title="مشاوره تخصصی" desc="راهنمایی رایگان قبل و بعد از خرید" />
          <Feature icon={<Award />} title="بهترین قیمت" desc="قیمت رقابتی و به‌روز روزانه بازار" />
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-primary">پرفروش‌ترین‌ها</p>
            <h2 className="mt-2 text-3xl font-black text-foreground sm:text-4xl">
              محصولات ویژه فروشگاه
            </h2>
          </div>
          <Link
            to="/products"
            className="hidden shrink-0 items-center gap-1 text-sm font-bold text-primary hover:underline sm:inline-flex"
          >
            مشاهده همه
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* REVIEWS */}
      <ReviewsSection />

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2rem] gradient-brand p-10 text-white sm:p-14">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-black/10 blur-2xl" />
          <div className="relative flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="text-2xl font-black sm:text-3xl">
                برای مشاوره و خرید همین حالا با ما تماس بگیرید
              </h3>
              <p className="mt-2 text-white/85">
                کارشناسان فروشگاه آسیا در {siteConfig.city} پاسخگوی شما هستند.
              </p>
            </div>
            <a
              href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
              className="shrink-0 rounded-full bg-white px-8 py-3.5 text-sm font-black text-primary shadow-elevated transition-transform hover:scale-105"
              dir="ltr"
            >
              {siteConfig.phone}
            </a>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-2xl font-black text-white">{value}</p>
      <p className="mt-1 text-xs text-white/60">{label}</p>
    </div>
  );
}

function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="group rounded-2xl border border-border bg-card p-6 shadow-card transition hover:-translate-y-1 hover:shadow-elevated">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition group-hover:gradient-brand group-hover:text-white">
        <div className="h-6 w-6">{icon}</div>
      </div>
      <h4 className="mt-4 text-base font-bold text-foreground">{title}</h4>
      <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}
