import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '../store/authStore';
import { AuthNavigator } from './AuthNavigator';
import { TabNavigator } from './TabNavigator';
import { PrayerFlowScreen } from '../features/prayer/screens/PrayerFlowScreen';
import { CreateJournalEntryScreen } from '../features/journal/screens/CreateJournalEntryScreen';
import { SmartPrayerAssistant } from '../features/prayer/screens/SmartPrayerAssistant';
import { RitualsScreen } from '../features/prayer/screens/RitualsScreen';
import { LiturgyBuilderScreen } from '../features/prayer/screens/LiturgyBuilderScreen';
import { SanctuaryModeScreen } from '../features/prayer/screens/SanctuaryModeScreen';
import { View, ActivityIndicator } from 'react-native';
import { COLORS } from '../config/theme';

const Stack = createNativeStackNavigator();

export const RootNavigator = () => {
  const { session, isLoading, initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, []);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: COLORS.background,
        }}
      >
        <ActivityIndicator color={COLORS.primary} size='large' />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {session ? (
          <>
            <Stack.Screen name='Main' component={TabNavigator} />
            <Stack.Screen
              name='PrayerFlow'
              component={PrayerFlowScreen}
              options={{ presentation: 'fullScreenModal' }}
            />
            <Stack.Screen
              name='CreateJournalEntry'
              component={CreateJournalEntryScreen}
              options={{ presentation: 'modal' }}
            />
            <Stack.Screen
              name='SmartPrayerAssistant'
              component={SmartPrayerAssistant}
            />
            <Stack.Screen name='Rituals' component={RitualsScreen} />
            <Stack.Screen
              name='LiturgyBuilder'
              component={LiturgyBuilderScreen}
              options={{ presentation: 'fullScreenModal' }}
            />
            <Stack.Screen
              name='SanctuaryMode'
              component={SanctuaryModeScreen}
              options={{ presentation: 'fullScreenModal', headerShown: false }}
            />
          </>
        ) : (
          <Stack.Screen name='Auth' component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
