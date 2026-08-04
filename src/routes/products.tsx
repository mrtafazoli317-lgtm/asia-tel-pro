import img17ProMax from "@/assets/products/iphone-17-pro-max.png";
import img17Pro from "@/assets/products/iphone-17-pro.png";
import img17Air from "@/assets/products/iphone-17-air.png";
import img17 from "@/assets/products/iphone-17.png";

export type Product = {
  id: string;
  name: string;
  series: string;
  year: number;
  price: number;
  inStock: boolean;
  storage: string;
  display: string;
  chip: string;
  camera: string;
  color: string;
  image: string;
  featured?: boolean;
};


const products: Product[] = [
  {
    id:"iphone-17-pro-max",
    name:"آیفون ۱۷ پرو مکس",
    series:"iPhone 17",
    year:2025,
    price:389900000,
    inStock:true,
    storage:"۲۵۶ گیگابایت",
    display:"۶.۹ اینچ",
    chip:"A19 Pro",
    camera:"۴۸ مگاپیکسل",
    color:"from-slate-900 to-slate-700",
    image:img17ProMax,
    featured:true
  },

  {
    id:"iphone-17-pro",
    name:"آیفون ۱۷ پرو",
    series:"iPhone 17",
    year:2025,
    price:319900000,
    inStock:true,
    storage:"۲۵۶ گیگابایت",
    display:"۶.۳ اینچ",
    chip:"A19 Pro",
    camera:"۴۸ مگاپیکسل",
    color:"from-neutral-800 to-neutral-600",
    image:img17Pro
  },

  {
    id:"iphone-17-air",
    name:"آیفون ۱۷ ایر",
    series:"iPhone 17",
    year:2025,
    price:279900000,
    inStock:true,
    storage:"۲۵۶ گیگابایت",
    display:"۶.۶ اینچ",
    chip:"A19",
    camera:"۴۸ مگاپیکسل",
    color:"from-sky-200 to-slate-300",
    image:img17Air
  },

  {
    id:"iphone-17",
    name:"آیفون ۱۷",
    series:"iPhone 17",
    year:2025,
    price:239900000,
    inStock:true,
    storage:"۱۲۸ گیگابایت",
    display:"۶.۱ اینچ",
    chip:"A19",
    camera:"۴۸ مگاپیکسل",
    color:"from-blue-300 to-indigo-400",
    image:img17
  }
];


export async function getProducts(){
  return products;
}


export function getFeatured(){
  return products.filter(p=>p.featured);
}


export function formatPrice(price:number){
  return price.toLocaleString("fa-IR")+" تومان";
}


export {products as localProducts};
