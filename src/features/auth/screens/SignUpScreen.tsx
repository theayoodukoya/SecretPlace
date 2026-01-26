import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import { Screen, AppText, Button, Input } from '@/components/ui';
import { supabase } from '@/database/client';
import { COLORS, SPACING } from '@/config/theme';

export const SignUpScreen = ({ navigation }: any) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!email || !password || !name)
      return Alert.alert('Error', 'Please fill in all fields');
    setLoading(true);

    // Sign up with metadata for the profile trigger
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
      },
    });

    if (error) {
      Alert.alert('Sign Up Failed', error.message);
    } else {
      Alert.alert(
        'Success',
        'Please check your email to verify your account.',
        [{ text: 'OK', onPress: () => navigation.goBack() }],
      );
    }
    setLoading(false);
  };

  return (
    <Screen style={{ justifyContent: 'center' }}>
      <View style={{ marginBottom: SPACING.xl }}>
        <AppText variant='h1' align='center' color={COLORS.primary}>
          Join Us
        </AppText>
        <AppText align='center' variant='caption'>
          Start your prayer journey
        </AppText>
      </View>

      <Input placeholder='Full Name' value={name} onChangeText={setName} />
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

      <Button title='Sign Up' onPress={handleSignUp} loading={loading} />
      <Button
        title='Back to Login'
        variant='ghost'
        onPress={() => navigation.goBack()}
      />
    </Screen>
  );
};
