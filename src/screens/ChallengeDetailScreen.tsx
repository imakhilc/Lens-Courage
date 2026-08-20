import React, { useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  Check,
  Clock3,
  Pencil,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react-native';
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
  const {
    challenges,
    user,
    localSessions,
    openingPhrase,
    chooseOpeningPhrase,
  } = useApp();
  const challenge = challenges.find(
    item => item.id === route.params?.challengeId,
  );
  const [customText, setCustomText] = useState(openingPhrase ?? '');
  const [editingCustom, setEditingCustom] = useState(false);
  if (!challenge)
    return (
      <SafeAreaView style={s.safe}>
        <Text style={s.error}>
          Challenge unavailable. Go back and try again.
        </Text>
      </SafeAreaView>
    );
  // const firstName = user?.displayName?.trim().split(/\s+/)[0];
  const phraseOptions = ['Hi guys', 'Hello everyone', 'Hey folks'];
  const phraseLocked =
    (user?.completedChallengeCount ?? 0) > 0 ||
    (user?.currentChallengeOrder ?? 1) > 1 ||
    localSessions.some(session => session.openingPhrase);
  const customConfirmed = Boolean(
    openingPhrase && !phraseOptions.includes(openingPhrase),
  );
  const confirmCustomPhrase = async () => {
    const phrase = customText.trim();
    if (!phrase) return;
    await chooseOpeningPhrase(phrase);
    setCustomText(phrase);
    setEditingCustom(false);
    Keyboard.dismiss();
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={s.safe}
    >
      <SafeAreaView edges={['left', 'right']} style={s.safe}>
        <ScreenNavigationBar
          label="CHALLENGE DETAILS"
          title={challenge.title}
          onBack={navigation.goBack}
        />
        <ScrollView
          contentContainerStyle={s.content}
          keyboardDismissMode="none"
          keyboardShouldPersistTaps="always"
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
          <Card style={s.openingCard}>
            <View style={s.openingHeading}>
              <View style={s.openingCopy}>
                <Text style={s.cardTitle}>Your signature opening</Text>
                <Text style={s.openingHelp}>
                  Start every video with the same phrase so your progress clips
                  can become one compilation later.
                </Text>
                <View style={s.openingWarning}>
                  <LockKeyhole color="#9D7010" size={14} strokeWidth={2.5} />
                  <Text style={s.openingWarningText}>
                    Choose carefully. You can edit this before your first take,
                    but it locks after completing Day 1.
                  </Text>
                </View>
              </View>
            </View>
            {phraseLocked ? (
              <View style={[s.phraseOption, s.phraseSelected, s.phraseLocked]}>
                <Text style={s.phraseSelectedText}>{openingPhrase}</Text>
                <Check color={colors.primary} size={18} strokeWidth={3} />
              </View>
            ) : (
              <View style={s.phraseList}>
                {phraseOptions.map(phrase => {
                  const selected = openingPhrase === phrase;
                  return (
                    <Pressable
                      accessibilityRole="radio"
                      accessibilityState={{ checked: selected }}
                      key={phrase}
                      onPress={() => {
                        setEditingCustom(false);
                        Keyboard.dismiss();
                        chooseOpeningPhrase(phrase);
                      }}
                      style={[s.phraseOption, selected && s.phraseSelected]}
                    >
                      <Text
                        style={
                          selected ? s.phraseSelectedText : s.phraseOptionText
                        }
                      >
                        {phrase}
                      </Text>
                      {selected && (
                        <Check
                          color={colors.primary}
                          size={18}
                          strokeWidth={3}
                        />
                      )}
                    </Pressable>
                  );
                })}
                {editingCustom ? (
                  <View style={[s.customInputRow, s.phraseSelected]}>
                    <TextInput
                      autoCapitalize="sentences"
                      autoFocus
                      maxLength={60}
                      onChangeText={setCustomText}
                      onSubmitEditing={confirmCustomPhrase}
                      placeholder="Type your opening phrase"
                      placeholderTextColor={colors.muted}
                      returnKeyType="done"
                      style={s.customInput}
                      value={customText}
                    />
                    <Pressable
                      accessibilityLabel="Confirm custom opening"
                      disabled={!customText.trim()}
                      hitSlop={8}
                      onPress={confirmCustomPhrase}
                      style={[
                        s.customConfirm,
                        !customText.trim() && s.customConfirmDisabled,
                      ]}
                    >
                      <Check color="white" size={18} strokeWidth={3} />
                    </Pressable>
                  </View>
                ) : customConfirmed ? (
                  <View style={[s.phraseOption, s.phraseSelected]}>
                    <Text style={s.phraseSelectedText}>{openingPhrase}</Text>
                    <Pressable
                      accessibilityLabel="Edit custom opening"
                      hitSlop={8}
                      onPress={() => {
                        setCustomText(openingPhrase ?? '');
                        setEditingCustom(true);
                      }}
                      style={s.customEdit}
                    >
                      <Pencil
                        color={colors.primary}
                        size={17}
                        strokeWidth={2.5}
                      />
                    </Pressable>
                  </View>
                ) : (
                  <Pressable
                    accessibilityRole="radio"
                    onPress={() => {
                      setCustomText('');
                      setEditingCustom(true);
                    }}
                    style={s.phraseOption}
                  >
                    <Text style={s.phraseOptionText}>Custom</Text>
                    <Pencil color={colors.muted} size={17} strokeWidth={2.5} />
                  </Pressable>
                )}
              </View>
            )}
          </Card>
          <Card style={s.rules}>
            <Text style={s.cardTitle}>Your rules</Text>
            {[
              `Begin with “${openingPhrase ?? 'your signature opening'}”.`,
              ...challenge.tips,
            ].map((tip, index) => (
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
                Choose a safe place and respect other people’s privacy. You
                never need to film strangers.
              </Text>
            </Card>
          )}
        </ScrollView>
        {!editingCustom && (
          <FloatingActionDock>
            <PrimaryButton
              label={openingPhrase ? 'Open camera' : 'Choose an opening phrase'}
              disabled={!openingPhrase}
              onPress={() =>
                navigation.navigate('Recording', {
                  challengeId: challenge.id,
                })
              }
            />
          </FloatingActionDock>
        )}
      </SafeAreaView>
    </KeyboardAvoidingView>
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
  metricText: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '900',
  },
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
  openingCard: { marginTop: 18 },
  openingHeading: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  openingIcon: {
    width: 38,
    height: 38,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primarySoft,
  },
  openingCopy: { flex: 1 },
  openingHelp: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.muted,
    marginTop: 3,
  },
  openingWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
    padding: 8,
    borderRadius: 10,
    backgroundColor: '#FFF7DC',
  },
  openingWarningText: {
    flex: 1,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '700',
    color: '#806019',
  },
  phraseList: { gap: 7, marginTop: 14 },
  phraseOption: {
    minHeight: 44,
    paddingHorizontal: 13,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F6F9',
    borderWidth: 1,
    borderColor: colors.border,
  },
  phraseSelected: {
    backgroundColor: colors.primarySoft,
    borderColor: '#CFC5FF',
  },
  phraseLocked: { marginTop: 14 },
  phraseOptionText: { fontSize: 14, fontWeight: '800', color: colors.ink },
  phraseSelectedText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '900',
    color: colors.primaryDark,
  },
  customInputRow: {
    minHeight: 50,
    paddingLeft: 13,
    paddingRight: 6,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
  customInput: {
    flex: 1,
    height: 48,
    paddingVertical: 0,
    fontSize: 14,
    fontWeight: '800',
    color: colors.ink,
  },
  customConfirm: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  customConfirmDisabled: { opacity: 0.4 },
  customEdit: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(114,89,255,.1)',
    marginRight: -7,
  },
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
