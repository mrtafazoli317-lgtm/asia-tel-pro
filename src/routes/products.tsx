import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { SiteLayout } from "@/components/site-layout";
import { ProductCard } from "@/components/product-card";
import { getProducts } from "@/lib/products";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "محصولات | فروشگاه آسیا" },
      { name: "description", content: "لیست کامل گوشی‌های آیفون از سری ۱۱ تا ۱۷ پرو مکس با قیمت روز و ضمانت اصالت." },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const all = getProducts();
  const series = useMemo(() => ["همه", ...Array.from(new Set(all.map((p) => p.series)))], [all]);
  const [active, setActive] = useState<string>("همه");
  const [q, setQ] = useState("");

  const filtered = all.filter((p) => {
    const matchSeries = active === "همه" || p.series === active;
    const matchSearch = q.trim() === "" || p.name.includes(q);
    return matchSeries && matchSearch;
  });

  return (
    <SiteLayout>
      <PageHero
        title="محصولات فروشگاه آسیا"
        subtitle="کامل‌ترین مجموعه گوشی‌های آیفون با ضمانت اصالت و قیمت رقابتی"
      />

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 shadow-card sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="جستجوی محصول..."
              className="w-full rounded-xl border border-input bg-background px-10 py-2.5 text-sm outline-none ring-primary/30 focus:ring-2"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {series.map((s) => (
              <button
                key={s}
                onClick={() => setActive(s)}
                className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                  active === s
                    ? "gradient-brand text-white shadow-glow"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="py-20 text-center text-muted-foreground">محصولی یافت نشد.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}

export function PageHero({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <section className="relative overflow-hidden gradient-hero text-white">
      <div className="absolute -top-20 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/30 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h1 className="text-3xl font-black sm:text-5xl">{title}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/75 sm:text-base">{subtitle}</p>
      </div>
    </section>
  );
}
