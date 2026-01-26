import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  StyleSheet,
} from 'react-native';
import { COLORS, SPACING } from '../../config/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  loading,
  style,
  textStyle,
}) => {
  const getBg = () => {
    if (variant === 'primary') return COLORS.primary; // Replaced gold with primary for stronger CTA
    if (variant === 'secondary') return 'transparent';
    return 'transparent';
  };
  const getBorder = () =>
    variant === 'secondary' ? COLORS.primary : 'transparent';
  const getText = () => {
    if (variant === 'primary') return '#FFF';
    if (variant === 'secondary') return COLORS.primary;
    return COLORS.text;
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading}
      style={[
        styles.button,
        {
          backgroundColor: getBg(),
          borderColor: getBorder(),
          borderWidth: variant === 'secondary' ? 1 : 0,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={getText()} />
      ) : (
        <Text style={[styles.buttonText, { color: getText() }, textStyle]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.l,
    marginVertical: SPACING.s,
  },
  buttonText: {
    fontWeight: '600',
    fontSize: 16,
  },
});
