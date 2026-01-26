import React, { useState } from 'react';
import { Alert } from 'react-native';
import { Screen, Input, Button, AppText } from '@/components/ui';
import { JournalService } from '@/services/journalService';
import { useQueryClient } from '@tanstack/react-query';

export const CreateJournalEntryScreen = ({ navigation }: any) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleSave = async () => {
    if (!body) return Alert.alert('Error', 'Journal entry cannot be empty');
    setLoading(true);
    try {
      await JournalService.createEntry(title, body);
      await queryClient.invalidateQueries({ queryKey: ['journal'] });
      navigation.goBack();
    } catch (e: any) {
      Alert.alert('Error', e.message);
    }
    setLoading(false);
  };

  return (
    <Screen>
      <AppText variant='h1'>New Entry</AppText>
      <Input
        placeholder='Title (Optional)'
        value={title}
        onChangeText={setTitle}
      />
      <Input
        placeholder='Write your prayer...'
        value={body}
        onChangeText={setBody}
        multiline
        numberOfLines={10}
        style={{ height: 200, textAlignVertical: 'top', paddingTop: 12 }}
      />
      <Button title='Save Entry' onPress={handleSave} loading={loading} />
    </Screen>
  );
};
