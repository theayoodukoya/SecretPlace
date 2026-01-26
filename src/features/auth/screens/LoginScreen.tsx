import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import { Screen, AppText, Button, Input } from '@/components/ui';
import { supabase } from '@/database/client';
import { useAuthStore } from '@/store/authStore';
import { COLORS, SPACING } from '@/config/theme';
import { loginSchema } from '@/utils/validation';

export const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const initialize = useAuthStore((state) => state.initialize);

  const handleLogin = async () => {
    // Zod Validation
    const validation = loginSchema.safeParse({ email, password });
    if (!validation.success) {
      return Alert.alert('Error', validation.error.errors[0].message);
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      Alert.alert('Login Failed', error.message);
    } else {
      await initialize(); // Refresh store
    }
    setLoading(false);
  };

  return (
    <Screen style={{ justifyContent: 'center' }}>
      <View style={{ marginBottom: SPACING.xl }}>
        <AppText variant='h1' align='center' color={COLORS.primary}>
          Welcome Back
        </AppText>
        <AppText align='center' variant='caption'>
          Enter your secret place
        </AppText>
      </View>

      <Input
        placeholder='Email'
        value={email}
        onChangeText={setEmail}
        autoCapitalize='none'
        keyboardType='email-address'
      />
      <Input
        placeholder='Password'
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button title='Sign In' onPress={handleLogin} loading={loading} />
      <Button
        title='Create Account'
        variant='secondary'
        onPress={() => navigation.navigate('SignUp')}
        style={{ marginTop: SPACING.m }}
      />
    </Screen>
  );
};
