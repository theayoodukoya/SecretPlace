import React from 'react';
import { TouchableOpacity, View, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, SPACING, ALERTS } from '../../config/theme';

export const Card: React.FC<{
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
}> = ({ children, style, onPress }) => {
  const Container = onPress ? TouchableOpacity : View;
  return (
    // @ts-ignore
    <Container onPress={onPress} style={[styles.card, style]}>
      {children}
    </Container>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: SPACING.m,
    marginVertical: SPACING.s,
    ...ALERTS.shadow,
  },
});
