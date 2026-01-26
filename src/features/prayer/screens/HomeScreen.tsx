import React from 'react';
import { View, ScrollView } from 'react-native';
import { Screen, AppText, Button, Card } from '@/components/ui';
import { COLORS, SPACING } from '@/config/theme';
import { useAuthStore } from '@/store/authStore';
import { format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { PrayerService } from '@/services/prayerService';

export const HomeScreen = ({ navigation }: any) => {
  const profile = useAuthStore((state) => state.profile);
  const { data: completions } = useQuery({
    queryKey: ['completions', new Date().toISOString().split('T')[0]],
    queryFn: () => PrayerService.getCompletions(new Date()),
  });

  const progress = completions ? (completions.length / 4) * 100 : 0;

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ marginTop: SPACING.l, marginBottom: SPACING.l }}>
          <AppText variant='h1'>Good Morning,</AppText>
          <AppText variant='h2' color={COLORS.primary}>
            {profile?.name || 'Believer'}
          </AppText>
          <AppText variant='caption'>
            {format(new Date(), 'EEEE, MMMM do')}
          </AppText>
        </View>

        <Card style={{ backgroundColor: COLORS.primary, padding: SPACING.l }}>
          <AppText
            variant='h3'
            color='#FFF'
            style={{ marginBottom: SPACING.s }}
          >
            Today's Prayer Flow
          </AppText>
          <AppText style={{ marginBottom: SPACING.m }}>
            {progress === 100
              ? 'You have completed your prayer flow today. Well done!'
              : 'Come away to the secret place.'}
          </AppText>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: SPACING.m,
            }}
          >
            <View
              style={{
                flex: 1,
                height: 6,
                backgroundColor: 'rgba(0,0,0,0.1)',
                borderRadius: 3,
              }}
            >
              <View
                style={{
                  width: `${progress}%`,
                  height: 6,
                  backgroundColor: COLORS.accent,
                  borderRadius: 3,
                }}
              />
            </View>
            <AppText variant='caption' style={{ marginLeft: SPACING.s }}>
              {completions?.length || 0}/4
            </AppText>
          </View>

          <Button
            title={progress === 100 ? 'Pray Again' : 'Start Prayer'}
            onPress={() => navigation.navigate('PrayerFlow')}
            variant='primary'
            style={{
              backgroundColor: COLORS.surface,
              borderColor: COLORS.surface,
            }}
          />
        </Card>
      </ScrollView>
    </Screen>
  );
};
