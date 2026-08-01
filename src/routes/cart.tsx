import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/site-layout";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/products";
import { supabase } from "@/integrations/supabase/client";
import { Trash2, Minus, Plus, Loader2, ShoppingBag } from "lucide-react";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [{ title: "سبد خرید | فروشگاه آسیا" }],
  }),
  component: CartPage,
});

function CartPage() {
  const navigate = useNavigate();
  const { items, loading, loggedIn, total, updateQuantity, removeItem } = useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function checkout(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      if (!token) {
        navigate({ to: "/account" });
        return;
      }

      const { data, error } = await supabase.functions.invoke("zarinpal-request", {
        body: { customer_name: name, customer_phone: phone, address },
        headers: { Authorization: `Bearer ${token}` },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      window.location.href = data.payment_url;
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "خطا در اتصال به درگاه پرداخت");
      setBusy(false);
    }
  }

  if (!loading && !loggedIn) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-md px-4 py-24 text-center">
          <ShoppingBag className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
          <h1 className="text-xl font-bold text-foreground">برای مشاهده سبد خرید وارد شوید</h1>
          <Link
            to="/account"
            className="mt-6 inline-flex items-center justify-center rounded-full gradient-brand px-6 py-3 text-sm font-bold text-white shadow-glow"
          >
            ورود به حساب کاربری
          </Link>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-2xl font-black text-foreground">سبد خرید</h1>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">
            <ShoppingBag className="mx-auto mb-3 h-8 w-8 opacity-50" />
            سبد خرید شما خالی است.
            <div className="mt-4">
              <Link to="/products" className="text-primary hover:underline">
                مشاهده محصولات
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="space-y-3 lg:col-span-2">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-card">
                  {item.image && (
                    <img src={item.image} alt={item.product_name} className="h-16 w-16 shrink-0 rounded-xl object-contain" />
                  )}
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground">{item.product_name}</h3>
                    <p className="mt-1 text-sm text-primary font-bold">{formatPrice(item.price)}</p>
                  </div>
                  <div className="flex items-center gap-2 rounded-full border border-border px-2 py-1">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 text-muted-foreground hover:text-foreground">
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-5 text-center text-sm font-bold">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 text-muted-foreground hover:text-foreground">
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="p-2 text-muted-foreground hover:text-destructive" aria-label="حذف">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-card lg:sticky lg:top-24 h-fit">
              <div className="flex items-center justify-between text-lg font-black text-foreground">
                <span>جمع کل</span>
                <span className="text-gradient">{formatPrice(total)}</span>
              </div>

              <form onSubmit={checkout} className="mt-6 space-y-3">
                <input
                  type="text"
                  required
                  placeholder="نام و نام خانوادگی"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  type="tel"
                  required
                  dir="ltr"
                  placeholder="شماره موبایل"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
                />
                <textarea
                  required
                  rows={2}
                  placeholder="آدرس تحویل"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full resize-none rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
                />
                {err && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{err}</p>}
                <button
                  type="submit"
                  disabled={busy}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl gradient-brand px-5 py-3 text-sm font-bold text-white shadow-glow hover:opacity-95 disabled:opacity-60"
                >
                  {busy && <Loader2 className="h-4 w-4 animate-spin" />}
                  پرداخت آنلاین
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
