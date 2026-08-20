import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { BrandMark, PrimaryButton } from '../components/ui';
import { useApp } from '../app/AppProvider';
import { colors } from '../theme';
export function SplashScreen() {
  const { error, retry } = useApp();
  return (
    <View style={s.root}>
      <BrandMark size={66} />
      <Text style={s.title}>Lens Courage</Text>
      <Text style={s.copy}>{error ?? 'Preparing your next tiny rep…'}</Text>
      {error ? (
        <View style={s.retry}>
          <PrimaryButton label="Retry" onPress={retry} />
        </View>
      ) : (
        <ActivityIndicator color={colors.primary} size="large" />
      )}
    </View>
  );
}
const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  title: { fontSize: 29, fontWeight: '900', color: colors.ink, marginTop: 14 },
  copy: {
    fontSize: 15,
    color: colors.muted,
    marginVertical: 14,
    textAlign: 'center',
  },
  retry: { width: '100%', marginTop: 6 },
});
