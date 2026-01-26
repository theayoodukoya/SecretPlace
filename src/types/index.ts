export interface Profile {
  id: string;
  name: string | null;
  is_premium: boolean;
  created_at: string;
}

export interface PrayerPoint {
  id: string;
  type: 'daily' | 'weekly' | 'monthly';
  date_or_period: string;
  category: string | null;
  title: string;
  content: string;
  scripture: string | null;
  expand_content: string | null;
  created_at: string;
}

export interface Confession {
  id: string;
  user_id: string | null; // null = global
  text: string;
  created_at: string;
}

export interface JournalEntry {
  id: string;
  user_id: string;
  title: string | null;
  body: string;
  tags: string[] | null;
  status: 'pending' | 'answered';
  answered_at: string | null;
  created_at: string;
}

export interface ReminderSettings {
  id: string;
  user_id: string;
  morning_enabled: boolean;
  morning_time: string;
  midday_enabled: boolean;
  midday_time: string;
  evening_enabled: boolean;
  evening_time: string;
  midnight_enabled: boolean;
  midnight_time: string;
}

// --- LITURGY ENGINE TYPES ---
export interface PrayerPlan {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  is_public: boolean;
  duration_minutes: number | null;
  created_at: string;
}

export interface PrayerStep {
  id: string;
  plan_id: string;
  order_index: number;
  title: string;
  subtitle: string | null;
  body: string | null;
  scripture_ref: string | null;
  duration_seconds: number | null; // null = open ended
  type: 'text' | 'scripture' | 'silence' | 'song';
  media_url: string | null;
  created_at: string;
}

export interface UserSchedule {
  id: string;
  user_id: string;
  plan_id: string | null;
  days_of_week: number[] | null; // 0-6
  time_of_day: string; // "HH:MM:SS"
  season_start: string | null; // ISO Date
  season_end: string | null; // ISO Date
  reminder_minutes_before: number[] | null;
  is_active: boolean;
  created_at: string;
}

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  PrayerFlow: undefined;
  PrayerPointDetail: { point: PrayerPoint };
  CreateJournalEntry: undefined;
  JournalDetail: { entry: JournalEntry };
  CreateCustomConfession: undefined;
  Paywall: undefined;
  SmartPrayerAssistant: undefined;
  PrayerPlanGenerator: undefined;

  // Liturgy Engine
  LiturgyBuilder: { planId?: string }; // if editing
  SanctuaryMode: { planId: string };
  RhythmSchedule: { planId: string; planTitle: string };
};

export type MainTabParamList = {
  Home: undefined;
  Journal: undefined;
  Confessions: undefined;
  Settings: undefined;
  Rituals: undefined; // New Tab? Or just access from Home
};
