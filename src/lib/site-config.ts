// Central editable site configuration. A future admin panel/CMS can replace
// this file with database-backed values without touching UI components.

export const siteConfig = {
  name: "فروشگاه آسیا",
  nameEn: "Asia Mobile Store",
  tagline: "مرجع تخصصی آیفون در اراک",
  description:
    "ارائه‌دهنده انواع گوشی‌های آیفون با ضمانت اصالت، قیمت روز و مشاوره تخصصی رایگان.",
  city: "اراک، ایران",
  address: "اراک",
  phone: "+98 933 565 8051",
  phoneDisplay: "۰۹۳۳ ۵۶۵ ۸۰۵۱",
  whatsapp: "989335658051",
  email: "info@asia-mobile.ir",
  workingHours: "شنبه تا پنجشنبه ۱۰ صبح تا ۹ شب",
  socials: {
    instagram: "https://instagram.com/",
    telegram: "https://t.me/",
    whatsapp: "https://wa.me/989335658051",
  },
} as const;

export const nav = [
  { to: "/", label: "خانه" },
  { to: "/products", label: "محصولات" },
  { to: "/prices", label: "قیمت روز" },
  { to: "/blog", label: "بلاگ" },
  { to: "/about", label: "درباره ما" },
  { to: "/faq", label: "سوالات متداول" },
  { to: "/contact", label: "تماس با ما" },
] as const;
