# Supabase Setup Guide

## 1. Get Your Credentials (Supabase Dashboard)

1.  Log in to [supabase.com/dashboard](https://supabase.com/dashboard).
2.  Open your project (create one if you haven't: name it "SecretPlace").
3.  Go to **Project Settings** (gear icon at bottom left) -> **API**.
4.  Find these two values:
    - `Project URL` (e.g., `https://xyz.supabase.co`)
    - `anon` public key (long string starting with `ey...`)

## 2. Configure Your `.env` File

You currently have `.env` open. Paste the values there:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project-url.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 3. Set Up Supabase CLI (For Pushing Changes)

To simulate a "CI/CD" flow where you push local schema changes to remote:

1.  **Login to CLI**:

    ```bash
    npx supabase login
    ```

    _(This will open your browser to authenticate)_

2.  **Link Project**:
    You need your **Project Reference ID**. It's the string part of your URL: `https://[PROJECT-ID].supabase.co`.

    ```bash
    npx supabase link --project-ref [YOUR-PROJECT-ID]
    ```

    _(Enter your database password when prompted)_

3.  **Push Schema**:
    We need to initialize the remote DB with your `schema.sql`.
    _Ref: `src/database/schema.sql`_
    ```bash
    npx supabase db push
    ```
    _(This applies your local migrations/schema to the remote database)_

## 4. Expo Setup (EAS)

To deploy your app remotely or build for stores, you use **EAS (Expo Application Services)**.

1.  **Install EAS CLI**:
    ```bash
    npm install -g eas-cli
    ```
2.  **Login**:
    ```bash
    eas login
    ```
3.  **Configure Project**:
    ```bash
    eas build:configure
    ```
