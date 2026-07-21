import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts, fetchBanners, fetchBlogPosts } from "@/lib/admin-data";
import { Smartphone, Image as ImageIcon, FileText, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: Dashboard,
});

function Dashboard() {
  const products = useQuery({ queryKey: ["products"], queryFn: fetchProducts });
  const banners = useQuery({ queryKey: ["banners"], queryFn: () => fetchBanners(false) });
  const posts = useQuery({ queryKey: ["blog_posts", "all"], queryFn: () => fetchBlogPosts(false) });

  const cards = [
    {
      label: "تعداد محصولات",
      value: products.data?.length ?? "—",
      icon: Smartphone,
      to: "/admin/products",
      color: "from-orange-500 to-red-500",
    },
    {
      label: "بنرها",
      value: banners.data?.length ?? "—",
      icon: ImageIcon,
      to: "/admin/banners",
      color: "from-blue-500 to-indigo-500",
    },
    {
      label: "مقالات بلاگ",
      value: posts.data?.length ?? "—",
      icon: FileText,
      to: "/admin/blog",
      color: "from-emerald-500 to-teal-500",
    },
    {
      label: "محصولات موجود",
      value: products.data?.filter((p) => p.in_stock).length ?? "—",
      icon: TrendingUp,
      to: "/admin/products",
      color: "from-purple-500 to-pink-500",
    },
  ];

  return (
    <div className="max-w-6xl">
      <h1 className="text-2xl font-bold mb-1">خوش آمدید</h1>
      <p className="text-muted-foreground mb-6">مدیریت محتوای فروشگاه آسیا</p>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.label}
              to={c.to}
              className="rounded-2xl bg-white border border-border p-5 shadow-sm hover:shadow-md transition"
            >
              <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${c.color} text-white mb-3`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="text-2xl font-bold">{c.value}</div>
              <div className="text-sm text-muted-foreground">{c.label}</div>
            </Link>
          );
        })}
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <Link
          to="/admin/products"
          className="rounded-2xl bg-white border p-6 hover:shadow-md transition"
        >
          <h3 className="font-bold text-lg mb-1">به‌روزرسانی سریع قیمت‌ها</h3>
          <p className="text-sm text-muted-foreground">
            قیمت روزانه همه مدل‌های آیفون را از صفحه محصولات ویرایش کنید.
          </p>
        </Link>
        <Link
          to="/admin/blog"
          className="rounded-2xl bg-white border p-6 hover:shadow-md transition"
        >
          <h3 className="font-bold text-lg mb-1">افزودن مقاله جدید</h3>
          <p className="text-sm text-muted-foreground">
            محتوای بلاگ خود را مدیریت کنید تا رتبه سئوی سایت بهبود یابد.
          </p>
        </Link>
      </div>
    </div>
  );
}
