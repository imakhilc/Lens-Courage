import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BrandMark, Card } from '../components/ui';
import { GoogleIcon } from '../components/GoogleIcon';
import { useApp } from '../app/AppProvider';
import { colors } from '../theme';

export function LoginScreen() {
  const { error, signingIn, signInWithGoogle } = useApp();
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        <View style={styles.brand}>
          <BrandMark size={48} />
          <View style={styles.brandCopy}>
            <Text style={styles.brandName}>Lens Courage</Text>
            <Text style={styles.tagline}>ONE BRAVE REP AT A TIME</Text>
          </View>
        </View>

        <Text style={styles.title}>
          Your camera confidence starts with one tiny rep.
        </Text>
        <Text style={styles.subtitle}>
          Sign in to save your path, Courage Points, streak, and coach feedback
          securely.
        </Text>

        <Card style={styles.promiseCard}>
          <Text style={styles.promiseIcon}>🔒</Text>
          <View style={styles.promiseText}>
            <Text style={styles.promiseTitle}>Private practice</Text>
            <Text style={styles.promiseCopy}>
              No posting. No audience. Your raw video stays on your phone by
              default.
            </Text>
          </View>
        </Card>

        {error ? (
          <Text accessibilityRole="alert" style={styles.error}>
            {error}
          </Text>
        ) : null}
      </View>

      <View style={styles.actionDock}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Continue with Google"
          disabled={signingIn}
          onPress={signInWithGoogle}
          style={({ pressed }) => [
            styles.googleButton,
            pressed && styles.pressed,
            signingIn && styles.disabled,
          ]}
        >
          {signingIn ? (
            <ActivityIndicator color={colors.ink} />
          ) : (
            <GoogleIcon size={22} />
          )}
          <Text style={styles.googleLabel}>
            {signingIn ? 'Signing in…' : 'Continue with Google'}
          </Text>
        </Pressable>
        <Text style={styles.terms}>
          By continuing, you agree to use Lens Courage for private practice and
          progress tracking.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 16, paddingTop: 8 },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  brandCopy: { justifyContent: 'center' },
  brandName: {
    fontSize: 23,
    lineHeight: 28,
    fontWeight: '900',
    color: colors.ink,
  },
  tagline: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '800',
    color: colors.muted,
    letterSpacing: 0.6,
  },
  title: {
    fontSize: 34,
    lineHeight: 39,
    fontWeight: '900',
    color: colors.ink,
    letterSpacing: -1,
    marginTop: 38,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 23,
    color: colors.muted,
    marginTop: 12,
  },
  promiseCard: {
    marginTop: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  promiseIcon: { fontSize: 28 },
  promiseText: { flex: 1 },
  promiseTitle: { fontSize: 17, fontWeight: '900', color: colors.ink },
  promiseCopy: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.muted,
    marginTop: 4,
  },
  error: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.danger,
    backgroundColor: '#FFF0F1',
    borderRadius: 14,
    padding: 12,
    marginTop: 14,
  },
  actionDock: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 14,
    backgroundColor: colors.background,
  },
  googleButton: {
    height: 58,
    borderRadius: 18,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: '#DADDE6',
    borderBottomWidth: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  pressed: { transform: [{ translateY: 2 }], borderBottomWidth: 2 },
  disabled: { opacity: 0.6 },
  googleLabel: { fontSize: 17, fontWeight: '800', color: colors.ink },
  terms: {
    fontSize: 11,
    lineHeight: 15,
    color: colors.muted,
    textAlign: 'center',
    marginTop: 9,
  },
});
