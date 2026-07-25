import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, ArrowLeft } from "lucide-react";
import { SiteLayout } from "@/components/site-layout";
import { PageHero } from "./products";
import { blogPosts } from "@/lib/blog-data";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "بلاگ | فروشگاه آسیا" },
      { name: "description", content: "مقالات، اخبار و راهنماهای خرید آیفون در بلاگ فروشگاه آسیا." },
      { property: "og:title", content: "بلاگ فروشگاه آسیا" },
      { property: "og:description", content: "جدیدترین مقالات دنیای اپل و راهنماهای خرید آیفون." },
    ],
  }),
  component: BlogPage,
});

function BlogPage() {
  return (
    <SiteLayout>
      <PageHero title="بلاگ فروشگاه آسیا" subtitle="جدیدترین مقالات، اخبار دنیای اپل و راهنماهای خرید آیفون" />

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((p) => (
            <Link
              key={p.slug}
              to="/blog/$slug"
              params={{ slug: p.slug }}
              className="group overflow-hidden rounded-3xl border border-border bg-card shadow-card transition hover:-translate-y-1 hover:shadow-elevated"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                <img
                  src={p.image}
                  alt={p.title}
                  loading="lazy"
                  width={1024}
                  height={640}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <span className="absolute right-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[10px] font-bold text-primary shadow">
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
            </Link>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
