# Secret Place - Setup Instructions

## Prerequisites

- Node.js > 18
- Expo CLI
- Supabase Account

## 1. Installation

Run the following in the project root:

```bash
npm install
```

## 2. Environment Setup

Create a `.env` file based on `.env.example`:

```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 3. Database Setup (Supabase)

1. Go to your Supabase Dashboard -> SQL Editor.
2. Copy the content of `src/database/schema.sql` and run it.
3. This will create all tables, RLS policies, and seed data.

## 4. Running the App

```bash
npx expo start
```

- Press `i` for iOS Simulator
- Press `a` for Android Emulator

## 5. Notes on Push Notifications

- Expo Notifications require a real device or a build for full functionality (especially regarding token generation).
- On Simulators, the `scheduleNotificationAsync` will fire locally, but remote triggers require setup in Expo Dashboard.

## 6. Premium Features

- "Smart Prayer Assistant" uses a stub service `src/services/aiService.ts`. Connect this to OpenAI API if needed later.
- Toggle premium status in the `profiles` table in Supabase manually to test UI changes.
