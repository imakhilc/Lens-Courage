import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Clock3, ShieldCheck, Sparkles, Zap } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Card,
  FloatingActionDock,
  PrimaryButton,
  ScreenNavigationBar,
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
    <SafeAreaView edges={['left', 'right']} style={s.safe}>
      <ScreenNavigationBar
        label="CHALLENGE DETAILS"
        title={challenge.title}
        onBack={navigation.goBack}
      />
      <ScrollView
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.pills}>
          <Text style={s.stage}>{challenge.stageName.toUpperCase()}</Text>
          <Text style={s.number}>CHALLENGE {challenge.order} OF 30</Text>
        </View>
        <Text style={s.mission}>{challenge.fullPrompt}</Text>
        <View style={s.metrics}>
          <View style={[s.metric, s.timeMetric]}>
            <View style={[s.metricIcon, s.timeMetricIcon]}>
              <Clock3 color="#3568C7" size={17} strokeWidth={2.7} />
            </View>
            <Text style={[s.metricText, s.timeMetricText]}>
              {challenge.targetDurationSec} sec
            </Text>
          </View>
          <View style={[s.metric, s.cpMetric]}>
            <View style={[s.metricIcon, s.cpMetricIcon]}>
              <Zap color={colors.primaryDark} size={17} strokeWidth={2.8} />
            </View>
            <Text style={[s.metricText, s.cpMetricText]}>
              +{challenge.rewardCP} CP
            </Text>
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
  content: { paddingHorizontal: 16, paddingTop: 0, paddingBottom: 100 },
  error: { padding: 24, color: colors.danger },
  pills: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
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
  mission: {
    fontSize: 20,
    lineHeight: 29,
    fontWeight: '700',
    color: colors.ink,
    marginTop: 16,
  },
  metrics: { flexDirection: 'row', gap: 8, marginTop: 18 },
  metric: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minHeight: 42,
    paddingLeft: 6,
    paddingRight: 13,
    paddingVertical: 5,
    borderRadius: 99,
    borderWidth: 1,
  },
  metricIcon: {
    width: 30,
    height: 30,
    borderRadius: 99,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricText: { fontSize: 14, lineHeight: 18, fontWeight: '900' },
  timeMetric: { backgroundColor: '#EDF4FF', borderColor: '#D3E3FF' },
  timeMetricIcon: { backgroundColor: '#D9E8FF' },
  timeMetricText: { color: '#315FAF' },
  cpMetric: { backgroundColor: colors.primarySoft, borderColor: '#D7CEFF' },
  cpMetricIcon: { backgroundColor: '#DDD5FF' },
  cpMetricText: { color: colors.primaryDark },
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
