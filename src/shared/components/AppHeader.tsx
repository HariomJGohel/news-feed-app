import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import IonIcon from '@react-native-vector-icons/ionicons';
import { useTheme } from '@/shared/theme';
import { useNavigation } from '@react-navigation/native';

interface AppHeaderProps {
  title?: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
}

export default function AppHeader({ title, showBack = false, rightAction }: AppHeaderProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  return (
    <View style={[
      styles.headerContainer, 
      { 
        backgroundColor: colors.surface,
        borderBottomColor: colors.border,
        paddingTop: insets.top + 10,
      }
    ]}>
      <View style={styles.leftContainer}>
        {showBack && (
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            style={styles.backButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <IonIcon name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.titleContainer}>
        {title && (
          <Text style={[styles.title, { color: colors.textPrimary }]} numberOfLines={1}>
            {title}
          </Text>
        )}
      </View>
      
      <View style={styles.rightContainer}>
        {rightAction}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    paddingHorizontal: 16,
  },
  leftContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  backButton: {
    // padding for touch target
  },
  titleContainer: {
    flex: 3,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  rightContainer: {
    flex: 1,
    alignItems: 'flex-end',
  }
});
