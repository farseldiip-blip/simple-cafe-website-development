-- DRAFT ONLY. Apply after reviewing with Supabase.
create table categories (id text primary key, label_en text not null, label_ar text not null, created_at timestamptz default now());
create table menu_items (id text primary key, category_id text references categories(id), name_en text not null, name_ar text not null, description_en text, description_ar text, price integer not null, is_available boolean default true, is_featured boolean default false, sort_order integer default 0, tags text[] default '{}', image_path text, created_at timestamptz default now());
create table gallery_images (id text primary key, src text not null, alt_en text, alt_ar text, caption_en text, caption_ar text, created_at timestamptz default now());
create table site_settings (id boolean primary key default true, data jsonb not null, updated_at timestamptz default now());
create table opening_hours (id serial primary key, day text not null, opens_at time, closes_at time);
create table reviews (id uuid primary key default gen_random_uuid(), author text, body text, rating integer, is_published boolean default false);
-- TODO: Add public read/authenticated admin write RLS policies and menu-images storage bucket.
