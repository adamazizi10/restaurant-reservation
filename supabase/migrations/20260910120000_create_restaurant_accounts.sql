create extension if not exists pgcrypto with schema extensions;

do $$
begin
  create type public.restaurant_role as enum ('owner', 'admin', 'staff');
exception
  when duplicate_object then null;
end
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.restaurants (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(btrim(name)) between 1 and 160),
  phone text not null check (char_length(btrim(phone)) between 7 and 40),
  address_line_1 text not null check (char_length(btrim(address_line_1)) between 1 and 180),
  address_line_2 text check (address_line_2 is null or char_length(btrim(address_line_2)) between 1 and 180),
  city text not null check (char_length(btrim(city)) between 1 and 100),
  region text not null check (char_length(btrim(region)) between 1 and 100),
  postal_code text not null check (char_length(btrim(postal_code)) between 1 and 40),
  country text not null check (char_length(btrim(country)) between 1 and 100),
  website text check (website is null or website ~* '^https?://[^[:space:]]+$'),
  trial_started_at timestamptz not null,
  trial_ends_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint restaurants_trial_ends_after_start check (trial_ends_at > trial_started_at)
);

drop trigger if exists restaurants_set_updated_at on public.restaurants;
create trigger restaurants_set_updated_at
before update on public.restaurants
for each row
execute function public.set_updated_at();

create table if not exists public.restaurant_memberships (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.restaurant_role not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint restaurant_memberships_restaurant_user_key unique (restaurant_id, user_id),
  constraint restaurant_memberships_one_restaurant_per_user_key unique (user_id)
);

create index if not exists restaurant_memberships_restaurant_id_idx
on public.restaurant_memberships (restaurant_id);

drop trigger if exists restaurant_memberships_set_updated_at on public.restaurant_memberships;
create trigger restaurant_memberships_set_updated_at
before update on public.restaurant_memberships
for each row
execute function public.set_updated_at();

alter table public.restaurants enable row level security;
alter table public.restaurant_memberships enable row level security;

drop policy if exists "Restaurant members can read restaurants" on public.restaurants;
create policy "Restaurant members can read restaurants"
on public.restaurants
for select
to authenticated
using (
  exists (
    select 1
    from public.restaurant_memberships memberships
    where memberships.restaurant_id = restaurants.id
      and memberships.user_id = auth.uid()
  )
);

drop policy if exists "Users can read own restaurant memberships" on public.restaurant_memberships;
create policy "Users can read own restaurant memberships"
on public.restaurant_memberships
for select
to authenticated
using (user_id = auth.uid());

create or replace function public.create_restaurant_account(
  p_user_id uuid,
  p_name text,
  p_phone text,
  p_address_line_1 text,
  p_address_line_2 text,
  p_city text,
  p_region text,
  p_postal_code text,
  p_country text,
  p_website text,
  p_trial_duration_days integer
)
returns table (restaurant_id uuid)
language plpgsql
security definer
set search_path = public, auth, extensions
as $$
declare
  v_confirmed_at timestamptz;
  v_now timestamptz := statement_timestamp();
  v_restaurant_id uuid;
  v_name text := nullif(btrim(p_name), '');
  v_phone text := nullif(btrim(p_phone), '');
  v_address_line_1 text := nullif(btrim(p_address_line_1), '');
  v_address_line_2 text := nullif(btrim(p_address_line_2), '');
  v_city text := nullif(btrim(p_city), '');
  v_region text := nullif(btrim(p_region), '');
  v_postal_code text := nullif(btrim(p_postal_code), '');
  v_country text := nullif(btrim(p_country), '');
  v_website text := nullif(btrim(p_website), '');
begin
  if p_user_id is null then
    raise exception 'Authentication required.' using errcode = '28000';
  end if;

  if auth.uid() is not null and auth.uid() <> p_user_id then
    raise exception 'Authenticated user mismatch.' using errcode = '28000';
  end if;

  select coalesce(email_confirmed_at, confirmed_at)
  into v_confirmed_at
  from auth.users
  where id = p_user_id;

  if v_confirmed_at is null then
    raise exception 'Email verification required.' using errcode = '28000';
  end if;

  if p_trial_duration_days is null
    or p_trial_duration_days < 1
    or p_trial_duration_days > 365 then
    raise exception 'Trial duration must be between 1 and 365 days.' using errcode = '22023';
  end if;

  if v_name is null
    or v_phone is null
    or v_address_line_1 is null
    or v_city is null
    or v_region is null
    or v_postal_code is null
    or v_country is null then
    raise exception 'Missing required restaurant information.' using errcode = '23514';
  end if;

  if v_website is not null and v_website !~* '^https?://[^[:space:]]+$' then
    raise exception 'Website must be a valid HTTP or HTTPS URL.' using errcode = '23514';
  end if;

  if exists (
    select 1
    from public.restaurant_memberships memberships
    where memberships.user_id = p_user_id
  ) then
    raise exception 'Restaurant account already exists.' using errcode = '23505';
  end if;

  insert into public.restaurants (
    name,
    phone,
    address_line_1,
    address_line_2,
    city,
    region,
    postal_code,
    country,
    website,
    trial_started_at,
    trial_ends_at
  )
  values (
    v_name,
    v_phone,
    v_address_line_1,
    v_address_line_2,
    v_city,
    v_region,
    v_postal_code,
    v_country,
    v_website,
    v_now,
    v_now + make_interval(days => p_trial_duration_days)
  )
  returning id into v_restaurant_id;

  insert into public.restaurant_memberships (restaurant_id, user_id, role)
  values (v_restaurant_id, p_user_id, 'owner');

  return query select v_restaurant_id;
end;
$$;

revoke all on function public.create_restaurant_account(
  uuid,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  integer
) from public, anon, authenticated;

grant execute on function public.create_restaurant_account(
  uuid,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  integer
) to service_role;

grant usage on schema public to authenticated, service_role;
grant usage on type public.restaurant_role to authenticated, service_role;
grant select on public.restaurants to authenticated;
grant select on public.restaurant_memberships to authenticated;
