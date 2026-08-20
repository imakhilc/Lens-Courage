import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Check } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, FloatingActionDock, PrimaryButton } from '../components/ui';
import { useApp } from '../app/AppProvider';
import { colors } from '../theme';

export function TakeAcceptedScreen({ navigation, route }: any) {
  const { challenges } = useApp();
  const challenge = challenges.find(
    item => item.id === route.params?.challengeId,
  );
  return (
    <SafeAreaView style={s.safe}>
      <View style={s.content}>
        <View style={s.check}>
          <Check size={46} color="white" strokeWidth={3} />
        </View>
        <Text style={s.eyebrow}>TAKE SAVED LOCALLY</Text>
        <Text style={s.title}>Challenge recorded!</Text>
        <Text style={s.copy}>
          Your “{challenge?.title}” take is safe on this device.
          Server-authoritative rewards and progression arrive in Milestone 3.
        </Text>
        <Card style={s.card}>
          <Text style={s.cardTitle}>What happens next</Text>
          <Text style={s.cardCopy}>
            AI failure will never block completion. Temporary audio-only
            coaching is added in Milestone 5; your raw video stays local by
            default.
          </Text>
        </Card>
      </View>
      <FloatingActionDock>
        <PrimaryButton
          label="Back to Today"
          onPress={() => navigation.navigate('Main')}
        />
      </FloatingActionDock>
    </SafeAreaView>
  );
}
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
  check: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.3,
    color: colors.primary,
    textAlign: 'center',
    marginTop: 22,
  },
  title: {
    fontSize: 34,
    fontWeight: '900',
    color: colors.ink,
    textAlign: 'center',
    marginTop: 8,
  },
  copy: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.muted,
    textAlign: 'center',
    marginTop: 10,
  },
  card: { marginTop: 22 },
  cardTitle: { fontSize: 17, fontWeight: '900', color: colors.ink },
  cardCopy: { fontSize: 13, lineHeight: 20, color: colors.muted, marginTop: 5 },
});
