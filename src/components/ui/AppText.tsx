import React from 'react';
import { Text, TextStyle, TextProps as RNTextProps } from 'react-native';
import { COLORS, SPACING } from '../../config/theme';

interface TextProps extends RNTextProps {
  children: React.ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'label';
  color?: string;
  align?: 'left' | 'center' | 'right';
}

export const AppText: React.FC<TextProps> = ({
  children,
  variant = 'body',
  color = COLORS.text,
  style,
  align = 'left',
  ...props
}) => {
  const getStyle = () => {
    switch (variant) {
      case 'h1':
        return { fontSize: 28, fontWeight: '700', marginBottom: SPACING.m };
      case 'h2':
        return { fontSize: 22, fontWeight: '600', marginBottom: SPACING.s };
      case 'h3':
        return { fontSize: 18, fontWeight: '600', marginBottom: SPACING.s };
      case 'caption':
        return { fontSize: 13, color: COLORS.textSecondary };
      case 'label':
        return {
          fontSize: 14,
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: 1,
        };
      default:
        return { fontSize: 16 };
    }
  };
  return (
    <Text
      style={[{ color, textAlign: align }, getStyle() as TextStyle, style]}
      {...props}
    >
      {children}
    </Text>
  );
};
