# CLAUDE.md - SecretPlace

## Project Overview

SecretPlace is a React Native / Expo prayer and journaling mobile app. It features guided prayer flows, confessions, journaling, liturgy building, and a smart prayer assistant (AI-powered, currently mocked).

## Tech Stack

- **Framework**: React Native with Expo SDK 50
- **Language**: TypeScript
- **Navigation**: React Navigation v6 (native-stack + bottom-tabs)
- **State Management**: Zustand
- **Backend**: Supabase (auth, database, RLS policies)
- **Data Fetching**: TanStack React Query v5
- **Validation**: Zod
- **Styling**: Custom theme system (`src/config/theme.ts`)

## Project Structure

```
src/
  components/     # Shared UI components (Button, Card, Input, Screen, AppText) + modals
  config/         # Theme configuration
  database/       # Supabase client + SQL schema
  features/       # Feature modules (auth, confessions, journal, prayer, settings)
  navigation/     # AuthNavigator, RootNavigator, TabNavigator
  services/       # Business logic services (AI, journal, liturgy, notifications, prayer, sound)
  store/          # Zustand stores (authStore, prayerFlowStore)
  types/          # Shared TypeScript types
  utils/          # Validation utilities
```

## Key Commands

```bash
npm install          # Install dependencies
npx expo start       # Start dev server
npx expo start --ios # iOS simulator
npx expo start --android # Android emulator
```

## Environment Setup

The app requires a `.env` file in the project root with Supabase credentials:

```
EXPO_PUBLIC_SUPABASE_URL=<supabase-project-url>
EXPO_PUBLIC_SUPABASE_ANON_KEY=<supabase-anon-key>
```

The `.env` file is gitignored and already configured locally.

## Database

- Supabase is used for auth and all data persistence
- Schema is defined in `src/database/schema.sql`
- Tables: profiles, prayer_points, prayer_flow_completions, confessions, confession_logs, journal_entries, reminder_settings
- All tables have Row Level Security (RLS) enabled
- A trigger auto-creates a profile row on user signup

## Architecture Notes

- Feature-based folder structure: each feature has its own `screens/` directory
- UI components are exported via barrel file (`src/components/ui/index.tsx`)
- The AI service (`src/services/aiService.ts`) is currently a mock — returns simulated responses with a delay
- Auth flow: `RootNavigator` switches between `AuthNavigator` (login/signup) and `TabNavigator` (main app) based on auth state
- Premium features are gated by the `is_premium` flag on the `profiles` table
