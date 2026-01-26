-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES
create table profiles (
  id uuid references auth.users not null primary key,
  name text,
  is_premium boolean default false,
  created_at timestamptz default now()
);

alter table profiles enable row level security;
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);

-- Handle new user signup trigger
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, name, is_premium)
  values (new.id, new.raw_user_meta_data->>'full_name', false);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. PRAYER POINTS
create table prayer_points (
  id uuid default uuid_generate_v4() primary key,
  type text not null check (type in ('daily', 'weekly', 'monthly')),
  date_or_period text not null, -- '2023-10-27' or '2023-W43' or '2023-10'
  category text,
  title text not null,
  content text not null,
  scripture text,
  expand_content text,
  created_at timestamptz default now()
);

alter table prayer_points enable row level security;
create policy "Prayer points are viewable by everyone" on prayer_points for select using (true);

-- 3. PRAYER FLOW COMPLETIONS
create table prayer_flow_completions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  date date not null,
  step text not null, -- 'thanksgiving', 'confession', 'points', 'declarations'
  completed_at timestamptz default now(),
  unique(user_id, date, step)
);

alter table prayer_flow_completions enable row level security;
create policy "Users can CRUD own completions" on prayer_flow_completions for all using (auth.uid() = user_id);

-- 4. CONFESSIONS
create table confessions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users, -- null means global
  text text not null,
  created_at timestamptz default now()
);

alter table confessions enable row level security;
create policy "Global confessions viewable by all" on confessions for select using (user_id is null);
create policy "Users can view own confessions" on confessions for select using (auth.uid() = user_id);
create policy "Users can insert own confessions" on confessions for insert with check (auth.uid() = user_id);
create policy "Users can delete own confessions" on confessions for delete using (auth.uid() = user_id);

-- 5. CONFESSION LOGS
create table confession_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  date date not null,
  confession_id uuid references confessions,
  completed_at timestamptz default now(),
  unique(user_id, date, confession_id)
);

alter table confession_logs enable row level security;
create policy "Users can CRUD own logs" on confession_logs for all using (auth.uid() = user_id);

-- 6. JOURNAL ENTRIES
create table journal_entries (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  title text,
  body text not null,
  tags text[],
  status text check (status in ('pending', 'answered')) default 'pending',
  answered_at timestamptz,
  created_at timestamptz default now()
);

alter table journal_entries enable row level security;
create policy "Users can CRUD own journal" on journal_entries for all using (auth.uid() = user_id);

-- 7. REMINDER SETTINGS
create table reminder_settings (
  id uuid default uuid_generate_v4() primary key,
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
create policy "Users can CRUD own reminder settings" on reminder_settings for all using (auth.uid() = user_id);


-- SEED DATA
-- 1. Global Confessions
insert into confessions (text) values 
('I am the righteousness of God in Christ Jesus.'),
('No weapon formed against me shall prosper.'),
('I have the mind of Christ.'),
('The joy of the Lord is my strength.'),
('I walk in favor with God and man.'),
('My steps are ordered by the Lord.'),
('I am the head and not the tail, above only and not beneath.'),
('I declare peace over my mind and heart.'),
('I am blessed in my coming and going.'),
('God supplies all my needs according to His riches in glory.'),
('I am a new creation, old things have passed away.'),
('I am more than a conqueror through Him who loves me.'),
('Greater is He that is in me than he that is in the world.'),
('I fear no evil, for You are with me.'),
('Your goodness and mercy follow me all the days of my life.'),
('I am brave, I am strong, I am loved.'),
('I forgive those who have wronged me.'),
('I walk in love and forgiveness today.'),
('I have wisdom and understanding.'),
('My path is shining brighter and brighter.');

-- 2. Prayer Points (Sample Daily)
-- Inserting a few sample daily points. ideally would script 30 days.
insert into prayer_points (type, date_or_period, category, title, content, scripture) values
('daily', to_char(current_date, 'YYYY-MM-DD'), 'Thanksgiving', 'The Gift of Life', 'Father, I thank You for the breath in my lungs today. Thank You for waking me up and giving me another chance to walk in Your purpose.', 'Psalm 150:6'),
('daily', to_char(current_date, 'YYYY-MM-DD'), 'Family', 'Protection for Family', 'Lord, I cover my family with the blood of Jesus. I ask for Your angels to encamp around them and keep them safe from all harm.', 'Psalm 91:11'),
('daily', to_char(current_date, 'YYYY-MM-DD'), 'Wisdom', 'Guidance in Decisions', 'Holy Spirit, guide my steps today. Give me wisdom to make decisions that honor You and lead me into prosperity.', 'James 1:5');

-- 3. Monthly Themes
insert into prayer_points (type, date_or_period, category, title, content, scripture) values
('monthly', to_char(current_date, 'YYYY-MM'), 'Focus', 'Month of Expansion', 'This month we are praying for expansion in our capacity and influence to serve God.', 'Isaiah 54:2');

