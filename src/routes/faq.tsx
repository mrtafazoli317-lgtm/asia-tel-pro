import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { SiteLayout } from "@/components/site-layout";
import { PageHero } from "./products";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "سوالات متداول | فروشگاه آسیا" },
      { name: "description", content: "پاسخ به رایج‌ترین سوالات مشتریان درباره خرید آیفون از فروشگاه آسیا." },
    ],
  }),
  component: FaqPage,
});

const faqs = [
  { q: "آیا محصولات فروشگاه آسیا اصل هستند؟", a: "بله، تمامی گوشی‌های عرضه‌شده در فروشگاه آسیا ۱۰۰٪ اصل و دارای گارانتی معتبر می‌باشند و در صورت مغایرت، وجه شما بازگردانده می‌شود." },
  { q: "قیمت‌ها چه زمانی بروزرسانی می‌شود؟", a: "قیمت‌ها به‌صورت روزانه و بر اساس نرخ بازار در بخش «قیمت روز» بروزرسانی می‌شوند." },
  { q: "امکان ارسال به شهرستان وجود دارد؟", a: "بله، ارسال به تمامی نقاط ایران از طریق پست پیشتاز و تیپاکس با بسته‌بندی ایمن انجام می‌شود." },
  { q: "روش‌های پرداخت چگونه است؟", a: "پرداخت به‌صورت آنلاین، کارت‌به‌کارت، پرداخت درب فروشگاه و همچنین امکان اقساط با ضامن معتبر امکان‌پذیر است." },
  { q: "آیا امکان معاوضه گوشی وجود دارد؟", a: "بله، ما گوشی قدیمی شما را کارشناسی کرده و در صورت توافق در قیمت، معاوضه انجام می‌شود." },
  { q: "گارانتی گوشی‌ها چند ماه است؟", a: "گارانتی گوشی‌های نو معمولاً یک سال است و گوشی‌های کارکرده دارای ضمانت سلامت فیزیکی و فنی هستند." },
  { q: "چگونه می‌توانم مشاوره خرید بگیرم؟", a: "می‌توانید از طریق شماره تماس فروشگاه یا واتساپ با کارشناسان ما در ارتباط باشید. مشاوره کاملاً رایگان است." },
];

function FaqPage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <SiteLayout>
      <PageHero title="سوالات متداول" subtitle="پاسخ به پرسش‌های رایج مشتریان فروشگاه آسیا" />

      <section className="mx-auto max-w-3xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="space-y-3">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                className={`overflow-hidden rounded-2xl border bg-card shadow-card transition ${
                  isOpen ? "border-primary/30" : "border-border"
                }`}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-right"
                >
                  <span className="text-base font-bold text-foreground">{f.q}</span>
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition ${
                    isOpen ? "gradient-brand text-white" : "bg-muted text-muted-foreground"
                  }`}>
                    {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </span>
                </button>
                {isOpen && (
                  <div className="border-t border-border bg-muted/30 px-6 py-5 text-sm leading-7 text-muted-foreground">
                    {f.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </SiteLayout>
  );
}
