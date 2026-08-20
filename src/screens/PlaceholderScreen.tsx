import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme';
import {
  PRIMARY_TAB_BAR_SPACE,
  PRIMARY_TAB_TOP_SPACE,
} from '../components/PrimaryTabBar';
export function PlaceholderScreen({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        s.root,
        {
          paddingTop: insets.top + PRIMARY_TAB_TOP_SPACE,
          paddingBottom: insets.bottom + PRIMARY_TAB_BAR_SPACE,
        },
      ]}
    >
      <Text style={s.eye}>YOUR JOURNEY</Text>
      <Text style={s.title}>{title}</Text>
      <View style={s.card}>
        <Text style={s.cardTitle}>Milestone 1 shell</Text>
        <Text style={s.copy}>{subtitle}</Text>
      </View>
    </View>
  );
}
const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
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
