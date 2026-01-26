import React, { useState } from 'react';
import { View, Switch, Alert, ScrollView } from 'react-native';
import { Screen, AppText, Button, Card } from '@/components/ui';
import { useAuthStore } from '@/store/authStore';
import { NotificationService } from '@/services/notificationService';
import { COLORS, SPACING } from '@/config/theme';
import { Bell, Zap, LogOut } from 'lucide-react-native';

export const SettingsScreen = ({ navigation }: any) => {
  const { signOut, profile } = useAuthStore();
  const [morning, setMorning] = useState(false);
  const [evening, setEvening] = useState(false);

  const toggleMorning = async (val: boolean) => {
    setMorning(val);
    if (val) {
      const granted = await NotificationService.requestPermissions();
      if (granted) {
        await NotificationService.scheduleNotification(
          'Good Morning',
          'Time to meet with God.',
          7,
          0,
        );
      } else {
        Alert.alert(
          'Permission required',
          'Please enable notifications in settings',
        );
        setMorning(false);
      }
    }
  };

  return (
    <Screen>
      <ScrollView>
        <AppText variant='h1'>Settings</AppText>

        <Card
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: SPACING.l,
          }}
        >
          <View
            style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              backgroundColor: COLORS.surfaceSecondary,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <AppText variant='h3' color={COLORS.primary}>
              {profile?.name?.charAt(0) || 'U'}
            </AppText>
          </View>
          <View style={{ marginLeft: SPACING.m }}>
            <AppText variant='h3'>{profile?.name || 'User'}</AppText>
            <AppText variant='caption'>
              {profile?.is_premium ? 'Premium Member' : 'Free Plan'}
            </AppText>
          </View>
        </Card>

        <AppText variant='label' style={{ marginBottom: SPACING.s }}>
          Reminders
        </AppText>
        <Card>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: SPACING.m,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Bell
                size={20}
                color={COLORS.text}
                style={{ marginRight: SPACING.s }}
              />
              <AppText>Morning Prayer (7:00 AM)</AppText>
            </View>
            <Switch
              value={morning}
              onValueChange={toggleMorning}
              trackColor={{ false: COLORS.border, true: COLORS.primary }}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Bell
                size={20}
                color={COLORS.text}
                style={{ marginRight: SPACING.s }}
              />
              <AppText>Evening Prayer (9:00 PM)</AppText>
            </View>
            <Switch
              value={evening}
              onValueChange={setEvening}
              trackColor={{ false: COLORS.border, true: COLORS.primary }}
            />
          </View>
        </Card>

        <AppText
          variant='label'
          style={{ marginTop: SPACING.l, marginBottom: SPACING.s }}
        >
          Premium
        </AppText>
        <Card onPress={() => navigation.navigate('SmartPrayerAssistant')}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Zap
              size={20}
              color={COLORS.accent}
              style={{ marginRight: SPACING.s }}
            />
            <View style={{ flex: 1 }}>
              <AppText variant='h3'>Smart Prayer Assistant</AppText>
              <AppText variant='caption'>
                Generate personalized prayer plans (AI)
              </AppText>
            </View>
          </View>
        </Card>

        <Button
          title='Sign Out'
          variant='secondary'
          onPress={signOut}
          style={{ marginTop: SPACING.xxl, borderColor: COLORS.error }}
        />
      </ScrollView>
    </Screen>
  );
};
