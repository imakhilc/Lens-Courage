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
import { cardShadow, colors, radii } from '../theme';

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
export function ScreenNavigationBar({
  label,
  title,
  onBack,
}: {
  label: string;
  title: string;
  onBack: () => void;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.screenNav, { paddingTop: insets.top + 6 }]}>
      <BackButton onPress={onBack} />
      <View style={styles.screenNavCopy}>
        <Text style={styles.screenNavLabel}>{label}</Text>
        <Text numberOfLines={1} style={styles.screenNavTitle}>
          {title}
        </Text>
      </View>
    </View>
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
    ...cardShadow,
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
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
  screenNav: {
    zIndex: 30,
    minHeight: 66,
    paddingHorizontal: 16,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    shadowColor: colors.ink,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 8,
    elevation: 7,
  },
  screenNavCopy: { flex: 1 },
  screenNavLabel: {
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '900',
    letterSpacing: 1.15,
    color: colors.primary,
  },
  screenNavTitle: {
    marginTop: 1,
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '900',
    color: colors.ink,
  },
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
    backgroundColor: 'transparent',
  },
  track: {
    height: 10,
    borderRadius: 99,
    backgroundColor: '#E7E8EE',
    overflow: 'hidden',
  },
  fill: { height: '100%', borderRadius: 99, backgroundColor: colors.primary },
});
