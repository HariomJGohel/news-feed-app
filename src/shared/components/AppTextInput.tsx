import React from 'react';
import { View, TextInput, TextInputProps, StyleSheet, Animated } from 'react-native';
import IonIcon from '@react-native-vector-icons/ionicons';
import { useTheme } from '@/shared/theme';

type IonIconName = React.ComponentProps<typeof IonIcon>['name'];

interface AppTextInputProps extends TextInputProps {
  icon?: IonIconName;
  error?: string;
}

export default function AppTextInput({ icon, error, style, ...rest }: AppTextInputProps) {
  const { colors } = useTheme();
  const [isFocused, setIsFocused] = React.useState(false);
  
  const borderColor = error ? colors.error : isFocused ? colors.accent : colors.border;
  
  return (
    <View style={styles.container}>
      <View 
        style={[
          styles.inputContainer, 
          { backgroundColor: colors.surface, borderColor },
          style
        ]}
      >
        {icon && (
          <IonIcon 
            name={icon} 
            size={20} 
            color={isFocused ? colors.accent : colors.textMuted} 
            style={styles.icon} 
          />
        )}
        <TextInput
          style={[styles.input, { color: colors.textPrimary }]}
          placeholderTextColor={colors.textMuted}
          onFocus={(e) => {
            setIsFocused(true);
            rest.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            rest.onBlur?.(e);
          }}
          {...rest}
        />
      </View>
      {error && (
        <Animated.Text style={[styles.errorText, { color: colors.error }]}>
          {error}
        </Animated.Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: '100%',
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  }
});
