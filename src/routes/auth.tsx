import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/logo";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [{ title: "ورود مدیر | فروشگاه آسیا" }],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin" });
    });
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    setMsg(null);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/admin" });
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin + "/admin" },
        });
        if (error) throw error;
        setMsg(
          "حساب ساخته شد. اگر تایید ایمیل فعال است، اینباکس خود را بررسی کنید. سپس نقش ادمین باید توسط مدیر سیستم برای شما فعال شود.",
        );
      }
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "خطا در ورود");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl bg-white/90 backdrop-blur-xl shadow-2xl border border-white/60 p-8">
        <div className="flex justify-center mb-6">
          <Link to="/">
            <Logo />
          </Link>
        </div>
        <h1 className="text-2xl font-bold text-center mb-1">
          {mode === "signin" ? "ورود به پنل مدیریت" : "ایجاد حساب مدیر"}
        </h1>
        <p className="text-sm text-muted-foreground text-center mb-6">
          {mode === "signin"
            ? "با ایمیل و رمز عبور خود وارد شوید"
            : "پس از ثبت‌نام، دسترسی ادمین باید توسط مدیر سیستم فعال شود"}
        </p>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-1.5">ایمیل</label>
            <input
              type="email"
              required
              dir="ltr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5">رمز عبور</label>
            <input
              type="password"
              required
              minLength={6}
              dir="ltr"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {err && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{err}</p>}
          {msg && <p className="text-sm text-green-700 bg-green-50 p-3 rounded-lg">{msg}</p>}

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-xl gradient-brand text-white font-semibold py-3 shadow-glow hover:opacity-95 disabled:opacity-60 inline-flex items-center justify-center gap-2"
          >
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            {mode === "signin" ? "ورود" : "ثبت‌نام"}
          </button>
        </form>

        <button
          onClick={() => setMode((m) => (m === "signin" ? "signup" : "signin"))}
          className="mt-4 w-full text-sm text-muted-foreground hover:text-primary"
        >
          {mode === "signin" ? "حساب ندارید؟ ثبت‌نام" : "قبلاً حساب ساخته‌اید؟ ورود"}
        </button>

        <Link to="/" className="block mt-6 text-center text-xs text-muted-foreground hover:text-primary">
          بازگشت به سایت
        </Link>
      </div>
    </div>
  );
}
