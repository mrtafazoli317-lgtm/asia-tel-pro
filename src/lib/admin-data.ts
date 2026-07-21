import { supabase } from "@/integrations/supabase/client";

export type ProductRow = {
  id: string;
  name: string;
  series: string;
  year: number;
  price: number;
  old_price: number | null;
  in_stock: boolean;
  storage: string;
  display: string;
  chip: string;
  camera: string;
  color: string;
  image_url: string | null;
  featured: boolean;
  sort_order: number;
  updated_at: string;
};

export type BannerRow = {
  id: string;
  title: string;
  subtitle: string | null;
  image_url: string | null;
  link_url: string | null;
  active: boolean;
  sort_order: number;
};

export type BlogRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  cover_url: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type ContactSettings = {
  phone: string;
  phone_display: string;
  address: string;
  email: string;
  hours: string;
  instagram: string;
  telegram: string;
  whatsapp: string;
};

export function formatToman(n: number): string {
  return n.toLocaleString("fa-IR") + " تومان";
}

export async function fetchProducts(): Promise<ProductRow[]> {
  const { data, error } = await supabase
    .from("products" as never)
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data as unknown as ProductRow[]) ?? [];
}

export async function fetchProduct(id: string): Promise<ProductRow | null> {
  const { data, error } = await supabase
    .from("products" as never)
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return (data as unknown as ProductRow) ?? null;
}

export async function fetchBanners(activeOnly = false): Promise<BannerRow[]> {
  let q = supabase.from("banners" as never).select("*").order("sort_order", { ascending: true });
  if (activeOnly) q = q.eq("active", true);
  const { data, error } = await q;
  if (error) throw error;
  return (data as unknown as BannerRow[]) ?? [];
}

export async function fetchBlogPosts(publishedOnly = false): Promise<BlogRow[]> {
  let q = supabase.from("blog_posts" as never).select("*").order("created_at", { ascending: false });
  if (publishedOnly) q = q.eq("published", true);
  const { data, error } = await q;
  if (error) throw error;
  return (data as unknown as BlogRow[]) ?? [];
}

export async function fetchBlogPost(slug: string): Promise<BlogRow | null> {
  const { data, error } = await supabase
    .from("blog_posts" as never)
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return (data as unknown as BlogRow) ?? null;
}

export async function fetchContactSettings(): Promise<ContactSettings | null> {
  const { data, error } = await supabase
    .from("site_settings" as never)
    .select("value")
    .eq("key", "contact")
    .maybeSingle();
  if (error) throw error;
  return ((data as unknown as { value: ContactSettings } | null)?.value) ?? null;
}

// Upload file to media bucket → return long-lived signed URL
export async function uploadMedia(file: File, folder: string): Promise<string> {
  const ext = file.name.split(".").pop() || "bin";
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error: upErr } = await supabase.storage.from("media").upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
    contentType: file.type,
  });
  if (upErr) throw upErr;
  const { data, error } = await supabase.storage
    .from("media")
    .createSignedUrl(path, 60 * 60 * 24 * 365 * 10); // 10 years
  if (error) throw error;
  return data.signedUrl;
}
