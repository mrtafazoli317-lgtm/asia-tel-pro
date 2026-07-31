-- Customer order requests
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id text,
  product_name text not null,
  customer_name text not null,
  customer_phone text not null,
  note text,
  status text not null default 'pending' check (status in ('pending','contacted','completed','cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.orders enable row level security;

-- customers can see their own orders
create policy "orders_select_own" on public.orders
  for select to authenticated
  using (user_id = auth.uid());

-- customers can create their own orders
create policy "orders_insert_own" on public.orders
  for insert to authenticated
  with check (user_id = auth.uid());

-- admins can see all orders
create policy "orders_select_admin" on public.orders
  for select to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- admins can update order status
create policy "orders_update_admin" on public.orders
  for update to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create trigger orders_set_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();
