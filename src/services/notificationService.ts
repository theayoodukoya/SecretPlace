import * as Notifications from 'expo-notifications';
import { supabase } from '@/database/client';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const NotificationService = {
  async requestPermissions() {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    return finalStatus === 'granted';
  },

  async scheduleNotification(
    title: string,
    body: string,
    hour: number,
    minute: number,
  ) {
    if (Platform.OS === 'web') return;

    // Cancel existing similar notifications logic would go here
    // For MVP just standard schedule

    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: true,
      },
      trigger: {
        hour,
        minute,
        repeats: true,
      },
    });
  },

  async clearAll() {
    await Notifications.cancelAllScheduledNotificationsAsync();
  },

  async saveSettings(settings: any) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from('reminder_settings').upsert({
      user_id: user.id,
      ...settings,
    });

    if (error) console.error(error);
  },
};
