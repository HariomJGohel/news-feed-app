import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated, LayoutChangeEvent, Dimensions, PanResponder } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import IonIcon from '@react-native-vector-icons/ionicons';
import { useTheme } from '@/shared/theme';

const { width } = Dimensions.get('window');
const SLIDER_WIDTH = 40;

export default function AnimatedTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { colors, theme } = useTheme();

  // We need to calculate width of each tab based on the screen width
  const totalTabs = state.routes.length;
  const tabWidth = width / totalTabs;

  const slideAnim = useRef(
    new Animated.Value(state.index * tabWidth + tabWidth / 2 - SLIDER_WIDTH / 2),
  ).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: state.index * tabWidth + tabWidth / 2 - SLIDER_WIDTH / 2,
      useNativeDriver: true,
      tension: 70,
      friction: 11,
    }).start();
  }, [state.index, tabWidth]);

  return (
    <View style={[styles.tabBarContainer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
      <Animated.View
        style={[
          styles.activeSlider,
          {
            width: SLIDER_WIDTH,
            backgroundColor: colors.accent,
            transform: [{ translateX: slideAnim }]
          }
        ]}
      />
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        type IonIconName = React.ComponentProps<typeof IonIcon>['name'];
        let iconName: IonIconName = 'ellipse-outline';
        if (route.name === 'Feed') {
          iconName = isFocused ? 'newspaper' : 'newspaper-outline';
        } else if (route.name === 'Bookmarks') {
          iconName = isFocused ? 'bookmark' : 'bookmark-outline';
        }

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate({ name: route.name, merge: true } as any);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabItem}
            activeOpacity={0.8}
          >
            <Animated.View style={{ transform: [{ scale: isFocused ? 1.15 : 1 }] }}>
              <IonIcon
                name={iconName}
                size={24}
                color={isFocused ? colors.accent : colors.textSecondary}
              />
            </Animated.View>
            <Animated.Text
              style={[
                styles.tabLabel,
                { color: isFocused ? colors.accent : colors.textSecondary },
                { opacity: isFocused ? 1 : 0.8, fontWeight: isFocused ? '600' : '400' }
              ]}
            >
              {options.title !== undefined ? options.title : route.name}
            </Animated.Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    height: 70,
    borderTopWidth: 1,
    elevation: 8, // for Android shadow
    shadowColor: '#000', // for iOS shadow
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 10,
    zIndex: 1,
  },
  tabLabel: {
    fontSize: 11,
    marginTop: 4,
  },
  activeSlider: {
    position: 'absolute',
    top: 0,
    height: 3,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
    zIndex: 0,
  }
});
