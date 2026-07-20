import { createFileRoute } from "@tanstack/react-router";
import { Newspaper, Clock, ArrowLeft } from "lucide-react";
import { SiteLayout } from "@/components/site-layout";
import { PageHero } from "./products";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "بلاگ | فروشگاه آسیا" },
      { name: "description", content: "مقالات، اخبار و راهنماهای خرید آیفون در بلاگ فروشگاه آسیا." },
    ],
  }),
  component: BlogPage,
});

const posts = [
  {
    id: 1,
    title: "معرفی کامل آیفون ۱۷ پرو مکس؛ نسل جدید پرچمداران اپل",
    excerpt: "بررسی تخصصی طراحی، عملکرد و دوربین جدیدترین گوشی اپل و مقایسه با نسل قبل.",
    category: "بررسی محصول",
    time: "۸ دقیقه مطالعه",
    color: "from-slate-800 to-slate-600",
  },
  {
    id: 2,
    title: "راهنمای جامع خرید آیفون دست‌دوم؛ چه نکاتی را بررسی کنیم؟",
    excerpt: "قبل از خرید آیفون کارکرده حتماً این چک‌لیست را دنبال کنید تا خرید مطمئنی داشته باشید.",
    category: "راهنمای خرید",
    time: "۶ دقیقه مطالعه",
    color: "from-orange-500 to-amber-500",
  },
  {
    id: 3,
    title: "مقایسه آیفون ۱۵ پرو مکس و آیفون ۱۶ پرو مکس",
    excerpt: "دو پرچمدار اپل زیر ذره‌بین؛ کدام یک ارزش خرید بیشتری دارد؟",
    category: "مقایسه",
    time: "۵ دقیقه مطالعه",
    color: "from-indigo-600 to-purple-700",
  },
  {
    id: 4,
    title: "آموزش انتقال اطلاعات از اندروید به آیفون",
    excerpt: "به سادگی و بدون از دست دادن اطلاعات، به دنیای iOS مهاجرت کنید.",
    category: "آموزش",
    time: "۴ دقیقه مطالعه",
    color: "from-emerald-500 to-teal-600",
  },
  {
    id: 5,
    title: "بهترین لوازم جانبی برای آیفون شما",
    excerpt: "از قاب و محافظ صفحه تا شارژرهای مگ‌سیف؛ لیستی از بهترین‌ها.",
    category: "لوازم جانبی",
    time: "۷ دقیقه مطالعه",
    color: "from-rose-500 to-pink-600",
  },
  {
    id: 6,
    title: "نکات مهم درباره باتری آیفون و افزایش عمر آن",
    excerpt: "با رعایت این نکات ساده، سلامت باتری گوشی خود را بیشتر حفظ کنید.",
    category: "نکات فنی",
    time: "۵ دقیقه مطالعه",
    color: "from-cyan-500 to-blue-600",
  },
];

function BlogPage() {
  return (
    <SiteLayout>
      <PageHero title="بلاگ فروشگاه آسیا" subtitle="جدیدترین مقالات، اخبار دنیای اپل و راهنماهای خرید آیفون" />

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <article
              key={p.id}
              className="group overflow-hidden rounded-3xl border border-border bg-card shadow-card transition hover:-translate-y-1 hover:shadow-elevated"
            >
              <div className={`relative aspect-[16/10] bg-gradient-to-br ${p.color}`}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Newspaper className="h-16 w-16 text-white/40" />
                </div>
                <span className="absolute right-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[10px] font-bold text-primary">
                  {p.category}
                </span>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  {p.time}
                </div>
                <h3 className="mt-3 text-lg font-black leading-7 text-foreground transition group-hover:text-primary">
                  {p.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{p.excerpt}</p>
                <div className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary">
                  ادامه مطلب <ArrowLeft className="h-4 w-4" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
