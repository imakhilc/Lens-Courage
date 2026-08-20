import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Clock3, ShieldCheck, Sparkles, Zap } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  BackButton,
  Card,
  FloatingActionDock,
  PrimaryButton,
} from '../components/ui';
import { useApp } from '../app/AppProvider';
import { colors } from '../theme';

export function ChallengeDetailScreen({ navigation, route }: any) {
  const { challenges } = useApp();
  const challenge = challenges.find(
    item => item.id === route.params?.challengeId,
  );
  if (!challenge)
    return (
      <SafeAreaView style={s.safe}>
        <Text style={s.error}>
          Challenge unavailable. Go back and try again.
        </Text>
      </SafeAreaView>
    );
  return (
    <SafeAreaView style={s.safe}>
      <ScrollView
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
      >
        <BackButton onPress={navigation.goBack} />
        <View style={s.pills}>
          <Text style={s.stage}>{challenge.stageName.toUpperCase()}</Text>
          <Text style={s.number}>CHALLENGE {challenge.order} OF 30</Text>
        </View>
        <Text style={s.title}>{challenge.title}</Text>
        <Text style={s.mission}>{challenge.fullPrompt}</Text>
        <View style={s.metrics}>
          <View style={s.metric}>
            <Clock3 color={colors.ink} size={16} strokeWidth={2.4} />
            <Text style={s.metricText}>{challenge.targetDurationSec} sec</Text>
          </View>
          <View style={s.metric}>
            <Zap color={colors.ink} size={16} strokeWidth={2.4} />
            <Text style={s.metricText}>+{challenge.rewardCP} CP</Text>
          </View>
        </View>
        {challenge.oneTakeBonus && (
          <Text style={s.bonus}>ONE-TAKE BONUS +5 CP</Text>
        )}
        <Card style={s.rules}>
          <Text style={s.cardTitle}>Your rules</Text>
          {challenge.tips.map((tip, index) => (
            <View key={tip} style={s.rule}>
              <Text style={s.ruleNumber}>{index + 1}</Text>
              <Text style={s.ruleText}>{tip}</Text>
            </View>
          ))}
        </Card>
        <Card style={s.info}>
          <Sparkles color={colors.primary} size={22} />
          <View style={s.infoCopy}>
            <Text style={s.infoTitle}>AI coach comes after you finish</Text>
            <Text style={s.infoText}>
              Completion never depends on feedback. Only temporary extracted
              audio will be uploaded.
            </Text>
          </View>
        </Card>
        {(challenge.outdoor || challenge.publicSpace) && (
          <Card style={s.safety}>
            <ShieldCheck color={colors.teal} size={22} />
            <Text style={s.safetyText}>
              Choose a safe place and respect other people’s privacy. You never
              need to film strangers.
            </Text>
          </Card>
        )}
      </ScrollView>
      <FloatingActionDock>
        <PrimaryButton
          label="Open camera"
          onPress={() =>
            navigation.navigate('Recording', { challengeId: challenge.id })
          }
        />
      </FloatingActionDock>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 100 },
  error: { padding: 24, color: colors.danger },
  pills: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  stage: {
    fontSize: 11,
    fontWeight: '900',
    color: colors.primary,
    backgroundColor: colors.primarySoft,
    padding: 8,
    borderRadius: 99,
  },
  number: { fontSize: 11, fontWeight: '900', color: colors.muted },
  title: {
    fontSize: 34,
    lineHeight: 39,
    fontWeight: '900',
    color: colors.ink,
    marginTop: 18,
  },
  mission: {
    fontSize: 20,
    lineHeight: 29,
    fontWeight: '700',
    color: colors.ink,
    marginTop: 12,
  },
  metrics: { flexDirection: 'row', gap: 8, marginTop: 18 },
  metric: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 99,
  },
  metricText: {fontSize: 13, lineHeight: 16, fontWeight: '800', color: colors.ink},
  bonus: {
    fontSize: 12,
    fontWeight: '900',
    color: '#9D7010',
    backgroundColor: '#FFF4CA',
    padding: 10,
    borderRadius: 12,
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  rules: { marginTop: 18 },
  cardTitle: { fontSize: 19, fontWeight: '900', color: colors.ink },
  rule: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 12 },
  ruleNumber: {
    width: 28,
    height: 28,
    borderRadius: 10,
    textAlign: 'center',
    textAlignVertical: 'center',
    backgroundColor: colors.primarySoft,
    color: colors.primary,
    fontWeight: '900',
  },
  ruleText: { flex: 1, fontSize: 14, lineHeight: 20, color: colors.ink },
  info: { flexDirection: 'row', gap: 12, marginTop: 10 },
  infoCopy: { flex: 1 },
  infoTitle: { fontSize: 15, fontWeight: '900', color: colors.ink },
  infoText: { fontSize: 12, lineHeight: 18, color: colors.muted, marginTop: 3 },
  safety: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 10,
  },
  safetyText: { flex: 1, fontSize: 12, lineHeight: 18, color: colors.muted },
});
