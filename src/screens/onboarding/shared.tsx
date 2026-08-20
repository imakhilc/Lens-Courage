import React, { PropsWithChildren } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { BackButton, ProgressBar } from '../../components/ui';
import { colors } from '../../theme';

export function OnboardingLayout({
  step,
  eyebrow,
  title,
  subtitle,
  children,
}: PropsWithChildren<{
  step: 1 | 2 | 3;
  eyebrow: string;
  title: string;
  subtitle: string;
}>) {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.stepRow}>
          <BackButton onPress={navigation.goBack} />
          <Text style={styles.step}>{step} OF 3</Text>
        </View>
        <ProgressBar progress={step / 3} />
        <Text style={styles.eyebrow}>{eyebrow}</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}
export const onboardingStyles = StyleSheet.create({
  option: {
    minHeight: 68,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 9,
    padding: 13,
  },
  selected: {
    borderColor: colors.primary,
    borderWidth: 2,
    backgroundColor: '#F8F6FF',
  },
  emoji: { fontSize: 27 },
  optionText: { flex: 1 },
  optionTitle: { fontSize: 17, fontWeight: '800', color: colors.ink },
  optionSubtitle: { fontSize: 13, color: colors.muted, marginTop: 2 },
  check: {
    width: 27,
    height: 27,
    borderRadius: 14,
    backgroundColor: colors.teal,
    color: 'white',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontWeight: '900',
  },
});
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 16, paddingTop: 10, paddingBottom: 92 },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  step: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.muted,
    letterSpacing: 1,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.muted,
    letterSpacing: 1.5,
    marginTop: 16,
  },
  title: {
    fontSize: 30,
    lineHeight: 35,
    fontWeight: '900',
    color: colors.ink,
    marginTop: 8,
    letterSpacing: -0.7,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.muted,
    marginTop: 7,
    marginBottom: 18,
  },
});
