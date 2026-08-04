import { createFileRoute } from "@tanstack/react-router";
import { CalendarClock, TrendingDown, TrendingUp } from "lucide-react";
import { SiteLayout } from "@/components/site-layout";
import { PageHero } from "./products";
import { formatPrice } from "@/lib/products";
import { useLiveProducts } from "@/lib/use-live-products";

export const Route = createFileRoute("/prices")({
  head: () => ({
    meta: [
      { title: "قیمت روز آیفون | فروشگاه آسیا" },
      { name: "description", content: "لیست به‌روز قیمت گوشی‌های آیفون در فروشگاه آسیا اراک، بروزرسانی روزانه." },
    ],
  }),
  component: PricesPage,
});

function PricesPage() {
  const products = useLiveProducts();
  const today = new Date().toLocaleDateString("fa-IR");

  return (
    <SiteLayout>
      <PageHero title="لیست قیمت روز آیفون" subtitle="قیمت‌ها روزانه بروزرسانی می‌شوند تا شما بهترین انتخاب را داشته باشید." />

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between rounded-2xl border border-border bg-accent/40 p-4 text-sm">
          <div className="flex items-center gap-2 text-foreground">
            <CalendarClock className="h-4 w-4 text-primary" />
            آخرین بروزرسانی: {today}
          </div>
          <span className="hidden text-muted-foreground sm:block">قیمت‌ها به تومان</span>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
          <table className="w-full text-right text-sm">
            <thead className="bg-muted text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-4 font-bold">مدل</th>
                <th className="hidden px-4 py-4 font-bold sm:table-cell">حافظه</th>
                <th className="hidden px-4 py-4 font-bold md:table-cell">تراشه</th>
                <th className="px-4 py-4 font-bold">قیمت</th>
                <th className="px-4 py-4 font-bold">وضعیت</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map((p) => (
                <tr key={p.id} className="transition hover:bg-muted/40">
                  <td className="px-4 py-4 font-bold text-foreground">{p.name}</td>
                  <td className="hidden px-4 py-4 text-muted-foreground sm:table-cell">{p.storage}</td>
                  <td className="hidden px-4 py-4 text-muted-foreground md:table-cell">{p.chip}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-gradient">{formatPrice(p.price)}</span>
                      {p.oldPrice && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                          <TrendingDown className="h-3 w-3" /> ارزان‌تر
                        </span>
                      )}
                      {!p.oldPrice && p.year >= 2025 && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                          <TrendingUp className="h-3 w-3" /> جدید
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    {p.inStock ? (
                      <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold text-emerald-700">موجود</span>
                    ) : (
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-700">ناموجود</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          برای اطلاع از موجودی لحظه‌ای و شرایط پرداخت لطفاً با فروشگاه تماس بگیرید.
        </p>
      </section>
    </SiteLayout>
  );
}
