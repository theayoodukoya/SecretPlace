import React, { useState, useEffect } from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { Screen, AppText, Card } from '@/components/ui';
import { PrayerService } from '@/services/prayerService';
import { useQuery } from '@tanstack/react-query';
import { COLORS, SPACING } from '@/config/theme';
import { CheckCircle, Circle } from 'lucide-react-native';

export const ConfessionsScreen = () => {
  const { data: confessions } = useQuery({
    queryKey: ['globalConfessions'],
    queryFn: PrayerService.getGlobalConfessions,
  });

  const [spoken, setSpoken] = useState<Record<string, boolean>>({});

  // Load today's confession logs on mount
  useEffect(() => {
    const loadLogs = async () => {
      try {
        const logged = await PrayerService.getConfessionLogs(new Date());
        const map: Record<string, boolean> = {};
        logged.forEach((id) => {
          map[id] = true;
        });
        setSpoken(map);
      } catch (err) {
        console.error('Failed to load confession logs', err);
      }
    };
    loadLogs();
  }, []);

  const toggleSpoken = async (id: string) => {
    const newVal = !spoken[id];
    setSpoken((prev) => ({ ...prev, [id]: newVal }));

    if (newVal) {
      await PrayerService.logConfession(id);
    }
  };

  return (
    <Screen>
      <AppText variant='h1'>Declarations</AppText>
      <AppText style={{ marginBottom: SPACING.m }}>
        Tap to mark as spoken daily.
      </AppText>

      <FlatList
        data={confessions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isSpoken = spoken[item.id];
          return (
            <TouchableOpacity onPress={() => toggleSpoken(item.id)}>
              <Card
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: isSpoken
                    ? COLORS.accentLight
                    : COLORS.surface,
                }}
              >
                {isSpoken ? (
                  <CheckCircle color={COLORS.primary} size={24} />
                ) : (
                  <Circle color={COLORS.textSecondary} size={24} />
                )}
                <AppText
                  style={{
                    flex: 1,
                    marginLeft: SPACING.m,
                    color: isSpoken ? COLORS.primary : COLORS.text,
                  }}
                >
                  {item.text}
                </AppText>
              </Card>
            </TouchableOpacity>
          );
        }}
      />
    </Screen>
  );
};
