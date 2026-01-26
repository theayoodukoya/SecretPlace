import React, { useEffect } from 'react';
import { View, TouchableOpacity, Alert } from 'react-native';
import { Screen, AppText, Button } from '@/components/ui';
import { COLORS, SPACING } from '@/config/theme';
import { usePrayerFlowStore } from '@/store/prayerFlowStore';
import { LiturgyService } from '@/services/liturgyService';
import { SoundService } from '@/services/soundService';
import { X, Play, Pause, ChevronRight, ChevronLeft } from 'lucide-react-native';
import { useQuery } from '@tanstack/react-query';

export const SanctuaryModeScreen = ({ navigation, route }: any) => {
  const { planId } = route.params;
  const {
    activePlan,
    activeSteps,
    currentStepIndex,
    isPaused,
    remainingSeconds,
    startFlow,
    nextStep,
    previousStep,
    togglePause,
    setRemainingSeconds,
    endFlow,
  } = usePrayerFlowStore();

  // Fetch plan details
  useQuery({
    queryKey: ['plan', planId],
    queryFn: async () => {
      const plans = await LiturgyService.getMyPlans();
      const plan = plans.find((p) => p.id === planId);
      const steps = await LiturgyService.getPlanSteps(planId);
      if (plan && steps) {
        startFlow(plan, steps);
        SoundService.loadAmbient();
      }
      return { plan, steps };
    },
  });

  // Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (!isPaused && remainingSeconds !== null && remainingSeconds > 0) {
      interval = setInterval(() => {
        setRemainingSeconds(remainingSeconds - 1);
      }, 1000);
    } else if (remainingSeconds === 0) {
      // Auto advance or sound chime? For now, just pause
      togglePause();
    }
    return () => clearInterval(interval);
  }, [isPaused, remainingSeconds]);

  // Audio Integration
  useEffect(() => {
    return () => {
      SoundService.stopAll();
    };
  }, []);

  useEffect(() => {
    if (activeSteps.length > 0) {
      SoundService.playChime();
    }
  }, [currentStepIndex]);

  const currentStep = activeSteps[currentStepIndex];

  const formatTime = (seconds: number | null) => {
    if (seconds === null) return '∞';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleClose = () => {
    Alert.alert(
      'End Prayer?',
      'Are you sure you want to leave the sanctuary?',
      [
        { text: 'Stay', style: 'cancel' },
        {
          text: 'End',
          style: 'destructive',
          onPress: () => {
            endFlow();
            navigation.goBack();
          },
        },
      ],
    );
  };

  if (!activePlan || !currentStep)
    return (
      <Screen>
        <AppText>Entering Sanctuary...</AppText>
      </Screen>
    );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#000',
        padding: SPACING.l,
        paddingTop: 60,
      }}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <TouchableOpacity onPress={handleClose}>
          <X color='#666' size={28} />
        </TouchableOpacity>
        <AppText color='#666' variant='caption'>
          {activePlan.title} • {currentStepIndex + 1}/{activeSteps.length}
        </AppText>
        <View style={{ width: 28 }} />
      </View>

      {/* Main Content */}
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <AppText
          color={COLORS.accent}
          variant='label'
          style={{ marginBottom: SPACING.m }}
        >
          {currentStep.title.toUpperCase()}
        </AppText>

        {currentStep.body && (
          <AppText
            variant='h2'
            color='#FFF'
            align='center'
            style={{ marginBottom: SPACING.xl }}
          >
            {currentStep.body}
          </AppText>
        )}

        <AppText
          style={{
            fontSize: 64,
            fontWeight: '700',
            color: '#FFF',
            fontVariant: ['tabular-nums'],
          }}
        >
          {formatTime(remainingSeconds)}
        </AppText>
      </View>

      {/* Controls */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          marginBottom: SPACING.xl,
        }}
      >
        <TouchableOpacity
          onPress={previousStep}
          disabled={currentStepIndex === 0}
        >
          <ChevronLeft
            color={currentStepIndex === 0 ? '#333' : '#FFF'}
            size={32}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={togglePause}
          style={{
            width: 72,
            height: 72,
            borderRadius: 36,
            backgroundColor: COLORS.surfaceSecondary,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {isPaused ? (
            <Play fill='#000' size={32} />
          ) : (
            <Pause fill='#000' size={32} />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={nextStep}
          disabled={currentStepIndex === activeSteps.length - 1}
        >
          <ChevronRight
            color={
              currentStepIndex === activeSteps.length - 1 ? '#333' : '#FFF'
            }
            size={32}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};
