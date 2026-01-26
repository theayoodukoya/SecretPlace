import { create } from 'zustand';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../database/client';
import { Profile } from '../types';

interface AuthState {
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  setSession: (session: Session | null) => void;
  setProfile: (profile: Profile | null) => void;
  initialize: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  profile: null,
  isLoading: true,
  setSession: (session) => set({ session }),
  setProfile: (profile) => set({ profile }),
  initialize: async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        set({ session });
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        const profile = data || {
          id: session.user.id,
          name: session.user.user_metadata?.full_name || 'User',
          is_premium: false,
          created_at: new Date().toISOString(),
        };
        set({ profile });
      } else {
        // --- AUTH BYPASS (DEV MODE) ---
        console.log('No session found. Activating GUEST MODE bypass.');
        const mockSession = {
          access_token: 'mock-token',
          refresh_token: 'mock-refresh',
          expires_in: 3600,
          token_type: 'bearer',
          user: {
            id: 'guest-123',
            aud: 'authenticated',
            role: 'authenticated',
            email: 'guest@secretplace.app',
            phone: '',
            app_metadata: { provider: 'email' },
            user_metadata: { full_name: 'Guest Believer' },
            created_at: new Date().toISOString(),
          },
        } as unknown as Session;

        const mockProfile: Profile = {
          id: 'guest-123',
          name: 'Guest Believer',
          is_premium: false,
          created_at: new Date().toISOString(),
        };

        set({ session: mockSession, profile: mockProfile });
      }
    } catch (e) {
      console.error('Auth initialization failed', e);
      // Fallback to guest on error too
      set({
        session: { user: { id: 'guest-123' } } as unknown as Session,
        profile: {
          id: 'guest-123',
          name: 'Guest Believer',
          is_premium: false,
          created_at: new Date().toISOString(),
        },
      });
    } finally {
      set({ isLoading: false });
    }
  },
  signOut: async () => {
    await supabase.auth.signOut();
    set({ session: null, profile: null });
  },
}));
