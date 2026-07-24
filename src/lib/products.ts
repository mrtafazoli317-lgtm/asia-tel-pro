// Editable product catalog. Replace with CMS/DB-backed source when admin
// panel is added — component code reads from getProducts() only.

import img17ProMax from "@/assets/products/iphone-17-pro-max.png";
import img17Pro from "@/assets/products/iphone-17-pro.png";
import img17Air from "@/assets/products/iphone-17-air.png";
import img17 from "@/assets/products/iphone-17.png";
import img16ProMax from "@/assets/products/iphone-16-pro-max.png";
import img16Pro from "@/assets/products/iphone-16-pro.png";
import img16Plus from "@/assets/products/iphone-16-plus.png";
import img16 from "@/assets/products/iphone-16.png";
import img15ProMax from "@/assets/products/iphone-15-pro-max.png";
import img15Pro from "@/assets/products/iphone-15-pro.png";
import img15Plus from "@/assets/products/iphone-15-plus.png";
import img15 from "@/assets/products/iphone-15.png";
import img14ProMax from "@/assets/products/iphone-14-pro-max.png";
import img14Pro from "@/assets/products/iphone-14-pro.png";
import img14Plus from "@/assets/products/iphone-14-plus.png";
import img14 from "@/assets/products/iphone-14.png";
import img13ProMax from "@/assets/products/iphone-13-pro-max.png";
import img13Pro from "@/assets/products/iphone-13-pro.png";
import img13 from "@/assets/products/iphone-13.png";
import img13Mini from "@/assets/products/iphone-13-mini.png";
import img12ProMax from "@/assets/products/iphone-12-pro-max.png";
import img12Pro from "@/assets/products/iphone-12-pro.png";
import img12 from "@/assets/products/iphone-12.png";
import img12Mini from "@/assets/products/iphone-12-mini.png";
import img11ProMax from "@/assets/products/iphone-11-pro-max.png";
import img11Pro from "@/assets/products/iphone-11-pro.png";
import img11 from "@/assets/products/iphone-11.png";

export type Product = {
  id: string;
  name: string;
  series: string;
  year: number;
  price: number; // in Toman
  oldPrice?: number;
  inStock: boolean;
  storage: string;
  display: string;
  chip: string;
  camera: string;
  color: string; // gradient background for card
  image: string;
  featured?: boolean;
};

const T = (n: number) => n; // helper for readability

const IMG: Record<string, string> = {
  "iphone-17-pro-max": img17ProMax,
  "iphone-17-pro": img17Pro,
  "iphone-17-air": img17Air,
  "iphone-17": img17,
  "iphone-16-pro-max": img16ProMax,
  "iphone-16-pro": img16Pro,
  "iphone-16-plus": img16Plus,
  "iphone-16": img16,
  "iphone-15-pro-max": img15ProMax,
  "iphone-15-pro": img15Pro,
  "iphone-15-plus": img15Plus,
  "iphone-15": img15,
  "iphone-14-pro-max": img14ProMax,
  "iphone-14-pro": img14Pro,
  "iphone-14-plus": img14Plus,
  "iphone-14": img14,
  "iphone-13-pro-max": img13ProMax,
  "iphone-13-pro": img13Pro,
  "iphone-13": img13,
  "iphone-13-mini": img13Mini,
  "iphone-12-pro-max": img12ProMax,
  "iphone-12-pro": img12Pro,
  "iphone-12": img12,
  "iphone-12-mini": img12Mini,
  "iphone-11-pro-max": img11ProMax,
  "iphone-11-pro": img11Pro,
  "iphone-11": img11,
};


const rawProducts: Omit<Product, "image">[] = [
  // iPhone 17 series
  { id: "iphone-17-pro-max", name: "آیفون ۱۷ پرو مکس", series: "iPhone 17", year: 2025, price: T(115_000_000), inStock: true, storage: "۲۵۶ گیگابایت", display: "۶.۹ اینچ Super Retina XDR", chip: "A19 Pro", camera: "سه‌گانه ۴۸ مگاپیکسل", color: "from-slate-900 to-slate-700", featured: true },
  { id: "iphone-17-pro", name: "آیفون ۱۷ پرو", series: "iPhone 17", year: 2025, price: T(98_000_000), inStock: true, storage: "۲۵۶ گیگابایت", display: "۶.۳ اینچ Super Retina XDR", chip: "A19 Pro", camera: "سه‌گانه ۴۸ مگاپیکسل", color: "from-neutral-800 to-neutral-600", featured: true },
  { id: "iphone-17-air", name: "آیفون ۱۷ ایر", series: "iPhone 17", year: 2025, price: T(82_000_000), inStock: true, storage: "۲۵۶ گیگابایت", display: "۶.۶ اینچ OLED فوق‌نازک", chip: "A19", camera: "دوگانه ۴۸ مگاپیکسل", color: "from-sky-200 to-slate-300", featured: true },
  { id: "iphone-17", name: "آیفون ۱۷", series: "iPhone 17", year: 2025, price: T(68_000_000), inStock: true, storage: "۱۲۸ گیگابایت", display: "۶.۱ اینچ Super Retina", chip: "A19", camera: "دوگانه ۴۸ مگاپیکسل", color: "from-blue-300 to-indigo-400" },

  // iPhone 16 series
  { id: "iphone-16-pro-max", name: "آیفون ۱۶ پرو مکس", series: "iPhone 16", year: 2024, price: T(92_000_000), oldPrice: T(98_000_000), inStock: true, storage: "۲۵۶ گیگابایت", display: "۶.۹ اینچ ProMotion", chip: "A18 Pro", camera: "سه‌گانه ۴۸ مگاپیکسل", color: "from-amber-100 to-amber-300", featured: true },
  { id: "iphone-16-pro", name: "آیفون ۱۶ پرو", series: "iPhone 16", year: 2024, price: T(78_000_000), inStock: true, storage: "۲۵۶ گیگابایت", display: "۶.۳ اینچ ProMotion", chip: "A18 Pro", camera: "سه‌گانه ۴۸ مگاپیکسل", color: "from-stone-300 to-stone-500" },
  { id: "iphone-16-plus", name: "آیفون ۱۶ پلاس", series: "iPhone 16", year: 2024, price: T(64_000_000), inStock: true, storage: "۱۲۸ گیگابایت", display: "۶.۷ اینچ Super Retina", chip: "A18", camera: "دوگانه ۴۸ مگاپیکسل", color: "from-teal-300 to-cyan-400" },
  { id: "iphone-16", name: "آیفون ۱۶", series: "iPhone 16", year: 2024, price: T(55_000_000), inStock: true, storage: "۱۲۸ گیگابایت", display: "۶.۱ اینچ Super Retina", chip: "A18", camera: "دوگانه ۴۸ مگاپیکسل", color: "from-pink-300 to-rose-400" },

  // iPhone 15 series
  { id: "iphone-15-pro-max", name: "آیفون ۱۵ پرو مکس", series: "iPhone 15", year: 2023, price: T(78_000_000), inStock: true, storage: "۲۵۶ گیگابایت", display: "۶.۷ اینچ ProMotion", chip: "A17 Pro", camera: "سه‌گانه ۴۸ مگاپیکسل", color: "from-neutral-700 to-neutral-900" },
  { id: "iphone-15-pro", name: "آیفون ۱۵ پرو", series: "iPhone 15", year: 2023, price: T(66_000_000), inStock: true, storage: "۱۲۸ گیگابایت", display: "۶.۱ اینچ ProMotion", chip: "A17 Pro", camera: "سه‌گانه ۴۸ مگاپیکسل", color: "from-blue-900 to-slate-800" },
  { id: "iphone-15-plus", name: "آیفون ۱۵ پلاس", series: "iPhone 15", year: 2023, price: T(52_000_000), inStock: true, storage: "۱۲۸ گیگابایت", display: "۶.۷ اینچ Super Retina", chip: "A16", camera: "دوگانه ۴۸ مگاپیکسل", color: "from-yellow-200 to-amber-300" },
  { id: "iphone-15", name: "آیفون ۱۵", series: "iPhone 15", year: 2023, price: T(44_000_000), inStock: true, storage: "۱۲۸ گیگابایت", display: "۶.۱ اینچ Super Retina", chip: "A16", camera: "دوگانه ۴۸ مگاپیکسل", color: "from-green-300 to-emerald-400" },

  // iPhone 14 series
  { id: "iphone-14-pro-max", name: "آیفون ۱۴ پرو مکس", series: "iPhone 14", year: 2022, price: T(62_000_000), inStock: true, storage: "۱۲۸ گیگابایت", display: "۶.۷ اینچ ProMotion", chip: "A16 Bionic", camera: "سه‌گانه ۴۸ مگاپیکسل", color: "from-purple-800 to-indigo-900" },
  { id: "iphone-14-pro", name: "آیفون ۱۴ پرو", series: "iPhone 14", year: 2022, price: T(52_000_000), inStock: true, storage: "۱۲۸ گیگابایت", display: "۶.۱ اینچ ProMotion", chip: "A16 Bionic", camera: "سه‌گانه ۴۸ مگاپیکسل", color: "from-violet-700 to-purple-800" },
  { id: "iphone-14-plus", name: "آیفون ۱۴ پلاس", series: "iPhone 14", year: 2022, price: T(42_000_000), inStock: true, storage: "۱۲۸ گیگابایت", display: "۶.۷ اینچ Super Retina", chip: "A15 Bionic", camera: "دوگانه ۱۲ مگاپیکسل", color: "from-sky-400 to-blue-500" },
  { id: "iphone-14", name: "آیفون ۱۴", series: "iPhone 14", year: 2022, price: T(36_000_000), inStock: true, storage: "۱۲۸ گیگابایت", display: "۶.۱ اینچ Super Retina", chip: "A15 Bionic", camera: "دوگانه ۱۲ مگاپیکسل", color: "from-red-400 to-red-600" },

  // iPhone 13 series
  { id: "iphone-13-pro-max", name: "آیفون ۱۳ پرو مکس", series: "iPhone 13", year: 2021, price: T(48_000_000), inStock: true, storage: "۱۲۸ گیگابایت", display: "۶.۷ اینچ ProMotion", chip: "A15 Bionic", camera: "سه‌گانه ۱۲ مگاپیکسل", color: "from-emerald-700 to-teal-800" },
  { id: "iphone-13-pro", name: "آیفون ۱۳ پرو", series: "iPhone 13", year: 2021, price: T(40_000_000), inStock: true, storage: "۱۲۸ گیگابایت", display: "۶.۱ اینچ ProMotion", chip: "A15 Bionic", camera: "سه‌گانه ۱۲ مگاپیکسل", color: "from-slate-500 to-slate-700" },
  { id: "iphone-13", name: "آیفون ۱۳", series: "iPhone 13", year: 2021, price: T(32_000_000), inStock: true, storage: "۱۲۸ گیگابایت", display: "۶.۱ اینچ Super Retina", chip: "A15 Bionic", camera: "دوگانه ۱۲ مگاپیکسل", color: "from-pink-400 to-rose-500" },
  { id: "iphone-13-mini", name: "آیفون ۱۳ مینی", series: "iPhone 13", year: 2021, price: T(28_000_000), inStock: false, storage: "۱۲۸ گیگابایت", display: "۵.۴ اینچ Super Retina", chip: "A15 Bionic", camera: "دوگانه ۱۲ مگاپیکسل", color: "from-blue-400 to-indigo-500" },

  // iPhone 12 series
  { id: "iphone-12-pro-max", name: "آیفون ۱۲ پرو مکس", series: "iPhone 12", year: 2020, price: T(36_000_000), inStock: true, storage: "۱۲۸ گیگابایت", display: "۶.۷ اینچ Super Retina", chip: "A14 Bionic", camera: "سه‌گانه ۱۲ مگاپیکسل", color: "from-blue-700 to-blue-900" },
  { id: "iphone-12-pro", name: "آیفون ۱۲ پرو", series: "iPhone 12", year: 2020, price: T(30_000_000), inStock: true, storage: "۱۲۸ گیگابایت", display: "۶.۱ اینچ Super Retina", chip: "A14 Bionic", camera: "سه‌گانه ۱۲ مگاپیکسل", color: "from-yellow-600 to-amber-700" },
  { id: "iphone-12", name: "آیفون ۱۲", series: "iPhone 12", year: 2020, price: T(24_000_000), inStock: true, storage: "۱۲۸ گیگابایت", display: "۶.۱ اینچ Super Retina", chip: "A14 Bionic", camera: "دوگانه ۱۲ مگاپیکسل", color: "from-purple-400 to-fuchsia-500" },
  { id: "iphone-12-mini", name: "آیفون ۱۲ مینی", series: "iPhone 12", year: 2020, price: T(20_000_000), inStock: false, storage: "۶۴ گیگابایت", display: "۵.۴ اینچ Super Retina", chip: "A14 Bionic", camera: "دوگانه ۱۲ مگاپیکسل", color: "from-green-400 to-teal-500" },

  // iPhone 11 series
  { id: "iphone-11-pro-max", name: "آیفون ۱۱ پرو مکس", series: "iPhone 11", year: 2019, price: T(22_000_000), inStock: true, storage: "۶۴ گیگابایت", display: "۶.۵ اینچ Super Retina XDR", chip: "A13 Bionic", camera: "سه‌گانه ۱۲ مگاپیکسل", color: "from-gray-700 to-gray-900" },
  { id: "iphone-11-pro", name: "آیفون ۱۱ پرو", series: "iPhone 11", year: 2019, price: T(18_000_000), inStock: true, storage: "۶۴ گیگابایت", display: "۵.۸ اینچ Super Retina XDR", chip: "A13 Bionic", camera: "سه‌گانه ۱۲ مگاپیکسل", color: "from-emerald-600 to-green-800" },
  { id: "iphone-11", name: "آیفون ۱۱", series: "iPhone 11", year: 2019, price: T(14_000_000), inStock: true, storage: "۶۴ گیگابایت", display: "۶.۱ اینچ Liquid Retina", chip: "A13 Bionic", camera: "دوگانه ۱۲ مگاپیکسل", color: "from-red-500 to-orange-500" },
];

export const products: Product[] = rawProducts.map((p) => ({
  ...p,
  image: IMG[p.id],
}));

export function formatPrice(toman: number): string {
  return toman.toLocaleString("fa-IR") + " تومان";
}

export function getProducts(): Product[] {
  return products;
}

export function getFeatured(): Product[] {
  return products.filter((p) => p.featured);
}

