import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChartNoAxesColumnIncreasing,
  Home,
  Route as RouteIcon,
  UserRound,
} from 'lucide-react-native';
import { colors } from '../theme';

const TAB_BAR_WIDTH = 270;
const TAB_BAR_HEIGHT = 69;
const BAR_BORDER = 1;
const INDICATOR_SIZE = 52;
const tabDetails = {
  Today: { Icon: Home, label: 'Today' },
  Path: { Icon: RouteIcon, label: 'Path' },
  Progress: { Icon: ChartNoAxesColumnIncreasing, label: 'Progress' },
  Me: { Icon: UserRound, label: 'Me' },
} as const;

export const PRIMARY_TAB_BAR_SPACE = 92;
export const PRIMARY_TAB_TOP_SPACE = 8;

export function PrimaryTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { width: windowWidth } = useWindowDimensions();
  const barWidth = Math.min(TAB_BAR_WIDTH, windowWidth - 32);
  const position = useRef(new Animated.Value(state.index)).current;
  const slotWidth = (barWidth - BAR_BORDER * 2) / state.routes.length;
  const indicatorLeft = BAR_BORDER + (slotWidth - INDICATOR_SIZE) / 2;

  useEffect(() => {
    Animated.spring(position, {
      toValue: state.index,
      stiffness: 300,
      damping: 28,
      mass: 0.72,
      useNativeDriver: true,
    }).start();
  }, [position, state.index]);

  return (
    <View
      pointerEvents="box-none"
      style={[styles.positioner, { bottom: Math.max(insets.bottom, 10) }]}
    >
      <View style={[styles.bar, { width: barWidth }]}>
        <Animated.View
          pointerEvents="none"
          style={[
            styles.indicator,
            {
              left: indicatorLeft,
              transform: [
                { translateX: Animated.multiply(position, slotWidth) },
              ],
            },
          ]}
        />
        {state.routes.map((route, index) => {
          const selected = state.index === index;
          const details = tabDetails[route.name as keyof typeof tabDetails];
          const options = descriptors[route.key].options;
          const label = options.tabBarAccessibilityLabel || details.label;
          return (
            <Pressable
              key={route.key}
              accessibilityRole="tab"
              accessibilityLabel={label}
              accessibilityState={{ selected }}
              onPress={() => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });
                if (!selected && !event.defaultPrevented)
                  navigation.navigate(route.name, route.params);
              }}
              onLongPress={() =>
                navigation.emit({ type: 'tabLongPress', target: route.key })
              }
              style={({ pressed }) => [
                styles.action,
                pressed && styles.pressed,
              ]}
            >
              <AnimatedTabIcon Icon={details.Icon} selected={selected} />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function AnimatedTabIcon({
  Icon,
  selected,
}: {
  Icon: typeof Home;
  selected: boolean;
}) {
  const progress = useRef(new Animated.Value(selected ? 1 : 0)).current;
  useEffect(() => {
    Animated.spring(progress, {
      toValue: selected ? 1 : 0,
      stiffness: 340,
      damping: 24,
      mass: 0.6,
      useNativeDriver: true,
    }).start();
  }, [progress, selected]);
  return (
    <Animated.View
      style={{
        opacity: progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0.72, 1],
        }),
        transform: [
          {
            scale: progress.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 1.1],
            }),
          },
        ],
      }}
    >
      <Icon
        size={22}
        strokeWidth={selected ? 2.5 : 2}
        color={selected ? colors.primaryDark : colors.muted}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  positioner: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 30,
    alignItems: 'center',
  },
  bar: {
    height: TAB_BAR_HEIGHT,
    borderRadius: TAB_BAR_HEIGHT / 2,
    backgroundColor: colors.surface,
    borderWidth: BAR_BORDER,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: colors.ink,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.075,
    shadowRadius: 14,
    elevation: 5,
  },
  indicator: {
    position: 'absolute',
    top: (TAB_BAR_HEIGHT - INDICATOR_SIZE) / 2,
    width: INDICATOR_SIZE,
    height: INDICATOR_SIZE,
    borderRadius: INDICATOR_SIZE / 2,
    backgroundColor: colors.primarySoft,
  },
  action: {
    flex: 1,
    height: INDICATOR_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.62 },
});
