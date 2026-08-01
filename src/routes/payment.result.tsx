import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";
import { CheckCircle2, XCircle } from "lucide-react";
import { z } from "zod";

const searchSchema = z.object({
  status: z.enum(["paid", "failed"]).optional(),
  order_id: z.string().optional(),
});

export const Route = createFileRoute("/payment/result")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [{ title: "نتیجه پرداخت | فروشگاه آسیا" }],
  }),
  component: PaymentResultPage,
});

function PaymentResultPage() {
  const { status } = useSearch({ from: "/payment/result" });
  const paid = status === "paid";

  return (
    <SiteLayout>
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        {paid ? (
          <>
            <CheckCircle2 className="mx-auto mb-4 h-14 w-14 text-emerald-500" />
            <h1 className="text-2xl font-black text-foreground">پرداخت موفق</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              سفارش شما با موفقیت ثبت و پرداخت شد. کارشناسان ما به‌زودی برای هماهنگی ارسال با شما تماس می‌گیرند.
            </p>
          </>
        ) : (
          <>
            <XCircle className="mx-auto mb-4 h-14 w-14 text-destructive" />
            <h1 className="text-2xl font-black text-foreground">پرداخت ناموفق</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              متاسفانه پرداخت انجام نشد یا لغو شد. می‌توانید دوباره تلاش کنید.
            </p>
          </>
        )}

        <div className="mt-8 flex justify-center gap-3">
          <Link
            to="/account/dashboard"
            className="inline-flex items-center justify-center rounded-full gradient-brand px-6 py-3 text-sm font-bold text-white shadow-glow"
          >
            حساب کاربری من
          </Link>
          <Link
            to="/products"
            className="inline-flex items-center justify-center rounded-full border border-border px-6 py-3 text-sm font-bold text-foreground hover:bg-muted"
          >
            محصولات
          </Link>
        </div>
      </div>
    </SiteLayout>
  );
}
