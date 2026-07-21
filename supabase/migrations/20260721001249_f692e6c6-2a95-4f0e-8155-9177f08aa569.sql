
-- roles
CREATE TYPE public.app_role AS ENUM ('admin');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_view_own_roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- updated_at trigger helper
CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

-- products
CREATE TABLE public.products (
  id text PRIMARY KEY,
  name text NOT NULL,
  series text NOT NULL,
  year int NOT NULL,
  price bigint NOT NULL,
  old_price bigint,
  in_stock boolean NOT NULL DEFAULT true,
  storage text NOT NULL DEFAULT '',
  display text NOT NULL DEFAULT '',
  chip text NOT NULL DEFAULT '',
  camera text NOT NULL DEFAULT '',
  color text NOT NULL DEFAULT 'from-slate-800 to-slate-600',
  image_url text,
  featured boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.products TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "products_public_read" ON public.products FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "products_admin_insert" ON public.products FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "products_admin_update" ON public.products FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "products_admin_delete" ON public.products FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- banners
CREATE TABLE public.banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subtitle text,
  image_url text,
  link_url text,
  active boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.banners TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.banners TO authenticated;
GRANT ALL ON public.banners TO service_role;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "banners_public_read" ON public.banners FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "banners_admin_all" ON public.banners FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER banners_updated_at BEFORE UPDATE ON public.banners FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- blog posts
CREATE TABLE public.blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  excerpt text,
  content text NOT NULL DEFAULT '',
  cover_url text,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.blog_posts TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.blog_posts TO authenticated;
GRANT ALL ON public.blog_posts TO service_role;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "blog_public_read" ON public.blog_posts FOR SELECT TO anon, authenticated USING (published = true);
CREATE POLICY "blog_admin_read_all" ON public.blog_posts FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "blog_admin_write" ON public.blog_posts FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER blog_posts_updated_at BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- site settings
CREATE TABLE public.site_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "settings_public_read" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "settings_admin_write" ON public.site_settings FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER site_settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- seed settings
INSERT INTO public.site_settings(key, value) VALUES
('contact', '{"phone":"+989916090254","phone_display":"۰۹۹۱ ۶۰۹ ۰۲۵۴","address":"اراک، ایران","email":"info@asia-tel.ir","hours":"شنبه تا پنج‌شنبه ۹ صبح تا ۹ شب","instagram":"https://instagram.com/asia_tel","telegram":"https://t.me/asia_tel","whatsapp":"https://wa.me/989916090254"}'::jsonb);

-- seed products (27)
INSERT INTO public.products(id,name,series,year,price,old_price,in_stock,storage,display,chip,camera,color,featured,sort_order) VALUES
('iphone-17-pro-max','آیفون ۱۷ پرو مکس','iPhone 17',2025,115000000,NULL,true,'۲۵۶ گیگابایت','۶.۹ اینچ Super Retina XDR','A19 Pro','سه‌گانه ۴۸ مگاپیکسل','from-slate-900 to-slate-700',true,1),
('iphone-17-pro','آیفون ۱۷ پرو','iPhone 17',2025,98000000,NULL,true,'۲۵۶ گیگابایت','۶.۳ اینچ Super Retina XDR','A19 Pro','سه‌گانه ۴۸ مگاپیکسل','from-neutral-800 to-neutral-600',true,2),
('iphone-17-air','آیفون ۱۷ ایر','iPhone 17',2025,82000000,NULL,true,'۲۵۶ گیگابایت','۶.۶ اینچ OLED فوق‌نازک','A19','دوگانه ۴۸ مگاپیکسل','from-sky-200 to-slate-300',true,3),
('iphone-17','آیفون ۱۷','iPhone 17',2025,68000000,NULL,true,'۱۲۸ گیگابایت','۶.۱ اینچ Super Retina','A19','دوگانه ۴۸ مگاپیکسل','from-blue-300 to-indigo-400',false,4),
('iphone-16-pro-max','آیفون ۱۶ پرو مکس','iPhone 16',2024,92000000,98000000,true,'۲۵۶ گیگابایت','۶.۹ اینچ ProMotion','A18 Pro','سه‌گانه ۴۸ مگاپیکسل','from-amber-100 to-amber-300',true,5),
('iphone-16-pro','آیفون ۱۶ پرو','iPhone 16',2024,78000000,NULL,true,'۲۵۶ گیگابایت','۶.۳ اینچ ProMotion','A18 Pro','سه‌گانه ۴۸ مگاپیکسل','from-stone-300 to-stone-500',false,6),
('iphone-16-plus','آیفون ۱۶ پلاس','iPhone 16',2024,64000000,NULL,true,'۱۲۸ گیگابایت','۶.۷ اینچ Super Retina','A18','دوگانه ۴۸ مگاپیکسل','from-teal-300 to-cyan-400',false,7),
('iphone-16','آیفون ۱۶','iPhone 16',2024,55000000,NULL,true,'۱۲۸ گیگابایت','۶.۱ اینچ Super Retina','A18','دوگانه ۴۸ مگاپیکسل','from-pink-300 to-rose-400',false,8),
('iphone-15-pro-max','آیفون ۱۵ پرو مکس','iPhone 15',2023,78000000,NULL,true,'۲۵۶ گیگابایت','۶.۷ اینچ ProMotion','A17 Pro','سه‌گانه ۴۸ مگاپیکسل','from-neutral-700 to-neutral-900',false,9),
('iphone-15-pro','آیفون ۱۵ پرو','iPhone 15',2023,66000000,NULL,true,'۱۲۸ گیگابایت','۶.۱ اینچ ProMotion','A17 Pro','سه‌گانه ۴۸ مگاپیکسل','from-blue-900 to-slate-800',false,10),
('iphone-15-plus','آیفون ۱۵ پلاس','iPhone 15',2023,52000000,NULL,true,'۱۲۸ گیگابایت','۶.۷ اینچ Super Retina','A16','دوگانه ۴۸ مگاپیکسل','from-yellow-200 to-amber-300',false,11),
('iphone-15','آیفون ۱۵','iPhone 15',2023,44000000,NULL,true,'۱۲۸ گیگابایت','۶.۱ اینچ Super Retina','A16','دوگانه ۴۸ مگاپیکسل','from-green-300 to-emerald-400',false,12),
('iphone-14-pro-max','آیفون ۱۴ پرو مکس','iPhone 14',2022,62000000,NULL,true,'۱۲۸ گیگابایت','۶.۷ اینچ ProMotion','A16 Bionic','سه‌گانه ۴۸ مگاپیکسل','from-purple-800 to-indigo-900',false,13),
('iphone-14-pro','آیفون ۱۴ پرو','iPhone 14',2022,52000000,NULL,true,'۱۲۸ گیگابایت','۶.۱ اینچ ProMotion','A16 Bionic','سه‌گانه ۴۸ مگاپیکسل','from-violet-700 to-purple-800',false,14),
('iphone-14-plus','آیفون ۱۴ پلاس','iPhone 14',2022,42000000,NULL,true,'۱۲۸ گیگابایت','۶.۷ اینچ Super Retina','A15 Bionic','دوگانه ۱۲ مگاپیکسل','from-sky-400 to-blue-500',false,15),
('iphone-14','آیفون ۱۴','iPhone 14',2022,36000000,NULL,true,'۱۲۸ گیگابایت','۶.۱ اینچ Super Retina','A15 Bionic','دوگانه ۱۲ مگاپیکسل','from-red-400 to-red-600',false,16),
('iphone-13-pro-max','آیفون ۱۳ پرو مکس','iPhone 13',2021,48000000,NULL,true,'۱۲۸ گیگابایت','۶.۷ اینچ ProMotion','A15 Bionic','سه‌گانه ۱۲ مگاپیکسل','from-emerald-700 to-teal-800',false,17),
('iphone-13-pro','آیفون ۱۳ پرو','iPhone 13',2021,40000000,NULL,true,'۱۲۸ گیگابایت','۶.۱ اینچ ProMotion','A15 Bionic','سه‌گانه ۱۲ مگاپیکسل','from-slate-500 to-slate-700',false,18),
('iphone-13','آیفون ۱۳','iPhone 13',2021,32000000,NULL,true,'۱۲۸ گیگابایت','۶.۱ اینچ Super Retina','A15 Bionic','دوگانه ۱۲ مگاپیکسل','from-pink-400 to-rose-500',false,19),
('iphone-13-mini','آیفون ۱۳ مینی','iPhone 13',2021,28000000,NULL,false,'۱۲۸ گیگابایت','۵.۴ اینچ Super Retina','A15 Bionic','دوگانه ۱۲ مگاپیکسل','from-blue-400 to-indigo-500',false,20),
('iphone-12-pro-max','آیفون ۱۲ پرو مکس','iPhone 12',2020,36000000,NULL,true,'۱۲۸ گیگابایت','۶.۷ اینچ Super Retina','A14 Bionic','سه‌گانه ۱۲ مگاپیکسل','from-blue-700 to-blue-900',false,21),
('iphone-12-pro','آیفون ۱۲ پرو','iPhone 12',2020,30000000,NULL,true,'۱۲۸ گیگابایت','۶.۱ اینچ Super Retina','A14 Bionic','سه‌گانه ۱۲ مگاپیکسل','from-yellow-600 to-amber-700',false,22),
('iphone-12','آیفون ۱۲','iPhone 12',2020,24000000,NULL,true,'۱۲۸ گیگابایت','۶.۱ اینچ Super Retina','A14 Bionic','دوگانه ۱۲ مگاپیکسل','from-purple-400 to-fuchsia-500',false,23),
('iphone-12-mini','آیفون ۱۲ مینی','iPhone 12',2020,20000000,NULL,false,'۶۴ گیگابایت','۵.۴ اینچ Super Retina','A14 Bionic','دوگانه ۱۲ مگاپیکسل','from-green-400 to-teal-500',false,24),
('iphone-11-pro-max','آیفون ۱۱ پرو مکس','iPhone 11',2019,22000000,NULL,true,'۶۴ گیگابایت','۶.۵ اینچ Super Retina XDR','A13 Bionic','سه‌گانه ۱۲ مگاپیکسل','from-gray-700 to-gray-900',false,25),
('iphone-11-pro','آیفون ۱۱ پرو','iPhone 11',2019,18000000,NULL,true,'۶۴ گیگابایت','۵.۸ اینچ Super Retina XDR','A13 Bionic','سه‌گانه ۱۲ مگاپیکسل','from-emerald-600 to-green-800',false,26),
('iphone-11','آیفون ۱۱','iPhone 11',2019,14000000,NULL,true,'۶۱ اینچ Liquid Retina','۶.۱ اینچ Liquid Retina','A13 Bionic','دوگانه ۱۲ مگاپیکسل','from-red-500 to-orange-500',false,27);
