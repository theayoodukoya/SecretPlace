import { supabase } from '@/database/client';
import { JournalEntry } from '@/types';

export const JournalService = {
  async getEntries() {
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as JournalEntry[];
  },

  async createEntry(title: string, body: string) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase.from('journal_entries').insert({
      user_id: user.id,
      title,
      body,
      status: 'pending',
    });

    if (error) throw error;
  },

  async markAnswered(id: string) {
    const { error } = await supabase
      .from('journal_entries')
      .update({ status: 'answered', answered_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;
  },
};
