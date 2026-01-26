-- Enable pgcrypto just in case (usually enabled by default in Supabase)
create extension if not exists "pgcrypto";

-- 1. PROFILES
create table if not exists profiles (
  id uuid references auth.users not null primary key,
  name text,
  is_premium boolean default false,
  created_at timestamptz default now()
);

alter table profiles enable row level security;
do $$ begin
  create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);
exception when duplicate_object then null; end $$;

-- Handle new user signup trigger
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, name, is_premium)
  values (new.id, new.raw_user_meta_data->>'full_name', false);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger handling
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. PRAYER POINTS
create table if not exists prayer_points (
  id uuid default gen_random_uuid() primary key,
  type text not null check (type in ('daily', 'weekly', 'monthly')),
  date_or_period text not null,
  category text,
  title text not null,
  content text not null,
  scripture text,
  expand_content text,
  created_at timestamptz default now()
);

alter table prayer_points enable row level security;
do $$ begin
  create policy "Prayer points are viewable by everyone" on prayer_points for select using (true);
exception when duplicate_object then null; end $$;

-- 3. PRAYER FLOW COMPLETIONS
create table if not exists prayer_flow_completions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  date date not null,
  step text not null,
  completed_at timestamptz default now(),
  unique(user_id, date, step)
);

alter table prayer_flow_completions enable row level security;
do $$ begin
  create policy "Users can CRUD own completions" on prayer_flow_completions for all using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

-- 4. CONFESSIONS
create table if not exists confessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users,
  text text not null,
  created_at timestamptz default now()
);

alter table confessions enable row level security;
do $$ begin
  create policy "Global confessions viewable by all" on confessions for select using (user_id is null);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Users can view own confessions" on confessions for select using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Users can insert own confessions" on confessions for insert with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Users can delete own confessions" on confessions for delete using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

-- 5. CONFESSION LOGS
create table if not exists confession_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  date date not null,
  confession_id uuid references confessions,
  completed_at timestamptz default now(),
  unique(user_id, date, confession_id)
);

alter table confession_logs enable row level security;
do $$ begin
  create policy "Users can CRUD own logs" on confession_logs for all using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

-- 6. JOURNAL ENTRIES
create table if not exists journal_entries (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  title text,
  body text not null,
  tags text[],
  status text check (status in ('pending', 'answered')) default 'pending',
  answered_at timestamptz,
  created_at timestamptz default now()
);

alter table journal_entries enable row level security;
do $$ begin
  create policy "Users can CRUD own journal" on journal_entries for all using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

-- 7. REMINDER SETTINGS
create table if not exists reminder_settings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null unique,
  morning_enabled boolean default false,
  morning_time text default '07:00',
  midday_enabled boolean default false,
  midday_time text default '12:00',
  evening_enabled boolean default false,
  evening_time text default '19:00',
  midnight_enabled boolean default false,
  midnight_time text default '00:00'
);

alter table reminder_settings enable row level security;
do $$ begin
  create policy "Users can CRUD own reminder settings" on reminder_settings for all using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

-- 8. PRAYER PLANS (LITURGIES)
create table if not exists prayer_plans (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  description text,
  is_public boolean default false,
  duration_minutes integer,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table prayer_plans enable row level security;
do $$ begin
  create policy "Users can CRUD own plans" on prayer_plans for all using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Users can view public plans" on prayer_plans for select using (is_public = true);
exception when duplicate_object then null; end $$;

-- 9. PRAYER STEPS
create table if not exists prayer_steps (
  id uuid default gen_random_uuid() primary key,
  plan_id uuid references prayer_plans on delete cascade not null,
  order_index integer not null,
  title text not null,
  subtitle text,
  body text,
  scripture_ref text,
  duration_seconds integer,
  type text default 'text',
  media_url text,
  created_at timestamptz default now()
);

alter table prayer_steps enable row level security;
do $$ begin
  create policy "Users can CRUD own steps" on prayer_steps for all using (exists (select 1 from prayer_plans where id = prayer_steps.plan_id and user_id = auth.uid()));
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Users can view steps of public plans" on prayer_steps for select using (exists (select 1 from prayer_plans where id = prayer_steps.plan_id and is_public = true));
exception when duplicate_object then null; end $$;

-- 10. USER SCHEDULES
create table if not exists user_schedules (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  plan_id uuid references prayer_plans on delete cascade null,
  days_of_week integer[],
  time_of_day time not null,
  season_start date,
  season_end date,
  reminder_minutes_before integer[] default '{15}',
  is_active boolean default true,
  created_at timestamptz default now()
);

alter table user_schedules enable row level security;
do $$ begin
  create policy "Users can CRUD own schedules" on user_schedules for all using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;
