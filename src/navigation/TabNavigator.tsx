import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '../features/prayer/screens/HomeScreen';
import { JournalListScreen } from '../features/journal/screens/JournalListScreen';
import { ConfessionsScreen } from '../features/confessions/screens/ConfessionsScreen';
import { SettingsScreen } from '../features/settings/screens/SettingsScreen';
import { COLORS } from '../config/theme';
import { Home, Book, Mic, User } from 'lucide-react-native';

const Tab = createBottomTabNavigator();

export const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.background,
          borderTopColor: COLORS.border,
          elevation: 0,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
      }}
    >
      <Tab.Screen
        name='Home'
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => <Home color={color} size={24} />,
          tabBarLabel: 'Prayer',
        }}
      />
      <Tab.Screen
        name='Journal'
        component={JournalListScreen}
        options={{
          tabBarIcon: ({ color }) => <Book color={color} size={24} />,
        }}
      />
      <Tab.Screen
        name='Confessions'
        component={ConfessionsScreen}
        options={{
          tabBarIcon: ({ color }) => <Mic color={color} size={24} />,
        }}
      />
      <Tab.Screen
        name='Settings'
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color }) => <User color={color} size={24} />,
        }}
      />
    </Tab.Navigator>
  );
};
