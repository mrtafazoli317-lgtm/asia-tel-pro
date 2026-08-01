import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { CartProvider } from "../lib/cart-context";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-gradient">۴۰۴</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">صفحه یافت نشد</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          صفحه‌ای که به دنبال آن هستید وجود ندارد یا جابجا شده است.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md gradient-brand px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-105"
          >
            بازگشت به خانه
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          صفحه بارگذاری نشد
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          مشکلی پیش آمد. لطفاً دوباره تلاش کنید یا به صفحه اصلی بازگردید.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md gradient-brand px-5 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            تلاش دوباره
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-5 py-2.5 text-sm font-medium text-foreground hover:bg-accent"
          >
            خانه
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "فروشگاه آسیا | مرجع تخصصی خرید آیفون در اراک" },
      {
        name: "description",
        content:
          "خرید آنلاین انواع آیفون ۱۱ تا ۱۷ پرو مکس با قیمت روز، ضمانت اصالت و ارسال سریع از فروشگاه آسیا اراک.",
      },
      { name: "author", content: "فروشگاه آسیا" },
      { property: "og:title", content: "فروشگاه آسیا | مرجع تخصصی خرید آیفون در اراک" },
      {
        property: "og:description",
        content: "خرید آنلاین انواع آیفون ۱۱ تا ۱۷ پرو مکس با قیمت روز، ضمانت اصالت و ارسال سریع از فروشگاه آسیا اراک.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "فروشگاه آسیا | مرجع تخصصی خرید آیفون در اراک" },
      { name: "twitter:description", content: "خرید آنلاین انواع آیفون ۱۱ تا ۱۷ پرو مکس با قیمت روز، ضمانت اصالت و ارسال سریع از فروشگاه آسیا اراک." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/f7c9f384-9b8f-4377-8504-3c341a30b29f/id-preview-8365288e--7dcb9b1c-63e9-486d-abdd-de862d1c3d16.lovable.app-1784574407696.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/f7c9f384-9b8f-4377-8504-3c341a30b29f/id-preview-8365288e--7dcb9b1c-63e9-486d-abdd-de862d1c3d16.lovable.app-1784574407696.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700;800;900&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <HeadContent />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                var l = window.location;
                if (l.search[1] === "/") {
                  var decoded = l.search.slice(1).split("&").map(function (s) {
                    return s.replace(/~and~/g, "&");
                  }).join("?");
                  window.history.replaceState(null, null, l.pathname.slice(0, -1) + decoded + l.hash);
                }
              })();
            `,
          }}
        />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <Outlet />
      </CartProvider>
    </QueryClientProvider>
  );
}
