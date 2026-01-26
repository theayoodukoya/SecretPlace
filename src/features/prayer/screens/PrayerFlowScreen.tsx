import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Screen, AppText, Button, Card } from '@/components/ui';
import { COLORS, SPACING } from '@/config/theme';
import { PrayerService } from '@/services/prayerService';
import { useQuery } from '@tanstack/react-query';
import { X } from 'lucide-react-native';

const STEPS = ['Thanksgiving', 'Confession', 'Prayer Points', 'Declarations'];

export const PrayerFlowScreen = ({ navigation }: any) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const currentStep = STEPS[currentStepIndex];

  const { data: points } = useQuery({
    queryKey: ['dailyPoints'],
    queryFn: () => PrayerService.getDailyPoints(new Date()),
  });

  const { data: confessions } = useQuery({
    queryKey: ['globalConfessions'],
    queryFn: PrayerService.getGlobalConfessions,
  });

  const handleNext = async () => {
    await PrayerService.markStepComplete(currentStep);
    if (currentStepIndex < STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      navigation.goBack();
    }
  };

  const renderContent = () => {
    switch (currentStep) {
      case 'Thanksgiving':
        return (
          <View>
            <AppText variant='h2' style={{ marginBottom: SPACING.m }}>
              Enter His gates with thanksgiving
            </AppText>
            <AppText style={{ lineHeight: 24 }}>
              Take a moment to thank God for:
              {'\n'}• The gift of life
              {'\n'}• His mercy and grace
              {'\n'}• Family and friends
              {'\n'}• His provision
            </AppText>
          </View>
        );
      case 'Confession':
        return (
          <View>
            <AppText variant='h2'>Wash me clean</AppText>
            <AppText style={{ marginBottom: SPACING.m }}>
              "If we confess our sins, He is faithful and just to forgive us..."
              (1 John 1:9)
            </AppText>
            <AppText>
              Take a moment to silently confess any weight, sin, or anxiety to
              the Lord.
            </AppText>
          </View>
        );
      case 'Prayer Points':
        return (
          <View>
            <AppText variant='h2'>Intercession</AppText>
            {points?.length === 0 && (
              <AppText>No specific points for today. Pray as led.</AppText>
            )}
            {points?.map((point, index) => (
              <Card key={point.id} style={{ marginTop: SPACING.m }}>
                <AppText variant='h3' color={COLORS.primary}>
                  {point.title}
                </AppText>
                <AppText style={{ marginVertical: SPACING.s }}>
                  {point.content}
                </AppText>
                {point.scripture && (
                  <AppText variant='caption' style={{ fontStyle: 'italic' }}>
                    {point.scripture}
                  </AppText>
                )}
              </Card>
            ))}
          </View>
        );
      case 'Declarations':
        return (
          <View>
            <AppText variant='h2'>Speak Life</AppText>
            <ScrollView style={{ height: 300 }}>
              {confessions?.map((confession, i) => (
                <View
                  key={i}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: SPACING.s,
                  }}
                >
                  <View
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: COLORS.accent,
                      marginRight: SPACING.s,
                    }}
                  />
                  <AppText>{confession.text}</AppText>
                </View>
              ))}
            </ScrollView>
          </View>
        );
    }
  };

  return (
    <Screen style={{ backgroundColor: COLORS.background }}>
      <View style={styles.header}>
        <AppText variant='label' color={COLORS.primary}>
          Step {currentStepIndex + 1} of 4
        </AppText>
        <X color={COLORS.text} size={24} onPress={() => navigation.goBack()} />
      </View>

      <View style={{ flex: 1, justifyContent: 'center' }}>
        {renderContent()}
      </View>

      <Button
        title={currentStepIndex === STEPS.length - 1 ? 'Finish' : 'Next Step'}
        onPress={handleNext}
        style={{ marginBottom: SPACING.l }}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.m,
  },
});
