# Supabase Migration - Phase 1 (New Tables)

Run this SQL in your **Supabase Dashboard → SQL Editor** after merging the Phase 1 PR.

These 3 tables are required by the Liturgy Engine (prayer plans, steps, schedules) that already exists in the codebase.

---

## SQL to Run

```sql
-- 8. PRAYER PLANS (Liturgy Engine)
create table prayer_plans (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  description text,
  is_public boolean default false,
  duration_minutes integer,
  created_at timestamptz default now()
);

alter table prayer_plans enable row level security;
create policy "Users can CRUD own plans" on prayer_plans for all using (auth.uid() = user_id);
create policy "Public plans viewable by all" on prayer_plans for select using (is_public = true);

-- 9. PRAYER STEPS
create table prayer_steps (
  id uuid default uuid_generate_v4() primary key,
  plan_id uuid references prayer_plans on delete cascade not null,
  order_index integer not null,
  title text not null,
  subtitle text,
  body text,
  scripture_ref text,
  duration_seconds integer,
  type text check (type in ('text', 'scripture', 'silence', 'song')) default 'text',
  media_url text,
  created_at timestamptz default now()
);

alter table prayer_steps enable row level security;
create policy "Steps viewable if plan is accessible" on prayer_steps for select using (
  exists (select 1 from prayer_plans where prayer_plans.id = prayer_steps.plan_id and (prayer_plans.user_id = auth.uid() or prayer_plans.is_public = true))
);
create policy "Users can CRUD own plan steps" on prayer_steps for all using (
  exists (select 1 from prayer_plans where prayer_plans.id = prayer_steps.plan_id and prayer_plans.user_id = auth.uid())
);

-- 10. USER SCHEDULES
create table user_schedules (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  plan_id uuid references prayer_plans on delete cascade,
  days_of_week integer[],
  time_of_day time not null default '07:00:00',
  season_start date,
  season_end date,
  reminder_minutes_before integer[] default '{}',
  is_active boolean default true,
  created_at timestamptz default now(),
  unique(user_id, plan_id)
);

alter table user_schedules enable row level security;
create policy "Users can CRUD own schedules" on user_schedules for all using (auth.uid() = user_id);
```

---

## Steps

1. Open [supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your **SecretPlace** project
3. Go to **SQL Editor** (left sidebar)
4. Paste the SQL above
5. Click **Run**
6. Verify in **Table Editor** that `prayer_plans`, `prayer_steps`, and `user_schedules` appear

## Notes

- This is safe to run even if the original 7 tables already exist — it only creates new tables
- RLS is enabled on all 3 tables so users can only access their own data
- `prayer_steps` cascade-deletes when a plan is deleted
- `user_schedules` has a unique constraint on `(user_id, plan_id)` so upserts work correctly
