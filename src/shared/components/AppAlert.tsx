import React, { useImperativeHandle, useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { useTheme } from '@/shared/theme';
import AppButton from './AppButton';

type AlertButton = {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
};

interface AlertOptions {
  title: string;
  message?: string;
  buttons?: AlertButton[];
  cancelable?: boolean;
}

export interface AppAlertRef {
  alert: (title: string, message?: string, buttons?: AlertButton[], options?: { cancelable?: boolean }) => void;
}

export const appAlertRef = React.createRef<AppAlertRef>();

export default function AppAlert() {
  const { colors } = useTheme();
  const [visible, setVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState<AlertOptions | null>(null);

  useImperativeHandle(appAlertRef, () => ({
    alert: (title, message, buttons, options) => {
      setAlertConfig({
        title,
        message,
        buttons: buttons || [{ text: 'OK' }],
        cancelable: options?.cancelable ?? true,
      });
      setVisible(true);
    }
  }));

  const close = () => setVisible(false);

  if (!alertConfig) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={() => {
        if (alertConfig.cancelable) close();
      }}
    >
      <TouchableWithoutFeedback onPress={() => { if (alertConfig.cancelable) close(); }}>
        <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
          <TouchableWithoutFeedback>
            <View style={[styles.alertBox, { backgroundColor: colors.surfaceElevated, borderColor: colors.border }]}>
              <Text style={[styles.title, { color: colors.textPrimary }]}>{alertConfig.title}</Text>
              
              {!!alertConfig.message && (
                <Text style={[styles.message, { color: colors.textSecondary }]}>{alertConfig.message}</Text>
              )}
              
              <View style={styles.buttonContainer}>
                {alertConfig.buttons?.map((btn, index) => {
                  let variant: 'primary' | 'secondary' | 'danger' = 'primary';
                  if (btn.style === 'cancel') variant = 'secondary';
                  if (btn.style === 'destructive') variant = 'danger';

                  // if it's the only button, make it full width
                  const isSingle = alertConfig.buttons?.length === 1;

                  return (
                    <AppButton
                      key={index}
                      title={btn.text}
                      variant={variant}
                      onPress={() => {
                        close();
                        btn.onPress?.();
                      }}
                      style={[
                        styles.button,
                        !isSingle && index < (alertConfig.buttons?.length || 0) - 1 && { marginRight: 8 }
                      ]}
                    />
                  );
                })}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  alertBox: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
  }
});
