import { Link, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Menu, X, Phone, MessageCircle, MapPin, Mail, Instagram, Send } from "lucide-react";
import { Logo } from "./logo";
import { siteConfig, nav } from "@/lib/site-config";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>{children}</main>
      <Footer />
      <FloatingContact />
    </div>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const { location } = useRouterState();

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="shrink-0">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          
            href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
            dir="ltr"
            className="inline-flex items-center gap-2 rounded-full gradient-brand px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition-transform hover:scale-105"
          >
            <Phone className="h-4 w-4" />
            <span dir="ltr" style={{ unicodeBidi: "isolate" }}>{siteConfig.phoneDisplay}</span>
          </a>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border lg:hidden"
          aria-label="منو"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background lg:hidden">
          <div className="mx-auto max-w-7xl space-y-1 px-4 py-4">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="block rounded-xl px-4 py-3 text-sm font-medium text-foreground hover:bg-muted"
              >
                {item.label}
              </Link>
            ))}
            
              href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
              className="mt-2 flex items-center justify-center gap-2 rounded-xl gradient-brand px-4 py-3 text-sm font-semibold text-white"
            >
              <Phone className="h-4 w-4" />
              تماس فوری
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-ink text-white/85">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Logo variant="white" />
            <p className="mt-4 max-w-md text-sm leading-7 text-white/70">
              {siteConfig.description} در فروشگاه آسیا اراک، بهترین قیمت‌های روز
              آیفون به‌همراه ضمانت اصالت و مشاوره تخصصی رایگان در انتظار شماست.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a href={siteConfig.socials.instagram} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-primary" aria-label="اینستاگرام">
                <Instagram className="h-5 w-5" />
              </a>
              <a href={siteConfig.socials.telegram} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-primary" aria-label="تلگرام">
                <Send className="h-5 w-5" />
              </a>
              <a href={siteConfig.socials.whatsapp} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-primary" aria-label="واتساپ">
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-bold text-white">دسترسی سریع</h4>
            <ul className="space-y-2 text-sm">
              {nav.map((n) => (
                <li key={n.to}>
                  <Link to={n.to} className="text-white/70 transition hover:text-primary">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-bold text-white">تماس با ما</h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{siteConfig.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-primary" />
                <a href={`tel:${siteConfig.phone.replace(/\s/g, "")}`} dir="ltr">
                  {siteConfig.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-primary" />
                <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/50 md:flex-row">
          <p>© {new Date().getFullYear()} فروشگاه آسیا — تمامی حقوق محفوظ است.</p>
          <p>طراحی شده با ❤ در اراک</p>
        </div>
      </div>
    </footer>
  );
}

function FloatingContact() {
  return (
    <div className="fixed bottom-5 left-5 z-30 flex flex-col gap-3">
      
        href={siteConfig.socials.whatsapp}
        target="_blank"
        rel="noopener"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-elevated transition-transform hover:scale-110"
        aria-label="واتساپ"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
      
        href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
        className="flex h-14 w-14 items-center justify-center rounded-full gradient-brand text-white shadow-glow transition-transform hover:scale-110"
        aria-label="تماس"
      >
        <Phone className="h-6 w-6" />
      </a>
    </div>
  );
}
