import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Alert, Modal } from 'react-native';
import { Screen, AppText, Input, Button, Card } from '@/components/ui';
import { COLORS, SPACING } from '@/config/theme';
import { Trash, Clock, Plus, X } from 'lucide-react-native';
import { LiturgyService } from '@/services/liturgyService';
import { useQueryClient } from '@tanstack/react-query';

export const LiturgyBuilderScreen = ({ navigation }: any) => {
  // Plan State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [steps, setSteps] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Step Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState({
    title: '',
    body: '',
    duration: '5', // minutes string
  });

  const queryClient = useQueryClient();

  const addStep = () => {
    if (!currentStep.title)
      return Alert.alert('Error', 'Step title is required');

    setSteps([
      ...steps,
      {
        title: currentStep.title,
        body: currentStep.body,
        duration_seconds: currentStep.duration
          ? parseInt(currentStep.duration) * 60
          : null,
        type: 'text',
      },
    ]);
    setCurrentStep({ title: '', body: '', duration: '5' });
    setModalVisible(false);
  };

  const removeStep = (index: number) => {
    const newSteps = [...steps];
    newSteps.splice(index, 1);
    setSteps(newSteps);
  };

  const handleSave = async () => {
    if (!title) return Alert.alert('Error', 'Please give your ritual a title');
    if (steps.length === 0)
      return Alert.alert('Error', 'Please add at least one step');

    setLoading(true);
    try {
      await LiturgyService.createPlan(title, description, steps);
      await queryClient.invalidateQueries({ queryKey: ['rituals'] });
      Alert.alert('Success', 'Ritual created successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e: any) {
      Alert.alert('Error', e.message);
    }
    setLoading(false);
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <AppText variant='h2'>New Ritual</AppText>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <X color={COLORS.text} />
          </TouchableOpacity>
        </View>

        <Input
          label='Title'
          placeholder='e.g., Morning Warfare'
          value={title}
          onChangeText={setTitle}
          style={{ marginTop: SPACING.m }}
        />

        <Input
          label='Description (Optional)'
          placeholder='What is this for?'
          value={description}
          onChangeText={setDescription}
        />

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: SPACING.l,
            marginBottom: SPACING.s,
          }}
        >
          <AppText variant='h3'>The Flow</AppText>
          <AppText variant='caption' color={COLORS.textSecondary}>
            {steps.length} steps •{' '}
            {steps.reduce((acc, s) => acc + (s.duration_seconds || 0), 0) / 60}m
            total
          </AppText>
        </View>

        {steps.map((step, index) => (
          <Card key={index} style={{ marginBottom: SPACING.s }}>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                      backgroundColor: COLORS.surfaceSecondary,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: SPACING.s,
                    }}
                  >
                    <AppText variant='label' style={{ fontSize: 10 }}>
                      {index + 1}
                    </AppText>
                  </View>
                  <AppText variant='h3'>{step.title}</AppText>
                </View>
                {step.body ? (
                  <AppText
                    color={COLORS.textSecondary}
                    numberOfLines={1}
                    style={{ marginTop: 4, marginLeft: 32 }}
                  >
                    {step.body}
                  </AppText>
                ) : null}
              </View>

              <View style={{ alignItems: 'flex-end' }}>
                <TouchableOpacity
                  onPress={() => removeStep(index)}
                  style={{ padding: 4 }}
                >
                  <Trash size={18} color={COLORS.textTertiary} />
                </TouchableOpacity>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 8,
                  }}
                >
                  <Clock size={14} color={COLORS.primary} />
                  <AppText
                    variant='label'
                    color={COLORS.primary}
                    style={{ marginLeft: 4 }}
                  >
                    {step.duration_seconds
                      ? `${step.duration_seconds / 60}m`
                      : '∞'}
                  </AppText>
                </View>
              </View>
            </View>
          </Card>
        ))}

        <Button
          title='Add Step'
          variant='secondary'
          onPress={() => setModalVisible(true)}
          icon={<Plus size={20} color={COLORS.primary} />}
          style={{ marginTop: SPACING.s }}
        />
      </ScrollView>

      <View style={{ position: 'absolute', bottom: 40, left: 20, right: 20 }}>
        <Button title='Create Ritual' onPress={handleSave} loading={loading} />
      </View>

      {/* ADD STEP MODAL */}
      <Modal
        visible={modalVisible}
        animationType='slide'
        presentationStyle='pageSheet'
      >
        <View
          style={{
            flex: 1,
            padding: SPACING.l,
            backgroundColor: COLORS.background,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: SPACING.l,
            }}
          >
            <AppText variant='h2'>Add Step</AppText>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <AppText color={COLORS.primary}>Cancel</AppText>
            </TouchableOpacity>
          </View>

          <Input
            label='Step Title'
            placeholder='e.g., Thanksgiving'
            value={currentStep.title}
            onChangeText={(t) => setCurrentStep({ ...currentStep, title: t })}
          />

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: SPACING.m,
            }}
          >
            <AppText>Duration (minutes)</AppText>
            <Input
              value={currentStep.duration}
              onChangeText={(t) =>
                setCurrentStep({ ...currentStep, duration: t })
              }
              keyboardType='numeric'
              style={{ width: 100, textAlign: 'center' }}
            />
          </View>

          <Input
            label='Notes / Guide (Optional)'
            placeholder='Describe what to pray for here...'
            value={currentStep.body}
            onChangeText={(t) => setCurrentStep({ ...currentStep, body: t })}
            multiline
            numberOfLines={4}
            style={{ height: 100 }}
          />

          <Button
            title='Add to Flow'
            onPress={addStep}
            style={{ marginTop: SPACING.l }}
          />
        </View>
      </Modal>
    </Screen>
  );
};
