import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

export function Shimmer({
  style,
  baseColor = '#E9EAF0',
  highlightColor = 'rgba(255,255,255,.65)',
}: {
  style?: StyleProp<ViewStyle>;
  baseColor?: string;
  highlightColor?: string;
}) {
  const progress = useRef(new Animated.Value(0)).current;
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(progress, {
        toValue: 1,
        duration: 1150,
        useNativeDriver: true,
      }),
    );
    animation.start();
    return () => animation.stop();
  }, [progress]);

  return (
    <View
      onLayout={event => setWidth(event.nativeEvent.layout.width)}
      style={[s.root, { backgroundColor: baseColor }, style]}
    >
      {width > 0 && (
        <Animated.View
          style={[
            s.highlight,
            {
              width: Math.max(50, width * 0.42),
              backgroundColor: highlightColor,
              transform: [
                {
                  translateX: progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-width * 0.5, width],
                  }),
                },
              ],
            },
          ]}
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  root: { overflow: 'hidden' },
  highlight: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    opacity: 0.5,
    transform: [{ skewX: '-18deg' }],
  },
});
