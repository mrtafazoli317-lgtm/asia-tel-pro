import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, CheckCircle2 } from "lucide-react";

export function OrderForm({ productId, productName }: { productId: string; productName: string }) {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setLoggedIn(!!data.session));
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user.id;
      if (!userId) throw new Error("ابتدا وارد حساب کاربری خود شوید");

      const { error } = await supabase.from("orders").insert({
        user_id: userId,
        product_id: productId,
        product_name: productName,
        customer_name: name,
        customer_phone: phone,
        note: note || null,
      });

      if (error) throw error;

      setDone(true);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "خطا در ثبت سفارش");
    } finally {
      setBusy(false);
    }
  }

  if (loggedIn === null) return null;

  if (!loggedIn) {
    return (
      <div className="mt-4 rounded-2xl border border-dashed border-border p-5 text-center text-sm text-muted-foreground">
        برای ثبت سفارش آنلاین ابتدا{" "}
        <Link to="/account" className="font-semibold text-primary hover:underline">
          وارد حساب کاربری
        </Link>{" "}
        شوید.
      </div>
    );
  }

  if (done) {
    return (
      <div className="mt-4 flex items-center gap-2 rounded-2xl bg-emerald-50 p-5 text-sm font-medium text-emerald-700">
        <CheckCircle2 className="h-5 w-5 shrink-0" />
        سفارش شما ثبت شد. کارشناسان ما به‌زودی با شما تماس می‌گیرند.
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mt-4 space-y-3 rounded-2xl border border-border bg-card p-5 shadow-card">
      <h3 className="font-bold text-foreground">ثبت سفارش آنلاین</h3>
      <div>
        <input
          type="text"
          required
          placeholder="نام و نام خانوادگی"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      <div>
        <input
          type="tel"
          required
          dir="ltr"
          placeholder="شماره موبایل"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      <div>
        <textarea
          placeholder="توضیحات (اختیاری)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          className="w-full resize-none rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      {err && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{err}</p>}
      <button
        type="submit"
        disabled={busy}
        className="w-full inline-flex items-center justify-center gap-2 rounded-xl gradient-brand px-5 py-3 text-sm font-bold text-white shadow-glow hover:opacity-95 disabled:opacity-60"
      >
        {busy && <Loader2 className="h-4 w-4 animate-spin" />}
        ثبت سفارش
      </button>
    </form>
  );
}
