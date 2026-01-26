import React from 'react';
import { FlatList, View, TouchableOpacity } from 'react-native';
import { Screen, AppText, Card } from '@/components/ui';
import { JournalService } from '@/services/journalService';
import { useQuery } from '@tanstack/react-query';
import { COLORS, SPACING } from '@/config/theme';
import { Plus } from 'lucide-react-native';
import { format } from 'date-fns';

export const JournalListScreen = ({ navigation }: any) => {
  const { data: entries, isLoading } = useQuery({
    queryKey: ['journal'],
    queryFn: JournalService.getEntries,
  });

  return (
    <Screen>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: SPACING.m,
        }}
      >
        <AppText variant='h1' style={{ marginBottom: 0 }}>
          Journal
        </AppText>
        <TouchableOpacity
          onPress={() => navigation.navigate('CreateJournalEntry')}
        >
          <Plus color={COLORS.primary} size={28} />
        </TouchableOpacity>
      </View>

      {isLoading && <AppText>Loading...</AppText>}

      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <AppText variant='label' color={COLORS.textSecondary}>
                {format(new Date(item.created_at), 'MMM d, yyyy')}
              </AppText>
              {item.status === 'answered' && (
                <AppText variant='label' color={COLORS.success}>
                  Answered
                </AppText>
              )}
            </View>
            {item.title && (
              <AppText variant='h3' style={{ marginTop: SPACING.s }}>
                {item.title}
              </AppText>
            )}
            <AppText
              numberOfLines={3}
              style={{ marginTop: SPACING.s, color: COLORS.textSecondary }}
            >
              {item.body}
            </AppText>
          </Card>
        )}
      />
    </Screen>
  );
};
