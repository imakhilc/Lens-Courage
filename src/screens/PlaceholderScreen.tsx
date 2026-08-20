import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme';
export function PlaceholderScreen({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <SafeAreaView style={s.root}>
      <Text style={s.eye}>YOUR JOURNEY</Text>
      <Text style={s.title}>{title}</Text>
      <View style={s.card}>
        <Text style={s.cardTitle}>Milestone 1 shell</Text>
        <Text style={s.copy}>{subtitle}</Text>
      </View>
    </SafeAreaView>
  );
}
const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  eye: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.4,
  },
  title: { fontSize: 32, fontWeight: '900', color: colors.ink, marginTop: 6 },
  card: {
    marginTop: 18,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 24,
    borderColor: colors.border,
    borderWidth: 1,
  },
  cardTitle: { fontSize: 20, fontWeight: '900', color: colors.ink },
  copy: { fontSize: 15, lineHeight: 22, color: colors.muted, marginTop: 6 },
});
