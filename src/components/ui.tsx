import React, { PropsWithChildren } from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { colors, radii } from '../theme';

export function BrandMark({ size = 42 }: { size?: number }) {
  return (
    <View
      style={[
        styles.mark,
        { width: size, height: size, borderRadius: size * 0.32 },
      ]}
    >
      <View
        style={[styles.lens, { width: size * 0.44, height: size * 0.44 }]}
      />
      <View style={styles.spark} />
    </View>
  );
}
export function Card({
  children,
  style,
}: PropsWithChildren<{ style?: StyleProp<ViewStyle> }>) {
  return <View style={[styles.card, style]}>{children}</View>;
}
export function BackButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Go back"
      hitSlop={8}
      onPress={onPress}
      style={({ pressed }) => [
        styles.backButton,
        pressed && styles.backButtonPressed,
      ]}
    >
      <ChevronLeft color={colors.ink} size={24} strokeWidth={2.5} />
    </Pressable>
  );
}
export function PrimaryButton({
  label,
  onPress,
  disabled = false,
  variant = 'primary',
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'inverted';
}) {
  const inverted = variant === 'inverted';
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        inverted && styles.invertedButton,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}
    >
      <Text style={[styles.buttonText, inverted && styles.invertedButtonText]}>
        {label}
      </Text>
    </Pressable>
  );
}
export function FloatingActionDock({ children }: PropsWithChildren) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.dock, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      {children}
    </View>
  );
}
export function ProgressBar({ progress }: { progress: number }) {
  return (
    <View style={styles.track}>
      <View
        style={[
          styles.fill,
          { width: `${Math.max(0, Math.min(1, progress)) * 100}%` },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mark: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  lens: { borderRadius: 999, borderWidth: 4, borderColor: colors.surface },
  spark: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.yellow,
    right: 8,
    top: 8,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    shadowColor: colors.ink,
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonPressed: { opacity: 0.65 },
  button: {
    height: 58,
    borderRadius: radii.button,
    backgroundColor: colors.primary,
    borderBottomWidth: 5,
    borderBottomColor: colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  invertedButton: {
    backgroundColor: colors.surface,
    borderBottomColor: '#DED8FA',
  },
  invertedButtonText: { color: colors.primaryDark },
  pressed: { transform: [{ translateY: 2 }], borderBottomWidth: 3 },
  disabled: { opacity: 0.42 },
  buttonText: { color: colors.surface, fontSize: 17, fontWeight: '800' },
  dock: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 8,
    backgroundColor: colors.background,
  },
  track: {
    height: 10,
    borderRadius: 99,
    backgroundColor: '#E7E8EE',
    overflow: 'hidden',
  },
  fill: { height: '100%', borderRadius: 99, backgroundColor: colors.primary },
});
