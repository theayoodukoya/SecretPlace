import React from 'react';
import { View, Modal, StyleSheet } from 'react-native';
import { AppText, Button, Card } from '@/components/ui';
import { COLORS, SPACING } from '@/config/theme';
import { Bell } from 'lucide-react-native';

interface PermissionPrimeModalProps {
  visible: boolean;
  onGrant: () => void;
  onDecline: () => void;
}

export const PermissionPrimeModal: React.FC<PermissionPrimeModalProps> = ({
  visible,
  onGrant,
  onDecline,
}) => {
  return (
    <Modal visible={visible} transparent animationType='fade'>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.iconContainer}>
            <Bell
              color={COLORS.primary}
              size={32}
              fill={COLORS.surfaceSecondary}
            />
          </View>

          <AppText
            variant='h2'
            align='center'
            style={{ marginBottom: SPACING.s }}
          >
            Don't Miss Your Appointment
          </AppText>

          <AppText
            align='center'
            color={COLORS.textSecondary}
            style={{ marginBottom: SPACING.l }}
          >
            The secret place is easily crowded out by life. Allow notifications
            to gently nudge you when it's time to meet with God.
          </AppText>

          <Button title='Yes, Remind Me' onPress={onGrant} />
          <Button
            title="No, I'll Remember"
            variant='ghost'
            onPress={onDecline}
            style={{ marginTop: SPACING.s }}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: SPACING.l,
  },
  container: {
    backgroundColor: COLORS.surface,
    padding: SPACING.xl,
    borderRadius: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
});
