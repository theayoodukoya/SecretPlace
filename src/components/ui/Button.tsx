import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  StyleSheet,
  View,
} from 'react-native';
import { COLORS, SPACING } from '../../config/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  loading,
  style,
  textStyle,
  icon,
}) => {
  const getBg = () => {
    if (variant === 'primary') return COLORS.primary;
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
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {icon && <View style={{ marginRight: 8 }}>{icon}</View>}
          <Text style={[styles.buttonText, { color: getText() }, textStyle]}>
            {title}
          </Text>
        </View>
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
