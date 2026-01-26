import React from 'react';
import {
  TextInput,
  View,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';
import { COLORS, SPACING } from '../../config/theme';
import { AppText } from './AppText';
import { Eye, EyeOff } from 'lucide-react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  style,
  secureTextEntry,
  ...props
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);
  const isPassword = secureTextEntry;

  return (
    <View style={styles.container}>
      {label && (
        <AppText variant='label' style={styles.label}>
          {label}
        </AppText>
      )}
      <View>
        <TextInput
          style={[
            styles.input,
            error ? styles.errorInput : null,
            style,
            { paddingRight: isPassword ? 50 : SPACING.m },
          ]}
          placeholderTextColor={COLORS.textSecondary}
          secureTextEntry={isPassword && !isPasswordVisible}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            style={styles.eyeIcon}
          >
            {isPasswordVisible ? (
              <EyeOff color={COLORS.textSecondary} size={20} />
            ) : (
              <Eye color={COLORS.textSecondary} size={20} />
            )}
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <AppText
          variant='caption'
          color={COLORS.error}
          style={{ marginTop: 4 }}
        >
          {error}
        </AppText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.m,
  },
  label: {
    marginBottom: SPACING.xs,
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  input: {
    backgroundColor: COLORS.surface,
    height: 50,
    borderRadius: 12,
    paddingHorizontal: SPACING.m,
    fontSize: 16,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  errorInput: {
    borderColor: COLORS.error,
  },
  eyeIcon: {
    position: 'absolute',
    right: SPACING.m,
    top: 15,
  },
});
