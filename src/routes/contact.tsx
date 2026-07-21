import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Phone, MapPin, Mail, MessageCircle, Clock, Send } from "lucide-react";
import { SiteLayout } from "@/components/site-layout";
import { PageHero } from "./products";
import { siteConfig } from "@/lib/site-config";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "تماس با ما | فروشگاه آسیا" },
      { name: "description", content: "راه‌های ارتباط با فروشگاه آسیا در اراک؛ تلفن، واتساپ و آدرس." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <SiteLayout>
      <PageHero title="تماس با ما" subtitle="ما همیشه آماده پاسخگویی به سوالات و راهنمایی شما هستیم" />

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <InfoCard icon={<Phone />} title="تماس تلفنی" value={siteConfig.phone} href={`tel:${siteConfig.phone.replace(/\s/g, "")}`} ltr />
          <InfoCard icon={<MessageCircle />} title="واتساپ" value="گفتگوی آنلاین" href={siteConfig.socials.whatsapp} />
          <InfoCard icon={<MapPin />} title="آدرس" value={siteConfig.address} />
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          {/* Form */}
          <div className="rounded-3xl border border-border bg-card p-8 shadow-card">
            <h3 className="text-xl font-black text-foreground">پیام خود را ارسال کنید</h3>
            <p className="mt-1 text-sm text-muted-foreground">در کوتاه‌ترین زمان با شما تماس خواهیم گرفت.</p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
                setTimeout(() => setSent(false), 4000);
                (e.target as HTMLFormElement).reset();
              }}
              className="mt-6 space-y-4"
            >
              <Field label="نام و نام خانوادگی" name="name" required />
              <Field label="شماره تماس" name="phone" type="tel" required />
              <Field label="موضوع" name="subject" />
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">پیام شما</label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  className="w-full resize-none rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none ring-primary/30 focus:ring-2"
                />
              </div>
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl gradient-brand px-6 py-3 text-sm font-bold text-white shadow-glow transition-transform hover:scale-[1.02]"
              >
                <Send className="h-4 w-4" />
                ارسال پیام
              </button>
              {sent && (
                <p className="rounded-xl bg-emerald-50 px-4 py-3 text-center text-sm font-bold text-emerald-700">
                  پیام شما با موفقیت ارسال شد. به‌زودی با شما تماس می‌گیریم.
                </p>
              )}
            </form>
          </div>

          {/* Info + Map */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-border bg-card p-8 shadow-card">
              <h3 className="text-xl font-black text-foreground">اطلاعات تماس</h3>
              <ul className="mt-5 space-y-4 text-sm">
                <Row icon={<MapPin />} label={siteConfig.address} />
                <Row icon={<Phone />} label={siteConfig.phone} ltr />
                <Row icon={<Mail />} label={siteConfig.email} ltr />
                <Row icon={<Clock />} label={siteConfig.workingHours} />
              </ul>
            </div>

            <div className="overflow-hidden rounded-3xl border border-border shadow-card">
              <iframe
                title="نقشه موقعیت فروشگاه آسیا در اراک"
                src="https://www.google.com/maps?q=Arak,Iran&z=13&output=embed"
                className="h-72 w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function InfoCard({ icon, title, value, href, ltr }: { icon: React.ReactNode; title: string; value: string; href?: string; ltr?: boolean }) {
  const Comp = href ? "a" : "div";
  return (
    <Comp
      href={href}
      className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-6 shadow-card transition hover:-translate-y-1 hover:shadow-elevated"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl gradient-brand text-white shadow-glow">
        <div className="h-5 w-5">{icon}</div>
      </div>
      <div className="min-w-0">
        <p className="text-xs font-bold text-muted-foreground">{title}</p>
        <p className="mt-1 truncate font-bold text-foreground group-hover:text-primary" dir={ltr ? "ltr" : undefined}>
          {value}
        </p>
      </div>
    </Comp>
  );
}

function Row({ icon, label, ltr }: { icon: React.ReactNode; label: string; ltr?: boolean }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <span className="h-4 w-4">{icon}</span>
      </span>
      <span className="text-foreground" dir={ltr ? "ltr" : undefined}>{label}</span>
    </li>
  );
}

function Field({ label, name, type = "text", required }: { label: string; name: string; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-foreground">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none ring-primary/30 focus:ring-2"
      />
    </div>
  );
}
