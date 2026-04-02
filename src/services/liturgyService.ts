import { supabase } from '@/database/client';
import { PrayerPlan, PrayerStep, UserSchedule } from '@/types';

export const LiturgyService = {
  async getMyPlans() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('prayer_plans')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as PrayerPlan[];
  },

  async getPlanSteps(planId: string) {
    const { data, error } = await supabase
      .from('prayer_steps')
      .select('*')
      .eq('plan_id', planId)
      .order('order_index', { ascending: true });

    if (error) throw error;
    return data as PrayerStep[];
  },

  async createPlan(
    title: string,
    description: string,
    steps: Partial<PrayerStep>[],
  ) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // 1. Create Plan
    const { data: plan, error: planError } = await supabase
      .from('prayer_plans')
      .insert({
        user_id: user.id,
        title,
        description,
        is_public: false,
      })
      .select()
      .single();

    if (planError) throw planError;
    if (!plan) throw new Error('Failed to create plan');

    // 2. Create Steps
    const stepsToInsert = steps.map((step, index) => ({
      plan_id: plan.id,
      order_index: index,
      title: step.title,
      body: step.body,
      duration_seconds: step.duration_seconds,
      type: step.type || 'text',
    }));

    const { error: stepsError } = await supabase
      .from('prayer_steps')
      .insert(stepsToInsert);

    if (stepsError) throw stepsError;

    return plan;
  },

  async saveSchedule(
    planId: string,
    daysOfWeek: number[],
    timeOfDay: string,
    reminderEnabled: boolean,
  ) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('user_schedules')
      .upsert(
        {
          user_id: user.id,
          plan_id: planId,
          days_of_week: daysOfWeek,
          time_of_day: timeOfDay,
          reminder_minutes_before: reminderEnabled ? [15] : [],
          is_active: true,
        },
        { onConflict: 'user_id,plan_id' },
      )
      .select()
      .single();

    if (error) throw error;
    return data as UserSchedule;
  },

  async getSchedule(planId: string) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('user_schedules')
      .select('*')
      .eq('user_id', user.id)
      .eq('plan_id', planId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data as UserSchedule | null;
  },
};
