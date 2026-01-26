import { supabase } from '@/database/client';
import { PrayerPoint, Confession } from '@/types';
import { startOfDay, endOfDay } from 'date-fns';

export const PrayerService = {
  async getDailyPoints(date: Date) {
    const formattedDate = date.toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('prayer_points')
      .select('*')
      .eq('type', 'daily')
      .eq('date_or_period', formattedDate);

    if (error) throw error;
    return data as PrayerPoint[];
  },

  async getGlobalConfessions() {
    const { data, error } = await supabase
      .from('confessions')
      .select('*')
      .is('user_id', null);

    if (error) throw error;
    return data as Confession[];
  },

  async markStepComplete(step: string) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const date = new Date().toISOString().split('T')[0];

    const { error } = await supabase.from('prayer_flow_completions').upsert(
      {
        user_id: user.id,
        date,
        step,
        completed_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,date,step' },
    );

    if (error) console.error('Error marking complete', error);
  },

  async getCompletions(date: Date) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return [];

    const formattedDate = date.toISOString().split('T')[0];
    const { data } = await supabase
      .from('prayer_flow_completions')
      .select('step')
      .eq('user_id', user.id)
      .eq('date', formattedDate);

    return data?.map((d) => d.step) || [];
  },
};
