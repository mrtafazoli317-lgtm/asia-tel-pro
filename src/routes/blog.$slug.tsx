import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Clock, ArrowLeft } from "lucide-react";
import { SiteLayout } from "@/components/site-layout";
import { getPostBySlug, blogPosts } from "@/lib/blog-data";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = getPostBySlug(params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "مقاله یافت نشد | فروشگاه آسیا" }, { name: "robots", content: "noindex" }] };
    }
    const p = loaderData.post;
    return {
      meta: [
        { title: `${p.title} | بلاگ فروشگاه آسیا` },
        { name: "description", content: p.excerpt },
        { property: "og:title", content: p.title },
        { property: "og:description", content: p.excerpt },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: NotFoundPost,
  component: BlogPostPage,
});

function NotFoundPost() {
  return (
    <SiteLayout>
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="text-3xl font-black">مقاله یافت نشد</h1>
        <Link to="/blog" className="mt-6 inline-flex items-center gap-1 text-primary font-bold">
          بازگشت به بلاگ <ArrowLeft className="h-4 w-4" />
        </Link>
      </div>
    </SiteLayout>
  );
}

function BlogPostPage() {
  const { post } = Route.useLoaderData();
  const related = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <SiteLayout>
      <article className="mx-auto max-w-3xl px-4 pt-8 pb-16 sm:px-6 lg:px-8">
        <Link to="/blog" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
          بازگشت به بلاگ <ArrowLeft className="h-4 w-4" />
        </Link>

        <div className="mt-6 flex flex-wrap items-center gap-3 text-xs">
          <span className="rounded-full bg-primary/10 px-3 py-1 font-bold text-primary">{post.category}</span>
          <span className="inline-flex items-center gap-1 text-muted-foreground">
            <Clock className="h-3.5 w-3.5" /> {post.time}
          </span>
        </div>

        <h1 className="mt-4 text-3xl font-black leading-tight sm:text-4xl">{post.title}</h1>
        <p className="mt-3 text-lg text-muted-foreground">{post.excerpt}</p>

        <div className="mt-8 overflow-hidden rounded-3xl border border-border shadow-elevated">
          <img
            src={post.image}
            alt={post.title}
            width={1024}
            height={640}
            className="h-auto w-full object-cover"
          />
        </div>

        <div className="mt-8 space-y-5 text-[15px] leading-8 text-foreground/90">
          {post.content.map((para: string, i: number) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </article>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-2xl font-black">مقالات مرتبط</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((p) => (
            <Link
              key={p.slug}
              to="/blog/$slug"
              params={{ slug: p.slug }}
              className="group overflow-hidden rounded-2xl border border-border bg-card shadow-card transition hover:-translate-y-1 hover:shadow-elevated"
            >
              <div className="aspect-[16/10] overflow-hidden bg-muted">
                <img
                  src={p.image}
                  alt={p.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <h3 className="text-base font-bold leading-6 group-hover:text-primary">{p.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
