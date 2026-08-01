import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SiteLayout } from "@/components/site-layout";
import { LogOut, Loader2, Package } from "lucide-react";
import { formatPrice } from "@/lib/products";

export const Route = createFileRoute("/account/dashboard")({
  head: () => ({
    meta: [{ title: "حساب کاربری من | فروشگاه آسیا" }],
  }),
  component: DashboardPage,
});

type Order = {
  id: string;
  product_name: string;
  customer_name: string;
  customer_phone: string;
  note: string | null;
  status: string;
  created_at: string;
};

type PurchaseOrder = {
  id: string;
  total_amount: number;
  status: string;
  created_at: string;
};

const statusLabel: Record<string, string> = {
  pending: "در انتظار بررسی",
  contacted: "تماس گرفته شد",
  completed: "تکمیل شد",
  cancelled: "لغو شد",
};

const statusColor: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  contacted: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const purchaseStatusLabel: Record<string, string> = {
  pending: "در انتظار پرداخت",
  paid: "پرداخت‌شده",
  failed: "پرداخت ناموفق",
  cancelled: "لغو شد",
};

const purchaseStatusColor: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  paid: "bg-emerald-100 text-emerald-700",
  failed: "bg-red-100 text-red-700",
  cancelled: "bg-slate-200 text-slate-700",
};

function DashboardPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        navigate({ to: "/account" });
        return;
      }
      setEmail(data.session.user.email ?? "");

      const { data: ordersData } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      const { data: purchaseData } = await supabase
        .from("purchase_orders")
        .select("id, total_amount, status, created_at")
        .order("created_at", { ascending: false });

      setOrders((ordersData as Order[]) ?? []);
      setPurchaseOrders((purchaseData as PurchaseOrder[]) ?? []);
      setLoading(false);
    })();
  }, [navigate]);

  async function logout() {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  }

  return (
    <SiteLayout>
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-foreground">حساب کاربری من</h1>
            <p className="mt-1 text-sm text-muted-foreground" dir="ltr">
              {email}
            </p>
          </div>
          <button
            onClick={logout}
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted"
          >
            <LogOut className="h-4 w-4" />
            خروج
          </button>
        </div>

        <h2 className="mb-4 text-lg font-bold text-foreground">خریدهای من</h2>

        {loading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : purchaseOrders.length === 0 ? (
          <p className="mb-10 text-sm text-muted-foreground">هنوز خریدی ثبت نکرده‌اید.</p>
        ) : (
          <div className="mb-10 space-y-3">
            {purchaseOrders.map((o) => (
              <div key={o.id} className="flex items-center justify-between rounded-2xl border border-border bg-card p-5 shadow-card">
                <div>
                  <p className="font-bold text-foreground">{formatPrice(o.total_amount)}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(o.created_at).toLocaleDateString("fa-IR")}
                  </p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${purchaseStatusColor[o.status] ?? ""}`}>
                  {purchaseStatusLabel[o.status] ?? o.status}
                </span>
              </div>
            ))}
          </div>
        )}

        <h2 className="mb-4 text-lg font-bold text-foreground">سفارش‌های من</h2>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">
            <Package className="mx-auto mb-3 h-8 w-8 opacity-50" />
            هنوز سفارشی ثبت نکرده‌اید.
            <div className="mt-4">
              <Link to="/products" className="text-primary hover:underline">
                مشاهده محصولات
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((o) => (
              <div key={o.id} className="rounded-2xl border border-border bg-card p-5 shadow-card">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-foreground">{o.product_name}</h3>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColor[o.status] ?? ""}`}>
                    {statusLabel[o.status] ?? o.status}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  تاریخ ثبت: {new Date(o.created_at).toLocaleDateString("fa-IR")}
                </p>
                {o.note && <p className="mt-1 text-sm text-muted-foreground">توضیحات: {o.note}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
