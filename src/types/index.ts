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

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  PrayerFlow: undefined; // The modal/flow screen
  PrayerPointDetail: { point: PrayerPoint };
  CreateJournalEntry: undefined;
  JournalDetail: { entry: JournalEntry };
  CreateCustomConfession: undefined;
  Paywall: undefined;
  SmartPrayerAssistant: undefined;
  PrayerPlanGenerator: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Journal: undefined;
  Confessions: undefined;
  Settings: undefined;
};
