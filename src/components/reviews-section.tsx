import { Star, Quote } from "lucide-react";

const reviews = [
  {
    name: "علی محمدی",
    city: "اراک",
    text: "آیفون ۱۶ پرو مکس رو از فروشگاه آسیا خریدم. اصالت کالا، بسته‌بندی و برخورد کارکنان فوق‌العاده بود. حتماً پیشنهاد می‌کنم.",
    rating: 5,
  },
  {
    name: "سارا احمدی",
    city: "قم",
    text: "قیمت‌ها واقعاً منصفانه بود و ارسال خیلی سریع انجام شد. مشاوره تخصصی قبل از خرید هم بسیار کمکم کرد.",
    rating: 5,
  },
  {
    name: "محمدرضا کریمی",
    city: "تهران",
    text: "چند دستگاه آیفون از این فروشگاه خریدم و همیشه رضایت داشتم. تیم پشتیبانی عالی و صادقانه پاسخگو هستند.",
    rating: 5,
  },
  {
    name: "زهرا حسینی",
    city: "اصفهان",
    text: "پیگیری و مشاوره خوب باعث شد آیفون ۱۵ رو با خیال راحت بخرم. ممنون از تیم حرفه‌ای فروشگاه آسیا.",
    rating: 5,
  },
];

export function ReviewsSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <p className="text-sm font-semibold text-primary">نظرات مشتریان</p>
        <h2 className="mt-2 text-3xl font-black text-foreground sm:text-4xl">اعتماد مشتریان، سرمایه ماست</h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">
          صدها مشتری از سراسر ایران تجربه خرید خود از فروشگاه آسیا را با ما به اشتراک گذاشته‌اند.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {reviews.map((r, i) => (
          <article
            key={i}
            className="group relative overflow-hidden rounded-3xl border border-border bg-card/70 p-6 shadow-card backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-elevated"
          >
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-primary/10 blur-2xl transition group-hover:bg-primary/20" />
            <Quote className="h-8 w-8 text-primary/40" />
            <p className="mt-3 min-h-[7rem] text-sm leading-7 text-foreground">{r.text}</p>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
              <div>
                <p className="text-sm font-bold text-foreground">{r.name}</p>
                <p className="text-xs text-muted-foreground">{r.city}</p>
              </div>
              <div className="flex gap-0.5">
                {Array.from({ length: r.rating }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
