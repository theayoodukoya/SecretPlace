# TODO - SecretPlace

## Backend & Infrastructure

- [ ] Run `src/database/schema.sql` against Supabase SQL Editor to initialize tables
- [ ] Set up Supabase CLI and link project (`npx supabase link --project-ref <id>`)
- [ ] Configure EAS Build for app deployment (`eas build:configure`)

## AI & Premium Features

- [ ] Replace mock AI service (`src/services/aiService.ts`) with real OpenAI API integration
- [ ] Add OpenAI API key to environment config
- [ ] Build premium upgrade flow / paywall UI

## Prayer Features

- [ ] Populate full 30-day prayer points in database (currently only sample daily points seeded)
- [ ] Add weekly prayer points seed data
- [ ] Implement Sanctuary Mode functionality (`SanctuaryModeScreen.tsx`)
- [ ] Complete Liturgy Builder feature (`LiturgyBuilderScreen.tsx`)
- [ ] Implement Rhythm Schedule feature (`RhythmScheduleScreen.tsx`)
- [ ] Add sound/ambient playback for prayer sessions (`soundService.ts`)

## Journal

- [ ] Add search/filter functionality to journal list
- [ ] Implement "answered prayer" marking flow with date tracking

## Notifications

- [ ] Test push notifications on real device
- [ ] Set up Expo push notification credentials in EAS dashboard
- [ ] Wire up reminder settings screen to `notificationService.ts`

## Auth & User Management

- [ ] Add password reset / forgot password flow
- [ ] Add profile editing screen (name, avatar)
- [ ] Add account deletion option in settings

## UI / UX Polish

- [ ] Add onboarding walkthrough for first-time users
- [ ] Add loading skeletons / shimmer states
- [ ] Add pull-to-refresh on list screens
- [ ] Add haptic feedback on key interactions
- [ ] Dark mode support

## Testing & Quality

- [ ] Add unit tests (Jest + React Native Testing Library)
- [ ] Add E2E tests (Detox or Maestro)
- [ ] Set up CI pipeline (GitHub Actions)
- [ ] Add ESLint + Prettier config
