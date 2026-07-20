import { createFileRoute } from "@tanstack/react-router";
import { Award, Users, ShieldCheck, Heart } from "lucide-react";
import { SiteLayout } from "@/components/site-layout";
import { PageHero } from "./products";
import { siteConfig } from "@/lib/site-config";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "درباره ما | فروشگاه آسیا" },
      { name: "description", content: "آشنایی با فروشگاه آسیا، مرجع تخصصی خرید آیفون در اراک با بیش از ۱۰ سال تجربه." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <SiteLayout>
      <PageHero title="درباره فروشگاه آسیا" subtitle="بیش از یک دهه تجربه در ارائه بهترین گوشی‌های اپل به مردم عزیز ایران" />

      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="prose prose-lg max-w-none text-right leading-9 text-foreground">
          <p className="text-lg leading-9 text-muted-foreground">
            فروشگاه <span className="font-bold text-foreground">{siteConfig.name}</span> با بیش از یک دهه تجربه در زمینه
            واردات و فروش گوشی‌های آیفون در شهر {siteConfig.city.split("،")[0]}، توانسته اعتماد هزاران مشتری را در سراسر
            ایران جلب کند. ما تنها گوشی‌های اصل و دارای گارانتی معتبر عرضه می‌کنیم.
          </p>
          <p className="mt-6 leading-9 text-muted-foreground">
            هدف ما این است که تجربه خریدی مطمئن، شفاف و لوکس را برای علاقه‌مندان به محصولات اپل فراهم کنیم. کارشناسان
            متخصص ما همواره آماده پاسخگویی و مشاوره رایگان هستند تا شما بهترین انتخاب را داشته باشید.
          </p>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Value icon={<Award />} title="کیفیت برتر" desc="فقط کالای اصل و دارای گارانتی معتبر" />
          <Value icon={<ShieldCheck />} title="اعتماد" desc="فاکتور رسمی و ضمانت بازگشت وجه" />
          <Value icon={<Users />} title="۵۰۰+ مشتری" desc="مشتریان راضی از سراسر ایران" />
          <Value icon={<Heart />} title="خدمات پس از فروش" desc="پشتیبانی همیشگی و مشاوره رایگان" />
        </div>
      </section>
    </SiteLayout>
  );
}

function Value({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 text-center shadow-card">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl gradient-brand text-white shadow-glow">
        <div className="h-6 w-6">{icon}</div>
      </div>
      <h4 className="mt-4 font-bold text-foreground">{title}</h4>
      <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}
