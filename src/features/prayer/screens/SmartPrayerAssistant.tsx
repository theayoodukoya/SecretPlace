import React, { useState } from 'react';
import { View, ActivityIndicator, Alert } from 'react-native';
import { Screen, AppText, Input, Button, Card } from '@/components/ui';
import { PrayerAiService } from '@/services/aiService';
import { COLORS, SPACING } from '@/config/theme';

export const SmartPrayerAssistant = () => {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<null | any>(null);

  const handleGenerate = async () => {
    if (!topic) return;
    setLoading(true);
    try {
      const data = await PrayerAiService.generatePrayer({ topic });
      setResult(data);
    } catch (e) {
      Alert.alert('Error', 'Failed to generate prayer');
    }
    setLoading(false);
  };

  return (
    <Screen>
      <AppText variant='h1'>Prayer Assistant</AppText>
      <AppText style={{ marginBottom: SPACING.m }}>
        What is on your heart today?
      </AppText>

      <Input
        placeholder='e.g. Anxiety about work...'
        value={topic}
        onChangeText={setTopic}
      />
      <Button
        title='Generate Prayer Plan'
        onPress={handleGenerate}
        loading={loading}
      />

      {result && (
        <View style={{ marginTop: SPACING.l }}>
          <AppText variant='h2'>Your Prayer</AppText>
          <Card>
            <AppText style={{ fontStyle: 'italic', marginBottom: SPACING.m }}>
              {result.prayer}
            </AppText>

            <AppText variant='h3'>Key Points</AppText>
            {result.points.map((p: string, i: number) => (
              <AppText key={i} style={{ marginTop: 4 }}>
                • {p}
              </AppText>
            ))}
          </Card>
        </View>
      )}
    </Screen>
  );
};
