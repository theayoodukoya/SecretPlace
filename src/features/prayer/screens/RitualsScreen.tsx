import React from 'react';
import { View, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Screen, AppText, Card } from '@/components/ui';
import { COLORS, SPACING } from '@/config/theme';
import { useQuery } from '@tanstack/react-query';
import { LiturgyService } from '@/services/liturgyService';
import { Plus, Play, Clock } from 'lucide-react-native';
import { format } from 'date-fns';

export const RitualsScreen = ({ navigation }: any) => {
  const { data: plans, isLoading } = useQuery({
    queryKey: ['rituals'],
    queryFn: LiturgyService.getMyPlans,
  });

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
        <View>
          <AppText variant='h1' style={{ marginBottom: 0 }}>
            Rituals
          </AppText>
          <AppText variant='caption'>Your secret place architectures</AppText>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate('LiturgyBuilder')}
          style={{
            backgroundColor: COLORS.primary,
            padding: SPACING.s,
            borderRadius: 50,
          }}
        >
          <Plus color={COLORS.textInverse} size={24} />
        </TouchableOpacity>
      </View>

      {isLoading && <AppText>Loading your rituals...</AppText>}

      {!isLoading && plans?.length === 0 && (
        <View style={{ alignItems: 'center', marginTop: SPACING.xl }}>
          <AppText color={COLORS.textSecondary}>
            You haven't created any rituals yet.
          </AppText>
          <AppText
            variant='label'
            color={COLORS.primary}
            style={{ marginTop: SPACING.m }}
            onPress={() => navigation.navigate('LiturgyBuilder')}
          >
            Create your first one
          </AppText>
        </View>
      )}

      <FlatList
        data={plans}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: SPACING.xxl }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('SanctuaryMode', { planId: item.id })
            }
          >
            <Card style={{ marginBottom: SPACING.m }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}
              >
                <View style={{ flex: 1 }}>
                  <AppText variant='h3'>{item.title}</AppText>
                  {item.description && (
                    <AppText
                      color={COLORS.textSecondary}
                      numberOfLines={2}
                      style={{ marginTop: 4 }}
                    >
                      {item.description}
                    </AppText>
                  )}

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: SPACING.s,
                    }}
                  >
                    <Clock size={14} color={COLORS.textTertiary} />
                    <AppText variant='caption' style={{ marginLeft: 4 }}>
                      {item.duration_minutes
                        ? `${item.duration_minutes}m`
                        : 'Flexible'}
                    </AppText>
                  </View>
                </View>

                <View
                  style={{
                    backgroundColor: COLORS.surfaceSecondary,
                    padding: 8,
                    borderRadius: 20,
                  }}
                >
                  <Play
                    size={20}
                    color={COLORS.primary}
                    fill={COLORS.primary}
                  />
                </View>
              </View>
            </Card>
          </TouchableOpacity>
        )}
      />
    </Screen>
  );
};
