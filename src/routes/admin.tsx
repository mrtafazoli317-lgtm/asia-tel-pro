import { createFileRoute, Outlet, Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/logo";
import {
  LayoutDashboard,
  Smartphone,
  Image as ImageIcon,
  FileText,
  Phone,
  LogOut,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { useEffect } from "react";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({ meta: [{ title: "پنل مدیریت | فروشگاه آسیا" }] }),
  component: AdminLayout,
});

const items = [
  { to: "/admin", label: "داشبورد", icon: LayoutDashboard, end: true },
  { to: "/admin/products", label: "محصولات و قیمت‌ها", icon: Smartphone },
  { to: "/admin/banners", label: "بنرها", icon: ImageIcon },
  { to: "/admin/blog", label: "مقالات بلاگ", icon: FileText },
  { to: "/admin/settings", label: "اطلاعات تماس", icon: Phone },
] as const;

function AdminLayout() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const { location } = useRouterState();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  if (loading || !user) {
    return (
      <div className="min-h-screen grid place-items-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen grid place-items-center p-6">
        <div className="max-w-md text-center rounded-2xl border p-8 bg-white shadow">
          <h2 className="text-xl font-bold mb-2">دسترسی محدود</h2>
          <p className="text-sm text-muted-foreground mb-2">
            حساب شما هنوز نقش ادمین ندارد.
          </p>
          <p className="text-xs text-muted-foreground mb-4 break-all" dir="ltr">
            User ID: <b>{user.id}</b>
          </p>
          <p className="text-xs text-muted-foreground mb-6">
            برای فعال‌سازی، این شناسه را برای مدیر سیستم بفرستید تا نقش ادمین به شما اختصاص یابد.
          </p>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              navigate({ to: "/auth" });
            }}
            className="rounded-full bg-muted px-5 py-2 text-sm hover:bg-muted/70"
          >
            خروج
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex" dir="rtl">
      <aside className="w-64 bg-white border-l border-border p-4 flex flex-col shrink-0 sticky top-0 h-screen">
        <div className="mb-6 px-2">
          <Logo />
          <p className="text-xs text-muted-foreground mt-1">پنل مدیریت</p>
        </div>
        <nav className="space-y-1 flex-1">
          {items.map((it) => {
            const active = it.end
              ? location.pathname === it.to
              : location.pathname === it.to || location.pathname.startsWith(it.to + "/");
            const Icon = it.icon;
            return (
              <Link
                key={it.to}
                to={it.to}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  active ? "gradient-brand text-white shadow-glow" : "text-foreground hover:bg-muted"
                }`}
              >
                <Icon className="h-4 w-4" />
                {it.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t pt-3 space-y-1">
          <Link
            to="/"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted"
          >
            <ExternalLink className="h-4 w-4" />
            نمایش سایت
          </Link>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              navigate({ to: "/auth" });
            }}
            className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-600 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" />
            خروج
          </button>
        </div>
      </aside>
      <main className="flex-1 p-6 lg:p-8 overflow-x-auto">
        <Outlet />
      </main>
    </div>
  );
}
