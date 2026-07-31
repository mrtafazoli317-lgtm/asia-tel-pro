-- Shopping cart (one row per product per user; quantity increments on re-add)
create table if not exists public.cart_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id text not null,
  product_name text not null,
  price bigint not null,
  image text,
  quantity int not null default 1 check (quantity > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, product_id)
);

alter table public.cart_items enable row level security;

create policy "cart_items_all_own" on public.cart_items
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create trigger cart_items_set_updated_at
  before update on public.cart_items
  for each row execute function public.set_updated_at();

-- Paid checkout orders (created at checkout, before payment)
create table if not exists public.purchase_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  total_amount bigint not null,
  customer_name text not null,
  customer_phone text not null,
  address text not null,
  status text not null default 'pending' check (status in ('pending','paid','failed','cancelled')),
  zarinpal_authority text,
  zarinpal_ref_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.purchase_orders enable row level security;

create policy "purchase_orders_select_own" on public.purchase_orders
  for select to authenticated
  using (user_id = auth.uid());

create policy "purchase_orders_insert_own" on public.purchase_orders
  for insert to authenticated
  with check (user_id = auth.uid());

create policy "purchase_orders_select_admin" on public.purchase_orders
  for select to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create policy "purchase_orders_update_admin" on public.purchase_orders
  for update to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create trigger purchase_orders_set_updated_at
  before update on public.purchase_orders
  for each row execute function public.set_updated_at();

-- Line items snapshot for each paid order
create table if not exists public.purchase_order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.purchase_orders(id) on delete cascade,
  product_id text not null,
  product_name text not null,
  price bigint not null,
  quantity int not null
);

alter table public.purchase_order_items enable row level security;

create policy "purchase_order_items_select_own" on public.purchase_order_items
  for select to authenticated
  using (
    exists (
      select 1 from public.purchase_orders po
      where po.id = order_id and po.user_id = auth.uid()
    )
  );

create policy "purchase_order_items_select_admin" on public.purchase_order_items
  for select to authenticated
  using (public.has_role(auth.uid(), 'admin'));
