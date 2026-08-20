import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowRight, Camera } from 'lucide-react-native';
import {
  BrandMark,
  Card,
  FloatingActionDock,
  PrimaryButton,
} from '../../components/ui';
import { colors } from '../../theme';

export function WelcomeScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        <View style={styles.brand}>
          <BrandMark size={48} />
          <View>
            <Text style={styles.brandName}>Lens Courage</Text>
            <Text style={styles.tag}>ONE BRAVE REP AT A TIME</Text>
          </View>
        </View>
        <Text style={styles.title}>
          Get comfortable on camera, one tiny challenge at a time.
        </Text>
        <Text style={styles.subtitle}>
          No posting. No audience. Just small daily reps that get a little
          braver.
        </Text>
        <Card style={styles.hero}>
          <View style={styles.dayRange}>
            <Text style={styles.eyebrow}>DAY 1</Text>
            <ArrowRight color={colors.primary} size={15} strokeWidth={3} />
            <Text style={styles.eyebrow}>DAY 30</Text>
          </View>
          <Text style={styles.heroTitle}>Bedroom to{`\n`}public vlog.</Text>
          <Text style={styles.heroCopy}>
            The app increases difficulty one safe step at a time.
          </Text>
          <View style={styles.camera}>
            <Camera color={colors.surface} size={48} strokeWidth={2.4} />
          </View>
        </Card>
        <View style={styles.benefits}>
          {[
            ['🔒', 'Private reps'],
            ['⚡', 'Daily path'],
            ['✨', 'AI coach'],
          ].map(([icon, label]) => (
            <Card key={label} style={styles.benefit}>
              <Text style={styles.icon}>{icon}</Text>
              <Text style={styles.benefitText}>{label}</Text>
            </Card>
          ))}
        </View>
        <Text style={styles.privacy}>
          Your video stays on your phone by default. Only temporary audio is
          used for coach feedback.
        </Text>
      </View>
      <FloatingActionDock>
        <PrimaryButton
          label="Start my first rep"
          onPress={() => navigation.navigate('Comfort')}
        />
      </FloatingActionDock>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 92 },
  brand: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  brandName: { fontSize: 23, fontWeight: '900', color: colors.ink },
  tag: { fontSize: 10, fontWeight: '800', color: colors.muted, marginTop: 1 },
  title: {
    fontSize: 31,
    lineHeight: 36,
    fontWeight: '900',
    color: colors.ink,
    marginTop: 28,
    letterSpacing: -0.8,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.muted,
    marginTop: 10,
  },
  hero: {
    height: 202,
    marginTop: 18,
    backgroundColor: '#F1EDFF',
    overflow: 'hidden',
  },
  dayRange: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  eyebrow: {
    fontSize: 12,
    lineHeight: 15,
    fontWeight: '900',
    color: colors.primary,
    letterSpacing: 1.3,
  },
  heroTitle: {
    fontSize: 25,
    lineHeight: 29,
    fontWeight: '900',
    color: colors.ink,
    marginTop: 8,
  },
  heroCopy: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.muted,
    width: '52%',
    marginTop: 6,
  },
  camera: {
    position: 'absolute',
    right: 22,
    bottom: 34,
    width: 94,
    height: 94,
    borderRadius: 47,
    backgroundColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  benefits: { flexDirection: 'row', gap: 7, marginTop: 10 },
  benefit: { flex: 1, padding: 8, alignItems: 'center', borderRadius: 18 },
  icon: { fontSize: 19 },
  benefitText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.ink,
    marginTop: 4,
  },
  privacy: {
    fontSize: 10,
    lineHeight: 14,
    color: colors.muted,
    textAlign: 'center',
    marginTop: 8,
  },
});
