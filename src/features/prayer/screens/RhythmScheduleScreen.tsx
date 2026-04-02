import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Switch, Platform } from 'react-native';
import { Screen, AppText, Button, Card } from '@/components/ui';
import { COLORS, SPACING } from '@/config/theme';
import DateTimePicker from '@react-native-community/datetimepicker';
import { PermissionPrimeModal } from '@/components/modals/PermissionPrimeModal';
import { NotificationService } from '@/services/notificationService';
import { LiturgyService } from '@/services/liturgyService';
import { X } from 'lucide-react-native';
import { useQueryClient } from '@tanstack/react-query';

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export const RhythmScheduleScreen = ({ navigation, route }: any) => {
  const { planId, planTitle } = route.params; // Expect planId and Title

  const [selectedDays, setSelectedDays] = useState<number[]>([]); // 0-6
  const [time, setTime] = useState(new Date());
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [primeModalVisible, setPrimeModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();

  // Load existing schedule on mount
  useEffect(() => {
    const loadSchedule = async () => {
      try {
        const existing = await LiturgyService.getSchedule(planId);
        if (existing) {
          setSelectedDays(existing.days_of_week || []);
          if (existing.time_of_day) {
            const [h, m] = existing.time_of_day.split(':').map(Number);
            const d = new Date();
            d.setHours(h, m, 0, 0);
            setTime(d);
          }
          setReminderEnabled(existing.is_active && (existing.reminder_minutes_before?.length ?? 0) > 0);
        }
      } catch (err) {
        console.error('Failed to load schedule', err);
      }
    };
    loadSchedule();
  }, [planId]);

  const toggleDay = (index: number) => {
    if (selectedDays.includes(index)) {
      setSelectedDays(selectedDays.filter((d) => d !== index));
    } else {
      setSelectedDays([...selectedDays, index].sort());
    }
  };

  const handleReminderToggle = async (value: boolean) => {
    if (value) {
      // Check permission first
      const hasPermission =
        await NotificationService.registerForPushNotificationsAsync();
      if (!hasPermission) {
        setPrimeModalVisible(true);
      } else {
        setReminderEnabled(true);
      }
    } else {
      setReminderEnabled(false);
    }
  };

  const handleGrantPermission = async () => {
    setPrimeModalVisible(false);
    const granted =
      await NotificationService.registerForPushNotificationsAsync();
    if (granted) setReminderEnabled(true);
  };

  const handleSave = async () => {
    setLoading(true);

    // Persist schedule to database
    const hours = time.getHours().toString().padStart(2, '0');
    const mins = time.getMinutes().toString().padStart(2, '0');
    const timeOfDay = `${hours}:${mins}:00`;

    try {
      await LiturgyService.saveSchedule(
        planId,
        selectedDays,
        timeOfDay,
        reminderEnabled,
      );
    } catch (err) {
      console.error('Failed to save schedule', err);
    }

    // Schedule local notifications
    if (reminderEnabled) {
      const h = time.getHours();
      const m = time.getMinutes();

      // Schedule for selected days
      const promises = selectedDays.map((day) => {
        // Expo Notifications uses 1=Sunday, 7=Saturday
        // Our Days are 0=Sunday, 6=Saturday -> +1
        return NotificationService.scheduleNotification(
          `Time for ${planTitle}`,
          'Your secret place awaits.',
          h,
          m,
          day + 1,
        );
      });

      await Promise.all(promises);
    }

    setLoading(false);
    navigation.goBack();
  };

  return (
    <Screen>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: SPACING.l,
        }}
      >
        <AppText variant='h2'>Schedule Rhythm</AppText>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <X color={COLORS.text} />
        </TouchableOpacity>
      </View>

      <AppText color={COLORS.textSecondary} style={{ marginBottom: SPACING.m }}>
        When do you want to practice "{planTitle}"?
      </AppText>

      {/* Days Selector */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: SPACING.xl,
        }}
      >
        {DAYS.map((day, index) => {
          const isSelected = selectedDays.includes(index);
          return (
            <TouchableOpacity
              key={index}
              onPress={() => toggleDay(index)}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: isSelected
                  ? COLORS.primary
                  : COLORS.surfaceSecondary,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <AppText
                variant='label'
                style={{ color: isSelected ? '#FFF' : COLORS.text }}
              >
                {day}
              </AppText>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Time Selector */}
      <View style={{ alignItems: 'center', marginBottom: SPACING.xl }}>
        <AppText variant='h3' style={{ marginBottom: SPACING.s }}>
          At What Time?
        </AppText>
        {Platform.OS === 'ios' ? (
          <DateTimePicker
            value={time}
            mode='time'
            display='spinner'
            onChange={(e: any, d?: Date) => d && setTime(d)}
            textColor={COLORS.text}
          />
        ) : (
          <Button
            title={time.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
            variant='secondary'
            onPress={() => {
              /* Android Picker logic if needed */
            }}
          />
        )}
      </View>

      {/* Reminder Toggle */}
      <Card>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <View>
            <AppText variant='h3'>Reminders</AppText>
            <AppText variant='caption' color={COLORS.textSecondary}>
              Get notified 15m before
            </AppText>
          </View>
          <Switch
            value={reminderEnabled}
            onValueChange={handleReminderToggle}
            trackColor={{
              false: COLORS.surfaceSecondary,
              true: COLORS.primary,
            }}
          />
        </View>
      </Card>

      <View style={{ marginTop: SPACING.xxl }}>
        <Button title='Save Schedule' onPress={handleSave} loading={loading} />
      </View>

      <PermissionPrimeModal
        visible={primeModalVisible}
        onGrant={handleGrantPermission}
        onDecline={() => setPrimeModalVisible(false)}
      />
    </Screen>
  );
};
