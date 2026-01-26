import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation/RootNavigator';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { LogBox } from 'react-native';

LogBox.ignoreLogs(['[expo-av]: Expo AV has been deprecated']);

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <RootNavigator />
        <StatusBar style='dark' />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
